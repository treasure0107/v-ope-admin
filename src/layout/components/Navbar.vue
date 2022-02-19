<template>
  <div class="navbar">
    <div
      class="logo-main"
      :class="{'active': $route.meta.isMenuHide }"
    >
      <router-link to="/home">
        <img
          src="@/assets/images/logo.png"
          class="logo-img"
        />
        <span> {{title}}</span>
      </router-link>
    </div>
    <TopNav />
    <div class="right-menu">
      <span class="headPaper">
        <i class="el-icon-user-solid"></i>
      </span>
      <el-dropdown
        @command="handleCommand"
        class="avatar-container"
      >
        <span class="el-dropdown-link">
          {{userName}}
          <!-- {{ $store.state.login.userName }} -->
          <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="0"
            v-if="identity!='OUTSTATION'"
          >修改密码</el-dropdown-item>
          <el-dropdown-item command="1">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <DyDialog
      :visible="visible"
      :width="width"
      :dialogTitle="dialogTitle"
      @sureDialogPopup="sureDialogPopup"
      @cancelDialogPopup="cancelDialogPopup"
      @closeDialogPopup="closeDialogPopup"
      :appendTo="true"
    >
      <div>
        <el-form
          :model="formData"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item
            label="原密码"
            prop="password"
          >
            <el-input
              type="password"
              v-model="formData.password"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="new_password"
          >
            <el-input
              type="password"
              v-model="formData.new_password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="check_password"
          >
            <el-input
              type="password"
              v-model="formData.check_password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </DyDialog>
  </div>
</template>

<script>
import Api from '@/api/index.js';
import Base64 from 'base-64';
import { mapGetters } from 'vuex';
import TopNav from './TopNav';
import { localstorageGet } from '@/utils/auth';
import DyDialog from '@/components/DyDialog';
import MessageHandler from '@/views/home/allMessage/mixin/MessageHandler.js';
export default {
  components: { TopNav, DyDialog },
  mixins: [MessageHandler],
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'));
      } else {
        if (this.formData.check_password !== '') {
          this.$refs.ruleForm.validateField('check_password');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.formData.new_password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      identity: localstorageGet('identity'),
      title: '运维管理系统',
      userName: localstorageGet('userName'),
      // showLogo: true,
      isCollapse: true,
      dialogTitle: '修改密码',
      visible: false,
      width: '600px',
      formData: {},
      rules: {
        password: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        new_password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/,
            message: '密码格式错误！密码长度6-18位，且必须包含字母和数字',
            trigger: 'blur'
          }
        ],
        check_password: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    }
  },
  mounted() {
    // const userName = localstorageGet('userName');
    // this.userName = userName.substring(userName.length - 2, userName.length);
  },
  methods: {
    handleCommand(command) {
      if (command == 1) {
        // 退出登录
        const data = {
          data: {}
        };

        this.$axios.post(Api.user.loginOut, data, (res) => {
          if (res.isSuccess) {
            this.$store.commit('user/RESET_STATE', '');
            this.$store.commit('flow/RESET_STATE', '');
            // this.$store.commit('permission/RESET_PERMISSION');
            this.$store.commit('permission/RESET_TOPNAV_LIST');
            this.$message.success('退出登录！');
            window.location.reload();
            this.$router.push({ path: '/login' });
          } else {
            this.$message.error(res.message);
            // this.$router.push({ path: '/login' });
            // this.$store.commit('user/RESET_STATE', '');
            // this.$store.commit('flow/RESET_STATE', '');
            // this.$store.commit('permission/RESET_TOPNAV_LIST');
          }
        });
      } else {
        this.visible = true;
      }
    },

    cancelDialogPopup() {
      this.resetForm();
      this.visible = false;
    },
    closeDialogPopup() {
      this.visible = false;
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    sureDialogPopup() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$axios.post(
            Api.user.passwordUpdate,
            {
              data: {
                id: localstorageGet('userId'),
                password: Base64.encode(this.formData.new_password),
                oldPassword: Base64.encode(this.formData.password)
              }
            },
            res => {
              if (res.isSuccess) {
                this.$message.success('修改成功');
                this.handleCommand('1');
              } else {
                this.$message.error(res.message);
              }
            }
          );
        } else {
          this.$message.error('缺少必填的数据或数据格式不正确,提交失败!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
.navbar {
  width: 100%;
  height: 64px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .logo-main {
    float: left;
    font-size: 14px;
    width: $sideBarWidth;
    font-family: Microsoft YaHei;
    color: #ffffff;
    line-height: 64px;
    // text-align: center;
    cursor: pointer;
    background-color: #144272;
    .logo-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      vertical-align: middle;
      margin-left: 30px;
      margin-right: 3px;
    }
    &.active {
      color: #323233;
      background-color: #fff;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .right-menu {
    margin-right: 30px;
    float: right;
    height: 100%;
    // line-height: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .headPaper {
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      font-size: 24px;
      border-radius: 50%;
      background-color: #1989fa;
    }
    .avatar-container {
      margin-right: 26px;
      height: 40px;
      .el-dropdown-link {
        display: inline-block;
        font-size: 14px;
        width: 80px;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        // text-align: center;
        color: #1989fa;
        cursor: pointer;
      }
    }
  }
}
</style>
