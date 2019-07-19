import Vue from 'vue'
import Router from 'vue-router'
import LoginView from '@/views/login/Common'
import db from 'utils/localstorage'
// import request from 'utils/request'

Vue.use(Router)

let constRouter = [
  {
    path: '/login',
    name: '登录页',
    component: LoginView
  },
  {
    path: '/index',
    name: '首页',
    redirect: '/home'
  }
]

let router = new Router({
  routes: constRouter
})

const whiteList = ['/login']
let asyncRouter

// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  }
  let token = db.get('USER_TOKEN')
  let user = db.get('USER')
  let userRouter = get('USER_ROUTER')// problem: 为什么不用db.get()方法
  if (token.length && user) {
    if (!asyncRouter) {
      if (!userRouter) {
        // request.get(`menu/${user.username}`).then((res) => {
        //   asyncRouter = res.data
        //   save('USER_ROUTER', asyncRouter)
        //   go(to, next)
        // })
      } else {
        asyncRouter = userRouter
        go(to, next)
      }
    } else {
      next()
    }
  } else {
    next('/login')
  }
})

function go (to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)
  router.addRoutes(asyncRouter)
  next({...to, replace: true})
}

function filterAsyncRouter (routes) {
  return routes.filter((route) => {
    // let component = route.component
    // if (component) {
    //   switch (route.component) {
    //     case 'MenuView':
    //       route.component = MenuView
    //       break
    //     case 'PageView':
    //       route.component = PageView
    //       break
    //     case 'EmptyPageView':
    //       route.component = EmptyPageView
    //       break
    //     case 'HomePageView':
    //       route.component = HomePageView
    //       break
    //     default:
    //       route.component = view(component)
    //   }
    //   if (route.children && route.children.length) {
    //     route.children = filterAsyncRouter(route.children)
    //   }
    //   return true
    // }
  })
}

function get (name) {
  return JSON.parse(localStorage.getItem(name))
}

// function save (name, data) {
//   localStorage.setItem(name, JSON.stringify(data))
// }

export default router
