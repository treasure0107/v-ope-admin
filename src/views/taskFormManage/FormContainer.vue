<!--
 * @Author: JTune
 * @Date: 2021-08-23 10:15:51
 * @LastEditors: JTune
 * @LastEditTime: 2021-12-29 11:24:30
 * @Description: 公共组件-表单创建/查看/编辑
-->
<template>
  <div>
    <el-dialog
      :top="'10px'"
      :width="'1100px'"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-button
        v-if="isAblePrint"
        class="print-btn"
        style="margin-left:10px"
        type="primary"
        size="small"
        v-print="'#formContainer'"
      >打 印</el-button>
      <div id="formOperate">
        <div id="formContainer">
          <fm-generate-form
            :data="jsonData"
            :value="editData"
            :edit="isEdit"
            ref="generateForm"
            :print-read="printRead"
            style="margin-left:10px"
            v-show="!formLoading"
          >
          </fm-generate-form>
        </div>
        <div
          v-if="formOperate == 'checkSubmit'"
          class="approve"
        >
          <el-form
            :model="approveForm"
            :rules="rules"
            ref="approveForm"
          >
            <el-form-item
              label="审批结果"
              prop="approveResult"
            >
              <el-radio-group v-model="approveForm.approveResult">
                <el-radio label="pass">同意</el-radio>
                <el-radio label="no_pass">不同意</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="审批意见"
              prop="approveMessage"
            >
              <el-input
                type="textarea"
                rows="5"
                v-model.trim="approveForm.approveMessage"
                placeholder="请填写审批意见"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 待发驳回和撤销信息 -->
      <div
        class="message"
        v-if="formOperate=='checkWithInfo'"
      >
        <div
          class="messageInfo"
          v-for="(message) in logTableData"
          :key="message.id"
        >
          <div class="dealInfo">
            <span>{{message.executorName}}</span>
            <span>{{message.auditStatus}}</span>
            <span>{{message.createDate}}</span>
          </div>
          <div class="desc">
            描述：{{message.executeDesc}}
          </div>
        </div>
      </div>
      <!-- 待办提交按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
        v-if="formOperate=='checkSubmit'"
      >
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >提 交</el-button>
      </span>
      <!-- 查看页面按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
        v-else-if="!isEdit"
      >
        <el-button
          class="print-btn"
          type="primary"
          size="small"
          @click="handleClose"
        >关 闭</el-button>
      </span>
      <!-- 创建按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
        v-else-if="formOperate=='create'"
      >
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          :disabled="isClick"
          type="primary"
          @click="handleConfirm(flowTaskType)"
        >确 定</el-button>
      </span>
      <!-- 编辑按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
        v-else
      >
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="handleReSent"
        >重新发送</el-button>
      </span>
      <!-- 审批人自选节点弹窗 -->
      <el-dialog
        width="500px"
        title="选择审批节点"
        class="nodePerson"
        :visible="nodeChooseVisible"
        :before-close="handleCancelCheckNode"
        append-to-body
      >
        <div class="checkbox-con scroll-bar">
          <el-checkbox-group v-model="checkboxRersonGroup">
            <p
              v-for="(item, index) in personList"
              :key="index"
              @change="handleCheckedPreson(item)"
            >
              <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
            </p>
          </el-checkbox-group>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="handleCancelCheckNode">取 消</el-button>
          <el-button
            type="primary"
            @click="handleGetNode"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api';
