<!--
 * @Descripttion:动态表格
 * @Author: you name
 * @Date: 2021-05-11 20:51:52
-->
<template>
  <div :class="{ 'dytable-view-container': true }">
    <!-- 自定义头部 搜索栏等 -->
    <div
      class="dytable-header mb-20"
      v-if="showHeader"
    >
      <slot name="header"></slot>
    </div>
    <div
      class="dytable-view-body"
      ref="dytableBody"
    >
      <el-table
        class="multipleTable-class"
        v-loading="loading"
        size="small"
        :max-height="maxTableHeight"
        element-loading-spinner="aaa"
        ref="multipleTable"
        :data="list"
        :stripe="isStripe"
        :border="isShowBorder"
        :show-header="isShowHeader"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%"
        @select="handleSelect"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="showSerial"
          label="序号"
          type="index"
          width="100"
        >
        </el-table-column>
        <el-table-column
          v-if="isDrag"
          width="55"
        >
          <i
            class="el-icon-rank sortable-move"
            style="font-size: 18px; cursor: pointer"
          ></i>
        </el-table-column>
        <el-table-column
          v-if="showCheckBox"
          type="selection"
          width="55"
        >
        </el-table-column>
        <template v-for="(value, key) in keys">
          <el-table-column
            :label="typeof value === 'string' ? value : value.label"
            :sortable="value.sortable != undefined ? value.sortable : sortable"
            :prop="key"
            :class-name="value.className"
            :key="'col' + key"
            :width="value.width || ''"
            :show-overflow-tooltip="value.showTooltip"
          >
            <!-- customStyle可以自定义样式，function传入scope，return { color: 'red' }; -->
            <template slot-scope="scope">
              <dyitem
                :style="value.customStyle ? value.customStyle(scope) : ''"
                v-if="value.handle"
                :render-item="(createElement) => value.handle(scope, createElement)"
              />
              <div v-else>{{ scope.row[key] }}</div>
            </template>
          </el-table-column>
        </template>
        <!-- 操作栏 -->
        <template v-for="(item, index) in multiActions">
          <el-table-column
            :key='index'
            :label="item.header"
            :class="'op'"
            :width="item.actions[0].width || ''"
          >
            <template slot-scope="scope">
              <div class="action-list">
                <template v-for="(action, index) in item.actions">
                  <el-button
                    v-if="!action.handle"
                    :class="item.class"
                    :key="'action' + index"
                    @click="
                      (e) => {
                        e.stopPropagation();
                        action.action(scope.row, e);
                      }
                    "
                    type="text"
                    size="small"
                    style="text-align: left"
                  >{{ action.label }}</el-button>
                  <dyitem
                    v-else
                    :key="'action' + index"
                    :render-item="
                      (createElement) => actionHandle(action, scope, createElement)
                    "
                    @click.native="
                      (e) => {
                        e.stopPropagation();
                        action.action(scope.row, e);
                      }
                    "
                  />
                  <!--     v-permission="action.permission" -->
                </template>
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          fixed="right"
          width="60"
          v-if="isShowConfigHeader"
        >
          <template slot="header">
            <i
              class="el-icon-s-grid h_icon"
              @click="handleConfigHeader"
            ></i>
          </template>
        </el-table-column>
        <!-- 无数据展示内容 -->
        <template slot="empty">
          <div
            class="dytable-view-empty"
            v-if="list.length <= 0 && !loading"
          >
            <p>{{ emptyText }}</p>
          </div>
        </template>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div
      class="dytable-view-paging"
      v-show="list.length > 0 && showPagination"
    >
      <el-pagination
        v-if="isPagination"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        background
        :current-page="pagination.pages"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSize"
        @current-change="handlePageCurrent"
        style="margin-top: 20px; text-align: right"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import Dyitem from './dyitem';
import { handlePageSize, handlePageCurrent } from './pageAction';

