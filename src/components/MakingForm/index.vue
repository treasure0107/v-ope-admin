<!--
 * @Author: your name
 * @Date: 2021-08-11 14:32:42
 * @LastEditTime: 2021-08-11 14:55:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rsh-operation-system-web\src\views\formLibrary\components\Steps2.vue
-->

<template>
  <div>
    <fm-making-form
      v-if="editVisible"
      ref="makingform"
      style="height: 750px;"
      preview
      upload
      clearable
      generate-code
      generate-json
    >
    </fm-making-form>
    <div
      v-else
      style="width:100%;height:100%"
    >
      <fm-generate-form
        :data="jsonData"
        :editData="editData"
        ref="generateForm"
      >
      </fm-generate-form>
    </div>
  </div>

</template>

<script>
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
        return {

        };
      }
    }
  },
  data() {
    return {
      generateFormVisible: false,
      editData: {}
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
  methods: {}
};
</script>

<style scoped lang="scss">
</style>
