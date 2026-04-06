---
title: 网络层协议
slug: network/network-layer-protocols
subject: network
track: system
tags: [network, network-layer, ip, arp, icmp]
difficulty: basic
summary: 网络层协议学习模块
updatedAt: 2026-04-06
---

## 网络层

### IP协议

#### 基础知识

IP 地址分类成了 5 种类型，分别是 A 类、B 类、C 类、D 类、E 类。

![IP 地址分类](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/7.jpg)

其中对于 A、B、C 类主要分为两个部分，分别是**网络号和主机号**。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/8.jpg)

主机号中有两个比较特殊的

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/10.jpg)

- 主机号全为 1 指定某个网络下的所有主机，用于广播
- 主机号全为 0 指定某个网络

而 D 类和 E 类地址是没有主机号的，所以不可用于主机 IP，D 类常被用于**多播**，E 类是预留的分类，暂时未使用。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/12.jpg)

![单播、广播、多播通信](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/13.jpg)

**无分类地址 CIDR

表示形式 `a.b.c.d/x`，其中 `/x` 表示前 x 位属于**网络号**， x 的范围是 `0 ~ 32`，后面是**主机号**。

比如 10.100.122.2/24，这种地址表示形式就是 CIDR，/24 表示前 24 位是网络号，剩余的 8 位是主机号。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/15.jpg)

还有另一种划分网络号与主机号形式，那就是**子网掩码**，掩码的意思就是掩盖掉主机号，剩余的就是网络号。

**将子网掩码和 IP 地址按位计算 AND，就可得到网络号。**

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/16.jpg)

在上面我们知道可以通过子网掩码划分出网络号和主机号，那实际上子网掩码还有一个作用，那就是**划分子网**

**子网划分实际上是将主机地址分为两个部分：子网网络地址和子网主机地址**。形式如下：

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/18.jpg)

假设对 C 类地址进行子网划分，网络地址 192.168.1.0，使用子网掩码 255.255.255.192 对其进行子网划分。

C 类地址中前 24 位是网络号，最后 8 位是主机号，根据子网掩码可知**从 8 位主机号中借用 2 位作为子网号**。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/19.jpg)

由于子网网络地址被划分成 2 位，那么子网地址就有 4 个，分别是 00、01、10、11，具体划分如下图：

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/21.jpg)

在 A、B、C 分类地址，实际上有分公有 IP 地址和私有 IP 地址。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/22.jpg)

**IPV6**

IPv4 的地址是 32 位的,IPv6 的地址是 `128` 位的，

IPv6 不仅仅只是可分配的地址变多了，它还有非常多的亮点。

- IPv6 可自动配置，即使没有 DHCP 服务器也可以实现自动分配 IP 地址
- IPv6 包头包首部长度采用固定的值 `40` 字节，去掉了包头校验和，简化了首部结构，减轻了路由器负荷，大大**提高了传输的性能**。
- IPv6 有应对伪造 IP 地址的网络安全功能以及防止线路窃听的功能，大大**提升了安全性**。

IPv4 地址长度共 32 位，是以每 8 位作为一组，并用点分十进制的表示方式。

IPv6 地址长度是 128 位，是以每 16 位作为一组，每组用冒号 「:」 隔开。

![IPv6 地址表示方法](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/27.jpg)

如果出现连续的 0 时还可以将这些 0 省略，并用两个冒号 「::」隔开。但是，一个 IP 地址中只允许出现一次两个连续的冒号。

![Pv6 地址缺省表示方](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/28.jpg)

IPv6 类似 IPv4，也是通过 IP 地址的前几位标识 IP 地址的种类。

IPv6 的地址主要有以下类型地址：

- 单播地址，用于一对一的通信
- 组播地址，用于一对多的通信
- 任播地址，用于通信最近的节点，最近的节点是由路由协议决定
- 没有广播地址

![IPv6地址结构](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/29.jpg)

 **IPv4 首部与 IPv6 首部**

IPv4 首部与 IPv6 首部的差异如下图：

![IPv4 首部与 IPv6 首部的差异](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/31.jpg)

IPv6 相比 IPv4 的首部改进：

