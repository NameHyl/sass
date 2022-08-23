import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button, Input, Select, Tooltip, message } from 'antd';
import useStore from '../../../store';
import { observer } from 'mobx-react-lite';
import './index.scss';
const { Option } = Select;
function ShopListForm() {
  const [val, setVal] = useState([]);
  const [isReset, setIsReset] = useState(true);
  const [querytForm] = Form.useForm();
  const { shopStore } = useStore();
  const { shopList, setManagementType, setBusinessType, setKeyword, getShopTableList, pageSize, setEnabled, enabled, businessTypes, managementTypes, keyword } = shopStore;

  useEffect(() => {
    const saveStoreForm = {};
    if (enabled === true) {
      saveStoreForm.enabled = '营业中';
    } else if (enabled === false) {
      saveStoreForm.enabled = '停业中';
    } else {
      saveStoreForm.enabled = 'ALL';
    }
    businessTypes === null ? (saveStoreForm.businessTypes = 'ALL') : (saveStoreForm.businessTypes = businessTypes);
    managementTypes === null ? (saveStoreForm.managementTypes = 'ALL') : (saveStoreForm.managementTypes = managementTypes);
    querytForm.setFieldsValue({
      enabled: saveStoreForm.enabled,
      businessTypes: saveStoreForm.businessTypes,
      managementTypes: saveStoreForm.managementTypes,
      keyword,
    });
  }, []);

  //查询表单提交
  const onFinishSubmitQuery = (values) => {
    const formValues = Object.values(values);
    let isSubmitToRepeat = formValues.every((item, index) => item === val[index]); //判断是否重复提交
    const shopForm = {};
    // const flag = formValues.every((item) => item === 'ALL');
    if (values.enabled === 'ALL' && values.businessTypes === 'ALL' && values.managementTypes === 'ALL' && values.keyword === '') {
      if (isReset) {
        message.error('请输入查询条件');
        return;
      }
      setIsReset(true);
    }
    setIsReset(false);

    if (isSubmitToRepeat) {
      message.warning('您没有做任何修改,请勿重复提交');
      return;
    }

    // 门店名
    shopForm.keyword = values.keyword || null;
    // 管理类型
    if (values.managementTypes === 'ALL' || values.managementTypes === undefined) {
      shopForm.managementTypes = null;
    } else {
      shopForm.managementTypes = [values.managementTypes];
    }
    // 主营业态
    if (values.businessTypes === 'ALL' || values.businessTypes === undefined) {
      shopForm.businessTypes = null;
    } else {
      shopForm.businessTypes = [values.businessTypes];
    }

    // 门店状态
    if (values.enabled === 'ALL' || values.enabled === undefined) {
      shopForm.enabled = null;
    } else if (values.enabled === '营业中') {
      shopForm.enabled = true;
    } else if (values.enabled === '停业中') {
      shopForm.enabled = false;
    }

    getShopTableList({
      pageIndex: 1,
      pageSize,
      condition: shopForm,
    });
    setManagementType(shopForm.managementTypes);
    setBusinessType(shopForm.businessTypes);
    setKeyword(shopForm.keyword);
    setEnabled(shopForm.enabled);
    setVal([...formValues]);
    if (shopList.records.length !== 0) {
      message.success('查询成功');
    }
  };
  //重置表单
  const onResetForm = () => {
    querytForm.setFieldsValue({
      enabled: 'ALL',
      businessTypes: 'ALL',
      managementTypes: 'ALL',
      keyword: '',
    });

    const data = {
      pageIndex: 1,
      pageSize,
      condition: {
        keyword: null,
        managementTypes: ['DIRECT_SALES', 'ALLIANCE'],
        businessTypes: ['DINNER', 'WESTERN_FOOD', 'HOT_POT', 'BARBECUE', 'FAST_FOOD'],
      },
    };
    getShopTableList(data);

    setManagementType(null);
    setBusinessType(null);
    setKeyword('');
    setEnabled(null);
  };

  return (
    <Form labelAlign="left" form={querytForm} onFinish={onFinishSubmitQuery} colon={false}>
      <Row gutter={[10, 10]}>
        <Col span={8}>
          <Form.Item label="营业状态" name="enabled" initialValue="ALL">
            <Select>
              <Option value="ALL">所有</Option>
              <Option value="营业中">营业中</Option>
              <Option value="停业中">停业中</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="主营业态" name="businessTypes" initialValue="ALL">
            <Select>
              <Option value="ALL">所有</Option>
              <Option value="DINNER">正餐</Option>
              <Option value="FAST_FOOD">快餐</Option>
              <Option value="HOT_POT">火锅</Option>
              <Option value="BARBECUE">烧烤</Option>
              <Option value="WESTERN_FOOD">西餐</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="管理类型" name="managementTypes" initialValue="ALL">
            <Select>
              <Option value="ALL">所有</Option>
              <Option value="DIRECT_SALES">直营</Option>
              <Option value="ALLIANCE">加盟</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col span={12}>
          <Form.Item label="门店名" name="keyword" rules={[{ pattern: /^[\u4e00-\u9fa5]{1,20}$/, message: '请输入20个以内中文字符' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12} className="form-btns" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tooltip title="搜索查询">
            <Button className="query-btn" type="primary" htmlType="submit" style={{ width: '48%', background: '#ffbd00', fontWeight: 700 }}>
              查询
            </Button>
          </Tooltip>

          <Tooltip title="重置">
            <Button className="reset-btn" style={{ width: '48%', fontWeight: 700 }} onClick={onResetForm}>
              重置
            </Button>
          </Tooltip>
        </Col>
      </Row>
    </Form>
  );
}
export default observer(ShopListForm);
