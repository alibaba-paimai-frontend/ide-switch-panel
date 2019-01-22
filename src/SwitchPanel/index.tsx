import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import {
  CodeEditor,
  ICodeEditorEvent,
  ICodeEditorProps,
  onChangeWithStore
} from 'ide-code-editor';

import { StoresFactory, IStoresModel } from './schema/stores';
import { AppFactory } from './controller/index';
import { debugInteract, debugRender } from '../lib/debug';
import { StyledContainer, StyledButtonGroup } from './styles';

export interface IPanel {
  id: string;
  title?: string;
}

export interface IPanelEvent {
  /**
   * 点击回调函数
   */
  onSwitch?: (panel: IPanel, index: number) => void;
}

export interface IPanelProps extends IPanelEvent {
  /**
   * 面板数据数组
   * 默认值：[]
   *
   * @type {IPanel[]} - 面板数组
   * @memberof ISwitchPanelProps
   */
  panels?: IPanel[];

  /**
   * 选中的 panel id 值
   * 默认值：''
   *
   * @type {string}
   * @memberof ISwitchPanelProps
   */
  selectedPanelId?: string;
}

export interface ISwitchPanelEvent {
  codeEditorEvent: ICodeEditorEvent;
}

export interface ISwitchPanelProps extends ISwitchPanelEvent, IPanelProps {
  /**
   * 代码编辑器属性对象
   *
   * @type {ICodeEditorStoresModel}
   * @memberof ISwitchPanelProps
   */
  codeEditor?: ICodeEditorProps;

  /**
   * 容器的宽度或高度
   *
   * @type {(number | string)}
   * @memberof ISwitchPanelProps
   */
  height?: number | string;
}

@observer
export class Panels extends Component<IPanelProps> {
  onSwitchPanel = (panel: IPanel, index: number) => () => {
    const { onSwitch } = this.props;
    onSwitch && onSwitch(panel, index);
  };
  render() {
    const { panels = [], selectedPanelId } = this.props;

    return (
      (panels.length && (
        <StyledButtonGroup>
          {panels.map((panel, i) => {
            const { title, id } = panel;
            return (
              <Button
                type={selectedPanelId === id ? 'primary' : 'default'}
                onClick={this.onSwitchPanel(panel, i)}
                style={{
                  flex: '1',
                  height: '30px'
                }}
                size={'large'}
                key={'' + i}
              >
                {title}
              </Button>
            );
          })}
        </StyledButtonGroup>
      )) ||
      null
    );
  }
}

// 推荐使用 decorator 的方式，否则 stories 的导出会缺少 **Prop Types** 的说明
// 因为 react-docgen-typescript-loader 需要  named export 导出方式
@observer
export class SwitchPanel extends Component<ISwitchPanelProps> {
  // private root: React.RefObject<HTMLDivElement>;
  constructor(props: ISwitchPanelProps) {
    super(props);
    this.state = {};
    // this.root = React.createRef();
  }

  render() {
    const {
      codeEditor = {},
      codeEditorEvent,
      panels,
      selectedPanelId,
      height,
      onSwitch
    } = this.props;

    return (
      <StyledContainer
        height={height}
        width={codeEditor.width || 800}
        // ref={this.root}
        className="ide-switch-panel-container"
      >
        <CodeEditor {...codeEditor} {...codeEditorEvent} />
        <Panels
          panels={panels}
          selectedPanelId={selectedPanelId}
          onSwitch={onSwitch}
        />
      </StyledContainer>
    );
  }
}

/* ----------------------------------------------------
    以下是专门配合 store 时的组件版本
----------------------------------------------------- */

export const onSwitchWithStore = (
  stores: IStoresModel,
  onSwitch: (panel: IPanel, index: number) => void
) => (panel: IPanel, index: number) => {
  // 更新选中的 Panel 状态
  stores.switchPanel.setSelectedPanelId(panel.id);
  onSwitch && onSwitch(panel, index);
};
/**
 * 科里化创建 SwitchPanelWithStore 组件
 * @param stores - store 模型实例
 */
export const SwitchPanelAddStore = (stores: IStoresModel) =>
  observer(function SwitchPanelWithStore(props: ISwitchPanelProps) {
    const { onSwitch, codeEditorEvent = {}, ...otherPops } = props;
    const { codeEditor, switchPanel, height } = stores;
    const { panels, selectedPanelId } = switchPanel;
    const { onChange, ...otherCodeEditorEvent } = codeEditorEvent;
    debugRender(`[${stores.id}] rendering`);
    return (
      <SwitchPanel
        height={height}
        codeEditor={codeEditor!.editor as any}
        panels={panels}
        selectedPanelId={selectedPanelId}
        onSwitch={onSwitchWithStore(stores, onSwitch)}
        codeEditorEvent={{
          onChange: onChangeWithStore(codeEditor, onChange),
          ...otherCodeEditorEvent
        }}
        {...otherPops}
      />
    );
  });
/**
 * 工厂函数，每调用一次就获取一副 MVC
 * 用于隔离不同的 SwitchPanelWithStore 的上下文
 */
export const SwitchPanelFactory: any = () => {
  const { stores, innerApps } = StoresFactory(); // 创建 model
  const app = AppFactory(stores, innerApps); // 创建 controller，并挂载 model
  return {
    stores,
    app,
    client: app.client,
    SwitchPanelWithStore: SwitchPanelAddStore(stores)
  };
};
