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
      { text: '趣味小游戏', link: '/funny_game/index.html' },
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
            { text: 'OSI 七层模型', link: '/network/system/osi-model' },
            { text: '应用层协议', link: '/network/system/application-protocols' },
            { text: '传输层协议', link: '/network/system/transport-protocols' },
            { text: '网络层协议', link: '/network/system/network-layer-protocols' }
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
          items: [
            { text: '概览', link: '/database/system/' },
            { text: 'MySQL', link: '/database/system/mysql/README' },
            { text: 'Redis', link: '/database/system/redis/README' }
          ]
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
          items: [
            { text: '概览', link: '/os/system/' },
            { text: '硬件基础', link: '/os/system/hardware' },
            { text: '操作系统结构', link: '/os/system/os-structure' },
            { text: '内存管理', link: '/os/system/memory' },
            { text: '进程与线程', link: '/os/system/process' },
            { text: '调度', link: '/os/system/schedule' },
            { text: '文件系统', link: '/os/system/file-system' },
            { text: '设备管理', link: '/os/system/device' },
            { text: '网络系统与高性能 I/O', link: '/os/system/network-system' },
            { text: 'Linux 命令与观测', link: '/os/system/linux-command' }
          ]
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
          items: [
            { text: '概览', link: '/linux/system/' },
            { text: 'Linux 基础', link: '/linux/system/linux-core' },
            { text: 'Linux 命令体系', link: '/linux/system/linux-command-system' },
            { text: 'Shell 编程', link: '/linux/system/shell-programming' }
          ]
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
