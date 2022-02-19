/*
 * @Descripttion:
 * @Author: JTune
 * @Date: 2021-01-14 11:41:42
 */
import Vue from 'vue';

import 'normalize.css/normalize.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import '@/assets/styles/formMaking.scss';
import '@/assets/styles/index.scss';
import App from './App';
import store from '@/store';
import router from '@/router/staticRouter';
import '@/assets/icons'; // 全局icon
import '@/router';
import Print from 'vue-print-nb'; // 注册
import axios from '@/utils/axios';
import FormMaking from '@/utils/vue-form-making';
import '@/utils/vue-form-making/dist/FormMaking.css';
// 流程初始化组件
import NodeWrap from '@/components/workflow/nodeWrap';
import AddNode from '@/components/workflow/addNode';
Vue.use(Print);
Vue.use(FormMaking);
Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.use(NodeWrap);
Vue.component('NodeWrap', NodeWrap);;
Vue.use(AddNode);
Vue.component('AddNode', AddNode); // 初始化组件
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
