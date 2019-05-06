import * as React from 'react';
import { render } from 'react-dom';
import { Collapse } from 'antd';
import {
  SwitchPanel,
  ISwitchPanelProps,
  SwitchPanelFactory,
  IPanel
} from '../src/';
import { schema } from './schema';

const Panel = Collapse.Panel;

function onSwitch(panel: IPanel, index: number) {
  console.log('当前点击：', panel, index);
}

const props: ISwitchPanelProps = {
  cWidth: 400,
  cHeight: 200,
  codeEditor: {
    value: '',
    onChange: value => {
      console.log('代码编辑器内容：', value);
    }
  },
  previewer: {
    url: 'https://daxue.taobao.com/markets/daxue/help#account'
  }
};

// ======= with store =========

const {
  ComponentWithStore: SwitchPanelWithStore,
  client
} = SwitchPanelFactory();

function onSwitchWithClient(panel: IPanel, index: number) {
  console.log('[with client]当前点击：', panel, index);
  client.put('/clients/codeEditor/editor', {
    name: 'value',
    value: `${index}: panel name: ${panel.id}`
  });
}

render(
  <Collapse defaultActiveKey={['1']}>
    <Panel header="普通组件" key="0">
      <SwitchPanel {...props} onSwitch={onSwitch} />
    </Panel>
    <Panel header="包含 store 功能" key="1">
      <SwitchPanelWithStore
        cWidth={'100%'}
        cHeight={300}
        onSwitch={onSwitchWithClient}
      />
    </Panel>
  </Collapse>,
  document.getElementById('example') as HTMLElement
);

// 更改地址
client.put('/clients/previewer/iframe', {
  name: 'url',
  value: 'http://localhost:9006/gourd2/pi/demo/index.html?from=ide'
});

setTimeout(() => {
  // 然后传递数据
  client.put('/clients/previewer/iframe', {
    name: 'data',
    value: {
      event: 'data-from-ide',
      type: 'updateSchema',
      data: schema
    }
  });
}, 2000);
