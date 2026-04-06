---
title: 传输层协议
slug: network/transport-protocols
subject: network
track: system
tags: [network, transport-layer, tcp, udp]
difficulty: basic
summary: 传输层协议学习模块
updatedAt: 2026-04-06
---

## 传输层协议

### TCP

#### TCP基础认识

![image-20220110103518827](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220110103518827.png)

1. 序列号

   在建⽴连接时由计算机⽣成的随机数作为其初始值，通过 SYN 包传给接收端主机，每发送⼀次数据，就「累加」⼀次该「数据字节数」的⼤⼩。⽤来解决⽹络包乱序问题。

   **序列号是一个 32 位的无符号数，因此在到达 4G 之后再循环回到 0**。

2. 确认应答号

   指下⼀次「期望」收到的数据的序列号，发送端收到这个确认应答以后可以认为在这个序号以前的数据都已经被正常接收。⽤来解决不丢包的问题

   **序列号为当前端成功发送的数据位数，确认号为当前端成功接收的数据位数，SYN标志位和FIN标志位也要占1位**

3. 标志位

   ACK：该位为 1 时，「确认应答」的字段变为有效，TCP 规定除了最初建⽴连接时的 SYN 包之外该位必须设置为 1 。 

   RST：该位为 1 时，表示 TCP 连接中出现异常必须强制断开连接。 

   SYN：该位为 1 时，表示希望建⽴连接，并在其「序列号」的字段进⾏序列号初始值的设定。 

   FIN：该位为 1 时，表示今后不会再有数据发送，希望断开连接。当通信结束希望断开连接时，通信双⽅的主机之间就可以相互交换 FIN 位为 1 的 TCP 段
   
4. 选项

   ![TCP option 字段 - TFO](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%82%E6%95%B0/TCP%20option%E5%AD%97%E6%AE%B5%20-%20TFO.png)

> 为什么需要TCP协议?TCP工作在那一层?

`IP` 层是「不可靠」的，它不保证网络包的交付、不保证网络包的按序交付、也不保证网络包中的数据的完整性。

> 什么是TCP?
>

TCP是**面向连接,可靠的,基于字节流的传输层通信协议**.

1. 面向连接: 1对1

   不像UDP可以1对多

2. 可靠的：无论网络链路如何改变,TCP可以保证一个报文一定可以到达接收端.

3. 字节流：

   1.   分组：接收方需要规定消息边界
   2.   有序：在前一个TCP报文没到达之前不会把之后的数据交给应用层
   3.   去重：通过序列号去重

> TCP可靠性传输的实现.

1. 以字节为单位的滑动窗口

   TCP连接双方都有一个缓冲空间,TCP只允许另一端发送可接受的数据.

2. 超时重传

   当TCP发出一个段后会定时,如果不能及时收到目的端的确认将重发这个报文段.

3. 选择确定SACK

   当TCP收到数据后会发送确认(先进行校验,不成功就不回应)

4. TCP会将收到的数据进行排序和去重,然后交给应用层.

> 有一个 IP 的服务器监听了一个端口，它的 TCP 的最大连接数是多少？

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL3hpYW9saW5jb2Rlci9JbWFnZUhvc3QyLyVFOCVBRSVBMSVFNyVBRSU5NyVFNiU5QyVCQSVFNyVCRCU5MSVFNyVCQiU5Qy9UQ1AtJUU0JUI4JTg5JUU2JUFDJUExJUU2JThGJUExJUU2JTg5JThCJUU1JTkyJThDJUU1JTlCJTlCJUU2JUFDJUExJUU2JThDJUE1JUU2JTg5JThCLzExLmpwZw?x-oss-process=image/format,png)

- 文件描述符限制

  ，每个 TCP 连接都是一个文件，如果文件描述符被占满了，会发生 too many open files。Linux 对可打开的文件描述符的数量分别作了三个方面的限制：

  - **系统级**：当前系统可打开的最大数量，通过 cat /proc/sys/fs/file-max 查看；
  - **用户级**：指定用户可打开的最大数量，通过 cat /etc/security/limits.conf 查看；
  - **进程级**：单个进程可打开的最大数量，通过 cat /proc/sys/fs/nr_open 查看；

- **内存限制**，每个 TCP 连接都要占用一定内存，操作系统的内存是有限的，如果内存资源被占满后，会发生 OOM。


#### TCP三次握手,四次挥手


##### 三次握手连接建立

![TCP 三次握手](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4/%E7%BD%91%E7%BB%9C/TCP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B.drawio.png)

初始状态：客户端和服务端都处于`close`状态，服务器监听端口，处于`listen`状态

###### 第一次

客户端随机初始化序列号`client_isn`，同时将`SYN=1`，发送`SYN`，之后处于`SYN_SENT`

