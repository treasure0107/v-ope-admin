<!--
 * @Author: JTune
 * @Date: 2021-09-02 15:19:02
 * @LastEditors: JTune
 * @LastEditTime: 2021-12-27 14:39:06
 * @Description: 岗位信息弹窗
-->

<!-- 添加岗位 -->
<template>
  <div class="add-post-dialog">
    <!-- 添加岗位弹窗 -->
    <el-dialog
      :title="jobDialogTitle"
      width="700px"
      :visible="visible"
      :close-on-click-modal="false"
      @close="handleCancel('addJobForm')"
    >
      <el-form
        class="formContainer"
        :model="addJobForm"
        size="small"
        :disabled="jobOperate=='check' ? true : false"
        ref="addJobForm"
      >
        <h3>基本信息</h3>
        <el-form-item
          label="岗位名称"
          :label-width="formLabelWidth"
          prop="dutyName"
          :rules="{
            required: true,
            message: '岗位名称不能为空',
            trigger: 'blur'
          }"
        >
          <el-input
            v-model.trim="addJobForm.dutyName"
            placeholder="请输入岗位名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="本职工作"
          :label-width="formLabelWidth"
          prop="workContent"
          :rules="{
            required: true,
            message: '请填写本职工作内容',
            trigger: 'blur'
          }"
        >
          <el-input
            type="textarea"
            rows="5"
            placeholder="请输入岗位的本职工作"
            v-model.trim="addJobForm.workContent"
          ></el-input>
        </el-form-item>
        <!-- 职责与工作任务 -->
        <h3>职责与工作任务</h3>
        <table
          v-for="(item, index) in addJobForm.responsibilityVos"
          :key="index"
        >
          <tr style="height: 60px">
            <td rowspan="2">{{ item.responsibilityName }}</td>
            <td>职责表述</td>
            <td colspan="4">
              <el-form-item
                label=""
                :prop="'responsibilityVos.' + index + '.responsibilityDescribe'"
                :rules="{
                  required: true,
                  message: '请填写职责表述',
                  trigger: 'blur'
                }"
              >
                <el-input
                  placeholder="请输入职责表述"
                  size="small"
                  v-model.trim="item.responsibilityDescribe"
                ></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>工作任务</td>
            <td colspan="4">
              <el-form-item
                label=""
                :prop="'responsibilityVos.' + index + '.workContent'"
                :rules="{
                  required: true,
                  message: '请填写工作任务',
                  trigger: 'blur'
                }"
              >
                <el-input
                  type="textarea"
                  placeholder="请输入职责对应的工作内容(不超过六条)"
                  rows="6"
                  v-model.trim="item.workContent"
                ></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>

        <el-button
          class="addJobDuty"
          size="small"
          @click="addJobDuty"
        >新增职责</el-button>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        v-if="jobOperate=='check'"
      >
        <el-button type="primary" @click="handleClose">关 闭</el-button>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        v-else
      >
        <el-button @click="handleCancel('addJobForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addJobForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api';
export default {
  name: '',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    jobOperate: {
      type: String,
      default: 'create'
    },
    departmentId: {
      type: String,
      default: ''
    },
    pickJobItem: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      jobDialogTitle: '默认标题',
      addJobForm: {
        id: '',
        dutyName: '',
        workContent: '',
        responsibilityVos: [
          {
            id: '',
            responsibilityName: '职责1',
            responsibilityDescribe: '',
            workContent: ''
          }
        ]
      },
      formLabelWidth: '120px',
      fileList: []
    };
  },
  computed: {},
  watch: {
    pickJobItem() {
      this.initEditData();
    },
    jobOperate() {
      this.initEditData();
      this.setDialogTitle(); // 设置对话框title
    }
  },
  created() {},
  mounted() {},
  methods: {
    initEditData() {
      // 判断是添加还是编辑
      if (this.jobOperate == 'create') {
        // 添加
        this.addJobForm = {
          id: '',
          dutyName: '',
          workContent: '',
          responsibilityVos: [
            {
              id: '',
              responsibilityName: '职责1',
              responsibilityDescribe: '',
              workContent: ''
            }
          ]
        };
      } else {
        // 编辑--查看
        // 添加
        this.addJobForm = { ...this.pickJobItem };
      }
    },
    // 点击确定 校验表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 通过校验
          // 点击确认添加/编辑岗位
          this.$axios.post(
            Api.frameworkInfo.saveDutyInfo,
            {
              data: {
                id: this.addJobForm.id,
                departmentId: this.departmentId,
                dutyName: this.addJobForm.dutyName,
                workContent: this.addJobForm.workContent,
                responsibilityVos: this.addJobForm.responsibilityVos
              }
            },
            res => {
              if (res.isSuccess) {
                const messageInfo = this.addJobForm.id == '' ? '添加成功！' : '修改成功';
                this.$message({
                  message: messageInfo,
                  type: 'success'
                });
                this.$emit('getJobsInfoData');
              } else {
                this.$message.error(res.message);
              }
              this.$emit('update:visible', false);
            }
          );
        } else {
          this.$message.error('校验失败');
          return false;
        }
      });
    },
    // 取消按钮
    handleCancel(formName) {
      this.handleClose();
      // 重置信息
      this.$refs[formName].resetFields();
      if (this.addJobForm.responsibilityVos.length > 1) {
        // 重置成只有一条职责
        this.addJobForm.responsibilityVos.splice(1);
      }
    },
    // 取消按钮
    handleClose() {
      this.$emit('update:visible', false);
    },
    // 新增职责
    addJobDuty() {
      const num = this.addJobForm.responsibilityVos.length + 1;
      this.addJobForm.responsibilityVos.push({
        responsibilityName: '职责' + num,
        responsibilityDescribe: '',
        workContent: ''
      });
    },
    // 设置对话框标题
    setDialogTitle() {
      this.jobDialogTitle = this.jobOperate == 'create' ? '添加岗位'
        : this.jobOperate == 'check' ? '查看岗位信息' : '编辑岗位信息';
    }
  }
};
</script>

<style scoped lang="scss">
.add-post-dialog {
  background-color: #fff;
  .formContainer {
    min-height: 400px;
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  h3 {
    margin-bottom: 20px;
  }
  table {
    width: 100%;
    text-align: center;
    border-spacing: 0;
    border-collapse: collapse;
    .el-form-item {
      margin-bottom: 0 !important;
    }
    tr td {
      border: 1px solid #ccc;
      .el-input input {
        border: none;
        outline: none;
      }
    }
  }
  .addJobDuty {
    margin: 20px 45%;
  }
}
</style>
