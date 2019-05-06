import { types, IAnyModelType } from 'mobx-state-tree';
import { BASE_CONTROLLED_KEYS } from 'ide-lib-base-component';

import { IStoresModel, IModuleConfig } from 'ide-lib-engine';
import { DEFAULT_PROPS, ISwitchPanelProps } from '.';
import { switchPanel } from './solution';

import { subComponents, ISubProps } from './subs';
import { PanelModel, modelExtends} from './model'

import { router as GetRouter } from './router/get';
import { router as PostRouter } from './router/post';
import { router as PutRouter } from './router/put';
import { router as DelRouter } from './router/del';

export const configSwitchPanel: IModuleConfig<ISwitchPanelProps, ISubProps> = {
  component: {
    className: 'SwitchPanel',
    solution: {
      onSwitch: [switchPanel]
    },
    defaultProps: DEFAULT_PROPS,
    children: subComponents
  },
  router: {
    domain: 'switch-panel',
    list: [GetRouter, PostRouter, PutRouter, DelRouter],
    // hoistRoutes: {
    //   alias: 'bar',
    //   routerNames: 'headerBar'
    // }, // 提升访问子路由功能，相当于是强约束化的 alias
    // aliases: {
    //   alias: 'blockbar',
    //   path: 'bar/headerbar'
    // } // 自定义的路由别名规则
  },
  store: {
    idPrefix: 'ssp'
  },
  model: {
    controlledKeys: [], // 后续再初始化
    props: {
      selectedIndex: types.optional(types.number, 0),
      panels: types.array(types.late((): IAnyModelType => PanelModel)) // 在 mst v3 中， `types.array` 默认值就是 `[]`
      // language: types.optional(
      //   types.enumeration('Type', CODE_LANGUAGES),
      //   ECodeLanguage.JS
      // ),
      // children: types.array(types.late((): IAnyModelType => SchemaModel)) // 在 mst v3 中， `types.array` 默认值就是 `[]`
      // options: types.map(types.union(types.boolean, types.string))
      // 在 mst v3 中， `types.map` 默认值就是 `{}`
    },
    extends: modelExtends
  }
};

// 枚举受 store 控制的 key，一般来自 config.model.props 中 key
// 当然也可以自己枚举
export const SELF_CONTROLLED_KEYS = ['selectedIndex', 'panels', 'width', 'height']; // ['visible', 'text']

export const CONTROLLED_KEYS = BASE_CONTROLLED_KEYS.concat(
  SELF_CONTROLLED_KEYS
);

// 初始化 controlledKeys
configSwitchPanel.model.controlledKeys = CONTROLLED_KEYS;
