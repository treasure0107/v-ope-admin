<!--
 * @Author: JTune
 * @Date: 2021-09-01 11:33:42
 * @LastEditors: JTune
 * @LastEditTime: 2021-10-25 15:38:58
 * @Description: 人员信息弹窗
-->
<template>
  <div class="add-person-dialog">
    <!-- 人员--新增、修改 -->
    <DyDialog
      :visible.sync="visible"
      :dialogTitle="dialogTitle"
      width="600px"
      @cancelDialogPopup="handleClose('personForm')"
      @closeDialogPopup="handleClose('personForm')"
      @sureDialogPopup="handleSubmitPerson('personForm')"
    >
      <div class="dialog-content">
        <el-form
          :model="personForm"
          :rules="rules"
          :disabled="personOperate=='check' ? true : false"
          ref="personForm"
        >
          <el-form-item
            label="厂商："
            :label-width="formLabelWidth"
            prop="windPowerPlant"
          >
            <el-select
              v-model="personForm.windPowerPlant"
              placeholder="请选择厂商"
              style="width: 100%"
              disabled
            >
              <el-option
                v-for="(item) in factoryList"
                :key="item.id"
                :label="item.departmentName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="姓名："
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input
              v-model.trim="personForm.name"
              maxlength="100"
              placeholder="请输入姓名"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="岗位："
            :label-width="formLabelWidth"
            prop="dutyName"
          >
            <el-select
              v-model="personForm.dutyName"
              placeholder="请选择岗位"
              style="width: 100%"
            >
              <el-option
                v-for="item in dutyList"
                :key="item.id"
                :label="item.dutyName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="电话："
            :label-width="formLabelWidth"
            prop="phone"
          >
            <el-input
              v-model.trim="personForm.phone"
              clearable=""
              maxlength="100"
              placeholder="请输入电话号码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </DyDialog>
  </div>
</template>

<script>
import DyDialog from '@/components/DyDialog';
import Api from '@/api';
export default {
  name: '',
  components: { DyDialog },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    personOperate: {
      type: String,
      default: 'create'
    },
    checkedFactoryId: {
      type: String,
      default: ''
    },
    companyId: {
      type: String,
      default: ''
    },
    pickPersonItem: {
      type: Object,
      default: () => {
        return {};
      }
    },
    factoryList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    dutyList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      isClick: false, // 标记确定按钮是否已点击
      userId: '',
      userDutyId: '',
      formLabelWidth: '100px',
      dialogTitle: '添加人员',
      // 人员表单
      personForm: {
        windPowerPlant: '',
        name: '',
        dutyName: '',
        phone: ''
      },
      rules: {
        windPowerPlant: [{ required: true, message: '请选择厂商', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        dutyName: [{ required: true, message: '请选择岗位', trigger: 'blur' }],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^1[345789]\d{9}$/,
            message: '您输入的手机号码格式有误，请重新输入',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {},
  watch: {
    visible() {
      this.setDialogTitle();
    },
    checkedFactoryId() {
      this.personForm.windPowerPlant = this.checkedFactoryId;
    },
    pickPersonItem() {
      console.log(this.pickPersonItem);
      this.userId = this.pickPersonItem.id;
      this.userDutyId = this.pickPersonItem.userDutyVos[0].id;// 用户岗位id
      this.personForm.name = this.pickPersonItem.name;
      this.personForm.phone = this.pickPersonItem.phone;
      this.personForm.windPowerPlant = this.pickPersonItem.userDutyVos[0].departmentId;
      this.personForm.dutyName = this.pickPersonItem.userDutyVos[0].dutyId;
    }
  },
  created() { },
  mounted() {
  },
  updated() { },
  methods: {
    // 添加编辑人员
    handleSubmitPerson(formName) {
      if (this.personOperate == 'check') {
        this.handleClose('personForm');
      } else {
        if (this.isClick) return;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.isClick = true;
            this.$axios.post(
              Api.frameworkInfo.saveUser,
              {
                data: {
                  id: this.userId,
                  name: this.personForm.name,
                  companyId: this.companyId,
                  phone: this.personForm.phone,
                  userDutyVos: [
                    {
                      id: this.userDutyId,
                      departmentId: this.checkedFactoryId,
                      dutyId: this.personForm.dutyName,
                      dutyType: '1',
                      userId: this.userId
                    }
                  ]
                }
              },
              res => {
                if (res.isSuccess) {
                  this.$emit('getPersonInfoData');
                  // 更新岗位人数
                  this.$emit('getJobsInfoData');
                  const message = this.personOperate == 'create' ? '添加成功' : '修改成功';
                  this.$message.success(message);
                  this.handleClose(formName);
                  setTimeout(() => {
                    this.isClick = false;
                  }, 1000);
                } else {
                  this.$message.error(res.message);
                }
              }
            );
          } else {
            this.$message.error('校验失败');
            return false;
          }
        });
      }
    },
    // 关闭对话框
    handleClose(formName) {
      this.$emit('update:visible', false);
      this.$refs[formName].resetFields();
    },
    setDialogTitle() {
      this.dialogTitle = this.personOperate == 'create' ? '添加人员'
        : this.personOperate == 'edit' ? '修改人员信息' : '查看人员信息';
    }

  }
};
</script>

<style scoped lang="scss">
.add-person-dialog {
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
  .add-deputy-post {
    margin: 20px 45%;
  }
  .showItem {
    visibility: visible;
  }
  .hiddenItem {
    visibility: hidden;
  }
  .dispNone {
    display: none;
  }
  .el-icon-remove {
    cursor: pointer;
  }
}
</style>
