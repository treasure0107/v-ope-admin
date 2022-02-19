<!--
 * @Author: JTune
 * @Date: 2021-09-01 11:33:42
 * @LastEditors: JTune
 * @LastEditTime: 2021-10-29 16:34:07
 * @Description: 批量导入人员/岗位
-->

<template>
  <div class="container">
    <el-dialog
      :title="dialogTitle"
      :visible="visible"
      :close-on-click-modal="false"
      width="400px"
      top='20vh'
      @close='handleClose'
    >
      <el-form
        :model="form"
        :rules='rules'
        ref="form"
        label-width="100px"
      >
        <el-form-item
        label="下载模板"
        >
          <el-button
            size="small"
            type="primary"
            @click="downloadTemplate"
          >下载模板</el-button>
        </el-form-item>
        <el-form-item
          label="导入文件"
          prop="file"
        >
          <div style="display: flex;align-items: center;">
            <div style="display:inline-block;">
              <el-upload
                action="#"
                accept=".xlsx"
                :limit="1"
                :http-request="uploadHttpRequest"
                :on-success="handleAvatarSuccess"
                :on-remove="removeFile"
                :before-upload="beforeAvatarUpload"
                :file-list="fileList"
                :on-change="fileChange"
              >
                <el-button
                  size="small"
                  type="primary"
                >上传文件</el-button>
              </el-upload>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :loading="uploadLoading"
          @click="submit('form')"
        >提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { localstorageGet } from '@/utils/auth';
import Api from '@/api';

export default {
  name: '',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    departmentId: {
      type: String,
      default: ''
    },
    importContainer: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogTitle: '',
      downloadUrl: '', // 模板下载地址
      downloadFileName: '', // 模板保存时的名称
      postUrl: '',
      form: {
        file: ''
      },
      fileList: [
      ],
      rules: {
        file: [
          { required: true, message: '请上传文件', trigger: 'change' }
        ]
      },
      uploadLoading: false
    };
  },
  computed: {},
  watch: {
    visible(value) {
      if (value) {
        this.fileList = [];
        this.form = {
          file: '',
          rootCode: ''
        };
      }
    },
    importContainer() {
      if (this.importContainer == 'person') {
        this.dialogTitle = '批量导入人员';
        this.postUrl = Api.frameworkInfo.importUserList;
        this.downloadUrl = 'https://file.runshihua.com/files/c/200001/20210913/19c964c1efc6481190eaa65362c9f21a.xlsx';
        this.downloadFileName = '批量导入人员模板';
      } else {
        // 批量导入岗位
        this.dialogTitle = '批量导入岗位';
        this.postUrl = Api.frameworkInfo.importDutyList;
        this.downloadUrl = 'https://file.runshihua.com/files/c/200001/20210913/b1ca34fa0bd347dcbd263e70e89b206c.xlsx';
        this.downloadFileName = '批量导入岗位模板';
      }
    }
  },
  created() { },
  mounted() {
  },
  methods: {
    downloadTemplate() {
      const url = this.downloadUrl;
      const fileName = this.downloadFileName;
      (function test(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) { // 4:请求已完成，且响应已就绪
            if (xhr.status == 200) { // 200:成功
              // console.log(xhr.responseText);
            } else {
              alert('文件服务器请求错误！');
            }
          }
        };
        xhr.send();
        xhr.onload = function () {
          const fileBlob = xhr.response;
          const fileUrl = URL.createObjectURL(fileBlob);
          var aElement = document.createElement('a');
          aElement.setAttribute('href', fileUrl);
          aElement.download = fileName;
          aElement.click();
          URL.revokeObjectURL(fileUrl);
          aElement = undefined;
          xhr = undefined;
        };
      })(url);
    },
    handleClose() {
      this.$emit('update:visible', false);
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const sid = localstorageGet('token') || '';
          const formData = new FormData();
          this.uploadLoading = true;
          formData.append('file', this.form.file);
          formData.append('departmentId', this.departmentId);
          // formData.append('sid', sid);
          this.$axios.post(this.postUrl, formData, res => {
            if (res.isSuccess) {
              this.$message.success('上传成功');
              // 导入后重新获取岗位信息和人员信息
              this.$emit('reGetPersonInfo');
              this.$emit('reGetDutyInfo');
              this.$emit('update:visible', false);
            } else {
              this.$message.error(res.message);
              this.handleClose();
            }
            this.uploadLoading = false;
          }, {
            headers: { 'Content-Type': 'multipart/form-data', sid: sid }
          });
        } else {
          return false;
        }
      });
    },
    pdfAction: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return '';
    },
    uploadHttpRequest(param) {
      this.form.file = param.file;
      this.$refs.form.validateField('file', res => {
        if (res) {
          return true;
        } else {
          return false;
        }
      });
    },
    // 文件发生改变
    fileChange(file, fileList) {
      this.fileList = [];
      this.fileList.push({
        name: file.name,
        url: ''
      });
      // if (fileList.length > 0) {
      //   this.fileList = [fileList[fileList.length - 1]]; // 展示最后一次选择的文件
      // }
    },
    removeFile(file, fileList) {
      if (this.uploadLoading) return;
      this.fileList = [];
      this.form.file = '';
    },

    // 文件上传
    handleAvatarSuccess(resp, file) {
      // this.fileList = [];
      // this.fileList.push({
      //   name: file.name,
      //   url: ''
      // });
    },
    beforeAvatarUpload(file) {
      // if (!/\.(xlsx|xls|XLSX|XLS)$/.test(file.name)) {
      //   this.$message.error(
      //     '上传文件只能为excel文件，且为xlsx,xls格式'
      //   );
      //   return false;
      // }
    }
  }
};
</script>

<style scoped lang="scss">
</style>

