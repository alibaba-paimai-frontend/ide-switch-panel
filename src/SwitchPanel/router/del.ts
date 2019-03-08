import Router from 'ette-router';
import { buildNormalResponse } from 'ide-lib-base-component';


import { IContext } from './helper';

export const router = new Router();

// 移除 panels 操作
router.del('resetPanels', '/panels', function(ctx: IContext) {
  const { stores } = ctx;
  buildNormalResponse(ctx, 200, { panels: stores.resetToEmpty() });
});

// 移除指定 panel
router.del('removePanelById', '/panels/:id', function(ctx: IContext) {
  const { stores, params } = ctx;
  const { id } = params;
  buildNormalResponse(ctx, 200, { panel: stores.model.removePanel(id) });
});
