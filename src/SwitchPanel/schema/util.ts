import { types, destroy, IAnyModelType, Instance } from 'mobx-state-tree';
import { debugModel } from '../../lib/debug';
import { invariant, capitalize, pick, isExist } from '../../lib/util';
import {
  ISwitchPanelProps,
  IPanel,
  IPanelProps,
  PanelModel,
  ISwitchPanelModel,
  SwitchPanelModel,
  IStoresModel
} from '../../index';
import { IPanelModel } from './index';

/**
 * 将普通对象转换成 Model
 * @param modelObject - 普通的对象
 */
export function createModel(modelObject: IPanelProps = {}): ISwitchPanelModel {
  invariant(!!modelObject, 'modelObject 对象不能为空');

  if (!modelObject.panels) {
    modelObject.panels = [];
  }

  return SwitchPanelModel.create({
    selectedPanelId: modelObject.selectedPanelId,
    panels: modelObject.panels.map(panel => {
      invariant(!!panel.id, '[createModel] panel.id 不能为空');
      return PanelModel.create({
        id: panel.id,
        title: panel.title
      });
    })
  });
}

/**
 * 创建新的空白
 */
export function createEmptyModel() {
  return createModel({});
}

export function createPanel(panel: IPanel) : IPanelModel{
  invariant(isExist(panel.id), '创建 panel 必须要存在 id 属性');
  const {id, title='untitle'} = panel;
  return PanelModel.create({
    id, title
  });
}

export function findById(
  model: ISwitchPanelModel | ISwitchPanelProps,
  id: string,
  filterArray?: string | string[]
): IPanelModel | IPanelProps | null {
  if (!id) return null;

  let targetPanel = null;
  const filters = [].concat(filterArray || []); // 使用逗号隔开

  model.panels.some((panel: IPanel) => {
    if (panel.id === id) {
      targetPanel = filters.length ? pick(panel, filters) : panel;
      return true;
    }
  });

  return targetPanel;
}

/* ----------------------------------------------------
    更新指定 enum 中的属性
----------------------------------------------------- */
const update = (valueSet: string[]) => (
  item: ISwitchPanelModel | IStoresModel,
  attrName: string,
  value: any
): boolean => {
  invariant(!!item, '入参 item 必须存在');
  // 如果不是可更新的属性，那么将返回 false
  if (!valueSet.includes(attrName)) {
    debugModel(
      `[更新属性] 属性名 ${attrName} 不属于可更新范围，无法更新成 ${value} 值；（附:可更新属性列表：${valueSet}）`
    );
    return false;
  }

  const functionName = `set${capitalize(attrName)}`; // 比如 attrName 是 `type`, 则调用 `setType` 方法
  (item as any)[functionName](value);
  return true;
};

// 定义 panel 可更新信息的属性
const PANEL_EDITABLE_ATTRIBUTE = ['id', 'title'];
export const updatePanel = update(PANEL_EDITABLE_ATTRIBUTE);

// 定义 panels 可更新信息的属性
const EDITABLE_ATTRIBUTE = ['selectedPanelId', 'panels'];
export const updateModelAttribute = update(EDITABLE_ATTRIBUTE);

// 定义 switch panel 可更新信息的属性
const STORES_EDITABLE_ATTRIBUTE = ['height'];
export const updateStoresAttribute = update(STORES_EDITABLE_ATTRIBUTE);
