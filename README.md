# betterscroll

> betterscroll 应用于上拉加载，下拉刷新本文章讲两种方式

1. 只是引用betterscroll插件，用于html页面的

2. vue-cli 搭建的，betterscroll, slot插槽的应用  

### 第一种 

引入插件

``` javascript

<script type="text/javascript" src="js/bscroll.min.js"></script>

```

> 外层容器 包裹内层容器 内层容器高于外层容器  （具体参见 [官网better-scroll](https://github.com/ustbhuangyi/better-scroll)）

> 下拉时，判断下拉位置，手势移动距离大于50px,执行下拉刷新的事件 touchEnd

> 上拉时，判断上拉位置，手势移动距离大于50px,执行上拉加载的事件 scrollEnd

> 唯一需要计算的，就是下拉距离 显示动画效果

``` html

 <div class="list-warpper orders_all" ref="list_container">

            <div name="container" style="padding-top: 2.05rem;" :style="containerStyle">
                <div v-for="item in order" class="order-box">              
                    ...
                </div>
                <!--上拉拉加载-->
                <div class="pullup-wrapper" v-if="pullUpLoad">
                    <div class="before-trigger" v-if="!isPullUpLoad">
                        <span>{{pullUpTxt}}</span>
                    </div>
                    <div class="after-trigger" v-else>
                        <img src="img/loading.gif">
                    </div>
                </div>
            </div>

            <div class="pulldown-wrapper" v-if="pullDownLoad" :style="pullDownStyle">
                <div class="before-trigger" v-if="!isPullDownLoad">
                    <span>正在更新</span>
                </div>
                <div class="after-trigger" v-else>
                    <img src="img/loading.gif">
                </div>
            </div>
 </div>
```

``` javascript

  data: {
     order: [],
     pullDownLoad: false,
     isPullDownLoad: false,
     pullUpLoad: false,
     isPullUpLoad: false,
     pullDownStyle: 'top:110px',
     containerStyle:''
   },
  created: function () {
     this.order_list(); 
  },        
  mounted() {
            this.$nextTick(() => {
                this._initScroll()
            })
  },
  computed: {
            pullUpTxt () {
                return this.pullUpDirty ? '加载更多' : '没有更多数据了'
            }
  },
  watch: {
            // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
            data () {
                setTimeout(() => {
                    this.forceUpdate(true)
                })
            }
  },
   methods: {
              _initScroll () {
                  // better-scroll的初始化
                  this.scroll = new BScroll(this.$refs.list_container, {
                      click: this.click
                  })
  
                  // 是否派发下拉事件，用于下拉刷新
                  this.scroll.on('touchEnd', (pos) => {
                  
                      console.log('刷新',pos)
                      
                      // 下拉动作
                      if (pos.y > 50) {
                      
                          this.pullDownLoad = true
                          this.isPullDownLoad = true
                          this.containerStyle = 'margin-top: 40px'
                          
                          setTimeout(() => {
                              this.pullDownLoad = false
                              this.containerStyle = 'margin-top: 0'
                              this.$emit('touchEnd')
                              this.order_list()
                          },1000)
                      }
                  })
  
                  // 是否派发滚动到底部事件，用于上拉加载
                  this.scroll.on('scrollEnd', () => {
                  
                      console.log('加载',this.scroll.y,(this.scroll.maxScrollY + 50))
                      
                      this.pullUpLoad = true
                      this.isPullUpLoad = true
                      
                      // 滚动到底部
                      if (this.scroll.y <= (this.scroll.maxScrollY + 50) && this.scroll.y < 0) {
                          this.$emit('scrollToEnd')
                          this.order_list()
                      }
                  })
  
              },
    order_list: function () {
    
     }                   
   }           
```

``` css
        .orders_all{
            position: fixed;
            width: 100%;
            top: 0;
            bottom: 0;
        }
        .pulldown-wrapper img,
        .pullup-wrapper img{
            width: 20px;
            height: 20px;
            display: block;
        }
        .pulldown-wrapper{
            position: absolute;
            width: 100%;
            left: 0;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-transition: all;
            transition: all;
        }
        .pullup-wrapper{
            width: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            padding: 16px 0;
        }
        .con{
            position: fixed;
            width: 100%;
            top: 0;
            bottom: 0;
        }
        .list-warpper{
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            background: #fff;
            font-size: 16px;
        }

```

### 第二种 

vue-cli 本项目应用此种方式

> 调用组件

``` javascript

import BetterScroll from '../components/scroll/BetterScrollSlot'

  export default{
    components: {'scroll': BetterScroll},
    data () {
      return {
        listdata: [],
        pullDownRefresh: {threshold: 90, stop: 40},
        pullUpLoad: true
      }
    },
    created () {
      this.loadData()
    },
    methods: {
      loadData () {
        this.$http.get('src/data/cartData.json', {'id': 123}).then((res) => {
          console.log(res.data.result.list)
          var data = res.data.result.list
          this.listdata = this.listdata.concat(data)
        }, (res) => {
          console.log(res)
        })
      },
      onPullingDown () {
        // 模拟更新数据
        console.log('下拉刷新数据pulling down and load data')
        setTimeout(() => {
          // 如果有新数据
          this.loadData()
        }, 2000)
      },
      onPullingUp () {
        // 更新数据
        console.log('上拉加载数据pulling up and load data')
        setTimeout(() => {
          // 如果有新数据
          if (this.listdata.length < 30) {
            this.loadData()
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate()
          }
        }, 2000)
      }
    }
  }

```

> slot 插槽

``` javascript
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
```




## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

项目地址

https://www.hijs.cc/betterscroll/#/hello

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
