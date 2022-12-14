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

  // ????????????
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
      businessArea: val.businessArea + '??????',
      comment: val.comment,
    };
    if (businessNo) {
      try {
        const { data: res } = await updateShop(businessNo, { version, ...data });
        if (res.status.code === 0) {
          message.success('????????????');
          setVersion(res.data.version);
        }
        if (res.status.code === 302) {
          message.error('????????????,??????????????????');
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

  // ????????????
  const cancelCreateBtn = () => {
    Modal.confirm({
      title: '??????????????????????????????',
      icon: <ExclamationCircleOutlined />,
      content: '????????????????????????????????????',
      okText: '???????????????',
      cancelText: '??????????????????',
      onOk() {
        createForm.resetFields();
        navigate('/');
      },
    });
  };
  return (
    <Card>
      <PageHeader title={businessNo ? `??????-${shopName}` : '????????????'} />
      <Form labelAlign="left" colon={false} form={createForm} onFinish={createSubmitBtn}>
        <div className="form-title">????????????</div>
        <Row>
          <Col span={24}>
            <Form.Item
              label="?????????"
              rules={[
                { required: true, message: '???????????????' },
                { pattern: /^[\u4e00-\u9fa5]{1,20}$/, message: '?????????20?????????????????????' },
              ]}
              name="name"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/* ???????????? */}
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label="????????????" name="businessType" initialValue="DINNER">
              <Select>
                <Option value="DINNER">??????</Option>
                <Option value="FAST_FOOD">??????</Option>
                <Option value="HOT_POT">??????</Option>
                <Option value="BARBECUE">??????</Option>
                <Option value="WESTERN_FOOD">??????</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="????????????" name="managementType" initialValue="DIRECT_SALES">
              <Select>
                <Option value="DIRECT_SALES">??????</Option>
                <Option value="ALLIANCE">??????</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {/* ???????????? */}
        <div className="form-title">????????????</div>
        <Row gutter={[10, 10]}>
          <Col span={8}>
            <Form.Item
              rules={[
                { pattern: /\d{3}-\d{8}|\d{4}-\d{7}/, message: '???????????????????????????' },
                { max: 15, message: '???????????????15' },
              ]}
              label="?????????"
              name="telephone"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item rules={[{ pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '???????????????' }]} label="?????????" name="cellphone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              rules={[
                { required: true, message: '??????????????????' },
                { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '????????????2~10?????????????????????' },
              ]}
              label="?????????"
              name="contactName"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/* ?????? */}
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Form.Item
              label="??????"
              rules={[
                { required: true, message: '?????????????????????' },
                { pattern: /^[\u4e00-\u9fa50-9??????]{0,30}$/, message: '???????????????????????????????????????????????????' },
                { max: 30, message: '???????????????30?????????????????????' },
              ]}
              name="address"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <div className="form-title">????????????</div>
        {/* ???????????? */}
        <Row gutter={[10, 10]}>
          <Col span={16}>
            <Form.Item rules={[{ required: true, message: '?????????????????????' }]} label="????????????" name="businessHours">
              <TimePicker.RangePicker format="HH:mm" placeholder={['????????????', '????????????']} suffixIcon={<CalendarOutlined />} style={{ width: '100%', backgroundColor: '#fff' }} />
            </Form.Item>
          </Col>
          {/* ???????????? */}
          <Col span={8}>
            <Form.Item
              rules={[
                { required: true, message: '?????????????????????' },
                { pattern: /^[0-9]*$/, message: '?????????1-4????????????' },
                { max: 10, message: '???????????????10???' },
              ]}
              label="????????????"
              name="businessArea"
            >
              <Input addonAfter={<div className="input-end">?????????</div>} />
            </Form.Item>
          </Col>
        </Row>
        {/* ???????????? */}
        <Row>
          <Col span={24}>
            <Form.Item
              rules={[
                { required: true, message: '?????????????????????' },
                { pattern: /^[\u4e00-\u9fa5?????????]*$/, message: '???????????????????????????????????????????????????' },
                { max: 100, message: '???????????????100??????' },
              ]}
              label="????????????"
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
              ??????
            </Button>
            <Button className="save-btn btn-item" type="primary" onClick={saveAndBackBtn}>
              ???????????????
            </Button>
            <Button className="save-btn btn-item" type="primary" htmlType="submit">
              ??????
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
}

export default observer(ShopCreateEdit);
