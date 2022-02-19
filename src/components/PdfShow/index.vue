<!--
 * @Author: your name
 * @Date: 2021-07-23 14:37:05
 * @LastEditTime: 2021-07-23 17:10:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\components\PdfShow\index.vue
-->
<template>
  <div
    :style="{'height': pdfHeight,'width': pdfWidth}"
    class="pdf_content"
  >
    <iframe
      :src="pdfShowUrl"
      frameborder="0"
      :style="{'height': '100%','width': pdfWidth}"
    ></iframe>
  </div>
</template>
<script>
import { pdfUrl } from '@/config/env.js';

export default {
  name: 'PdfShow',
  components: {
    // pdf
  },
  props: {
    pdfURLStr: {
      type: String
    },
    pdfHeight: {
      type: [Number, String],
      default: '100%'
    },
    pdfWidth: {
      type: [Number, String],
      default: '100%'
    }
  },
  data() {
    return {
      pdfShowUrl: ''
      // numPages: 1,
      // activeIndex: 0
    };
  },
  watch: {
    pdfURLStr: {
      handler(u) {
        if (/^(https:|http:)/gi.test(u)) {
          if (process.env.NODE_ENV == 'production') {
            this.pdfShowUrl = `/operation/web/viewer.html?file=${encodeURIComponent(u)}`;
          } else {
            this.pdfShowUrl = `/web/viewer.html?file=${encodeURIComponent(u)}`; // 本地、测试
          }
        } else {
          if (process.env.NODE_ENV == 'production') {
            this.pdfShowUrl = `/operation/web/viewer.html?file=${encodeURIComponent(pdfUrl + u)}`; // 生产
          } else {
            this.pdfShowUrl = `/web/viewer.html?file=${encodeURIComponent(pdfUrl + u)}`; // 本地、测试
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
  }
};
</script>
<style scoped lang="scss">
.pdf_content {
  overflow: hidden;
  border: 1px solid #e4e4e4;
  margin: 0px auto;
  border-radius: 5px;
  box-sizing: border-box;
}
</style>
