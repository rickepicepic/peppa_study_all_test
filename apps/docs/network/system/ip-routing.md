---
title: IP、ARP、DNS 与路由转发
slug: network/ip-routing
subject: network
track: system
tags: [ip, arp, dns, routing]
difficulty: intermediate
summary: 网络层与链路层关键机制
updatedAt: 2026-04-05
---

# IP、ARP、DNS 与路由转发

## IP：负责跨网络寻址和转发

- IP 包里最关键的是源 IP、目标 IP、协议号。
- 路由器根据路由表决定下一跳。
- TTL 每过一跳减 1，减到 0 会被丢弃并触发 ICMP 超时。

## ARP：已知 IP 求 MAC

在同一网段传输帧前，需要知道下一跳 MAC：

1. 先查 ARP 缓存。
2. 未命中则发 ARP 广播。
3. 收到 ARP 应答后缓存映射并发帧。

如果目标不在同网段，通常 ARP 的是默认网关 MAC。

## DNS：域名到 IP 的解析系统

- 层级结构从右到左：根 -> 顶级域 -> 权威域。
- 本地 DNS 服务器常负责递归查询。
- DNS 本身常使用 UDP（大响应可用 TCP）。

## 路由器与交换机分工

- 交换机：二层设备，按 MAC 表转发。
- 路由器：三层设备，按路由表转发并连接不同网段。

## NAT（实践重点）

- 私网主机访问公网时，由 NAT 做地址/端口转换。
- 常见形态是 NAPT（端口复用），多内网地址映射到同一公网 IP 的不同端口。
- 问题：外网主动访问内网困难、转换有状态开销。

## 常见排障思路

1. 先看 DNS 是否解析正确。
2. 再看路由是否可达（默认网关、路由表）。
3. 再看链路是否能拿到 MAC（ARP）。

[下一节：HTTP 演进与 HTTPS/TLS](/network/system/http-evolution)
