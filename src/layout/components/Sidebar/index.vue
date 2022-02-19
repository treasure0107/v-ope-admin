<!--
 * @Descripttion:
 * @Author: JTune
 * @Date: 2021-01-14 11:44:30
-->
<template>
  <div :class="{'has-logo':showLogo}">
    <!-- <Logo
      v-if="showLogo"
      :collapse="isCollapse"
    /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in sidebarMenu"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/assets/styles/variables.scss';

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar',
      'sidebarMenu'
    ]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  mounted() {
    // console.log(this.sidebarMenu, '打印sidebarMenu');
  },
  methods: {
  }
};
</script>
