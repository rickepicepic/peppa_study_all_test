---
title: 网络模型面试题
slug: network/network-models
subject: network
track: interview
tags: [network, osi, tcp-ip, interview]
difficulty: basic
summary: 网络分层模型与核心定位高频问答
updatedAt: 2026-04-06
---

# 网络模型面试题

## OSI 七层和 TCP/IP 四层分别是什么？

关键句：OSI 是理论分层参考，TCP/IP 是工程实现主线。

扩展说明：

1. OSI 七层：应用层、表示层、会话层、传输层、网络层、数据链路层、物理层。
2. TCP/IP 四层：应用层、传输层、网络层、网络接口层（链路层）。
3. 面试里可以补一句：Linux 协议栈是围绕 TCP/IP 四层实现的。

## 两种模型怎么映射？

关键句：OSI 的高三层通常合并到 TCP/IP 的应用层。

映射关系：

1. OSI 应用层 + 表示层 + 会话层 -> TCP/IP 应用层。
2. OSI 传输层 -> TCP/IP 传输层。
3. OSI 网络层 -> TCP/IP 网络层。
4. OSI 数据链路层 + 物理层 -> TCP/IP 网络接口层。

## TCP、UDP、IP、HTTP、DNS 各在哪一层？

关键句：先分应用、传输、网络，再补协议职责。

1. 应用层：HTTP、HTTPS、DNS、FTP、SMTP。
2. 传输层：TCP、UDP。
3. 网络层：IP、ICMP。
4. 网络接口层：以太网、ARP（常归在链路相关能力）。

## 为什么要分层？

关键句：分层的本质是解耦，降低复杂度，提高可演进性。

扩展说明：

1. 每层只关心本层职责，便于开发和排障。
2. 上下层通过标准接口交互，替换某层实现时影响更可控。
3. 便于跨厂商设备互通和协议标准化。

## 面试中如何快速说明“封装与解封装”？

关键句：发送端逐层加头，接收端逐层拆头。

表达模板：

1. 应用层准备业务数据。
2. 传输层加 TCP/UDP 头，形成段。
3. 网络层加 IP 头，形成包。
4. 链路层加 MAC 头尾，形成帧并发送。
5. 对端按反方向逐层解封装还原业务数据。

## Nginx 常说的“四层/七层负载均衡”是什么意思？

关键句：四层看传输层信息转发，七层看应用层内容转发。

1. 四层负载均衡：基于 IP + 端口转发。
2. 七层负载均衡：可按 Host、Path、Header、Cookie 等策略路由。

[下一页：应用层面试题](/network/interview/application-layer)