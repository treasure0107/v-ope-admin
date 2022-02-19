<!--
 * @Descripttion:登录页面
 * @Author: JTune
 * @Date: 2021-01-12 11:31:23
-->
<template>
  <div class="login">
    <div
      v-if="flag == '1'"
      class="login-container"
    >
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-position="left"
        label-width="0px"
        class="login-form"
      >
        <h1>运维管理系统</h1>
        <el-form-item prop="userName">
          <el-input
            v-model.trim="loginForm.userName"
            type="text"
            auto-complete="off"
            placeholder="用户名"
            size="middle"
          >
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model.trim="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            size="middle"
          >
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div
      v-else
      class="outside-login"
    >
      <DyDialog
        :dialogTitle="dialogTitle"
        :visible.sync="dialogVisible"
        :width="'500px'"
        :top="'250px'"
        @cancelDialogPopup="handleClose"
        @closeDialogPopup="handleClose"
        @sureDialogPopup="handleConfirm"
      >
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="80px"
        >
          <el-form-item
            label="厂商"
            prop="factoryId"
          >
            <el-select
              filterable
              placeholder="请选择厂商"
              v-model="form.factoryId"
            >
              <el-option
                v-for="(item) in factoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="姓名"
            prop="name"
          >
            <el-input
              placeholder="请输入您的姓名"
              v-model.trim="form.name"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="电话号码"
            prop="phone"
          >
            <el-input
              placeholder="请输入您的电话号码"
              v-model.trim="form.phone"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="场站"
            prop="windFarmId"
          >
            <el-select
              filterable
              placeholder="请选择您所在的场站"
              v-model="form.windFarmId"
            >
              <el-option
                v-for="(item) in stationList"
                :key="item.id"
                :label="item.nodeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </DyDialog>
    </div>
  </div>
</template>

