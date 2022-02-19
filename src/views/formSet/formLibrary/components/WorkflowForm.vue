<!--
 * @Author: JTune
 * @Description: In User Settings Edit
 * @FilePath: \rsh-operation-system-web\src\views\formSet\formLibrary\components\WorkflowForm.vue
-->
<template>
  <div>
    <!--       :isShowHeader="false" -->
    <DyTable
      :keys="colKey"
      :multiActions="multiActions"
      :loading="loading"
      :fetchData="fetchData"
      :isPagination="true"
      :pagination='pagination'
      :list="tableData"
      :showCheckBox="false"
      @selectDataEvent="selectDataEvent"
    >
    </DyTable>

  </div>
</template>

<script>
import DyTable from '@/components/DyTable';
import { mapGetters } from 'vuex';
import Api from '@/api';
export default {
  name: '',
  components: { DyTable },
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      colKey: {
        flowName: '名称',
        updateDate: '最后更新时间'

      },
      multiActions: [
        {
          header: '操作',
          actions: [
            {
              width: '180px',
              label: '编辑',
              action: (row) => {
                this.handleEdit(row);
              }
            },
            {
              width: '180px',
              label: '删除',
              action: (row) => {
                this.handleDel(row);
              }
            }
            // {
            //   width: '90px',
            //   label: '移 动',
            //   action: (row) => {
            //     this.handleRemove(row);
            //   }
            // }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      'stationId'
    ])
  },
  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {
    fetchData() {
      const data = { ignoreTemplateData: true };
      this.$axios.post(Api.flow.list, {
        data,
        platformCode: '400001',
        formTemplateBizRelevance: { stationId: this.stationId },
        pagination: true,
        pages: this.pagination.pages,
        size: this.pagination.size
      }, (res) => {
        if (res.isSuccess) {
          const data = res.data;
          this.tableData = data;
          this.pagination.total = res.total;
        }
      });
    },
    handleDel(row) {
      const code = row.code;
      const id = row.id;
      this.countByFlowCode(code, id);
    },
    countByFlowCode(code, id) {
      const data = {
        flowCode: code
      };
      this.$axios.post(Api.flow.countByFlowCode, { data }, (res) => {
        if (res.isSuccess) {
          if (res.data > 0) {
            this.$message.error('已关联设备状态,不能删除！');
          } else {
            this.flowDel(id);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    flowDel(id) {
      const data = {
        data: {},
        flowTemplateIds: [],
        deleteReForm: true
      };
      data.flowTemplateIds.push(id);
      this.$axios.post(Api.flow.delete, data, (res) => {
        if (res.isSuccess) {
          this.$message.success(`删除成功`);
          this.fetchData();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    selectDataEvent(val) {
      this.$emit('handleSelectData', val);
    },

    handleEdit(row) {
      this.$router.push({ name: 'workflowEngine', query: { id: row.id, formType: 'flow', isTemplate: 3 }});
    },
    handleQuit() { },
    handleRemove() { }
  }
};
</script>
<style lang='scss' scoped>
/* @import url(); 引入css类 */
</style>
