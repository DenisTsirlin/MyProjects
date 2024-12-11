import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import Product from './pages/Product';
import Cart from './pages/Cart';
import './Styles/App.css';
import Admin from './pages/Admin';


export const routes = createBrowserRouter([

    {
        path: '/',
        element: <Home />

    },

    {
        path: '/Login',
        element: <Login />
    },


    {
        path: '/Register',
        element: <Register />
    },

    {
        path: '/ProductList',
        element: <ProductList />
    },
    {
        path: '/Product',
        element: <Product />
    },
    {
        path: '/Cart',
        element: <Cart />
    },
    {
        path: '/Admin' ,
        element: <Admin />
    }

]);