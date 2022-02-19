<!--
 * @Descripttion:
 * @Author: JTune
 * @Date: 2021-01-14 11:44:30
-->
<template>
  <section class="app-main">
    <breadcrumb v-if="key!='/home'" />
    <transition
      name="fade-transform"
      mode="out-in"
    >
    <div class="app-main-container">
      <router-view :key="key" />
    </div>
    </transition>
  </section>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';
export default {
  name: 'AppMain',
  components: { Breadcrumb },
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 50px); */
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  .app-main-container {
    margin: 0 24px;
    /* width: 100%; */
    height: 100%;
    min-height: 800px;
    background-color: #fff;
    > div {
      padding: 16px;
    }
  }
}

.fixed-header + .app-main {
  /* padding-top: 50px; */
  padding: 70px 20px 20px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
