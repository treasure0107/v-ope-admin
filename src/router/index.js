/*
 * @Author: JTune
 * @Description: 路由判断权限
 * @FilePath: \rsh-operation-system-web\src\router\index.js
 */

import router from '@/router/staticRouter';
import store from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { localstorageGet } from '@/utils/auth'; // getToken localstorageRemove
import getPageTitle from '@/utils/getPageTitle';
// console.log(getToken);
NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  console.log(to);
  NProgress.start();
  document.title = getPageTitle(to.meta.title);

  // const hasToken = getToken();
  const hasToken = localstorageGet('token');
  if (!hasToken) {
    if (to.matched.length > 0 && !to.matched.some(record => record.meta && record.meta.required)) {
      next();
      NProgress.done();
    } else {
      next({ path: '/login' });
      NProgress.done();
    }
  } else {
    // 这里是为了防止重复获取权限列表
    if (!store.getters.permissionList.length) {
      store.dispatch('permission/getPermissionList').then(() => {
        next({ ...to, replace: true });
        NProgress.done();
      }).catch(() => {
        console.log('获取权限失败');
      });
    } else {
      if (to.path !== '/login') {
        next();
        NProgress.done();
      } else {
        next(from.fullPath);
        NProgress.done();
      }
    }
  }
});
router.afterEach(() => {
  NProgress.done();
});
