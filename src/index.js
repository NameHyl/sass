import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Home from './page/Home';
import Shop from './page/shop/Shop';
import ShopList from './page/shop/ShopList'; //门店列表
import Order from './page/order/Order';
import OrderList from './page/order/OrderList'; //订单列表
import OrderCreateEdit from './page/order/OrderCreateEdit';
import Dishes from './page/dishes/Dishes';
import DishesList from './page/dishes/DishesList'; //菜品列表
import DishesCreateEdit from './page/dishes/DishesCreateEdit';
import Error404 from './page/Error404'; //404页面
import ShopCreateEdit from './page/shop/ShopCreateEdit';
import 'antd/dist/antd.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <Routes>
      <Route path="/" element={<App />}>
        <Route element={<Home />}>
          <Route element={<Shop />}>
            <Route index element={<ShopList />} />
            <Route path="/shopCreate" element={<ShopCreateEdit />} />
          </Route>
          <Route path="/dishes" element={<Dishes />}>
            <Route index element={<DishesList />} />
            <Route path="/dishes/operate" element={<DishesCreateEdit />} />
          </Route>
          <Route path="/order" element={<Order />}>
            <Route index element={<OrderList />} />
            <Route path="/order/operate" element={<OrderCreateEdit />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Error404 />}></Route>
    </Routes>
    {/* </React.StrictMode> */}
  </BrowserRouter>
);
