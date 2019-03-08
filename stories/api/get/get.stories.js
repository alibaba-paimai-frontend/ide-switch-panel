import React from 'react';
import { storiesOf } from '@storybook/react';
import { Row, Col, Button } from 'antd';
import { wInfo } from '../../../.storybook/utils';
import mdGet from './get.md';

import { SwitchPanelFactory } from '../../../src';
import { modelPropsGen, getRandomUrl } from '../../helper';

const {
  SwitchPanelWithStore: SwitchPanelWithStore1,
  client: client1
} = SwitchPanelFactory();

// const {
//   SwitchPanelWithStore: SwitchPanelWithStore2,
//   client: client2
// } = SwitchPanelFactory();

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

  client1.get(`/clients/codeEditor/editor`).then(res => {
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

let attributes = {};

const getInfo = (client, filter) => () => {
  const query = filter && filter.length ? `filter=${filter.join(',')}` : '';
  client.get(`/panels?${query}`).then(res => {
    const { status, body } = res;
    if (status === 200) {
      attributes = body.data.attributes;
    }

    document.getElementById('info').innerText = JSON.stringify(
      attributes,
      null,
      4
    );
  });
};

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

storiesOf('API - get', module)
  .addParameters(wInfo(mdGet))
  .addWithJSX('/panels 获取属性信息', () => {
    return (
      <Row style={styles.demoWrap}>
        <Col span={10} offset={2}>
          <Button onClick={getInfo(client1)}>获取信息</Button>
          <Button onClick={getInfo(client1, ['selectedIndex'])}>
            获取指定信息(selectedPanelId)
          </Button>
          <Button onClick={createNew(client1)}>随机创建</Button>
          <br/>
          <br/>
          <br/>
          <SwitchPanelWithStore1
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
