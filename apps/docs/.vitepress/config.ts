import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '计算机基础学习平台',
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
            { text: 'TCP 三次握手', link: '/content/network/system/tcp-basic' }
          ]
        }
      ],
      '/network/interview/': [
        {
          text: '面试速查',
          items: [{ text: '概览', link: '/network/interview/' }]
        }
      ]
    }
  }
});
