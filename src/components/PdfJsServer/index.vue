<!--
 * @Descripttion:
 * @Author: you name
 * @Date: 2021-05-10 10:26:28
-->
<template>
  <div class="pdf_page">
    <iframe
      width="100%"
      height="700"
      scrolling="no"
      :src="serverUrl"
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    serverUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    };
  }
};
</script>

<style>
</style>
