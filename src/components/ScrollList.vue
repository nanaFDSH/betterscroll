<template>
  <div class="con">
    <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
      <ul class="box-flex">
        <li v-for="(item,index) in listdata">
          <img :src="item.productImage">
          <div class="content">
            <p>{{item.productName}}</p>
            <p>价格:￥{{item.productPrice}}</p>
            <a href="tel:133333">15057595743</a>
          </div>
        </li>
      </ul>
    </v-scroll>
  </div>
</template>

<script>
  import Scroll from './ScrollSlot'

  export default{
    components: {'v-scroll': Scroll},
    data () {
      return {
        counter: 1,   //  默认已经显示出15条数据 count等于一是让从16条开始加载
        num: 15,      //  一次显示多少条
        pageStart: 0, //  开始页数
        pageEnd: 0,   //  结束页数
        listdata: [],  //  下拉更新数据存放数组
        downdata: []   //  上拉更多的数据存放数组
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      getList () {
        this.$http.get('src/data/cartData.json', {'id': 123}).then((res) => {
          console.log(res.data.result.list)
          var data = res.data.result.list
          this.listdata = this.listdata.concat(data)
        }, (res) => {

        })
      },
      onRefresh (done) {
        this.getList()
        done() // call done
        console.log('更新中')
      },
      onInfinite (done) {
        this.getList()
        done() // call done
        console.log('加载中')
      }
    }
  }
</script>

<style>
  /*flex布局*/
  .box-flex li{
    display: flex;
    align-items: flex-start;
  }
  .box-flex img{
    width: 65px;
    height: 65px;
    margin: 16px 10px 15px 15px;
    display: block;
    border-radius: 50%;
  }
  .box-flex .content{
    flex: 1;
    color: #212121;
    font-size: 14px;
    margin-top: 10px;
    text-align: left;
  }
  .box-flex .content p{
    display: block;
    margin: 10px 0 10px 0;
  }
  .con{
    position: fixed;
    width: 100%;
    top: 44px;
    bottom: 0;
  }
</style>
