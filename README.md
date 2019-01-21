## 概览

ide-switch-panel

## 本地开发

首先安装依赖：
```shell
npm install

## 安装 peerDependencies 依赖包
npm install styled-components@4.x ide-code-editor@x.x.x antd@3.x mobx@4.x mobx-react@5.x mobx-state-tree@3.x react@16.x react-dom@16.x ss-tree@1.x
```

访问 demo 地址： http://localhost:9000
```shell
npm run dev
```

也可访问 [storybook](https://github.com/storybooks/storybook) 参考具体的使用案例：http://localhost:9001/
```shell
npm run storybook
```

P.S. 由于需要依赖 [ide-code-editor](https://github.com/alibaba-paimai-frontend/ide-code-editor) 仓库比较特别，需要：
 1. 将[ide-code-editor](https://github.com/alibaba-paimai-frontend/ide-code-editor) 仓库下载到本地
 2. 本地运行 `npm run build` 打出其 `dist` 目录
 3. 开启本地服务器的 `9005` 端口，推荐使用 [http-server](https://www.npmjs.com/package/http-server)：

![http server](https://ws3.sinaimg.cn/large/006tNc79ly1fz6cheyqhvj30jj03kaai.jpg)

## 运行测试用例

使用 [jest](https://jestjs.io) 进行测试，执行：

```shell
npm test
```

## 打包发布

普通的 npm 发布即可：

```shell
npm publish
```


