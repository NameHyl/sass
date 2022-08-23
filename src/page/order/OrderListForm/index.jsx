import React, { useState } from 'react';
import { Form, Row, Col, Button, Select, Input, Tooltip, InputNumber, message } from 'antd';
import './index.scss';
const { Option } = Select;
function OrderListForm() {
  const [orderForm] = Form.useForm();
  const [isRepeatTheReset, setIsRepeatTheReset] = useState(null);
  const [isRepeatTheSubmit, setIsRepeatTheSubmit] = useState(null);
  // 查询按钮
  const onOrderQuery = (values) => {
    console.log(values);
  };
  // 重置
  const resetTheOrderQuery = () => {
    if (isRepeatTheSubmit) {
      message.warning('未查询或已重置，无需再次重置');
      return;
    }
    setIsRepeatTheSubmit(null);
    orderForm.resetFields();
    setTimeout(() => {
      // 重置后，请求初始列表
    }, 10);
  };
  return (
    <Form colon={false} form={orderForm} onFinish={onOrderQuery}>
      <Row gutter={[20]}>
        <Col span={8}>
          <Form.Item label="状态" name="enabled" initialValue="所有">
            <Select>
              <Option value="所有">所有</Option>
              <Option value="已下单">已下单</Option>
              <Option value="已出餐">已出餐</Option>
              <Option value="制作中">制作中</Option>
              <Option value="已完成">已完成</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="座位号" name="seatNumber" initialValue="">
            <InputNumber className="ipt-num" controls={false} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="就餐人数" name="num" initialValue="">
            <InputNumber className="ipt-num" max={99} min={0} controls={false} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col span={12}>
          <Form.Item label="订单总价">
            <Input.Group compact style={{ display: 'flex' }}>
              <Form.Item name={['totalPrice', 'from']} initialValue={null}>
                <InputNumber controls={false} min={0} style={{ textAlign: 'center', width: '100%' }} />
              </Form.Item>
              <Form.Item>
                <Input placeholder="~" className="input-disabled input-center" disabled />
              </Form.Item>
              <Form.Item name={['totalPrice', 'to']} initialValue={null}>
                <InputNumber max={9999} controls={false} className="ipt-max"></InputNumber>
              </Form.Item>
              <Form.Item>
                <Input defaultValue="元" className="input-disabled input-last" disabled style={{ color: '#000' }}></Input>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Col>
        <Col span={12} className="form-btns" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tooltip title="搜索查询">
            <Button className="query-btn" type="primary" htmlType="submit" style={{ width: '48%', background: '#ffbd00', fontWeight: 700 }}>
              查询
            </Button>
          </Tooltip>

          <Tooltip title="重置">
            <Button className="reset-btn" style={{ width: '48%', fontWeight: 700 }} onClick={resetTheOrderQuery}>
              重置
            </Button>
          </Tooltip>
        </Col>
      </Row>
    </Form>
  );
}

export default OrderListForm;
