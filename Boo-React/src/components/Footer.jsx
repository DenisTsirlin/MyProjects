import React from 'react'
import { Facebook, Instagram, MailOutlined, Phone, Pinterest, Room, Twitter } from "@mui/icons-material";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';


const Container = styled.div`
    display: flex;
`;

const Left = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const Logo = styled.h1``;

const Desc = styled.p`
    margin: 20px 0px;
    font-size: 12px;
    color: #777;
    text-align: justify;`;

const SocialContainer = styled.div`
    display: flex;

`;

const SocialIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white;
    background-color: #${(props) => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;`;



const Center = styled.div`
    flex: 1;
    padding: 20px;

`;

const Right = styled.div`
    flex: 1;
    padding: 20px;
`;

const Title = styled.h3`
    margin-bottom: 30px;
    `;

const List = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
`;

const ListItem = styled.li`
    width: 50%;
    margin-bottom: 10px;
    cursor: pointer;
`;

const ContactItem = styled.div`
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    
`;

const Payment = styled.img`
    width: 50%;
`;

const Footer = () => {
    const navigate = useNavigate(); 

    return (
        <Container>
            <Left>
                <Logo>Boo </Logo>
                <Desc>Welcome to our clothing store, where style meets comfort! Explore our curated collection of trendy apparel and accessories designed to elevate your wardrobe. 
                    From casual essentials to elegant ensembles, we have everything you need to express your unique fashion sense with confidence
                </Desc>
                <SocialContainer>
                    <SocialIcon color="3B5999">
                        <Facebook />
                    </SocialIcon>
                    <SocialIcon color="E4405F">
                        <Instagram />
                    </SocialIcon>
                    <SocialIcon color="55ACEE">
                        <Twitter />
                    </SocialIcon>
                    <SocialIcon color="E60023">
                        <Pinterest />
                    </SocialIcon>
                </SocialContainer>
            </Left>

            <Center>
                <Title>Useful Links</Title>
                <List>
                    <ListItem onClick={() => navigate('/')}>Home</ListItem>
                    <ListItem onClick={() => navigate('/Cart')}>Cart</ListItem>
                    <ListItem>Oreder Tracking</ListItem>


                </List>

            </Center>
            <Right>
                <Title>Contact</Title>
                <ContactItem><Room style={{ marginRight: "10px" }} /> 157 Dizingof ,Tel Aviv Israel</ContactItem>
                <ContactItem><Phone style={{ marginRight: "10px" }} />+9720502284445</ContactItem>
                <ContactItem><MailOutlined style={{ marginRight: "10px" }} /> Yarinfirka@gmail.com</ContactItem>
             <Payment src="https://i.ibb.co/Qfvn4z6/payment.png" />
            </Right>
        </Container>
    )
}

export default Footer
