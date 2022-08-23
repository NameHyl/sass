import { message } from 'antd';
import { makeAutoObservable } from 'mobx';
import { getDishesList, createDishes, updateDishes, updateDishesStatus } from '../apis/dishes';
class DishesStore {
  products = []; //菜品列表

  requestBody = {
    pageIndex: 1, //页码
    pageSize: 10, //每页条数
    condition: {
      enabled: null, //是否上架
      unitOfMeasure: null, //计量单位
      name: null, //菜品名称
      unitPrice: {
        from: null,
        to: null,
      }, //单价
    },
  };

  constructor() {
    makeAutoObservable(this);
  }
  setRequestBody = (requestBody) => {
    this.requestBody = requestBody;
  };
  // 获取菜品列表
  getProductList = async (data) => {
    try {
      const { data: res } = await getDishesList(data);
      if (res.status.code === 0) {
        this.products = res.data;
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 创建菜品
  createProduct = async (data) => {
    try {
      const { data: res } = await createDishes(data);
      if (res.status.code === 0) {
        message.success('新建菜品成功');
      }
    } catch (err) {
      console.log(err);
    }
  };
  //更新菜品
  updateProduct = async (id, data) => {
    try {
      const { data: res } = await updateDishes(id, data);
      if (res.status.code === 0) {
        message.success('更新菜品成功');
      }
    } catch (err) {
      console.log(err);
    }
  };
  //上架菜品 | 下架菜品
  updateProductStatus = async (id, status, version) => {
    try {
      let state = status ? 'disable' : 'enable';
      const { data: res } = await updateDishesStatus(id, state, version);
      console.log(res);
      if (res.status.code === 0) {
        message.success(res.status.msg);
        this.getProductList(this.requestBody);
      } else if (res.status.code === 508) {
        message.error(`${status ? '下架' : '上架'}失败，请刷新页面后重试`);
      }
    } catch (err) {
      console.log(err);
    }
  };
}

export default DishesStore;
