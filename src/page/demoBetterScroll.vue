<template>
  <div class="con">
    <div class="list-warpper" ref="list_container">

      <div name="container" :style="containerStyle">

        <ul class="content box-flex">
          <li v-for="(item,index) in listdata">
            <img class="headImg" :src="item.productImage">
            <div class="content">
              <p>{{item.productName}}</p>
              <p>价格:￥{{item.productPrice}}</p>
              <a href="tel:133333">15057595743</a>
            </div>
          </li>
        </ul>

        <!--上拉拉加载-->
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else>
            <img src="../../static/img/loading.gif">
          </div>
        </div>
      </div>

      <div class="pulldown-wrapper" v-if="pullDownLoad" :style="pullDownStyle">
        <div class="before-trigger" v-if="!isPullDownLoad">
          <span>正在更新</span>
        </div>
        <div class="after-trigger" v-else>
          <img src="../../static/img/loading.gif">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    data () {
      return {
        listdata: [],
        pullDownLoad: false,
        isPullDownLoad: false,
        pullUpLoad: false,
        isPullUpLoad: false,
        pullDownStyle: 'top:10px',
        containerStyle: ''
      }
    },
    created () {
      this.loadData()
    },
    mounted () {
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

        this.scroll.on('touchEnd', (pos) => {
          // console.log('刷新', pos)
          // 下拉动作
          if (pos.y > 50) {
            this.pullDownLoad = true
            this.isPullDownLoad = true
            this.containerStyle = 'margin-top: 40px'
            setTimeout(() => {
              this.pullDownLoad = false
              this.containerStyle = 'margin-top: 0'
              this.$emit('touchEnd')
              this.loadData()
            }, 2000)
          }
        })

        // 是否派发滚动到底部事件，用于上拉加载
        this.scroll.on('scrollEnd', () => {
          // console.log('加载', this.scroll.y, (this.scroll.maxScrollY + 50))
          this.pullUpLoad = true
          this.isPullUpLoad = true
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50) && this.scroll.y < 0) {
            this.$emit('scrollToEnd')
            this.loadData()
          }
        })
      },
      loadData () {
        this.$http.get('src/data/cartData.json', {'id': 123}).then((res) => {
          // console.log(res.data.result.list)
          var data = res.data.result.list
          this.listdata = this.listdata.concat(data)
        }, (res) => {
          console.log(res)
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .con
    position: fixed
    width: 100%
    top: 44px
    bottom: 0
  .list-warpper
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #fff
    font-size: 16px
    .box-flex li
      display: flex
      align-items: flex-start
      .headImg
        width: 65px
        height: 65px
        margin: 16px 10px 15px 15px
        display: block
        border-radius: 50%
    .content
      flex: 1
      color: #212121
      font-size: 14px
      margin-top: 10px
      text-align: left
      p
        display: block
        margin: 10px 0 10px 0

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
    img
      width: 20px
      height: 20px
      display: block
  .pullup-wrapper
    width: 100%
    display: flex
    justify-content center
    align-items center
    padding: 16px 0
    img
      width: 20px
      height: 20px
      display: block

</style>
