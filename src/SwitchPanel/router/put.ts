import Router from 'ette-router';
import { updateStylesMiddleware, updateThemeMiddleware } from 'ide-lib-base-component';
import { getEnv } from 'mobx-state-tree';

import { IContext } from './helper';
export const router = new Router();

// 更新 store 属性
router.put('panels', '/panels', async function(ctx: IContext) {
  const { stores, request } = ctx;
  const { name, value } = request.data;

  const isSuccess = stores.updateAttribute(name, value);

  // 同时需要调整 editor 的高度
  if (name === 'height') {
    const { clients } = getEnv(stores);
    await clients.codeEditor
      .put('/editor', { name, value: `${value - 30}` });
  }

  ctx.response.body = {
    success: isSuccess
  };
  ctx.response.status = 200;
});

// 更新指定 panel 的属性
router.put('panels', '/panels/:id', function(ctx: IContext) {
  const { stores, request } = ctx;
  const { name, value } = request.data;
  const { id } = ctx.params;

  const isSuccess = stores.model.updateAttributeById(id, name, value);
  ctx.response.body = {
    success: isSuccess
  };
  ctx.response.status = 200;
});

// 更新选择
router.put('panels', '/panels/selection/:id', function(ctx: IContext) {
  const { stores, params } = ctx;
  const { id } = params;

  // stores.setSchema(createSchemaModel(schema));
  stores.model.setselectedIndex(id);

  ctx.response.status = 200;
});

// 更新 css 属性
router.put('model', '/model/styles/:target', updateStylesMiddleware('model'));
// 更新 theme 属性
router.put('model', '/model/theme/:target', updateThemeMiddleware('model'));

