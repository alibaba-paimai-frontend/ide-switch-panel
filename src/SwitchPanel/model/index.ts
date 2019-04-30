import { types, cast, IAnyModelType, destroy } from 'mobx-state-tree';
import { pick } from 'ide-lib-utils';


import { IPanelModel, createPanel} from './panel';
import {IPanel} from '../mods/Panel';
import { debugModel } from '../../lib/debug';

export * from './panel';

export function modelExtends(model: IAnyModelType) {
   return model.views(self=>{
    return {
        get panelIds() {
            return self.panels.map((o:IPanelModel) => o.id);
        },
        /**
       * 根据 id 返回后代节点（不一定是直系子节点），如果有过滤条件，则返回符合过滤条件的节点
       */
        findPanel(id: string, filterArray?: string | string[]) {
            if (!id) return null;

            let targetPanel = null;
            const filters = [].concat(filterArray || []); // 使用逗号隔开

            self.panels.some((panel: IPanelModel) => {
                if (panel.id === id) {
                    targetPanel = filters.length ? pick(panel, filters) : panel;
                    return true;
                }
            });
            return targetPanel;
        }
    }
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
}