import React, { useCallback, useEffect, useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import { Form, Row, Col, Input, Button, Divider, Modal, InputNumber, message } from 'antd';
import { MinusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDishesDetail, updateDishes } from '../../../apis/dishes';
import useStore from '../../../store';
import './index.scss';
function DishesCreateEdit() {
  const [version, setVersion] = useState(0);
  const [productName, setProductName] = useState('');
  const [params] = useSearchParams();
  const [addAndEditForm] = Form.useForm();
  const { dishesStore } = useStore();
  const { createProduct } = dishesStore;
  const navigate = useNavigate();
  const id = params.get('id');
  useEffect(() => {
    const requestDishesDetail = async () => {
      try {
        const { data: res } = await getDishesDetail(id);
        const { name, unitPrice, unitOfMeasure, increaseSalesQuantity, minSalesQuantity, description, methodGroups, accessoryGroups } = res.data;
        const dealWithAccessoryGroups = accessoryGroups.map((item) => {
          return item.options[0];
        });
        const deaWithMethodGroupsName = [...new Set(methodGroups.map((item) => item.name))];
        const deaWithMethodGroups = deaWithMethodGroupsName.map((item) => {
          const options = [];
          const methodGroupsFilterName = methodGroups.filter((fill) => fill.name === item);
          methodGroupsFilterName.forEach((v) => {
            options.push({
              name: v.options[0].name,
            });
          });
          return {
            name: item,
            options,
          };
        });
        addAndEditForm.setFieldsValue({
          name,
          unitPrice,
          description,
          unitOfMeasure,
          minSalesQuantity,
          increaseSalesQuantity,
          methodGroups: deaWithMethodGroups,
          accessoryGroups: dealWithAccessoryGroups,
        });
        setVersion(res.data.version);
        setProductName(name);
      } catch (err) {
        console.log(err);
      }
    };
    id && requestDishesDetail();
  }, []);

  //保存按钮
  const addAndEditDishes = async (values) => {
    const accessoryGroups = values.accessoryGroups.map((item) => {
      return {
        name: item.name,
        options: [
          {
            name: item.name,
            unitPrice: item.unitPrice,
            unitOfMeasure: item.unitOfMeasure,
          },
        ],
      };
    });
    values.description ? (values.description = values.description) : (values.description = null); //描述判空
    if (id) {
      const newValues = { ...values, accessoryGroups, version };
      try {
        const { data: res } = await updateDishes(id, newValues);
        if (res.status.code === 0) {
          message.success('更新菜品成功');
          setVersion(res.data.version);
          setProductName(res.data.name);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      const newValues = { ...values, accessoryGroups };
      createProduct(newValues);
      addAndEditForm.resetFields();
    }
  };

  //保存并返回
  const handleSaveAndBack = useCallback((e) => {
    e.preventDefault();
    addAndEditForm.validateFields().then((values) => {
      addAndEditDishes(values);
      navigate('/dishes');
    });
  });

  //取消按钮
  const onCancel = () => {
    Modal.confirm({
      title: '确认丢失修改的内容！',
      icon: <ExclamationCircleOutlined />,
      content: '所有修改均会丢失请确认？',
      okText: '回到主页面',
      cancelText: '回到当前页面',
      onOk() {
        navigate('/dishes');
      },
    });
  };

  return (
    <>
      <PageHeader title={id ? `编辑菜品-${productName}` : '新菜品'} />
      <Form colon={false} onFinish={addAndEditDishes} form={addAndEditForm}>
        <div className="form-title">通用信息</div>
        <br />
        <Row>
          <Col span={24}>
            <Form.Item
              label="菜品名"
              initialValue=""
              rules={[
                { required: true, message: '请输入菜品名' },
                { pattern: /^[\u4e00-\u9fa5]{1,10}$/, message: '请输入10个以内中文字符' },
              ]}
              name="name"
            >
              <Input placeholder="菜品名" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20]}>
          <Col span={12}>
            <Form.Item
              label="菜品单价"
              name="unitPrice"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: '请输入菜品单价',
                },
              ]}
            >
              <InputNumber controls={false} min={0.01} max={999.99} placeholder="菜品单价" step={0.01} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="计量单位"
              name="unitOfMeasure"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: '请输入计量单位',
                },
                {
                  pattern: /^元{1}\/{1}[\u4e00-\u9fa5]{1,3}$/,
                  message: '元/计量单位',
                },
              ]}
            >
              <Input placeholder="计量单位" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20]}>
          <Col span={12}>
            <Form.Item
              label="起售量"
              name="minSalesQuantity"
              initialValue={1}
              rules={[
                {
                  required: true,
                  message: '请输入起售量',
                },
              ]}
            >
              <InputNumber controls={false} placeholder="起售量" max={100} min={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="增售量"
              name="increaseSalesQuantity"
              initialValue={1}
              rules={[
                {
                  required: true,
                  message: '请输入增售量',
                },
              ]}
            >
              <InputNumber controls={false} placeholder="增售量" max={100} min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="描述" name="description" initialValue="" rules={[{ pattern: /^[\u4e00-\u9fa5\，\、\。]{1,50}$/, message: '最大50个以内中文字符' }]}>
              <Input placeholder="描述" />
            </Form.Item>
          </Col>
        </Row>
        <Form.List
          name="methodGroups"
          initialValue={[
            {
              name: '',
              options: [''],
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <Form.Item>
                <div className="form-title practice">
                  <span>做法</span>
                  <Button
                    type="primary"
                    className="add-btn"
                    onClick={() => {
                      let methodGroups = addAndEditForm.getFieldValue('methodGroups');
                      if (methodGroups[methodGroups.length - 1].name) {
                        if (fields.length >= 50) {
                          message.error('最多只能添加50个做法组');
                          return;
                        }
                        add();
                      } else {
                        message.error('请先填写做法组名称');
                      }
                    }}
                  >
                    添加做法组
                  </Button>
                </div>
                <Form.ErrorList errors={errors} />
              </Form.Item>
              {fields.map((field, index) => (
                <Row gutter={[10, 10]} key={field.key}>
                  <Col span={12}>
                    <Form.Item
                      label={`做法组${index + 1}`}
                      name={[field.name, 'name']}
                      initialValue=""
                      className="make-title"
                      rules={[
                        {
                          required: true,
                          message: '请填写做法组名',
                        },
                      ]}
                    >
                      <Input
                        placeholder="做法组名"
                        addonAfter={
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => {
                              Modal.confirm({
                                title: '确认丢失修改的内容！',
                                icon: <ExclamationCircleOutlined />,
                                content: `确认删除做法组${field.name + 1}吗？`,
                                okText: '确认',
                                cancelText: '取消',
                                onOk() {
                                  if (fields.length <= 1) {
                                    message.error('至少保留一个做法组');
                                    return;
                                  }
                                  remove(field.name);
                                },
                              });
                            }}
                          />
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.List {...field} name={[field.name, 'options']} fieldKey={[field.fieldKey, 'options']} initialValue={[{ options: [{ name: '' }] }]}>
                      {(testList, { add: newAdd, remove: newRemove }, { errors: newErrors }) => (
                        <>
                          {testList.map((v, i) => (
                            <Form.Item
                              key={v.key}
                              {...v}
                              label={`做法${i + 1}`}
                              style={{ display: 'flex' }}
                              className="make-title"
                              name={[v.name, 'name']}
                              fieldKey={[v.fieldKey, 'name']}
                              initialValue=""
                              rules={[
                                {
                                  required: true,
                                  message: `请填写做法${i + 1}`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`做法${i + 1}`}
                                addonAfter={
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => {
                                      Modal.confirm({
                                        title: '确认丢失修改的内容！',
                                        icon: <ExclamationCircleOutlined />,
                                        content: `确认删除做法${i + 1}吗？`,
                                        okText: '确认',
                                        cancelText: '取消',
                                        onOk() {
                                          if (testList.length <= 1 && fields.length === 1) {
                                            message.error('至少保留一个做法组');
                                            return;
                                          } else if (testList.length <= 1 && fields.length > 1) {
                                            remove(field.name);
                                          }
                                          if (testList.length > 1) {
                                            newRemove(v.name);
                                          }
                                        },
                                      });
                                    }}
                                  />
                                }
                              />
                            </Form.Item>
                          ))}
                          <Form.Item>
                            <Button
                              type="primary"
                              onClick={() => {
                                let options = addAndEditForm.getFieldValue('methodGroups')[index].options;
                                if (!options[options.length - 1].name) {
                                  message.error('请先填写做法名');
                                  return;
                                }
                                if (options.length >= 20) {
                                  message.error('最多只能添加20个做法');
                                  return;
                                }
                                newAdd();
                              }}
                            >
                              添加做法
                            </Button>
                            <Form.ErrorList errors={newErrors} />
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Col>
                </Row>
              ))}
            </>
          )}
        </Form.List>
        <div className="form-title">加料</div>
        <br />
        <Form.List
          name="accessoryGroups"
          initialValue={[
            {
              name: '',
              unitPrice: '',
              unitOfMeasure: '',
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field) => (
                <Row gutter={[10, 10]} key={field.key}>
                  <Col span={9}>
                    <Form.Item
                      label="加料名"
                      name={[field.name, 'name']}
                      initialValue=""
                      rules={[
                        {
                          required: true,
                          message: '请输入加料名',
                        },
                      ]}
                    >
                      <Input placeholder="加料名" />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      label="单价"
                      name={[field.name, 'unitPrice']}
                      initialValue=""
                      rules={[
                        {
                          required: true,
                          message: '请输入单价',
                        },
                      ]}
                    >
                      <InputNumber controls={false} min={0.01} max={999.99} placeholder="单价" step={0.01} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="计量单位"
                      className="make-title"
                      name={[field.name, 'unitOfMeasure']}
                      initialValue=""
                      rules={[
                        {
                          required: true,
                          message: '请输入计量单位',
                        },
                        {
                          pattern: /^元{1}\/{1}[\u4e00-\u9fa5]{1,3}$/,
                          message: '元/计量单位',
                        },
                      ]}
                    >
                      <Input
                        placeholder="计量单位"
                        addonAfter={
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => {
                              Modal.confirm({
                                title: '确认丢失修改的内容！',
                                icon: <ExclamationCircleOutlined />,
                                content: '确认删除加料组吗？',
                                okText: '确认',
                                cancelText: '取消',
                                onOk() {
                                  if (fields.length <= 1) {
                                    message.error('至少保留一个加料组');
                                    return;
                                  }
                                  remove(field.name);
                                },
                              });
                            }}
                          />
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="primary"
                    style={{ width: '50%' }}
                    onClick={() => {
                      let materialValueArray = addAndEditForm.getFieldValue('accessoryGroups');
                      const flag = Object.values(materialValueArray[materialValueArray.length - 1]).every((v) => v);
                      if (!flag) {
                        message.error('请先填写完成加料组');
                      } else {
                        add();
                      }
                    }}
                  >
                    添加加料
                  </Button>
                  <Form.ErrorList errors={errors} />
                </div>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider className="foot-divider" />
        {/* <BackTop /> */}
        <div className="foot-btns">
          <div>
            <Button className="cancel-btn btn-item" onClick={onCancel}>
              取消
            </Button>
            <Button className="save-btn btn-item" type="primary" onClick={handleSaveAndBack}>
              保存并返回
            </Button>
            <Button className="save-btn btn-item" type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

export default DishesCreateEdit;
