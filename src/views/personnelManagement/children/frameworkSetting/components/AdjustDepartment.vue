<!--  -->
<template>
  <el-dialog
    :visible="visible"
    title="调整部门"
    width="50%"
    :close-on-click-modal="false"
    class="adjust-department-dialog"
    @close='handleClose'
  >
    <el-tree
      :data="treeData"
      :props="defaultProps"
      :default-expand-all="true"
      :indent="10"
      node-key="id"
    >
      <span slot-scope="{node,data}">
        <el-radio
          v-model="chooseDepart"
          :label="data.id"
          v-if="data.parentId"
        ><span></span></el-radio>
        <span>{{node.label}}</span>
      </span>
    </el-tree>
    <span slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        type="primary"
        @click="postAdjustDepartment"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api';
export default {
  name: '',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    selectRow: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      chooseDepart: '',
      defaultProps: {
        // 放开
        children: 'childrenList',
        // children: 'children',
        label(data) {
          return data.name;
        }
      }
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
    postAdjustDepartment() {
      const choseObj = this.getChidlren(this.chooseDepart, this.treeData);
      this.$axios.post(
        Api.frameworkInfo.adjustDepartment,
        {
          data: {
            companyId: choseObj.parentId,
            departmentId: choseObj.id,
            id: this.selectRow.id
          }
        },
        res => {
          if (res.isSuccess) {
            this.$message.success('调整成功！');
            this.$emit('update:visible', false);
            // 导入后重新获取该部门人员信息-更新岗位人数
            this.$emit('reGetPersonInfo');
            this.$emit('reGetDutyInfo');
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    getChidlren(id, data) {
      var hasFound = false; // 表示是否有找到id值
      var result = null;
      function fn(data) {
        if (Array.isArray(data) && !hasFound) { // 判断是否是数组并且没有的情况下，
          data.forEach(item => {
            if (item.id === id) { // 数据循环每个子项，并且判断子项下边是否有id值
              result = item; // 返回的结果等于每一项
              hasFound = true; // 并且找到id值
            } else if (item.childrenList) {
              fn(item.childrenList); // 递归调用下边的子项
            }
          });
        }
      }
      fn(data);
      return result;
    }
  }
};

</script>
<style lang='scss' scoped>
.adjust-department-dialog {
  & ::v-deep.el-radio {
    margin-right: 0px;
  }
}
</style>
