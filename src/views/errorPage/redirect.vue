<!--
 * @Descripttion:
 * @Author: JTune
 * @Date: 2021-01-12 15:41:23
-->
<script>
export default {
  created() {
    const { params, query } = this.$route;
    const { path } = params;
    this.$router.replace({ path: '/' + path, query });
  },
  render: function (h) {
    return h(); // avoid warning message
  }
};
</script>
