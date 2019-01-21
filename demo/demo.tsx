import * as React from 'react';
import { render } from 'react-dom';
import { SwitchPanel, ISwitchPanelProps } from '../src/';

function onSwitch(panel, index) {
  console.log('当前点击：', panel, index);
}

const props: ISwitchPanelProps = {
  codeEditor: {
    value: '',
    width: 400,
    height: 600,
  },
  selectedPanelId: 'schema',
  panels: [
    {
      id: 'preview',
      title: '页面预览'
    },
    {
      id: 'schema',
      title: 'Schema'
    }
  ],
  codeEditorEvent: {
    onChange: value => {
      console.log('代码编辑器内容：', value);
    }
  }
};

render(<SwitchPanel {...props} onSwitch={onSwitch} />, document.getElementById(
  'example'
) as HTMLElement);
