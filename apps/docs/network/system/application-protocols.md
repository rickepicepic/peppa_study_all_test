---
title: 应用层协议
slug: network/application-protocols
subject: network
track: system
tags: [network, application-layer, http, dns]
difficulty: basic
summary: 应用层协议学习模块
updatedAt: 2026-04-06
---

## 应用层协议

### HTTP

#### 什么是HTTP

超文本传输协议，是一个应用层协议。HTTP是一个在计算机领域内，专门在两点之间传输文字、图片、音视频等超文本数据的约定和规范。

**常见字段**

*Host* 字段：客户端发送请求时，用来指定服务器的域名。

*Content-Length 字段*：服务器在返回数据时，会有 `Content-Length` 字段，表明本次回应的数据长度。

*Connection 字段*：`Connection` 字段最常用于客户端要求服务器使用 TCP 持久连接，以便其他请求复用。

*Content-Type 字段*：`Content-Type` 字段用于服务器回应时，告诉客户端，本次数据是什么格式。

*Content-Encoding 字段*：`Content-Encoding` 字段说明数据的压缩方法。表示服务器返回的数据使用了什么压缩格式

#### HTTP协议内容

![HTTP 的消息格式](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E8%BF%87%E7%A8%8B/4.jpg)

##### 请求报文

- 请求报文由三部分组成，分别是**请求行**、**请求头、请求正文**

