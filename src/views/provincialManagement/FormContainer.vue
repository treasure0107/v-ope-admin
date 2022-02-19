<!--
 * @Author: JTune
 * @Date: 2021-08-23 10:15:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-17 11:10:57
 * @Description: 公共组件-表单创建/查看/编辑
-->
<template>
  <div>
    <div id="formOperate">
      <!-- <div class="topConfig">
        <span class="text">交接班登记表：</span>
        <span v-if="formOperate == 'create'">
          <el-select placeholder="风电场" size="small" v-model="station">
            <el-option
              v-for="item in stationOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select placeholder="班次" size="small" v-model="shift">
            <el-option
              v-for="item in shiftOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
      </div> -->
      <!-- <div class="title">月报</div> -->
      <div :class="formOperate == 'check' ? 'noBorder' : ''"  id="printTest">
        <!-- <GenerateForm :isEdit="isEdit" ref="generateForm"></GenerateForm> -->
        <fm-generate-form
          :data="jsonData"
          :edit="isEdit"
          ref="generateForm"
          style="margin-left:10px"
        >
        </fm-generate-form>
      </div>
      <!-- 创建-编辑 -->
      <div class="bottomBtn" v-if="isEdit">
        <el-button type="primary" @click="handleConfirm">确认</el-button>
        <el-button @click="handleCancel">取消</el-button>
        <!-- <el-button @click="handlePrint" v-print="'#printTest'">打印</el-button> -->
      </div>
    </div>
    <!-- 创建表单--确认弹窗 -->
    <DyDialog
      :visible.sync="confirmVisible"
      width="500px"
      :dialogTitle="confirmTitle"
      @cancelDialogPopup="handleConfirmClose"
      @closeDialogPopup="handleConfirmClose"
      @sureDialogPopup="handleConfirmSureAdd"
    >
      <el-form
        ref="confirmForm"
        :rules="confirmRules"
        :model="confirmForm"
        label-width="80px"
      >
        <el-form-item
          label="厂商"
          prop="factory"
        >
          <el-select
            style="width:100%"
            v-model="confirmForm.factory"
            placeholder="请选择厂商"
          >
            <el-option
              label="庚熙山风电场"
              value="庚熙山风电场"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="姓名"
          prop="name"
        >
          <el-select
            style="width:100%"
            v-model="confirmForm.name"
            placeholder="请确认您的姓名"
          >
            <el-option
              label="欧文"
              value="欧文"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </DyDialog>
  </div>
</template>

<script>
// import GenerateForm from '@/components/GenerateForm';
import DyDialog from '@/components/DyDialog';
export default {
  name: '',
  components: { DyDialog },
  data() {
    return {
      jsonData: require('./test.json'),
      dddd: true,
      isEdit: false,
      formOperate: 'check',
      station: '',
      shift: '',
      confirmVisible: false,
      confirmTitle: '请再次确认您的身份',
      approveResult: '', // 审批意见
      confirmForm: {
        factory: '',
        name: ''
      },
      confirmRules: {
        factory: [{ required: true, message: '请选择厂商', trriger: 'change' }],
        name: [
          { required: true, message: '请确认您的姓名', trriger: 'change' }
        ]
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
  computed: {},
  watch: {},
  created() {

  },
  mounted() {
    // console.log(this.$refs.generateForm.$el.firstChild.firstChild.id = 'printTest');
    this.formOperate = this.$route.query.formOperate;
    this.isEdit = !!(this.formOperate == 'create' || this.formOperate == 'edit');
  },
  methods: {
    handlePrint() {
    },
    // 创建确认
    handleConfirm() {
      // 获取formMaking表单数据  this.$refs.generateForm.getData();
      this.$refs.generateForm.getData().then(a => { console.log(a); }, b => { console.log(b); });
      this.$router.back();
      // if (this.formOperate == 'create') {
      //   this.confirmVisible = true;
      // }
    },
    // 取消创建
    handleCancel() {
      const temp = {};
      for (var i = 1;i <= new Array(100).length;i++) {
        var index = 'cell' + i.toString().padStart(2, '0');
        temp[index] = '2021年09月29日';
      }
      this.dddd = !this.dddd;
      this.$refs.generateForm.setData(temp);
      this.dddd && this.$refs.generateForm.reset();
    },
    // // 确认按钮--确认创建
    handleConfirmSureAdd() {
      this.$refs.confirmForm.validate((valid) => {
        if (valid) {
          this.typeSave();
        } else {
          this.$message.error('缺少必填的数据或数据格式不正确,提交失败!');
        }
      });
    },
    // 待办事项-提交
    handleSubmit() {},
    // 关闭弹窗--确认创建
    handleConfirmClose() {
      this.confirmVisible = false;
      this.$refs.confirmForm.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
::v-deep .noBorder {
  .el-input input {
    outline: none !important;
    border: none;
    padding: 0 !important;
    margin: 0;
  }
  textarea {
    border: none;
    padding: 0 !important;
  }
}
#formOperate {
  .topConfig {
  margin-bottom: 20px;
    .text {
      font-size: 14px;
    }
    .el-select {
      margin-right: 5px;
    }
  }
  .title {
    background-color:#fafafa;
    font-size:14px;
    line-height:45px;
    text-indent: 1rem;
    border-bottom: 1px solid #ddd;
  }
  .bottomBtn {
    margin: 15px 0 0 10px;
  }
}
</style>
