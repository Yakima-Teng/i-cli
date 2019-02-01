# 使用自定义模板

``` bash
# 请将<template-name>替换为具体的模板名，将<project-name>替换为具体的项目名
i clone <template-name> <project-name>
```

在上述命令中，你也可以使用你自己的模版，或者其他开发者提供的模板，下面是自定义模版的使用方法：

- 如果你的模板项目已经上传到github上，可以通过`i clone <username/repo> <project-name>`的方式使用模板文件，如果你要使用非master分支的代码，可以直接`i clone "<username/repo#branch>" <project-name>`（注意：后面这种写法里，`""`不可以省略，因为`#`在zsh shells中有特殊意义）。

- 如果你要使用的模板文件存在于本地电脑上，可以通过`i clone ~/fs/path/to-custom-template my-project`的方式使用模板文件。

***需要注意的是，你的模板项目需要满足以下条件，否则无法配合`i-cli`进行使用：***

- （必须）项目根目录下需要存在一个`template`目录，模板文件需要放于该目录下。

- （可选）如果需要用户回答一些问题以决定具体如何处理模板文件，可以在项目根目录下创建一个`meta.js`或者`meta.json`文件，该文件可以包含以下字段：

  - `prompts`：用于收集用户的回答；

  - `filters`：用于判断是否要过滤掉模板项目中的某些文件（true时渲染对应文件）；

  - `skipInterpolation`：用于设置渲染时要跳过的模板项目中的某些文件；

  - `metalsmith`：用于添加自己定义的metalsmith插件；

  - `completeMessage`：定义项目创建完成后显示给用户的信息，比如对项目的简单介绍等；

  - `complete`：除了`completeMessage`之外，你可以可以通过`complete`以回调函数的方式返回需要显示给用户的信息；

  - `destDirName`：详见下方说明；

  - `inPlace`：详见下方说明。


## prompts

`meta`文件中的`prompts`字段的值需要是一个对象字面量，里面的内容是向用户显示的提示信息：

- key用来存储用户回答结果时用的变量名，可通过key值获取到用户的回答内容；
- value是[Inquirer.js约定的问题对象数据](https://github.com/SBoudrias/Inquirer.js/#question)）。

基本示例：

``` json
{
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "项目名"
    }
  }
}
```

当所有提示交互流程都结束后，i-cli会根据用户的回答，使用[Handlebars](http://handlebarsjs.com/)来对`template`下的文件进行渲染。


***可选答的提问***

可以通过`when`字段将某个提问设置为可选答（非必答）——这里`when`的值需要是一个JavaScript表达式，该表达式的值会根据先前的提问的结果进行判断。示例如下：

``` json
{
  "prompts": {
    "lint": {
      "type": "confirm",
      "message": "是否使用linter?"
    },
    "lintConfig": {
      "when": "lint",
      "type": "list",
      "message": "选择一个lint配置",
      "choices": [
        "standard",
        "airbnb",
        "none"
      ]
    }
  }
}
```

在上面的例子中，`lintConfig`对应的提问只会在用户对`lint`提问回答了是的情况下才会出现。

***事先定义好的Handlebars Helpers***

我们已经事先定义好了两个在handlebars中常用的helpers：`if_eq`和`unless_eq`，你可以直接在自己创建的模版项目中使用这些helpers：

``` handlebars
{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
```

***自定义的Handlebars Helpers***

除了上述两个helplers，你也可以自己定义一些helpers。只需要在`meta`文件中添加一个`helpers`字段，其值对一个对象，对象中的key就是helper的名字，value就是具体的实现。

``` js
module.exports = {
  helpers: {
    lowercase: str => str.toLowerCase()
  }
}
```

一旦注册完毕，就可以像下面这样去使用它了：

``` handlebars
{{ lowercase name }}
```

## filters

`meta`文件的`filters`字段是用来定义过滤文件的规则的，其值为一个对象，其中每个键值对的key是一个符合[minimatch glob pattern](https://github.com/isaacs/minimatch)规则的值，value是一个依据用户回答信息取值的JavaScript函数表达式。示例如下：

``` json
{
  "filters": {
    "test/**/*": "needTests"
  }
}
```

在上面的例子里，模版项目中的`test`目录只会在用户对`needTests`问题回答为是的情况被用于创建项目，否则新创建的项目中不会存在`test`目录。

***注意：minimatch的`dot`选项的值已经被设置为`true`了，所以glob patterns默认会匹配带`.`的文件（一般是文件后缀名）。***

## skipInterpolation

`meta`文件中的`skipInterpolation`字段的值需要是一个符合`[minimatch glob pattern](https://github.com/isaacs/minimatch)`规则，命中的文件将会跳过渲染过程。示例：

``` json
{
  "skipInterpolation": "src/**/*.temp"
}
```

## metalsmith

`i-cli`使用[metalsmith](https://github.com/segmentio/metalsmith)来根据模板项目生成具体的项目代码。

你可以通过对`i-cli`创建的`metalsmith`构建器进行定制来注册一些插件。

```js
{
  "metalsmith": function (metalsmith, opts, helpers) {
    function customMetalsmithPlugin (files, metalsmith, done) {
      // Implement something really custom here.
      done(null, files)
    }

    metalsmith.use(customMetalsmithPlugin)
  }
}
```

你也可以使用`before`和`after`这两个钩子来决定哪些设置在提问前应用，哪些设置在提问后应用：

```js
{
  "metalsmith": {
    before: function (metalsmith, opts, helpers) {},
    after: function (metalsmith, opts, helpers) {}
  }
}
```

## completeMessage和meta.{js,json}文件中可用的其他数据

- `destDirName` - 目标目录名，模板项目`template`目录下的文件（不含`template`本身）将被渲染到`destDirName`字段定义的目录名下。

```json
{
  "completeMessage": "To get started:\n\n  cd {{destDirName}}\n  npm install\n  npm run dev"
}
```

- `inPlace` - 布尔值，是否将模板项目`template`目录下的文件（不含`template`本身）直接渲染到当前路径。

```json
{
  "completeMessage": "{{#inPlace}}To get started:\n\n  npm install\n  npm run dev.{{else}}To get started:\n\n  cd {{destDirName}}\n  npm install\n  npm run dev.{{/inPlace}}"
}
```

## complete

complete函数的入参如下:

- `data`: `completeMessage`中可以取到的数据，都可以从`data`对象上取到:

  ```js
  {
    complete (data) {
      if (!data.inPlace) {
        console.log(`cd ${data.destDirName}`)
      }
    }
  }
  ```

- `helpers`: 一些用于帮助你输出结果用的帮助函数：
  - `chalk`: `chalk`模块，具体用法参考`chalk`这个npm包的官方文档；
  - `logger`: [i-cli内置的logger](/lib/logger.js)；
  - `files`: 由生成文件组成的数组。

  ```js
  {
    complete (data, {logger, chalk}) {
      if (!data.inPlace) {
        logger.log(`cd ${chalk.yellow(data.destDirName)}`)
      }
    }
  }
  ```
