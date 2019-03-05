import React from 'react';
import { storiesOf } from '@storybook/react';
import { Row, Col, Input, Button } from 'antd';
import { wInfo } from '../../../.storybook/utils';
import mdPost from './post.md';

import { SwitchPanelFactory } from '../../../src';
import { modelPropsGen, panelGen } from '../../helper';

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

function addNewPanel() {
  const id = document.getElementById('panelIndex').value;
  if (!id) {
    document.getElementById('info').innerText = '请输入目标位置';
    return;
  }

  // 更新节点属性，返回更新后的数值
  client
    .post(`/panels/indexes/${id}`, { panel: panelGen() })
    .then(res => {
      const { status, body } = res;
      const { success, targetIndex } = body;
      if (status === 200 && success) {
        const targetIndex = body.targetIndex;
        document.getElementById('info').innerText =
          `在 index ${targetIndex} 处新增 panel: \n`;
      }
    })
    .catch(err => {
      document.getElementById('info').innerText =
        `新增失败： \n` + JSON.stringify(err, null, 4);
    });
}

storiesOf('API - post', module)
  .addParameters(wInfo(mdPost))
  .addWithJSX('/panels/panel/:index 在指定位置新增 panel', () => {
    return (
      <Row style={styles.demoWrap}>
        <Col span={10} offset={2}>
          <Row>
            <Col span={4}>
              <Input placeholder="目标位置 index" id="panelIndex" />
            </Col>
            <Col span={20}>
              <Button onClick={addNewPanel}>新增 panel</Button>
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
