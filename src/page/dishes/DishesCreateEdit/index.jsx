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

  //????????????
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
    values.description ? (values.description = values.description) : (values.description = null); //????????????
    if (id) {
      const newValues = { ...values, accessoryGroups, version };
      try {
        const { data: res } = await updateDishes(id, newValues);
        if (res.status.code === 0) {
          message.success('??????????????????');
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

  //???????????????
  const handleSaveAndBack = useCallback((e) => {
    e.preventDefault();
    addAndEditForm.validateFields().then((values) => {
      addAndEditDishes(values);
      navigate('/dishes');
    });
  });

  //????????????
  const onCancel = () => {
    Modal.confirm({
      title: '??????????????????????????????',
      icon: <ExclamationCircleOutlined />,
      content: '????????????????????????????????????',
      okText: '???????????????',
      cancelText: '??????????????????',
      onOk() {
        navigate('/dishes');
      },
    });
  };

  return (
    <>
      <PageHeader title={id ? `????????????-${productName}` : '?????????'} />
      <Form colon={false} onFinish={addAndEditDishes} form={addAndEditForm}>
        <div className="form-title">????????????</div>
        <br />
        <Row>
          <Col span={24}>
            <Form.Item
              label="?????????"
              initialValue=""
              rules={[
                { required: true, message: '??????????????????' },
                { pattern: /^[\u4e00-\u9fa5]{1,10}$/, message: '?????????10?????????????????????' },
              ]}
              name="name"
            >
              <Input placeholder="?????????" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20]}>
          <Col span={12}>
            <Form.Item
              label="????????????"
              name="unitPrice"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: '?????????????????????',
                },
              ]}
            >
              <InputNumber controls={false} min={0.01} max={999.99} placeholder="????????????" step={0.01} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="????????????"
              name="unitOfMeasure"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: '?????????????????????',
                },
                {
                  pattern: /^???{1}\/{1}[\u4e00-\u9fa5]{1,3}$/,
                  message: '???/????????????',
                },
              ]}
            >
              <Input placeholder="????????????" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20]}>
          <Col span={12}>
            <Form.Item
              label="?????????"
              name="minSalesQuantity"
              initialValue={1}
              rules={[
                {
                  required: true,
                  message: '??????????????????',
                },
              ]}
            >
              <InputNumber controls={false} placeholder="?????????" max={100} min={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="?????????"
              name="increaseSalesQuantity"
              initialValue={1}
              rules={[
                {
                  required: true,
                  message: '??????????????????',
                },
              ]}
            >
              <InputNumber controls={false} placeholder="?????????" max={100} min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="??????" name="description" initialValue="" rules={[{ pattern: /^[\u4e00-\u9fa5\???\???\???]{1,50}$/, message: '??????50?????????????????????' }]}>
              <Input placeholder="??????" />
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
                  <span>??????</span>
                  <Button
                    type="primary"
                    className="add-btn"
                    onClick={() => {
                      let methodGroups = addAndEditForm.getFieldValue('methodGroups');
                      if (methodGroups[methodGroups.length - 1].name) {
                        if (fields.length >= 50) {
                          message.error('??????????????????50????????????');
                          return;
                        }
                        add();
                      } else {
                        message.error('???????????????????????????');
                      }
                    }}
                  >
                    ???????????????
                  </Button>
                </div>
                <Form.ErrorList errors={errors} />
              </Form.Item>
              {fields.map((field, index) => (
                <Row gutter={[10, 10]} key={field.key}>
                  <Col span={12}>
                    <Form.Item
                      label={`?????????${index + 1}`}
                      name={[field.name, 'name']}
                      initialValue=""
                      className="make-title"
                      rules={[
                        {
                          required: true,
                          message: '?????????????????????',
                        },
                      ]}
                    >
                      <Input
                        placeholder="????????????"
                        addonAfter={
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => {
                              Modal.confirm({
                                title: '??????????????????????????????',
                                icon: <ExclamationCircleOutlined />,
                                content: `?????????????????????${field.name + 1}??????`,
                                okText: '??????',
                                cancelText: '??????',
                                onOk() {
                                  if (fields.length <= 1) {
                                    message.error('???????????????????????????');
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
                              label={`??????${i + 1}`}
                              style={{ display: 'flex' }}
                              className="make-title"
                              name={[v.name, 'name']}
                              fieldKey={[v.fieldKey, 'name']}
                              initialValue=""
                              rules={[
                                {
                                  required: true,
                                  message: `???????????????${i + 1}`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`??????${i + 1}`}
                                addonAfter={
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => {
                                      Modal.confirm({
                                        title: '??????????????????????????????',
                                        icon: <ExclamationCircleOutlined />,
                                        content: `??????????????????${i + 1}??????`,
                                        okText: '??????',
                                        cancelText: '??????',
                                        onOk() {
                                          if (testList.length <= 1 && fields.length === 1) {
                                            message.error('???????????????????????????');
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
                                  message.error('?????????????????????');
                                  return;
                                }
                                if (options.length >= 20) {
                                  message.error('??????????????????20?????????');
                                  return;
                                }
                                newAdd();
                              }}
                            >
                              ????????????
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
        <div className="form-title">??????</div>
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
                      label="?????????"
                      name={[field.name, 'name']}
                      initialValue=""
                      rules={[
                        {
                          required: true,
                          message: '??????????????????',
                        },
                      ]}
                    >
                      <Input placeholder="?????????" />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      label="??????"
                      name={[field.name, 'unitPrice']}
                      initialValue=""
                      rules={[
                        {
                          required: true,
                          message: '???????????????',
                        },
                      ]}
                    >
                      <InputNumber controls={false} min={0.01} max={999.99} placeholder="??????" step={0.01} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="????????????"
                      className="make-title"
                      name={[field.name, 'unitOfMeasure']}
                      initialValue=""
                      rules={[
                        {
                          required: true,
                          message: '?????????????????????',
                        },
                        {
                          pattern: /^???{1}\/{1}[\u4e00-\u9fa5]{1,3}$/,
                          message: '???/????????????',
                        },
                      ]}
                    >
                      <Input
                        placeholder="????????????"
                        addonAfter={
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => {
                              Modal.confirm({
                                title: '??????????????????????????????',
                                icon: <ExclamationCircleOutlined />,
                                content: '???????????????????????????',
                                okText: '??????',
                                cancelText: '??????',
                                onOk() {
                                  if (fields.length <= 1) {
                                    message.error('???????????????????????????');
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
                        message.error('???????????????????????????');
                      } else {
                        add();
                      }
                    }}
                  >
                    ????????????
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
              ??????
            </Button>
            <Button className="save-btn btn-item" type="primary" onClick={handleSaveAndBack}>
              ???????????????
            </Button>
            <Button className="save-btn btn-item" type="primary" htmlType="submit">
              ??????
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

export default DishesCreateEdit;
