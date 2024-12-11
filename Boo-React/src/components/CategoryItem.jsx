import styled from "styled-components";
import React from 'react';
import { useNavigate } from 'react-router-dom';


const Container = styled.div`
flex: 1;
margin: 3px;
height: 70vh;
position: relative;
`;

const Image = styled.img`
    witdth: 100%;
   height: 100%;
   object-fit: cover;
`;

const Info = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 72%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h1`
color: white;
margin-bottom: 20px;
color:black;
`;
const Button = styled.button`
    border: none;
    padding: 10px;
    background-color: white;
    color: gray;
    cursor: pointer;
    font-weight: 600;
    
`;



const CategoryItem = ({ item }) => {
    const navigate = useNavigate();

    return (
        <Container>
            <Image src={item.img} />
            <Info>
                <Title>{item.title}</Title>
                <Button onClick={() => navigate('/ProductList')}>SHOP NOW</Button>
            </Info>
        </Container>
    )
}

export default CategoryItem