- 请求方法：

  ![img](https://images2018.cnblogs.com/blog/1418466/201808/1418466-20180810112625596-2103906128.png)

  是否 安全，幂等？

  1. 安全：请求方法不会破坏服务器上资源
  2. 幂等：多次执行相同操作，结果相同。

##### 响应报文

- 响应报文也是由三个部分组成，分别是：**状态行、响应头、响应正文**
- 状态行由协议版本、数字形式的状态代码、及相应的状态描述，各元素之间以空格分隔。
- 状态码有：
  - `200 OK` 客户端请求成功
  - `301 Moved Permanently` 请求永久重定向
  - `302 Moved Temporarily` 请求临时重定向
  - `304 Not Modified` 文件未修改，可以直接使用缓存的文件。
  - `400 Bad Request` 由于客户端请求有语法错误，不能被服务器所理解。
  - `403 Forbidden` 服务器收到请求，但是拒绝提供服务。服务器通常会在响应正文中给出不提供服务的原因
  - `404 Not Found` 请求的资源不存在，例如，输入了错误的URL
  - `500 Internal Server Error` 服务器发生不可预期的错误，导致无法完成客户端的请求。
  - `503 Service Unavailable` 服务器当前不能够处理客户端的请求，在一段时间之后，服务器可能会恢复正常。

#### HTTP 缓存

##### 强制缓存（浏览器）

如果浏览器判断缓存未过期就用本地

![image-20220929223409644](https://raja-img.oss-cn-hangzhou.aliyuncs.com/img/image-20220929223409644.png)

利用两个HTTP响应头来表示有效期

`Cache-Control` 相对时间（优先） 和 `Expires`过期时间

##### 协商缓存（服务器）

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http1.1%E4%BC%98%E5%8C%96/%E7%BC%93%E5%AD%98etag.png)

**协商缓存这两个字段都需要配合强制缓存中 Cache-control 字段来使用，只有在未能命中强制缓存的时候，才能发起带有协商缓存字段的请求**。

#### HTTP1.0和HTTP1.1

##### HTTP1.0

1. 优点

   1. 简单

      报文格式：首部+body，首部信息也是kv形式。

   2. 灵活易拓展

      请求方法，URI和URL，状态码，头部字段等没有硬性要求。且因为其工作在应用层，下层可以随意替换。

   3. 应用广泛，跨平台

2. 缺点：

   1. 无状态：关联性操作很麻烦。
   2. 明文传输：易窃听
   3. 不验证通信方的身份，因此有可能遭遇伪装
   4. 无法证明报文的完整性，所以有可能已遭篡改

##### HTTP1.1

相比于1.0在性能上的改进，使用长链接，支持pipe。

连接方式：减少TCP建立次数

1. 短连接：每一个 HTTP 请求之前都会有一次 TCP 握手，耗费时间。

2. 长连接：一个长连接会保持一段时间，重复用于发送一系列请求，节省了新建 TCP 连接握手的时间，还可以利用 TCP 的性能增强能力。当然这个连接也不会一直保留着：连接在空闲一段时间后会被关闭。

   （支持pipe传输成为可能）

3. 流水线：流水线是在同一条长连接上发出连续的请求，而不用等待应答返回。这样可以避免连接延迟。

   但是服务器必须按照发送请求的顺序来响应这些请求。（容易出现响应的队头阻塞）

   与之相对应的非流水线方式是客户在收到前一个响应后才能发送下一个请求。（容易出现请求的队头阻塞）

#### HTTP1.1优化

##### 缓存：避免发送HTTP请求

第一次请求把`url-资源`缓存在本地，同时保存过期时间。过期就携带缓存摘要重新请求，服务器比较相同则返回304,

##### 减少HTTP请求次数

1. 重定向交给代理服务器

   而且当代理服务器知晓了重定向规则后，可以进一步减少消息传递次数

   依赖于重定向码的拓展

   ![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http1.1%E4%BC%98%E5%8C%96/%E9%87%8D%E5%AE%9A%E5%90%91%E5%93%8D%E5%BA%94%E7%A0%81.png)

2. 合并请求

   可以通过将多个小资源合并为一个大资源来请求。或者直接把数据一起发回来。

   1. 减少重复的http头部信息
   2. 减少TCP握手次数

   但是如果一个资源发生改变，需要重新请求所有数据。

3. 延迟发送

   按需请求数据。

##### 减少响应数据大小。

客户端：`Accept-Encoding`字段告知支持的加密方式。

服务端：`content-encoding` 告知加密方式。

#### HTTPS

`HTTP1.1`明文，不验证身份，不验证数据完整性。

`HTTPS`在应用层和传输层之间加入`SSL/TLS`协议保证安全性。

![HTTP 与 HTTPS 网络层](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/HTTP/19-HTTPS%E4%B8%8EHTTP.png)

1. 信息加密：混合加密（对称和非对称加密）

   通信建立前采用非对称加密交换会话密钥，后续使用会话密钥对称加密数据。

   私钥加密，公钥解密：不会被修改（加密摘要）

   公钥加密，私钥解密：保证数据传输（加密信息）

2. 校验机制：摘要算法（服务端私钥加密）

3. 身份证书：服务器公钥给CA机构，防止被伪造

##### SSL/TLS协议

1. 客户端向服务端索要并验证服务器`公钥`。
2. 协商`会话密钥`
3. 采用`会话密钥`通信

##### RSA四次握手

用于计算`会话密钥`

1. 客户端请求：

   1. 支持`TLS/SSL协议`版本
   2. 客户端`随机数A`（公开）
   3. 客户端支持的加密算法（RSA）

2. 服务端请求：

   1. 确认`SSL/TLS`版本
   2. 服务端`随机数B`（公开）
   3. 确认加密算法
   4. 服务器证书

3. 客户端响应：

   先验证证书获取`服务器公钥`，生成`随机数C`，计算出`会话密钥`

   1. 公钥加密`随机数C`（加密信息）
   2. 标志加密
   3. 通信摘要

4. 服务器响应：

   根据`ABC`计算出`会话密钥`

   1. 标志加密
   2. 通信摘要

缺陷：不支持前向加密：服务器私钥泄漏后，之前的数据都可以解密。

##### ECDHE 握手

确认会话密钥算法：

> 双方确定`圆锥曲线`和`基点G`
>
> 客户端随机生成密钥`d1`，计算出公钥`Q1 = d1 * G`
>
> 服务端随机生成密钥`d2`，计算出公钥`Q2 = d2 * G`
>
> 客户端获取`Q2`,计算出`(x1,y1) = d1*Q2`
>
> 服务端获取`Q1`,计算出`(x2,y2) = d2*Q1`
>
> 因为`d1*Q2 = d1*d2*G = d2*Q1`，可以得到`x1 = x2`相同
>
> 所以`x`就是确定的会话密钥

1. 客户端：

   1. `Client Hello`
      1. 支持`TLS/SSL协议`版本
      2. 客户端`随机数X`（公开）
      3. 客户端支持的加密算法（ECDHE）

2. 服务端：

   1. `Server Hello`
      1. 确认`SSL/TLS`版本
      2. 服务端`随机数Y`（公开）
      3. 确认加密算法
         1. 密钥协商算法：ECDHE
         2. 签名算法：RSA
         3. 握手后通信使用AES对称算法
         4. 摘要算法

   2. `Certificate`：证书消息
   3. `Server Key Exchange`：选取的`椭圆曲线和基点G`
      1. 选好椭圆曲线
      2. 生成随机数`b`作为私钥,保留本地
      3. 服务器公钥`B`给服务端
      4. RSA摘要算法签名公钥（服务器私钥）。

   4. `Server Hello Done`：结束

3. 客户端

   客户端收到证书去CA校验并获取服务器公钥，使用服务器公钥验证公钥`B`。

   客户端生成`a`作为客户端私钥，椭圆曲线公钥`A`

   客户端计算出`会话密钥x`+客户端`随机数X`+服务端`随机数Y` = `会话密钥`

   1. `Client Key Exchange`

      客户端公钥`A`

   2. `Change Cipher Spec`：后续采用加密通信

   3. `Encrypted Handshake Message`：之前发送数据的摘要，使用会话密钥加密（验证是否可用）。

4. 服务端

   服务端拿到公钥`A`，算出`x`。

   服务端计算出`椭圆曲线x`+客户端`随机数X`+服务端`随机数Y`= `会话密钥`

   1. `Change Cipher Spec`：后续采用加密通信
   2. `Encrypted Handshake Message`：之前发送数据的加密摘要

提升：

1. 往返时间减少

   客户端可以在第三次握手后计算出密钥之后就发送数据，将2RTT减少为1RTT。

2. 重连恢复

   1. 会话复用Session：

      TLS握手后双方缓存`会话密钥`和`SessionID`标记这次TLS握手

      缺点：

      1. 服务端内存压力增大
      2. 服务器负载均衡，不一定命中缓存

   2. 把`会话密钥`加密成`token`给客户端保存

      注：`TLS1.3`直接第一次就把数据和`会话token`发送给服务端

      缺点：容易被截获（需要设置合理的过期时间）

##### 中间人问题

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/network/http/https%E4%B8%AD%E9%97%B4%E4%BA%BA.drawio.png)

