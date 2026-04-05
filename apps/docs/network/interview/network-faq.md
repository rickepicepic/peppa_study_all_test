---
title: IP/UDP 与网络排障问答
slug: network/network-faq
subject: network
track: interview
tags: [ip, udp, dns, arp, ping]
difficulty: basic
summary: 网络层与排障高频问题
updatedAt: 2026-04-05
---

# IP/UDP 与网络排障问答

## DNS、ARP、ICMP 分别做什么？

关键句：DNS 做域名解析，ARP 做 IP 到 MAC 映射，ICMP 做网络诊断与差错报告。

## ping 为什么能测通不代表应用一定可用？

关键句：ping 只验证 ICMP 路径可达，不代表 TCP 端口、应用进程和业务逻辑正常。

## traceroute 的原理是什么？

关键句：通过逐步增加 TTL 触发中间路由器返回 ICMP 超时，从而还原路径。

## NAT 的价值和问题是什么？

关键句：NAT 缓解 IPv4 地址不足，但会引入连接跟踪和外部主动访问困难。

## UDP 为什么常用于实时音视频？

关键句：UDP 没有连接与重传强约束，时延更低，丢包可由应用层策略兜底。

## 网络排障时怎么分层定位？

关键句：先域名、再链路、再端口、再应用，按层收敛问题范围。

步骤建议：

1. `nslookup` / `dig` 看 DNS。
2. `ping` 看基础连通性。
3. `traceroute` 看中间路径。
4. `ss` / `netstat` 看端口监听与连接状态。

[下一页：3 分钟面试输出模板](/network/interview/quick-template)
