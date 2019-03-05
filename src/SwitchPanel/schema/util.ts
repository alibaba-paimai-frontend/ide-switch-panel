import { updateInScope, BASE_CONTROLLED_KEYS } from 'ide-lib-base-component'
import { invariant, capitalize, pick, isExist } from 'ide-lib-utils';

import { debugModel } from '../../lib/debug';
import {
  ISwitchPanelProps,
  IPanel,
  IPanelProps,
  PanelModel,
  ISwitchPanelModel,
  SwitchPanelModel,
  DEFAULT_PROPS
} from '../../index';
import { IPanelModel } from './index';

/**
 * 将普通对象转换成 Model
 * @param modelObject - 普通的对象
 */
export function createModel(modelObject: IPanelProps = DEFAULT_PROPS): ISwitchPanelModel {
  const mergedProps = Object.assign({}, DEFAULT_PROPS, modelObject);

  if (!mergedProps.panels) {
    mergedProps.panels = [];
  }

  const { theme, styles } = mergedProps;

  const model = SwitchPanelModel.create({
    selectedPanelId: mergedProps.selectedPanelId,
    panels: mergedProps.panels.map(panel => {
      invariant(!!panel.id, '[createModel] panel.id 不能为空');
      return PanelModel.create({
        id: panel.id,
        title: panel.title
      });
    })
  });
  model.setStyles(styles || {});
  model.setTheme(theme);

  return model;
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
// 定义 panel 可更新信息的属性
const PANEL_EDITABLE_ATTRIBUTE = ['id', 'title'];
export const updatePanel = updateInScope(PANEL_EDITABLE_ATTRIBUTE);

// 定义 panels 可更新信息的属性
const EDITABLE_ATTRIBUTE = BASE_CONTROLLED_KEYS.concat(['selectedPanelId', 'panels']);
export const updateModelAttribute = updateInScope(EDITABLE_ATTRIBUTE);

// 定义 switch panel 可更新信息的属性
const STORES_EDITABLE_ATTRIBUTE = ['height'];
export const updateStoresAttribute = updateInScope(STORES_EDITABLE_ATTRIBUTE);