> 第一次握手丢失怎么办？

1. 客户端

   迟迟接收不到服务端的`SYN-ACK`触发**超时重传**，重传`SYN`。每次重传时间间隔×2。

   `cat /proc/sys/net/ipv4/tcp_syn_retries # 查看重传次数`

###### 第二次

服务端接收后，初始化序列号`listen_isn`,初始化确认应答号`client_isn+1`，同时将`SYN`和`ACK`置1，发送`SYN-ACK`，之后处于`SYN_RCVD`

> 第二次握手丢失怎么办？

1. 客户端

   客户端以为自己的`SYN`丢失了，触发**超时重传**，重传`SYN`

2. 服务端

   触发**超时重传**,重传`SYN-ACK`，

   `cat /proc/sys/net/ipv4/tcp_synack_retries # 查看重传次数`

###### 第三次

客户端接收到报文后进行回应，初始化确认应答号`listen_isn+1`,最后把报文发送给服务端，之后处于`ESTABLISHED`**（可以携带数据）**；服务端收到应答报文后处于`ESTABLISHED`

> 第三次握手丢失了，会发生什么？

1. 服务端

   服务端会触发**超时重传**,重传`SYN-ACK`

   如果一直丢失直到重传上限，于是再等待一段时间（时间为上一次超时时间的 2 倍），之后便断开连接。

> 查看tcp状态

`netstat -napt`或`ss -napt`

![image-20221004165313666](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20221004165313666.png)

##### 三次握手细节

> 为什么是三次？

1. 防止旧连接的初始化

   如果两次握手则容易回应旧的请求来建立新的连接，而加入第三次握手则可以告知此请求有效。

2. 同步双方的序列号

   确保己方的序列号已经被对方准确接收

   1. 去重
   2. 排序
   3. 获知哪些数据包已经被接收（重传）

3. 避免资源浪费

   客户端的重复的SYN会导致服务端建立多个连接。

   **当然服务端可以通过上下文判断ACK是否有效**

> 每次初始化的序列号为啥不同呢？

1. 防止历史数据被下一个连接接收

   上一次连接发送的数据可能会被当前服务端接收。

   但如果初始值不同则大概率会避免历史报文被正常接收（当然也需要使用时间戳机制进一步确保）。

   eg：客户端和服务端建立一个 TCP 连接，在客户端发送数据包被网络阻塞了，然后超时重传了这个数据包，而此时服务端设备断电重启了，之前与客户端建立的连接就消失了，于是在收到客户端的数据包的时候就会发送 RST 报文。然后服务端和客户端建立新的连接，结果上一次阻塞的数据包到达服务端导致服务端正常接收。

2. 为了安全性：防止黑客伪造相同序列号的TCP报文

> 如何初始化序列号？

ISN随机数是会基于时钟计时器递增的

 ISN 随机生成算法：ISN = M + F (localhost, localport, remotehost, remoteport)。

- `M` 是一个计时器，这个计时器每隔 4 微秒加 1。
- `F` 是一个 Hash 算法，根据源 IP、目的 IP、源端口、目的端口生成一个随机数值。要保证 Hash 算法不能被外部轻易推算得出，用 MD5 算法是一个比较好的选择。

##### MSS和MTU

![MTU 与 MSS](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL3hpYW9saW5jb2Rlci9JbWFnZUhvc3QyLyVFOCVBRSVBMSVFNyVBRSU5NyVFNiU5QyVCQSVFNyVCRCU5MSVFNyVCQiU5Qy9UQ1AtJUU0JUI4JTg5JUU2JUFDJUExJUU2JThGJUExJUU2JTg5JThCJUU1JTkyJThDJUU1JTlCJTlCJUU2JUFDJUExJUU2JThDJUE1JUU2JTg5JThCLzIzLmpwZw?x-oss-process=image/format,png)

- `MTU`：一个网络包的最大长度，以太网中一般为 `1500` 字节；
- `MSS`：除去 IP 和 TCP 头部之后，一个网络包所能容纳的 TCP 数据的最大长度；

如果有超过**MTU**的数据包交给**IP**层，则IP层会进行分片然后交给目标方主机进行拼装再给TCP层。

但是如果一个IP分片丢失，则整个IP报文都需要重传。**而且需要TCP来进行重传**。

接收方TCP没收到数据也就不会响应ACK，于是发送方会超时重传**整个TCP头部和数据（以MTU为单位）**，且还需要IP进行分层。

但是如果TCP层就预先分层，则可以只发送**以MSS为单位的数据包**。

##### SYN 攻击

在 TCP 三次握手的时候，Linux 内核会维护两个队列，分别是：

