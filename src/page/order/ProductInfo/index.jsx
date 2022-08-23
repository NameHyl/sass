import React from 'react';
import { Form, Input, Button, Modal, message, Tag, InputNumber, Table } from 'antd';
import { ExclamationCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import './index.scss';
function ProductInfo() {
  // 选择菜品
  const handleSelectProduct = () => {
    const productModalColumns = [
      {
        title: '菜品名',
        dataIndex: 'name',
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
      },
      {
        title: '计量单位',
        dataIndex: 'unitOfMeasure',
      },
    ];
    const productModalData = [{ id: 1, name: '鱼香肉丝', unitPrice: 38, unitOfMeasure: '元/份' }];
    Modal.confirm({
      width: '80%',
      icon: false,
      okText: '确认',
      cancelText: '取消',
      content: (
        <Table
          columns={productModalColumns}
          dataSource={productModalData}
          rowKey={(record) => record.id}
          rowClassName={(record, index) => {
            return `product-modal-row-${index}`;
          }}
          onRow={(record) => {
            return {
              onClick: (e) => {
                console.log(e.target);
              }, // 点击行
            };
          }}
        />
      ),
    });
  };
  return (
    <>
      <Form.List name="table">
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map(({ name, key }) => (
                <tr key={key}>
                  <td>
                    <Tag color="#ffbd00">{name}</Tag>
                  </td>
                  <td>
                    <div className="table-ipt">
                      <Form.Item initialValue="">
                        <Input placeholder="菜品名" className="shop-name" />
                      </Form.Item>
                      <Button type="primary" className="select-btn" onClick={handleSelectProduct}>
                        选择
                      </Button>
                    </div>
                  </td>
                  <td>
                    <div className="table-ipt">
                      <Form.Item name={[name, 'num']} initialValue="1">
                        <InputNumber controls={false} max={999} className="shop-name" />
                      </Form.Item>
                    </div>
                  </td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                  <td>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => {
                        Modal.confirm({
                          title: '确认丢失修改的内容！',
                          icon: <ExclamationCircleOutlined />,
                          content: `确认删除}吗？`,
                          okText: '确认',
                          cancelText: '取消',
                          onOk() {
                            remove(name);
                          },
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={7}>
                  <Button type="primary" className="add-product-btn" onClick={() => add()}>
                    添加菜品
                  </Button>
                </td>
              </tr>
            </>
          );
        }}
      </Form.List>
    </>
  );
}

export default ProductInfo;