相当于客户端和中间人加密通信，中间人和服务器加密通信。

但是前提是我们可以从CA解析中间人提供的自己的服务器证书。

中间人能够解密数据需要：

1. 去服务端拿到私钥
2. 去CA签发私钥
3. 自己签发证书，需要被浏览器信任
   1. 本机中病毒，添加根证书
   2. 信任不受保护的连接

保护方式：可以采用双向认证。

#### HTTP2

![HTT/1 ~ HTTP/2](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/HTTP/25-HTTP2.png)

##### 基于HTTPS

##### HPACK 头部压缩

使用`HPACK算法`压缩头部，共同维护头信息表，每次发送可以只发送索引号

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/network/http/index.png)

`1`表示表中存在，剩下位数可以表示对应编号。

1. 静态字典

   存放常见的字段和对应的值

   ![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http2/%E9%9D%99%E6%80%81%E8%A1%A8.png)

   如果头部字段属于静态表范围，并且 Value 是变化，那么它的 HTTP/2 头部前 2 位固定为 `01`

   ![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http2/%E9%9D%99%E6%80%81%E5%A4%B4%E9%83%A8.png)

   第二个字节的首个比特位表示 Value 是否经过 Huffman 编码，剩余的 7 位表示 Value 的长度，比如这次例子的第二个字节为 `10000110`，首位比特位为 1 就代表 Value 字符串是经过 Huffman 编码的，经过 Huffman 编码的 Value 长度为 6。

   ![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http2/%E9%9D%99%E6%80%81%E5%A4%B4%E9%83%A82.png)

2. 动态字典

   不在静态表中的字段就在huffman编码之后添加到双方动态表中，之后每次只需要发这个字段对应表中的下标即可。

   限制：

   1. 同一个连接下，相同的字段名
   2. 双方的字典占用会越来越大

##### 二进制帧

将原本HTTP纯文本更改为二进制帧形式（头信息帧+数据帧），计算机可以直接解析二进制数据。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http2/%E4%BA%8C%E8%BF%9B%E5%88%B6%E5%B8%A7.png)

二进制帧结构

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http2/%E5%B8%A7%E6%A0%BC%E5%BC%8F.png)

帧类型：控制帧，数据帧

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http2/%E5%B8%A7%E7%B1%BB%E5%9E%8B.png)

标志位：控制信息

- **END_HEADERS** 表示头数据结束标志，相当于 HTTP/1 里头后的空行（“\r\n”）；
- **END_Stream** 表示单方向数据发送结束，后续不会再有数据帧。
- **PRIORITY** 表示流的优先级；

流标志符（StreamID）：

它的作用是用来标识该 Frame 属于哪个 Stream，接收方可以根据这个信息从乱序的帧里找到相同 Stream ID 的帧，从而有序组装信息。

最后面就是**帧数据**了，它存放的是通过 **HPACK 算法**压缩过的 HTTP 头部或包体

##### 并发传输

引入`stram`概念。

