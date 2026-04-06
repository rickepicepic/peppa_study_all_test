---
title: OSI 七层模型
slug: network/osi-model
subject: network
track: system
tags: [network, osi]
difficulty: basic
summary: OSI 七层模型学习模块
updatedAt: 2026-04-06
---

## OSI七层模型

OSI七层模型：应用层、表示层、会话层、运输层、网络层、数据链路层、物理层

TCP/IP 四层模型： 应用层、运输层、网络层、网络接口层

五层模型：应用层、运输层、网络层、数据链路层、物理层

### 应用层，表示层，会话层

1. 应用层：负责给应用程序提供统一的接口。

2. 表示层：主要负责数据格式的转换，压缩与解压缩，加密与解密，为系统提供特殊的数据处理能力，负责把数据转换成兼容另一个系统能识别的格式。
3. 会话层：是在发送方和接收方之间进行通信时创建、维持、之后终止或断开连接的地方，与电话通话有点相似。主要功能是对会话进行管理和控制，保证会话的可靠传输。

但是实际上表示层和会话层并未完全的独立实现，不同的应用程序有大同小异的会话表示需求，这些代码并不能完全抽象出独立的会话层、表示层。现在各个应用层协议已经比较完美并符合自我的实现了会话层和表示层，自身已经完成了上三层协议，因此在实际工业层面的实现中，将上三层协议划分在一起，称之为应用层。

主要用到的协议有HTTP、FTP、Telnet、DNS、SMTP

### 传输层

该层的协议为应用进程提供端到端的传输服务。主要用到的协议有TCP，UDP

### 网络层

在网络中进行通信的两个计算机之间回经过很多的通信子网。网络层的作用就是选择合适的网间路由和交换节点进行路由转发，确保数据及时送达。网络层把运输层产生的报文段封装成分组和包进行传送。在TCP/IP体系中，由于网络层使用IP协议，因此分组也叫IP数据报，简称数据报。

主要协议有IP、ICMP 。

### 数据链路层

主机之间通信总是在一段一段的链路上进行传送的，而数据链路层就是作用在这一个个链路上的协议。两个相邻节点之间传送数据时，数据链路层将网络层传来的IP数据报组装成帧，在两个相邻节点之间的链路上传送。每一帧包括数据和必要的控制信息。

数据的封帧和差错检测，以及 MAC 寻址；

### 物理层

物理层上所传输的数据单位是比特。

负责在物理网络中传输数据帧。

## 网络请求流程

![简单的网络模型](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E8%BF%87%E7%A8%8B/2.jpg)

### 应用层

#### HTTP

1. 解析URL 获取请求信息

   ![URL 解析](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E8%BF%87%E7%A8%8B/3.jpg)

2. 生成HTTP请求报文

   需要：**请求方法，URL，版本，请求头，请求体**

   ![HTTP 的消息格式](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E8%BF%87%E7%A8%8B/4.jpg)

3. DNS查询IP

   域名解析：本地DNS->根->顶级->权威(解析结果的出处找到IP)->本地DNS->应用程序，亲力亲为。

   通过DNS服务器将目标域名转换为目标IP(浏览器域名缓存->操作系统缓存->hosts文件->本地DNS服务器)

生成HTTP报文后将传输工作通过Socket给协议栈。

#### Socket

​	是应用程序中的编程接口API，是对传输层的抽象封装，可以更方便地调用TCP/IP协议的功能。

![基于 TCP 协议的客户端和服务器工作](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL3hpYW9saW5jb2Rlci9JbWFnZUhvc3QyLyVFOCVBRSVBMSVFNyVBRSU5NyVFNiU5QyVCQSVFNyVCRCU5MSVFNyVCQiU5Qy9UQ1AtJUU0JUI4JTg5JUU2JUFDJUExJUU2JThGJUExJUU2JTg5JThCJUU1JTkyJThDJUU1JTlCJTlCJUU2JUFDJUExJUU2JThDJUE1JUU2JTg5JThCLzM0LmpwZw?x-oss-process=image/format,png)

- 服务端和客户端初始化 `socket`，得到文件描述符；
- 服务端调用 `bind`，将 socket 绑定在指定的 IP 地址和端口；
- 服务端调用 `listen`，进行监听；
- 服务端调用 `accept`，等待客户端连接；
- 客户端调用 `connect`，向服务器端的地址和端口发起连接请求；
- 服务端 `accept` 返回用于传输的 `socket` 的文件描述符；
- 客户端调用 `write` 写入数据；服务端调用 `read` 读取数据；
- 客户端断开连接时，会调用 `close`，那么服务端 `read` 读取数据的时候，就会读取到了 `EOF`，待处理完数据后，服务端调用 `close`，表示连接关闭。

#### 协议栈

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E8%BF%87%E7%A8%8B/7.jpg)

上半部分TCP/IP收发数据，下半部分IP协议（切片，路由），IP中还存在ICMP（告知传输错误），ARP协议（IP换MAC）。

IP 下面的网卡驱动程序负责控制网卡硬件，而最下面的网卡则负责完成实际的收发操作，也就是对网线中的信号执行发送和接收操作。

