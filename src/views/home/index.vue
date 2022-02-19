<!--
 * @Author: your name
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\home\index.vue
-->
<template>
  <div class="home-main">
    <div class="home-con upside-con mb20">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="left-con">
            <Backlog />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="right-con">
            <FormTemplate />
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="home-con">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="left-con">
            <Message />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="right-con">
            <Communication />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Backlog from './components/Backlog';
import FormTemplate from './components/FormTemplate';
import Message from './components/Message';
import Communication from './components/Communication';
export default {
  name: '',
  components: { Backlog, FormTemplate, Message, Communication },
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {
  }
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
.home-main {
  margin-top: 69px;
  padding: 20px;
  overflow: hidden;
  background-color: #f7f8fa;
  .mb20 {
    margin-bottom: 20px;
  }
  .el-select {
    width: 100%;
  }
}
</style>
