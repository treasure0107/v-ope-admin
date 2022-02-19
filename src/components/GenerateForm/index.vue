<!--
 * @Author: JTune
 * @Date: 2021-08-17 10:07:10
 * @LastEditors: JTune
 * @LastEditTime: 2021-10-27 11:58:13
 * @Description: file content
-->
<template>
  <div>
    <fm-generate-form
      :data="jsonData"
      :edit="isEdit"
      @reset="handleReset"
      ref="generateForm"
      style="margin-left:10px"
    >
    </fm-generate-form>
  </div>
</template>

<script>
// import '@/assets/styles/formMaking.scss';
export default {
  data() {
    return {
      cacheJsonData: {}
    };
  },
  watch: {
    jsonData: {
      handler() {
      },
      immediate: true
    }
  },
  props: {
    jsonData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleGetData() {
      return this.$refs.generateForm.getData();
    },
    handleReset() {
      this.$refs.generateForm.reset();
    }
  },
  mounted() {
    console.log(this.jsonData);
  }
};
</script>
<style lang="scss" scoped>
</style>
