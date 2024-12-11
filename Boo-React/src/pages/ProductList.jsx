import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import Products from '../components/Products';
import NewsLetter from '../components/NewsLetter';

const Container = styled.div``;

const Title = styled.h1`
    margin: 20px;
`;

const FilterContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Filter = styled.div`
    margin: 20px;
`;

const FilterText = styled.span`
    font-size: 20px;
    font-weight: 600;
    margin-right: 20px;
`;

const Select = styled.select`
    padding: 10px;
    margin-right: 20px;
`;

const Option = styled.option`
    padding: 10px;
`;

const categories = ['All', 'Tshirt', 'Pants', 'Hat', 'Gown', 'Kirtle']; // Define categories here

export default function ProductList() {
    const [cartItemCount, setCartItemCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
        const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalCount);
    }, []);

    return (
        <Container>
            <Navbar cartItemCount={cartItemCount} />
            <Announcement />
            <Title>Dresses</Title>
            <FilterContainer>
                <Filter>
                    <FilterText>Sort Products:</FilterText>
                    
                    <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map(category => (
                            <Option key={category} value={category}>{category}</Option>
                        ))}
                    </Select>
                </Filter>
            </FilterContainer>
            <Products selectedCategory={selectedCategory} />
            <NewsLetter />
            <Footer />
        </Container>
    );
}