1. 1个TCP中有多个`Stream`（一个HTTP的请求与响应都在一个`Stream`）
2. 一个`Stream`包含多个`Message` (一个请求或者响应)
3. 一个`Message`里面存着很多`二进制帧`，一个帧存一个二进制`头部`或`包体`

**不同`Stream`的`frame`可以乱序发送（frame中有stream id，可以被组装），但是一个`Stream`中的`frame`是顺序的。一个`frame`丢失则会阻塞后面的`frame`即其他响应。**

客户端主动建立的`Stream ID`为奇数

服务端主动建立的`Stream ID`为偶数

`Stream ID`有限，用完需要断开TCP连接。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/network/http/http2%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8.jpeg)

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http2/stream.png)

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http2/stream2.png)

##### 服务器推送

在 Nginx 中，如果你希望客户端访问 /test.html 时，服务器直接推送 /test.css，那么可以这么配置：

```nginx
location /test.html { 
  http2_push /test.css; 
}
```

客户端发起的请求，必须使用的是奇数号 Stream，服务器主动的推送，使用的是偶数号 Stream。服务器在推送资源时，会通过 `PUSH_PROMISE` 帧传输 HTTP 头部，并通过帧中的 `Promised Stream ID` 字段告知客户端，接下来会在哪个偶数号 Stream 中发送包体。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http2/push2.png)

##### TCP队头阻塞

存在TCP层次的队头阻塞。

HTTP基于TCP，TCP是字节流协议，TCP层必须保证收到的字节数是完整且连续的，内核才会将内核缓冲区中的数据返回给应用。所以只要存在一个字节数据丢失，剩下的数据都会阻塞在内核缓冲区。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/http2%E9%98%BB%E5%A1%9E.jpeg)

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/http3/tcp%E9%98%9F%E5%A4%B4%E9%98%BB%E5%A1%9E.gif)

packetID类似于tcp的序列号，其中一个丢失需要等待重传才会把数据给应用。

#### HTTP3

HTTP1.1 解决了发送方队头阻塞，但是存在服务端队头阻塞

HTTP2 解决了HTTP队头阻塞，但是丢包会阻塞所有HTTP请求。

所以HTTP3.0把TCP换成UDP

![HTTP/1 ~ HTTP/3](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/HTTP/27-HTTP3.png)

##### QUIC

UDP不可靠，通过QUIC来实现可靠传输

###### 无队头阻塞

**当某个流发生丢包时，只会阻塞这个流，其他流不会受到影响，因此不存在队头阻塞问题**。

但是QUIC保证数据包的可靠性，每个数据包会有一个序号，即使该`Stream`中一个数据包丢失，该`Stream`中其他数据包也需要等待。

QUIC协议建立在UDP基础上，所以`Stream`之间彼此独立。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/quic%E6%97%A0%E9%98%BB%E5%A1%9E.jpeg)

###### 更快的连接建立

HTTP1或HTTP2，TLS和TCP是分层的，需要分批次去握手。

HTTP3中QUIC携带TLS，只需要1个往返时间就可以同时建立连接和密钥协商

![TCP HTTPS（TLS/1.3） 和 QUIC HTTPS ](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/HTTP/28-HTTP3%E4%BA%A4%E4%BA%92%E6%AC%A1%E6%95%B0.png)

甚至在第二次连接时，数据包就可以和QUIC（连接信息+TLS信息）一起发送。

同时重新建立会话时间也很短

![img](https://img-blog.csdnimg.cn/4cad213f5125432693e0e2a512c2d1a1.png)

###### 连接迁移

TCP使用`源IP，源端口，目标IP，目标端口`确定一条连接

在切换网络时需要重新建立TCP连接

QUIC通过`连接ID+TLS密钥等`确定一条连接。

#### 跨域资源共享

CORS 需要浏览器和服务器同时支持，整个 CORS 通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，**CORS 通信与同源的 AJAX 通信没有差别，代码完全一样。浏览器一旦发现 AJAX 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求**，但用户不会有感觉。

浏览器将 CORS 请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

1. 简单请求

   只要同时满足以下两大条件，就属于简单请求。

   （1) 请求方法是以下三种方法之一：

   - HEAD
   - GET
   - POST

   （2）HTTP 的头信息不超出以下几种字段：

   - Accept
   - Accept-Language
   - Content-Language
   - Last-Event-ID
   - Content-Type：只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

   这是为了兼容表单（form），因为历史上表单一直可以发出跨域请求。AJAX 的跨域设计就是，只要表单可以发，AJAX 就可以直接发。

##### 简单请求

对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，增加一个 `Origin` 字段。

