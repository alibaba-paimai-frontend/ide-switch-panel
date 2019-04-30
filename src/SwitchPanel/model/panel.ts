import { types, Instance, IAnyModelType, destroy, cast, SnapshotOrInstance } from 'mobx-state-tree';
import { quickInitModel } from 'ide-lib-engine';
import { invariant, isExist } from 'ide-lib-utils';


import { EPanelType, IPanel } from '../mods/Panel';


export function createPanel(panel: IPanel) : IPanelModel{
  invariant(isExist(panel.id), '创建 panel 必须要存在 id 属性');
  const {id, title='untitle', type} = panel;
  return PanelModel.create({
    id, title, type
  });
}

export const PanelModel: IAnyModelType = quickInitModel('PanelModel', {
        id: types.identifier,
        title: types.optional(types.string, ''),
        type: types.optional(
            types.enumeration<EPanelType>('SortType', Object.values(EPanelType)),
            EPanelType.iframe
        ),
        // language: types.optional(
        //   types.enumeration('Type', CODE_LANGUAGES),
        //   ECodeLanguage.JS
        // ),
        // options: types.map(types.union(types.boolean, types.string))
        // 在 mst v3 中， `types.map` 默认值就是 `{}`
        //  ide 的 Options 可选值参考： https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
    })

export interface IPanelModel extends Instance<typeof PanelModel> { }