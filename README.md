# 佩奇·李的计算机基础学习平台（框架说明）

本 README 说明当前内容框架与后续填充位置。

## 覆盖学科

- 计算机网络
- 数据库
- 操作系统
- Linux
- 数据结构
- 云原生技术

## 双轨内容结构

每个学科都包含两条轨道：

1. 体系化主线：按知识依赖顺序构建完整认知。
2. 面试速查：按高频问题组织的快速复习材料。

## 文档目录规范

站点文档根目录：`apps/docs`

学科目录统一形态：

```text
apps/docs/<subject>/
  system/
    index.md
    <你后续新增的主线章节>.md
  interview/
    index.md
    <你后续新增的速查章节>.md
```

当前已创建的 subject：

- `network`
- `database`
- `os`
- `linux`
- `data-structure`
- `cloud-native`

## 你后续应把内容放在哪

1. 体系化主线内容
- 放到：`apps/docs/<subject>/system/`
- 首页：`apps/docs/<subject>/system/index.md`

2. 面试速查内容
- 放到：`apps/docs/<subject>/interview/`
- 首页：`apps/docs/<subject>/interview/index.md`

## 新增章节建议流程

1. 在对应目录新增 `xxx.md`。
2. 在对应 `index.md` 加入章节链接。
3. 如需左侧栏显示，更新 `apps/docs/.vitepress/config.ts` 的 `sidebar`。

## 站点入口

- 首页：`apps/docs/index.md`
- 配置：`apps/docs/.vitepress/config.ts`
- 样式：`apps/docs/.vitepress/theme/styles.css`

## 说明

- 本次仅搭建框架与目录，不强制填充实质知识内容。
- 网络模块已有内容可保留并继续扩展。
