<template>
  <div class="con">
    <scroll class="wrapper"
            ref="scroll"
            :data="listdata"
            :pullDownRefresh="pullDownRefresh"
            :pullUpLoad="pullUpLoad"
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp">
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
    </scroll>
  </div>
</template>

<script>
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
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .con
    position: fixed
    width: 100%
    top: 44px
    bottom: 0
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
</style>
