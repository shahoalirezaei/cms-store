import Dashboard from "../pages/dashboard/Dashboard"
import Products from "../pages/products/Products"
import Users from '../pages/users/Users'
import Comments from '../pages/comments/Comments'
import Orders from '../pages/orders/Orders'
import Offs from '../pages/offs/Offs'
import LoginForm from "../pages/loginForm/LoginForm"


let routes = [
    {path: "/", element: <Dashboard />, title: "dashboard"},
    {path: "/products", element: <Products />, title: "products"},
    {path: "/users", element: <Users />, title: "users"},
    {path: "/comments", element: <Comments />, title: "comments"},
    {path: "/orders", element: <Orders />, title: "orders"},
    {path: "/offs", element: <Offs />, title: "offs"},
    {path: "/login", element: <LoginForm />, title: "login"},
];

export default routes;