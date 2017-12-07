<template>
  <div class="login">
    <div class="box-mobile">
      <div class="loginbox">
        <input type="tel" maxlength="11" placeholder="手机号" v-model="mobile"/>
      </div>
      <div class="loginbox">
        <input type="tel" maxlength="4" class="sms-w" placeholder="验证码" v-model="smsCode"/>
      </div>
      <p class="login-btn" @click="Submit">登录</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        mobile: '',
        smsCode: '',
        login_type: 3
      }
    },
    methods: {
      Submit () {
        this.$api.get('http://localhost:8082/src/data/cartData.json', {
          mobile: this.mobile,
          verify_code: this.smsCode,
          login_type: this.login_type
        }).then((res) => {
          console.log(res)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .box-mobile
    background-color #fff
    font-size 16px
    padding-top 44px
    .loginbox
      overflow: hidden
      margin-top: 0.42rem
      padding-bottom: 0.22rem
      border-bottom: 1px solid #eaeaea
    .login-btn
      font-size: 0.36rem
      color: #9e9e9e
      width: 5.62rem
      height: 0.96rem
      line-height: 0.96rem
      -webkit-border-radius: 0.48rem
      -moz-border-radius: 0.48rem
      border-radius: 0.48rem
      background: #efefef
      margin: 0 auto
      text-align: center
      margin-top: 0.8rem
</style>
