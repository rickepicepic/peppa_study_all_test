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

TCP 通过三次握手在客户端与服务端之间建立可靠连接：

1. 客户端发送 SYN，声明初始序号。
2. 服务端回复 SYN + ACK，确认客户端序号并发送自己的初始序号。
3. 客户端回复 ACK，双方进入 ESTABLISHED。

<QuizPanel quiz-id="tcp-handshake-01" />

[继续下一节](/network/system/)