* 半连接队列，也称 SYN 队列；
* 全连接队列，也称 accept 队列；

![正常流程](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL3hpYW9saW5jb2Rlci9JbWFnZUhvc3QyLyVFOCVBRSVBMSVFNyVBRSU5NyVFNiU5QyVCQSVFNyVCRCU5MSVFNyVCQiU5Qy9UQ1AtJUU0JUI4JTg5JUU2JUFDJUExJUU2JThGJUExJUU2JTg5JThCJUU1JTkyJThDJUU1JTlCJTlCJUU2JUFDJUExJUU2JThDJUE1JUU2JTg5JThCLzI2LmpwZw?x-oss-process=image/format,png)

1. 服务器接收到`SYN`请求，创建`半连接对象`放入`SYN队列`，然后发送`SYN-ACK`，之后等待
2. 服务端接收到`ACK`后从`SYN队列`取一个`半连接对象`创建为`全连接对象`放入`Accept队列`，应用通过`accept`取出全连接对象。

**如果两个队列满了，都会丢弃后续的报文。**

SYN攻击：一直发送不同`IP+端口`的`SYN`请求来打满`SYN`队列。

避免方式：

- 调大 netdev_max_backlog；

  可以增加网卡的接收队列，缓冲后续请求。

- 增大 TCP 半连接队列；

- 开启 tcp_syncookies；

  开启 syncookies 功能就相当于绕过了 SYN 半连接来建立连接。

  当`SYN队列`满了，服务器接收到后续报文会计算一个`Cookie`然后在第二次握手时传回去。当客户端发送第三次握手ACK时服务端只需要校验合法就可以直接放入`accept`队列。

  `net.ipv4.tcp_syncookies` 参数主要有以下三个值：

  - 0 值，表示关闭该功能；
  - 1 值，表示仅当 SYN 半连接队列放不下时，再启用它；
  - 2 值，表示无条件开启功能；

  `echo 1 > /proc/sys/net/ipv4/tcp_syncookies`

- 减少 SYN+ACK 重传次数

  `SYN攻击`时会有很多`SYN-ACK`的连接，可以减少重传次数。

##### 四次挥手连接断开

![客户端主动关闭连接 —— TCP 四次挥手](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL3hpYW9saW5jb2Rlci9JbWFnZUhvc3QyLyVFOCVBRSVBMSVFNyVBRSU5NyVFNiU5QyVCQSVFNyVCRCU5MSVFNyVCQiU5Qy9UQ1AtJUU0JUI4JTg5JUU2JUFDJUExJUU2JThGJUExJUU2JTg5JThCJUU1JTkyJThDJUU1JTlCJTlCJUU2JUFDJUExJUU2JThDJUE1JUU2JTg5JThCLzMwLmpwZw?x-oss-process=image/format,png)

###### 第一次

客户端打算断开连接，发送`FIN=1`的报文，之后处于`FIN_WAIT_1`状态**（客户端不发送消息但仍然可以接收数据。）**

> 第一次挥手丢失怎么办？

触发**超时重传**，重传 FIN 报文，重发次数由 `tcp_orphan_retries` 参数控制。间隔主键×2。

达到上限就`close`

###### 第二次

服务端收到`FIN`，向客户端回复`ACK`报文，然后进入`CLOSE_WAIT`状态**（服务端仍可以发送数据）**

客户端接收到`ACK`，进入`FIN_WAIT_2`状态。

> 第二次挥手丢失怎么办？

1. 客户端

   客户端就会触发超时重传机制，重传 FIN 报文，直到收到服务端的第二次挥手，或者达到最大的重传次数就`close`。

   

   提醒：对于调用 close 关闭的连接（**无法发送和接收**），如果在 tcp_fin_timeout 秒后还没有收到 FIN 报文，客户端（主动关闭方）的连接就会直接关闭。
   
   但是如果 `shutdown` 则只关闭了发送方向，客户端在没有等待到服务端的`FIN`则会一直等待。

###### 第三次

服务端将数据处理完（中间可能发送数据），然后发送`FIN`，进入`LAST_ACK`状态

（**服务端在接收`FIN`后内核响应`ACK`**，之后进程需要主动`close`来发送`FIN`）

> 第三次挥手丢失怎么办？

1. 服务端

   服务端发送`FIN`后如果一直等不到`ACK`，则触发**超时重传**，

###### 第四次

客户端接收到服务端的`FIN`后，回复`ACK`，然后进入到`TIME_WAIT`状态。

服务端接收到`ACK`后进入`close`断开连接。

客户端等待`2MSL`后进入`close`断开连接。

> 第四次挥手丢失怎么办？

在 Linux 系统，TIME_WAIT 状态会持续 2MSL 后才会进入关闭状态。