```http
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

上面的头信息中，`Origin` 字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

**如果 `Origin` 指定的源，不在许可范围内，服务器会返回一个正常的 HTTP 回应**。浏览器发现，这个回应的头信息没有包含 `Access-Control-Allow-Origin` 字段（详见下文），就知道出错了，从而抛出一个错误，被 `XMLHttpRequest` 的 `onerror` 回调函数捕获。注意，这种错误无法通过状态码识别，因为 HTTP 回应的状态码有可能是 200。

如果 `Origin` 指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

```http
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

**（1）Access-Control-Allow-Origin**

该字段是必须的。它的值要么是请求时 `Origin` 字段的值，要么是一个 `*`，表示接受任意域名的请求。

**（2）Access-Control-Allow-Credentials**

该字段可选。它的值是一个布尔值，表示是否允许发送 Cookie。默认情况下，Cookie 不包括在 CORS 请求之中。设为 `true`，即表示服务器明确许可，Cookie 可以包含在请求中，一起发给服务器。这个值也只能设为 `true`，如果服务器不要浏览器发送 Cookie，删除该字段即可。

**（3）Access-Control-Expose-Headers**

该字段可选。CORS 请求时，`XMLHttpRequest` 对象的 `getResponseHeader()` 方法只能拿到 6 个基本字段：`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`。如果想拿到其他字段，就必须在 `Access-Control-Expose-Headers` 里面指定。上面的例子指定，`getResponseHeader('FooBar')` 可以返回 `FooBar` 字段的值。

**withCredentials属性**

上面说到，CORS 请求默认不发送 Cookie 和 HTTP 认证信息。如果要把 Cookie 发到服务器，一方面要服务器同意，指定 `Access-Control-Allow-Credentials` 字段。

```http
Access-Control-Allow-Credentials: true
```

另一方面，开发者必须在 AJAX 请求中打开 `withCredentials` 属性。

```javascript
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

否则，即使服务器同意发送 Cookie，浏览器也不会发送。或者，服务器要求设置 Cookie，浏览器也不会处理。

需要注意的是，如果要发送 Cookie，`Access-Control-Allow-Origin` 就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie 依然遵循同源政策，只有用服务器域名设置的 Cookie 才会上传，其他域名的 Cookie 并不会上传，且（跨源）原网页代码中的 `document.cookie` 也无法读取服务器域名下的 Cookie。

##### 非简单请求

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 `PUT` 或 `DELETE`，或者 `Content-Type` 字段的类型是 `application/json`。

1. 预检请求

   非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为 "预检" 请求（preflight）。

   浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 `XMLHttpRequest` 请求，否则就报错。

   ```http
   OPTIONS /cors HTTP/1.1
   Origin: http://api.bob.com
   Access-Control-Request-Method: PUT
   Access-Control-Request-Headers: X-Custom-Header
   Host: api.alice.com
   Accept-Language: en-US
   Connection: keep-alive
   User-Agent: Mozilla/5.0...
   ```

   "预检" 请求用的请求方法是 `OPTIONS`，表示这个请求是用来询问的。头信息里面，关键字段是 `Origin`，表示请求来自哪个源。

   除了 `Origin` 字段，"预检" 请求的头信息包括两个特殊字段。

   **（1）Access-Control-Request-Method**

   该字段是必须的，用来列出浏览器的 CORS 请求会用到哪些 HTTP 方法，上例是 `PUT`。

   **（2）Access-Control-Request-Headers**

   该字段是一个逗号分隔的字符串，指定浏览器 CORS 请求会额外发送的头信息字段，上例是 `X-Custom-Header`。

2. 预检请求的回应

   服务器收到 "预检" 请求以后，检查了 `Origin`、`Access-Control-Request-Method` 和 `Access-Control-Request-Headers` 字段以后，确认允许跨源请求，就可以做出回应。

   ```http
   HTTP/1.1 200 OK
   Date: Mon, 01 Dec 2008 01:15:39 GMT
   Server: Apache/2.0.61 (Unix)
   Access-Control-Allow-Origin: http://api.bob.com
   Access-Control-Allow-Methods: GET, POST, PUT
   Access-Control-Allow-Headers: X-Custom-Header
   Content-Type: text/html; charset=utf-8
   Content-Encoding: gzip
   Content-Length: 0
   Keep-Alive: timeout=2, max=100
   Connection: Keep-Alive
   Content-Type: text/plain
   ```

   上面的 HTTP 回应中，关键的是 `Access-Control-Allow-Origin` 字段，表示 `http://api.bob.com` 可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。

   **（1）Access-Control-Allow-Methods**

   该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次 "预检" 请求。

   **（2）Access-Control-Allow-Headers**

   如果浏览器请求包括 `Access-Control-Request-Headers` 字段，则 `Access-Control-Allow-Headers` 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在 "预检" 中请求的字段。

   **（3）Access-Control-Allow-Credentials**

   该字段与简单请求时的含义相同。

   **（4）Access-Control-Max-Age**

   该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是 20 天（1728000 秒），即允许缓存该条回应 1728000 秒（即 20 天），在此期间，不用发出另一条预检请求。