export default {
  components: {
    Dyitem
  },

  props: {
    maxTableHeight: {
      type: [String, Number],
      default: '1000'
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * table是否展示序号
     * @param {Boolean}
     * @example
     */
    showSerial: {
      type: Boolean,
      default: false
    },
    /**
     * table是否添加多选框列
     * @param {Boolean}
     * @example
     */
    showCheckBox: {
      type: Boolean,
      default: false
    },
    /**
     * table是否可以行拖拽
     * @param {Boolean}
     * @example
     */
    isDrag: {
      type: Boolean,
      default: false
    },
    /**
     * 是否展示头部 slot组件
     * @param {Boolean}
     * @example 可自行加入搜索框选项
     */
    showHeader: {
      type: Boolean,
      default: false
    },
    /**
     * table 数据
     * @param {Array}
     * @example 可自行加入搜索框选项
     */
    list: Array,
    /**
     * 是否添加分页器
     * @param {Boolean}
     * @example
     */
    isPagination: {
      type: Boolean,
      default: false
    },
    pagination: Object,
    /**
     * actions:自定义单列操作
     */
    // actions: {
    //   type: Array,
    //   default: () => []
    // },
    /**
     * multiActions:自定义多列操作
     */
    multiActions: {
      type: Array,
      default: () => []
    },
    /**
     * 是否展示表格边框
     * @param {Boolean}
     */
    isShowBorder: {
      type: Boolean,
      default: false
    },
    /**
     * 是否展示表格头
     * @param {Boolean}
     */
    isShowHeader: {
      type: Boolean,
      default: true
    },
    /**
 * 是否展示动态配置表格头按钮
 * @param {Boolean}
 */
    isShowConfigHeader: {
      type: Boolean,
      default: false
    },
    /**
     * 是否带斑马纹表格
     * @param {Boolean}
     */
    isStripe: {
      type: Boolean,
      default: false
    },
    /**
     * 是否展示分页器
     * @param {Boolean}
     */
    showPagination: {
      type: Boolean,
      default: true
    },
    /**
     * 是否显示排序
     * @param {Boolean}
     */
    sortable: {
      type: Boolean,
      default: false
    },
    /**
     * 排序方法
     * @param {Function}
     */
    changeSort: {
      type: Function,
      default: null
    },
    /**
     * table表头
     * @param {Object}
     * @example
     * keys个格式有两种
     * 1. 普通形式
     * {
     *   name: '名称',
     *   age: '年龄'
     * }
     * 2. 可以自定义的形式
     * {
     *   name: '名称',
     *   age: '年龄'
     *   dance: {
     *     label: '跳舞',
     *     handle: function(scope, createElement) {
     *        return createElement('h1', 'hello, world');
     *     }
     *   }
     * }
     *  @param {Object} label 表头名称
     *  @param {Boolean} sortable 是否展示排序
     *  @param {String} className 自定义class
     *  @param {String} width 自定义宽度
     *  @param {Function} handle 自定义rander函数
     */
    keys: {
      type: Object,
      default: () => ({})
    },
    /**
     * 数据请求方法
     * @param {Function}
     */
    fetchData: {
      type: Function,
      default: null
    },
    /**
     * 无数据时展示文案
     * @param {String}
     */
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    defaultFirstRowChecked: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    list(val, oldval) {
      if (this.defaultFirstRowChecked) {
        this.$refs.multipleTable.setCurrentRow(val[0]);
      }
    }
    // isDrag(val) {
    //   console.log(val);
    //   this.showDragButton = true;
    // }
  },
  data() {
    return {
      // 当前行是否被选中 默认未选中
      isCurrentRowChecked: false,
      // 是否能够关联构建（如果本身意见关联）--绑定按钮的disabled属性
      // disabled = !isAbleToConnect
      isAbleToConnect: false,
      // 当前选中列数据
      tableActiveRow: null,
      datas: [],
      selectDatas: []
      // showDragButton: false
    };
  },
  created() {
    this.fetchData();
  },

  mounted() {
    // this.$nextTick(function(){
    //   console.log(this.list)
    // });
    // console.log(this.defaultFirstRowChecked)
    // this.$refs.multipleTable.setCurrentRow(this.list[0])
  },

  updated() { },
  methods: {
    handleSizeChange(size) {
      // 切换每页显示的数量
      this.pagination.limit = size;
      this.fetchData();
    },
    handleIndexChange(current) {
      // 切换页码
      this.pagination.page = current;
      this.fetchData();
    },

    handleSelectionChange(val) {
      this.selectDatas = val;
      this.$emit('selectDataEvent', this.selectDatas);
    },
    handleClearSelection(val) {
      this.$refs.multipleTable.clearSelection();
    },

    handleSelect(select, row) {
      // console.log(select, row);
    },
    handleClick(row) {
      // console.log(row);
    },
    handlePageSize,

    handlePageCurrent,
    rowClick(row, event, column) {
      // 判断两个对象是否相等
      if (JSON.stringify(this.tableActiveRow) === JSON.stringify(row)) {
        this.isCurrentRowChecked = !this.isCurrentRowChecked;
      } else {
        this.tableActiveRow = row;
        this.isCurrentRowChecked = true;
      }
      if (this.isCurrentRowChecked) {
        this.isAbleToConnect = true;
      } else {
        this.isAbleToConnect = false;
      }
      this.$emit('tableRowClick', { row, isAbleToConnect: this.isAbleToConnect });
      this.$emit('rowClick', { row, event, column });
    },

    actionHandle(action, scope, createElement) {
      return action.handle(scope, createElement, this);
    },
    handleConfigHeader() {
      this.$emit('configHeader', this.selectDatas);
    }
  }
};
</script>

<style lang="scss">
.dytable-view-container {
  position: relative;
  min-height: 200px;
  margin-top: 10px;
  // padding: 0px 20px;
  box-sizing: border-box;
  .el-table__header th,
  .el-table__header tr {
    background-color: #f2f3f5 !important;
    color: #323233;
    font-size: 14px;
    font-weight: bold;
  }
  /* 设置表主体的高度 */

  // .el-table__body td,
  // .el-table__body th {
  //   padding: 6px;
  // }

  /* 设置表头的高度 */

  // .el-table__header td,
  // .el-table__header th {
  //   padding: 10px 0px;
  // }

  .el-table--mini td,
  .el-table--mini th {
    padding: 8px 0;
  }

  .dytable-view-body {
    flex-grow: 2;
    overflow-y: hidden;
  }
  .el-table .cell div,
  .el-table .cell span {
    text-overflow: ellipsis !important;
    overflow: hidden !important;
    white-space: nowrap !important;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: transparent;
  }
  .dytable-view-paging {
    margin-top: 20px;
  }
  .dytable-view-empty {
    img {
      margin-top: 50px;
      width: 100px;
    }
    p {
      line-height: normal;
    }
  }
  .h_icon {
    font-size: 23px;
    position: relative;
    top: 1px;
    cursor: pointer;
  }
  .el-button.danger {
    color: #fc1717;
  }
  // 拖拽
  .dragClass {
    background: rgba(160, 207, 255, 0.5) !important;
  }
  // 停靠
  .ghostClass {
    background: rgba(160, 207, 255, 0.5) !important;
  }
  // 选择
  .chosenClass:hover > td {
    background: rgba(140, 197, 255, 0.5) !important;
  }
}
</style>