如果第四次挥手的 ACK 报文没有到达服务端，服务端就会重发 FIN 报文，重发次数仍然由的 `tcp_orphan_retries` 参数控制。

> MSL 是报文最长生存时间，超过这个时间报文就会被丢弃。
>
> MSL 与 TTL 的区别： MSL 的单位是时间，而 TTL 是经过路由跳数。所以 **MSL 应该要大于等于 TTL 消耗为 0 的时间**。
>
> **TTL 的值一般是 64**；**MSL 一般为 30 秒**

**2MSL**则表明一来一回需要2倍时间。可以允许报文至少丢失一次。

###### TIME_WAIT

主动关闭方出现`TIME_WAIT`说明不发送数据，但保留接收数据的能力

> 为什么需要？

原因：

1、防止被动关闭方的延迟数据被之后的接收方错乱接收

为了防止历史连接中的数据，被后面相同四元组的连接错误的接收

因此 TCP 设计了 TIME_WAIT 状态，状态会持续 `2MSL` 时长，这个时间**足以让两个方向上的数据包都被丢弃，使得原来连接的数据包在网络中都自然消失，再出现的数据包一定都是新建立连接所产生的。**

2、防止被动关闭方没有收到最后的ACK

防止主动关闭方的最后的ACK丢失，对后续连接造成影响。

所以，我们在默认情况下，如果客户端等待足够长的时间就会遇到以下两种情况：

1. 服务端正常收到了 `ACK` 消息并关闭当前 TCP 连接；
2. 服务端没有收到 `ACK` 消息，重新发送 `FIN` 关闭连接并等待新的 `ACK` 消息；

`2MSL` 的时间是从**客户端接收到 FIN 后发送 ACK 开始计时的**。如果在 TIME-WAIT 时间内，因为客户端的 ACK 没有传输到服务端，客户端又接收到了服务端重发的 FIN 报文，那么 **2MSL 时间将重新计时**。

> TIME_WAIT过多有什么危害？

- 第一是占用系统资源，比如文件描述符、内存资源、CPU 资源、线程资源等；
- 第二是占用端口资源，端口资源也是有限的，一般可以开启的端口为 `32768～61000`，也可以通过 `net.ipv4.ip_local_port_range` 参数指定范围。

> 如何优化TIME_WAIT

*方式一：net.ipv4.tcp_tw_reuse 和 tcp_timestamps*

如下的 Linux 内核参数开启后，则可以**复用处于 TIME_WAIT 的 socket 为新的连接所用**。

有一点需要注意的是，**tcp_tw_reuse 功能只能用客户端（连接发起方），因为开启了该功能，在调用 connect () 函数时，内核会随机找一个 time_wait 状态超过 1 秒的连接给新的连接复用。**

使用这个选项，还有一个前提，**需要打开对 TCP 时间戳的支持**，由于引入了时间戳，我们在前面提到的 `2MSL` 问题就不复存在了，因为重复的数据包会因为时间戳过期被自然丢

*方式二：net.ipv4.tcp_max_tw_buckets*

这个值默认为 18000，**当系统中处于 TIME_WAIT 的连接一旦超过这个值时，系统就会将后面的 TIME_WAIT 连接状态重置**，这个方法比较暴力。

*方式三：程序中使用 SO_LINGER*

我们可以通过设置 socket 选项，来设置调用 close 关闭连接行为。

##### 客户端close

![客户端调用 close 过程](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL3hpYW9saW5jb2Rlci9JbWFnZUhvc3QyLyVFOCVBRSVBMSVFNyVBRSU5NyVFNiU5QyVCQSVFNyVCRCU5MSVFNyVCQiU5Qy9UQ1AtJUU0JUI4JTg5JUU2JUFDJUExJUU2JThGJUExJUU2JTg5JThCJUU1JTkyJThDJUU1JTlCJTlCJUU2JUFDJUExJUU2JThDJUE1JUU2JTg5JThCLzM3LmpwZw?x-oss-process=image/format,png)

- 客户端调用 `close`，表明客户端没有数据需要发送了，则此时会向服务端发送 FIN 报文，进入 FIN_WAIT_1 状态；
- 服务端接收到了 FIN 报文，TCP 协议栈会为 FIN 包插入一个文件结束符 `EOF` 到接收缓冲区中，应用程序可以通过 `read` 调用来感知这个 FIN 包。这个 `EOF` 会被**放在已排队等候的其他已接收的数据之后**，这就意味着服务端需要处理这种异常情况，因为 EOF 表示在该连接上再无额外数据到达。此时，服务端进入 CLOSE_WAIT 状态；
- 接着，当处理完数据后，自然就会读到 `EOF`，于是也调用 `close` 关闭它的套接字，这会使得服务端发出一个 FIN 包，之后处于 LAST_ACK 状态；
- 客户端接收到服务端的 FIN 包，并发送 ACK 确认包给服务端，此时客户端将进入 TIME_WAIT 状态；
- 服务端收到 ACK 确认包后，就进入了最后的 CLOSE 状态；
- 客户端经过 `2MSL` 时间之后，也进入 CLOSE 状态；

