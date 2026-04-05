---
title: TCP 三次握手
slug: network/tcp-handshake
subject: network
track: system
tags: [tcp, handshake]
difficulty: basic
summary: TCP 建连流程
updatedAt: 2026-04-05
---

# TCP 三次握手

TCP 通过三次握手在客户端与服务端之间建立可靠连接，本质是：

1. 同步双方初始序列号（ISN）。
2. 确认双方都具备收发能力。
3. 避免历史连接请求误导当前连接。

## 握手流程

1. 客户端发送 SYN，声明初始序号。
2. 服务端回复 SYN + ACK，确认客户端序号并发送自己的初始序号。
3. 客户端回复 ACK，双方进入 ESTABLISHED。

## 为什么不是两次？

- 两次握手无法让服务端确认“自己的发送能力 + 客户端接收能力”同时成立。
- 旧 SYN 延迟到达时，服务端可能误建连接，第三次 ACK 能进一步确认这是有效请求。

## 丢包会怎样？

- 第一次 SYN 丢失：客户端超时重传 SYN。
- 第二次 SYN+ACK 丢失：客户端重发 SYN，服务端也会重发 SYN+ACK。
- 第三次 ACK 丢失：服务端会重传 SYN+ACK，直到超时上限。

## 常见状态

- 客户端：CLOSED -> SYN_SENT -> ESTABLISHED
- 服务端：CLOSED -> LISTEN -> SYN_RCVD -> ESTABLISHED

可以用 `ss -napt` 或 `netstat -napt` 观察连接状态。

## 小测验

<QuizPanel quiz-id="tcp-handshake-01" />

[下一节：TCP 可靠传输与拥塞控制](/network/system/tcp-reliability)