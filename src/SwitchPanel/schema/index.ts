import { types, Instance, IAnyModelType, destroy, cast, SnapshotOrInstance } from 'mobx-state-tree';
import { pick } from 'ide-lib-utils';
import { BaseModel, IBaseModel, TBaseControlledKeys, BASE_CONTROLLED_KEYS, stringLiterals, ElementType } from 'ide-lib-base-component';

import { debugModel } from '../../lib/debug';
import {
  updateModelAttribute,
  updatePanel,
  findById,
  createPanel
} from './util';
import { IPanel, EPanelType } from '../index';

// export enum ECodeLanguage {
//   JSON = 'json',
//   JS = 'javascript',
//   TS = 'typescript'
// }
// export const CODE_LANGUAGES = Object.values(ECodeLanguage);

// 获取被 store 控制的 model key 的列表
export type TPanelControlledKeys =
  keyof SnapshotOrInstance<typeof PanelModel>;

export const PANEL_CONTROLLED_KEYS: string[] = [
  'id',
  'title',
  'type'
];

export const PanelModel: IAnyModelType = types
  .model('PanelModel', {
    id: types.identifier,
    title: types.optional(types.string, ''),
    type: types.optional(types.string, ''),
    // language: types.optional(
    //   types.enumeration('Type', CODE_LANGUAGES),
    //   ECodeLanguage.JS
    // ),
    // options: types.map(types.union(types.boolean, types.string))
    // 在 mst v3 中， `types.map` 默认值就是 `{}`
    //  ide 的 Options 可选值参考： https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  })
  .views(self => {
    return {
      /**
       * 只返回当前模型的属性，可以通过 filter 字符串进行属性项过滤
       */
      allAttibuteWithFilter(filterArray: string | string[] = PANEL_CONTROLLED_KEYS) {
        if (!filterArray) return self;
        const filters = [].concat(filterArray || []);
        return pick(self, filters);
      }
    };
  })
  .actions(self => {
    return {
      setId(id: string) {
        self.id = id;
      },
      setTitle(title: string) {
        self.title = title;
      },
      setType(type: EPanelType) {
        self.type = type;
      }
    };
  })
  .actions(self => {
    return {
      updateAttribute(name: string, value: any) {
        return updatePanel(self as any, name, value);
      }
    };
  });

export interface IPanelModel extends Instance<typeof PanelModel> {}


const SELF_CONTROLLED_KEYS = stringLiterals('selectedIndex', 'panels', 'width', 'height');
export const CONTROLLED_KEYS = BASE_CONTROLLED_KEYS.concat(SELF_CONTROLLED_KEYS);

// 获取被 store 控制的 model key 的列表，
// note: 由于 使用 BaseModel 继承获得，用 awesome-typescript-load 解析不出来，只能自己定义了
export type TSwitchPanelControlledKeys = ElementType<typeof SELF_CONTROLLED_KEYS> | TBaseControlledKeys;


/**
 * 这里的 IAnyModelType 声明是特意的 hack
 * 当模型类型从 BaseModel 导出时，TS 类型推断出错，导致无法生成 schema/index.d.ts 和 schema/stores.d.ts
 * 所以特意将其隔离出来，希望以后找到方法来规避
 */
/**
 * SwitchPanel 对应的模型
 */
export const SwitchPanelModel: IAnyModelType = BaseModel
  .named('SwitchPanelModel')
  .props({
    height: types.optional(types.union(types.number, types.string), 'auto'),
    width: types.optional(types.union(types.number, types.string), 'auto'),
    selectedIndex: types.optional(types.number, 0),
    panels: types.array(types.late((): IAnyModelType => PanelModel)) // 在 mst v3 中， `types.array` 默认值就是 `[]`
    // 在 mst v3 中， `types.map` 默认值就是 `{}`
    //  ide 的 Options 可选值参考： https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  })
  .views(self => {
    return {
      /**
       * 只返回当前模型的属性，可以通过 filter 字符串进行属性项过滤
       */
      allAttibuteWithFilter(filterArray: string | string[] = CONTROLLED_KEYS) {
        if (!filterArray) return self;
        const filters = [].concat(filterArray || []);
        return pick(self, filters);
      },

      get panelIds() {
        return self.panels.map(o => o.id);
      },

      /**
       * 根据 id 返回后代节点（不一定是直系子节点），如果有过滤条件，则返回符合过滤条件的节点
       */
      findPanel(id: string, filterArray?: string | string[]) {
        return findById(self as any, id, filterArray);
      }
    };
  })
  .actions(self => {
    return {
      setHeight(h: number | string) {
        self.height = h;
      },
      setWidth(w: number | string) {
        self.width = w;
      },
      setPanels(panels: SnapshotOrInstance<typeof self.panels> | string = []) {
        if (typeof panels === 'string') {
          self.panels = JSON.parse(panels);
        } else {
          self.panels = cast(panels);
        }
      },
      setSelectedIndex(id?: number | string) {
        self.selectedIndex = +id || 0;
      }
    };
  })
  .actions(self => {
    return {
      addPanel(targetIndex: number, panel: IPanel): boolean {
        const len = self.panelIds.length;
        if (targetIndex > len || targetIndex < 0) {
          debugModel(
            `[addPanel] 目标 index: ${targetIndex} 超出可插入数组范围 [0, ${len}]`
          );
          return false;
        }
        const hasExist = !!~self.panelIds.indexOf(panel.id);
        if (hasExist) {
          debugModel(`[addPanel] 已经存在 id 为 ${panel.id} 的 panel`);
          return false;
        }

        const model = createPanel(panel);
        // 通过 slice 转成数组实现 splice
        const panels = self.panels.slice();
        panels.splice(targetIndex, 0, model);
        self.panels = panels as any;

        return true;
      }
    };
  })
  .actions(self => {
    return {
      updateAttribute(name: string, value: any) {
        return updateModelAttribute(self as any, name, value);
      },
      /**
       * 更新当前节点下的后代节点属性
       * 影响属性：后代节点中 attrName 对应的属性
       */
      updateAttributeById: (
        id: string,
        attrName: string,
        value: string | object
      ): boolean => {
        if (!id) return false;
        // 首先找到 panel
        const panel = self.findPanel(id) as IPanelModel;

        // 找到节点后调用方法去更新
        if (!!panel) {
          return panel.updateAttribute(attrName, value);
        }
        return false;
      }
    };
  })
  .actions(self => {
    return {
      removePanel(id: string): false | IPanelModel {
        if (!id) return false;

        const panel = self.findPanel(id); // 找到指定的节点

        if (panel) {
          const panelRemoved = (panel as any).toJSON();
          destroy(panel as IPanelModel); // 从 mst 中移除节点
          return panelRemoved;
        }

        return false;
      }
    };
  });

export interface ISwitchPanelModel extends Instance<typeof SwitchPanelModel> {}