- **取消了首部校验和字段。** 因为在数据链路层和传输层都会校验，因此 IPv6 直接取消了 IP 的校验。
- **取消了分片 / 重新组装相关字段。** 分片与重组是耗时的过程，IPv6 不允许在中间路由器进行分片与重组，这种操作只能在源与目标主机，这将大大提高了路由器转发的速度。
- **取消选项字段。** 选项字段不再是标准 IP 首部的一部分了，但它并没有消失，而是可能出现在 IPv6 首部中的「下一个首部」指出的位置上。删除该选项字段使的 IPv6 的首部成为固定长度的 `40` 字节。

**DHCP**

![DHCP 工作流程](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/IP/36.jpg)**

- 客户端首先发起 **DHCP 发现报文（DHCP DISCOVER）** 的 IP 数据报，由于客户端没有 IP 地址，也不知道 DHCP 服务器的地址，所以使用的是 UDP **广播**通信，其使用的广播目的地址是 255.255.255.255（端口 67） 并且使用 0.0.0.0（端口 68） 作为源 IP 地址。DHCP 客户端将该 IP 数据报传递给链路层，链路层然后将帧广播到所有的网络中设备。
- DHCP 服务器收到 DHCP 发现报文时，用 **DHCP 提供报文（DHCP OFFER）** 向客户端做出响应。该报文仍然使用 IP 广播地址 255.255.255.255，该报文信息携带服务器提供可租约的 IP 地址、子网掩码、默认网关、DNS 服务器以及 **IP 地址租用期**。
- 客户端收到一个或多个服务器的 DHCP 提供报文后，从中选择一个服务器，并向选中的服务器发送 **DHCP 请求报文（DHCP REQUEST** 进行响应，回显配置的参数。
- 最后，服务端用 **DHCP ACK 报文**对 DHCP 请求报文进行响应，应答所要求的参数。

一旦客户端收到 DHCP ACK 后，交互便完成了，并且客户端能够在租用期内使用 DHCP 服务器分配的 IP 地址。

**NAT**

### IP协议相关知识

#### DNS

DNS 域名解析将域名转换为ip地址

>   域名的层级关系

1.   域名以`.`分隔

2.   越靠右层次越高(树形)

     ![image-20220113221431490](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220113221431490.png)

3.   客户端只用找到任意一台DNS服务器就可以通过它找到根域服务器,然后顺着层次找到权威服务器返回对应ip地址

#### ARP

在传输一个IP数据包时确定了源IP和目标IP后通过路由表确定IP数据包的下一跳,

但需要知道下一跳的MAC地址.才可以进行转发.

>   ARP如何获取目标MAC地址?

1.   主机会广播ARP请求,其中包含目标IP地址
2.   当同一个链路的所有设备都接收到ARP请求时,会拆包查看IP,如果和自己IP一致就想自己的MAC放到ARP响应包给主机.
3.   操作系统通常会把第一次通过ARP获取的MAC地址缓存起来,

>   RARP 通过MAC求IP

#### DHCP

通过DHCP动态获取IP地址

1.   客户端发送**DHCP发现报文**的IP数据报,因为客户端无IP也不知道DHCP服务器IP,所以使用UDP广播.使用的目的地址为255.255.255.255并且使用0.0.0.0作为原地址.
2.   DHCP服务器收到**DHCP发现报文**时,使用255.255.255.255向客户端回应**可租约的IP,子网掩码,默认网关,DNS服务器,和IP地址租用期**
3.   客户端收到多个服务器的DHCP提供报文后从中选择一个服务器然后发送**DHCP请求报文**
4.   最后服务器用DHCP ACK 报文进行响应相关信息.

>   如果租期快过了,客户端会想服务器发送DHCP请求报文.

1.   服务器同意继续租用,则用`DHCP ACK`进行回应
2.   服务器拒绝租用,使用`DHCP NACK`进行回应

>   DHCP交互中使用的是UDP广播通信

为了解决局域网才能进行广播问题，就出现了 DHCP 中继代理。有了 DHCP 中继代理以后，对不同⽹段的 IP 地址分配也可以由⼀个 DHCP 服务器统⼀进⾏管理

