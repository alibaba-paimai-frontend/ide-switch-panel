import React from 'react';
import { storiesOf } from '@storybook/react';
import { wInfo } from '../../.storybook/utils';

import { SwitchPanel, createModel, SwitchPanelAddStore } from '../../src/';
import mdMobx from './simple-mobx.md';
import mdPlain from './simple-plain.md';

const codeEditor = {
  value: '',
  width: 600,
  height: 400
};

const propsNormal = {
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
  if (target && target.setSelectedPanelId) {
    target.setSelectedPanelId('preview');
  } else {
    target.selectedPanelId = 'preview';
  }
};

storiesOf('基础使用', module)
  .addParameters(wInfo(mdMobx))
  .addWithJSX('使用 mobx 化的 props', () => {
    const SwitchPanelWithStore = SwitchPanelAddStore({
      stores: {
        model: propsModel,
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
        onEditor={{
          ...codeEditor,
          onChange: codeEditorEvent.onChange
        }}
        onSwitch={onSwitch}
      />
    </div>
  ));
