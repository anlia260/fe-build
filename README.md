# 前端构建工具

## 环境要求

*nodejs 6.x*

## 脚手架

使用<a href="http://yeoman.io/" target="_blank">yeoman</a>，目前支持以下几种类型的脚手架：

* site：静态站点（官网）
* mpa：多页面模块化应用
* spa：单页面模块化应用

### 安装yo

```
npm install yo -g
```

### 安装脚手架

在fe-build文件夹中打开命令行工具，执行下面的命令：

```
cd generator-st && npm link
```

### 创建新项目

如：创建my_project项目

```
mkdir my_project && cd my_project && yo st:mpa
```

### 在已有文件夹创建项目

```
yo st:mpa
```