### RPC

TCP采用无边界的数据流，需要应用层来定义消息格式来确认消息边界。

RPC和HTTP都是在应用层实现的协议或方法，RPC用于远程过程调用，属于一种方法，可以像调用本地方法一样调用远程方法，RPC在中间屏蔽了很多细节。

#### 服务发现

建立连接需要获取目标`IP+端口`，获取的过程就是服务发现。

RPC会通过中间服务商去保存相关信息，HTTP则通过DNS服务去获取`IP`。

#### 底层连接

HTTP1.1采用复用TCP长连接

RPC也是采用TCP长连接，同时会存在连接池来缓存连接。

#### 传输内容

同时通过TCP进行传输，所以都是消息头+消息体

HTTP1.1头部冗余，包体明文消耗大。

RPC可以根据好的协议来序列化结构体信息等。

但是HTTP2性能比RPC还好，所以很多RPC协议都底层采用HTTP2

### Websocket

> https://zhuanlan.zhihu.com/p/407711596
>
> https://www.infoq.cn/article/deep-in-websocket-protocol/

WebSocket 协议主要为了解决基于 HTTP/1.x 的 Web 应用无法实现服务端向客户端主动推送的问题，为了兼容现有的设施，WebSocket 协议使用与 HTTP 协议相同的端口，并使用 HTTP Upgrade 机制来进行 WebSocket 握手，当握手完成之后，通信双方便可以按照 WebSocket 协议的方式进行交互

WebSocket 使用 TCP 作为传输层协议，与 HTTP 类似，WebSocket 也支持在 TCP 上层引入 TLS 层，以建立加密数据传输通道，即 WebSocket over TLS, WebSocket 的 URI 与 HTTP URI 的结构类似，对于使用 80 端口的 WebSocket over TCP, 其 URI 的一般形式为 ws://host:port/path/query 对于使用 443 端口的 WebSocket over TLS, 其 URI 的一般形式为 wss://host:port/path/query

对大部分 web 开发者来说，上面这段描述有点枯燥，其实只要记住几点：

1. WebSocket 可以在浏览器里使用
2. 支持双向通信
3. 使用很简单

优点：

1. 支持双向通信，实时性更强。
2. 更好的二进制支持。
3. 较少的控制开销。连接创建后，ws 客户端、服务端进行数据交换时，协议控制的数据包头部较小。在不包含头部的情况下，服务端到客户端的包头只有 2~10 字节（取决于数据包长度），客户端到服务端的的话，需要加上额外的 4 字节的掩码。而 HTTP 协议每次通信都需要携带完整的头部。
4. 支持扩展。ws 协议定义了扩展，用户可以扩展协议，或者实现自定义的子协议。（比如支持自定义压缩算法等）

#### 握手

当客户端想要使用 WebSocket 协议与服务端进行通信时，首先需要确定服务端是否支持 WebSocket 协议，因此 WebSocket 协议的第一步是进行握手，WebSocket 握手采用 HTTP Upgrade 机制，客户端可以发送如下所示的结构发起握手 (请注意 WebSocket 握手只允许使用 HTTP GET 方法):

