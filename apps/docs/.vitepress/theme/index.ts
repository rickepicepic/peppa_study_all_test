import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { h } from 'vue';
import GlobalAuthPanel from './components/GlobalAuthPanel.vue';
import QuizPanel from './components/QuizPanel.vue';
import './styles.css';

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(GlobalAuthPanel)
    });
  },
  enhanceApp({ app }) {
    app.component('QuizPanel', QuizPanel);
  }
};

export default theme;
