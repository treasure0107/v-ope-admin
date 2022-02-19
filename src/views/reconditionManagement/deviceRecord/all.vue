<!--
 * @Author: JTune
 * @Date: 2021-08-13
 * @LastEditTime: 2021-10-15 09:28:08
 * @LastEditors: JTune
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\roleManagement\index.vue
-->
<template>
  <div
    id="deviceRecord"
    style="height:645px;"
  >
    <!-- <div v-for="(outeritem,index) in [device_500hour_inspection_data]" :key="index"><div>{{index}}</div></div> -->
    <el-container style="height:765px;">
      <el-aside width="150px" style="border-right:1px solid #ebedf0;user-select:none">
          <template v-if="allDevices" >
            <div v-for="(item,i) in allDevices" class='thieItemHover' :class="{'thisItem' : (i==activeId?true:false)}" :key='i' style="width:100%;text-align:center;height:35px;line-height:35px;" @click="ItemClick(item,i)" :title="item.name">{{item.name}}</div>
          </template>
          <div v-else style="margin:20px 0 0 40px">暂无数据</div>
      </el-aside>
      <el-main style="padding:0">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;切换场站：
        <el-select v-model="checkStation" placeholder="请选择场站" size="mini" @change="(val)=>{initGetAllDevice(val)}">
          <el-option
            v-for="item in StationList"
            :key="item.id"
            :label="item.nodeName"
            :value="item.id">
          </el-option>
        </el-select>
    <h2 style="text-align:center;margin-bottom:10px">{{activeName}}-检修历史记录</h2>
    <!-- device_500hour_inspection:  500小时 -->
    <div v-if="allDevices" style="display:inline-block;white-space:nowrap;width:100%;vertical-align:middle;overflow: hidden">
      <div class='forth' style="display:inline-block;vertical-align: top;">
        <el-table
        size='mini'
      :data="device_500hour_inspection_left"
      border>
      <el-table-column :resizable="false" label="-" align='center'>
      <el-table-column
        :resizable="false"
        align='center'
        prop="id"
        label="-"
        width="100">
      </el-table-column>
      </el-table-column>
      </el-table>
      </div>
      <div class="scrollBar" ref="hourRef" v-if="device_500hour_inspection_data.length != 0" style="display:inline-flex;overflow-x:scroll;width:93%;vertical-align:top;">
      <div style="display:inline;white-space:nowrap;" v-for="(outeritem,index) in device_500hour_inspection_data" :key="index">
        <el-table
        size='mini'
        :data="outeritem"
      border>
    <el-table-column :resizable="false" :label="`最近第${index + 1}次`" align='center'>
      <el-table-column
        :resizable="false"
        key="234"
        align='center'
        prop="realsTime"
        label="检修开始时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        key="5678657"
        align='center'
        prop="realeTime"
        label="检修结束时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="消缺记录"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'defectEliminationRecord')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
        <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="检修报告"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'maintenanceReport')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
  </el-table-column>
      </el-table>
      </div>
      </div>
    </div>
    <!-- device_yearly_inspection：半年检 -->
    <div v-if="allDevices" style="display:inline-block;white-space:nowrap;width:100%;vertical-align:middle;overflow: hidden">
      <div class='forth' style="display:inline-block;vertical-align: top;">
        <el-table
        size='mini'
      :data="device_semi_annual_inspection_left"
      border>
      <el-table-column :resizable="false" label="-" align='center'>
      <el-table-column
        :resizable="false"
        align='center'
        prop="id"
        label="-"
        width="100">
      </el-table-column>
      </el-table-column>
      </el-table>
      </div>
      <div class="scrollBar" ref="semiRef" v-if="device_semi_annual_inspection_data.length != 0" style="display:inline-flex;overflow-x:scroll;width:93%;vertical-align:top;">
      <div style="display:inline;white-space:nowrap;" v-for="(outeritem,index) in device_semi_annual_inspection_data" :key="index">
        <el-table
        class="vdd"
        size='mini'
        :data="outeritem"
      border>
    <el-table-column :resizable="false" :label="`最近第${index + 1}次`" align='center'>
      <el-table-column
        :resizable="false"
        key="234"
        align='center'
        prop="realsTime"
        label="检修开始时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        key="5678657"
        align='center'
        prop="realeTime"
        label="检修结束时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="消缺记录"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'defectEliminationRecord')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
        <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="检修报告"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'maintenanceReport')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
  </el-table-column>
      </el-table>
      </div>
      </div>
    </div>
    <!-- device_yearly_inspection：年检 -->
    <div v-if="allDevices" style="display:inline-block;white-space:nowrap;width:100%;vertical-align:middle;overflow: hidden">
      <div class='forth' style="display:inline-block;vertical-align: top;">
        <el-table
        size='mini'
      :data="device_yearly_inspection_left"
      border>
      <el-table-column :resizable="false" label="-" align='center'>
      <el-table-column
        :resizable="false"
        align='center'
        prop="id"
        label="-"
        width="100">
      </el-table-column>
      </el-table-column>
      </el-table>
      </div>
      <div class="scrollBar" ref="yearlyRef" v-if="device_yearly_inspection_data.length != 0" style="display:inline-flex;overflow-x:scroll;width:93%;vertical-align:top;">
      <div style="display:inline;white-space:nowrap;" v-for="(outeritem,index) in device_yearly_inspection_data" :key="index">
        <el-table
        size='mini'
        :data="outeritem"
      border>
    <el-table-column :resizable="false" :label="`最近第${index + 1}次`" align='center'>
      <el-table-column
        :resizable="false"
        key="234"
        align='center'
        prop="realsTime"
        label="检修开始时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        key="5678657"
        align='center'
        prop="realeTime"
        label="检修结束时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="消缺记录"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'defectEliminationRecord')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
        <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="检修报告"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'maintenanceReport')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
  </el-table-column>
      </el-table>
      </div>
      </div>
    </div>
    <!-- device_patrol_inspection：巡检 -->
    <div v-if="allDevices" style="display:inline-block;white-space:nowrap;width:100%;vertical-align:middle;overflow: hidden">
      <div class='forth' style="display:inline-block;vertical-align: top;">
        <el-table
        size='mini'
      :data="device_patrol_inspection_left"
      border>
      <el-table-column :resizable="false" label="-" align='center'>
      <el-table-column
        :resizable="false"
        align='center'
        prop="id"
        label="-"
        width="100">
      </el-table-column>
      </el-table-column>
      </el-table>
      </div>
      <div class="scrollBar" ref="patrolRef" v-if="device_patrol_inspection_data.length != 0" style="display:inline-flex;overflow-x:scroll;width:93%;vertical-align:top;">
      <div style="display:inline;white-space:nowrap;" v-for="(outeritem,index) in device_patrol_inspection_data" :key="index">
        <el-table
        size='mini'
        :data="outeritem"
      border>
    <el-table-column :resizable="false" :label="`最近第${index + 1}次`" align='center'>
      <el-table-column
        :resizable="false"
        key="234"
        align='center'
        prop="realsTime"
        label="检修开始时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        key="5678657"
        align='center'
        prop="realeTime"
        label="检修结束时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="消缺记录"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'defectEliminationRecord')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
        <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="检修报告"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'maintenanceReport')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
  </el-table-column>
      </el-table>
      </div>
      </div>
    </div>
    <!-- device_random_inspection：抽检 -->
    <div v-if="allDevices" style="display:inline-block;white-space:nowrap;width:100%;vertical-align:middle;overflow: hidden">
      <div class='forth' style="display:inline-block;vertical-align: top;">
        <el-table
        size='mini'
      :data="device_random_inspection_left"
      border>
      <el-table-column :resizable="false" label="-" align='center'>
      <el-table-column
        :resizable="false"
        align='center'
        prop="id"
        label="-"
        width="100">
      </el-table-column>
      </el-table-column>
      </el-table>
      </div>
      <div class="scrollBar" ref="randomRef" v-if="device_random_inspection_data.length != 0" style="display:inline-flex;overflow-x:scroll;width:93%;vertical-align:top;">
      <div style="display:inline;white-space:nowrap;" v-for="(outeritem,index) in device_random_inspection_data" :key="index">
        <el-table
        size='mini'
        :data="outeritem"
      border>
    <el-table-column :resizable="false" :label="`最近第${index + 1}次`" align='center'>
      <el-table-column
        :resizable="false"
        key="234"
        align='center'
        prop="realsTime"
        label="检修开始时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        key="5678657"
        align='center'
        prop="realeTime"
        label="检修结束时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="消缺记录"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'defectEliminationRecord')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
        <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="检修报告"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'maintenanceReport')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
  </el-table-column>
      </el-table>
      </div>
      </div>
    </div>
    <!--统一控制滚动-->
     <div v-if="allDevices" style="display:inline-block;white-space:nowrap;width:100%;vertical-align:middle;overflow: hidden">
      <div class='forth' style="display:inline-block;vertical-align: top;height:25px;opacity:0;">
        <el-table
        size='mini'
      :data="device_random_inspection_left"
      border>
      <el-table-column :resizable="false" label="" align='center'>
      <el-table-column
        :resizable="false"
        align='center'
        prop="id"
        label="-"
        width="100">
      </el-table-column>
      </el-table-column>
      </el-table>
      </div>
      <div class="scrollBarAll" ref="allScrollRef" @scroll="onscroll" v-if="device_random_inspection_data.length != 0" style="display:inline-flex;overflow-x:scroll;width:93%;vertical-align:top;height:24px;overflow-y:hidden">
      <div style="display:inline;white-space:nowrap;" v-for="(outeritem,index) in device_random_inspection_data" :key="index">
        <el-table
        size='mini'
        :data="outeritem"
      border>
    <el-table-column :resizable="false" :label="`最近第${index + 1}次`" align='center'>
      <el-table-column
        :resizable="false"
        :show-overflow-tooltip="true"
        key="234"
        align='center'
        prop="realsTime"
        label="检修开始时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        key="5678657"
        align='center'
        prop="realeTime"
        label="检修结束时间"
        width="125">
      </el-table-column>
      <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="消缺记录"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'defectEliminationRecord')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
        <el-table-column
        :resizable="false"
        align='center'
        prop="age"
        label="检修报告"
        width="110">
        <template slot-scope="scope">
        <el-button
          v-if="scope.row.id"
          type="text"
          size="mini"
          @click="handlePerviewData(scope.row.id, 'maintenanceReport')">查看</el-button>
          <template v-else>-</template>
      </template>
      </el-table-column>
  </el-table-column>
      </el-table>
      </div>
      </div>
    </div>
    <!-- <el-empty v-else style="width: 100%;" description=" "></el-empty> -->
    <!-- <div ><span style="padding-left:30px">sdf</span></div> -->
     </el-main>
    </el-container>
        <DyDialog
      :visible="perviewShow"
      width="1200px"
      top="20px"
      dialogTitle="预览"
      :showSureButton="false"
      @cancelDialogPopup="cancelPerviewShow"
      @closeDialogPopup="closePerviewShow"
    >
      <div>
        <pdfShow
          :pdfURLStr="pdfUrl"
          :pdfHeight="'730px'"
          :pdfWidth="'1100px'"
        />
      </div>
    </DyDialog>
  </div>