```c
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket // 必填
Connection: Upgrade // 必填
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Origin: http://example.com
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

客户端发起握手时除了设置 Upgrade 之外，还需要设置其它的 Header 字段

- `Connection: Upgrade`：表示要升级协议
- `Upgrade: websocket`：表示要升级到 websocket 协议。
- `Sec-WebSocket-Version: 13`：表示 websocket 的版本。如果服务端不支持该版本，需要返回一个 `Sec-WebSocket-Version`header，里面包含服务端支持的版本号。
- `Sec-WebSocket-Key`：与后面服务端响应首部的 `Sec-WebSocket-Accept` 是配套的，提供基本的防护，比如恶意的连接，或者无意的连接

服务端若支持 WebSocket 协议，并同意与客户端握手，**则应返回 101 的 HTTP 状态码，表示同意协议升级，同时应设置 Upgrade 字段并将值设置为 websocket, 并将 Connection 字段的值设置为 Upgrade**, 这些都是与标准 HTTP Upgrade 机制完全相同的，除了这些以外，服务端还应设置与 WebSocket 相关的头部字段:

- **| Sec-WebSocket-Accept |**, 必传，`Sec-WebSocket-Accept` 根据客户端请求首部的 `Sec-WebSocket-Key` 计算出来。
  - 将 `Sec-WebSocket-Key` 跟 `258EAFA5-E914-47DA-95CA-C5AB0DC85B11` 拼接。
  - 通过 SHA1 计算出摘要，并转成 base64 字符串。
- **| Sec-WebSocket-Protocol |,** 可选，若客户端在握手时传递了希望使用的 WebSocket 子协议，则服务端可在客户端传递的子协议列表中选择其中支持的一个，服务端也可以不设置该字段表示不希望或不支持客户端传递的任何一个 WebSocket 子协议
- **| Sec-WebSocket-Extensions |**, 可选，与 Sec-WebSocket-Protocol 字段类似，若客户端传递了拓展列表，可服务端可从中选择其中一个做为该字段的值，若服务端不支持或不希望使用这些扩展，则不设置该字段
- **| Sec-WebSocket-Version |**, 必传，服务端从客户端传递的支持的 WebSocket 协议版本中选择其中一个，若客户端传递的所有 WebSocket 协议版本对服务端来说都不支持，则服务端应立即终止握手，并返回 HTTP 426 状态码，同时在 Header 中设置 | Sec-WebSocket-Version | 字段向客户端指示自己所支持的 WebSocket 协议版本列表

#### 数据帧 (frame)

**WebSocket 以 frame 为单位传输数据，frame 是客户端和服务端数据传输的最小单元**，当一条消息过长时，通信方可以将该消息拆分成多个 frame 发送，接收方收到以后重新拼接、解码从而还原出完整的消息，在 WebSocket 中，frame 有多种类型，frame 的类型由 frame 头部的 Opcode 字段指示，WebSocket frame 的结构如下所示:

![img](https://pic2.zhimg.com/80/v2-4f09cf3daaa970c067f3e582d00b3fbd_720w.webp)

* FIN, 长度为 1 比特，该标志位用于指示当前的 frame 是消息的最后一个分段,除了最后一个 frame, 前面的 frame 的 FIN 字段都为 0, 最后一个 frame 的 FIN 字段为 1

* RSV1、2、3： 1 bit each

  除非一个扩展经过协商赋予了非零值以某种含义，否则必须为0
  如果没有定义非零值，并且收到了非零的RSV，则websocket链接会失败

* Opcode： 4 bit

  ```
  解释说明 “Payload data” 的用途/功能
  如果收到了未知的opcode，最后会断开链接
  定义了以下几个opcode值:
      %x0 : 代表连续的帧
      %x1 : text帧
      %x2 ： binary帧
      %x3-7 ： 为非控制帧而预留的
      %x8 ： 关闭握手帧
      %x9 ： ping帧
  %xA :  pong帧
  %xB-F ： 为非控制帧而预留的
  ```

* Mask： 1 bit

  ```
  表示是否要对数据载荷进行掩码操作。从客户端向服务端发送数据时，需要对数据进行掩码操作；从服务端向客户端发送数据时，不需要对数据进行掩码操作。
  如果服务端接收到的数据没有进行过掩码操作，服务端需要断开连接。
  如果 Mask 是 1，那么在 Masking-key 中会定义一个掩码键（masking key），并用这个掩码键来对数据载荷进行反掩码。所有客户端发送到服务端的数据帧，Mask 都是 1。
  ```

* Payload length： 7 bit | 7+16 bit | 7+64 bit

  ```
  “payload data” 的长度如果在0~125 bytes范围内，它就是“payload length”，
  如果是126 bytes， 紧随其后的被表示为16 bits的2 bytes无符号整型就是“payload length”，
  如果是127 bytes， 紧随其后的被表示为64 bits的8 bytes无符号整型就是“payload length”
  ```

* Masking-key： 0 or 4 bytes

  ```
  所有从客户端发送到服务器的帧都包含一个32 bits的掩码（如果“mask bit”被设置成1），否则为0 bit。一旦掩码被设置，所有接收到的payload data都必须与该值以一种算法做异或运算来获取真实值。（见下文）
  ```

* Payload data: (x+y) bytes

  ```
  它是"Extension data"和"Application data"的总和，一般扩展数据为空。
  ```

* Extension data: x bytes

  ```
  除非扩展被定义，否则就是0
  任何扩展必须指定其Extension data的长度
  ```

* Application data: y bytes

  ```
  占据"Extension data"之后的剩余帧的空间
  ```

**注意：这些数据都是以二进制形式表示的，而非ascii编码字符串**

#### 数据传递

一旦 WebSocket 客户端、服务端建立连接后，后续的操作都是基于数据帧的传递。

WebSocket 根据 `opcode` 来区分操作的类型。比如 `0x8` 表示断开连接，`0x0`-`0x2` 表示数据交互。

**数据分片**

WebSocket 的每条消息可能被切分成多个数据帧。当 WebSocket 的接收方收到一个数据帧时，会根据 `FIN` 的值来判断，是否已经收到消息的最后一个数据帧。

FIN=1 表示当前数据帧为消息的最后一个数据帧，此时接收方已经收到完整的消息，可以对消息进行处理。FIN=0，则接收方还需要继续监听接收其余的数据帧。

#### 连接保持 + 心跳

WebSocket 为了保持客户端、服务端的实时双向通信，需要确保客户端、服务端之间的 TCP 通道保持连接没有断开。然而，对于长时间没有数据往来的连接，如果依旧长时间保持着，可能会浪费包括的连接资源。

ping、pong 的操作，对应的是 WebSocket 的两个控制帧，`opcode` 分别是 `0x9`、`0xA`。

#### Sec-WebSocket-Key/Accept 的作用

1. 避免服务端收到非法的 websocket 连接
2. 确保服务端理解 websocket 连接。因为 ws 握手阶段采用的是 http 协议
3. 用浏览器里发起 ajax 请求，设置 header 时，Sec-WebSocket-Key 以及其他相关的 header 是被禁止的。这样可以避免客户端发送 ajax 请求时，意外请求协议升级（websocket upgrade）
4. 可以防止反向代理（不理解 ws 协议）返回错误的数据
5. Sec-WebSocket-Key 主要目的并不是确保数据的安全性，最主要的作用是预防一些常见的意外情况（非故意的）。

强调：Sec-WebSocket-Key/Sec-WebSocket-Accept 的换算，只能带来基本的保障，但连接是否安全、数据是否安全、客户端 / 服务端是否合法的 ws 客户端、ws 服务端，其实并没有实际性的保证。

#### 数据掩码的作用

WebSocket 协议中，数据掩码的作用是增强协议的安全性。但数据掩码并不是为了保护数据本身。

**为了防止早期版本的协议中存在的代理缓存污染攻击（proxy cache poisoning attacks）等问题。**

代理缓存污染攻击

在正式描述攻击步骤之前，我们假设有如下参与者：

- 攻击者、攻击者自己控制的服务器（简称 “**邪恶服务器**”）、攻击者伪造的资源（简称 “**邪恶资源**”）
- 受害者、受害者想要访问的资源（简称 “**正义资源**”）
- 受害者实际想要访问的服务器（简称 “**正义服务器**”）
- 中间代理服务器

攻击步骤一：

1. **攻击者**浏览器 向 **邪恶服务器** 发起 WebSocket 连接。根据前文，首先是一个协议升级请求。协议升级请求 实际到达 **代理服务器**。
2. **代理服务器** 将协议升级请求转发到 **邪恶服务器**。
3. **邪恶服务器** 同意连接，**代理服务器** 将响应转发给 **攻击者**。

由于 upgrade 的实现上有缺陷，**代理服务器** 以为之前转发的是普通的 HTTP 消息。因此，当**协议服务器** 同意连接，**代理服务器** 以为本次会话已经结束。

攻击步骤二：

1. **攻击者** 在之前建立的连接上，通过 WebSocket 的接口向 **邪恶服务器** 发送数据，且数据是精心构造的 HTTP 格式的文本。其中包含了 **正义资源** 的地址，以及一个伪造的 host（指向**正义服务器**）。（见后面报文）
2. 请求到达 **代理服务器** 。虽然复用了之前的 TCP 连接，但 **代理服务器** 以为是新的 HTTP 请求。
3. **代理服务器** 向 **邪恶服务器** 请求 **邪恶资源**。
4. **邪恶服务器** 返回 **邪恶资源**。**代理服务器** 缓存住 **邪恶资源**（url 是对的，但 host 是 **正义服务器** 的地址）。

受害者：

1. **受害者** 通过 **代理服务器** 访问 **正义服务器** 的 **正义资源**。
2. **代理服务器** 检查该资源的 url、host，发现本地有一份缓存（伪造的）。
3. **代理服务器** 将 **邪恶资源** 返回给 **受害者**。
4. **受害者** 卒。

最初的提案是对数据进行加密处理。基于安全、效率的考虑，最终采用了折中的方案：对数据载荷进行掩码处理。


[下一节：传输层协议](/network/system/transport-protocols)