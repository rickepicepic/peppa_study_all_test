---
title: 网络攻击面试题
slug: network/network-security
subject: network
track: interview
tags: [security, ddos, xss, csrf, sqli, dns]
difficulty: intermediate
summary: 常见网络与 Web 安全攻击原理及防护策略
updatedAt: 2026-04-06
---

# 网络攻击面试题

## 什么是 DDoS？

关键句：利用大量分布式流量压垮目标资源，使正常请求无法服务。

常见类型：

1. 网络层：大流量洪泛（如 UDP Flood）。
2. 传输层：`SYN Flood`、连接耗尽。
3. 应用层：HTTP Flood、DNS Flood。

## 如何防 DDoS？

关键句：带宽兜底 + 清洗调度 + 限流熔断 + 弹性扩容。

1. 接入高防和流量清洗服务。
2. 网关限流、黑白名单、挑战机制。
3. 多地域负载均衡与弹性扩容。
4. 关键接口降级与熔断，保护核心链路。

## 什么是 SQL 注入？如何防？

关键句：把用户输入当 SQL 语句拼接执行，导致越权查询或数据破坏。

防护要点：

1. 必须使用参数化查询/预编译。
2. 输入校验与最小权限账户。
3. 错误信息脱敏，避免暴露 SQL 细节。

## 什么是 CSRF？如何防？

关键句：借助用户已登录身份，在用户不知情下发起跨站请求。

防护要点：

1. CSRF Token。
2. 校验 `Origin` / `Referer`。
3. Cookie 设置 `SameSite`。
4. 关键操作二次确认。

## 什么是 XSS？如何防？

关键句：恶意脚本被注入并在受害者浏览器执行。

类型：

1. 存储型。
2. 反射型。
3. DOM 型。

防护要点：

1. 输入过滤与输出编码。
2. 启用 CSP。
3. Cookie 设置 `HttpOnly`、`Secure`。

## 什么是 DNS 劫持？如何防？

关键句：攻击者篡改 DNS 解析结果，把用户导向恶意站点。

防护要点：

1. 优先使用可信 DNS 解析服务。
2. 启用 HTTPS 与证书校验，降低伪站风险。
3. 监控域名解析变更与异常跳转。

## “HTTPS 能不能防所有攻击？”

关键句：HTTPS 主要防窃听、篡改、冒充，不能直接防业务逻辑漏洞。

1. 防中间人有效。
2. 不能直接解决 XSS、SQL 注入、越权等应用漏洞。
3. 需要配合输入校验、权限控制、审计监控形成闭环。

[返回网络面试首页](/network/interview/)
