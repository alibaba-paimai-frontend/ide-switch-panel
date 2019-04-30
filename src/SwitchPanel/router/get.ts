import Router from 'ette-router';
import { getInnerAppsMiddleware, buildNormalResponse } from 'ide-lib-base-component';


import { IContext } from './helper';
export const router = new Router();

// 默认获取所有的 panels，可以通过 filter 返回指定的属性值
// 比如 /nodes?filter=name,screenId ，返回的集合只有这两个属性
router.get('getPanels', '/panels', function(ctx: IContext) {
  const { stores, request } = ctx;
  const { query } = request;
  const filterArray = query && query.filter && query.filter.trim().split(',');
  buildNormalResponse(ctx, 200, { attributes: stores.model.allAttibuteWithFilter(filterArray) });
});

// 返回某个 panel 的信息
router.get('getPanelById', '/panels/:id', function(ctx: IContext) {
  const { stores, request } = ctx;
  const { query } = request;
  const { id } = ctx.params;
  const filterArray = query && query.filter && query.filter.trim().split(',');
  buildNormalResponse(ctx, 200, { panel: stores.model.findPanel(id, filterArray)});
});

router.get('getClientByName', '/innerApps/:name', getInnerAppsMiddleware);

