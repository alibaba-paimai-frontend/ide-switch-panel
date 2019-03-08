import Router from 'ette-router';
import { updateStylesMiddleware, updateThemeMiddleware, buildNormalResponse } from 'ide-lib-base-component';
import { getEnv } from 'mobx-state-tree';

import { IContext } from './helper';
import { TSwitchPanelControlledKeys } from '../schema/index';
export const router = new Router();

// 更新 store 属性
router.put('panels', '/panels', async function(ctx: IContext) {
  const { stores, request } = ctx;
  const { name, value } = request.data;

  const originValue = stores.model[name as TSwitchPanelControlledKeys];
  const isSuccess = stores.model.updateAttribute(name, value);

  // 同时需要调整 editor 的高度
  if (name === 'height') {
    const { clients } = getEnv(stores);
    clients.codeEditor.model.setHeight(value);
  }

  buildNormalResponse(ctx, 200, { success: isSuccess, origin: originValue }, `属性 ${name} 的值从 ${originValue} -> ${value} 的变更: ${isSuccess}`);
});

// 更新指定 panel 的属性
router.put('updatePanelById', '/panels/:id', function(ctx: IContext) {
  const { stores, request } = ctx;
  const { name, value } = request.data;
  const { id } = ctx.params;

  const targetPanel = stores.model.findPanel(id);
  const isSuccess = stores.model.updateAttributeById(id, name, value);

  buildNormalResponse(ctx, 200, { success: isSuccess, origin: targetPanel }, `属性 ${name} 的值从 ${targetPanel && (targetPanel as any)[name]} -> ${value} 的变更: ${isSuccess}`);
});

// 更新选择
router.put('updateSelection', '/panels/selection/:id', function(ctx: IContext) {
  const { stores, params } = ctx;
  const { id } = params;

  // stores.setSchema(createSchemaModel(schema));
  stores.model.setSelectedIndex(id);

  buildNormalResponse(ctx, 200, { success: true });
});

// 更新 css 属性
router.put('model', '/model/styles/:target', updateStylesMiddleware('model'));
// 更新 theme 属性
router.put('model', '/model/theme/:target', updateThemeMiddleware('model'));

