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

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    // redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
    }]
  },
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
    path: '/component',
    component: Layout,
    redirect: '/component/dropzone',
    name: 'Component',
    meta: {
      title: '上传',
      icon: 'upload (2) ',
      roles: ['operator']
    },
    children: [
      {
        path: 'dropzone',
        component: () => import('@/views/dropZone/dropzone'),
        name: 'DropzoneDemo',
        meta: {
          title: 'Excel上传',
          roles: ['operator','leader'],
        }
      }]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistic/cline',
    name: 'Statistics',
    meta: {
      title: '数据统计',
      icon: 'chart',
      roles: ['operator', 'planner', 'market']
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
          roles: ['operator', 'market', 'leader', 'planner']
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
          roles: ['operator', 'market', 'leader', 'planner']
        }
      },
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: {
      title: '数据管理',
      icon: 'documentation',
      roles: ['operator','market', 'leader']
    },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/datamanager/addata'),
        meta: {
          title: '广告数据管理',
          icon: 'table',
          roles: ['operator','market', 'leader']
        }
      },
      {
        path: 'userdata',
        component: () => import('@/views/table/datamanager/userdata'),
        name: 'UserdataTable',
        meta: {
          title: '用户数据管理',
          noCache: true,
          icon: 'table',
          roles: ['operator','market', 'leader']
        }
      },
      {
        path: 'yixin',
        component: () => import('@/views/table/datamanager/yixin'),
        name: 'YixinTable',
        meta: {
          title: '移信数据下载',
          noCache: true,
          icon: 'table',
          roles: ['operator', 'leader']
        }
      },
    ]
  },
  {
    path: '/appmanager',
    component: Layout,
    redirect: '/appmanager/appTable',
    name: 'Example',
    meta: {
      title: '项目管理',
      icon: 'list',
      roles: ['operator','developer','market'],
    },
    children: [
      {
        path: 'projectTable',
        component: () => import('@/views/table/projectmanager/projectTable'),
        name: 'ProjectTable',
        meta: {
          title: '项目管理',
          noCache: true,
          icon: 'table',
          roles: ['operator','developer','market'],
        }
      },
      {
        path: 'appTable',
        component: () => import('@/views/table/projectmanager/appTable'),
        name: 'AppTable',
        meta: {
          title: '应用管理',
          noCache: true,
          icon: 'table',
          roles: ['operator'],
        }
      },
      {
        path: 'channelTable',
        component: () => import('@/views/table/projectmanager/channelTable'),
        name: 'ChannelTable',
        meta: {
          title: '渠道管理',
          noCache: true,
          icon: 'table',
          roles: ['operator'],
        }
      },
      {
        path: 'adTypeTable',
        component: () => import('@/views/table/projectmanager/adTypeTable'),
        name: 'AdTypeTable',
        meta: {
          title: '广告类型管理',
          noCache: true,
          icon: 'table',
          roles: ['operator'],
        }
      }
    ]
  },
  {
    path: '/accountmanager',
    component: Layout,
    redirect: '/accountmanager/appTable',
    name: 'Example',
    meta: {
      title: '人员管理',
      icon: 'peoples',
      roles: ['leader']
    },
    children: [
      {
        path: 'accountTable',
        component: () => import('@/views/table/personalmanager/accountTable'),
        name: 'AccountTable',
        meta: {
          title: '用户管理',
          noCache: true,
          icon: 'table',
          roles: ['admin']
        }
      },
      {
        path: 'user_role_Table',
        component: () => import('@/views/table/personalmanager/user_role_Table'),
        name: 'User_Role_Table',
        meta: {
          title: '角色管理',
          noCache: true,
          icon: 'table',
          roles: ['admin']
        }
      },
      {
        path: 'resourceTable',
        component: () => import('@/views/table/personalmanager/resourceTable'),
        name: 'ResourceTable',
        meta: {
          title: '资源管理',
          icon: 'table',
          roles: ['leader']
        }
      }
    ]
  },
  {
    path: '/sdkmanager',
    component: Layout,
    redirect: '/sdkmanager/sdklist',
    name: 'Component',
    meta: {
      title: 'SDK管理',
      icon: 'excel',
      roles: ['operator','developer', 'planner']
    },
    children: [
      {
        path: 'sdklist',
        component: () => import('@/views/table/sdkmanager/sdklisttable'),
        name: 'SDKManager',
        meta: {
          title: 'SDK模版管理',
          roles: ['leader'],
        }
      },
      {
        path: 'projectconfig',
        component: () => import('@/views/table/sdkmanager/projectconfigtable'),
        name: 'ProjectConfigManager',
        meta: {
          title: '配置表管理',
          roles: ['operator', 'planner'],
        }
      }, {
        path: 'projectconfiglist',
        component: () => import('@/views/table/sdkmanager/projectconfigtable_publish'),
        name: 'ProjectConfigList',
        meta: {
          title: '配置表发布记录',
          roles: ['operator','developer', 'planner'],
        }
      }]
  },
  {path: '*', redirect: '/404'}
];
