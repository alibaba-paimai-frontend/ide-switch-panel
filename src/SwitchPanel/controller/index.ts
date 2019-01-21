import Application, { middlewareFunction, isEtteApplication } from 'ette';
import proxy from 'ette-proxy';
import { IStoresModel } from '../schema/stores';
import { router as GetRouter } from '../router/get';
import { router as PostRouter } from '../router/post';
import { router as PutRouter } from '../router/put';
import { router as DelRouter } from '../router/del';

export const AppFactory = function(stores: IStoresModel, innerApps?: object) {
  const app = new Application({ domain: 'switch-panel' });

  // 挂载 stores 到上下文中
  app.use((ctx: any, next: any) => {
    ctx.stores = stores;
    ctx.innerApps = innerApps;
    return next();
  });

  // 进行路由代理，要放在路由挂载之前
  // 代理规则，将编辑器的代理转发到 editor
  const proxyEditor = proxy('/clients/editor', {
    defer: true,
    pathRewrite: {
      '^/clients/editor': '/editor'
    }
  });

  // 这里必须使用 async/await 方式，否则返回的 res 总是 404
  app.use(async (ctx: any, next: any) => {
    const { innerApps } = ctx;
    await (proxyEditor(innerApps.codeEditor) as middlewareFunction)(
      ctx,
      next
    );
  });

  // 注册路由
  app.use(GetRouter.routes());
  app.use(PostRouter.routes());
  app.use(PutRouter.routes());
  app.use(DelRouter.routes());

  return app;
};
