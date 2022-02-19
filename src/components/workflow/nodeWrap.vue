<template>
  <div>
    <div
      class="node-wrap"
      v-if="nodeConfig.type!='condition'"
    >
      <div
        class="node-wrap-box"
        :class="(nodeConfig.type=='start'?'start-node ':'')+(isTried&&nodeConfig.error?'active error':'')"
      >
        <div>
          <div
            class="title"
            :class="{'titActive':nodeConfig.type =='start','titActive':nodeConfig.type =='common','titActiveEnd':nodeConfig.type =='end'}"
          >
            <span
              class="iconfont"
              v-show="nodeConfig.type=='common'"
            ></span>
            <span
              class="iconfont"
              v-show="nodeConfig.type=='end'"
            ></span>
            <!-- <span v-if="nodeConfig.type==0">{{nodeConfig.nodeName}}</span> -->
            <input
              type="text"
              class="ant-input editable-title-input"
              v-if="isInput"
              @blur="blurEvent()"
              @focus="$event.currentTarget.select()"
              v-model="nodeConfig.nodeName"
              :placeholder="placeholderList[nodeConfig.type]"
            >
            <span
              class="editable-title"
              @click="clickEvent()"
              v-if="!isInput"
            >{{nodeConfig.nodeName}}</span>
            <i
              class="anticon anticon-close close"
              v-if="nodeConfig.type!='start'"
              @click="delNode()"
            ></i>
          </div>
          <div
            class="content"
            @click="setPerson(1)"
          >
            <div class="text">
              <span>发起人自选</span>
            </div>
            <i class="anticon anticon-right arrow"></i>
          </div>
          <div
            class="error_tip"
            v-if="isTried&&nodeConfig.error"
          >
            <i
              class="anticon anticon-exclamation-circle"
              style="color: rgb(242, 86, 67);"
            ></i>
          </div>
        </div>
      </div>
      <addNode :childNodeP.sync="nodeConfig.childFlowNodeTemplate"></addNode>
    </div>
    <div
      class="branch-wrap"
      v-if="nodeConfig.type=='condition'"
    >
      <div class="branch-box-wrap">
        <div class="branch-box">
          <button
            class="add-branch"
            @click="addTerm"
          >添加条件</button>
          <div
            class="col-box"
            v-for="(item,index) in nodeConfig.conditionNodes"
            :key="index"
          >
            <div class="condition-node">
              <div class="condition-node-box">
                <div
                  class="auto-judge"
                  :class="isTried&&item.error?'error active':''"
                >
                  <div
                    class="sort-left"
                    v-if="index!=0"
                    @click="arrTransfer(index,-1)"
                  >&lt;</div>
                  <div class="title-wrapper">
                    <!--      v-focus -->
                    <template v-if="item.type">
                      <input
                        type="text"
                        class="ant-input editable-title-input"
                        v-if="isInputList[index]"
                        @blur="blurEvent(index)"
                        @focus="$event.currentTarget.select()"
                        v-model="item.nodeName"
                      >
                      <span
                        class="editable-title"
                        @click="clickEvent(index)"
                        v-if="!isInputList[index]"
                      >
                        {{item.nodeName}}
                      </span>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        class="ant-input editable-title-input"
                        v-if="isInputList[index]"
                        @blur="blurEvent(index)"
                        @focus="$event.currentTarget.select()"
                        v-model="item.name"
                      >
                      <span
                        class="editable-title"
                        @click="clickEvent(index)"
                        v-if="!isInputList[index]"
                      >
                        {{item.name}}
                      </span>
                    </template>
                    <span
                      class="priority-title"
                      @click="setPerson(item.sort)"
                    >优先级{{item.sort}}</span>
                    <i
                      class="anticon anticon-close close"
                      @click="delTerm(index)"
                    ></i>
                  </div>
                  <!-- <div
                    class="sort-right"
                    v-if="index!=nodeConfig.conditionNodes.length-1"
                    @click="arrTransfer(index)"
                  >&gt;</div> -->
                  <!-- <div
                    class="content"
                    @click="setPerson(item.sort)"
                  >{{conditionStr(item,index)}}</div> -->
                  <div
                    class="content"
                    @click="setPerson(item.sort)"
                  >设置条件</div>
                  <div
                    class="error_tip"
                    v-if="isTried&&item.error"
                  >
                    <i
                      class="anticon anticon-exclamation-circle"
                      style="color: rgb(242, 86, 67);"
                    ></i>
                  </div>
                </div>
                <addNode :childNodeP.sync="item.childFlowNodeTemplate"></addNode>
              </div>
            </div>
            <nodeWrap
              v-if="item.childFlowNodeTemplate && item.childFlowNodeTemplate"
              :nodeConfig.sync="item.childFlowNodeTemplate"
              :isTried.sync="isTried"
              :jsonData.sync="jsonData"
              :fields.sync="fields"
              :roleList.sync="roleList"
              :personList.sync="personList"
            ></nodeWrap>
            <div
              class="top-left-cover-line"
              v-if="index==0"
            ></div>
            <div
              class="bottom-left-cover-line"
              v-if="index==0"
            ></div>
            <div
              class="top-right-cover-line"
              v-if="index==nodeConfig.conditionNodes.length-1"
            ></div>
            <div
              class="bottom-right-cover-line"
              v-if="index==nodeConfig.conditionNodes.length-1"
            ></div>
          </div>
        </div>
        <addNode :childNodeP.sync="nodeConfig.childFlowNodeTemplate"></addNode>
      </div>
    </div>
    <nodeWrap
      v-if="nodeConfig.childFlowNodeTemplate && nodeConfig.childFlowNodeTemplate"
      :nodeConfig.sync="nodeConfig.childFlowNodeTemplate"
      :isTried.sync="isTried"
      :jsonData.sync="jsonData"
      :fields.sync="fields"
      :roleList.sync="roleList"
      :personList.sync="personList"
    ></nodeWrap>
    <!-- 审批人设置弹窗 -->
    <el-drawer
      :append-to-body="true"
      title="审批人设置"
      :visible.sync="approverDrawer"
      direction="rtl"
      class="set_promoter"
      size="600px"
      :before-close="handleCloseApprover"
      :wrapperClosable="false"
      :destroy-on-close="true"
    >
      <div class="demo-drawer__content">
        <div class="drawer_content">
          <div class="approver_content">
            <el-radio-group
              v-model="flowNodeAuditConfig.auditType"
              class="clear"
              @change="changeType"
            >
              <!-- <el-radio :label="4">发起人自选</el-radio>
              <el-radio :label="1">选择人员</el-radio>
              <el-radio :label="2">角色</el-radio>
              <el-radio :label="5">发起人自己</el-radio> -->
              <!-- <el-radio :label="'optional'">发起人自选</el-radio> -->
              <el-radio :label="'assign'">选择人员</el-radio>
              <el-radio :label="'role'">角色</el-radio>
              <el-radio
                :label="'run_node_choose'"
                v-if="nodeConfig.type!='start'"
              >审批人自选</el-radio>
              <el-radio
                :label="'initiator'"
                v-if="nodeConfig.type!='start'"
              >发起人自己</el-radio>
            </el-radio-group>
          </div>
          <div class="approver_content">
            <el-button
              type="primary"
              @click="handleNodeAttr"
            >定义节点字段</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="handleAddPerson"
              v-if="flowNodeAuditConfig.auditType=='assign'"
            >添加人员</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              v-if="flowNodeAuditConfig.auditType=='role'"
              @click="handleAddRole"
            >添加角色</el-button>
            <div
              class="check-con"
              v-if="checkboxData.length!=0"
            >
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in checkboxData"
                closable
                :disable-transitions="false"
                @close="handleCloseTag(tag,index)"
              >
                {{tag.name}}
              </el-tag>
            </div>
          </div>

        </div>
        <div class="demo-drawer__footer clear">
          <el-button
            type="primary"
            @click="saveApprover"
          >确 定</el-button>
          <el-button @click="handleCloseApprover">取 消</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 条件设置弹窗 -->
    <el-drawer
      :append-to-body="true"
      title="条件设置"
      :visible.sync="conditionDrawer"
      direction="rtl"
      class="condition_copyer"
      size="550px"
      :before-close="saveCondition"
      :wrapperClosable="false"
      :destroy-on-close="true"
    >
      <div class="demo-drawer__content">
        <div class="condition_content drawer_content">
          <div class="approver_content">
            <el-button
              type="primary"
              @click="handleConditionAttr"
            >定义条件字段</el-button>
          </div>
        </div>
        <div class="demo-drawer__footer clear">
          <el-button
            type="primary"
            @click="saveCondition"
          >确 定</el-button>
          <el-button @click="conditionDrawer = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 定义节点字段   fullscreen -->
    <el-dialog
      title="定义节点字段"
      append-to-body
      center
      width="1100px"
      :visible.sync="dialogVisibleNodeAttr"
      :before-close="handleCloseNodeAttr"
      :close-on-click-modal="false"
      :destroy-on-close="false"
    >
      <div class="has-auth-content">
        <div class="has-auth-con-right">
          <div class="h-tit">表单</div>
          <fm-generate-form
            :data="jsonData"
            :value="editData"
            @on-change="onInputChange"
            ref="generateForm"
          ></fm-generate-form>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="handleSureNodeAtrr"
          :disabled="isClick"
        >提 交</el-button>
      </span>
    </el-dialog>
    <!-- 选择人员 -->
    <el-dialog
      title="选择人员"
      append-to-body
      center
      width="600px"
      :visible.sync="dialogVisibleFlowRerson"
      :before-close="handleCloseFlowRole"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div class="has-auth-content">
        <div class="has-auth-con-right">
          <div class="h-tit">
            <el-checkbox
              class="mt-10"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
          </div>
          <div class="checkbox-con scroll-bar">
            <el-checkbox-group v-model="checkboxRersonGroup">
              <!--  default-expand-all    @change="changeCheckbox(item)"-->
              <p
                v-for="(item, index) in personList"
                :key="index"
                @change="handleCheckedPreson(item)"
              >
                <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
              </p>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="handleSureFlowRerson"
          :disabled="isClick"
        >提 交</el-button>
      </span>
    </el-dialog>
    <!-- 选择角色 -->
    <el-dialog
      title="选择角色"
      append-to-body
      center
      width="600px"
      :visible.sync="dialogVisibleFlowRole"
      :before-close="handleCloseFlowRole"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div class="has-auth-content">
        <div class="has-auth-con-right">
          <div class="h-tit">选择角色</div>
          <div class="checkbox-con scroll-bar">
            <el-radio-group v-model="radioRole">
              <p
                v-for="(item, index) in roleList"
                :key="index"
                @change="handleCheckedRole(item)"
              >
                <el-radio :label="item.id">{{ item.name }}</el-radio>
              </p>
            </el-radio-group>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="handleSureFlowRole"
          :disabled="isClick"
        >提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Api from '@/api';
