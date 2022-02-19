<!--
 * @Descripttion:重定向模板
 * @Author: JTune
 * @Date: 2021-06-03 11:04:35
-->
<template>
  <div class="container">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {};
  },
  computed: {
    key() {
      return this.$route.fullPath;
    }
  },
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style scoped lang="scss">
.container {
  /* margin:0 24px;
  // width: 100%;
  height: 100%;
  min-height: 600px;
  background-color: #fff;
  >div{
    padding: 16px;
  } */
}
</style>
