
<template>
  <div>
    <!--       :isShowHeader="false" -->
    <DyTable
      :keys="colKey"
      :multiActions="multiActions"
      :loading="loading"
      :fetchData="fetchData"
      :isPagination="true"
      :pagination="pagination"
      :list="tableData"
      :showCheckBox="true"
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
        name: '名称',
        updateDate: '最后更新时间'
        // isDelete: {
        //   label: '分组',
        //   handle: function (scope, createElement) {
        //     if (scope.row.isDelete) {
        //       return createElement('span', {
        //         style: {
        //           color: '#ff3d57'
        //         }
        //       }, '已');
        //     } else {
        //       return createElement('span', '否');
        //     }
        //   }
        // }
      },
      multiActions: [
        {
          header: '操作',
          actions: [
            {
              width: '180px',
              label: '编 辑',
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
            //   label: '停 用',
            //   action: (row) => {
            //     this.handleQuit(row);
            //   }
            // },
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
      this.$axios.post(Api.form.list, {
        data,
        formTemplateBizRelevance: { stationId: this.stationId },
        queryFormType: 'common_form',
        platformCode: '400001',
        ignoreTemplateData: true,
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
    selectDataEvent(val) {
      this.$emit('handleSelectData', val);
    },
    handleEdit(row) {
      this.$router.push({ name: 'formDesign', query: { id: row.id, formType: 'normal' }});
    },
    handleDel(row) {
      const code = row.code;
      const id = row.id;
      this.countByFlowCode(code, id);
    },
    countByFlowCode(code, id) {
      const data = {
        form: {
          code
        }
      };
      this.$axios.post(Api.form.getPlanByFormCode, { data }, (res) => {
        if (res.isSuccess) {
          if (res.data > 0) {
            this.$message.error('已关联场站计划,不能删除！');
          } else {
            this.formDel(id);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    formDel(id) {
      const data = {
        data: {},
        flowTemplateIds: []
      };
      data.flowTemplateIds.push(id);
      this.$axios.post(Api.form.delete, data, (res) => {
        if (res.isSuccess) {
          this.$message.success(`删除成功`);
          this.fetchData();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleQuit() { },
    handleRemove() { }
  }
};
</script>
<style lang='scss' scoped>
/* @import url(); 引入css类 */
</style>
