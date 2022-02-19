<template>
  <div class="deptFunctionDialog">
    <el-dialog
      :title="deptFuncTitle"
      :visible="visible"
      width="600px"
      :close-on-click-modal="false"
      @close="handleClose('deptDutyForm')"
    >
      <el-form
        :model="deptDutyForm"
        ref="deptDutyForm"
        size="small"
        label-width="100px"
      >
        <el-form-item
          label="职能名称:"
          prop="functionName"
          :rules="{
            required:true,
            trigger:'blur',
            message:'请填写部门职能'
          }"
        >
          <el-input
            type="input"
            v-model.trim="deptDutyForm.functionName"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose('deptDutyForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="submitDeptDuty('deptDutyForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api';
export default {
  name: 'App',
  components: {},
  data() {
    return {
      deptDutyForm: {
        functionName: ''
      }
    };
  },
  props: {
    deptFuncTitle: {
      type: String,
      default: '添加部门职能'
    },
    visible: {
      type: Boolean,
      default: false
    },
    deptFuncName: {
      type: String,
      default: ''
    },
    functionId: {
      type: String,
      default: ''
    },
    departmentId: {
      type: String,
      default: ''
    }
  },
  computed: {},
  watch: {
    deptFuncName() {
      this.deptDutyForm.functionName = this.deptFuncName;
    }
  },
  created() { },
  mounted() { },
  updated() { },
  methods: {
    // 关闭对话框
    handleClose(formName) {
      this.$refs[formName].resetFields();
      this.$emit('update:visible', false);
    },
    // 保存部门职责列表
    submitDeptDuty(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const postUrl = this.deptFuncTitle == '添加部门职能'
            ? Api.frameworkInfo.saveDeptFunction
            : Api.frameworkInfo.updateDeptFunction;
          const data = {
            functionContent: this.deptDutyForm.functionName
          };
          if (this.deptFuncTitle == '添加部门职能') {
            data.departmentId = this.departmentId;
          } else {
            data.id = this.functionId;
          }
          this.$axios.post(
            postUrl,
            {
              data
            },
            res => {
              if (res.isSuccess) {
                const messageInfo = data.id ? '修改成功' : '添加成功';
                this.$message({
                  message: messageInfo,
                  type: 'success'
                });
                this.$emit('getDeptFunctionInfoData');
                this.handleClose(formName);
              } else {
                this.$message({
                  message: res.message,
                  type: 'warning'
                });
                this.handleClose('permissionForm');
              }
            }
          );
        }
      });
    }
  }
};
</script>

<style></style>
