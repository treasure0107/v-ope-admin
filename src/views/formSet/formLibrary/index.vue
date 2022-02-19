
<template>
  <div class="container">
    <div>
      <div>
        <el-button
          type="primary"
          size="small"
          @click="handleCreate(null,1)"
        >创建新表单</el-button>
        <!-- <el-button
          type="danger"
          plain
          size="small"
          @click="handleDel"
          v-if="this.activeName != 'workLine'"
        >删除</el-button> -->
      </div>
      <el-divider class="divider"></el-divider>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="流程列表"
          name="workLine"
        >
          <WorkflowForm
            ref='workflowForm'
            @handleSelectData="handleSelectData"
            v-if="isTrue == 'workLine'"
          />
        </el-tab-pane>
        <el-tab-pane
          label="表单列表"
          name="normal"
        >
          <OrdinaryForm
            ref='ordinaryForm'
            @handleSelectData="handleSelectData"
            v-if="isTrue == 'normal'"
          />
        </el-tab-pane>
      </el-tabs>
      <DyDialog
        :visible.sync="createVisible"
        width="590px"
        :top="'200px'"
        :dialogTitle="createTitle"
        @closeDialogPopup="handleClose"
        :showSureButton="false"
        :showCancelButton="false"
      >
        <div class="dialogContainer">
          <ul class="diyForm">
            <li
              v-for="(item,index) in diyFormList"
              @click="handelCheckFormType(item)"
              :class="item.value == checkId ? 'active' : ''"
              :key="index"
            >
              {{item.label}}
            </li>
          </ul>
          <el-tabs
            v-model="active"
            @tab-click="handleTabClick"
          >
            <el-tab-pane
              label="使用流程表单模板"
              name="0"
            >
              <ul
                class="templateForm"
                v-if="isActive==0"
              >
                <li
                  v-for="(item,index) in templateList"
                  @click="handelCheckType(item,'flow')"
                  :class="item.id == checkId ? 'active' : ''"
                  :key="index"
                >
                  {{item.flowName}}
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane
              label="使用普通表单模板"
              name="1"
            >
              <ul
                class="templateForm"
                v-if="isActive==1"
              >
                <li
                  v-for="(item,index) in templateList"
                  @click="handelCheckType(item,'normal')"
                  :class="item.id == checkId ? 'active' : ''"
                  :key="index"
                >
                  {{item.name}}
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </DyDialog>
    </div>
  </div>
</template>
<script>
import Api from '@/api';
import DyDialog from '@/components/DyDialog';
import WorkflowForm from './components/WorkflowForm';
import OrdinaryForm from './components/OrdinaryForm';
import { mapGetters } from 'vuex';
// import '@/utils/vue-form-making/dist/FormMaking.css';
export default {
  name: '',
  components: { WorkflowForm, OrdinaryForm, DyDialog },
  data() {
    return {
      loading: false,
      activeName: 'workLine', // 表单分类active
      isTrue: 'workLine',
      active: 0,
      isActive: 0,
      checkId: '',
      editType: 1,
      templateId: '',
      selectDatas: [],
      typeList: [],
      checkedFormGroup: '',
      createVisible: false,
      createTitle: '创建新表单',
      pagination: {
        total: 0,
        pages: 1,
        size: 15
      },
      diyFormList: [
        {
          label: '自定义流程表单',
          value: 'flow',
          isChecked: false,
          group: 'flow'
        },
        {
          label: '自定义普通表单',
          value: 'normal',
          isChecked: false,
          group: 'normal'
        }

      ],
      templateList: []
    };
  },
  computed: {
    ...mapGetters([
      'stationId'
    ])
  },
  watch: {},
  created() { },
  mounted() {

  },
  methods: {
    handleClick(tab, event) {
      this.isTrue = tab.name;
    },
    handleTabClick(tab) {
      // console.log(tab.name);
      this.isActive = tab.name;
      if (this.isActive == 0) {
        this.initFlow();
      } else {
        this.initForm();
      }
    },
    initFlow() {
      const data = { ignoreTemplateData: true };
      this.$axios.post(Api.flow.list, {
        data,
        formTemplateBizRelevance: { stationId: this.stationId },
        platformCode: '400001',
        pagination: true,
        pages: this.pagination.pages,
        size: this.pagination.size
      }, (res) => {
        if (res.isSuccess) {
          const data = res.data;
          this.templateList = data;
          // this.pagination.total = res.total;
        }
      });
    },
    initForm() {
      const data = { ignoreTemplateData: true };
      this.$axios.post(Api.form.list, {
        data,
        formTemplateBizRelevance: { stationId: this.stationId },
        queryFormType: 'common_form',
        platformCode: '400001',
        pagination: true,
        pages: this.pagination.pages,
        size: this.pagination.size
      }, (res) => {
        if (res.isSuccess) {
          const data = res.data;
          this.templateList = data;
          // this.pagination.total = res.total;
        }
      });
    },
    // 创建
    handleCreate() {
      this.createVisible = true;
      this.initFlow();
    },
    // 删除
    handleDel() {
      if (!this.selectDatas.length) {
        this.$message.error('没有选择表单');
        return;
      }
      this.$confirm('是否确定删除表单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleSureDel();
      }).catch(() => {

      });
    },
    handleSureDel() {
      const ids = this.selectDatas.map(item => {
        return item.id;
      });
      let url = '';
      const data = {
        data: {}
      };
      if (this.activeName == 'workLine') {
        url = Api.flow.delete;
        data.flowTemplateIds = ids;
        data.deleteReForm = true;
      } else {
        url = Api.form.delete;
        data.formTemplateIds = ids;
      }
      this.$axios.post(url, data, (res) => {
        if (res.isSuccess) {
          this.$message.success(`删除成功`);
          if (this.activeName == 'workLine') {
            this.$refs.workflowForm.fetchData();
          } else {
            this.$refs.ordinaryForm.fetchData();
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },

    handleSelectData(val) {
      this.selectDatas = val;
    },
    handelCheckFormType(item) {
      const { value } = item;
      this.checkId = value;
      setTimeout(() => {
        this.reset();
        if (value == 'flow') {
          this.$router.push({ name: 'workflowEngine', query: { formType: 'flow' }});
        } else {
          this.$router.push({ name: 'formDesign', query: { formType: 'normal' }});
        }
      }, 100);
    },
    handelCheckType(item, type) {
      const { id } = item;
      this.checkId = id;
      const isTemplate = 1;
      setTimeout(() => {
        this.reset();
        if (type == 'flow') {
          this.$router.push({ name: 'workflowEngine', query: { id, formType: 'flow', isTemplate }});
        } else {
          this.$router.push({ name: 'formDesign', query: { id, formType: 'normal', isTemplate }});
        }
      }, 100);
    },
    handleClose() {
      this.reset();
    },
    reset() {
      this.createVisible = false;
      this.checkId = '';
    }
  }
};
</script>
<style scoped lang='scss'>
@import "~@/utils/vue-form-making/dist/FormMaking.css";
.container {
  box-sizing: border-box;
  background: #fff;
  ::v-deep .el-dialog__body {
    padding-top: 0;
  }
  .dialogContainer {
    .diyForm {
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
    ul {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      li {
        width: 160px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border: 1px solid #ddd;
        margin-right: 15px;
        margin-bottom: 15px;
        border-radius: 5px;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .active {
        background-color: #57a9fb;
        border-color: #57a9fb;
        color: #fff;
      }
    }
    p {
      margin-bottom: 15px;
      font-weight: 600;
    }
  }
  .divider {
    margin: 15px 0;
  }
}
</style>
