import Router from 'ette-router';
import { isExist } from 'ide-lib-utils';
import { buildNormalResponse } from 'ide-lib-base-component';


import { IContext } from './helper';
import { createModel } from '../schema/util';

export const router = new Router();

// 创新新的 panels
router.post('createSwitchPanel', '/panels', function(ctx: IContext) {
  const { stores, request } = ctx;
  const { schema } = request.data;

  stores.setModel(createModel(schema));

  buildNormalResponse(ctx, 200, {success: true});
});

// 在指定 index 处新增 panel
router.post('addPanelAtIndex', '/panels/indexes/:index', function(ctx: IContext) {
  const { stores, params, request } = ctx;
  const { index } = params;
  const { panel } = request.data;

  const len = stores.model.panels.length;
  let targetIndex = len;
  // 确保 index 的合理范围，超过或者不传，默认是 append 操作
  if (isExist(index) && index >= 0 && index < len) {
    targetIndex = index;
  }
  const success = stores.model.addPanel(targetIndex, panel);

  buildNormalResponse(ctx, 200, { success, targetIndex }, `panel(id: ${panel.id}) 新增: ${success}`);

});
