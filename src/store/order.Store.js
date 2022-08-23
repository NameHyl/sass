import { makeAutoObservable } from 'mobx';

class OrderStore {
  orders = [];
  constructor() {
    makeAutoObservable(this);
  }
}

export default OrderStore;