</template>

<script>
import Api from '@/api';
import DyDialog from '@/components/DyDialog';
import pdfShow from '@/components/PdfShow';
export default {
  name: '',
  components: { DyDialog, pdfShow },
  data() {
    return {
      pdfUrl: '',
      perviewShow: false,
      allDevices: undefined,
      activeId: 0,
      activeName: '',
      testProps: [{ label: '检修开始时间', prop: 'id' }, { label: '检修完成时间', prop: 'name' }],
      device_500hour_inspection_left: [{ id: '500h检' }],
      device_semi_annual_inspection_left: [{ id: '半年检' }],
      device_yearly_inspection_left: [{ id: '年检' }],
      device_patrol_inspection_left: [{ id: '巡检' }],
      device_random_inspection_left: [{ id: '抽检' }],
      device_500hour_inspection_data: [],
      device_semi_annual_inspection_data: [],
      device_yearly_inspection_data: [],
      device_patrol_inspection_data: [],
      device_random_inspection_data: [],
      // forthData: [{ id: '500h检' }, { id: '半年检' }, { id: '全年检' }, { id: '巡检' }, { id: '抽查' }],
      tableData: [{
        id: '12987122',
        name: '2021-03',
        bao: '2021-03',
        age: 234

      }, {
        id: '12987123',
        name: '2021-03',
        bao: '2021-03',
        age: 334

      },
      {
        id: '12987123',
        name: '2021-03',
        bao: '2021-03',
        age: 576

      },
      {
        id: '12987123',
        name: '2021-03',
        bao: '2021-03',
        age: 75
      },
      {
        id: '12987123',
        name: '2021-03',
        bao: '2021-03',
        age: 11
      }],
      tableData2: [[], [], [], []],
      tableData1: [
        [{
          id: '12987122',
          name: '2021-03',
          record: 234
        }],
        [{
          id: '12987123',
          name: '2021-03',
          record: 11
        }]
      ],
      StationList: [],
      checkStation: ''
    };
  },
  computed: {},
  watch: {},
  created() {
    // this.initGetAllDevice();
    this.getStationList();
  },
  mounted() {
  },
  methods: {
    getStationList() {
      // 查询场站
      this.$axios.post(
        Api.windFarmManage.getWindFarmList,
        {
          data: {
            // platformCode: '400001'
            nodeName: ''
          },
          searchArea: true,
          pagination: false
        },
        res => {
          if (res.isSuccess && res.data && res.data.length) {
            console.log(res.data);
            this.StationList = res.data;
            this.checkStation = res.data[0].id;
            this.initGetAllDevice(res.data[0].id);
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    onscroll() {
      // allScrollRef  randomRef  patrolRef  yearlyRef semiRef     hourRef
      const allscrolllength = this.$refs.allScrollRef.scrollLeft;
      this.$refs.hourRef.scrollLeft = allscrolllength;
      this.$refs.semiRef.scrollLeft = allscrolllength;
      this.$refs.yearlyRef.scrollLeft = allscrolllength;
      this.$refs.patrolRef.scrollLeft = allscrolllength;
      this.$refs.randomRef.scrollLeft = allscrolllength;
    },
    handlePerviewData(val, perviewItem) {
      this.$axios.post( // 获取预览
        Api.file.findByRelationIdList,
        {
          data: { relationId: val }
        },
        (res) => {
          if (res.isSuccess) {
            const findPdf = res.data.find(item => item.fileType == perviewItem);
            if (findPdf) {
              this.pdfUrl = findPdf.fileUrl || undefined;
            } else {
              this.$message.error('未上传');
              return;
            }
            if (this.pdfUrl) {
              this.perviewShow = true;
            } else {
              this.$message.error('未上传');
            }
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    cancelPerviewShow() {
      // this.pdfUrl = undefined;
      this.perviewShow = false;
    },
    closePerviewShow() {
      // this.pdfUrl = undefined;
      this.perviewShow = false;
    },
    initGetAllDevice(nodeId) {
      this.allDevices = undefined;
      this.activeName = '';
      this.$axios.post( // 获取供选择的设备
        // 'http://192.168.1.218:9999/web/deviceInfoApi/deviceInfo/listByNodeId',
        Api.deviceManagement.getSelectDevice,
        {
          data: { nodeId }
        },
        (res) => {
          if (res.isSuccess) {
            if (res.data.length) {
              this.allDevices = res.data;
              this.activeName = this.allDevices[0].name;
              this.getHistoryData(this.allDevices[0]);
            }
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    getHistoryData(val) {
      // this.device_semi_annual_inspection_data = [];
      // this.device_500hour_inspection_data = [];
      // this.device_yearly_inspection_data = [];
      // this.device_patrol_inspection_data = [];
      // this.device_random_inspection_data = [];
      this.$axios.post(
        Api.reconditionManagement.findPlanByDeviceId,
        {
          data: { device: { id: val.id }}
        },
        (res) => {
          if (res.isSuccess) {
            if (res.data.device_500hour_inspection) {
              this.device_500hour_inspection_data = res.data.device_500hour_inspection.map(item => {
                return [item];
              });
              var hourpushdata = [{ realsTime: null, realeTime: null, id: null }];
              var hourdatalength = this.device_500hour_inspection_data.length;
              for (let i = 0; i < 20 - hourdatalength; i++) {
                this.device_500hour_inspection_data.push(hourpushdata);
              }
            } else {
              this.device_500hour_inspection_data = [];
              var hourpushdata2 = [{ realsTime: null, realeTime: null, id: null }];
              for (let i = 0; i < 20; i++) {
                this.device_500hour_inspection_data.push(hourpushdata2);
              }
            }
            if (res.data.device_semi_annual_inspection) {
              this.device_semi_annual_inspection_data = res.data.device_semi_annual_inspection.map(item => {
                return [item];
              });
              var semipushdata = [{ realsTime: null, realeTime: null, id: null }];
              var semidatalength = this.device_semi_annual_inspection_data.length;
              for (let i = 0; i < 20 - semidatalength; i++) {
                this.device_semi_annual_inspection_data.push(semipushdata);
              }
            } else {
              this.device_semi_annual_inspection_data = [];
              var semipushdata2 = [{ realsTime: null, realeTime: null, id: null }];
              for (let i = 0; i < 20; i++) {
                this.device_semi_annual_inspection_data.push(semipushdata2);
              }
            }
            if (res.data.device_yearly_inspection) {
              this.device_yearly_inspection_data = res.data.device_yearly_inspection.map(item => {
                return [item];
              });
              var yearlypushdata = [{ realsTime: null, realeTime: null, id: null }];
              var yearlydatalength = this.device_yearly_inspection_data.length;
              for (let i = 0; i < 20 - yearlydatalength; i++) {
                this.device_yearly_inspection_data.push(yearlypushdata);
              }
            } else {
              this.device_yearly_inspection_data = [];
              var yearlypushdata2 = [{ realsTime: null, realeTime: null, id: null }];
              for (let i = 0; i < 20; i++) {
                this.device_yearly_inspection_data.push(yearlypushdata2);
              }
            }
            if (res.data.device_patrol_inspection) {
              this.device_patrol_inspection_data = res.data.device_patrol_inspection.map(item => {
                return [item];
              });
              var patrolpushdata = [{ realsTime: null, realeTime: null, id: null }];
              var patroldatalength = this.device_patrol_inspection_data.length;
              for (let i = 0; i < 20 - patroldatalength; i++) {
                this.device_patrol_inspection_data.push(patrolpushdata);
              }
            } else {
              this.device_patrol_inspection_data = [];
              var patrolypushdata2 = [{ realsTime: null, realeTime: null, id: null }];
              for (let i = 0; i < 20; i++) {
                this.device_patrol_inspection_data.push(patrolypushdata2);
              }
            }
            if (res.data.device_random_inspection) {
              this.device_random_inspection_data = res.data.device_random_inspection.map(item => {
                return [item];
              });
              var randompushdata = [{ realsTime: null, realeTime: null, id: null }];
              var randomdatalength = this.device_random_inspection_data.length;
              for (let i = 0; i < 20 - randomdatalength; i++) {
                this.device_random_inspection_data.push(randompushdata);
              }
            } else {
              this.device_random_inspection_data = [];
              var randomypushdata2 = [{ realsTime: null, realeTime: null, id: null }];
              for (let i = 0; i < 20; i++) {
                this.device_random_inspection_data.push(randomypushdata2);
              }
            }
            // console.log(Object.values(res.data.device_500hour_inspection), 'this.device_500hour_inspection_data');
            // this.allDevices = res.data || [];
            // this.activeName = this.allDevices[0].name;
            // this.getHistoryData(this.allDevices[0]);
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    ItemClick(val, index) {
      this.activeId = index;
      this.activeName = val.name;
      this.getHistoryData(val);
    },
    handleEdit(index, row) {
      // this.$message({
      //   message: b.record,
      //   type: 'success'
      // });
      // console.log(a, 'aaa');
    }
  }
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类*/
@import "~@/assets/styles/mixin.scss";
.scrollBar {
  @include scrollBar;
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
  }
  // &::-webkit-scrollbar-track {
  //  background: rgb(239, 239, 239);
  //  border-radius: 2px;
  // }
  // &::-webkit-scrollbar-thumb {
  //   background: #bfbfbf;
  //   border-radius: 10px;
  // }
  // &::-webkit-scrollbar-thumb:hover {
  //   background: #333;
  // }
  // &::-webkit-scrollbar-corner {
  //   background: #179a16;
  // }
}
.scrollBarAll{
  // all:unset;
  &::-webkit-scrollbar {
    height: 20px;
  }
  &::-webkit-scrollbar-track {
  //  all:unset;
  }
  &::-webkit-scrollbar-thumb {
    // all:unset;
  }
  &::-webkit-scrollbar-thumb:hover {
    // all:unset;
  }
  &::-webkit-scrollbar-corner {
    // all:unset;
  }
}
.el-table {
  display: inline-block;
}
::v-deep .el-table .cell {
  line-height: 28px !important;
}
::v-deep .forth tr {
  background-color: #f5f7fa;
}
.thieItemHover{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
}
.thieItemHover:hover {
  background-color: #e6f7ff;
}
.thisItem {
  background-color: #e6f7ff;
  border-right: 3px solid #1890ff;
  color: #1890ff;
}
/* ::v-deep .forth tr,{
  background-color: azure !important;
}
::v-deep .forth th{
background-color: azure !important
} */
</style>
