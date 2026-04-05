---
title: HTTP 演进与 HTTPS/TLS
slug: network/http-evolution
subject: network
track: system
tags: [http, https, tls, quic]
difficulty: intermediate
summary: HTTP1.1、HTTP2、HTTP3 与 TLS 核心变化
updatedAt: 2026-04-05
---

# HTTP 演进与 HTTPS/TLS

## HTTP1.1：经典但有瓶颈

优势：简单、可扩展、生态成熟。  
瓶颈：头部冗余、同连接串行语义导致队头阻塞、明文不安全。

常见优化：缓存、长连接、压缩、资源合并与按需加载。

## HTTPS：安全层增强

HTTPS = HTTP + TLS，核心目标：

1. 机密性：数据加密。
2. 完整性：防篡改。
3. 身份认证：证书链验证服务器身份。

## HTTP2：二进制与多路复用

- 二进制帧替代文本报文，解析效率更高。
- HPACK 压缩头部，降低重复开销。
- 一个 TCP 连接可并发多个 Stream。

限制：底层仍是 TCP，一旦发生丢包，TCP 层队头阻塞仍在。

## HTTP3：基于 QUIC（UDP）

- 把多路复用放到 QUIC 连接层，降低跨流阻塞影响。
- 集成 TLS，握手时延更低。
- 支持连接迁移（网络切换时更稳）。

## 面试表达模板

- “HTTP2 解决了应用层并发效率问题，但没有彻底解决传输层队头阻塞；HTTP3 通过 QUIC 把这个问题进一步下沉处理。”
- “HTTPS 的核心不是‘更快’，而是先保证安全三要素，再在协议演进中做性能优化。”

[进入面试速查](/network/interview/)
