<!--
 * @Author: JTune
 * @Date: 2021-09-18 14:53:12
 * @LastEditors: JTune
 * @LastEditTime: 2021-12-27 09:18:53
 * @Description: file content
-->
<template>
  <div class="">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-if="!isSupGroup"
        label="待发事项"
        name="1"
      >
        <DueOut v-if="!isSupGroup && isTrue == 1" />
      </el-tab-pane>
      <el-tab-pane
        v-if="!isSupGroup"
        label="已发事项"
        name="2"
      >
        <Sent v-if="!isSupGroup && isTrue == 2" />
      </el-tab-pane>
      <el-tab-pane
        v-if="!isSupGroup"
        label="待办事项"
        name="3"
      >
        <Backlog v-if="!isSupGroup && isTrue == 3" />
      </el-tab-pane>
      <el-tab-pane
        label="已办事项"
        name="4"
      >
        <Completed
          :isSupGroup="isSupGroup"
          v-if="isTrue==4"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Sent from '@/views/taskFormManage/Sent';
import Completed from '@/views/taskFormManage/Completed';
import DueOut from '@/views/taskFormManage/DueOut';
import Backlog from '@/views/taskFormManage/Backlog';
export default {
  name: '',
  components: { Sent, DueOut, Backlog, Completed },
  data() {
    return {
      activeName: '',
      isTrue: '',
      isSupGroup: false
    };
  },
  props: {
    operationFlowCodeandState: {
      type: Object,
      default: () => { return { state: false }; }
    }
  },
  computed: {},
  watch: {},
  created() {
    if (this.operationFlowCodeandState.state) {
      this.isTrue = this.operationFlowCodeandState.activatedTabIndex;
      this.activeName = this.operationFlowCodeandState.activatedTabIndex;
    }
  },
  mounted() {
    this.isSupGroup = this.$route.path.includes('groupManagement');
    if (this.isSupGroup) {
      this.activeName = '4';
      this.isTrue = '4';
    } else {
      this.activeName = '1';
      this.isTrue = '1';
    }
  },
  methods: {
    handleClick(tab, event) {
      this.isTrue = tab.name;
      if (this.operationFlowCodeandState.state) {
        this.operationFlowCodeandState.activatedTabIndex = tab.name;
      }

      // if (tab.name == "1") {
      //   this.isMQInfo = true;
      // } else if (tab.name == "2") {
      //   this.isNettyInfo = true;
      // }
    }
  }
};
</script>
<style lang="scss" scoped></style>