export default {
  props: ['nodeConfig', 'isTried', 'jsonData', 'fields', 'roleList', 'personList'],
  data() {
    return {
      id: '',
      checkAll: false,
      checkboxGroup: [],
      radioRole: '',
      checkboxData: [],
      checkboxRersonGroup: [],
      dialogVisibleNodeAttr: false,
      dialogVisibleFlowRole: false,
      dialogVisibleFlowRerson: false,
      editData: {},
      isClick: false,
      flowNodeAuditConfig: {
        auditType: '',
        flowNodeDetailConfigList: []
      },
      sort: 0,
      disabledCellType: 0,
      conditionRadio: 0,
      placeholderList: ['发起人', '审核人', '抄送人'],
      isInputList: [],
      isInput: false,
      approverDrawer: false,
      roles: [],
      conditionDrawer: false,
      conditionVisible: false,
      conditionConfig: {},
      conditionsConfig: {
        conditionNodes: []
      },
      conditions: [],
      conditionList: [],
      conditionType: ''
    };
  },
  created() { },
  mounted() { },
  methods: {
    handleCheckedRole(val) {
      // this.checkboxData = [];
      // this.checkboxData.push(val);
    },
    handleCheckedPreson(val) {
      if (this.checkboxRersonGroup.length == this.personList.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    handleCloseTag(val, index) {
      this.checkboxData.splice(index, 1);
    },
    handleCheckAllChange(val) {
      if (this.checkAll) {
        this.checkboxRersonGroup = this.personList.map(item => {
          return item.id;
        });
      } else {
        this.checkboxRersonGroup = [];
      }
    },
    // 定义节点字段
    handleNodeAttr() {
      this.isClick = false;
      const { flowNodeFieldPowerTemplateList } = this.nodeConfig;
      this.fields.map(item => {
        this.editData[item.englishName] = false;
      });
      flowNodeFieldPowerTemplateList && flowNodeFieldPowerTemplateList.forEach(item => {
        // this.editData[item.formFieldTemplateEnglishName] = true;
        this.$set(this.editData, item.formFieldTemplateEnglishName, true);
      });
      this.dialogVisibleNodeAttr = true;
      this.$nextTick(() => {
        this.$refs.generateForm.refresh();
        flowNodeFieldPowerTemplateList.forEach(item => {
          this.$set(this.editData, item.formFieldTemplateEnglishName, true);
        });
      });
    },
    // 定义条件字段
    handleConditionAttr() {
      const { conditionNodes } = this.nodeConfig;
      const conditionList = conditionNodes[this.sort].conditionList;
      this.fields.map(item => {
        this.editData[item.englishName] = false;
      });
      conditionList.forEach(item => {
        // this.editData[item.fieldaName] = true;
        this.$set(this.editData, item.fieldaName, true);
      });
      this.dialogVisibleNodeAttr = true;
      this.$nextTick(() => {
        this.$refs.generateForm.refresh();
        conditionList.forEach(item => {
          this.$set(this.editData, item.fieldaName, true);
        });
      });
    },
    getConditionAttr() {

    },
    onInputChange(value) {
      // console.log('value', value);
    },
    handleCloseNodeAttr() {
      this.$nextTick(() => {
        this.$refs.generateForm.refresh();
      });
      this.dialogVisibleNodeAttr = false;
    },
    // 定义节点字段弹窗确认按钮
    handleSureNodeAtrr() {
      const { type } = this.nodeConfig;
      this.isClick = true;
      const formValue = this.$refs.generateForm.getValues();
      // 节点选中的字段
      const flowNodeFieldPowerTemplateList = [];
      const conditionList = [];
      if (type == 'condition') {
        const conditionNodes = JSON.parse(JSON.stringify(this.nodeConfig.conditionNodes));
        for (const key in formValue) {
          const obj = {
            conditionType: 'and',
            fieldaName: '',
            fieldbName: '',
            judge: 'is_not_null'
          };
          if (formValue[key]) {
            obj.fieldaName = key;
            conditionList.push(obj);
          }
        }
        const len = conditionList.length - 1;
        conditionList[len].conditionType = null;
        this.conditionList = conditionList;
        conditionNodes[this.sort].conditionList = conditionList;
        this.nodeConfig.conditionNodes = conditionNodes;
      } else {
        for (const key in formValue) {
          const obj = {
            fieldPower: 'edit'
          };
          if (formValue[key]) {
            obj.formFieldTemplateEnglishName = key;
            flowNodeFieldPowerTemplateList.push(obj);
          }
          // this.$set(this.selectFormList[0].editData, key, formValue[key]);
        }
        this.nodeConfig.flowNodeFieldPowerTemplateList = flowNodeFieldPowerTemplateList;
        // this.$emit('update:nodeConfig', this.nodeConfig);
      }
      setTimeout(() => {
        this.isClick = false;
      }, 600);
      // this.dialogVisibleNodeAttr = false;
      this.handleCloseNodeAttr();
    },
    // 表单数据处理方法
    generateModle(genList) {
      genList.map((item, key) => {
        if (item.type == 'grid') {
          item.columns.map(val => {
            this.generateModle(val.list);
          });
        } else if (item.type == 'report') {
          item.rows.map(val => {
            val.columns.map(i => {
              this.generateModle(i.list);
            });
          });
        } else {
          if (item.model) {
            const obj =
            {
              type: 'checkbox',
              icon: 'icon-check-box',
              options: {
                inline: false,
                defaultValue: [
                  '编辑'
                ],
                showLabel: true,
                options: [
                  {
                    value: '编辑',
                    label: ''
                  }
                ],
                required: false,
                requiredMessage: '',
                width: '',
                remote: false,
                remoteType: 'datasource',
                remoteOption: item.remoteOption,
                remoteOptions: [],
                props: {
                  value: 'value',
                  label: 'label'
                },
                remoteFunc: item.remoteFunc,
                customClass: '',
                labelWidth: 10,
                isLabelWidth: true,
                hidden: false,
                dataBind: true,
                disabled: this.disabledCellType == 1,
                hideLabel: false
              },
              events: {
                onChange: ''
              },
              name: '',
              key: item.key,
              model: item.model,
              rules: []
            };
            this.$set(genList, key, obj);
            // 初始话选中的字段
            const fieldsObj = {
              name: item.model,
              englishName: item.model,
              fieldType: 'stringType',
              length: 999,
              defaultValue: '',
              remark: '备注',
              standby: '',
              fieldStatus: 'enable',
              valueOrigin: 'fromUser'
            };
            this.fields.push(fieldsObj);
          }
        }
      });
    },
    handleCloseFlowRole() {
      this.radioRole = '';
      this.dialogVisibleFlowRole = false;
      this.dialogVisibleFlowRerson = false;
    },
    // 角色
    handleSureFlowRole() {
      this.checkboxData = this.roleList.filter(item => item.id == this.radioRole);
      this.isClick = true;
      setTimeout(() => {
        this.isClick = false;
      }, 600);
      this.dialogVisibleFlowRole = false;
    },
    // 人员
    handleSureFlowRerson() {
      const list = [];
      this.personList.map(item => {
        this.checkboxRersonGroup.map(param => {
          if (item.id == param) {
            list.push(item);
          }
        });
      });
      this.checkboxData = list;
      this.isClick = true;
      setTimeout(() => {
        this.isClick = false;
      }, 600);
      this.dialogVisibleFlowRerson = false;
    },
    // 输入框事件
    clickEvent(index) {
      if (index || index === 0) {
        this.$set(this.isInputList, index, true);
      } else {
        this.isInput = true;
      }
    },
    blurEvent(index) {
      if (index || index === 0) {
        this.$set(this.isInputList, index, false);
        this.nodeConfig.conditionNodes[index].nodeName = this.nodeConfig.conditionNodes[index].nodeName ? this.nodeConfig.conditionNodes[index].nodeName : '条件';
      } else {
        this.isInput = false;
        this.nodeConfig.nodeName = this.nodeConfig.nodeName ? this.nodeConfig.nodeName : this.placeholderList[this.nodeConfig.type];
      }
    },
    conditionStr(item, index) {
      var { conditionList, nodeUserList } = item;
      if (conditionList.length == 0) {
        return (index == this.nodeConfig.conditionNodes.length - 1) && this.nodeConfig.conditionNodes[0].conditionList.length != 0 ? '其他条件进入此流程' : '请设置条件';
      } else {
        let str = '';
        for (var i = 0; i < conditionList.length; i++) {
          var { columnId, columnType, showType, showName, optType, zdy1, opt1, zdy2, opt2, fixedDownBoxValue } = conditionList[i];
          if (columnId == 0) {
            if (nodeUserList.length != 0) {
              str += '发起人属于：';
              str += nodeUserList.map(item => { return item.name; }).join('或') + ' 并且 ';
            }
          }
          if (columnType == 'String' && showType == '3') {
            if (zdy1) {
              str += showName + '属于：' + this.dealStr(zdy1, JSON.parse(fixedDownBoxValue)) + ' 并且 ';
            }
          }
          if (columnType == 'Double') {
            if (optType != 6 && zdy1) {
              var optTypeStr = ['', '<', '>', '≤', '=', '≥'][optType];
              str += `${showName} ${optTypeStr} ${zdy1} 并且 `;
            } else if (optType == 6 && zdy1 && zdy2) {
              str += `${zdy1} ${opt1} ${showName} ${opt2} ${zdy2} 并且 `;
            }
          }
        }
        return str ? str.substring(0, str.length - 4) : '请设置条件';
      }
    },
    dealStr(str, obj) {
      const arr = [];
      const list = str.split(',');
      for (var elem in obj) {
        list.map(item => {
          if (item == elem) {
            arr.push(obj[elem].value);
          }
        });
      }
      return arr.join('或');
    },
    addCondition() {
      this.conditionList = [];
      this.conditionVisible = true;
    },
    changeOptType(item) {
      if (item.optType == 1) {
        item.zdy1 = 2;
      } else {
        item.zdy1 = 1;
        item.zdy2 = 2;
      }
    },
    saveCondition() {
      this.$refs.generateForm.refresh();
      this.conditionDrawer = false;
      // const { conditionNodes } = this.nodeConfig;
      // var a = this.conditionsConfig.conditionNodes.splice(this.bPriorityLevel - 1, 1);// 截取旧下标
      // this.conditionsConfig.conditionNodes.splice(this.conditionConfig.sort - 1, 0, a[0]);// 填充新下标
      // this.conditionsConfig.conditionNodes.map((item, index) => {
      //   item.sort = index + 1;
      // });
      // for (var i = 0; i < this.conditionsConfig.conditionNodes.length; i++) {
      //   this.conditionsConfig.conditionNodes[i].error = this.conditionStr(this.conditionsConfig.conditionNodes[i], i) == '请设置条件' && i != this.conditionsConfig.conditionNodes.length - 1;
      // }
      // this.$emit('update:nodeConfig', this.conditionsConfig);
    },
    handleAddRole() {
      this.radioRole = '';
      this.dialogVisibleFlowRole = true;
    },
    handleAddPerson() {
      // this.checkboxRersonGroup = [];
      this.dialogVisibleFlowRerson = true;
    },
    // 审批人设置
    changeType(val) {
      this.checkboxData = [];
      this.flowNodeAuditConfig.auditType = val;
    },
    saveApprover() {
      // this.$emit('update:nodeConfig', this.approverConfig);
      const { flowNodeFieldPowerTemplateList } = this.nodeConfig;
      const list = [];
      this.checkboxData && this.checkboxData.map(item => {
        const obj = {};
        obj.bizId = item.id;
        list.push(obj);
      });
      this.flowNodeAuditConfig.flowNodeDetailConfigList = list;
      this.nodeConfig.flowNodeAuditConfig = this.flowNodeAuditConfig;
      if (!this.flowNodeAuditConfig.auditType) {
        this.$message.error(`请选择审批类型`);
        return;
      } else if (this.flowNodeAuditConfig.auditType == 'role' && !this.flowNodeAuditConfig.flowNodeDetailConfigList.length) {
        this.$message.error(`审批类型为选择角色时请添加角色`);
        return;
      } else if (this.flowNodeAuditConfig.auditType == 'assign' && !this.flowNodeAuditConfig.flowNodeDetailConfigList.length) {
        this.$message.error(`审批类型为选择人员时请添加人员`);
        return;
      } else if (!flowNodeFieldPowerTemplateList.length) {
        this.$message.error(`请定义节点字段`);
        return;
      }
      setTimeout(() => {
        this.handleCloseApprover();
      }, 300);
    },
    setPerson(sort) {
      const { type } = this.nodeConfig;
      this.checkboxData = [];
      this.checkboxData.length = 0;
      if (type == 'condition') {
        if (sort < 1) {
          this.sort = sort;
        } else {
          this.sort = sort - 1;
        }
        this.conditionDrawer = true;
      } else {
        this.flowNodeAuditConfig = this.nodeConfig.flowNodeAuditConfig;
        const checkboxData = this.flowNodeAuditConfig.flowNodeDetailConfigList;
        if (this.flowNodeAuditConfig.auditType == 'role' && checkboxData.length) {
          this.setNodeRole(checkboxData);
        } else if (this.flowNodeAuditConfig.auditType == 'assign' && checkboxData.length) {
          this.setNodePerson(checkboxData);
        }
        this.approverDrawer = true;
      }
    },
    setNodeRole(checkboxList) {
      const list = [];
      this.roleList.map(param => {
        if (checkboxList[0].bizId == param.id) {
          list.push(param);
        }
      });
      this.checkboxData = list;
    },
    setNodePerson(checkboxList) {
      const list = [];
      checkboxList.map(item => {
        this.personList.map(param => {
          if (item?.bizId == param.id) {
            item.name = param.name;
            list.push(param);
          }
        });
      });
      this.checkboxData = list;
      if (!this.personList.length) {
        this.getFlowPerson(checkboxList);
      }
    },
    getFlowPerson(checkboxList) {
      const data = {
        customerCode: this.$store.state.user.customerCode
      };
      this.$axios.post(Api.flowPerson.findAllByPlatformCode, {
        data
      }, (res) => {
        if (res.isSuccess) {
          const list = [];
          const personList = res.data || [];
          checkboxList.map(item => {
            personList.map(param => {
              if (item?.bizId == param.id) {
                item.name = param.name;
                list.push(item);
              }
            });
          });
          this.checkboxData = list;
        }
      });
    },
    handleCloseApprover() {
      this.approverDrawer = false;
      this.flowNodeAuditConfig = {
        auditType: '',
        flowNodeDetailConfigList: []
      };
      this.checkboxData = [];
    },
    arrToStr(arr) {
      if (arr) {
        return arr.map(item => { return item.name; }).toString();
      }
    },
    toggleStrClass(item, key) {
      const a = item.zdy1 ? item.zdy1.split(',') : [];
      return a.some(item => { return item == key; });
    },
    toStrChecked(item, key) {
      const a = item.zdy1 ? item.zdy1.split(',') : [];
      var isIncludes = this.toggleStrClass(item, key);
      if (!isIncludes) {
        a.push(key);
        item.zdy1 = a.toString();
      } else {
        this.removeStrEle(item, key);
      }
    },
    removeStrEle(item, key) {
      const a = item.zdy1 ? item.zdy1.split(',') : [];
      var includesIndex;
      a.map((item, index) => {
        if (item == key) {
          includesIndex = index;
        }
      });
      a.splice(includesIndex, 1);
      item.zdy1 = a.toString();
    },
    toggleClass(arr, elem, key = 'id') {
      return arr.some(item => { return item[key] == elem[key]; });
    },
    toChecked(arr, elem, key = 'id') {
      var isIncludes = this.toggleClass(arr, elem, key);
      !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
    },
    removeEle(arr, elem, key = 'id') {
      var includesIndex;
      arr.map((item, index) => {
        if (item[key] == elem[key]) {
          includesIndex = index;
        }
      });
      arr.splice(includesIndex, 1);
    },
    delNode() {
      this.$emit('update:nodeConfig', this.nodeConfig.childFlowNodeTemplate);
    },
    addTerm() {
      const len = this.nodeConfig.conditionNodes.length + 1;
      this.nodeConfig.conditionNodes.push({
        nodeName: '条件' + len,
        type: 3,
        sort: len,
        strategyType: 'change',
        conditionList: [],
        nodeUserList: [],
        flowNodeAuditConfig: {
          auditType: '',
          flowNodeDetailConfigList: []
        },
        childFlowNodeTemplate: null
      });
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == '请设置条件' && i != this.nodeConfig.conditionNodes.length - 1;
      }
      this.$emit('update:nodeConfig', this.nodeConfig);
    },
    delTerm(index) {
      this.nodeConfig.conditionNodes.splice(index, 1);
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == '请设置条件' && i != this.nodeConfig.conditionNodes.length - 1;
      }
      this.$emit('update:nodeConfig', this.nodeConfig);
      if (this.nodeConfig.conditionNodes.length == 1) {
        if (this.nodeConfig.childFlowNodeTemplate) {
          if (this.nodeConfig.conditionNodes[0].childFlowNodeTemplate) {
            this.reData(this.nodeConfig.conditionNodes[0].childFlowNodeTemplate, this.nodeConfig.childFlowNodeTemplate);
          } else {
            this.nodeConfig.conditionNodes[0].childFlowNodeTemplate = this.nodeConfig.childFlowNodeTemplate;
          }
        }
        this.$emit('update:nodeConfig', this.nodeConfig.conditionNodes[0].childFlowNodeTemplatechildFlowNodeTemplate);
      }
    },
    reData(data, addData) {
      if (!data.childFlowNodeTemplate) {
        data.childFlowNodeTemplate = addData;
      } else {
        this.reData(data.childFlowNodeTemplate, addData);
      }
    },
    arrTransfer(index, type = 1) { // 向左-1,向右1
      this.nodeConfig.conditionNodes[index] = this.nodeConfig.conditionNodes.splice(index + type, 1, this.nodeConfig.conditionNodes[index])[0];
      this.nodeConfig.conditionNodes.map((item, index) => {
        item.sort = index + 1;
      });
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == '请设置条件' && i != this.nodeConfig.conditionNodes.length - 1;
      }
      this.$emit('update:nodeConfig', this.nodeConfig);
    }
  }
};
</script>
<style lang='scss' scoped>
.checkbox-con {
  min-height: 400px;
  p {
    margin-top: 15px;
  }
}
.check-con {
  padding-bottom: 20px;
  > span {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.scroll-bar {
  max-height: 600px;
  overflow: auto;
  &::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }
  &::-webkit-scrollbar {
    width: 9px;
  }
  &::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
}
.titActiveStart {
  background-color: rgb(87, 106, 149) !important;
}
.titActive {
  background-color: rgb(255, 148, 62) !important;
}
.titActiveEnd {
  background-color: rgb(50, 150, 250) !important;
}
.error_tip {
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(150%, 0px);
  font-size: 24px;
}
.add-node-popover-body {
  display: flex;
}
.promoter_content {
  padding: 0 20px;
}
.condition_content .el-button,
.copyer_content .el-button,
.approver_self_select .el-button,
.promoter_content .el-button,
.approver_content .el-button {
  margin-bottom: 20px;
}
.condition_radio {
  padding: 10px 30px;
  ::v-deep .el-radio {
    display: block;
    margin-bottom: 16px;
    .el-radio__label {
      font-size: 14px !important;
    }
  }
}
.promoter_content p {
  padding: 18px 0;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}
.promoter_person .el-dialog__body {
  padding: 10px 20px 14px 20px;
}
.person_body {
  border: 1px solid #f5f5f5;
  height: 500px;
}
.person_tree {
  padding: 10px 12px 0 8px;
  width: 280px;
  height: 100%;
  border-right: 1px solid #f5f5f5;
}
.person_tree input {
  padding-left: 22px;
  width: 210px;
  height: 30px;
  font-size: 12px;
  border-radius: 2px;
  border: 1px solid #d5dadf;
  background: url(~@/assets/images/list_search.png) no-repeat 10px center;
  background-size: 14px 14px;
  margin-bottom: 14px;
}
.tree_nav span {
  display: inline-block;
  padding-right: 10px;
  margin-right: 5px;
  max-width: 6em;
  color: #38adff;
  font-size: 12px;
  cursor: pointer;
  background: url(~@/assets/images/jiaojiao.png) no-repeat right center;
}
.tree_nav span:last-of-type {
  background: none;
}
.person_tree ul,
.has_selected ul {
  height: 420px;
  overflow-y: auto;
}
.person_tree li {
  padding: 5px 0;
}
.person_tree li i {
  float: right;
  padding-left: 24px;
  padding-right: 10px;
  color: #3195f8;
  font-size: 12px;
  cursor: pointer;
  background: url(~@/assets/images/next_level_active.png) no-repeat 10px center;
  border-left: 1px solid rgb(238, 238, 238);
}
.person_tree li a.active + i {
  color: rgb(197, 197, 197);
  background-image: url(~@/assets/images/next_level.png);
  pointer-events: none;
}
.person_tree img {
  width: 14px;
  vertical-align: middle;
  margin-right: 5px;
}
.has_selected {
  width: 276px;
  height: 100%;
  font-size: 12px;
}
.has_selected ul {
  height: 460px;
}
.has_selected p {
  padding-left: 19px;
  padding-right: 20px;
  line-height: 37px;
  border-bottom: 1px solid #f2f2f2;
}
.has_selected p a {
  float: right;
}
.has_selected ul li {
  margin: 11px 26px 13px 19px;
  line-height: 17px;
}
.has_selected li span {
  vertical-align: middle;
}
.has_selected li img:first-of-type {
  width: 14px;
  vertical-align: middle;
  margin-right: 5px;
}
.has_selected li img:last-of-type {
  float: right;
  margin-top: 2px;
  width: 14px;
}
el-radio-group {
  padding: 20px 0;
}
.approver_content {
  padding: 20px;
  border-bottom: 1px solid #f2f2f2;
}

.approver_some .el-radio,
.approver_self_select .el-radio {
  width: 27%;
  margin-bottom: 20px;
}
.copyer_content .el-checkbox {
  margin-bottom: 20px;
}
.el-checkbox__label {
  font-size: 12px;
}
.condition_content,
.copyer_content,
.approver_self_select,
.approver_manager,
.approver_some {
  padding: 20px 20px 0;
}
.approver_manager p:first-of-type,
.approver_some p {
  line-height: 19px;
  font-size: 14px;
  margin-bottom: 14px;
}

.approver_manager p {
  line-height: 32px;
}
.approver_manager select {
  width: 420px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.approver_manager p.tip {
  margin: 10px 0 22px 0;
  font-size: 12px;
  line-height: 16px;
  color: #f8642d;
}
.approver_self {
  padding: 28px 20px;
}
.selected_list {
  margin-bottom: 20px;
  line-height: 30px;
}
.selected_list span {
  margin-right: 10px;
  padding: 3px 6px 3px 9px;
  line-height: 12px;
  white-space: nowrap;
  border-radius: 2px;
  border: 1px solid rgba(220, 220, 220, 1);
}
.selected_list img {
  margin-left: 5px;
  width: 7px;
  height: 7px;
  cursor: pointer;
}
.approver_self_select h3 {
  margin: 5px 0 20px;
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
}
.condition_copyer .el-drawer__body .priority_level {
  position: absolute;
  top: 11px;
  right: 30px;
  width: 100px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content p.tip {
  margin: 20px 0;
  width: 510px;
  text-indent: 17px;
  line-height: 45px;
  background: rgba(241, 249, 255, 1);
  border: 1px solid rgba(64, 163, 247, 1);
  color: #46a6fe;
  font-size: 14px;
}
.condition_content ul {
  max-height: 500px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.condition_content li > span {
  float: left;
  margin-right: 8px;
  width: 70px;
  line-height: 32px;
  text-align: right;
}
.condition_content li > div {
  display: inline-block;
  width: 370px;
}
.condition_content li:not(:last-child) > div > p {
  margin-bottom: 20px;
}
.condition_content li > div > p:not(:last-child) {
  margin-bottom: 10px;
}
.condition_content li > a {
  float: right;
  margin-right: 10px;
  margin-top: 7px;
}
.condition_content li select,
.condition_content li input {
  width: 100%;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content li select + input {
  width: 260px;
}
.condition_content li select {
  margin-right: 10px;
  width: 100px;
}
.condition_content li p.selected_list {
  padding-left: 10px;
  border-radius: 4px;
  min-height: 32px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content li p.check_box {
  line-height: 32px;
}
.condition_list .el-dialog__body {
  padding: 16px 26px;
}
.condition_list p {
  color: #666666;
  margin-bottom: 10px;
}
.condition_list p.check_box {
  margin-bottom: 0;
  line-height: 36px;
}
</style>