#### 客户端崩溃

![web 服务的 心跳机制](https://img-blog.csdnimg.cn/img_convert/2d872f947dedd24800a1867dc4f8b9ce.png)

TCP存在心跳来监听

#### 服务器进程崩溃

TCP 的连接信息是由内核维护的，所以当服务端的进程崩溃后，内核需要回收该进程的所有 TCP 连接资源，于是内核会发送第一次挥手 FIN 报文，后续的挥手过程也都是在内核完成，并不需要进程的参与，所以即使服务端的进程退出了，还是能与客户端完成 TCP 四次挥手的过程。

#### TCP重传，滑动窗口，拥塞控制

##### 重传机制

TCP实现可靠传输的方式之一,是通过序列号进行确认应答.

ACK表示在这个序号以前的数据包都已经被正常接收。

SEQ没发送一个数据包就+对应长度,用来解决乱序和丢包。

###### 超时重传

1. 数据包丢失

2. 确认应答丢失

![image-20220111145808709](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220111145808709.png)

   > 超时时间应该设置为多少呢?

   **RTT** 是数据从网络一端传到另一端需要的时间.(包的往返时延)

   **RTO**是超时重传时间

   所以**RTO**应该略大于**RTT**

###### 快速重传(重传一个包)

TCP 还有另外一种**快速重传（Fast Retransmit）机制**，它**不以时间为驱动，而是以数据驱动重传**。

![快速重传机制](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/10.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0)

接收方连续发送三次相同的ACK触发快速重传

但是发送端一次只能获知一个包丢失，在多个包丢失的场景下效率低

###### SACK(告知丢包区间)

还有一种实现重传机制的方式叫：`SACK`（ Selective Acknowledgment）， **选择性确认**。

这种方式需要在 TCP 头部「选项」字段里加一个 `SACK` 的东西，它**可以将已收到的数据的信息发送给「发送方」**，这样发送方就可以知道哪些数据收到了，哪些数据没收到，知道了这些信息，就可以**只重传丢失的数据**。

![选择性确认](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/11.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0)

###### D-SACK(告知重复接收)

Duplicate SACK 又称 `D-SACK`，其主要**使用了 SACK 来告诉「发送方」有哪些数据被重复接收了。**

在收到重复的包时可以告知发送方

1. 可以让「发送方」知道，是发出去的包丢了，还是接收方回应的 ACK 包丢了；
2. 可以知道是不是「发送方」的数据包被网络延迟了；
3. 可以知道网络中是不是把「发送方」的数据包给复制了；

##### 滑动窗口

那么有了窗⼝，就可以指定窗⼝⼤⼩，窗⼝⼤⼩就是指⽆需等待确认应答，⽽可以继续发送数据的最⼤值

窗⼝的实现实际上是操作系统开辟的⼀个**缓存空间**，**发送⽅主机在等到确认应答返回之前，必须在缓冲区中保留已发送的数据。如果按期收到确认应答，此时数据就可以从缓存区清除**

> 窗口大小由哪一方决定?

TCP 头⾥有⼀个字段叫 Window ，也就是窗⼝⼤⼩。 这个字段是**接收端告诉发送端⾃⼰还有多少缓冲区可以接收数据**。于是发送端就可以根据这个接收端的处理能⼒来 发送数据，⽽不会导致接收端处理不过来。 所以，**通常窗⼝的⼤⼩是由接收⽅的窗⼝⼤⼩来决定的**

**发送方发送的数据大小不能超过接收方的窗口大小，否则接收方就无法正常接收到数据。**

> 发送方窗口

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/16.jpg?)

> 接收方的滑动窗口

![接收窗口](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/20.jpg)

##### 流量控制

**TCP 通过滑动窗口让「发送方」根据「接收方」的实际接收能力控制发送的数据量，这就是所谓的流量控制。**

发送方发送数据后会将数据缓存等待ACK，接收方接收数据后也会等待应用程序读取，之后把可用缓冲区大小通过响应报文告知发送方，发送方捅过接收方的窗口大小来调节自身窗口从而控制发送数据的大小。

问题：

