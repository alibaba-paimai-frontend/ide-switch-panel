import React from 'react';
import { storiesOf } from '@storybook/react';
import { wInfo } from '../../.storybook/utils';

import { SwitchPanel, createModel, SwitchPanelAddStore } from '../../src/';
import mdMobx from './simple-mobx.md';
import mdPlain from './simple-plain.md';

const codeEditor = {
  value: '',
};

const propsNormal = {
  selectedIndex: 0,
  width: 400,
  height: 200,
  panels: [
    {
      id: 'preview',
      title: '页面预览',
      type: 'iframe'
    },
    {
      id: 'schema',
      title: 'Schema',
      type: 'editor'
    }
  ]
};

const codeEditorEvent = {
  onChange: value => {
    console.log('代码编辑器内容：', value);
  }
};

const propsModel = createModel(propsNormal);

function onSwitch(panel, index) {
  console.log('当前值：', panel, index);
}

const clickBtn = target => () => {
  if (target && target.setSelectedIndex) {
    target.setSelectedIndex(1);
  } else {
    target.selectedIndex = 1;
  }
};

storiesOf('基础使用', module)
  .addParameters(wInfo(mdMobx))
  .addWithJSX('使用 mobx 化的 props', () => {
    const SwitchPanelWithStore = SwitchPanelAddStore({
      stores: {
        model: propsModel,
        previewer: {
          model: {
            url: '//www.baidu.com'
          }
        },
        codeEditor:{
          model: codeEditor
        }
      }
    });
    return (
      <div>
        <button onClick={clickBtn(propsModel)}>
          更改选中的 panel（会响应）
        </button>
        <SwitchPanelWithStore
          codeEditor={{
            onChange: codeEditorEvent.onChange
          }}
          onSwitch={onSwitch}
        />
      </div>
    );
  })
  .addParameters(wInfo(mdPlain))
  .addWithJSX('普通 props 对象', () => (
    <div>
      <button onClick={clickBtn(propsNormal)}>
        更改选中的 panel（不会响应）
      </button>
      <SwitchPanel
        {...propsNormal}
        codeEditor={{
          ...codeEditor,
          onChange: codeEditorEvent.onChange
        }}
        onSwitch={onSwitch}
      />
    </div>
  ));
