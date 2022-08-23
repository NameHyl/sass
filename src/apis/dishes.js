import request from '../utils/request';
//获取菜品列表 | 查询菜品
export const getDishesList = (data) => {
  return request({
    url: `/product/search`,
    method: 'post',
    data,
  });
};
//创建菜品
export const createDishes = (data) => {
  return request({
    url: `/product`,
    method: 'post',
    data,
  });
};
// 获取菜品详情
export const getDishesDetail = (id) => {
  return request({
    url: `/product/${id}`,
    method: 'get',
  });
};
// 更新菜品
export const updateDishes = (id, data) => {
  return request({
    url: `/product/${id}`,
    method: 'put',
    data,
  });
};
//上架菜品 | 下架菜品
export const updateDishesStatus = (id, status, version) => {
  return request({
    url: `/product/${id}/${status}`,
    method: 'post',
    data: {
      version
    },
  });
};
