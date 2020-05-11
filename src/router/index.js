import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login'),
    hidden: true
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/register'),
    hidden: true
  },

  {
    path: '/forget-password',
    name: 'ForgetPass',
    component: () => import('@/views/auth/forget-password'),
    hidden: true
  },

  {
    path: '/reset-password',
    name: 'ResetPass',
    component: () => import('@/views/auth/reset-password'),
    hidden: true
  },

  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },

  {
    path: '/auth',
    component: Layout,
    name: 'Auth',
    meta: { title: 'Auth', icon: 'example' },
    hidden: true,
    children: [
      {
        path: 'confirm',
        name: 'Confirm',
        component: () => import('@/views/auth/confirm'),
        meta: { title: 'confirm', noCache: true }
      },
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },

  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/inventory',
    component: Layout,
    redirect: '/inventory/host',
    name: 'Inventory',
    meta: { title: 'CMDB', icon: 'example' },
    children: [
      {
        path: 'host',
        name: 'Host',
        component: () => import('@/views/host/index'),
        meta: { title: '服务器列表', icon: 'host' }
      },
      {
        path: 'hostgroup',
        name: 'Hostgroup',
        component: () => import('@/views/hostgroup/index'),
        meta: { title: '主机组列表', icon: 'group' }
      },
      {
        path: 'playbook',
        name: 'Playbook',
        redirect: '/inventory/playbook/list',
        // redirect: '/',
        component: () => import('@/views/playbook/index'),
        meta: { title: 'Playbook', icon: 'book' },
        children: [
          {
            path: 'list',
            name: 'PlaybookList',
            // component: () => import('@/views/host/index'),
            component: () => import('@/views/playbook/list'),
            meta: { title: 'Playbook列表' }
            // hidden: true
          },
          {
            path: 'detail/:id(\\d+)',
            component: () => import('@/views/playbook/detail'),
            name: 'PlaybookDetail',
            meta: { title: 'Playbook Detail' },
            hidden: true
          }
        ]
      },
      {
        path: 'task',
        name: 'Task',
        redirect: '/inventory/task/list',
        component: () => import('@/views/task/index'),
        meta: { title: '任务列表', icon: 'task' },
        children: [
          {
            path: 'list',
            name: 'taskList',
            component: () => import('@/views/task/list'),
            meta: { title: 'Task列表' }
          },
          {
            path: 'detail/:id(\\d+)',
            component: () => import('@/views/task/detail'),
            name: 'TaskDetail',
            meta: { title: 'Task Detail' },
            hidden: true
          }
        ]
      }
    ]
  },

  {
    path: '/ansible',
    component: Layout,
    redirect: '/inventory/task/list',
    name: 'Ansible',
    meta: { title: 'Ansible 任务', icon: 'form' },
    children: [
      {
        path: 'task',
        name: 'AnsibleTask',
        component: () => import('@/views/task/list'),
        // redirect: '/inventory/task/list',
        meta: { title: 'Task列表', icon: 'task' }
      },
      {
        path: 'options',
        name: 'Options',
        component: () => import('@/views/options/index'),
        meta: { title: 'playbook参数配置', icon: 'options' }
      },
      {
        path: 'edit_task',
        name: 'EditTask',
        component: () => import('@/views/task/edit-task'),
        meta: { title: '执行 PlayBook', icon: 'edit' }
      }
    ]
  },

  {
    path: '/file',
    component: Layout,
    // redirect: '/file/list',
    name: 'File',
    // meta: {
    //   title: '文件模块',
    //   icon: 'file'
    // },
    children: [
      {
        path: 'list',
        name: 'FileList',
        component: () => import('@/views/filerepo/index'),
        meta: { title: '文件管理', icon: 'file' }
        // hidden: true
      },
    ]
    // children: [
    //   {
    //     path: 'menu1',
    //     component: () => import('@/views/nested/menu1/index'), // Parent router-view
    //     name: 'Menu1',
    //     meta: { title: 'Menu1' },
    //     children: [
    //       {
    //         path: 'menu1-1',
    //         component: () => import('@/views/nested/menu1/menu1-1'),
    //         name: 'Menu1-1',
    //         meta: { title: 'Menu1-1' },
    //         hidden: true
    //       },
    //       {
    //         path: 'menu1-2',
    //         component: () => import('@/views/nested/menu1/menu1-2'),
    //         name: 'Menu1-2',
    //         meta: { title: 'Menu1-2' },
    //         children: [
    //           {
    //             path: 'menu1-2-1',
    //             component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
    //             name: 'Menu1-2-1',
    //             meta: { title: 'Menu1-2-1' }
    //           },
    //           {
    //             path: 'menu1-2-2',
    //             component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
    //             name: 'Menu1-2-2',
    //             meta: { title: 'Menu1-2-2' }
    //           }
    //         ]
    //       },
    //       {
    //         path: 'menu1-3',
    //         component: () => import('@/views/nested/menu1/menu1-3'),
    //         name: 'Menu1-3',
    //         meta: { title: 'Menu1-3' }
    //       }
    //     ]
    //   },
    //   {
    //     path: 'menu2',
    //     component: () => import('@/views/nested/menu2/index'),
    //     meta: { title: 'menu2' }
    //   }
    // ]
  },

  {
    path: 'external-link',
    name: 'InterSystem',
    component: Layout,
    meta: {
      title: "内部系统",
      icon: 'link'
    },
    children: [
      {
        path: 'http://10.0.0.225:8080',
        meta: { title: 'Jenkins', icon: 'jenkins' }
      },
      {
        path: 'http://zabbix.yipurse.cn:8899/zabbix',
        meta: { title: 'Zabbix', icon: 'zabbix' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
