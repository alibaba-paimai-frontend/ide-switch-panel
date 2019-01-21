import Router from 'ette-router';

import { IContext } from './helper';
import { createModel } from '../schema/util';

export const router = new Router();

// 创新新的 panels
(router as any).post('panels', '/panels', function(ctx: IContext) {
  const { stores, request } = ctx;
  const { panels } = request.data;

  stores.setSwitchPanel(createModel({panels}));
  ctx.response.status = 200;
});
