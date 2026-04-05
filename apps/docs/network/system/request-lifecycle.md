---
title: 一次网络请求全链路
slug: network/request-lifecycle
subject: network
track: system
tags: [http, dns, tcp, ip]
difficulty: basic
summary: 从输入 URL 到页面返回的关键流程
updatedAt: 2026-04-05
---

# 一次网络请求全链路

这里按“浏览器输入 URL -> 页面返回”主线梳理。

## 1. 应用层：解析与构造

1. 解析 URL：协议、域名、端口、路径、查询参数。
2. 组装 HTTP 请求报文：请求行、请求头、请求体。
3. 发起 DNS 查询：域名 -> IP。

常见 DNS 查询顺序：浏览器缓存 -> 系统缓存 -> hosts -> 本地 DNS 服务器。

## 2. 传输层：建立连接与传输

- 多数场景使用 TCP：先三次握手，再传输 HTTP 数据。
- 连接建立后，数据会按 MSS 拆分为多个 TCP 段。

## 3. 网络层：封装与路由

- 每个 TCP 段会被封装成 IP 包。
- 通过路由表选择下一跳。
- 若包超过 MTU 且允许分片，IP 层会分片。

## 4. 链路层：MAC 寻址与发帧

- 本机先确定下一跳 MAC（ARP 缓存命中或 ARP 广播）。
- 封装以太网帧后由网卡发出。

## 5. 中间设备转发

- 交换机基于 MAC 表转发帧。
- 路由器基于路由表转发 IP 包，并重写链路层头部。

## 6. 目标主机解包

1. 网卡收帧 -> 链路层校验。
2. 交给 IP 层 -> 交给 TCP。
3. TCP 按序重组后交给 HTTP 服务器。
4. 服务器返回响应，流程反向执行。

## Linux 视角（简版）

- 发送路径：用户态 Socket 调用 -> 内核协议栈 -> 网卡队列 -> DMA 发送。
- 接收路径：网卡 DMA 到环形缓冲区 -> 硬中断/软中断 -> 协议栈 -> Socket 接收缓冲区。

[下一节：TCP 三次握手（含测验）](/network/system/tcp-handshake)
