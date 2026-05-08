import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './catalog.scss'

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/category/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    };

    const buildUrl = () => {
        const url = new URL('http://127.0.0.1:8000/product/');
        
        if (searchTerm.trim()) {
            url.searchParams.append('search', searchTerm);
        }
        
        if (selectedCategory) {
            url.searchParams.append('category', selectedCategory);
        }
        
        let ordering = sortBy;
        if (sortOrder === 'desc') {
            ordering = `-${sortBy}`;
        }
        url.searchParams.append('ordering', ordering);
        
        return url.toString();
    };

    const fetchProducts = async (url = null) => {
        try {
            const requestUrl = url || buildUrl();
            const response = await axios.get(requestUrl);

            if (response.data.results && Array.isArray(response.data.results)) {
                setProducts(response.data.results);
                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
            } else if (Array.isArray(response.data)) {
                setProducts(response.data);
                setNextPage(null);
                setPrevPage(null);
            } else {
                console.error('Неизвестный формат данных:', response.data);
                setProducts([]);
                setNextPage(null);
                setPrevPage(null);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            setProducts([]);
            setNextPage(null);
            setPrevPage(null);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [searchTerm, selectedCategory, sortBy, sortOrder]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        if (value === 'price_asc') {
            setSortBy('sale_price');
            setSortOrder('asc');
        } else if (value === 'price_desc') {
            setSortBy('sale_price');
            setSortOrder('desc');
        } else if (value === 'name_asc') {
            setSortBy('name');
            setSortOrder('asc');
        } else if (value === 'name_desc') {
            setSortBy('name');
            setSortOrder('desc');
        } else {
            setSortBy('id');
            setSortOrder('asc');
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setSortBy("id");
        setSortOrder("asc");
    };

    return (
        <div className="catalog-container">
            <div className="filters-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск товаров по названию..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="clear-search">
                            ✕
                        </button>
                    )}
                </div>

                <div className="category-filter">
                    <select 
                        value={selectedCategory} 
                        onChange={handleCategoryChange}
                        className="category-select"
                    >
                        <option value="">Все категории</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="sort-filter">
                    <select 
                        value={`${sortBy}_${sortOrder}`} 
                        onChange={handleSortChange}
                        className="sort-select"
                    >
                        <option value="id_asc">По умолчанию</option>
                        <option value="name_asc">По названию (А-Я)</option>
                        <option value="name_desc">По названию (Я-А)</option>
                        <option value="price_asc">По цене (сначала дешевые)</option>
                        <option value="price_desc">По цене (сначала дорогие)</option>
                    </select>
                </div>

                {(searchTerm || selectedCategory || sortBy !== "id" || sortOrder !== "asc") && (
                    <button onClick={clearFilters} className="clear-filters-btn">
                        Сбросить все
                    </button>
                )}
            </div>

            <div className="products-grid">
                {products.length === 0 ? (
                    <div className="no-results">
                        <p>Товары не найдены</p>
                        <button onClick={clearFilters} className="reset-btn">
                            Показать все товары
                        </button>
                    </div>
                ) : (
                    products.map(product => (
                        <Link
                            key={product.id}
                            to={`/catalog/product/${product.id}`}
                            className="card-product souvenir-card"
                        >
                            <div className="souvenir-card__image-wrapper">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    loading="lazy" 
                                />
                            </div>
                            <div className="product-info souvenir-card__info">
                                <h3 className="product-name souvenir-card__title">
                                    {product.name}
                                </h3>
                                <section className="prices souvenir-card__prices">
                                    <span className="old-price souvenir-card__old-price">
                                        <strike>{product.out_price} ₽</strike>
                                    </span>
                                    <span className="new-price souvenir-card__new-price">
                                        {product.sale_price} ₽
                                    </span>
                                </section>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {(nextPage || prevPage) && products.length > 0 && (
                <div className="pagination souvenir-pagination">
                    <button
                        className="souvenir-pagination__button"
                        onClick={() => fetchProducts(prevPage)}
                        disabled={!prevPage}
                    >
                        ← Назад
                    </button>
                    <button
                        className="souvenir-pagination__button"
                        onClick={() => fetchProducts(nextPage)}
                        disabled={!nextPage}
                    >
                        Вперед →
                    </button>
                </div>
            )}
        </div>
    );
}

export default Catalog;