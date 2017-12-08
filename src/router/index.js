import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ScrollList from '@/components/ScrollList'
import BetterScrollList from '@/components/BetterScrollList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/scroll',
      name: 'ScrollList',
      component: ScrollList
    },
    {
      path: '/betterscroll',
      name: 'BetterScrollList',
      component: BetterScrollList
    }
  ]
})
