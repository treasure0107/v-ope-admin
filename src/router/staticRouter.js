/*
 * @Author: JTune
 * @Descripttion:静态路由
 * @FilePath: \rsh-operation-system-web\src\router\staticRouter.js
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout/index.vue';
Vue.use(VueRouter);
/**
 *
 *hidden: true; // (默认 false)
 *当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 *
 *name: 'router-name'; // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 *alwaysShow：true:// 如果设置为true，将始终显示根菜单
 *meta: {
 * title: 'title'; // 设置该路由在侧边栏和面包屑中展示的名字
 * icon: 'svg-name'; // 设置该路由的图标
 * breadcrumb: false // 如果设置为false，则不会在breadcrumb面包屑中显示,
 * }
 */

export const staticRoutes = [{
  path: '/',
  component: Layout,
  redirect: '/home',
  children: []
},

{
  path: '/404',
  component: () => import('@/views/errorPage/404.vue'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/errorPage/401.vue'),
  hidden: true
},
{
  path: '/login',
  meta: {
    title: '登录'
  },
  component: () => import('@/views/Login.vue'),
  hidden: true
},
{
  path: '*',
  redirect: '/404',
  hidden: true
}
];

export default new VueRouter({
  mode: 'hash', // hash history
  scrollBehavior: () => ({
    y: 0
  }),
  // routes: staticRoutes
  routes: [{
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/Login.vue'),
    hidden: true
  }]
});
// 解决路由重定向报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
