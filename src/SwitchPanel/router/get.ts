import Router from 'ette-router';
import { getInnerAppsMiddleware } from 'ide-lib-base-component';


import { IContext } from './helper';
import { findById } from '../schema/util';

export const router = new Router();

// 默认获取所有的 panels，可以通过 filter 返回指定的属性值
// 比如 /nodes?filter=name,screenId ，返回的集合只有这两个属性
router.get('panels', '/panels', function(ctx: IContext) {
  const { stores, request } = ctx;
  const { query } = request;
  const filterArray = query && query.filter && query.filter.trim().split(',');
  ctx.response.body = {
    attributes: stores.model.allAttibuteWithFilter(filterArray)
  };
  ctx.response.status = 200;
});

// 返回某个 panel 的信息
router.get('panels', '/panels/:id', function(ctx: IContext) {
  const { stores, request } = ctx;
  const { query } = request;
  const { id } = ctx.params;
  const filterArray = query && query.filter && query.filter.trim().split(',');
  ctx.response.body = {
    panel: findById(stores.model, id, filterArray)
  };
  ctx.response.status = 200;
});

router.get('clients', '/innerApps/:name', getInnerAppsMiddleware);

