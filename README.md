# i-cli

***本项目尚在开发中，请勿使用***

<p align="center">
  <a href="https://npmcharts.com/compare/i-cli?minimal=true">
    <img src="https://img.shields.io/npm/dm/i-cli.svg" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/i-cli">
    <img src="https://img.shields.io/npm/v/i-cli.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/i-cli">
    <img src="https://img.shields.io/npm/l/i-cli.svg" alt="License">
  </a>
</p>

> 一个简单的命令行工具，方便日常工作中创建项目、检查代码等操作。

## 安装

前提条件：

- Node（6及以上版本）；
- npm (3及以上版本)；
- git。

`i-cli`需要全局安装，安装完毕后就可以直接在终端中使用`i`命令了。

``` bash
npm install -g i-cli
```

## 使用方法

### 1、创建初始项目

``` bash
# 请将<template-name>替换为具体的模板名，将<project-name>替换为具体的项目名
i clone <template-name> <project-name>
```

以上命令会从`https://github.com/Yakima-Teng/i-template-<template-name>`拉取代码，通常还有带有一些简单的问题，根据实际需求回答后就会发现在当前路径下已经自动创建好了一个名为<project-name>的项目目录。

如果需要查看官方支持的模板名列表，执行下面的操作即可，然后就会看到带有名称和简介的模板列表：

```bash
i list templates
```

***当前支持的官方模板***

官方模板名采用`<框架名或构建工具名>-<多页应用还是单页应用>-<PC站还是wap站>`的方式命令。

- [gulp-mpa-pc](https://github.com/Yakima-Teng/i-template-gulp-mpa-pc) - 一个使用gulp搭建的，支持页面自动刷新、代码eslint检查、 转发本地请求等特性的多页应用模板，用于PC站。

- [react-mpa-wap](https://github.com/Yakima-Teng/i-template-react-mpa-wap) - 一个使用gulp搭建的，支持页面自动刷新、代码eslint检查、 转发本地请求等特性的多页应用模板，用于wap站。

***使用自定义模板***

具体参考本文：[使用自定义模板](./docs/custom-template.md)

## 鸣谢

本项目代码 ***极大*** 地参考了下述项目的代码实现：

- [vue-cli (version 2+)](https://github.com/vuejs/vue-cli)

## License

[MIT](http://opensource.org/licenses/MIT)
