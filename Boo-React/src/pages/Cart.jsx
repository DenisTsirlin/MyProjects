import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import styled from 'styled-components';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import { Add, Remove, ShoppingCartOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { popularProducts } from '../data';

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${props => props.type === 'filled' && 'none'};
  background-color: ${props => props.type === 'filled' ? 'black' : 'transparent'};
  color: ${props => props.type === 'filled' && 'white'};
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
`;

const Hr = styled.hr`
  background-color: black;
  border: none;
  height: 1px;
  margin: 20px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${props => props.type === 'total' && '500'};
  font-size: ${props => props.type === 'total' && '24px'};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(0); // State variable to keep track of the number of items in the cart
    const shippingCost = 20;

    useEffect(() => {
        const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
        const updatedCart = cartItems.map(cartItem => {
            const product = popularProducts.find(product => product.id === cartItem.id);
            return {
                ...product,
                quantity: cartItem.quantity,
                selectedColor: cartItem.selectedColor,
                selectedSize: cartItem.selectedSize
            };
        });
        setCart(updatedCart);
        // Calculate total number of items in the cart
        const totalCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalCount);
    }, []);

    const removeFromCart = (index) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
        // Update cart item count
        const totalCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalCount);
    };

    const decreaseQuantity = (index) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity--;
            setCart(updatedCart);
            sessionStorage.setItem('cart', JSON.stringify(updatedCart));
            // Update cart item count
            const totalCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
            setCartItemCount(totalCount);
        }
    };

    const increaseQuantity = (index) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity++;
        setCart(updatedCart);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
        // Update cart item count
        const totalCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalCount);
    };

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const subtotal = totalPrice;
    const shippingDiscount = subtotal >= 50 ? -shippingCost : 0;
    const totalOrderAmount = subtotal + shippingCost + shippingDiscount;

    return (
        <Container>
            <Announcement />
            <Navbar cartItemCount={cartItemCount} /> {/* Pass cart item count to the Navbar */}
            <Wrapper>
                <Title>YOUR BAG</Title>
                <Top>
                    <TopButton onClick={() => navigate('/ProductList', { state: {} })}>
                        CONTINUE SHOPPING
                    </TopButton>
                </Top>
                <Bottom>
                    <Info>
                        {cart.map((item, index) => (
                            <div key={index}>
                                <Product>
                                    <ProductDetail>
                                        <Image src={item.img} />
                                        <Details>
                                            <ProductName>
                                                <b>Product: {item.title}</b>
                                            </ProductName>
                                            <ProductColor color={item.selectedColor} />
                                            <ProductSize>
                                                <b>Size:</b> {item.selectedSize}
                                            </ProductSize>
                                        </Details>
                                    </ProductDetail>
                                    <PriceDetail>
                                        <ProductAmountContainer>
                                            <Remove
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => decreaseQuantity(index)}
                                            />
                                            <ProductAmount>{item.quantity}</ProductAmount>
                                            <Add
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => increaseQuantity(index)}
                                            />
                                        </ProductAmountContainer>
                                        <ProductPrice>${item.price * item.quantity}</ProductPrice>
                                        <button onClick={() => removeFromCart(index)}>Remove</button>
                                    </PriceDetail>
                                </Product>
                                <Hr />
                            </div>
                        ))}
                    </Info>
                    <Summary>
                        <SummaryTitle>ORDER SUMMARY</SummaryTitle>
                        <SummaryItem>
                            <SummaryItemText>Subtotal</SummaryItemText>
                            <SummaryItemPrice>${subtotal}</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Shipping</SummaryItemText>
                            <SummaryItemPrice>${shippingCost}</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Shipping Discount</SummaryItemText>
                            <SummaryItemPrice>${shippingDiscount}</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem type="total">
                            <SummaryItemText>Total</SummaryItemText>
                            <SummaryItemPrice>${totalOrderAmount}</SummaryItemPrice>
                        </SummaryItem>
                    </Summary>
                </Bottom>
            </Wrapper>
            <Footer />
        </Container>
    );
}