![image-20220113223754640](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220113223754640.png)

1.   DHCP 客户端会向 DHCP 中继代理发送 DHCP 请求包，⽽ DHCP 中继代理在收到这个⼴播包以后，再以单播 的形式发给 DHCP 服务器。 
2.   服务器端收到该包以后再向 DHCP 中继代理返回应答，并由 DHCP 中继代理将此包⼴播给 DHCP 客户端

因此，DHCP 服务器即使不在同⼀个链路上也可以实现统⼀分配和管理IP地址。

#### NAT

NAT 就是同个公司、家庭、教室内的主机对外部通信时，把私有 IP 地址转换成公有 IP 地址

1.   静态:1对1实现外部网络对内部网络某些特殊设备的访问.
2.   动态:随机分配.
3.   端口多路复用(PAT):不同IP相同端口转换为相同IP不同端口,内部存储对应的转换表.

![image-20220113224007917](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220113224007917.png)

**⽹络地址与端⼝转换 NAPT(PAT)**

![image-20220113224113047](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220113224113047.png)

存在的问题:

1.   外部无法主动和NAT内部服务器建立连接,
2.   转换表的生成与转换操作会产生开销
3.   通信过程中,如果NAT路由器重启了,所有TCP连接都将被重置

解决方法:

1. 使用IPV6 直接使用私有IP

2. NAT穿透技术

   说人话，就是客户端主动从 NAT 设备获取公有 IP 地址，然后自己建立端口映射条目，然后用这个条目对外通信，就不需要 NAT 设备来进行转换了

#### IGMP

在前⾯我们知道了组播地址，也就是 D 类地址，既然是组播，那就说明是只有⼀组的主机能收到数据包，不在⼀组 的主机不能收到数组包，怎么管理是否是在⼀组呢？那么，就需要 IGMP 协议了。

![image-20220114000804276](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220114000804276.png)

IGMP 是因特⽹组管理协议，⼯作在主机（组播成员）和最后⼀跳路由之间

1.   GMP 报⽂向路由器申请加⼊和退出组播组，默认情况下路由器是不会转发组播包到连接中的主机，除⾮主机 通过 IGMP 加⼊到组播组，主机申请加⼊到组播组时，路由器就会记录 IGMP 路由器表，路由器后续就会转发 组播包到对应的主机了。
2.   IGMP 报⽂采⽤ IP 封装，IP 头部的协议号为 2，⽽且 TTL 字段值通常为 1，因为 IGMP 是⼯作在主机与连接 的路由器之间。

>   工作机制

IGMP 分为了三个版本分别是，IGMPv1、IGMPv2、IGMPv3。

1.   常规查询和响应

     ![image-20220115145259417](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115145259417.png)

     1.   路由器会周期性发送⽬的地址为 224.0.0.1 （表示同⼀⽹段内所有主机和路由器） IGMP 常规查询报⽂。
     2.   主机1 和 主机 3 收到这个查询，随后会启动「报告延迟计时器」，计时器的时间是随机的，通常是 0~10 秒， 计时器超时后主机就会发送 IGMP 成员关系报告报⽂（源 IP 地址为⾃⼰主机的 IP 地址，⽬的 IP 地址为组播地址）。如果在定时器超时之前，收到同⼀个组内的其他主机发送的成员关系报告报⽂，则⾃⼰不再发送，这 样可以减少⽹络中多余的 IGMP 报⽂数ᰁ。
     3.   路由器收到主机的成员关系报⽂后，就会在 IGMP 路由表中加⼊该组播组，后续⽹络中⼀旦该组播地址的数据 到达路由器，它会把数据包转发出去

