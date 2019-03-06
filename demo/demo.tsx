import * as React from 'react';
import { render } from 'react-dom';
import { SwitchPanel, ISwitchPanelProps, SwitchPanelFactory } from '../src/';



function onSwitch(panel, index) {
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
  previewer:{
    url: 'https://daxue.taobao.com/markets/daxue/help#account'
  }
};

render(<SwitchPanel {...props} onSwitch={onSwitch}/>, document.getElementById(
  'example'
) as HTMLElement);

// ======= with store =========

const {
  SwitchPanelWithStore, client
} = SwitchPanelFactory();


function onSwitchWithClient(panel, index) {
  console.log('[with client]当前点击：', panel, index);
  client.put('/clients/codeEditor/editor', { name: 'value', value: `${index}: panel name: ${panel.id}` });
}


render(<SwitchPanelWithStore width={600} height={300} onSwitch={onSwitchWithClient} />, document.getElementById(
  'example-stores'
) as HTMLElement);

client.put('/clients/previewer/iframe', { name: 'url', value: 'https://daxue.taobao.com/markets/daxue/help#account'});

