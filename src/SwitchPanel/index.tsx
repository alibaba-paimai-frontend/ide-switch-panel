import React, { Component, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from 'antd';
import { pick } from 'ide-lib-utils';
import { based, Omit, OptionalProps, IBaseTheme, IBaseComponentProps, IStoresEnv, useIndectedEvents, extracSubEnv } from 'ide-lib-base-component';

import {
  CodeEditor,
  IStoresModel as ICodeEditorStoresModel,
  CodeEditorAddStore,
  ICodeEditorProps,
  TCodeEditorControlledKeys
} from 'ide-code-editor';

import { IFrame, IIFrameProps, TIFrameControlledKeys, IStoresModel as IIFrameStoresModel, IFrameAddStore} from 'ide-iframe';

import { StoresFactory, IStoresModel } from './schema/stores';
import { TSwitchPanelControlledKeys, CONTROLLED_KEYS } from './schema/index';
import { AppFactory } from './controller/index';
import { debugInteract, debugRender } from '../lib/debug';
import { StyledContainer, StyledButtonGroup, StyledPanelWrap } from './styles';
import { switchPanel } from './solution/index';


type OptionalCodeEditorProps = OptionalProps<
  ICodeEditorProps,
  TCodeEditorControlledKeys
>;
type OptionalIFrameProps = OptionalProps<IIFrameProps, TIFrameControlledKeys>;

interface ISubComponents {
  CodeEditorComponent: React.ComponentType<OptionalCodeEditorProps>;
  IFrameComponent: React.ComponentType<OptionalIFrameProps>;
}

// 不同面板对应的类型，目前只有 编辑器 和 iframe 两种
export enum EPanelType {
  editor = 'editor',
  iframe = 'iframe'
}

export interface IPanel {
  id: string;
  title?: string;
  type: EPanelType; // 面板类型
}

export interface IPanelEvent {
  /**
   * 点击回调函数
   */
  onSwitch?: (panel: IPanel, index: number) => () => void;
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
  selectedIndex?: number | string;

  /**
   * 容器的宽度
   *
   * @type {(number | string)}
   * @memberof ISwitchPanelProps
   */
  width?: number | string;

  /**
   * 按钮的高度
   *
   * @type {(number | string)}
   * @memberof ISwitchPanelProps
   */
  buttonHeight?: number | string;
}


export interface ISwitchPanelTheme extends IBaseTheme{
  main: string;
}

export interface ISwitchPanelEvent {}

export interface ISwitchPanelProps extends ISwitchPanelEvent, IPanelProps, IBaseComponentProps {
  /**
   * 代码编辑器属性对象
   *
   * @type {OptionalCodeEditorProps}
   * @memberof ISwitchPanelProps
   */
  codeEditor?: OptionalCodeEditorProps;


  /**
  * iframe 预览组件
  *
  * @type {OptionalIFrameProps}
  * @memberof ISwitchPanelProps
  */
  previewer?: OptionalIFrameProps;

  /**
   * 容器的高度
   *
   * @type {(number | string)}
   * @memberof ISwitchPanelProps
   */
  height?: number | string;

}


export const Panels: React.FunctionComponent<IPanelProps> = observer((props) => {

  const { panels = [], selectedIndex, onSwitch, width, buttonHeight = 30 } = props;
  return (
    (panels.length && (
      <StyledButtonGroup width={width}>
        {panels.map((panel, i) => {
          const { title } = panel;
          return (
            <Button
              type={selectedIndex === i ? 'primary' : 'default'}
              onClick={onSwitch(panel, i)}
              style={{
                flex: '1',
                borderRadius: 0,
                height: buttonHeight
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
});


export const DEFAULT_PROPS: ISwitchPanelProps = {
  selectedIndex: 0,
  buttonHeight: 30,
  panels: [
    {
      id: 'preview',
      title: '页面预览',
      type: EPanelType.iframe
    },
    {
      id: 'schema',
      title: 'Schema',
      type: EPanelType.editor
    },
    {
      id: 'fns',
      title: '回调函数',
      type: EPanelType.editor
    },
  ],
  width: '100%',
  theme: {
    main: '#25ab68'
  },
  styles: {
    container: {}
  }
};

export const SwitchPanelHOC: (subComponents: ISubComponents) => React.FunctionComponent<ISwitchPanelProps> = (subComponents) => {
  const SwitchPanelHOC = (props: ISwitchPanelProps) => {
    const { CodeEditorComponent, IFrameComponent } = subComponents;
    const mergedProps = Object.assign({}, DEFAULT_PROPS, props);
    const { codeEditor = {}, previewer = {}, styles, panels,
      selectedIndex,
      height, width, buttonHeight } = mergedProps;

    // 需要同步更新子元素的宽度
    codeEditor.width = width;
    codeEditor.height = height;
    codeEditor.visible = true;

    previewer.styles = previewer.styles || {};
    previewer.styles.container = Object.assign({}, previewer.styles.container || {}, {width, height});

    const [pIndex, setPIndex] = useState(selectedIndex);

    useEffect(()=>{
      setPIndex(props.selectedIndex);
    }, [props.selectedIndex])

    const onSwitchPanel = useCallback((panel: IPanel, index: number) => () => {
      if(index === pIndex) return;
      setPIndex(index);
      props.onSwitch && props.onSwitch(panel, index);
    }, [props.onSwitch, pIndex]);

    // 根据当前的选择的配置项，获取其中的 props ，然后 merge 过来，自定义配置的优先级最高
    const selectedPanel = panels[+pIndex];

    return (
      <StyledContainer
        style={styles.container}
        height={height}
        buttonHeight={buttonHeight}
        width={width}
        // ref={this.root}
        className="ide-switch-panel-container"
      >
        <StyledPanelWrap visible={selectedPanel.type === EPanelType.iframe}>
          <IFrameComponent {...previewer}/>
        </StyledPanelWrap>

        <StyledPanelWrap visible={selectedPanel.type === EPanelType.editor}>
          <CodeEditorComponent {...codeEditor} />
        </StyledPanelWrap>
        <Panels
          panels={panels}
          width={width}
          buttonHeight={buttonHeight}
          selectedIndex={pIndex}
          onSwitch={onSwitchPanel}
        />
      </StyledContainer>
    );
  };
  SwitchPanelHOC.displayName = 'SwitchPanelHOC';
  return observer(based(SwitchPanelHOC, DEFAULT_PROPS));
};

// 采用高阶组件方式生成普通的 SwitchPanel 组件
export const SwitchPanel = SwitchPanelHOC({
  CodeEditorComponent: CodeEditor,
  IFrameComponent: IFrame
});

/* ----------------------------------------------------
    以下是专门配合 store 时的组件版本
----------------------------------------------------- */

/**
 * 科里化创建 SwitchPanelWithStore 组件
 * @param stores - store 模型实例
 */
export const SwitchPanelAddStore: (storesEnv: IStoresEnv<IStoresModel>) => React.FunctionComponent<ISwitchPanelProps> = (storesEnv) => {
  const { stores } = storesEnv;
  const SwitchPanelHasSubStore = SwitchPanelHOC({
    // @ts-ignore
    CodeEditorComponent: CodeEditorAddStore(extracSubEnv<IStoresModel, ICodeEditorStoresModel>(storesEnv, 'codeEditor')),
    // @ts-ignore
    IFrameComponent: IFrameAddStore(extracSubEnv<IStoresModel, IIFrameStoresModel>(storesEnv, 'previewer'))
  });

  const SwitchPanelWithStore = (props: Omit<ISwitchPanelProps, TSwitchPanelControlledKeys>) => {
  const { codeEditor = {}, previewer = {}, ...otherProps } = props;
  const { model } = stores;
  const controlledProps = pick(model, CONTROLLED_KEYS);
  debugRender(`[${stores.id}] rendering`);

  const codeEditorWithInjected = useIndectedEvents<ICodeEditorProps, IStoresModel>(storesEnv, codeEditor, {
    'onChange': []
  });
  const previewerWithInjected = useIndectedEvents<IIFrameProps, IStoresModel>(storesEnv, previewer, {
    'handleFrameTasks': []
  });

    const otherPropsWithInjected = useIndectedEvents<ISwitchPanelProps, IStoresModel>(storesEnv, otherProps, {
      'onSwitch': [switchPanel]
  });

  return (
      <SwitchPanelHasSubStore
      codeEditor={codeEditorWithInjected }
      previewer={previewerWithInjected}
      {...controlledProps }
      {...otherPropsWithInjected }
      />
    );
};

  SwitchPanelWithStore.displayName = 'SwitchPanelWithStore';
  return observer(SwitchPanelWithStore);
}
  

/**
 * 生成 env 对象，方便在不同的状态组件中传递上下文
 */
export const SwitchPanelStoresEnv = () => {
  const { stores, innerApps } = StoresFactory(); // 创建 model
  const app = AppFactory(stores, innerApps); // 创建 controller，并挂载 model
  return {
    stores,
    app,
    client: app.client,
    innerApps: innerApps
  };
}

/**
 * 工厂函数，每调用一次就获取一副 MVC
 * 用于隔离不同的 SwitchPanelWithStore 的上下文
 */
export const SwitchPanelFactory = () => {
  const storesEnv = SwitchPanelStoresEnv();
  return {
    ...storesEnv,
    SwitchPanelWithStore: SwitchPanelAddStore(storesEnv)
  }
};
