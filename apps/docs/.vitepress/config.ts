import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/peppa_study_all_test/',
  title: '佩奇·李的计算机基础学习平台',
  description: '首期：计算机网络',
  themeConfig: {
    nav: [
      { text: '体系化主线', link: '/network/system/' },
      { text: '面试速查', link: '/network/interview/' }
    ],
    sidebar: {
      '/network/system/': [
        {
          text: '体系化主线',
          items: [
            { text: '概览', link: '/network/system/' },
            { text: '分层模型与核心协议', link: '/network/system/layer-models' },
            { text: '一次网络请求全链路', link: '/network/system/request-lifecycle' },
            { text: 'TCP 三次握手（含测验）', link: '/network/system/tcp-handshake' },
            { text: 'TCP 可靠传输与拥塞控制', link: '/network/system/tcp-reliability' },
            { text: 'IP、ARP、DNS 与路由转发', link: '/network/system/ip-routing' },
            { text: 'HTTP 演进与 HTTPS/TLS', link: '/network/system/http-evolution' }
          ]
        }
      ],
      '/network/interview/': [
        {
          text: '面试速查',
          items: [
            { text: '概览', link: '/network/interview/' },
            { text: 'TCP 高频问答', link: '/network/interview/tcp-faq' },
            { text: 'HTTP/HTTPS 高频问答', link: '/network/interview/http-faq' },
            { text: 'IP/UDP 与网络排障问答', link: '/network/interview/network-faq' },
            { text: '3 分钟面试输出模板', link: '/network/interview/quick-template' }
          ]
        }
      ]
    }
  }
});
