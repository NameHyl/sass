/**
 * 门店管理 api
 */
import request from '../utils/request';
const api = '/api1';
// 查询门店列表
export const getShopList = (data) => {
  return request({
    method: 'post',
    url: `${api}/shop/search `,
    data,
  });
};
// 新增门店
export const addShop = (data) => {
  return request({
    method: 'post',
    url: `${api}/shop`,
    data,
  });
};
// 查询门店详情
export const getShopDetail = (businessNo) => {
  return request({
    method: 'get',
    url: `${api}/shop/${businessNo}`,
  });
};
// 修改门店
export const updateShop = (businessNo, data) => {
  return request({
    method: 'put',
    url: `${api}/shop/${businessNo}`,
    data,
  });
};
// 启用/禁用门店
export const enableShop = (businessNo, state, version) => {
  return request({
    method: 'post',
    url: `${api}/shop/${businessNo}/${state}`,
    data: {
      version,
    },
  });
};
