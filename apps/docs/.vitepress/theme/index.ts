import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import QuizPanel from './components/QuizPanel.vue';
import './styles.css';

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('QuizPanel', QuizPanel);
  }
};

export default theme;
