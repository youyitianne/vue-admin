import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   // redirect: '/dashboard',
  //   name: 'Dashboard',
  //   //hidden: true,
  //   children: [{
  //     path: 'dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //   }]
  // },
  // {
  //   path: '/form',
  //   component: Layout,
  //   name: 'form',
  //   meta: {
  //     title: '首页',
  //     icon: 'example',
  //     roles: ['aaa']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: {
  //         title: 'Form',
  //         icon: 'form',
  //         roles: ['aaa']
  //       }
  //     }
  //   ]
  // },

]

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [
  {
    path: '/homepage',
    component: Layout,
    redirect: '/homepage/route',
    name: 'Data',
    meta: {
      title: '主页',
      icon: 'documentation',
    },
    children: [
      {
        path: 'route',
        name: 'route',
        hidden: true,
        component: () => import('@/views/table/homePage/route'),
        meta: {
          title: 'homepage',
          icon: 'table',
        }
      },
      {
        path: 'addata',
        name: 'Table',
        component: () => import('@/views/table/homePage/addata/addata'),
        meta: {
          title: '广告数据',
          icon: 'table',
          roles: ['director', 'planner', 'operatorleader', 'operator']
        }
      },
      {
        path: 'arpu',
        name: 'Table1',
        component: () => import('@/views/table/homePage/arpu/arpu'),
        meta: {
          title: 'ARPU',
          icon: 'table',
          roles: ['director']
        }
      },
      {
        path: 'earned',
        name: 'Table2',
        component: () => import('@/views/table/homePage/earned/earned'),
        meta: {
          title: '收益',
          icon: 'table',
          roles: ['director']
        }
      },
      {
        path: 'ltv',
        name: 'Table3',
        component: () => import('@/views/table/homePage/ltv/ltv'),
        meta: {
          title: 'ltv',
          icon: 'table',
          roles: ['director']
        }
      },
      {
        path: 'lt',
        name: 'Table5',
        component: () => import('@/views/table/homePage/ltv/lt'),
        meta: {
          title: 'lt',
          icon: 'table',
          roles: ['director', 'planner', 'operatorleader', 'operator']
        }
      },
      {
        path: 'productdata',
        name: 'Table4',
        component: () => import('@/views/table/homePage/productdata/productdata'),
        meta: {
          title: '产品数据',
          icon: 'table',
        }
      },
    ]
  },
  {
    path: '/data-summary',
    component: Layout,
    redirect: '/data-summary/cline',
    name: 'Component',
    meta: {
      title: '数据汇总',
      icon: 'summary',
      roles: ['director']
    },
    children: [
      {
        path: 'cline',
        component: () => import('@/views/complexChart/user_ad_addata_line_chart'),
        name: 'ComplexLineChart',
        meta: {
          title: '统计图表概览',
          noCache: true,
          icon: 'chart',
          roles: ['director']
        }
      },
      {
        path: 'pay_cline',
        component: () => import('@/views/complexChart/pay_line_chart'),
        name: 'PayLineChart',
        meta: {
          title: '计费统计图表',
          noCache: true,
          icon: 'chart',
          roles: ['director']
        }
      },
    ]
  },
  {
    path: '/data-acquire',
    component: Layout,
    redirect: '/data-acquire/umeng',
    name: 'Component',
    meta: {
      title: '数据获取',
      icon: 'download-source',
      roles: ['director', 'operatorleader']
    },
    children: [
      {
        path: 'yixin',
        component: () => import('@/views/table/datamanager/yixin'),
        name: 'YixinTable',
        meta: {
          title: '移信数据下载',
          noCache: true,
          icon: 'download3',
          roles: ['director', 'operatorleader']
        }
      },
      {
        path: 'umeng',
        component: () => import('@/views/table/datamanager/umeng'),
        name: 'UmengTable',
        meta: {
          title: '友盟数据下载',
          noCache: true,
          icon: 'download3',
          roles: ['director', 'operatorleader']
        }
      },
    ]
  },
  {
    path: '/component',
    component: Layout,
    redirect: '/component/dropzone',
    name: 'Component',
    meta: {
      title: '数据录入',
      icon: 'upload1',
      roles: ['director', 'operatorleader']
    },
    children: [
      {
        path: 'apps',
        name: 'apps',
        component: () => import('@/views/table/projectmanager/appTable.vue'),
        meta: {
          title: '应用列表',
          icon: 'table',
          roles: ['director', 'operatorleader', 'operator', 'planner']
        }
      },
      {
        path: 'dropzone',
        component: () => import('@/views/dropZone/dropzone'),
        name: 'dropzone',
        meta: {
          title: '数据录入',
          icon: 'upload1',
          roles: ['director', 'operatorleader']
        }
      }]
  },
  {
    path: '/data-analysis',
    component: Layout,
    redirect: '/data-analysis/shoowtime_2table',
    name: 'Statistics',
    meta: {
      title: '数据分析',
      icon: 'chart',
      roles: ['director', 'operatorleader', 'operator', 'planner']
    },
    children: [
      {
        path: 'shoowtime_1',
        name: 'showtimeTable1',
        component: () => import('@/views/table/datamanager/showtime_1table'),
        meta: {
          title: '展次表（旧）',
          icon: 'showtime',
          roles: ['director', 'operatorleader', 'operator', 'planner']
        }
      },
      {
        path: 'shoowtime_2table',
        name: 'showtimeTable2',
        component: () => import('@/views/table/datamanager/showtime_2table'),
        meta: {
          title: '展次表（新）',
          icon: 'showtime',
          roles: ['director', 'operatorleader', 'operator', 'planner']
        }
      },
      {
        path: 'arpu',
        name: 'arpuTable',
        component: () => import('@/views/table/datamanager/arputable'),
        meta: {
          title: 'ARPU表',
          icon: 'arpu1',
          roles: ['director', 'operatorleader', 'operator', 'planner']
        }
      },
      {
        path: 'earned',
        name: 'earnedTable',
        component: () => import('@/views/table/datamanager/earnedtable'),
        meta: {
          title: '收益表',
          icon: 'earnedlist',
          roles: ['director', 'operatorleader']
        }
      },
      {
        path: 'umengLifeTime',
        component: () => import('@/views/table/datamanager/umengLifeTime'),
        name: 'UmengLifeTimeTable',
        meta: {
          title: '友盟留存',
          noCache: true,
          icon: 'retention',
          roles: ['director', 'operatorleader', 'operator', 'planner']
        }
      },
      {
        path: 'repeat',   //无法适配
        hidden:true,
        component: () => import('@/views/table/repeat/repeat'),
        name: 'repeatTable',
        meta: {
          title: '广告数据查重',
          noCache: true,
          icon: 'repeat',
          roles: ['director', 'operatorleader']
        }
      },

    ]
  },
  {
    path: '/conpany',
    component: Layout,
    redirect: '/Company/conpanyInfo',
    name: 'Company',
    meta: {
      title: '发布帐号',
      roles: ['operatorleader', 'director','operator'],
    },
    children: [
      {
        path: 'conpanyInfo',
        component: () => import('@/views/table/sdkmanager/companyinfo'),
        name: 'conpanyInfoManage',
        meta: {
          title: '发布帐号',
          icon: 'companyinfo',
          roles: ['operatorleader', 'director','operator'],
        }
      }
    ]
  },
  {
    path: '/appmanager',
    component: Layout,
    redirect: '/appmanager/projectTable',
    name: 'Example',
    meta: {
      title: '项目管理',
      icon: 'list4',
    },
    children: [
      {
        path: 'projectTable',
        component: () => import('@/views/table/projectmanager/projectTable'),
        name: 'ProjectTable',
        meta: {
          title: '项目列表',
          noCache: true,
          icon: 'project2',
        }
      },
      {
        path: 'channelTable',
        component: () => import('@/views/table/projectmanager/channelTable'),
        name: 'ChannelTable',
        meta: {
          title: '渠道列表',
          noCache: true,
          icon: 'channel',
          roles: ['director', 'operatorleader'],
        }
      },
      {
        path: 'adTypeTable',
        component: () => import('@/views/table/projectmanager/adTypeTable'),
        name: 'AdTypeTable',
        meta: {
          title: '广告类型列表',
          noCache: true,
          icon: 'type',
          roles: ['director', 'operatorleader'],
        }
      }
    ]
  },
  {
    path: '/accountmanager',
    component: Layout,
    redirect: '/accountmanager/accountTable',
    name: 'Example',
    meta: {
      title: '人员管理',
      icon: 'peoples',
      roles: ['director']
    },
    children: [
      {
        path: 'accountTable',
        component: () => import('@/views/table/personalmanager/accountTable'),
        name: 'AccountTable',
        meta: {
          title: '帐号管理',
          noCache: true,
          icon: 'accountmanage',
          roles: ['director']
        }
      },
      {
        path: 'user_role_Table',
        component: () => import('@/views/table/personalmanager/user_role_Table'),
        name: 'User_Role_Table',
        meta: {
          title: '角色管理',
          noCache: true,
          icon: 'role',
          roles: ['director']
        }
      },
      {
        path: 'resourceTable',
        component: () => import('@/views/table/personalmanager/resourceTable'),
        name: 'ResourceTable',
        meta: {
          title: '项目分配',
          icon: 'allot',
          roles: ['director']
        }
      }
    ]
  },
  {
    path: '/sdkmanager',
    component: Layout,
    redirect: '/sdkmanager/projectconfiglist',
    name: 'Component',
    meta: {
      title: 'SDK管理',
      icon: 'excel',
    },
    children: [
      {
        path: 'sdklist',
        component: () => import('@/views/table/sdkmanager/sdklisttable'),
        name: 'SDKManager',
        meta: {
          title: 'SDK模版列表',
          icon: 'model4',
          roles: ['director', 'sdksuport'],
        }
      },
      {
        path: 'projectconfig',
        component: () => import('@/views/table/sdkmanager/projectconfigtable'),
        name: 'ProjectConfigManager',
        meta: {
          title: 'SDK配置表',
          icon: 'sdkset1',
          roles: ['director', 'operatorleader', 'operator'],
        }
      }, {
        path: 'projectconfiglist',
        component: () => import('@/views/table/sdkmanager/projectconfigtable_publish'),
        name: 'ProjectConfigList',
        meta: {
          title: '配置表发布记录',
          icon: 'sdkshow',
        }
      }, {
        path: 'projectconfigview',
        hidden: true,
        component: () => import('@/views/table/sdkmanager/projectShow'),
        name: 'ProjectConfigView',
        meta: {
          title: '详细信息',
          icon: 'sdkshow',
        }
      }, {
        path: 'keyStore',
        component: () => import('@/views/table/sdkmanager/keystore'),
        name: 'keyStoreManage',
        meta: {
          roles: ['director', 'operatorleader', 'operator'],
          title: 'KeyStore管理',
          icon: 'keystore',
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/help',
    name: 'SystemSet',
    meta: {
      title: '系统',
      icon: 'system1',
    },
    children: [
      {
        path: 'file',
        component: () => import('@/views/dropZone/fileUpload.vue'),
        name: 'file',
        meta: {
          title: '上传文件管理',
          icon: 'uploadfilemanager',
          roles: ['director', 'admin','operatorleader'],
        }
      },
      {
        path: 'operationlog',
        component: () => import('@/views/system/operationLog'),
        name: 'OperationLog',
        meta: {
          title: '操作日志',
          icon: 'log2',
          roles: ['director'],
        }
      },
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Set',
        meta: {
          title: '设置',
          icon: 'personal',
        }
      },
      {
        path: 'help',
        component: () => import('@/views/system/help'),
        name: 'Help',
        meta: {
          title: '帮助',
          icon: 'help1',
        }
      },

    ]
  },
  {
    path: '/redSystem',
    component: Layout,
    name: 'redSystem',
    redirect: '/redSystem/testMode',
    meta: {
      title: '屏蔽系统',
      icon: 'redsystem2',
    },
    children: [
      {
        path: 'testMode',
        component: () => import('@/views/table/shieldingsystem/testmode'),
        name: 'testMode',
        meta: {
          title: '测试模式',
          icon: 'testmode',
        }
      },
      {
        path: 'channelPromo',
        name: 'channelPromo',
        redirect: '/redSystem/channelPromo/channelPromoEdit',
        component: () => import('@/views/table/shieldingsystem/channelpromo/redsystem'),
        meta: {
          title: '渠道互推',
          icon: 'channelpromo',
        },
        children: [
          {
            path: 'channelPromoEdit',
            component: () => import('@/views/table/shieldingsystem/channelpromo/channelPromoEdit/channelPromoEdit'),
            name: 'channelPromoEdit',
            meta: {
              title: '应用列表',
              icon: 'uploadfilemanager',
            },
          },
          {
            path: 'channelPromoFodder',
            component: () => import('@/views/table/shieldingsystem/channelpromo/channelPromoFodder/channelPromoFodder'),
            name: 'channelPromoFodder',
            meta: {
              title: '素材管理',
              icon: 'channelpromofodder',
              roles: ['operatorleader', 'director','operator'],
            },
          },
          {
            path: 'promoChannel',
            component: () => import('@/views/table/shieldingsystem/channelpromo/promoChannel/promoChannel'),
            name: 'promoChannel',
            meta: {
              title: '渠道设置',
              icon: 'promochannel',
              roles: ['operatorleader', 'director','operator'],
            },
          },
          {
            path: 'channelPromoRecord',
            component: () => import('@/views/table/shieldingsystem/channelpromo/channelPromoRecord/channelPromoRecord'),
            name: 'channelPromoRecord',
            meta: {
              title: '发布记录',
              icon: 'promorecord',
              roles: ['operatorleader', 'director','operator'],
            },
          },

        ]
      },
    ]
  },
  {
    path: '/debug',
    component: Layout,
    redirect: '/debug/adData',
    name: 'Data',
    meta: {
      title: 'Debug',
      icon: 'documentation',
      roles: ['director', 'operatorleader']
    },
    children: [
      {
        path: 'adData',
        name: 'adData',
        component: () => import('@/views/debug/addata'),
        meta: {
          title: '广告数据',
          icon: 'addata',
          roles: ['director', 'operatorleader']
        }
      },
      {
        path: 'userData',
        component: () => import('@/views/debug/userdata'),
        name: 'userData',
        meta: {
          title: '用户数据',
          noCache: true,
          icon: 'userdata',
          roles: ['director', 'operatorleader']
        }
      },

    ]
  },
  {path: '*', redirect: '/404'}
];
