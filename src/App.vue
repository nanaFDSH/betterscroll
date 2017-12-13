<template>
  <div id="app">
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>
  import Tab from 'page/tab'

  export default {
    components: { Tab },
    name: 'app'
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
#app
  background-color #222
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  font-size: $font-size-medium
  li
    height: 1rem
    text-align: center
    line-height: 1rem
</style>
