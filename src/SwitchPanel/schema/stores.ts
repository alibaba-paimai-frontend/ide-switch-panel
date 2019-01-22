import { types, Instance } from 'mobx-state-tree';
import { SwitchPanelModel, ISwitchPanelModel } from './index';
import { createEmptyModel, updateStoresAttribute } from './util';
import {
  Stores as CodeEditorStores,
  IStoresModel as ICodeEditorStores,
  CodeEditorFactory
} from 'ide-code-editor';

export const STORE_ID_PREIX = 'ssp_';

export const Stores = types
  .model('StoresModel', {
    id: types.refinement(
      types.identifier,
      identifier => identifier.indexOf(STORE_ID_PREIX) === 0
    ),
    codeEditor: CodeEditorStores,
    switchPanel: SwitchPanelModel,
    height: types.optional(types.union(types.number, types.string), 'auto')
  })
  .actions(self => {
    return {
      setCodeEditor(codeEditor: ICodeEditorStores) {
        self.codeEditor = codeEditor;
      },
      setSwitchPanel(model: ISwitchPanelModel) {
        self.switchPanel = model;
      },
      setHeight(h: number | string) {
        self.height = h;
      }
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
        const panelsRemoved = (self!.switchPanel as any).toJSON();
        self.setSwitchPanel(createEmptyModel());
        return panelsRemoved;
      }
    };
  });

export interface IStoresModel extends Instance<typeof Stores> {}

let autoId = 1;
/**
 * 工厂方法，用于创建 stores
 */
export function StoresFactory() {
  const {
    app: codeEditorApp,
    client: codeEditorClient,
    stores: codeEditorStores
  } = CodeEditorFactory();
  const stores = Stores.create(
    {
      id: `${STORE_ID_PREIX}${autoId++}`,
      codeEditor: codeEditorStores as any,
      switchPanel: createEmptyModel()
    },
    {
      codeEditorClient
    }
  );

  return {
    stores,
    innerApps: {
      codeEditor: codeEditorApp
    }
  };
}
