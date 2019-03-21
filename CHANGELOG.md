# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.1.2"></a>
## [0.1.2](https://github.com/alibaba-paimai-frontend/ide-switch-panel/compare/v0.1.1...v0.1.2) (2019-03-21)


### Bug Fixes

* **修复: 函数调用&类型声明:** 更改成 useInjectedEvents 方法；对 store 使用 IAnyModelType 声明，解决 schema/index.d.ts 无法导出的问 ([48aa5be](https://github.com/alibaba-paimai-frontend/ide-switch-panel/commit/48aa5be))
* **类型声明:** 使用显式类型声明，解决无法导出 SwitchPanel/index.d.ts 的问题 ([56fad51](https://github.com/alibaba-paimai-frontend/ide-switch-panel/commit/56fad51))
* **类型导出:** 解决无法导出 schema/index.d.ts 的问题，使用 IAnyModelType 类型 ([3fc68be](https://github.com/alibaba-paimai-frontend/ide-switch-panel/commit/3fc68be))
* **组件默认值:** 给 based 方法传 DEFAULT_PROPS ([9173f72](https://github.com/alibaba-paimai-frontend/ide-switch-panel/commit/9173f72))


### Features

* **功能改善: 方法调用:** 简化 onSwitch 方法签名 ([58c7f45](https://github.com/alibaba-paimai-frontend/ide-switch-panel/commit/58c7f45))



<a name="0.1.1"></a>
## 0.1.1 (2019-03-08)


### Features

* **功能初始化:** 完成基础功能，external 掉 ide-code-editor，引入 ette-proxy ([bea27c5](https://github.com/alibaba-paimai-frontend/ide-switch-panel/commit/bea27c5))
* **功能完善:** 完善 crud api & stories 示例 ([c33dbc3](https://github.com/alibaba-paimai-frontend/ide-switch-panel/commit/c33dbc3))
* **功能完善: 代码风格:** 升级到最新的 tpl 模板；解决 storybook 中 ide-code-editor 的代理问题 ([54b5d7c](https://github.com/alibaba-paimai-frontend/ide-switch-panel/commit/54b5d7c))
* **功能完善: 逻辑部分:** 完成组件的逻辑功能，使用 react hooks 维护自身的 panel 选择状态；达到 demo 可用状态； ([95dc00e](https://github.com/alibaba-paimai-frontend/ide-switch-panel/commit/95dc00e))
