import React from 'react';
import styled from 'styled-components';
import { popularProducts } from '../data';
import Product from './Product';

const Container = styled.div`
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Products = ({ selectedCategory }) => {
    // Filter products based on the selected category
    const filteredProducts = selectedCategory === 'All'
        ? popularProducts
        : popularProducts.filter(product => product.name === selectedCategory);

    return (
        <Container>
            {filteredProducts.map(item => (
                <Product item={item} key={item.id} />
            ))}
        </Container>
    );
}

export default Products;