1. 接收方反馈窗口为0（窗口关闭），发送方就不会再发送数据，但之后接收方的ACK丢失，则会造成双方死锁。

   TCP 为每个连接设有一个持续定时器，**只要 TCP 连接一方收到对方的零窗口通知，就启动持续计时器。**

   如果持续计时器超时，就会发送**窗口探测 ( Window probe ) 报文**，而对方在确认这个探测报文时，给出自己现在的接收窗口大小。

   窗口探测的次数一般为 3 次，每次大约 30-60 秒（不同的实现可能会不一样）。如果 3 次过后接收窗口还是 0 的话，有的 TCP 实现就会发 `RST` 报文来中断连接。

2. 发送方在窗口较小的时候仍然发送数据

   1. 接收方在小窗口时告知窗口关闭

      窗口小于MSS(一个TCP报文最大长度)或缓存空间一半

   2. 发送方避免发送小数据

      使用 Nagle 算法，该算法的思路是延时处理，只有满足下面两个条件中的任意一个条件，才可以发送数据：

      - 条件一：要等到窗口大小 >= `MSS` 并且 数据大小 >= `MSS`；
      - 条件二：收到之前发送数据的 `ack` 回包；

##### 拥塞控制

**拥塞窗口 cwnd** 是发送方维护的一个的状态变量，它会根据 **网络的拥塞程度动态变化的**。

**发送窗口的值是 swnd = min (cwnd, rwnd)，也就是拥塞窗口和接收窗口中的最小值。**

拥塞窗口 `cwnd` 变化的规则：

- 只要网络中没有出现拥塞，`cwnd` 就会增大；
- 但网络中出现了拥塞，`cwnd` 就减少；

> 那么怎么知道当前网络是否出现了拥塞呢？

其实只要「发送方」没有在规定时间内接收到 ACK 应答报文，也就是**发生了超时重传，就会认为网络出现了拥塞。**

###### 慢启动

慢启动的算法记住一个规则就行：**当发送方每收到一个 ACK，拥塞窗口 cwnd 的大小就会加 1。**

![慢启动算法](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/27.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0)

有一个叫慢启动门限 `ssthresh` （slow start threshold）状态变量。

- 当 `cwnd` < `ssthresh` 时，使用慢启动算法。
- 当 `cwnd` >= `ssthresh` 时，就会使用「拥塞避免算法」

一般来说 `ssthresh` 的大小是 `65535` 字节

###### 拥塞避免算法

那么进入拥塞避免算法后，它的规则是：**每当收到一个 ACK 时，cwnd 增加 1/cwnd。**

![拥塞避免](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/28.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0)

就这么一直增长着后，网络就会慢慢进入了拥塞的状况了，于是就会出现丢包现象，这时就需要对丢失的数据包进行重传。

当触发了重传机制，也就进入了「拥塞发生算法」

######  拥塞发生

当网络出现拥塞，也就是会发生数据包重传，重传机制主要有两种：

- 超时重传

  这个时候，ssthresh 和 cwnd 的值会发生变化：

  - `ssthresh` 设为 `cwnd/2`，
  - `cwnd` 重置为 `1` （是恢复为 cwnd 初始化值，我这里假定 cwnd 初始化值 1）

  ![拥塞发送 —— 超时重传](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/29.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0)

- 快速重传

   `ssthresh` 和 `cwnd` 变化如下：

  - `cwnd = cwnd/2` ，也就是设置为原来的一半；
  - `ssthresh = cwnd`;
  - 进入快速恢复算法

###### 快速恢复

进入快速恢复算法如下：

- 拥塞窗口 `cwnd = ssthresh + 3` （ 3 的意思是确认有 3 个数据包被收到了）；
- 重传丢失的数据包；
- 如果再收到重复的 ACK，那么 cwnd 增加 1；
- 如果收到新数据的 ACK 后，把 cwnd 设置为第一步中的 ssthresh 的值，原因是该 ACK 确认了新的数据，说明从 duplicated ACK 时的数据都已收到，该恢复过程已经结束，可以回到恢复之前的状态了，也即再次进入拥塞避免状态；

![快速重传和快速恢复](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/%E6%8B%A5%E5%A1%9E%E5%8F%91%E7%94%9F-%E5%BF%AB%E9%80%9F%E9%87%8D%E4%BC%A0.drawio.png?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0)

**首先，快速恢复是拥塞发生后慢启动的优化，其首要目的仍然是降低 cwnd 来减缓拥塞，所以必然会出现 cwnd 从大到小的改变。**

**其次，过程 2（cwnd 逐渐加 1）的存在是为了尽快将丢失的数据包发给目标，从而解决拥塞的根本问题（三次相同的 ACK 导致的快速重传），所以这一过程中 cwnd 反而是逐渐增大的。**

#### TCP 优化

##### TCP 握手优化

![TCP 三次握手的状态变迁](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%82%E6%95%B0/5.jpg)

