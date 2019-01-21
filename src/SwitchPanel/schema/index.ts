import { types, Instance, IAnyModelType } from 'mobx-state-tree';

import { debugModel } from '../../lib/debug';
import { pick, invariant } from '../../lib/util';
import { updateModelAttribute, updatePanel } from './util';
import { IPanel } from '../index';

// export enum ECodeLanguage {
//   JSON = 'json',
//   JS = 'javascript',
//   TS = 'typescript'
// }
// export const CODE_LANGUAGES = Object.values(ECodeLanguage);

export const PanelModel = types
  .model('PanelModel', {
    id: types.identifier,
    title: types.optional(types.string, '')
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
      allAttibuteWithFilter(filterArray?: string | string[]) {
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

/**
 * SwitchPanel 对应的模型
 */
export const SwitchPanelModel = types
  .model('SwitchPanelModel', {
    selectedPanelId: types.optional(types.string, ''),
    // language: types.optional(
    //   types.enumeration('Type', CODE_LANGUAGES),
    //   ECodeLanguage.JS
    // ),
    panels: types.array(types.late((): IAnyModelType => PanelModel)) // 在 mst v3 中， `types.array` 默认值就是 `[]`
    // 在 mst v3 中， `types.map` 默认值就是 `{}`
    //  ide 的 Options 可选值参考： https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  })
  .views(self => {
    return {
      /**
       * 只返回当前模型的属性，可以通过 filter 字符串进行属性项过滤
       */
      allAttibuteWithFilter(filterArray?: string | string[]) {
        if (!filterArray) return self;
        const filters = [].concat(filterArray || []);
        return pick(self, filters);
      },

      findPanel(id: string) {
        let target = null;
        if (!id) return target;
        self.panels.some(panel => {
          if (panel.id === id) {
            target = panel;
            return true;
          }
          return false;
        });
        return target;
      }
    };
  })
  .actions(self => {
    return {
      setPanels(panels: IPanel[] | string = []) {
        if (typeof panels === 'string') {
          self.panels = JSON.parse(panels);
        } else {
          self.panels = panels as any;
        }
      },
      setSelectedPanelId(id?: string) {
        self.selectedPanelId = id || '';
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
        const panel = self.findPanel(id);

        // 找到节点后调用方法去更新
        if (!!panel) {
          return panel.updateAttribute(attrName, value)
        }
        return false;
      }
    };
  });

export interface ISwitchPanelModel extends Instance<typeof SwitchPanelModel> {}
