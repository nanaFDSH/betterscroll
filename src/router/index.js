import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/page/HelloWorld'
import ScrollList from '@/page/ScrollList'
import BetterScrollList from '@/page/BetterScrollList'
import demoBetterScroll from '@/page/demoBetterScroll'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'HelloWorld'
      }
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
    },
    {
      path: '/demoBetterScroll',
      name: 'demoBetterScroll',
      component: demoBetterScroll
    }
  ]
})
