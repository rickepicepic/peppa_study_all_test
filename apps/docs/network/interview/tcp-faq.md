---
title: TCP 高频问答
slug: network/tcp-faq
subject: network
track: interview
tags: [tcp, interview]
difficulty: basic
summary: TCP 面试常见问题速查
updatedAt: 2026-04-05
---

# TCP 高频问答

## 为什么要三次握手，不是两次？

为了避免历史连接请求导致服务端误建立连接，并完成双方初始序号同步。

## 为什么会有 TIME_WAIT？

保证被动关闭方收到最后 ACK，并让旧连接报文在网络中自然过期。

[返回体系化主线](/network/system/)