2.   离开组播组机制

     1.   网络中仍有该组播组

          ![image-20220115145513400](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115145513400.png)

          1.   主机 1 要离开组 224.1.1.1，发送 IGMPv2 离组报⽂，报⽂的⽬的地址是 224.0.0.2（表示发向⽹段内的所有路 由器）
          2.   路由器 收到该报⽂后，以 1 秒为间隔连续发送 IGMP 特定组查询报⽂（共计发送 2 个），以便确认该⽹络是 否还有 224.1.1.1 组的其他成员
          3.   否还有 224.1.1.1 组的其他成员。 3. 主机 3 仍然是组 224.1.1.1 的成员，因此它⽴即响应这个特定组查询。路由器知道该⽹络中仍然存在该组播组 的成员，于是继续向该⽹络转发 224.1.1.1 的组播数据包

     2.   网络中没有该组播组

          ![image-20220115145623433](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115145623433.png)

          1.    主机 1 要离开组播组 224.1.1.1，发送 IGMP 离组报⽂
          2.   路由器收到该报⽂后，以 1 秒为间隔连续发送 IGMP 特定组查询报⽂（共计发送 2 个）。此时在该⽹段内，组 224.1.1.1 已经没有其他成员了，因此没有主机响应这个查询
          3.    ⼀定时间后，路由器认为该⽹段中已经没有 224.1.1.1 组播组成员了，将不会再向这个⽹段转发该组播地址 数据包

### ping的工作原理

#### ICMP

**互联⽹控制报⽂协议**

功能：

1.   确认IP包能否成功送到目标地址
2.   报告发送过程中IP包被丢弃的原因
3.   改善网络设置

![image-20220113235216254](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220113235216254.png)

ICMP消息会原路返回到主机A,主机A对这个IP消息进行解析得到原因.

>   ICMP 包头格式

ICMP 报⽂是封装在 IP 包⾥⾯，它⼯作在⽹络层，是 IP 协议的助⼿

![image-20220115150419802](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115150419802.png)

根据ICMP包的类别对ICMP进行分类.

>   ICMP类型

![image-20220113235438152](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220113235438152.png)

#### 查询报文类型

用于诊断的查询消息

>   回送消息 -- 类型 0 和 8

**回送消息**⽤于进⾏通信的主机或路由器之间,判断所发送的数据包是否已经成功到达对端的⼀种消息，

![image-20220115151130577](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115151130577.png)

可以向对端主机发送**回送请求**的消息（ ICMP Echo Request Message ，类型 8 ），也可以接收对端主机发回来的**回送应答**消息（ ICMP Echo Reply Message ，类型 0 ）

![image-20220115151450651](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115151450651.png)

在**选项数据**中， ping 还会存放发送请求的时间值，来计算往返时间，说明路程的⻓短。

#### 差错报文类型

通知出错原因的错误消息,

举几个常见的例子

##### 目标不可达 - 3

IP 路由器⽆法将 IP 数据包发送给⽬标地址时，会给发送端主机返回⼀个**⽬标不可达**的 ICMP 消息，并在这个消息中显示不可达的具体原因，原因记录在 ICMP 包头的**代码字段**。

![image-20220115152256195](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115152256195.png)

1.   网络不可达 - 0 

     IP 地址是分为⽹络号和主机号的，所以当路由器中的路由器表匹配不到接收⽅ IP 的⽹络号，就通过 ICMP 协议以**⽹络不可达**的原因告知主机

2.   主机不可达 - 1

     当路由表中没有该主机的信息，或者该主机没有连接到⽹络，那么会通过 ICMP 协议以主机不可达的原因告知主机。

3.   协议不可达 - 2

     当主机使⽤ TCP 协议访问对端主机时，能找到对端的主机了，可是对端主机的防⽕墙已经禁⽌ TCP 协议访问，那 么会通过 ICMP 协议以协议不可达的原因告知主机

4.   端⼝不可达 - 3

     当主机访问对端主机 8080 端⼝时，这次能找到对端主机了，防⽕墙也没有限制，可是发现对端主机没有进程监听 8080 端⼝，那么会通过 ICMP 协议以端⼝不可达的原因告知主机。

5.   需要进⾏分⽚但设置了不分⽚位 - 4

     发送端主机发送 IP 数据报时，将 **IP ⾸部的分⽚禁⽌标志位设置为 1** 。根据这个标志位，途中的**路由器遇到超过 MTU ⼤⼩的数据包时，不会进⾏分⽚，⽽是直接抛弃。**

##### 原点抑制消息 - 4

在使⽤低速⼴域线路的情况下，连接 WAN 的路由器可能会遇到⽹络拥堵的问题

