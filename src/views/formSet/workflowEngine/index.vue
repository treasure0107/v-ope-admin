
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
        title="表单设计"
        description=""
      ></el-step>
      <el-step
        title="流程设计"
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
        :editVisible="editVisible"
        v-show="stepsActive==1"
      />
      <Steps3
        class="flow-step3"
        @updateActive="handleUpdateActive"
        :flowNodeTemplateData="flowNodeTemplateData"
        :id="id"
        :fromId="fromId"
        v-show="stepsActive==2"
      />
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import Api from '@/api';
// import { mapState } from 'vuex';
import Steps1 from './components/Steps1';
import Steps2 from './components/Steps2';
import Steps3 from './components/Steps3';
export default {
  name: '',
  components: {
    Steps1, Steps2, Steps3
  },
  props: {},
  data() {
    return {
      stepsActive: 0,
      id: '',
      fromId: '',
      flowId: '',
      editVisible: true,
      infoForm: {},
      jsonData: {},
      flowNodeTemplateData: {}
    };
  },
  computed: {

  },
  watch: {},
  created() {
    this.init();
  },
  mounted() { },
  methods: {
    init() {
      this.infoForm.group = this.$route.query.formType;
      this.id = this.$route.query.id;
      const isTemplate = this.$route.query.isTemplate;
      this.editVisible = true;
      if (this.id) {
        this.getFlowFindById();
        if (isTemplate == 3) {
          this.editVisible = false;
        }
      }
    },
    getFlowFindById() {
      const data = {
        id: this.id
      };
      this.$axios.post(Api.flow.findById, {
        data
      }, (res) => {
        if (res.isSuccess) {
          const data = res.data;
          const formTemplate = data.formTemplateList[0];
          this.flowNodeTemplateData = data.flowNodeTemplate;
          this.fromId = formTemplate.id;
          this.$set(this.infoForm, 'name', formTemplate.name);
          this.$set(this.infoForm, 'remark', data.remark);
          this.jsonData = JSON.parse(formTemplate.templateData);
          // console.log(' this.flowNodeTemplateData', this.flowNodeTemplateData);
          // console.log('jsonData', this.jsonData);
          // const infoForm = Object.assign({}, this.infoForm, { name });
          // infoForm.name = name;
          // this.infoForm = infoForm
        }
      });
    },

    submit() { },

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
