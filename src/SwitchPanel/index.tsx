import React, { Component, useCallback } from 'react';
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

import { StoresFactory, IStoresModel } from './schema/stores';
import { TSwitchPanelControlledKeys, CONTROLLED_KEYS } from './schema/index';
import { AppFactory } from './controller/index';
import { debugInteract, debugRender } from '../lib/debug';
import { StyledContainer, StyledButtonGroup } from './styles';


type OptionalCodeEditorProps = OptionalProps<
  ICodeEditorProps,
  TCodeEditorControlledKeys
>;
interface ISubComponents {
  CodeEditorComponent: React.ComponentType<OptionalCodeEditorProps>;
}

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
   * 容器的宽度或高度
   *
   * @type {(number | string)}
   * @memberof ISwitchPanelProps
   */
  height?: number | string;
}


export const Panels = observer((props: IPanelProps) => {
  const onSwitchPanel = useCallback((panel: IPanel, index: number) => () => {
    props.onSwitch && props.onSwitch(panel, index);
  }, []);

  const { panels = [], selectedPanelId } = props;
  return (
    (panels.length && (
      <StyledButtonGroup>
        {panels.map((panel, i) => {
          const { title, id } = panel;
          return (
            <Button
              type={selectedPanelId === id ? 'primary' : 'default'}
              onClick={onSwitchPanel(panel, i)}
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
});


export const DEFAULT_PROPS: ISwitchPanelProps = {
  codeEditor: {
    width: 800
  },
  theme: {
    main: '#25ab68'
  },
  styles: {
    container: {}
  }
};

export const SwitchPanelHOC = (subComponents: ISubComponents) => {
  const SwitchPanelHOC = (props: ISwitchPanelProps = DEFAULT_PROPS) => {
    const { CodeEditorComponent } = subComponents;
    const mergedProps = Object.assign({}, DEFAULT_PROPS, props);
    const { codeEditor, styles, panels,
      selectedPanelId,
      height,
      onSwitch } = mergedProps;

    return (
      <StyledContainer
        style={styles.container}
        height={height}
        width={codeEditor.width}
        // ref={this.root}
        className="ide-switch-panel-container"
      >
        <CodeEditorComponent {...codeEditor} />
        <Panels
          panels={panels}
          selectedPanelId={selectedPanelId}
          onSwitch={onSwitch}
        />
      </StyledContainer>
    );
  };
  SwitchPanelHOC.displayName = 'SwitchPanelHOC';
  return observer(based(SwitchPanelHOC));
};

// 采用高阶组件方式生成普通的 SwitchPanel 组件
export const SwitchPanel = SwitchPanelHOC({
  CodeEditorComponent: CodeEditor
});

/* ----------------------------------------------------
    以下是专门配合 store 时的组件版本
----------------------------------------------------- */

/**
 * 科里化创建 SwitchPanelWithStore 组件
 * @param stores - store 模型实例
 */
export const SwitchPanelAddStore = (storesEnv: IStoresEnv<IStoresModel>) => {
  const { stores } = storesEnv;
  const SwitchPanelHasSubStore = SwitchPanelHOC({
    // @ts-ignore
    CodeEditorComponent: CodeEditorAddStore(extracSubEnv<IStoresModel, ICodeEditorStoresModel>(storesEnv, 'codeEditor'))  
  });

  const SwitchPanelWithStore = (props: Omit<ISwitchPanelProps, TSwitchPanelControlledKeys>) => {
  const { codeEditor,...otherProps } = props;
  const { model } = stores;
  const controlledProps = pick(model, CONTROLLED_KEYS);
  debugRender(`[${stores.id}] rendering`);

  const codeEditorWithInjected = useIndectedEvents<ICodeEditorProps, IStoresModel>(storesEnv, codeEditor, {
    'onChange': []
  });

    const otherPropsWithInjected = useIndectedEvents<ISwitchPanelProps, IStoresModel>(storesEnv, otherProps, {
    'onSwitch': []
  });

  return (
      <SwitchPanelHasSubStore
      codeEditor={codeEditorWithInjected }
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
