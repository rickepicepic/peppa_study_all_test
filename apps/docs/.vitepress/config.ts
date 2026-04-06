import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/peppa_study_all_test/',
  title: '佩奇·李的计算机基础学习平台',
  description: '计算机网络、数据库、操作系统、Linux、数据结构、云原生技术',
  themeConfig: {
    nav: [
      {
        text: '学习模块',
        items: [
          { text: '计算机网络', link: '/network/system/' },
          { text: '数据库', link: '/database/system/' },
          { text: '操作系统', link: '/os/system/' },
          { text: 'Linux', link: '/linux/system/' },
          { text: '数据结构', link: '/data-structure/system/' },
          { text: '云原生技术', link: '/cloud-native/system/' }
        ]
      },
      { text: '体系化主线', link: '/system/' },
      { text: '面试速查', link: '/interview/' }
    ],
    sidebar: {
      '/system/': [
        {
          text: '体系化主线总览',
          items: [
            { text: '总览', link: '/system/' },
            { text: '计算机网络', link: '/network/system/' },
            { text: '数据库', link: '/database/system/' },
            { text: '操作系统', link: '/os/system/' },
            { text: 'Linux', link: '/linux/system/' },
            { text: '数据结构', link: '/data-structure/system/' },
            { text: '云原生技术', link: '/cloud-native/system/' }
          ]
        }
      ],
      '/interview/': [
        {
          text: '面试速查总览',
          items: [
            { text: '总览', link: '/interview/' },
            { text: '计算机网络', link: '/network/interview/' },
            { text: '数据库', link: '/database/interview/' },
            { text: '操作系统', link: '/os/interview/' },
            { text: 'Linux', link: '/linux/interview/' },
            { text: '数据结构', link: '/data-structure/interview/' },
            { text: '云原生技术', link: '/cloud-native/interview/' }
          ]
        }
      ],
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
            { text: '网络模型面试题', link: '/network/interview/network-models' },
            { text: '应用层面试题', link: '/network/interview/application-layer' },
            { text: '传输层面试题', link: '/network/interview/transport-layer' },
            { text: '网络场景面试题', link: '/network/interview/network-scenarios' },
            { text: '网络攻击面试题', link: '/network/interview/network-security' }
          ]
        }
      ],
      '/database/system/': [
        {
          text: '数据库 · 体系化主线',
          items: [{ text: '概览', link: '/database/system/' }]
        }
      ],
      '/database/interview/': [
        {
          text: '数据库 · 面试速查',
          items: [{ text: '概览', link: '/database/interview/' }]
        }
      ],
      '/os/system/': [
        {
          text: '操作系统 · 体系化主线',
          items: [{ text: '概览', link: '/os/system/' }]
        }
      ],
      '/os/interview/': [
        {
          text: '操作系统 · 面试速查',
          items: [{ text: '概览', link: '/os/interview/' }]
        }
      ],
      '/linux/system/': [
        {
          text: 'Linux · 体系化主线',
          items: [{ text: '概览', link: '/linux/system/' }]
        }
      ],
      '/linux/interview/': [
        {
          text: 'Linux · 面试速查',
          items: [{ text: '概览', link: '/linux/interview/' }]
        }
      ],
      '/data-structure/system/': [
        {
          text: '数据结构 · 体系化主线',
          items: [{ text: '概览', link: '/data-structure/system/' }]
        }
      ],
      '/data-structure/interview/': [
        {
          text: '数据结构 · 面试速查',
          items: [{ text: '概览', link: '/data-structure/interview/' }]
        }
      ],
      '/cloud-native/system/': [
        {
          text: '云原生技术 · 体系化主线',
          items: [{ text: '概览', link: '/cloud-native/system/' }]
        }
      ],
      '/cloud-native/interview/': [
        {
          text: '云原生技术 · 面试速查',
          items: [{ text: '概览', link: '/cloud-native/interview/' }]
        }
      ]
    }
  }
});