###### 客户端优化

三次握手的主要目的时为了**同步序列号**

客户端在SYN后进入SYN_SEND等待服务端SYN_ACK，如果在网络情况较好时可以减少SYN重传次数，减少等待时间。

###### 服务端优化

在收到客户端SYN后，服务端需要响应SYN_ACK并进入SYN_RCVD。同时内核建立半连接队列维护未完成的握手信息。

1. SYN攻击时增加接收能力

   * 可以增加网卡的接收队列，缓冲后续请求。
   * 扩大半连接队列
   * 启用`tcp_syncookies`来绕过半连接队列

2. 减少`SYN_RCVD`重传次数

3. 全连接队列满时告知客户端

   tcp_abort_on_overflow 共有两个值分别是 0 和 1，其分别表示：

   - 0 ：如果 accept 队列满了，那么 server 扔掉 client 发过来的 ack ；
     - 适合短期accept队列满时采用
   - 1 ：如果 accept 队列满了，server 发送一个 `RST` 包给 client，表示废掉这个握手过程和这个连接；
     - 有你非常肯定 TCP 全连接队列会长期溢出时，才能设置为 1 以尽快通知客户端。

###### 跳过TCP握手

在 Linux 3.7 内核版本之后，提供了 TCP Fast Open 功能，这个功能可以减少 TCP 连接建立的时延。

![开启 TCP Fast Open 功能](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%82%E6%95%B0/22.jpg)

在客户端首次建立连接时的过程：

1. 客户端发送 SYN 报文，该报文包含 Fast Open 选项，且该选项的 Cookie 为空，这表明客户端请求 Fast Open Cookie；
2. 支持 TCP Fast Open 的服务器生成 Cookie，并将其置于 SYN-ACK 数据包中的 Fast Open 选项以发回客户端；
3. 客户端收到 SYN-ACK 后，本地缓存 Fast Open 选项中的 Cookie。

之后再次建立连接时，客户端只需要在SYN时**携带数据和cookie**，服务端检测Cookie是否有效，有效则直接建立连接。否则抛弃数据，返回SYN_ACK继续三次握手。

##### TCP 挥手优化

客户端和服务端双方都可以主动断开连接，**通常先关闭连接的一方称为主动方，后关闭连接的一方称为被动方。**

![客户端主动关闭](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/TCP-参数/25.jpg)

###### 主动方的优化

RST 报文：暴力关闭连接

1. FIN_WAIT1 

   客户端在发送`FIN`后会进入`FIN_WAIT1`(孤儿状态)，等待服务端ACK然后进入`FIN_WAIT2`

   **可以调整 tcp_max_orphans 参数，它定义了「孤儿连接」的最大数量**：

   使得之后的连接调用close后直接RST强制断开。

2. FIN_WAIT2

   当主动方收到 ACK 报文后，会处于 FIN_WAIT2 状态，就表示主动方的发送通道已经关闭，接下来将等待对方发送 FIN 报文，关闭对方的发送通道。

   **如果连接是用 shutdown 函数关闭的，连接可以一直处于 FIN_WAIT2 状态，因为它可能还可以发送或接收数据。但对于 close 函数关闭的孤儿连接，由于无法再发送和接收数据，所以这个状态不可以持续太久，而 tcp_fin_timeout 控制了这个状态下连接的持续时长 2MSL**：**至少允许报文丢失一次**

3. TIME_WAIT

   - 防止历史连接中的数据，被后面相同四元组的连接错误的接收；
   - 保证「被动关闭连接」的一方，能被正确的关闭；

   1. **可以开启时间戳并复用处于TIME_WAIT的连接**
   2. **设置调用 close ，立即发送一个 RST 标志给对端，该 TCP 连接将跳过四次挥手，也就跳过了 TIME_WAIT 状态，直接关闭。**

###### 被动方优化

寻找当TCP连接返回EOF后为啥程序还不close的问题

##### 传输数据优化

TCP 可靠性是通过 ACK 确认报文实现的，又依赖滑动窗口提升了发送速度也兼顾了接收方的处理能力。

可以参考带宽提高滑动窗口的大小。

Linux 会对缓冲区动态调节，我们应该把缓冲区的上限设置为带宽时延积。发送缓冲区的调节功能是自动打开的，而接收缓冲区需要把 tcp_moderate_rcvbuf 设置为 1 来开启。其中，调节的依据是 TCP 内存范围 tcp_mem。

#### TCP缺陷

##### 升级 TCP 的工作很困难

但是 TCP 协议是在内核中实现的，应用程序只能使用不能修改，如果要想升级 TCP 协议，那么只能升级内核。

##### TCP 建立连接的延迟

