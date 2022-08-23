/**
 * 根Store
 */
import { createContext, useContext } from 'react';
import ShopStore from './shop.Store';
import DishesStore from './dishes.Store';
import OrderStore from './order.Store';
class RootStore {
  constructor() {
    this.shopStore = new ShopStore();
    this.dishesStore = new DishesStore();
    this.orderStore = new OrderStore();
  }
}

const rootStore = new RootStore();

const context = createContext(rootStore);

const useStore = () => useContext(context);

export default useStore;
