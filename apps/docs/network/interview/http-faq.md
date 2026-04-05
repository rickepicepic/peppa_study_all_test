---
title: HTTP/HTTPS 高频问答
slug: network/http-faq
subject: network
track: interview
tags: [http, https, tls, interview]
difficulty: basic
summary: HTTP 与 HTTPS 面试高频问题
updatedAt: 2026-04-05
---

# HTTP/HTTPS 高频问答

## HTTP 和 HTTPS 的核心差异是什么？

关键句：HTTPS 在 HTTP 与 TCP 之间加入 TLS，核心提升是机密性、完整性、身份认证。

## HTTPS 一定更慢吗？

关键句：握手阶段成本更高，但现代优化（TLS1.3、会话复用）已显著降低开销。

## HTTP1.1、HTTP2、HTTP3 如何对比？

关键句：HTTP2 解决应用层并发效率，HTTP3 进一步缓解传输层队头阻塞。

扩展说明：

1. HTTP1.1：文本协议，头部冗余，长连接 + 管线化受限。
2. HTTP2：二进制帧 + HPACK + 多路复用。
3. HTTP3：基于 QUIC（UDP），跨流阻塞影响更小。

## 强缓存和协商缓存怎么说？

关键句：强缓存优先命中本地；未命中再走协商缓存，用 304 减少数据传输。

扩展说明：

1. 强缓存常看 Cache-Control、Expires。
2. 协商缓存常看 ETag/If-None-Match、Last-Modified/If-Modified-Since。

## 状态码怎么快速表达？

关键句：2xx 成功，3xx 重定向，4xx 客户端问题，5xx 服务端问题。

高频码：200、301、302、304、400、403、404、500、503。

[下一页：IP/UDP 与网络排障问答](/network/interview/network-faq)
