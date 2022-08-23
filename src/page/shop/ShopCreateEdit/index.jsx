import React, { useCallback, useEffect, useState } from 'react';
import './index.scss';
import PageHeader from '../../../components/PageHeader';
import { Card, Form, Input, Select, Row, Col, Button, Divider, TimePicker, Modal, message } from 'antd';
import { CalendarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import useStore from '../../../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getShopDetail, updateShop } from '../../../apis/shop';
import { observer } from 'mobx-react-lite';
const { Option } = Select;
function ShopCreateEdit() {
  const [createForm] = Form.useForm();
  const [version, setVersion] = useState(0);
  const [shopName, setShopName] = useState('');
  const navigate = useNavigate();
  const { shopStore } = useStore();
  const [parmas] = useSearchParams();
  const { getShopTableList, createShop, pageIndex, pageSize, keyword, businessTypes, managementTypes, enabled, setShopList } = shopStore;
  const businessNo = parmas.get('businessNo');
  useEffect(() => {
    const requestShopDetail = async () => {
      try {
        const { data: res } = await getShopDetail(businessNo);
        const { name, businessType, managementType, contact, openingHours, comment, businessArea, version } = res.data;
        setShopName(name);
        if (!res.status.code) {
          setVersion(version);
          createForm.setFieldsValue({
            name: name,
            businessType,
            managementType,
            telephone: contact.telephone,
            cellphone: contact.cellphone,
            contactName: contact.name,
            address: contact.address,
            comment,
            businessArea: businessArea.substring(0, businessArea.length - 2),
            businessHours: [moment(moment(openingHours.openTime, 'HH:mm')), moment(moment(openingHours.closeTime, 'HH:mm'))],
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (businessNo) {
      requestShopDetail();
    }
  }, []);

  // 保存按钮
  const createSubmitBtn = async (val) => {
    const data = {
      name: val.name,
      contact: {
        telephone: val.telephone || null,
        cellphone: val.cellphone || null,
        name: val.contactName,
        address: val.address,
      },
      businessType: val.businessType || 'DINNER',
      managementType: val.managementType || 'DIRECT_SALES',
      openingHours: {
        openTime: moment(val.businessHours[0]).format('HH:mm'),
        closeTime: moment(val.businessHours[1]).format('HH:mm'),
      },
      businessArea: val.businessArea + '平米',
      comment: val.comment,
    };
    if (businessNo) {
      try {
        const { data: res } = await updateShop(businessNo, { version, ...data });
        if (res.status.code === 0) {
          message.success('修改成功');
          setVersion(res.data.version);
        }
        if (res.status.code === 302) {
          message.error('修改失败,请刷新后重试');
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      createShop(data);
      createForm.resetFields();
    }
  };

  const saveAndBackBtn = useCallback((e) => {
    e.preventDefault();
    createForm.validateFields().then((values) => {
      createSubmitBtn(values);
      setShopList([]);
      navigate('/');
    });
  });

  // 取消新建
  const cancelCreateBtn = () => {
    Modal.confirm({
      title: '确认丢失修改的内容！',
      icon: <ExclamationCircleOutlined />,
      content: '所有修改均会丢失请确认？',
      okText: '回到主页面',
      cancelText: '回到当前页面',
      onOk() {
        createForm.resetFields();
        navigate('/');
      },
    });
  };
  return (
    <Card>
      <PageHeader title={businessNo ? `编辑-${shopName}` : '新建门店'} />
      <Form labelAlign="left" colon={false} form={createForm} onFinish={createSubmitBtn}>
        <div className="form-title">通用信息</div>
        <Row>
          <Col span={24}>
            <Form.Item
              label="门店名"
              rules={[
                { required: true, message: '请输入店名' },
                { pattern: /^[\u4e00-\u9fa5]{1,20}$/, message: '请输入20个以内中文字符' },
              ]}
              name="name"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/* 主营业态 */}
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label="主营业态" name="businessType" initialValue="DINNER">
              <Select>
                <Option value="DINNER">正餐</Option>
                <Option value="FAST_FOOD">快餐</Option>
                <Option value="HOT_POT">火锅</Option>
                <Option value="BARBECUE">烧烤</Option>
                <Option value="WESTERN_FOOD">西餐</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="管理类型" name="managementType" initialValue="DIRECT_SALES">
              <Select>
                <Option value="DIRECT_SALES">直营</Option>
                <Option value="ALLIANCE">加盟</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {/* 联系方式 */}
        <div className="form-title">联系方式</div>
        <Row gutter={[10, 10]}>
          <Col span={8}>
            <Form.Item
              rules={[
                { pattern: /\d{3}-\d{8}|\d{4}-\d{7}/, message: '请输入正确的座机号' },
                { max: 15, message: '最大长度位15' },
              ]}
              label="座机号"
              name="telephone"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item rules={[{ pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '手机号错误' }]} label="手机号" name="cellphone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              rules={[
                { required: true, message: '请填写联系人' },
                { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '联系人由2~10位中文字符组成' },
              ]}
              label="联系人"
              name="contactName"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/* 地址 */}
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Form.Item
              label="地址"
              rules={[
                { required: true, message: '请填写地址信息' },
                { pattern: /^[\u4e00-\u9fa50-9。，]{0,30}$/, message: '只能输入中文字符且不能包含特殊字符' },
                { max: 30, message: '最大长度为30个中文字符组成' },
              ]}
              name="address"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <div className="form-title">经营信息</div>
        {/* 经营时间 */}
        <Row gutter={[10, 10]}>
          <Col span={16}>
            <Form.Item rules={[{ required: true, message: '请选择营业时间' }]} label="营业时间" name="businessHours">
              <TimePicker.RangePicker format="HH:mm" placeholder={['开始时间', '结束时间']} suffixIcon={<CalendarOutlined />} style={{ width: '100%', backgroundColor: '#fff' }} />
            </Form.Item>
          </Col>
          {/* 门店面积 */}
          <Col span={8}>
            <Form.Item
              rules={[
                { required: true, message: '请填写门店面积' },
                { pattern: /^[0-9]*$/, message: '请填写1-4位正整数' },
                { max: 10, message: '最大长度为10位' },
              ]}
              label="门店面积"
              name="businessArea"
            >
              <Input addonAfter={<div className="input-end">平方米</div>} />
            </Form.Item>
          </Col>
        </Row>
        {/* 门店介绍 */}
        <Row>
          <Col span={24}>
            <Form.Item
              rules={[
                { required: true, message: '请填写门店介绍' },
                { pattern: /^[\u4e00-\u9fa5、。，]*$/, message: '只能输入中文字符且不能包含特殊字符' },
                { max: 100, message: '最大长度为100字符' },
              ]}
              label="门店介绍"
              name="comment"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Divider className="foot-divider" />
        <div className="foot-btns">
          <div>
            <Button className="cancel-btn btn-item" onClick={cancelCreateBtn}>
              取消
            </Button>
            <Button className="save-btn btn-item" type="primary" onClick={saveAndBackBtn}>
              保存并返回
            </Button>
            <Button className="save-btn btn-item" type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
}

export default observer(ShopCreateEdit);
