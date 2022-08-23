import { Form, Row, Col, Button, Select, Input, Tooltip, InputNumber, message } from 'antd';
import React, { useEffect, useState } from 'react';
import useStore from '../../../store';
import './index.scss';
const { Option } = Select;
function DishesListForm() {
  const [dishesForm] = Form.useForm();
  const [repeatSubmit, setRepeatSubmit] = useState(null);
  const [isReset, setIsReset] = useState(true);
  const { dishesStore } = useStore();
  const { getProductList, setRequestBody, requestBody } = dishesStore;
  const { pageIndex, pageSize } = requestBody;
  // 查询菜品
  const queryDishes = (values) => {
    const { condition } = values;
    if (condition.enabled === '所有' && condition.name === '' && condition.unitOfMeasure === '' && condition.unitPrice.from === null && condition.unitPrice.to === null) {
      if (isReset) {
        message.error('请输入查询条件');
        return;
      }
      setIsReset(true);
    }
    setIsReset(false);

    if (repeatSubmit) {
      if (repeatSubmit.enabled === condition.enabled && repeatSubmit.name === condition.name && repeatSubmit.unitOfMeasure === condition.unitOfMeasure && repeatSubmit.unitPrice.from === condition.unitPrice.from && repeatSubmit.unitPrice.to === condition.unitPrice.to) {
        message.warning('请勿重复查询');
        return;
      }
    }
    setRepeatSubmit({ ...values.condition });

    //状态
    if (condition.enabled === '所有') {
      condition.enabled = null;
    } else if (condition.enabled === '已上架') {
      condition.enabled = true;
    } else if (condition.enabled === '已下架') {
      condition.enabled = false;
    }
    //菜品名
    condition.name = condition.name || null;
    //计量单位
    condition.unitOfMeasure = condition.unitOfMeasure || null;
    //单价
    if (condition.unitPrice.from === null && condition.unitPrice.to === null) {
      condition.unitPrice = {
        from: null,
        to: null,
      };
    } else if (condition.unitPrice.from === null && condition.unitPrice.to !== null) {
      condition.unitPrice = {
        from: 0,
        to: condition.unitPrice.to,
      };
    } else if (condition.unitPrice.from !== null && condition.unitPrice.to === null) {
      condition.unitPrice = {
        from: condition.unitPrice.from,
        to: 9999,
      };
    }
    getProductList({
      pageIndex,
      pageSize,
      ...values,
    });
    setRequestBody({
      pageIndex,
      pageSize,
      ...values,
    });
  };
  // 重置
  const resetDishesQuery = () => {
    //判断是否查询过
    if (!repeatSubmit) {
      message.warning('未查询或已重置，无需再次重置');
      return;
    }
    setRepeatSubmit(null);

    dishesForm.resetFields();
    setRequestBody({
      pageIndex: 1,
      pageSize: 10,
      condition: {
        enabled: null,
        name: null,
        unitOfMeasure: null,
        unitPrice: {
          from: null,
          to: null,
        },
      },
    });
    setTimeout(() => {
      getProductList({
        pageIndex: 1,
        pageSize: 10,
        condition: {
          enabled: null,
          name: null,
          unitOfMeasure: null,
          unitPrice: {
            from: null,
            to: null,
          },
        },
      });
    }, 10);
  };
  return (
    <Form colon={false} form={dishesForm} onFinish={queryDishes}>
      <Row gutter={[20]}>
        <Col span={8}>
          <Form.Item label="状态" name={['condition', 'enabled']} initialValue="所有">
            <Select>
              <Option value="所有">所有</Option>
              <Option value="已上架">已上架</Option>
              <Option value="已下架">已下架</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="菜品单价">
            <Input.Group compact style={{ display: 'flex' }}>
              <Form.Item name={['condition', 'unitPrice', 'from']} initialValue={null}>
                <InputNumber controls={false} min={0} style={{ textAlign: 'center' }} />
              </Form.Item>
              <Form.Item>
                <Input placeholder="~" className="input-disabled input-center" disabled />
              </Form.Item>
              <Form.Item name={['condition', 'unitPrice', 'to']} initialValue={null}>
                <InputNumber max={9999} controls={false} className="ipt-max"></InputNumber>
              </Form.Item>
              <Form.Item initialValue="元">
                <Input  className="input-disabled input-last" disabled style={{ color: '#000' }}></Input>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="计量单位"
            // name="unitOfMeasure"
            name={['condition', 'unitOfMeasure']}
            initialValue=""
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col span={12} className="shop-name-label">
          <Form.Item
            label="菜品名"
            // name="name"
            name={['condition', 'name']}
            initialValue=""
            rules={[{ pattern: /^[\u4e00-\u9fa5]{1,10}$/, message: '请输入10个以内中文字符' }]}
          >
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
            <Button className="reset-btn" onClick={resetDishesQuery} style={{ width: '48%', fontWeight: 700 }}>
              重置
            </Button>
          </Tooltip>
        </Col>
      </Row>
    </Form>
  );
}

export default DishesListForm;
