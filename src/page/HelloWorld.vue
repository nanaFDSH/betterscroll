<template>
  <div name="hello" class="hello">
    <div>
      <h4>{{msg}}</h4>
      <div>
        <span>ScrollList----<a href="https://www.cnblogs.com/sichaoyun/p/6647458.html">地址</a></span>
        <p>
          将上拉加载，下拉刷新写成组件，slot插槽引用
        </p>
      </div>
      <div>
        <span>BetterScrollList----<a href="https://github.com/ustbhuangyi/better-scroll">github地址</a></span>
        <p>
          iscroll的改写，vue组件在github有4000多个星星，此组件现在可用于三级联动，定点选择，幻灯片播放
          这个例子，将官网的第一个demo，单拿出来，去掉冗余的可操作项，简单的插槽，上拉加载，下拉刷新
        </p>
      </div>
      <div>
        <span>demo</span>
        <p>
          此例子还是基于betterscroll，不同的是，不使用组件，只需引用js即可，单页使用
          注意：单页的下拉刷新需要根据实际场景设置距离，没有做画布动画，脚手架搭建的例子，见BetterScrollList
          有下拉刷新动画
        </p>
      </div>
      <div>
        <p>
          ps:实现原理很简单，当你下拉时，你的y轴距离位移50px，说明，你在进行下拉刷新操作，
          当你上拉加载是，你的y轴位移，与容器y轴长度差50px,好了，你可以进行上拉加载操作
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        msg: '插件介绍'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .hello
    font-size 16px
    color #fff
    min-height 100%
    text-align left
    margin 0 0 0 0.3rem
    padding 0 0 0.2rem 0
    div
      overflow hidden
      h4
       margin 0.2rem 0
      span
        margin 0.2rem 0
        font-size 0.3rem
      a
        color #00a0e9
      p
        font-size 18px
        line-height 30px
        margin 0.2rem 0

</style>
