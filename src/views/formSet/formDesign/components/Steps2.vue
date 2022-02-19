<!--
 * @Author: your name
 * @Date: 2021-08-11 14:32:42
 * @LastEditTime: 2021-10-14 09:22:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rsh-operation-system-web\src\views\formLibrary\components\Steps2.vue
-->

<template>
  <div>
    <fm-making-form
      ref="makingform"
      style="height: 660px;"
      preview
      upload
      clearable
      generate-code
      generate-json
    >
    </fm-making-form>
    <!--    v-if="editVisible" -->
    <!-- <div
      v-else
      style="width:100%;height:96%"
    >
      <fm-generate-form
        :data="jsonData"
        :editData="editData"
        ref="generateForm"
      >
      </fm-generate-form>
    </div> -->
    <div class="btn-box">
      <el-button
        type="primary"
        @click="handleLast"
        class="btn"
      >上一步</el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
        class="btn"
      >提 交</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api';
import Bus from '@/bus';
import { mapGetters } from 'vuex';
export default {
  name: '',
  components: {},
  props: {
    editVisible: {
      type: Boolean,
      default: () => true
    },
    jsonData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editData: {},
      infoForm: {},
      fieldsTemplateList: []
    };
  },
  computed: {
    ...mapGetters([
      'stationId'
    ])
  },
  watch: {
    jsonData(val) {
      if (val) {
        if (this.editVisible) {
          this.$refs.makingform.setJSON(this.jsonData);
        } else {
          // this.$nextTick(() => {
          //   this.$refs.generateForm.refresh();
          // });
        }
      }
    }
  },
  created() { },
  mounted() {
    // 获取设计器配置的json数据
    // console.log(this.$refs.makingform.getJSON());
    // 设置设计器配置的json数据
    // console.log(this.$refs.makingform.setJSON());
    Bus.$on('sendInfoForm', (data) => {
      this.infoForm = JSON.parse(JSON.stringify(data));
    });
  },
  methods: {
    handleLast() {
      this.$emit('updateActive', 0);
    },
    handleSubmit() {
      const { name } = this.infoForm;
      const makingformJson = this.$refs.makingform.getJSON();
      if (!makingformJson.list.length) {
        this.$message.error(`请添加表单内容在提交`);
        return;
      }
      this.generateModle(makingformJson.list);
      const fieldsTemplateList = this.fieldsTemplateList;
      const data = {
        name,
        templateData: JSON.stringify(makingformJson),
        fieldsTemplateList
      };
      const isTemplate = this.$route.query.isTemplate;
      setTimeout(() => {
        if (this.id) {
          if (isTemplate == 1) {
            this.saveForm(data);
          } else {
            data.id = this.id;
            this.updateForm(data);
          }
        } else {
          this.saveForm(data);
        }
      }, 100);
    },
    // 创建表单
    saveForm(data) {
      this.$axios.post(Api.form.save, {
        data,
        formTemplateBizRelevance: { stationId: this.stationId }
      }, (res) => {
        if (res.isSuccess) {
          this.$router.push({ name: 'formLibrary' });
        }
      });
    },
    // 编辑表单
    updateForm(data) {
      this.$axios.post(Api.form.update, {
        data,
        formTemplateBizRelevance: { stationId: this.stationId }
      }, (res) => {
        if (res.isSuccess) {
          this.$router.push({ name: 'formLibrary' });
        }
      });
    },
    generateModle(genList) {
      genList.forEach(item => {
        if (item.type == 'grid') {
          item.columns.forEach(val => {
            this.generateModle(val.list);
          });
        } else if (item.type == 'report') {
          item.rows.forEach(val => {
            val.columns.forEach(i => {
              this.generateModle(i.list);
            });
          });
        } else {
          if (item.model) {
            const obj = {
              name: item.model,
              eName: item.model,
              fieldType: 'stringType',
              length: 999,
              defaultValue: '',
              remark: '备注',
              standby: '',
              fieldStatus: 'enable',
              valueOrigin: 'fromUser'

            };
            this.fieldsTemplateList.push(obj);
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.btn-box {
  padding-top: 16px;
  padding-bottom: 10px;
  text-align: center;
}
</style>