三次握手完了才能四次TLS握手

##### TCP 存在队头阻塞问题

TCP 是字节流协议，**TCP 层必须保证收到的字节数据是完整且有序的**，如果序列号较低的 TCP 段在网络传输中丢失了，即使序列号较高的 TCP 段已经被接收了，应用层也无法从内核中读取到这部分数据。

##### 网络迁移需要重新建立 TCP 连接

**当移动设备的网络从 4G 切换到 WIFI 时，意味着 IP 地址变化了，那么就必须要断开连接，然后重新建立 TCP 连接**。

#### 断电和崩溃

如果「**客户端进程崩溃**」，客户端的进程在发生崩溃的时候，内核会发送 FIN 报文，与服务端进行四次挥手。

但是，「**客户端主机宕机**」，那么是不会发生四次挥手的，具体后续会发生什么？还要看服务端会不会发送数据？

- 如果服务端会发送数据，由于客户端已经不存在，收不到数据报文的响应报文，服务端的数据报文会超时重传，当重传总间隔时长达到一定阈值（内核会根据 tcp_retries2 设置的值计算出一个阈值）后，会断开 TCP 连接；
- 如果服务端一直不会发送数据，再看服务端有没有开启 TCP keepalive 机制？
  - 如果有开启，服务端在一段时间没有进行数据交互时，会触发 TCP keepalive 机制，探测对方是否存在，如果探测到对方已经消亡，则会断开自身的 TCP 连接；
  - 如果没有开启，服务端的 TCP 连接会一直存在，并且一直保持在 ESTABLISHED 状态。

### UDP

UDP 不提供复杂的控制机制，利用 IP 提供面向「无连接」的通信服务。

![UDP 头部格式](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL3hpYW9saW5jb2Rlci9JbWFnZUhvc3QyLyVFOCVBRSVBMSVFNyVBRSU5NyVFNiU5QyVCQSVFNyVCRCU5MSVFNyVCQiU5Qy9UQ1AtJUU0JUI4JTg5JUU2JUFDJUExJUU2JThGJUExJUU2JTg5JThCJUU1JTkyJThDJUU1JTlCJTlCJUU2JUFDJUExJUU2JThDJUE1JUU2JTg5JThCLzEyLmpwZw?x-oss-process=image/format,png)

- 目标和源端口：主要是告诉 UDP 协议应该把报文发给哪个进程。
- 包长度：该字段保存了 UDP 首部的长度跟数据的长度之和。
- 校验和：校验和是为了提供可靠的 UDP 首部和数据而设计，防止收到在网络传输中受损的 UDP 包。

注：

1. 无首部长度，因为其首部固定8字节
2. 包长度可以通过IP-IP首部-UDP首部计算，但可能为了凑4的倍数而故意设计



### TCP和UDP区别

*1. 连接*

- TCP 是面向连接的传输层协议，传输数据前先要建立连接。
- UDP 是不需要连接，即刻传输数据。

*2. 服务对象*

- TCP 是一对一的两点服务，即一条连接只有两个端点。
- UDP 支持一对一、一对多、多对多的交互通信

*3. 可靠性*

- TCP 是可靠交付数据的，数据可以无差错、不丢失、不重复、按序到达。
- UDP 是尽最大努力交付，不保证可靠交付数据。

*4. 拥塞控制、流量控制*

- TCP 有拥塞控制和流量控制机制，保证数据传输的安全性。
- UDP 则没有，即使网络非常拥堵了，也不会影响 UDP 的发送速率。

*5. 首部开销*

- TCP 首部长度较长，会有一定的开销，首部在没有使用「选项」字段时是 `20` 个字节，如果使用了「选项」字段则会变长的。
- UDP 首部只有 8 个字节，并且是固定不变的，开销较小。

*6. 传输方式*

- TCP 是流式传输，没有边界，但保证顺序和可靠。
- UDP 是一个包一个包的发送，是有边界的，但可能会丢包和乱序。

*7. 分片不同*

- TCP 的数据大小如果大于 MSS 大小，则会在传输层进行分片，目标主机收到后，也同样在传输层组装 TCP 数据包，如果中途丢失了一个分片，只需要传输丢失的这个分片。
- UDP 的数据大小如果大于 MTU 大小，则会在 IP 层进行分片，目标主机收到后，在 IP 层组装完数据，接着再传给传输层。

### 应用场景区别

TCP稳定可靠，常用于

- `FTP` 文件传输；
- HTTP / HTTPS

UDP无连接，可以随时发送数据

- 包总量较少的通信，如 `DNS` 、`SNMP` 等；
- 视频、音频等多媒体通信；
- 广播通信；


[下一节：网络层协议](/network/system/network-layer-protocols)