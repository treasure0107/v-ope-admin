<!--
 * @Author: your name
 * @Description: In User Settings Edit
 * @FilePath: \rsh-operation-system-web\src\views\formLibrary\components\Steps2.vue
-->

<template>
  <div>
    <fm-making-form
      v-if="editVisible"
      ref="makingform"
      style="height: 660px;"
      preview
      upload
      clearable
      generate-code
      generate-json
    >
    </fm-making-form>
    <div
      v-else
      style="width:90%;height:96%;min-height:600px;"
    >
      <fm-generate-form
        :data="jsonData"
        :editData="editData"
        ref="generateForm"
      >
      </fm-generate-form>
    </div>
    <div class="btn-box">
      <el-button
        type="primary"
        @click="handleLast"
        class="btn"
      >上一步</el-button>
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
// import '@/assets/styles/formMaking.scss';
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
    }
  },
  data() {
    return {
      editData: {},
      fields: []
    };
  },
  computed: {},
  watch: {
    jsonData(val) {
      if (val) {
        if (this.editVisible) {
          this.$refs.makingform.setJSON(this.jsonData);
        } else {
          this.$nextTick(() => {
            this.$refs.generateForm.refresh();
            this.setAllFieldsDisabled();
          });
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
  },
  methods: {
    handleLast() {
      this.$emit('updateActive', 0);
    },
    handleNext() {
      this.fields = [];
      let data = {};
      let dataDefault = '';
      const isTemplate = this.$route.query.isTemplate;
      if (isTemplate != 3) {
        dataDefault = JSON.stringify(this.$refs.makingform.getJSON());
        data = JSON.parse(JSON.stringify(this.$refs.makingform.getJSON()));
      } else {
        dataDefault = JSON.stringify(this.jsonData);
        data = JSON.parse(JSON.stringify(this.jsonData));
      }
      if (!data.list.length) {
        this.$message.error(`请定义表单字段`);
        return;
      }
      this.generateModle(data.list);
      Bus.$emit('sendFormJson', data);
      Bus.$emit('sendFormJsonDefault', dataDefault);
      Bus.$emit('sendFields', this.fields);
      // const sendFieldsArr = window.sessionStorage.getItem('sendFieldsArr');
      // if (sendFieldsArr && JSON.stringify(this.fields) != sendFieldsArr) {
      //   this.$message.error(`表单设计存在修改流程每个节点需要重新定义节点字段！`);
      //   Bus.$emit('sendHandEmpty', true);
      // } else {
      //   Bus.$emit('sendHandEmpty', false);
      // }
      setTimeout(() => {
        this.$emit('updateActive', 2);
      }, 300);
    },
    // 设置表单所有字段--禁用
    setAllFieldsDisabled() {
      const arr = [];
      this.$refs.generateForm.getData().then(formData => {
        for (const key in formData) {
          arr.push(key);
        }
        this.$refs.generateForm.disabled(arr, true);
      });
    },
    // 表单数据处理方法
    generateModle(genList) {
      genList.map((item, key) => {
        if (item.type == 'grid') {
          item.columns.map(val => {
            this.generateModle(val.list);
          });
        } else if (item.type == 'report') {
          item.rows.map(val => {
            val.columns.map(i => {
              this.generateModle(i.list);
            });
          });
        } else {
          if (item.model) {
            const obj =
            {
              type: 'checkbox',
              icon: 'icon-check-box',
              options: {
                inline: false,
                defaultValue: [
                  '编辑'
                ],
                showLabel: true,
                options: [
                  {
                    value: '编辑',
                    label: ''
                  }
                ],
                required: false,
                requiredMessage: '',
                width: '',
                remote: false,
                remoteType: 'datasource',
                remoteOption: item.remoteOption,
                remoteOptions: [],
                props: {
                  value: 'value',
                  label: 'label'
                },
                remoteFunc: item.remoteFunc,
                customClass: '',
                labelWidth: 10,
                isLabelWidth: true,
                hidden: false,
                dataBind: true,
                disabled: this.disabledCellType == 1,
                hideLabel: false
              },
              events: {
                onChange: ''
              },
              name: '',
              key: item.key,
              model: item.model,
              rules: []
            };
            this.$set(genList, key, obj);
            // 初始话选中的字段
            const fieldsObj = {
              name: item.model,
              englishName: item.model,
              fieldType: 'stringType',
              length: 999,
              defaultValue: '',
              remark: '备注',
              standby: '',
              fieldStatus: 'enable',
              valueOrigin: 'fromUser'
            };
            this.fields.push(fieldsObj);
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
