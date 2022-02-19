<!--
 * @Author: your name
 * @Date: 2021-07-26 09:40:36
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\home\components\formTemplate.vue
-->
<template>
  <div
    class="content-com"
    style="position:relative"
  >
    <aside style="position:absolute;right:0;top:14px;z-index: 10;">
    </aside>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      class="formTemplateTab"
    >
      <el-tab-pane
        label="流程表单"
        name="first"
      >
        <div class="form-con">
          <el-row :gutter="20">
            <el-col
              :span="8"
              :xs="12"
              :sm="8"
              :xl="8"
              v-for="item in flowList"
              :key="item.id"
              :title="item.flowName"
            >
              <div class="grid-content">
                <div
                  class="surround"
                  @click="flowFromClick(item.resourcesId)"
                >
                  <span class="el-icon-document"></span>
                  <span class="txt"> {{ item.flowName }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="普通表单"
        name="second"
      >
        <div class="form-con">
          <el-row :gutter="20">
            <el-col
              :span="8"
              :xs="12"
              :sm="8"
              :xl="8"
              v-for="item in formList"
              :key="item.id"
              :title="item.form.name"
            >
              <div class="grid-content">
                <div
                  class="surround"
                  @click="conFromClick(item.planType)"
                >
                  <span class="el-icon-document"></span>
                  <span class="txt"> {{ item.form.name }}({{item.name}})</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <div class="tit">
      <span>表单模板</span>
    </div>-->
    <FormContainer
      :dialogVisible.sync="formVisible"
      :formOperate="formOperate"
      :flowInstanceId="flowInstanceId"
      :taskFormId="taskFormId"
      :flowProxyId="flowProxyId"
    ></FormContainer>
    <DyDialog
      :visible="personDialogVisible"
      :width="newProjectDialogWidth"
      :dialogTitle="isEditDialog ?  '编辑' : '创建'"
      @cancelDialogPopup="cancelPersonDialogPopup"
      @closeDialogPopup="closePersonDialogPopup"
      @sureDialogPopup="surePersonDialogPopup"
      top="10px"
      :showSureButton="!noEditAndNoTitle"
      :showTitle="!noEditAndNoTitle"
    >
      <!-- <el-button
        v-if="noEditAndNoTitle"
        class="print-btn"
        style="margin-left:10px;margin-bottom:5px"
        type="primary"
        size="small"
        v-print="'#formContainer'"
      >打 印</el-button> -->
      <div style="height:720px;overflow-y:scroll">
        <div id="formContainer">
          <fm-generate-form
            :data="jsonData"
            :edit="!noEditAndNoTitle"
            ref="generateForm"
            style="margin-left:0px"
          >
          </fm-generate-form>
        </div>
      </div>
    </DyDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Api from '@/api';
import { localstorageGet } from '@/utils/auth';
import FormContainer from '@/views/taskFormManage/FormContainer.vue';
import DyDialog from '@/components/DyDialog';
export default {
  name: '',
  components: { FormContainer, DyDialog },
  data() {
    return {
      clickStationButton: undefined,
      jsonData: {},
      noEditAndNoTitle: false,
      personDialogVisible: false,
      newProjectDialogWidth: '1100px',
      isEditDialog: false,
      formVisible: false,
      formOperate: '',
      flowInstanceId: '',
      taskFormId: '',
      flowProxyId: '',
      stationId: localstorageGet('stationId'),
      searchValue: '',
      activeName: 'first',
      OrdinaryForm: [],
      WorkflowForm: [],
      list: [],
      flowList: [],
      formList: [],
      checkboxGroup: [],
      pagination: {
        total: 0,
        pages: 1,
        size: 40
      }
    };
  },
  computed: {
    ...mapGetters([
      'menuDefaultList'
    ])
  },
  watch: {},
  created() {
    this.getFormTemplate();
    this.initTableData();
  },
  mounted() {
  },
  methods: {
    conFromClick(val) {
      // this.noEditAndNoTitle = false;
      // this.personDialogVisible = true;
      this.$axios.post(
        Api.frameworkInfo.getUserDetail,
        { data: { id: this.$store.state.user.userId, flag: 'company' }},
        (res) => {
          if (res.isSuccess) {
            const allDutyIds = res.data.userDutyVos.map(item => item.dutyId);
            this.openCreate(allDutyIds, val);
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    openCreate(getdutyId, planType) {
      this.$axios.post(
        Api.daily.getFormJsonBystationIdandType,
        {
          data: {
            planType,
            node: { id: this.$store.state.user.stationId }
          }
        },
        res => {
          if (res.isSuccess) {
            if (!getdutyId.some(item => item == res.data.duty.id)) {
              this.$message.error('当前用户岗位无法创建，请在计划管理中配置岗位再创建');
              return;
            }
            if (res.data.form) {
              this.jsonData = JSON.parse(res.data.form.templateData);
              this.clickStationButton = res.data;
              this.personDialogVisible = true;
              setTimeout(() => {
                this.$refs.generateForm.refresh();
              }, 0);
              return;
            }
            this.$message.error('无formTemplateData');
            // this.$refs.generateForm.refresh();
          } else {
            this.$message.error(res.message);
          }
        }
      );
      // this.personDialogVisible = true;
    },
    cancelPersonDialogPopup() {
      this.noEditAndNoTitle = false;
      this.personDialogVisible = false;
      this.$refs.generateForm.reset();
      // this.jsonData = undefined;
    },
    closePersonDialogPopup() {
      this.noEditAndNoTitle = false;
      this.personDialogVisible = false;
      this.$refs.generateForm.reset();
      // this.jsonData = undefined;
    },
    async surePersonDialogPopup() {
      const formData = await this.$refs.generateForm.getData();
      console.log(formData, 'formData---formData');
      this.$axios.post(
        Api.daily.create,
        {
          data: {
            id: this.clickStationButton.id,
            formData: { data: { data: formData }}
          }
        },
        res => {
          if (res.isSuccess) {
            this.personDialogVisible = false;
            this.$refs.generateForm.reset();
            // this.initSearchData();
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    flowFromClick(val) {
      let thetype = '';
      const rec = function (menuDefaultList) {
        menuDefaultList.forEach(item => {
          if (item.resourceId == val) {
            thetype = item.meta.mapFormType;
            this.$store.commit('flow/SET_MENUTYPE', thetype);
            return 0;
          }
          if (item.children && item.children.length) {
            rec.call(this, item.children);
          }
        });
        return thetype;
      };
      rec.call(this, this.menuDefaultList);
      this.$store.commit('flow/SET_RESOURCEID', val);

      this.$axios.post(
        Api.menuFlowManage.initTable,
        {
          data: {
            formTemplateBizRelevance: {
              stationId: localstorageGet('stationId'),
              projectId: '',
              resourcesId: val
            }
          }
        },
        res => {
          if (res.isSuccess) {
            if (res.data.length > 0 && res.data[0].formId) {
              this.formOperate = 'create';
              this.formVisible = true;
            } else {
              this.$message({
                message: '未找到关联的流程表单,请先关联表单',
                type: 'warning'
              });
            }
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    initTableData() {
      this.$axios.post( // 获取table列表
        Api.menuFlowManage.initTable,
        {
          data: {
            formTemplateBizRelevance: {
              stationId: this.$store.state.user.stationId,
              projectId: '',
              resourcesId: true
            },
            ignoreTemplateData: true
          },
          ...this.pagination
        },
        (res) => {
          if (res.isSuccess) {
            this.flowList = res.data || [];
            this.pagination.total = res.total;
          } else {
            this.$message.error({ duration: 9000, message: res.message });
          }
        }
      );
    },
    getFormTemplate() {
      this.$axios.post(
        Api.menuPlanPManage.getTableList,
        {
          data: {
            node: {
              id: this.stationId
            },
            ignoreTemplateData: true
          }
          // ...this.pagination
        },
        (res) => {
          if (res.isSuccess) {
            const temp = res.data || [];
            this.formList = temp;
          } else {
            this.$message.error({ duration: 4000, message: res.message });
          }
        }
      );
    },
    handleSearch() {
      this.$message.info('搜索：' + this.searchValue);
    },
    handleClick(tab, event) {
      this.getFormTemplate();
    }
  }
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
.content-com {
  min-width: 400px;
  height: 413px;
  background-color: #fff;
  ::v-deep .formTemplateTab {
    .el-tabs__header {
      padding-top: 7px !important;
    }
    .el-tabs__nav-scroll {
      margin-left: 21px;
    }
    .el-tabs__nav {
      height: 49px;
    }
  }
  .tit {
    display: flex;
    font-size: 14px;
    height: 56px;
    line-height: 56px;
    padding: 0 20px;
    border-bottom: 1px solid #ebedf0;
    span {
      flex: 1;
      font-weight: bold;
      color: #000000;
    }
    a {
      flex: 1;
      text-align: right;
      color: #1989fa;
    }
  }
  .form-con {
    padding: 20px;
    .grid-content {
      font-size: 14px;
      height: 30px;
      min-height: 30px;
      padding-bottom: 13px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .surround {
        user-select: none;
        &:hover {
          color: blue;
          cursor: pointer;
        }
        &:active {
          color: gray;
        }
      }
      .icon-img {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 1px solid #ebedf0;
        vertical-align: middle;
      }
    }
  }
}
</style>
