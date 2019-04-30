import { ValueOf } from 'ide-lib-base-component';
import { IComponentConfig } from 'ide-lib-engine';

import {
  CodeEditor,
  Stores as CodeEditorStores,
  DEFAULT_PROPS as DEFAULT_PROPS_CODE_EDITOR,
  CodeEditorAddStore,
  ICodeEditorProps,
  CodeEditorFactory
} from 'ide-code-editor';

import {
  IFrame,
  Stores as IFrameStores,
  DEFAULT_PROPS as DEFAULT_PROPS_IFRAME,
  IIFrameProps,
  IFrameFactory,
  IFrameAddStore
} from 'ide-iframe';

import {
  FunctionSets,
  FunctionSetsStoresModel,
  DEFAULT_PROPS as DEFAULT_PROPS_FUNCTION_SETS,
  IFunctionSetsProps,
  FunctionSetsFactory,
  FunctionSetsAddStore
} from 'ide-function-sets';



export interface ISubProps {
  codeEditor?: ICodeEditorProps;
  previewer?: IIFrameProps;
  fnSets?: IFunctionSetsProps;
}

// component: 子组件属性列表
export const subComponents: Record<
  keyof ISubProps,
  IComponentConfig<ValueOf<ISubProps>, any>
> = {
  codeEditor: {
    className: 'CodeEditor',
    namedAs: 'codeEditor',
    defaultProps: DEFAULT_PROPS_CODE_EDITOR,
    normal: CodeEditor,
    addStore: CodeEditorAddStore,
    storesModel: CodeEditorStores,
    factory: CodeEditorFactory,
    routeScope: ['editor'] // 能通过父组件访问到的路径
  },

  previewer: {
    className: 'IFrame',
    namedAs: 'previewer',
    defaultProps: DEFAULT_PROPS_IFRAME,
    normal: IFrame,
    addStore: IFrameAddStore,
    storesModel: IFrameStores,
    factory: IFrameFactory,
    routeScope: ['iframe'] // 能通过父组件访问到的路径
  },

  fnSets: {
    className: 'FunctionSets',
    namedAs: 'fnSets',
    defaultProps: DEFAULT_PROPS_FUNCTION_SETS,
    normal: FunctionSets,
    addStore: FunctionSetsAddStore,
    storesModel: FunctionSetsStoresModel,
    factory: FunctionSetsFactory,
    routeScope: ['model'] // 能通过父组件访问到的路径
  },

};
