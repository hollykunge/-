import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Card, Select, List, Tag, Icon, Avatar, Row, Col, Button } from 'antd';

import StandardFormRow from '../../components/StandardFormRow';
import TagSelect from '../../components/TagSelect';
import styles from './Articles.less';

const { Option } = Select;
const FormItem = Form.Item;

const pageSize = 5;

@Form.create()
@connect(state => ({
  list: state.list,
}))
export default class SearchList extends Component {
  componentDidMount() {
    this.fetchMore();
  }

  setOwner = () => {
    const { form } = this.props;
    form.setFieldsValue({
      owner: ['wzj'],
    });
  }

  fetchMore = () => {
    this.props.dispatch({
      type: 'list/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  }

  render() {
    const { form, list: { list, loading } } = this.props;
    const { getFieldDecorator } = form;

    const owners = [
      {
        id: 'wzj',
        name: '我自己',
      },
      {
        id: 'wjh',
        name: '设计师一',
      },
      {
        id: 'zxx',
        name: '设计师二',
      },
      {
        id: 'zly',
        name: '设计师三',
      },
      {
        id: 'ym',
        name: '设计师四',
      },
    ];

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const ListContent = ({ data: { content, updatedAt, avatar, owner, href } }) => (
      <div className={styles.listContent}>
        <div className={styles.description}>{content}</div>
        <div className={styles.extra}>
          <Avatar src={avatar} size="small" /><a href={href}>{owner}</a> 发布在 <a href={href}>{href}</a>
          <em>{moment(updatedAt).format('YYYY-MM-DD hh:mm')}</em>
        </div>
      </div>
    );

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 },
      },
    };

    const loadMore = list.length > 0 ? (
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
          {loading ? <span><Icon type="loading" /> 加载中...</span> : '加载更多'}
        </Button>
      </div>
    ) : null;

    return (
      <div>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
              <FormItem>
                {getFieldDecorator('category')(
                  <TagSelect onChange={this.handleFormSubmit} expandable>
                    <TagSelect.Option value="cat1">整车设计</TagSelect.Option>
                    <TagSelect.Option value="cat2">发动机变速器设计</TagSelect.Option>
                    <TagSelect.Option value="cat3">工装设计</TagSelect.Option>
                    <TagSelect.Option value="cat4">电器、电子系统设计</TagSelect.Option>
                    <TagSelect.Option value="cat5">底盘设计</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow
              title="owner"
              grid
            >
              <Row>
                <Col lg={16} md={24} sm={24} xs={24}>
                  <FormItem>
                    {getFieldDecorator('owner', {
                      initialValue: ['wjh', 'zxx'],
                    })(
                      <Select
                        mode="multiple"
                        style={{ maxWidth: 286, width: '100%' }}
                        placeholder="选择 owner"
                      >
                        {
                          owners.map(owner =>
                            <Option key={owner.id} value={owner.id}>{owner.name}</Option>
                          )
                        }
                      </Select>
                    )}
                    <a className={styles.selfTrigger} onClick={this.setOwner}>只看自己的</a>
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
            <StandardFormRow
              title="其它选项"
              grid
              last
            >
              <Row gutter={16}>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label="是否解决"
                  >
                    {getFieldDecorator('user', {})(
                      <Select
                        onChange={this.handleFormSubmit}
                        placeholder="不限"
                        style={{ maxWidth: 200, width: '100%' }}
                      >
                        <Option value="yes">是</Option>
                        <Option value="no">否</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label="好评度"
                  >
                    {getFieldDecorator('rate', {})(
                      <FormItem
                        // label="好评度"
                      >
                        {getFieldDecorator('rate', {})(
                          <Select
                            onChange={this.handleFormSubmit}
                            placeholder="不限"
                            style={{ maxWidth: 200, width: '100%' }}
                          >
                            <Option value="good">优秀</Option>
                          </Select>
                        )}
                      </FormItem>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List
            size="large"
            loading={list.length === 0 ? loading : false}
            rowKey="id"
            itemLayout="vertical"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item
                key={item.id}
                actions={[
                  <IconText type="star-o" text={item.star} />,
                  <IconText type="like-o" text={item.like} />,
                  <IconText type="message" text={item.message} />,
                ]}
                extra={<div className={styles.listItemExtra} />}
              >
                <List.Item.Meta
                  title={(
                    <a className={styles.listItemMetaTitle} href={item.href}>{item.title}</a>
                  )}
                  description={
                    <span>
                      <Tag>严重</Tag>
                      <Tag>紧急</Tag>
                      <Tag>供应商</Tag>
                    </span>
                  }
                />
                <ListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  }
}