import { localstorageGet } from '@/utils/auth';
export default {
  name: 'FormContainer',
  data() {
    return {
      printRead: false,
      isEdit: false,
      isAblePrint: false,
      formLoading: true,
      createFlowId: '', // 创建的流程流程id查发起人权限
      editData: {}, // 表单数据
      flowTaskType: '', // 判断任务节点类型(自选或按配置)
      nodeChooseVisible: false, // 选择节点弹窗
      checkboxRersonGroup: [], // 选择节点人员
      nextAuditorList: [], // 节点人员参数数组
      personList: [], // 流程人员列表
      logTableData: [],
      formId: '',
      isClick: false,
      formData: {},
      jsonData: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
          customClass: '',
          ui: 'element',
          layout: 'horizontal',
          labelCol: 3,
          width: '100%',
          hideLabel: false,
          hideErrorMessage: false,
          eventScript: [
            {
              key: 'mounted',
              name: 'mounted',
              func: ''
            }
          ]
        }
      },
      station: '',
      shift: '',
      approveForm: {
        approveResult: 'pass', // 审批结果
        approveMessage: '' // 审批信息
      },
      stationOption: [
        {
          label: '庚熙山风电场',
          value: '庚熙山风电场'
        },
        {
          label: '莲花山风电场',
          value: '莲花山风电场'
        }
      ],
      shiftOption: [
        {
          label: '001',
          value: '001'
        },
        {
          label: '002',
          value: '002'
        }
      ]
    };
  },
  inject: {
    operationFlowCodeandState: {
      default: () => ({ state: false, flowcode: '', showAllandNotCreate: true, deviceId: undefined })
    }
  },
  computed: {
    theOperationData() {
      return this.operationFlowCodeandState || { state: false, flowcode: '', deviceId: undefined };
    },
    rules() {
      return {

        approveResult: [
          { required: true, message: '请选择审批结果', trigger: 'change' }
        ],
        approveMessage: [
          { required: this.approveForm.approveResult != 'pass', message: '请填写审批意见', trigger: 'blur' }
        ]
      };
    }
  },
  watch: {
    formOperate() {
      this.isEdit = !(this.formOperate == 'check' || this.formOperate == 'checkWithInfo');
      this.isAblePrint = !(this.formOperate == 'create' || this.formOperate == 'edit');
    },
    dialogVisible(val) {
      if (val) {
        if (this.formOperate == 'create') {
          this.getFormId();
          // } else if (this.formOperate == 'edit') {
          //   this.getTaskForm();
        } else {
          this.getTaskForm();
          // this.getFormData();
        }
        if (this.formOperate == 'checkWithInfo') {
          // 获取流程日志取驳回和撤销信息
          this.getLogInfo();
        }
      } else {
        this.jsonData = {};
        this.formLoading = true;
      }
    }
  },
  props: {
    // flowFromResourceId: { // 工作台创建流程资源id
    //   type: String,
    //   default: undefined
    // },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    formOperate: {
      type: String,
      default: ''
    },
    // 流程实例id
    flowInstanceId: {
      type: String,
      default: ''
    },
    // 已建任务的表单id
    taskFormId: {
      type: String,
      default: ''
    },
    // 流程代理id-查待办权限
    flowProxyId: {
      type: String,
      default: ''
    },
    // 待办任务任务id
    jobTaskId: {
      type: String,
      default: ''
    },
    // 待办任务节点id
    nodeProxyId: {
      type: String,
      default: ''
    },
    // 待发-重新发起-下一审批节点类型
    nextAuditType: {
      type: String,
      default: ''
    },
    // 已建任务的节点类型
    flowNodeType: {
      type: String,
      default: ''
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 获取流程日志--查看时的驳回和撤销信息
    getLogInfo() {
      this.$axios.post(
        Api.taskFlow.findRecord,
        {
          data: {
            flowInstanceId: this.flowInstanceId
          }
        },
        res => {
          if (res.isSuccess) {
            this.logTableData = res.data.slice(-1);
            this.translateStatus(this.logTableData[0]);
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 已建任务和流程日志操作状态字符转换
    translateStatus(obj) {
      let chnStatus;
      if (obj.auditStatus) {
        switch (obj.auditStatus) {
          case 'pass':
            chnStatus = '通过';
            break;

          case 'no_pass':
            chnStatus = '驳回';
            break;

          case 'withdraw':
            chnStatus = '撤销';
            break;

          default:
            chnStatus = '';
            break;
        }
      } else if (obj.flowStatus) {
        switch (obj.flowStatus) {
          case 'await_sent':
            chnStatus = '待发';
            break;

          case 'run':
            chnStatus = '运行中';
            break;

          case 'withdraw':
            chnStatus = '撤销';
            break;

          case 'termination':
            chnStatus = '终止';
            break;

          case 'rejected':
            chnStatus = '驳回';
            break;

          case 'end':
            chnStatus = '完结';
            break;

          default:
            chnStatus = '';
            break;
        };
      }
      obj.auditStatus = chnStatus;
    },
    // 获取最新的表单json
    getJsonData(formId) {
      this.$axios.post(
        Api.form.findById,
        {
          data: {
            id: formId
          }
        },
        res => {
          if (res.isSuccess) {
            // this.jsonData = JSON.parse(res.data.templateData);
            const data = JSON.parse(res.data.templateData);
            this.$set(this.jsonData, 'config', data.config);
            this.$set(this.jsonData, 'list', data.list);
            this.$nextTick(() => {
              this.$refs.generateForm.refresh();
              this.getAllFields();
              this.getNodePermission(this.createFlowId);
              this.formLoading = false;
            });
          }
        }
      );
    },
    // 获取表单所有字段--禁用
    getAllFields() {
      const arr = [];
      this.$refs.generateForm.getData().then(formData => {
        for (const key in formData) {
          arr.push(key);
        }
        this.$refs.generateForm.disabled(arr, true);
      });
    },
    // 获取待办审批节点权限字段
    getApproveFields() {
      this.$axios.post(
        Api.taskFlow.findApprovePermission,
        {
          data: {},
          nodeProxyId: this.nodeProxyId
        },
        res => {
          if (res.isSuccess) {
            const permission = res.data.flowNodeFieldPowerTemplateList;
            const fieldList = [];
            permission.map(item => {
              fieldList.push(item.formFieldTemplateEnglishName);
            });
            this.$refs.generateForm.disabled(fieldList, false);
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 获取创建或编辑节点权限字段
    getNodePermission(flowId) {
      const id = flowId || this.flowProxyId;
      const url = this.formOperate == 'edit' ? Api.taskFlow.findDueTaskDetail : Api.taskFlow.findFlowDetail;
      if (id) {
        this.$axios.post(
          url,
          {
            data: {
              id
            }
          },
          res => {
            if (res.isSuccess) {
              const permission = res.data.flowNodeTemplate.flowNodeFieldPowerTemplateList;
              const fieldList = [];
              permission.map(item => {
                fieldList.push(item.formFieldTemplateEnglishName);
              });
              this.$refs.generateForm.disabled(fieldList, false);
            } else {
              this.$message.error(res.message);
            }
          }
        );
      } else {
        this.$message({
          message: '未找到流程',
          type: 'warning'
        });
      }
    },
    // 获取已建任务的表单模板
    getTaskForm() {
      this.$axios.post(
        Api.taskFlow.getTaskForm,
        {
          data: {
            id: this.taskFormId
          }
        },
        res => {
          if (res.isSuccess) {
            const data = JSON.parse(res.data.templateData);
            this.$set(this.jsonData, 'config', data.config);
            this.$set(this.jsonData, 'list', data.list);
            this.$nextTick(() => {
              this.$refs.generateForm.refresh();
              this.getFormData();
              this.getAllFields();
              if (this.formOperate == 'edit') {
                // 编辑权限
                this.getNodePermission();
              } else if (this.formOperate == 'checkSubmit') {
                // 审批权限
                this.getApproveFields();
              }
              this.formLoading = false;
            });
          }
        }
      );
    },
    // 根据资源id获取表单id
    getFormId() {
      if (this.theOperationData.state) {
        this.$axios.post(
          Api.operationTicket.getIdFromflowcode,
          {
            data: {},
            flowCode: this.theOperationData.flowcode
          },
          res => {
            if (res.isSuccess) {
              if (res.data && res.data.length > 0 && res.data[0].formTemplateId) {
                this.formId = res.data[0].formTemplateId;
                this.flowTaskType = res.data[0].flowNextNodeAuditType;
                this.getJsonData(res.data[0].formTemplateId);
                this.createFlowId = res.data[0].flowTemplateId;
                // this.getNodePermission(res.data[0].flowTemplateId);
              } else {
                this.$message({
                  message: '未找到关联的表单,请先关联表单',
                  type: 'warning'
                });
              }
            } else {
              this.$message.error(res.message);
            }
          }
        );
      } else {
        this.$axios.post(
          Api.menuFlowManage.initTable,
          {
            data: {
              formTemplateBizRelevance: {
                stationId: localstorageGet('stationId'),
                projectId: '',
                resourcesId: this.$store.state.flow.resourceId
              }
            }
          },
          res => {
            if (res.isSuccess) {
              if (res.data.length > 0 && res.data[0].formId) {
                this.formId = res.data[0].formId;
                this.flowTaskType = res.data[0].flowNextNodeAuditType;
                this.getJsonData(this.formId);
                this.createFlowId = res.data[0].flowId;// 创建的流程流程id查发起人权限
                // this.getNodePermission(res.data[0].flowId);
              } else {
                this.$message({
                  message: '未找到关联的流程表单,请先关联表单',
                  type: 'warning'
                });
                this.$emit('update:dialogVisible', false);
              }
            } else {
              this.$message.error(res.message);
            }
          }
        );
      }
    },
    // 获取已建任务的表单数据
    getFormData() {
      this.$axios.post(
        Api.taskFlow.getFormData,
        {
          data: {
            id: this.flowInstanceId
          }
        },
        res => {
          if (res.isSuccess) {
            // this.$refs.generateForm.setData(res.data.data);
            const editData = res.data.data;
            for (const item in editData) {
              this.$set(this.editData, item, editData[item]);
            }
            this.$nextTick(() => {
              this.$refs.generateForm.refresh();
            });
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 创建确认
    handleConfirm(auditTpye) {
      // 审批人节点由发起人自选--打开人员架构弹窗
      if (auditTpye == 'run_node_choose') {
        if (!this.checkboxRersonGroup.length) {
          // 未选择节点
          this.getNodeList();
          this.nodeChooseVisible = true;
        } else {
          this.nextAuditorList = [];
          this.checkboxRersonGroup.map(item => {
            this.nextAuditorList.push({
              bizId: item
            });
          });
          this.isClick = true;
          this.handleCreate(this.flowInstanceId);
        }
      } else {
        this.isClick = true;
        this.handleCreate(this.flowInstanceId);
      }
    },
    // 创建提交--重新发送
    handleCreate(flowInstanceId) {
      let url = Api.taskFlow.createTask;
      const data = {
        // id: flowInstanceId, // 重新发送传流程实例id
        formProxyId: this.formId, // 表单id
        flowInstanceBizRelevance: {
          planId: '',
          stationId: localstorageGet('stationId'), // 场站id
          resourcesId: this.$store.state.flow.resourceId, // 资源id
          menuType: this.$store.state.flow.menuType, // 菜单关联的表单类型
          deviceId: this.theOperationData.deviceId || undefined
        }
      };
      if (flowInstanceId) {
        // 重新发送
        url = Api.taskFlow.reSubmitTask;
        data.id = flowInstanceId;// 重新发送传流程实例id
      }
      // 获取formMaking表单数据
      this.$refs.generateForm.getData().then(formData => {
        this.formData = formData;
        this.$axios.post(
          url,
          {
            data,
            nextAuditorList: this.nextAuditorList,
            formDataMongoVo: {
              data: this.formData
            }
          },
          res => {
            if (res.isSuccess) {
              this.$message.success('创建成功');
              this.$refs.generateForm.reset();
              this.checkboxRersonGroup = [];
              this.isClick = false;
              this.$emit('update:dialogVisible', false);
              this.$emit('reGetTaskList');
            } else {
              this.$message.error(res.message);
            }
          }
        );
      });
    },
    // 获取节点人员列表
    getNodeList() {
      this.$axios.post(
        Api.flowPerson.findAllByPlatformCode,
        {
          data: {
            customerCode: this.$store.state.user.customerCode
          }
        },
        res => {
          if (res.isSuccess) {
            this.personList = res.data;
          }
        }
      );
    },
    // 选择节点人员
    handleCheckedPreson(val) {
    },
    // 待办事项-提交
    handleSubmit() {
      if (this.approveForm.approveResult == 'pass' && this.flowNodeType == 'run_node_choose') {
        // 审批通过--审批人节点自选--打开人员架构弹窗
        if (!this.checkboxRersonGroup.length) {
          // 未选择节点
          this.getNodeList();
          this.nodeChooseVisible = true;
        } else {
          this.nextAuditorList = [];
          this.checkboxRersonGroup.map(item => {
            this.nextAuditorList.push({
              bizId: item
            });
          });
          this.isClick = true;
          this.handleBacklogSubmit();
        }
      } else {
        // 非自选 或 不通过
        this.isClick = true;
        this.handleBacklogSubmit();
      }
    },
    // 待办提交请求
    handleBacklogSubmit() {
      this.$refs.approveForm.validate((valid) => {
        if (valid) {
          this.$refs.generateForm.getData().then(formData => {
            this.formData = formData;
            this.$axios.post(
              Api.taskFlow.taskExamination,
              {
                data: {
                  jobTaskId: this.jobTaskId,
                  auditRecord: {
                    auditStatus: this.approveForm.approveResult,
                    executeDesc: this.approveForm.approveMessage
                  }
                },
                nextAuditorList: this.nextAuditorList,
                formDataMongoVo: {
                  data: this.formData
                }
              },
              res => {
                if (res.isSuccess) {
                  this.isClick = false;
                  this.$message.success('审批结果已提交');
                  this.$emit('update:dialogVisible', false);
                  this.$emit('reGetTaskList');
                } else {
                  this.$message.error(res.message);
                }
              }
            );
          });
        } else {
          this.$message.error('校验失败，请填写完成信息');
          return false;
        }
      });
    },
    // 重新发送
    handleReSent() {
      this.handleConfirm(this.nextAuditType);
    },
    // 关闭弹窗
    handleClose() {
      this.approveForm.approveResult = '';
      this.approveForm.approveMessage = '';
      this.isClick = false;
      this.checkboxRersonGroup = [];
      this.nextAuditorList = [];
      for (const item in this.editData) {
        this.$set(this.editData, item, '');
      }
      this.$refs.generateForm.reset();
      this.$nextTick(() => {
        this.$refs.generateForm.refresh();
      });
      if (this.formOperate == 'checkSubmit') {
        this.$refs.approveForm.resetFields();
      }
      this.$emit('update:dialogVisible', false);
    },
    // 取消选择节点人员
    handleCancelCheckNode() {
      this.nodeChooseVisible = false;
      this.checkboxRersonGroup = [];
    },
    // 获取审批节点人员
    handleGetNode() {
      this.nodeChooseVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@media print {
  #formContainer {
    max-width: 1055px;
    ::v-deep input {
      border: none;
      outline: none;
    }
    ::v-deep textarea {
      border: none;
      padding: 0;
    }
    // 默认栅格布局下的input框带下划线
    ::v-deep .el-row--flex .el-input .el-input__inner {
      border-bottom: 1px solid #999999;
      border-radius: 0;
    }
    // 栅格布局下的input框不要下划线
    ::v-deep .el-row--flex .el-form-item.noBorder .el-input .el-input__inner {
      border: none;
    }
    // 单选框组选中样式
    ::v-deep .el-radio.is-checked .el-radio__input .el-radio__inner {
      background-color: #409eff;
      border: 5px solid #444444;
    }
    // 下拉框icon隐藏
    ::v-deep .el-select .el-input__suffix .el-input__icon {
      visibility: hidden;
    }
    // 打印时隐藏placeholder内容
    ::v-deep input::placeholder {
      visibility: hidden;
    }
    ::v-deep input::-webkit-input-placeholder {
      visibility: hidden;
    }

    ::v-deep input::-moz-placeholder {
      visibility: hidden;
    }

    ::v-deep input:-ms-input-placeholder {
      visibility: hidden;
    }
  }
  .print-btn {
    display: none;
  }
  .message {
    display: none;
  }
}
::v-deep .el-dialog__body {
  padding: 0 20px;
}
.nodePerson {
  .checkbox-con {
    padding: 0 15px;
    p {
      margin-top: 15px;
    }
  }
  .scroll-bar {
    max-height: 500px;
    overflow: auto;
    &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }
    &::-webkit-scrollbar {
      width: 9px;
    }
    &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
    }
  }
}
#formOperate {
  height: 720px;
  padding-right: 20px;
  overflow-y: auto;
  margin: 8px 0;
  // #formContainer {
  // }
  .title {
    background-color: #fafafa;
    font-size: 14px;
    line-height: 45px;
    text-indent: 1rem;
    border-bottom: 1px solid #ddd;
  }
  .approve {
    padding: 10px 0 10px 10px;
    .titletext {
      height: 26px;
      font-size: 14px;
    }
    .options {
      margin-bottom: 10px;
    }
  }
  .bottomBtn {
    // text-align: center;
    padding: 15px 0 0 10px;
  }
}
.message {
  // margin-top: 20px;
  padding-left: 10px;
  .messageInfo {
    font-size: 12px;
    .dealInfo {
      padding: 10px 0;
      font-weight: bold;
      background-color: #f2f2f2;
      span {
        padding-right: 20px;
      }
    }
    .desc {
      padding: 10px 0;
    }
  }
}
</style>
