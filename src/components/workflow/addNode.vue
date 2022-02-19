<!--
 * @Author: your name
 * @Date: 2021-08-27 09:32:54
 * @LastEditTime: 2021-10-25 17:08:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rsh-operation-system-web\src\views\formSet\workflowEngine\components\addNode.vue
-->
<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover
        placement="right-start"
        v-model="visible"
      >
        <div class="add-node-popover-body">
          <a
            class="add-node-popover-item approver"
            @click="addType(1)"
          >
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>审批人</p>
          </a>
          <a
            class="add-node-popover-item condition"
            @click="addType(4)"
          >
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>条件分支</p>
          </a>
        </div>
        <button
          class="btn"
          type="button"
          slot="reference"
        >
          <span class="iconfont"></span>
        </button>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  props: ['childNodeP'],

  data() {
    return {
      visible: false
    };
  },
  methods: {
    addType(type) {
      this.visible = false;
      if (type != 4) {
        var data;
        if (type == 1) {
          data = {
            nodeName: '审核人',
            error: false,
            type: 'common',
            settype: 1,
            selectMode: 0,
            selectRange: 0,
            directorLevel: 1,
            examineMode: 1,
            noHanderAction: 1,
            examineEndDirectorLevel: 0,
            childFlowNodeTemplate: this.childNodeP,
            nodeUserList: [],
            flowNodeAuditConfig: {
              auditType: '',
              flowNodeDetailConfigList: []
            },
            flowNodeFieldPowerTemplateList: []
          };
        }
        this.$emit('update:childNodeP', data);
      } else {
        this.$emit('update:childNodeP', {
          nodeName: '路由',
          type: 'condition',
          childFlowNodeTemplate: null,
          conditionNodes: [{
            nodeName: '条件1',
            error: false,
            type: 'common',
            strategyType: 'change',
            sort: 1,
            conditionList: [],
            nodeUserList: [],
            flowNodeAuditConfig: {
              auditType: '',
              flowNodeDetailConfigList: []
            },
            flowNodeFieldPowerTemplateList: [],
            childFlowNodeTemplate: this.childNodeP
          }, {
            nodeName: '条件2',
            error: false,
            type: 'common',
            strategyType: 'change',
            sort: 2,
            conditionList: [],
            nodeUserList: [],
            flowNodeAuditConfig: {
              auditType: '',
              flowNodeDetailConfigList: []
            },
            childFlowNodeTemplate: null
          }]
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
