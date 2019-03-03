import Router from 'ette-router';
import { IContext } from './helper';

export const router = new Router();

// 移除 panels 操作
router.del('panels', '/panels', function(ctx: IContext) {
  const { stores } = ctx;
  ctx.response.body = {
    panels: stores.resetToEmpty()
  };
  ctx.response.status = 200;
});

// 移除指定 panel
(router as any).del('panels', '/panels/:id', function(ctx: IContext) {
  const { stores, params } = ctx;
  const { id } = params;

  const result = stores.model.removePanel(id);

  ctx.response.body = {
      panel: result
  };
  ctx.response.status = 200;
});
