<!--
 * @Author: your name
 * @Date: 2021-08-03 09:20:39
 * @LastEditTime: 2021-08-04 09:52:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rsh-operation-system-web\src\components\UploadFile\index.vue
-->
<template>
  <div>
    <el-upload
      class="upload-container"
      ref="upload"
      action="#"
      :file-list="fileList"
      :auto-upload="false"
      :on-change="fileChange"
      :on-remove="handleRemove"
      :limit="limit"
      :before-upload="beforeUploadFile"
      accept="accept"
    >
      <el-button
        type="text"
        class="fs16"
      >选择文件</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    acceptType: {
      // 上传文件格式类型
      type: Number,
      default: 0
    },
    accept: {
      // 上传文件格式
      type: String,
      default: '.doc,.docx,.pdf'
    },
    limit: {
      // 需要上传文件数量限制
      type: Number,
      default: 1
    },
    size: {
      // 需要文件大小限制
      type: Number,
      default: 200
    },
    isText: {
      // 是否需要展示文本
      type: Boolean,
      default: true
    },
    fileListDefault: {
      // 图片数组默认数组
      type: Array,
      default: () => []
    }
  },
  components: {},
  data() {
    return {
      fileList: [],
      acceptsList: [
        {
          id: 0,
          accept: '.pdf,'
        },
        {
          id: 1,
          accept: '.doc,.docx,.xls,.xlsx,pdf'
        },
        {
          id: 3,
          accept: '.jpg,.png'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {
    onRemove(file, fileList) {
      this.$emit('deleteFile', file, fileList);
    },
    onExceed() {
      this.$message.error(`文件最多上传${this.limit}个`);
    },
    onError() {
      this.$message.error(`文件上传失败，请重新上传`);
    },
    fileChange(file, fileList) {
      this.fileList.push(file.raw);
    },
    handleRemove(file, fileList) {
      this.fileList = [];
    },
    beforeUploadFile(file) {
      console.log('file......', file);
      // if (file.type != 'application/json') {
      //   this.$message.error('请上传格式为application/json的json文件');
      //   return;
      // }
      const size = file.size / 1024 / 1024 / 2;
      if (size > 2) {
        this.$message.error('文件大小必须小于2M');
      }
    }
  }
};
</script>
<style lang='scss' scoped>
/* @import url(); 引入css类 */
</style>
