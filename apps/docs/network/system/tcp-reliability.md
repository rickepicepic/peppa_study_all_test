---
title: TCP 可靠传输与拥塞控制
slug: network/tcp-reliability
subject: network
track: system
tags: [tcp, retransmission, window, congestion]
difficulty: intermediate
summary: 可靠性机制与性能控制核心
updatedAt: 2026-04-05
---

# TCP 可靠传输与拥塞控制

## TCP 可靠性的四个抓手

1. 序列号与确认号：解决乱序与确认。
2. 重传机制：丢包后补发。
3. 滑动窗口：提升吞吐并做流量控制。
4. 拥塞控制：避免把网络压垮。

## 重传机制

### 超时重传

- 发送后在 RTO 内未收到 ACK，则重传。
- RTO 通常基于 RTT 估计，略大于 RTT。

### 快速重传

- 收到 3 次重复 ACK，直接重传疑似丢失段，不必等超时。

### SACK 与 D-SACK

- SACK：接收方告知已收到的区间，发送方只补缺口。
- D-SACK：告知重复接收，帮助定位是重传过度还是网络复制。

## 滑动窗口与流量控制

- 接收方通过 Window 字段告诉发送方“我还能接收多少”。
- 发送窗口常可理解为：`min(接收窗口 rwnd, 拥塞窗口 cwnd)`。
- 零窗口场景下，发送方会发窗口探测报文避免死锁。

## 拥塞控制

### 慢启动

- 每收到一个 ACK，cwnd 增加 1，指数级增长。

### 拥塞避免

- cwnd 超过阈值后线性增长，增长更温和。

### 拥塞发生

- 超时重传：cwnd 显著回退，回到慢启动路径。
- 快速重传：进入快速恢复，尽量减少吞吐塌陷。

## 高频面试点

1. 为什么发送方需要维护拥塞窗口？
2. 快速重传和超时重传触发条件有什么差别？
3. 零窗口和拥塞是同一件事吗？

[下一节：IP、ARP、DNS 与路由转发](/network/system/ip-routing)
