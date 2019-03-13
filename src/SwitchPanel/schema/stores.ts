import { cast, types, Instance, SnapshotOrInstance, IAnyModelType } from 'mobx-state-tree';
import {TAnyMSTModel, getSubStoresAssigner, IStoresEnv, getSubAppsFromFactoryMap } from 'ide-lib-base-component';

import { SwitchPanelModel } from './index';
import { createEmptyModel, updateStoresAttribute } from './util';
import {
  Stores as CodeEditorStores,
  CodeEditorFactory
} from 'ide-code-editor';

import {
  Stores as IFramerStores,
  IFrameFactory
} from 'ide-iframe';

export const STORE_ID_PREIX = 'ssp_';

export enum ESubApps {
  codeEditor = 'codeEditor',
  previewer = 'previewer'
};

export const NAMES_SUBAPP = Object.values(ESubApps);

// 定义子 stores 映射关系
export const STORES_SUBAPP: Record<ESubApps, TAnyMSTModel> = {
  codeEditor: CodeEditorStores,
  previewer: IFramerStores
};

// 定义子 facotry 映射关系
export const FACTORY_SUBAPP: Record<ESubApps, (...args: any[]) => IStoresEnv<TAnyMSTModel>> = {
  codeEditor: CodeEditorFactory,
  previewer: IFrameFactory
};

export const Stores: IAnyModelType = types
  .model('StoresModel', {
    id: types.refinement(
      types.identifier,
      identifier => identifier.indexOf(STORE_ID_PREIX) === 0
    ),
    ...STORES_SUBAPP,
    model: SwitchPanelModel
  })
  .actions(self => {
    const assignerInjected = getSubStoresAssigner(self, NAMES_SUBAPP);
    return {
      setModel(model: SnapshotOrInstance<typeof self.model>) {
        self.model = cast(model);
      },
      ...assignerInjected
    };
  })
  .actions(self => {
    return {
      updateAttribute(name: string, value: any) {
        updateStoresAttribute(self as any, name, value);
      }
    };
  })
  .actions(self => {
    return {
      /**
       * 重置 schema，相当于创建空树
       * 影响范围：整棵树
       */
      resetToEmpty() {
        const panelsRemoved = (self!.model as any).toJSON();
        self.setModel(createEmptyModel());
        return panelsRemoved;
      }
    };
  });

export interface IStoresModel extends Instance<typeof Stores> {}

let autoId = 1;

/**
 * 工厂方法，用于创建 stores，同时注入对应子元素的 client 和 app
 */
export function StoresFactory() {
  const { subStores, subApps, subClients } = getSubAppsFromFactoryMap(FACTORY_SUBAPP);

  // see: https://github.com/mobxjs/mobx-state-tree#dependency-injection
  // 依赖注入，方便在 controller 中可以直接调用子组件的 controller
  const stores: IStoresModel = Stores.create(Object.assign({}, {
      id: `${STORE_ID_PREIX}${autoId++}`,
      model: createEmptyModel() as any,
    ...subStores as Record<ESubApps, TAnyMSTModel>
  }), {
      clients: subClients
    }
  );
  

  return {
    stores,
    innerApps: subApps
  };
}
