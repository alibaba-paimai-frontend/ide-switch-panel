import React from 'react';
import { storiesOf } from '@storybook/react';
import { Row, Col, Input, Button } from 'antd';
import { wInfo } from '../../../.storybook/utils';
import mdDel from './del.md';

import { SwitchPanelFactory } from '../../../src';
import { modelPropsGen } from '../../helper';

const { SwitchPanelWithStore, client } = SwitchPanelFactory();

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


const createNew = client => () => {
  const { panels } = modelPropsGen();
  client.post('/panels', { panels: panels });
  client.put('/clients/editor', {
    name: 'width',
    value: 300 + Math.random() * 100
  });
  client.put('/panels', {
    name: 'height',
    value: 250 + Math.random() * 100
  });
};

function resetPanels() {
  client.del('/panels').then(res => {
    const { status, body } = res;
    if (status === 200) {
      const panels = body.panels;
      document.getElementById('info').innerText =
        `清空 panels: \n` +
        JSON.stringify(panels.toJSON ? panels.toJSON() : panels, null, 4);
    }
  });
}

function removeById() {
  const id = document.getElementById('panelId').value;
  if (!id) {
    document.getElementById('info').innerText = '请输入 id';
    return;
  }

  // 更新节点属性，返回更新后的数值
  client
    .del(`/panels/${id}`)
    .then(res => {
      const { status, body } = res;
      if (status === 200) {
        const panel = body.panel;
        document.getElementById('info').innerText =
          `清空 id 为 ${panel.id} 的 panel: \n` +
          JSON.stringify(panel.toJSON ? panel.toJSON() : panel, null, 4);
      }
    })
    .catch(err => {
      document.getElementById('info').innerText =
        `更新失败： \n` + JSON.stringify(err, null, 4);
    });
}

storiesOf('API - del', module)
  .addParameters(wInfo(mdDel))
  .addWithJSX('/panels/:id 移除指定 panel', () => {
    return (
      <Row style={styles.demoWrap}>
        <Col span={10} offset={2}>
          <Row>
            <Col span={4}>
              <Input placeholder="panel ID" id="panelId" />
            </Col>
            <Col span={20}>
              <Button onClick={removeById}>移除 panel</Button>
              <Button onClick={resetPanels}>清空 panel</Button>
              <Button onClick={createNew(client)}>随机创建</Button>
            </Col>
          </Row>

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
