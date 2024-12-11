import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import NewsLetter from '../components/NewsLetter';
import Footer from '../components/Footer';
import { Add, Remove } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';


const Container = styled.div`

`;

const Wrapper = styled.div`
    display: flex;
    padding: 50px;
`;

const ImageContainer = styled.div`
    flex: 1;

`;
const Image = styled.img`
    width: 100%;
    height: 90vh;
    object-fit: cover;
`;

const InfoContainer = styled.div`
    flex: 1;
    padding: 0px 50px;
`;

const Title = styled.h1`
    font-weight: 200;
`;

const Desc = styled.p`
    margin: 20px 0;
`;

const Price = styled.span`
    font-weight: 100;
    font-size: 40px;
`;

const FilterContainer = styled.div`
    width: 50%;
    display: flex;
    justify-content: space-between;
`;

const Filter = styled.div`
    display: flex;
    align-items: center;
`;

const FilterTitle = styled.span`
    font-size: 20px;
    font-weight: 200;
`;

const FilterColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;  
    background-color: ${props => props.color};
    margin: 0px 5px;
    cursor: pointer;
`;

const FilterSize = styled.select`
    margin-left: 10px;
    padding: 5px;
`;

const FilterSizeOption = styled.option`
    font-size: 15px;
    
`;


const AddContainer = styled.div`
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 50px;
`;

const AmountContainer = styled.div`
    display: flex;
    align-items: center;
    font-weight: 700;
`;

const Amount = styled.span`
    width: 30px;
    height: 30px;
    border: 1px solid teal;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 5px;
`;

const Button = styled.button`
    padding: 15px;
    border: 2px solid teal;
    background-color: white;
    cursor: pointer;
    font-weight: 500;

&:hover{
    background-color: #f8f4f4;
}`;



export default function Product() {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("XS");
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state || {};
    const product = locationState.product;
  
    const increaseQuantity = () => {
      setQuantity(prevQuantity => prevQuantity + 1);
    };
  
    const decreaseQuantity = () => {
      if (quantity > 1) {
        setQuantity(prevQuantity => prevQuantity - 1);
      }
    };
  
    const addToCart = () => {
      if (!selectedColor) {
        alert("Please select color");
        return;
      }
      
      const newCartItem = {
        id: product.id,
        title: product.title,
        img: product.img,
        price: product.price,
        quantity,
        selectedColor,
        selectedSize
      };
  
      const existingCartItemsString = sessionStorage.getItem('cart');
      let existingCartItems = [];
      
      if (existingCartItemsString) {
        try {
          existingCartItems = JSON.parse(existingCartItemsString);
          if (!Array.isArray(existingCartItems)) {
            console.error('Existing cart items is not an array:', existingCartItems);
            return;
          }
        } catch (error) {
          console.error('Error parsing existing cart items:', error);
          return;
        }
      }
      
      const updatedCartItems = [...existingCartItems, newCartItem];
      
      sessionStorage.setItem('cart', JSON.stringify(updatedCartItems));
      
      navigate('/Cart');
    };
    
    

    return (
        <Container>
            <Navbar />
            <Announcement />
            <Wrapper>
                <ImageContainer>
                    <Image src={product.img} />
                </ImageContainer>
                <InfoContainer>
                    <Title>{product.title}</Title>
                    <Price>${product.price}</Price>
                    <FilterContainer>
                        <Filter>
                            <FilterTitle>Color</FilterTitle>
                            <FilterColor color='black' onClick={() => setSelectedColor('black')} />
                            <FilterColor color='darkblue' onClick={() => setSelectedColor('darkblue')} />
                            <FilterColor color='gray' onClick={() => setSelectedColor('gray')} />
                        </Filter>

                        <Filter>
                            <FilterTitle>Size</FilterTitle>
                            <FilterSize value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                                <FilterSizeOption value="XS">XS</FilterSizeOption>
                                <FilterSizeOption value="S">S</FilterSizeOption>
                                <FilterSizeOption value="M">M</FilterSizeOption>
                                <FilterSizeOption value="L">L</FilterSizeOption>
                                <FilterSizeOption value="XL">XL</FilterSizeOption>
                            </FilterSize>
                        </Filter>
                    </FilterContainer>
                    <AddContainer>
                        <AmountContainer>
                            <Remove style={{ cursor: 'pointer' }} onClick={decreaseQuantity} />
                            <Amount>{quantity}</Amount>
                            <Add style={{ cursor: 'pointer' }} onClick={increaseQuantity} />
                        </AmountContainer>
                        <Button onClick={addToCart}>ADD TO CART</Button>
                    </AddContainer>
                </InfoContainer>
            </Wrapper>
            <NewsLetter />
            <Footer />
        </Container>
    )
}
