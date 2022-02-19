/*
 * @Descripttion:权限数据
 * @Author: JTune
 * @Date: 2021-01-18 15:43:29
 */
// import {
//   getPermissionList
// } from '@/api/user';
import {
  dynamicRoutes
} from '@/router/dynamicRouter';
import router, {
  staticRoutes
} from '@/router/staticRouter';
import {
  recursionRouter,
  setDefaultRoute
} from '@/utils/recursionRouter';
import Api from '@/api';
import axios from '@/utils/axios';
import {
  localstorageGet
} from '@/utils/auth';

const state = {
  topNavList: [],
  menuDefaultList: [],
  permissionList: [],
  sidebarMenu: [] /** 导航菜单 */
};
const mutations = {
  SET_MENU(state, menu) {
    const arr = menu.filter((item) => {
      return item.name != 'home';
    });
    state.sidebarMenu = arr;
  },
  SET_PERMISSION_LIST: (state, routes) => {
    state.permissionList = routes;
  },
  RESET_PERMISSION: (state) => {
    state.permissionList = [];
    state.sidebarMenu = [];
    state.menuDefaultList = [];
  },
  SET_MENU_DEFAULT_LIST(state, payload) {
    const list = payload.filter((item) => {
      return item.name != 'home';
    });
    state.menuDefaultList = list;
  },
  SET_TOP_NAV_LIST(state, payload) {
    state.topNavList = payload;
  },
  RESET_TOPNAV_LIST: (state) => {
    state.topNavList = [];
  }
};

const actions = {
  // 获表
  getPermissionList({
    commit
  }) {
    return new Promise((resolve, reject) => {
      const url = Api.user.getRoleResourceTree;
      const data = {
        userId: localstorageGet('userId')
      };
      axios.post(url, {
        data
      }, res => {
        if (res.isSuccess) {
          // console.log('res.data', res.data);
          const {
            arr,
            list
          } = res.data.reduce((result, item) => {
            result.arr.push({
              id: item.id,
              path: item.href,
              label: item.aliasName
            });
            if (item.children && item.children.length > 0) {
              result.list = result.list.concat(item.children);
            }
            return result;
          }, {
            arr: [],
            list: []
          });
          commit('SET_TOP_NAV_LIST', arr);
          // 清除菜单
          commit('RESET_PERMISSION');
          const permissionList = list;
          // console.log('permissionList', permissionList);
          // console.log('dynamicRoutes.........', dynamicRoutes);
          // debugger;
          /* 根据权限刷选出我们设置好的路由并加入到 path='/' 的children */
          const routes = recursionRouter(permissionList, dynamicRoutes);
          const MainContainer = staticRoutes.find(v => v.path === '/');
          // console.log('MainContainer', MainContainer);
          // console.log('routes', routes);
          // 初始化children路由
          const children = [];
          // 将当前用户的权限路由添加到动态路由中
          children.push(...routes);
          // console.log('children：', children);
          /* 生成左侧导航菜单 */
          commit('SET_MENU', children);
          commit('SET_MENU_DEFAULT_LIST', children);
          MainContainer.children = children;
          setDefaultRoute([MainContainer]);
          // console.log('staticRoutes', staticRoutes);
          // /* 动态路由 */
          router.addRoutes(staticRoutes);
          // console.log('MainContainer---end', MainContainer);
          // /* 完整的路由表 */
          commit('SET_PERMISSION_LIST', [...staticRoutes]);
          resolve();
        } else {
          console.log('用户没有访问权限');
          // 用户没有权限
          reject(console.error());
        }
      });
    });
  }
  // getPermissionListDemo({
  //   commit
  // }) {
  //   const userId = localstorageGet('userId');
  //   console.log('getPermissionList......userId', userId);
  //   return new Promise((resolve, reject) => {
  //     getPermissionList().then(res => {
  //       const permissionList = res.data;
  //       // console.log('permissionList', permissionList);
  //       /* 根据权限刷选出我们设置好的路由并加入到 path='' 的children */
  //       const routes = recursionRouter(permissionList, dynamicRoutes);
  //       // console.log('staticRoutes', staticRoutes);
  //       const MainContainer = staticRoutes.find(v => v.path === '/');
  //       const children = MainContainer.children;
  //       // 将当前用户的权限路由添加到动态路由中
  //       children.push(...routes);
  //       /* 生成左侧导航菜单 */
  //       commit('SET_MENU', children);
  //       commit('SET_MENU_DEFAULT_LIST', children);
  //       console.log('MainContainer', MainContainer);
  //       /*
  //       为所有有children的菜单路由设置第一个children为默认路由
  //       主要是供面包屑用，防止点击面包屑后进入某个路由下的 '' 路由,比如/manage/
  //       而我们的路由是
  //       [
  //           /manage/menu1,
  //           /manage/menu2
  //       ]
  //     */
  //       setDefaultRoute([MainContainer]);
  //       /* 动态路由 */
  //       // router.match = createRouter(constantRoutes).match;
  //       router.addRoutes(staticRoutes);
  //       /* 完整的路由表 */
  //       commit('SET_PERMISSION_LIST', [...staticRoutes]);
  //       resolve();
  //     }).catch(error => {
  //       reject(error);
  //     });
  //   });
  // }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
