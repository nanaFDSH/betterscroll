<template>
  <div ref="wrapper" class="list-wrapper">
    <div class="scroll-content">
      <slot>
        <ul ref="list" class="list-content">
          <li @click="clickItem($event,item)" class="list-item" v-for="item in data">{{item}}</li>
        </ul>
      </slot>
      <!--下拉加载-->
      <slot name="pullup"
            :pullUpLoad="pullUpLoad"
            :isPullUpLoad="isPullUpLoad"
      >
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
    <!--下拉刷新-->
    <slot name="pulldown"
          :pullDownRefresh="pullDownRefresh"
          :pullDownStyle="pullDownStyle"
          :beforePullDown="beforePullDown"
          :isPullingDown="isPullingDown"
          :bubbleY="bubbleY"
    >
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <loading></loading>
          </div>
          <div v-else><span>{{refreshTxt}}</span></div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Bubble from '../bubble/bubble.vue'  // 画布下拉刷新的动画
  import Loading from '../loading/loading'  // 等待加载动画

  export default {
    props: {
      /**
       * 1 滚动的时候会派发scroll事件，会截流。
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
       */
      probeType: {
        type: Number,
        default: 1
      },
      /**
       * 点击列表是否派发click事件
       */
      click: {
        type: Boolean,
        default: true
      },
      /**
       * 是否开启横向滚动
       */
      scrollX: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发滚动事件
       */
      listenScroll: {
        type: Boolean,
        default: false
      },
      /**
       * 列表的数据
       */
      data: {
        type: Array,
        default: null
      },
      /**
       * 是否派发滚动到底部的事件，用于上拉加载
       */
      pullup: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发顶部下拉的事件，用于下拉刷新
       */
      pulldown: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发列表滚动开始的事件
       */
      beforeScroll: {
        type: Boolean,
        default: false
      },
      /**
       * 当数据更新后，刷新scroll的延时。
       */
      refreshDelay: {
        type: Number,
        default: 20
      },
      pullDownRefresh: {
        type: null,
        default: false
      },
      pullUpLoad: {
        type: null,
        default: false
      }
    },
    data () {
      return {
        beforePullDown: true,  // 判断向下刷下的显示
        isRebounding: false,   // 动画完成加载数据成功 更新完成
        isPullingDown: false,  // 判断向下刷新的loading的显示
        isPullUpLoad: false,   // 上拉加载文字显示
        pullUpDirty: true,   // 上拉加载 判断是否有更多数据
        pullDownStyle: '',  // 向下刷新的top值
        bubbleY: 0
      }
    },
    computed: {
      pullUpTxt () {
        return this.pullUpDirty ? '加载更多' : '没有更多数据了'
      },
      refreshTxt () {
        console.log(this.pullDownRefresh.txt)
        return this.pullDownRefresh && (this.pullDownRefresh.txt || '刷新成功')
      }
    },
    created () {
      this.pullDownInitTop = -50  // 向下刷新，初始位置
    },
    mounted () {
      // 保证在DOM渲染完毕后初始化better-scroll
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }

        let options = {
          probeType: this.probeType,
          click: this.click,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad,
          isPullUpLoad: false
        }

        // better-scroll的初始化
        this.scroll = new BScroll(this.$refs.wrapper, options)

        // 是否派发滚动事件
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }

        if (this.listenBeforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScrollStart')
          })
        }

        if (this.pullDownRefresh) {
          this._initPullDownRefresh()
        }

        if (this.pullUpLoad) {
          this._initpullUpLoad()
        }
      },
      disable () {
        // 代理better-scroll的disable方法
        this.scroll && this.scroll.disable()
      },
      enable () {
        // 代理better-scroll的enable方法
        this.scroll && this.scroll.enable()
      },
      refresh () {
        // 代理better-scroll的refresh方法
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        // 代理better-scroll的scrollTo方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        // 代理better-scroll的scrollToElement方法
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      clickItem (e, item) {
        console.log(e)
        this.$emit('click', item)
      },
      destroy () {
        this.scroll.destroy()
      },
      forceUpdate (dirty) { // 是否更数据
//        console.log(dirty)
//        console.log(this.pullDownRefresh)
//        console.log(this.isPullingDown)
        if (this.pullDownRefresh && this.isPullingDown) {
          this.isPullingDown = false
          this._reboundPullDown().then(() => {
            console.log('111')
            this._afterPullDown()
          })
        } else if (this.pullUpLoad && this.isPullUpLoad) {
          console.log('222')
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.pullUpDirty = dirty
          this.refresh()
        } else { //
          console.log('333')
          this.refresh()
        }
      },
      _initPullDownRefresh () { // 下拉刷新
        this.scroll.on('pullingDown', () => {
          this.beforePullDown = false
          this.isPullingDown = true
          this.$emit('pullingDown')
        })

        this.scroll.on('scroll', (pos) => {
          if (this.beforePullDown) {
            this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
            this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
          } else {
            this.bubbleY = 0
          }

          if (this.isRebounding) {
            this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
          }
        })
      },
      _initpullUpLoad () { // 向上加载
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true
          this.$emit('pullingUp')
        })
      },
      _reboundPullDown () {
        const {stopTime = 600} = this.pullDownRefresh
        return new Promise((resolve) => {
          setTimeout(() => {
            this.isRebounding = true
            this.scroll.finishPullDown()
            resolve()
          }, stopTime)
        })
      },
      _afterPullDown  () {
        setTimeout(() => {
          this.pullDownStyle = `top:${this.pullDownInitTop}px`
          this.beforePullDown = true
          this.isRebounding = false
          this.refresh()
        }, this.scroll.options.bounceTime)
      }
    },
    watch: {
      data () { // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
        setTimeout(() => {
          this.forceUpdate(true)
        }, this.refreshDelay)
      }
    },
    components: {
      Loading,
      Bubble
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .list-wrapper
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #fff
    font-size 16px
    .scroll-content
      position: relative
      z-index: 1
    .list-content
      position: relative
      z-index: 10
      background: #f5f5f5
      .list-item
        height: 60px
        line-height: 60px
        font-size: 18px
        padding-left: 20px
        border-bottom: 1px solid #e5e5e5

  .pulldown-wrapper
    position: absolute
    width: 100%
    left: 0
    display: flex
    justify-content center
    align-items center
    transition: all
    .after-trigger
      margin-top: 10px

  .pullup-wrapper
    width: 100%
    display: flex
    justify-content center
    align-items center
    padding: 16px 0
</style>
