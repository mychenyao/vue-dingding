import Vue from 'vue'
import Router from 'vue-router'
const Home = resolve => require(["@/components/Home"], resolve)
const mine = resolve => require(["@/components/mine/mine"], resolve)
const feedback = resolve => require(["@/components/feedback/feedback"], resolve)
const household_appliance = resolve => require(["@/components/household_appliance/household_appliance"], resolve)
const wash = resolve => require(["@/components/wash/wash"], resolve)
const comment = resolve => require(["@/components/comment/comment"], resolve) // re评论组件solve
const order = resolve => require(["@/components/order/order"], resolve) //订单页面
const detail = resolve => require(["@/components/order/detailed"], resolve) //订单详情
const address = resolve => require(["@/components/address/address"], resolve) //地址管理
const add_address = resolve => require(["@/components/address/add_address"], resolve) //天假地址
const affirmorder = resolve => require(["@/components/order/affirmorder"], resolve) //确认订单
const serve_date = resolve => require(["@/components/order/serve_date"], resolve) //服务时间
const login = resolve => require(["@/components/login/login"], resolve) //服务时间
const staypaymentWie = resolve => require(["@/components/savertype/staypaymentWie"], resolve) //代付尾款
const stayserve = resolve => require(["@/components/savertype/stayserve"], resolve) //代服务
const complete = resolve => require(["@/components/savertype/complete"], resolve) //已完成
const staymoney = resolve => require(["@/components/savertype/staymoney"], resolve) //代付款
const stayserveContent = resolve => require(["@/components/savertype/stayserveContent"], resolve) //服务中
const retreatTk = resolve => require(["@/components/savertype/retreatTk"], resolve) //服务中
const userProtocol = resolve => require(["@/components/login/userProtocol"], resolve) //用户协议
const saverInfo = resolve => require(["@/components/order/saverInfo"], resolve) //用户协议
const orderSuccPages =resolve => require(["@/components/orderSuccess/page"], resolve)

Vue.use(Router);

export default new Router({
    routes: [
      {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/staypaymentWie',
            component: staypaymentWie
        }, {
            path: '/stayserve',
            component: stayserve
        }, {
            path: '/retreatTk',
            component: retreatTk
        }, {
            path: '/complete',
            component: complete
        }, {
            path: '/stayserveContent',
            component: stayserveContent
        }, {
            path: '/staymoney',
            component: staymoney
        },{
            path: '/orderSuccPages',
            component: orderSuccPages
        },
        {
            path: '/home',
            component: Home
        }, {
            path: '/login',
            component: login
        },
        {
            path: '/mine',
            component: mine
        },
        {
            path: '/feedback',
            component: feedback
        },
        {
            path: '/saverInfo',
            component: saverInfo
        },
        {
            path: '/appliance',
            component: household_appliance
        },
        {
            path: '/wash/:id',
            component: wash
        },
        {
            path: '/order',
            component: order
        }, {
            path: '/comment',
            component: comment
        }, {
            path: '/address',
            component: address
        }, {
            path: '/serve_date',
            component: serve_date
        }, {
            path: '/add_address/:index',
            component: add_address
        },
        {
            path: '/detail/:type',
            component: detail
        },
        {
            path: '/affirmorder',
            component: affirmorder
        },
        {
            path: '/userProtocol',
            component: userProtocol
        },
 {
            path: '/orderSuccPages/:status',
            component: orderSuccPages
        }

    ]
})
