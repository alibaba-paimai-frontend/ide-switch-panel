import * as React from 'react';
import { render } from 'react-dom';
import {
  SwitchPanel,
  ISwitchPanelProps,
  SwitchPanelFactory,
  IPanel
} from '../src/';
import { schema } from './schema';

function onSwitch(panel: IPanel, index: number) {
  console.log('当前点击：', panel, index);
}

const props: ISwitchPanelProps = {
  width: 400,
  height: 200,
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

render(<SwitchPanel {...props} onSwitch={onSwitch} />, document.getElementById(
  'example'
) as HTMLElement);

// ======= with store =========

const { SwitchPanelWithStore, client } = SwitchPanelFactory();

function onSwitchWithClient(panel: IPanel, index: number) {
  console.log('[with client]当前点击：', panel, index);
  client.put('/clients/codeEditor/editor', {
    name: 'value',
    value: `${index}: panel name: ${panel.id}`
  });
}

render(
  <SwitchPanelWithStore
    width={600}
    height={300}
    onSwitch={onSwitchWithClient}
  />,
  document.getElementById('example-stores') as HTMLElement
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

