import { makeAutoObservable } from 'mobx';
import { getShopList, addShop, enableShop } from '../apis/shop';
import { message } from 'antd';
class ShopStore {
  pageIndex = 1;
  pageSize = 10;
  shopList = [];
  keyword = '';
  enabled = null;
  businessTypes = null;
  managementTypes = null;
  editData = {};
  constructor() {
    makeAutoObservable(this);
  }

  setManagementType = (type) => {
    this.managementTypes = type;
  };
  setBusinessType = (type) => {
    this.businessTypes = type;
  };
  setKeyword = (keyWord) => {
    this.keyWord = keyWord;
  };
  setEnabled = (enabled) => {
    this.enabled = enabled;
  };
  setEditData = (data) => {
    this.editData = data;
  };
  setPageSize = (pageSize) => {
    this.pageSize = pageSize;
  };
  setPageIndex = (pageIndex) => {
    this.pageIndex = pageIndex;
  };
  // 获取店铺列表
  getShopTableList = async (data) => {
    try {
      const { data: res } = await getShopList(data);
      this.shopList = res.data;
      this.pageSize = res.data.pageSize;
      this.pageIndex = res.data.pageIndex;

      if (res.data.records.length === 0) {
        // message.error('没有相关数据');
      }
    } catch (err) {
      message.error('请求错误');
      console.log(err);
    }
  };
  // 创建门店
  createShop = async (data) => {
    try {
      const { data: res } = await addShop(data);
      if (res.status.code === 0) {
        message.success(res.status.msg);
      }
    } catch (err) {
      console.log(err);
      message.error('服务器错误创建失败');
    }
  };
  //启用/禁用门店
  openOrCloseShop = async (businessNo, state, version) => {
    try {
      const { data: res } = await enableShop(businessNo, state, version);
      if (res.status.code === 0) {
        message.success(res.status.msg);
        this.getShopTableList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          condition: {
            keyword: this.keyword,
            enabled: this.enabled,
            managementType: this.managementTypes,
            businessType: this.businessTypes,
          },
        });
      } else if (res.status.code === 302) {
        message.error('修改错误,请刷新后重试');
      }
    } catch (err) {
      message.error('服务器错误');
      console.log(err);
    }
  };
  setShopList = (shopList) => {
    this.shopList = shopList;
  };
}

export default ShopStore;
