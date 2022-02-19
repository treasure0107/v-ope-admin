
<template>
  <div class="container-main">
    <el-button
      type="primary"
      @click="goback"
      size="small"
      class="back-btn"
    >返 回</el-button>
    <el-steps
      class="steps-container"
      :active="stepsActive"
      align-center
    >
      <el-step
        title="基础信息"
        description=""
      ></el-step>
      <el-step
        title="设计表单"
        description=""
      ></el-step>
    </el-steps>
    <div class="flow-content">
      <Steps1
        @updateActive="handleUpdateActive"
        :infoForm="infoForm"
        v-show="stepsActive==0"
      />
      <Steps2
        @updateActive="handleUpdateActive"
        :jsonData.sync="jsonData"
        :id="id"
        v-show="stepsActive==1"
      />
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import Api from '@/api';
import Steps1 from './components/Steps1';
import Steps2 from './components/Steps2';
export default {
  name: '',
  components: {
    Steps1, Steps2
  },
  props: {},
  data() {
    return {
      stepsActive: 0,
      id: '',
      infoForm: {},
      jsonData: {},
      flowNodeTemplateData: {}
    };
  },
  computed: {

  },
  watch: {},
  created() {
    this.infoForm.group = this.$route.query.formType;
    this.id = this.$route.query.id;
    if (this.id) {
      this.getFormFindById();
    }
  },
  mounted() { },
  methods: {
    getFormFindById() {
      const data = {
        id: this.id
      };
      this.$axios.post(Api.form.findById, {
        data
      }, (res) => {
        if (res.isSuccess) {
          const data = res.data;
          this.$set(this.infoForm, 'name', data.name);
          this.jsonData = JSON.parse(data.templateData);
        }
      });
    },

    goback() {
      this.$router.push({ name: 'formLibrary' });
    },
    handleUpdateActive(val) {
      this.stepsActive = val;
    }

  }
};
</script>

<style scoped lang="scss">
.container-main {
  position: relative;
  .back-btn {
    position: absolute;
    top: 3px;
    left: 6px;
    z-index: 666;
  }
}
.steps-container {
  position: relative;
  padding: 10px 0 0;
  z-index: 6;
  background: #fff;
  ::v-deep .el-step__title {
    font-size: 14px;
    line-height: 23px;
  }
}

.flow-content {
  background: #fff;
  margin-top: 10px;
  padding: 10px;
  box-sizing: border-box;
  // height: calc(100% - 150px);
  overflow-y: auto;
}
</style>
