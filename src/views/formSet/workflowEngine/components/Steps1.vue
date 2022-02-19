
<template>
  <div class="info-form-container">
    <el-form
      :model="infoForm"
      ref="ruleForm"
      :rules="rules"
      label-width="200px"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="表单名称"
            prop="name"
          >
            <el-input
              :disabled='!editVisible'
              v-model="infoForm.name"
              placeholder="请输入表单名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="选择分组"
            prop="group"
          >
            <el-select
              disabled
              v-model="infoForm.group"
              placeholder="请选择"
            >
              <el-option
                v-for="item in formGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.group"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="表单说明">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10}"
              v-model="infoForm.remark"
              maxlength="500"
              placeholder="请输入表单说明"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn-box">
      <el-button
        type="primary"
        @click="handleNext"
        class="btn"
      >下一步</el-button>
    </div>
  </div>
</template>

<script>
import Bus from '@/bus';
export default {
  name: '',
  components: {},
  props: {
    editVisible: {
      type: Boolean,
      default: () => true
    },
    infoForm: {
      type: Object,
      default: () => {
        return {
          name: '',
          group: ''
        };
      }
    },
    // 创建时选择的表单所属分组
    checkedFormGroup: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formGroupList: [
        {
          id: '1112190',
          name: '工作流表单',
          group: 'flow'
        },
        {
          id: '12672190',
          name: '普通表单',
          group: 'normal'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入表单名称', trigger: 'blur' }
        ],
        group: [
          { required: true, message: '请选择流程分组' }
        ]
      }
    };
  },
  computed: {},
  watch: {
    // 监听中未生效--mounted生效
    // checkedFormGroup() {
    //   this.infoForm.group = this.checkedFormGroup;
    // }
  },
  created() { },
  mounted() { },
  methods: {
    handleNext() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('updateActive', 1);
          Bus.$emit('sendInfoForm', this.infoForm);
        } else {
          this.$message.error('缺少必填的数据或数据格式不正确');
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.info-form-container {
  height: 600px;
  position: relative;
  .btn-box {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 20px;
    text-align: center;
  }
  ::v-deep .el-input,
  .el-textarea {
    width: 400px;
  }
}
</style>
