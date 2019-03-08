import React from 'react';
import { storiesOf } from '@storybook/react';
import { Row, Col, Input, Button, Select } from 'antd';
import { wInfo } from '../../../.storybook/utils';
import mdPut from './put.md';

import { SwitchPanelFactory } from '../../../src';
import { modelPropsGen, getRandomUrl } from '../../helper';

const { SwitchPanelWithStore, client } = SwitchPanelFactory();

const { Option } = Select;
const styles = {
  demoWrap: {
    display: 'flex',
    width: '100%'
  }
};
const codeEditorEvent = {
  onChange: value => {
    console.log('代码编辑器内容：', value);
  }
};

function onSwitch(panel, index) {
  console.log('当前值：', panel, index);

  client.get(`/clients/editor`).then(res => {
    const { status, body } = res;
    if (status === 200) {
      const config = body.config;
      document.getElementById('info').innerText = JSON.stringify(
        config,
        null,
        4
      );
    }
  });
}

let selectedAttrName = '';

const createNew = client => () => {
  const schema = modelPropsGen();
  client.post('/panels', { schema });
  client.put('/clients/codeEditor/editor', {
    name: 'value',
    value: 'new createeeeee'
  });
  client.put('/clients/previewer/iframe', {
    name: 'url',
    value: getRandomUrl()
  });
};

function handleChange(value) {
  console.log(`selected ${value}`);
  selectedAttrName = value;
}

function updateById() {
  const id = document.getElementById('panelId').value;
  if (!id) {
    document.getElementById('info').innerText = '请输入节点 id';
    return;
  }
  if (!selectedAttrName) {
    document.getElementById('info').innerText = '请选择要更改的属性';
    return;
  }

  const value = document.getElementById('targeValue').value;

  // 选中那个 panel
  client.put(`/panels/selection/${id}`);

  // 更新节点属性，返回更新后的数值
  client
    .put(`/panels/${id}`, { name: selectedAttrName, value: value })
    .then(res => {
      const { status, body } = res;
      if (status === 200) {
        const isSuccess = body.data.success;
        client.get(`/panels/${id}`).then(res => {
          const { status, body } = res;
          if (status === 200) {
            const panel = body.data.panel || {};
            document.getElementById('info').innerText =
              `更新操作：${isSuccess}; \n` +
              JSON.stringify(panel.toJSON ? panel.toJSON() : panel, null, 4);
          }
        });
      }
    })
    .catch(err => {
      document.getElementById('info').innerText =
        `更新失败： \n` + JSON.stringify(err, null, 4);
    });
}

storiesOf('API - put', module)
  .addParameters(wInfo(mdPut))
  .addWithJSX('/panels/:id 更改属性', () => {
    return (
      <Row style={styles.demoWrap}>
        <Col span={10} offset={2}>
          <Row>
            <Col span={4}>
              <Input placeholder="panel ID" id="panelId" />
            </Col>
            <Col span={4}>
              <Select
                style={{ width: 200 }}
                onChange={handleChange}
                placeholder="要更改的属性"
              >
                <Option value="id">id</Option>
                <Option value="title">title</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Input placeholder="新属性值" id="targeValue" />
            </Col>
            <Col span={10}>
              <Button onClick={updateById}>更改信息</Button>
              <Button onClick={createNew(client)}>随机创建</Button>
            </Col>
          </Row>

          <br/>
          <br/>
          <br/>

          <SwitchPanelWithStore
            onSwitch={onSwitch}
            codeEditor={codeEditorEvent}
          />
        </Col>
        <Col span={12}>
          <div id="info" />
        </Col>
      </Row>
    );
  });
