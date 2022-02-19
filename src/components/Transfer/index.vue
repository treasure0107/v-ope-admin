<!--
 * @Author: your name
 * @Date: 2021-08-16 10:01:09
 * @LastEditTime: 2021-08-16 14:55:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rsh-operation-system-web\src\components\Transfer\index.vue
-->
<template>
  <div>

    <el-transfer
      v-model="value"
      :props="{
      key: 'id',
      label: 'name'
    }"
      :data="transferList"
      filterable
      :filter-method="filterMethod"
      :titles="['未选择', '已选择']"
      @change="handleChange"
    >
    </el-transfer>
  </div>
</template>

<script>
export default {
  name: 'Transfer',
  components: {},
  props: {
    transferList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      transferData: [],
      value: []
    };
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {
    filterMethod(query, item) {
      return item && item.name.indexOf(query) > -1;
    },
    handleChange(value, direction, movedKeys) {
      console.log('value:', value, 'direction:', direction, 'movedKeys:', movedKeys);
    }
  }
};
</script>
<style lang='scss' scoped>
/* @import url(); 引入css类 */
::v-deep .el-transfer {
  .el-transfer-panel {
    width: 300px;
  }
  .el-transfer__buttons {
    .el-button {
      display: block;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  .el-transfer-panel:last-child{
    .el-input{
      // display: none;
    }
  }
}
</style>