**ICMP 原点抑制消息的⽬的就是为了缓和这种拥堵情况。**

当路由器向低速线路发送数据时，**其发送队列的缓存变为零⽽⽆法发送出去时**，可以向 IP 包的源地址发送⼀个 ICMP 原点抑制消息

收到消息的主机可以了解到整个线路的某一处发生了拥堵,从而**加大IP包传输间隔**,减少网络拥堵.

##### 重定向消息 - 5

如果**路由器发现发送端主机使⽤了「不是最优」的路径发送数据**，那么它会返回⼀个 ICMP 重定向消息给这个主 机。

##### 超时消息 - 11

**IP包中的TTL声明周期,每过一个路由器就减1,最后到0就被丢弃了**

此时,路由器会发送一个ICMP超时给发送端主机.

设置声明周期是为了防止在路由转发出现问题而导致报文被无限转发.

#### ping 查询报文类型的使用

![image-20220115160424124](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115160424124.png)

ping先创建一个ICMP回送请求消息数据包

ICMP数据包内多个字段,核心是两个

1.   ⼀个是类型，对于回送请求消息⽽⾔该字段为 8 ； 
2.   另外⼀个是序号，主要⽤于区分连续 ping 的时候发出的多个数据包。

每发出⼀个请求数据包，序号会⾃动加 1 。为了能够计算往返时间 RTT ，它会在报⽂的数据部分插⼊发送时间

然后，**由 ICMP 协议将这个数据包连同地址 192.168.1.2 ⼀起交给 IP 层。IP 层将以 192.168.1.2 作为⽬的地址， 本机 IP 地址作为源地址，协议字段设置为 1 表示是 ICMP 协议，再加上⼀些其他控制信息，构建⼀个 IP 数据包**

![image-20220115161446506](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115161446506.png)

之后加入MAC头,再在本地ARP映射表中查找MAC地址,没有就ARP查询MAC地址,获取MAC后由数据链路层构建一个帧,目的IP是由IP层传过来的MAC地址,原地址是本地MAC,然后依据以太网介质规则传输出去.

![image-20220115162035389](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115162035389.png)

主机B收到消息后先检查MAC地址是否是自己,然后拆开数据帧,检查IP层,然后将信息给ICMP协议.

主机B构建一个ICMP回送响应消息,**类型是0,序号是请求数据包中的序号**,然后再发送给主机A.

![image-20220115162308826](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220115162308826.png)

如果一定时间内主机A没收到应答包就说明目标主机不可达.

 **ping 这个程序是使⽤了 ICMP ⾥⾯的 ECHO REQUEST（类型为 8 ） 和 ECHO REPLY （类型为 0）**

#### traceroute 差错报文类型的使用

有⼀款充分利⽤ ICMP 差错报⽂类型的应⽤叫做 traceroute （在UNIX、MacOS中是这个命令，⽽在Windows中 对等的命令叫做 tracert ）。

1.   利用IP包的生存周期

     先设置TTL为1发送UDP包,遇到第一个路由器就gg,然后返回超时,之后设置为2,然后第二个返回超时,直到到达目标主机.**拿到此过程的所有路由器IP**,但对于部分不返回ICMP的路由器是看不到中间路由的.

2.   如何确定UDP到达目标主机?

     发送的UDP设置一个不可能的端口号,当目标主机接受到UDP后返回端口不可达.

3.   通过故意设置不分片来确定路径的MTU

     为了路径MTU发现.

     1.   ⾸先在发送端主机发送 IP 数据报时，将 IP 包⾸部的分⽚禁⽌标志位设置为 1。
     2.   根据这个标志位，途中的路由器不会对⼤数据包进⾏分⽚，⽽是将包丢弃。 随后，通过⼀个 ICMP 的不可达消息将数据链路上 MTU 的值⼀起给发送主机，不可达消息的类型为「需要进⾏分 ⽚但设置了不分⽚位」
     3.   发送主机端每次收到 ICMP 差错报⽂时就减少包的⼤⼩，以此来定位⼀个合适的 MTU 值，以便能到达⽬标主机。


[返回网络主线首页](/network/system/)