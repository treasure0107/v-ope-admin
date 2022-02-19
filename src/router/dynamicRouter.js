/*
 * @Author: JTune
 * @Descripttion:动态路由
 */
import Redirect from '@/components/Redirect/index.vue';
export const dynamicRoutes = [
  /*
   *工作台 workBench
   *---------start---------
   */
  {
    name: 'home',
    path: '/home',
    component: () => import('@/views/home'),
    meta: {
      title: '工作台',
      icon: 'el-icon-s-platform',
      authActive: 0,
      isMenuHide: true
    }
  },
  {
    path: '/allMessage',
    component: () => import('@/views/home/allMessage'),
    name: '消息-全部',
    meta: {
      title: '',
      icon: 'dashboard',
      isMenuHide: true
    }
  },
  {
    path: '/allBacklog',
    component: () => import('@/views/home/allBacklog'),
    name: '待办事项-全部',
    meta: {
      title: '',
      icon: 'dashboard',
      isMenuHide: true
    }
  },
  /*
   *工作台
   *---------end---------
   */
  /*
   *场站管理 depotManagement
   *---------start---------
   */
  {
    path: '/depotManagement',
    component: Redirect,
    meta: {
      title: '运行管理',
      icon: 'el-icon-s-home',
      authActive: 1
    },
    name: 'depotManagement',
    children: [{
      path: '/depotManagement/transitionManagement',
      component: () => import('@/views/taskFormManage/index.vue'),
      meta: {
        title: '交接班管理',
        mapFormType: 'JJBGL',
        icon: 'dashboard',
        authActive: 1
      },
      name: 'transitionManagement'
    },
    {
      path: '/depotManagement/runningLog',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'runningLog',
      meta: {
        title: '运行日志',
        mapFormType: 'YXRZ',
        icon: 'el-icon-s-promotion',
        authActive: 1
      }
    }
    ]
  },
  {
    path: '/depotManagement/faultManagement',
    component: () => import('@/views/taskFormManage/index.vue'),
    meta: {
      title: '故障管理',
      mapFormType: 'GZGL',
      icon: 'el-icon-picture',
      authActive: 1
    },
    name: 'faultManagement'
  },
  {
    path: '/depotManagement/defectManagement',
    component: () => import('@/views/taskFormManage/index.vue'),
    meta: {
      title: '缺陷管理',
      mapFormType: 'QXGL',
      icon: 'el-icon-s-finance',
      authActive: 1
    },
    name: 'defectManagement'
  },
  {
    path: '/depotManagement/inspectManagement',
    component: () => import('@/views/inspectManagement'),
    meta: {
      title: '巡检管理',
      icon: 'el-icon-s-claim',
      authActive: 1
    },
    name: 'inspectManagement'
  },
  {
    path: '/depotManagement/reconditionManagement',
    component: Redirect,
    meta: {
      title: '检修管理',
      icon: 'el-icon-s-claim',
      authActive: 1
    },
    name: 'reconditionManagement',
    children: [{
      path: '/depotManagement/reconditionManagement/devicePlan',
      component: () => import('@/views/reconditionManagement/devicePlan'),
      name: 'devicePlan',
      meta: {
        title: '设备检修计划',
        icon: 'el-icon-s-claim',
        authActive: 1
      }
    },
    {
      path: '/depotManagement/reconditionManagement/stationPlan',
      component: () => import('@/views/reconditionManagement/stationPlan'),
      name: 'stationPlan',
      meta: {
        title: '场站检修计划',
        icon: 'el-icon-s-claim',
        authActive: 1
      }
    },
    {
      path: '/depotManagement/reconditionManagement/deviceRecord',
      component: () => import('@/views/reconditionManagement/deviceRecord'),
      name: 'deviceRecord',
      meta: {
        title: '设备检修记录',
        icon: 'el-icon-s-claim',
        authActive: 1
      }
    }
    ]
  },
  {
    path: '/depotManagement/operationTicketManagement',
    component: () => import('@/views/operationTicketManagement/index.vue'),
    meta: {
      title: '操作票管理',
      mapFormType: 'CZPGL',
      icon: 'el-icon-s-custom',
      authActive: 1
    },
    name: 'operationTicketManagement'
  },
  {
    name: 'deviceManagement',
    path: '/depotManagement/deviceManagement',
    component: () => import('@/views/deviceManagement'),
    meta: {
      title: '设备管理',
      icon: 'el-icon-s-platform',
      authActive: 1
    }
  },
  {
    path: '/depotManagement/workTicketManagement',
    component: Redirect,
    meta: {
      title: '工作票管理',
      icon: 'el-icon-s-ticket',
      authActive: 1
    },
    name: 'workTicketManagement',
    children: [{
      path: '/depotManagement/workTicketManagement/fanTicket',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'fanTicket',
      meta: {
        title: '风机专用票',
        mapFormType: 'FJGZP',
        icon: 'el-icon-collection',
        authActive: 1
      }
    },
    {
      path: '/depotManagement/workTicketManagement/firstElectricTicket',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'firstElectricTicket',
      meta: {
        title: '电气第一种工作票',
        mapFormType: 'DQDYZGZP',
        icon: 'el-icon-collection',
        authActive: 1
      }
    },
    {
      path: '/depotManagement/workTicketManagement/secondElectricTicket',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'secondElectricTicket',
      meta: {
        title: '电气第二种工作票',
        mapFormType: 'DQDEZGZP',
        icon: 'el-icon-collection',
        authActive: 1
      }
    },
    {
      path: '/depotManagement/workTicketManagement/firstFireTicket',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'firstFireTicket',
      meta: {
        title: '一级动火工作票',
        mapFormType: 'YJDHGZP',
        icon: 'el-icon-collection',
        authActive: 1
      }
    },
    {
      path: '/depotManagement/workTicketManagement/secondFireTicket',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'secondFireTicket',
      meta: {
        title: '二级动火工作票',
        mapFormType: 'EJDHGZP',
        icon: 'el-icon-collection',
        authActive: 1
      }
    }
    ]
  },

  {
    path: '/depotManagement/skillSupervise',
    component: () => import('@/views/skillSupervise'),
    meta: {
      title: '技术监督',
      icon: 'el-icon-s-fold',
      authActive: 1
    },
    name: 'skillSupervise'
  },
  {
    path: '/depotManagement/provincialManagement',
    component: () => import('@/views/provincialManagement'),
    meta: {
      title: '省调管理',
      icon: 'el-icon-s-fold',
      authActive: 1
    },
    name: 'provincialManagement'
  },
  {
    path: '/depotManagement/reportForm',
    component: Redirect,
    meta: {
      title: '报表',
      icon: 'el-icon-s-data',
      authActive: 1
    },
    name: 'reportForm',
    children: [{
      path: '/depotManagement/reportForm/daily',
      component: () => import('@/views/groupManagement/stationDaily'),
      name: 'stationDaily',
      meta: {
        title: '日报',
        icon: 'dashboard',
        authActive: 1
      }
    },
    {
      path: '/depotManagement/reportForm/monthly',
      component: () => import('@/views/groupManagement/stationMonthly'),
      name: 'stationMonthly',
      meta: {
        title: '月报',
        icon: 'dashboard',
        authActive: 1
      }
    }
    ]
  },
  {
    path: '/depotManagement/menuPlanManage',
    component: () => import('@/views/menuPlanManage'),
    meta: {
      title: '场站计划管理',
      icon: 'el-icon-s-fold',
      authActive: 1
    },
    name: 'menuPlanManage'
  },
  {
    path: '/depotManagement/menuFlowManage',
    component: () => import('@/views/menuFlowManage'),
    meta: {
      title: '菜单流程设置',
      icon: 'el-icon-s-fold',
      authActive: 1
    },
    name: 'menuFlowManage'
  },
  {
    path: '/depotManagement/formSet',
    component: Redirect,
    meta: {
      title: '表单设置',
      icon: 'el-icon-s-tools',
      authActive: 1
    },
    name: 'formSet',
    children: [{
      path: '/depotManagement/formSet/formLibrary',
      component: () => import('@/views/formSet/formLibrary'),
      name: 'formLibrary',
      meta: {
        title: '表单设置',
        icon: 'dashboard',
        authActive: 1
      }
    },
    {
      path: '/depotManagement/formSet/workflowEngine',
      component: () => import('@/views/formSet/workflowEngine'),
      name: 'workflowEngine',
      meta: {
        title: '流程设计',
        icon: 'dashboard',
        authActive: 1
      },
      hidden: true
    },
    {
      path: '/depotManagement/formSet/formDesign',
      component: () => import('@/views/formSet/formDesign'),
      name: 'formDesign',
      meta: {
        title: '表单设计',
        icon: 'dashboard',
        authActive: 1
      },
      hidden: true
    }
    ]
  },
  /* --------------跳表单的子路由----------- */
  // {
  //   path: '/depotManagement/formContainer',
  //   component: () => import('@/views/taskFormManage/FormContainer.vue'),
  //   meta: {
  //     title: '',
  //     icon: '',
  //     authActive: 1
  //   },
  //   name: '表单创建详情页',
  //   hidden: true
  // },

  /*
   *场站管理
   *---------end---------
   */
  /*
   *人员管理 personnelManagement
   *---------start---------
   */
  {
    path: '/personnelManagement',
    component: Redirect,
    meta: {
      title: '人员管理',
      icon: 'el-icon-user-solid',
      authActive: 2
    },
    name: 'personnelManagement',
    children: [{
      path: '/personnelManagement/frameworkSettng',
      component: () => import('@/views/personnelManagement/children/frameworkSetting'),
      name: 'stationPerson',
      meta: {
        title: '组织架构',
        icon: 'el-icon-setting',
        authActive: 2
      }
    },
    {
      path: '/personnelManagement/windStationPersonManage',
      component: () => import('@/views/personnelManagement/children/windStationPersonManage'),
      name: 'windStationPerson',
      meta: {
        title: '风场人员管理',
        icon: 'el-icon-help',
        authActive: 2
      }
    },
    {
      path: '/personnelManagement/outsideStationPerson',
      component: () => import('@/views/personnelManagement/children/outsideStationPerson/index.vue'),
      name: 'outsideStationPerson',
      meta: {
        title: '站外人员',
        icon: 'el-icon-s-custom',
        authActive: 2
      }
    },
    {
      path: '/personnelManagement/permission',
      component: () => import('@/views/personnelManagement/children/permission'),
      name: 'permission',
      meta: {
        title: '权限集',
        icon: 'el-icon-set-up',
        authActive: 2
      }
    }
    ]
  },
  {
    path: '/personnelManagement/roleManagement',
    component: () => import('@/views/roleManagement'),
    meta: {
      title: '角色管理',
      icon: 'el-icon-s-check',
      authActive: 2
    },
    name: 'roleManagement'
  },
  /*
   *人员管理
   *---------end---------
   */
  /*
   *集团管理 groupManagement
   *---------start---------
   */
  {
    path: '/groupManagement/windFarmManage',
    component: () => import('@/views/windFarmManage'),
    meta: {
      title: '风电场管理',
      icon: 'el-icon-place',
      authActive: 3
    },
    name: 'windFarmManagement'
  },
  {
    path: '/groupManagement/factoryManagement',
    component: () => import('@/views/factoryManagement'),
    meta: {
      title: '厂商管理',
      icon: 'el-icon-s-shop',
      authActive: 3
    },
    name: 'factoryManagement'
  },
  {
    path: '/groupManagement/transition',
    component: Redirect,
    meta: {
      title: '运行管理',
      icon: 'el-icon-s-home',
      authActive: 1
    },
    name: 'supDepotManagement',
    children: [{
      path: '/groupManagement/transitionManagement',
      component: () => import('@/views/taskFormManage/index.vue'),
      meta: {
        title: '交接班管理',
        mapFormType: 'JJBGL',
        icon: 'dashboard',
        authActive: 1
      },
      name: 'supTransitionManagement'
    },
    {
      path: '/groupManagement/runningLog',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'supRunningLog',
      meta: {
        title: '运行日志',
        mapFormType: 'YXRZ',
        icon: 'el-icon-s-promotion',
        authActive: 1
      }
    }
    ]
  },
  {
    path: '/groupManagement/faultManagement',
    component: () => import('@/views/taskFormManage/index.vue'),
    meta: {
      title: '故障管理',
      mapFormType: 'GZGL',
      icon: 'el-icon-picture',
      authActive: 1
    },
    name: 'supFaultManagement'
  },
  {
    path: '/groupManagement/defectManagement',
    component: () => import('@/views/taskFormManage/index.vue'),
    meta: {
      title: '缺陷管理',
      mapFormType: 'QXGL',
      icon: 'el-icon-s-finance',
      authActive: 1
    },
    name: 'supDefectManagement'
  },
  {
    path: '/groupManagement/inspectManagement',
    component: () => import('@/views/inspectManagement/all'),
    meta: {
      title: '巡检管理',
      icon: 'el-icon-s-claim',
      authActive: 1
    },
    name: 'allinspectManagement'
  },
  {
    path: '/groupManagement/reconditionManagement',
    component: Redirect,
    meta: {
      title: '检修管理',
      icon: 'el-icon-s-claim',
      authActive: 1
    },
    name: 'allreconditionManagement',
    children: [{
      path: '/groupManagement/reconditionManagement/devicePlan',
      component: () => import('@/views/reconditionManagement/devicePlan/all'),
      name: 'alldevicePlan',
      meta: {
        title: '设备检修计划',
        icon: 'el-icon-s-claim',
        authActive: 1
      }
    },
    {
      path: '/groupManagement/reconditionManagement/stationPlan',
      component: () => import('@/views/reconditionManagement/stationPlan/all'),
      name: 'allstationPlan',
      meta: {
        title: '场站检修计划',
        icon: 'el-icon-s-claim',
        authActive: 1
      }
    },
    {
      path: '/groupManagement/reconditionManagement/deviceRecord',
      component: () => import('@/views/reconditionManagement/deviceRecord/all'),
      name: 'alldeviceRecord',
      meta: {
        title: '设备检修记录',
        icon: 'el-icon-s-claim',
        authActive: 1
      }
    }
    ]
  },
  {
    path: '/groupManagement/workTicketManagement',
    component: Redirect,
    meta: {
      title: '工作票管理',
      icon: 'el-icon-s-ticket',
      authActive: 1
    },
    name: 'supWorkTicketManagement',
    children: [{
      path: '/groupManagement/workTicketManagement/fanTicket',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'supFanTicket',
      meta: {
        title: '风机专用票',
        mapFormType: 'FJGZP',
        icon: 'el-icon-collection',
        authActive: 1
      }
    },
    {
      path: '/groupManagement/workTicketManagement/firstElectricTicket',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'supFirstElectricTicket',
      meta: {
        title: '电气第一种工作票',
        mapFormType: 'DQDYZGZP',
        icon: 'el-icon-collection',
        authActive: 1
      }
    },
    {
      path: '/groupManagement/workTicketManagement/secondElectricTicket',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'supSecondElectricTicket',
      meta: {
        title: '电气第二种工作票',
        mapFormType: 'DQDEZGZP',
        icon: 'el-icon-collection',
        authActive: 1
      }
    },
    {
      path: '/groupManagement/workTicketManagement/firstFireTicket',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'supFirstFireTicket',
      meta: {
        title: '一级动火工作票',
        mapFormType: 'YJDHGZP',
        icon: 'el-icon-collection',
        authActive: 1
      }
    },
    {
      path: '/groupManagement/workTicketManagement/secondFireTicket',
      component: () => import('@/views/taskFormManage/index.vue'),
      name: 'supSecondFireTicket',
      meta: {
        title: '二级动火工作票',
        mapFormType: 'EJDHGZP',
        icon: 'el-icon-collection',
        authActive: 1
      }
    }
    ]
  },
  {
    path: '/groupManagement/operationTicketManagement',
    component: () => import('@/views/operationTicketManagement/index.vue'),
    meta: {
      title: '操作票管理',
      mapFormType: 'CZPGL',
      icon: 'el-icon-s-custom',
      authActive: 1
    },
    name: 'supOperationTicketManagement'
  },
  {
    path: '/groupManagement/skillSupervise',
    component: () => import('@/views/skillSupervise/all'),
    meta: {
      title: '技术监督',
      icon: 'el-icon-s-fold',
      authActive: 1
    },
    name: 'allskillSupervise'
  },
  {
    path: '/groupManagement/provincialManagement',
    component: () => import('@/views/provincialManagement/all'),
    meta: {
      title: '省调管理',
      icon: 'el-icon-s-fold',
      authActive: 1
    },
    name: 'allprovincialManagement'
  },
  {
    path: '/groupManagement/report',
    component: Redirect,
    meta: {
      title: '报表',
      icon: 'el-icon-s-data',
      authActive: 3
    },
    name: 'groupManagement',
    children: [{
      path: '/groupManagement/daily',
      component: () => import('@/views/groupManagement/daily'),
      name: 'daily',
      meta: {
        title: '日报',
        icon: 'dashboard',
        authActive: 3
      }
    },
    {
      path: '/groupManagement/monthly',
      component: () => import('@/views/groupManagement/monthly'),
      name: 'monthly',
      meta: {
        title: '月报',
        icon: 'dashboard',
        authActive: 3
      }
    }
    ]
  }
  /*
   *集团管理
   *---------end---------
   */
];
