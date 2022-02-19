/*
 * @Descripttion:
 * @Author: Calvin
 * @Date: 2021-05-13 14:43:24
 */
import Vue from 'vue';
import store from '@/store';
Vue.directive('permission', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    const btnPermissionList = store.getters.btnPermissionList;
    const value = binding.value;
    const flag = btnPermissionList.some(item => {
      return item.href == value;
    });
    if (!flag) {
      if (!el.parentNode) {
        el.style.display = 'none';
      } else {
        el.parentNode.removeChild(el);
      }
    }
  }
});
