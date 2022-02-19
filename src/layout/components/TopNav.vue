<!--
 * @Author: JTune
 * @Description: 顶部导航
 * @FilePath: \operation-admin\src\layout\components\topNav.vue
-->
<template>
  <div class="top-nav">
    <a
      href="javascript:void(0)"
      v-for="(item,index) in topNavList"
      :key="index"
      :class="{'active':pathName==item.path}"
      @click="handleTab(item.path)"
    >{{item.label}}</a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: '',
  components: {},
  data() {
    return {
      pathName: '/home',
      tabPath: '',
      navList: [
        { id: 0, label: '工作台', path: '/home' },
        { id: 1, label: '场站管理', path: '/depotManagement' },
        { id: 2, label: '人员管理', path: '/personnelManagement' },
        { id: 3, label: '集团管理', path: '/groupManagement' }
      ]
    };
  },
  computed: {
    ...mapGetters([
      'topNavList',
      'menuDefaultList'
    ])
  },
  watch: {
    $route(val) {
      this.setIsActive();
    }
  },
  created() {
    this.setIsActive();
    this.initMenuDefault();
  },
  beforeMount() {
    this.setIsActive();
  },
  mounted() {
  },
  methods: {
    // 监听路由匹配方法
    setIsActive() {
      const routePath = this.$route.path;
      this.tabPath = routePath;
      const menuDefaultList = this.menuDefaultList;
      const arr = menuDefaultList.filter(item => {
        if (item.path.includes(this.pathName)) {
          return item;
        }
      });
      /*
       针对--场站管理和集团管理
       获取侧边栏默认展示菜单的资源id以及页面刷新时捕获资源id
      */
      if (this.pathName != '/home') {
        arr.map(item => {
          this.mapMenu(item, routePath);
        });
      }
      this.pathName = routePath.includes('depotManagement') ? '/depotManagement'
        : routePath.includes('personnelManagement') ? '/personnelManagement'
          : routePath.includes('groupManagement') ? '/groupManagement' : '/home';
    },
    handleTab(path) {
      this.pathName = path;
      const arr = this.initMenuDefault() || [];
      if (this.pathName != '/home') {
        const pathName = arr[0]?.path;
        this.$router.push({ path: pathName });
      } else {
        this.$router.push({ path });
      }
    },
    // 侧边栏路由权限
    initMenuDefault() {
      // const sidebarMenu = this.$store.state.permission.menuDefaultList;
      const menuDefaultList = this.menuDefaultList;
      const arr = menuDefaultList.filter(item => {
        if (item.path.includes(this.pathName)) {
          return item;
        }
      });
      this.$store.commit('permission/SET_MENU', arr);
      return arr;
    },
    // 匹配菜单路由获取资源id
    mapMenu(menu) {
      const currentPath = this.tabPath;
      // console.log('currentPath', currentPath);
      if (menu.path == currentPath) {
        this.$store.commit('flow/SET_RESOURCEID', menu.resourceId);
        this.$store.commit('flow/SET_MENUTYPE', menu.meta.mapFormType);
      } else if (menu.children && menu.children.length > 0) {
        menu.children.map(childmenu => {
          this.mapMenu(childmenu);
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
/* @import url(); 引入css类 */

.top-nav {
  float: left;
  height: 64px;
  line-height: 64px;
  font-size: 14px;
  padding-left: 15px;
  a {
    margin: 0 16px;
    padding: 10px 16px;
    color: #323233;
    &:hover {
      background: #1989fa;
      border-radius: 20px;
      color: #fff;
    }
    &.active {
      background: #1989fa;
      border-radius: 20px;
      color: #fff;
    }
  }
}
</style>
