import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./profile.scss";

const Profile = () => {
    const [profile, setProfile] = useState({ bio: '', avatar_url: '', banner_url: '', nickname: '' });
    const [editing, setEditing] = useState(false);
    const [newAvatar, setNewAvatar] = useState(null);
    const [newBanner, setNewBanner] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        axios.get('http://127.0.0.1:8000/profile/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setProfile({
                    bio: response.data.profile?.bio || '',
                    avatar_url: response.data.profile?.avatar_url,
                    banner_url: response.data.profile?.banner_url,
                    nickname: response.data.nickname || 'Пользователь'
                });
            })
            .catch(error => {
                console.error('Ошибка при загрузке профиля:', error);
            });
    }, []);

    const handleAvatarChange = e => {
        if (e.target.files[0]) {
            setNewAvatar(e.target.files[0]);
            const previewUrl = URL.createObjectURL(e.target.files[0]);
            setProfile(prev => ({
                ...prev,
                avatar_url: previewUrl
            }));
        }
    };

    const handleBannerChange = e => {
        if (e.target.files[0]) {
            setNewBanner(e.target.files[0]);
            const previewUrl = URL.createObjectURL(e.target.files[0]);
            setProfile(prev => ({
                ...prev,
                banner_url: previewUrl
            }));
        }
    };

    const applyChanges = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();

            if (newAvatar) {
                formData.append('avatar', newAvatar);
            }
            if (newBanner) {
                formData.append('banner', newBanner);
            }
            if (profile.bio) {
                formData.append('bio', profile.bio);
            }

            await axios.put('http://127.0.0.1:8000/profile/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setNewAvatar(null);
            setNewBanner(null);
            setEditing(false);
            
            alert('Профиль обновлен');
        } catch (err) {
            console.error("Ошибка при сохранении изменений:", err);
            alert('Ошибка при сохранении');
        }
    };

    return (
        <div className="profile-container souvenir-profile">
            <div className="banner-section souvenir-profile__banner">
                {profile.banner_url ? (
                    <img src={profile.banner_url} alt="Баннер" className="banner-image souvenir-profile__banner-image" />
                ) : (
                    <div className="banner-placeholder souvenir-profile__banner-placeholder">Баннер не установлен</div>
                )}

                {editing && (
                    <label className="edit-banner-btn souvenir-profile__edit-btn souvenir-profile__edit-btn--banner">
                        ✏️
                        <input type="file" accept="image/*" onChange={handleBannerChange} style={{ display: 'none' }} />
                    </label>
                )}
            </div>

            <div className="avatar-section souvenir-profile__avatar-section">
                <div className="avatar-wrapper souvenir-profile__avatar-wrapper">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Аватар" className="avatar-image souvenir-profile__avatar-image" />
                    ) : (
                        <div className="avatar-placeholder souvenir-profile__avatar-placeholder">Аватар</div>
                    )}

                    {editing && (
                        <label className="edit-avatar-btn souvenir-profile__edit-btn souvenir-profile__edit-btn--avatar">
                            ✏️
                            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                        </label>
                    )}
                </div>

                <h2 className="nickname souvenir-profile__nickname">{profile.nickname}</h2>
            </div>

            <div className="bio-section souvenir-profile__bio">
                <h3>О себе:</h3>
                {editing ? (
                    <textarea
                        value={profile.bio || ''}
                        onChange={(e) => setProfile(prev => ({
                            ...prev,
                            bio: e.target.value
                        }))}
                        rows="4"
                        className="bio-textarea souvenir-profile__textarea"
                        placeholder="Расскажите о себе..." />
                ) : (
                    <p className="bio-text souvenir-profile__bio-text"> {profile.bio || 'Нет информации о себе'} </p>
                )}
            </div>

            <div className="controls-section souvenir-profile__controls">
                {editing ? (
                    <div className="edit-controls souvenir-profile__edit-controls">
                        <button onClick={applyChanges} className="apply-btn souvenir-profile__apply-btn">Применить</button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                setNewAvatar(null);
                                setNewBanner(null);

                                const token = localStorage.getItem('access_token');
                                axios.get('http://127.0.0.1:8000/profile/', {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                })
                                    .then(response => {
                                        setProfile({
                                            bio: response.data.profile?.bio || '',
                                            avatar_url: response.data.profile?.avatar_url,
                                            banner_url: response.data.profile?.banner_url,
                                            nickname: response.data.nickname || 'Пользователь'
                                        });
                                    });
                            }} className="cancel-btn souvenir-profile__cancel-btn">Отмена</button>
                    </div>
                ) : (
                    <button onClick={() => setEditing(true)} className="edit-btn souvenir-profile__edit-profile-btn">Изменить профиль</button>
                )}
            </div>

            {editing && (newAvatar || newBanner) && (
                <div className="files-info souvenir-profile__files-info">
                    {newAvatar && <p>Новый аватар: {newAvatar.name}</p>}
                    {newBanner && <p>Новый баннер: {newBanner.name}</p>}
                </div>
            )}
        </div>
    );
};

export default Profile;