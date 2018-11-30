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
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

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
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [
  {
    path:'/component',
    component:Layout,
    redirect: '/component/dropzone',
    name:'Component',
    meta: {
      title: '组件',
      icon: 'component',
      roles: ['operator']
    },
    children: [
      {
        path: 'dropzone',
        component: () => import('@/views/dropZone/dropzone'),
        name: 'DropzoneDemo',
        meta: {
          title: '上传文件',
          roles: ['operator'],
        }
      }]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: {
      title: '数据管理',
      icon: 'example',
      roles: ['operator','planner','developer','market','leader']
    },
    children: [
      {
        path: 'cline',
        hidden: true,
        component: () => import('@/views/complexChart/index'),
        name: 'ComplexLineChart',
        meta: {
          title: '统计图表',
          noCache: true ,
          icon: 'chart',
          roles: ['operator','planner','developer','market','leader']
        }
      },
      {
        path: 'tree',
        name: 'Tree',
        hidden: true,
        component: () => import('@/views/tree/index'),
        meta: {
          title: '树状图',
          icon: 'tree',
          roles: ['operator','planner','developer','market','leader']
        }
      },
      {
        path: 'line',
        component: () => import('@/views/charts/line'),
        name: 'LineChart',
        hidden: true,
        meta: {
          title: '线形表',
          noCache: true ,
          icon: 'chart',
          roles: ['operator','planner','developer','market','leader']
        }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/select'),
        meta: {
          title: '广告数据管理',
          icon: 'table',
          roles: ['operator','planner','developer','market','leader']
        }
      },
      {
        path: 'yixin',
        component: () => import('@/views/table/yixin'),
        name: 'YixinTable',
        meta: {
          title: '移信数据下载',
          noCache: true ,
          icon: 'table',
          roles: ['operator','planner','developer','market','leader']
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
      icon: 'example',
      roles: ['operator'],
    },
    children: [
      {
        path: 'appTable',
        component: () => import('@/views/table/appTable'),
        name: 'AppTable',
        meta: {
          title: '应用管理',
          noCache: true ,
          icon: 'table',
          roles: ['operator'],
        }
      },
      {
        path: 'channelTable',
        component: () => import('@/views/table/channelTable'),
        name: 'ChannelTable',
        meta: {
          title: '渠道管理',
          noCache: true ,
          icon: 'table',
          roles: ['operator'],
        }
      },
      {
        path: 'adTypeTable',
        component: () => import('@/views/table/adTypeTable'),
        name: 'AdTypeTable',
        meta: {
          title: '广告类型管理',
          noCache: true ,
          icon: 'table' ,
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
      title: '系统管理',
      icon: 'example',
      roles: ['leader']
    },
    children: [
      {
        path: 'accountTable',
        component: () => import('@/views/table/accountTable'),
        name: 'AccountTable',
        meta: {
          title: '用户管理',
          noCache: true ,
          icon: 'table',
          roles: ['admin']
        }
      },
      {
        path: 'user_role_Table',
        component: () => import('@/views/table/user_role_Table'),
        name: 'User_Role_Table',
        meta: {
          title: '角色管理',
          noCache: true ,
          icon: 'table',
          roles: ['admin']
        }
      },
      {
        path: 'role_perms_Table',
        component: () => import('@/views/table/role_perms_Table'),
        name: 'Role_Perms_Table',
        meta: {
          title: '权限管理',
          noCache: true ,
          icon: 'table' ,
          roles: ['admin']
        }
      },
      {
        path: 'resourceTable',
        component: () => import('@/views/table/resourceTable'),
        name: 'ResourceTable',
        meta: {
          title: '资源管理',
          noCache: true ,
          icon: 'table' ,
          roles: ['leader']
        }
      }
    ]
  },

  { path: '*', redirect: '/404'}
];


//   path: '/nested',
//   component: Layout,
//   redirect: '/nested/menu1',
//   name: 'Nested',
//   meta: {
//     title: 'Nested',
//     icon: 'nested'
//   },
//   children: [
//     {
//       path: 'menu1',
//       component: () => import('@/views/nested/menu1/index'), // Parent router-view
//       name: 'Menu1',
//       meta: { title: 'Menu1' },
//       children: [
//         {
//           path: 'menu1-1',
//           component: () => import('@/views/nested/menu1/menu1-1'),
//           name: 'Menu1-1',
//           meta: { title: 'Menu1-1' }
//         },
//         {
//           path: 'menu1-2',
//           component: () => import('@/views/nested/menu1/menu1-2'),
//           name: 'Menu1-2',
//           meta: { title: 'Menu1-2' },
//           children: [
//             {
//               path: 'menu1-2-1',
//               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
//               name: 'Menu1-2-1',
//               meta: { title: 'Menu1-2-1' }
//             },
//             {
//               path: 'menu1-2-2',
//               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
//               name: 'Menu1-2-2',
//               meta: { title: 'Menu1-2-2' }
//             }
//           ]
//         },
//         {
//           path: 'menu1-3',
//           component: () => import('@/views/nested/menu1/menu1-3'),
//           name: 'Menu1-3',
//           meta: { title: 'Menu1-3' }
//         }
//       ]
//     },
//     {
//       path: 'menu2',
//       component: () => import('@/views/nested/menu2/index'),
//       meta: { title: 'menu2' }
//     }
//   ]
// },
//
// {
//   path: 'external-link',
//   component: Layout,
//   children: [
//     {
//       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
//       meta: { title: 'External Link', icon: 'link' }
//     }
//   ]
// },