### 传输层

HTTP基于TCP协议进行传输。

#### TCP

![TCP 包头格式](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E8%BF%87%E7%A8%8B/8.jpg)

需要：

1. 源端口，目标端口
2. 包序号：解决包乱序
3. 确认号：确认是否送达，解决丢包。
4. 状态位：`SYN`发起连接，`ACK`回复，`RST`重连，`FIN`结束。
5. 窗口大小：流量控制，调整速率。
6. 拥塞控制：控制速率。

查看tcp连接状态：`netstat -napt`

功能：

1. 三次握手：保证双方都有发送和接收的能力
2. 分割数据：HTTP长度超过MSS进行分片

TCP报文生成后交给网络层处理。

### 网络层

#### IP

TCP在连接，收发，断开等操作时，都需要IP模块将数据封装为网络包进行通信。

IP报文：

![IP 包头格式](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E8%BF%87%E7%A8%8B/14.jpg)

需要：

1. 源IP，目标IP

   存在多个网卡时，通过路由表规则判断选择哪个IP。即选择和目标IP处于同一网段的网卡IP作为源IP，如果没有就选择路由IP，后续把包发给路由器。

2. 协议号：TCP

### 网络接口层

生成了 IP 头部之后，接下来网络包还需要在 IP 头部的前面加上 **MAC 头部**。

#### MAC

![MAC 包头格式](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E8%BF%87%E7%A8%8B/18.jpg)

MAC头部是以太网使用的头部，包含：

1. 源和目标MAC地址

   源MAC在本机ROM中。目标MAC则需要通过ARP进行获取。先看ARP缓存，没有就对当前子网中所有设备广播ARP协议，然后获取到MAC。如果目标和自己不在同一网段，就ARP网关，获取对方MAC地址，把数据发给网关。

2. 协议类型：TCP/IP中一般只有IP和ARP协议。

#### 网卡

网卡驱动程序控制网卡将网络包转换为电信号。

网卡驱动获取网络包后会将其**复制**到网卡内的缓存区中，接着会在其**开头加上报头和起始帧分界符，在末尾加上用于检测错误的帧校验序列**。

![数据包](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4/%E7%BD%91%E7%BB%9C/%E6%95%B0%E6%8D%AE%E5%8C%85.drawio.png)

#### linux下发送网络包：

1. 应用层：调用Socket发送数据包，陷入内核态，申请内核sk_buf并拷贝，进入发送缓冲区。

   传输层：从发送缓冲区取sk_buf按照协议栈处理（如果是TCP就拷贝一个新的sk_buf（丢失重传用）,sk_buf中data指针指向协议首部）。

   网络层：获取IP，填充IP，分片。

   网络接口层：ARP获取MAC，填充帧头帧尾。把sk_buf放在**发送队列**，触发软中断。

2. 网卡驱动程序从发送队列读取sk_buf挂在循环缓冲区。

3. 通过DMA读取数据进行发送。

4. 最后通过硬中断清理sk_buf和循环缓冲区。

#### linux下接收网络包：

1. 网卡收到网络包后，通过DMA将网络包写入到指定内存地址（环形缓冲区），触发硬中断

2. CPU执行对应中断处理函数：屏蔽中断（数据直接写入缓冲区），触发软中断

3. 内核中单独一个线程收到软中断后来轮训处理数据，从环形缓冲区中读一个数据帧(sk_buff)，交给网络协议栈处理。

4. 网络接口层：判断报文合法性，然后去除帧头帧尾，根据IP协议类型给网络层

   网络层：去除IP包判断下一步走向，如果是本机就查看上一层协议（TCP/UDP），去除IP头，给传输层

   传输层：取出TCP或UDP头，找到目标Socket，把数据放到Socket内核接收缓冲区。

   应用层：调用Scoket接口将内核缓冲区中的数据靠拷贝到应用层缓冲区，唤醒用户进程。

### 交换机

网卡会将包转为电信号，通过网线发送出去。电信号会被交换机所接收（交换机的端口不核对接收方 MAC 地址，而是直接接收所有的包并存放到缓冲区中。因此，和网卡不同，**交换机的端口不具有 MAC 地址**。）

将包存入缓冲区后交换机查询自身MAC表，找到目标MAC对应的端口进行发送。

> 如果找不到MAC记录？

交换机会将包发送给所有端口。

### 路由器

因为**路由器**是基于 IP 设计的，俗称**三层**网络设备，路由器的各个端口都具有 MAC 地址和 IP 地址；

当转发包时，首先路由器端口会接收发给自己的以太网包(MAC地址是自己)，然后**路由表**查询转发目标，再由相应的端口作为发送方将以太网包发送出去。

1. 查询路由表确定输出端口

   查询路由表，通过路由匹配查询同一子网的设备并进行转发，否则默认路由进行转发。

2. 路由器的发送操作

   * 如果目标网关是IP，则说明仍需要路由器进行转发
   * 如果目标网关为空，则说明到达目标地址。

   之后通过ARP协议获取目标IP的MAC地址，然后封包转发给目标。

[下一节：应用层协议](/network/system/application-protocols)