<script>
import Api from '@/api';
import Base64 from 'base-64';
import DyDialog from '@/components/DyDialog';
import { localstorageGet } from '@/utils/auth';
export default {
  components: { DyDialog },

  data() {
    return {
      flag: '1',
      loading: false,
      redirect: undefined,
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      /* -------- 站外 ----------- */
      dialogTitle: '请确认您的身份',
      dialogVisible: true,
      factoryList: [],
      stationList: [],
      form: {
        factoryId: '',
        name: '',
        phone: '',
        windFarmId: ''
      },
      rules: {
        factoryId: [
          {
            required: true,
            message: '请选择厂商',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请填写您的姓名',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请填写您的电话号码',
            trigger: 'blur'
          },
          {
            pattern: /^1[345789]\d{9}$/,
            message: '您输入的号码格式有误，请重新输入',
            trigger: 'blur'
          }
        ],
        windFarmId: [
          {
            required: true,
            message: '请选择你所在的场站',
            trigger: 'change'
          }
        ]
      }
    };
  },

  computed: {},
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() { },

  mounted() { },

  methods: {
    handleLogin() {
      // 站外人员登录
      if (this.loginForm.userName == 'admin' && this.loginForm.password == 'admin') {
        this.flag = '0';
        this.$store.commit('user/SET_IDENTITY', 'OUTSTATION');// 保存身份-站外
        this.getFactoryList();
        this.getStationList();
        return;
      }
      // 站内登录
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.commit('permission/RESET_TOPNAV_LIST');
          const data = {
            data: {
              account: this.loginForm.userName,
              password: Base64.encode(this.loginForm.password),
              platformCode: '400001'
            }
          };
          this.$axios.post(Api.user.login, data, (res) => {
            if (res.isSuccess) {
              this.$store.commit('user/SET_TOKEN', res.sid);
              this.$store.commit('user/SET_IDENTITY', 'INSTATION');// 保存身份-站内
              this.$store.commit('user/CHANGE_USER_NAME', res.data.user.name);
              this.$store.commit('user/SET_COMPANY_ID', res.data.user.companyId);
              this.$store.commit('user/SET_USER_ID', res.data.user.id);
              this.$store.commit('user/SET_PLATFORMCODE', '400001');// 固定的运维平台code
              this.$store.commit('user/SET_CUSTOMERCODE', res.data.user.customerCode);// 固定的运维平台code
              this.$router.push({ path: '/' });
              // window.location.reload();
              this.createFolder();
              this.localStorageSaveStation();
              this.$message.success('登录成功!');
              // this.$store.dispatch('permission/getPermissionList').then(() => {
              //   this.$router.push({ path: '/' });
              //   this.$message.success('登录成功!');
              // }).catch(() => {
              //   this.$message.error('该用户没有权限访问');
              // });
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              });
            }
            this.loading = false;
          });
          //   window.localStorage.removeItem('activeIndex');
        } else {
          this.$message.error('用户名或密码不能为空');
          return false;
        }
      });
    },
    // 登录后创建一个文件夹以上传文件使用
    createFolder() {
      this.$axios.post(
        Api.file.createFolder,
        {
          data: {
            fileType: 'folder'
          }
        },
        res => {
          if (res.isSuccess) {
          }
        }
      );
    },
    // 登陆后根据用户id存储场站id
    localStorageSaveStation() {
      this.$axios.post(
        Api.windFarmManage.getWindFarmInfo,
        {
          data: {
            userId: localstorageGet('userId')
          }
        },
        res => {
          if (res.isSuccess) {
            if (res.data.length > 0) {
              this.$store.commit('user/SET_STATION_ID', res.data[0].nodeId);
            } else {
              // 集团人员
              this.$store.commit('user/SET_IDENTITY', 'CENTER');// 保存身份-站内
            }
          } else {
            this.$message.error('未获取到场站id');
          }
        }
      );
    },
    /*  站外身份确认弹窗 */
    getFactoryList() {
      // 查询厂商
      this.$axios.post(
        Api.factoryManage.getFactoryList,
        {
          data: {
            companyType: 'COOPERATE_COMPANY'
          },
          // pagination: false,
          size: 9999,
          platformCode: '400001'
        },
        res => {
          if (res.isSuccess) {
            this.factoryList = res.data.dataList;
          } else {
            this.$message.error('厂商查询' + res.message);
          }
        }
      );
    },
    getStationList() {
      // 查询场站
      this.$axios.post(
        Api.windFarmManage.getWindFarmList,
        {
          data: {
            platformCode: '400001'
          },
          searchArea: true
        },
        res => {
          if (res.isSuccess) {
            this.stationList = res.data;
          } else {
            this.$message.error('场站查询' + res.message);
          }
        }
      );
    },
    handleClose() {
      this.flag = '1';
    },
    // 站外人员登录
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios.post(
            Api.user.osLogin,
            {
              data: {
                name: this.form.name,
                phone: this.form.phone,
                companyId: this.form.factoryId
              }
            },
            res => {
              if (res.isSuccess) {
                this.$store.commit('user/SET_TOKEN', res.sid);
                this.$store.commit('user/CHANGE_USER_NAME', res.data.user.name);
                this.$store.commit('user/SET_COMPANY_ID', res.data.user.companyId);
                this.$store.commit('user/SET_USER_ID', res.data.user.id);
                this.$store.commit('user/SET_STATION_ID', this.form.windFarmId);
                this.$router.push({ path: '/' });
                this.$message.success('站外登录成功!');
                this.createFolder();
              } else {
                this.$message.error(res.message);
              }
            }
          );
        } else {
          this.$message.warning('校验失败,请完善登录信息');
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.login {
  width: 100%;
  height: 100%;
  .el-select {
    width: 100%;
  }
  .outside-login {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background: url(~@/assets/images/outlogin-bg.jpg) center no-repeat;
  }
  .login-container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #cc6300;
    background: url(~@/assets/images/login-bg.jpg) center no-repeat;
    background-size: 100% 100%;
    .login-form {
      background-color: #fff;
      position: absolute;
      top: 50%;
      left: 70%;
      transform: translate(0%, -50%);
      text-align: center;
      border-radius: 6px;
      padding: 30px;
      min-width: 400px;
      h1 {
        font-size: 30px;
        margin-top: 10px;
        margin-bottom: 60px;
        color: #333;
      }
      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
      }
    }
  }
}
</style>

