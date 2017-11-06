<template>
  <div id="box" ref="box">
        <div class="login">
          <div class="tel">
            <p>手机号</p>
            <input type="tel" class="telNumber" placeholder="请输入手机号" v-model="tel" @keyup="telTest(tel)">
          </div>
          <div class="tel test_and_verify">
             <p>验证码</p>
                <input type="tel" class="telNumber test" placeholder="请输入验证码"  v-model="test">
                <span @click="send" :class="{send_to:isSendTo}">{{point}}</span>
        </div>
      </div>
        <button class="submit" @click="submit" :class="{active:(tel.length==11)&&test!=''}">确定</button>
        <p class="state"> 点击确定表示您已同意叮叮快修<router-link to="/userProtocol" tag="span">《用户协议》</router-link></p>
</div>
</template>
<script>

 import {Toast} from "mint-ui"
 import { Indicator } from 'mint-ui';
 import {setCookie,getCookie} from "../../js/cookie"
 import {getOpenID,setOpenID} from "../../js/cookie"
 import {getSession} from "../../js/session"
 import common from "../../js/baseHttp"
export default {
  data () {
    return {
    	 height:window.innerHeight,
       test:"",
       tel:"",
       tonken:"",
       isSendTo:false,
       point:"获取验证码"
    }
  },
  methods:{
    telTest(val){
      if(val.length>=11&&!(/^1[34578]\d{9}$/.test(this.tel))){
          Toast("手机号格式不正确");
      }
    },
    send(){
      if(this.isSendTo){
        return;
      }
      if(this.tel.length!==11){
        Toast("手机号格式不正确")
        return;
      }
      if(this.tel.length>=11&&!(/^1[34578]\d{9}$/.test(this.tel))){
        Toast("手机号格式不正确");
        return false
      }else{
             var url=common.apidomain+"/authCodeInfo/getValidationCode?phoneNum="+this.tel;
              this.$http.get(url).then(res=>{
                   Toast(res.data.result)
              });
            this.isSendTo=true;
          var count=60;
          var pic=setInterval(()=>{
            count--;
            this.point=count+"秒后重新发送";
            if(count===0){
              clearInterval(pic);
              this.isSendTo=false;
              this.point="获取验证码"
          }
          },1000)
      }
    },
    submit(){
       var cityId= getSession()[0].id;
      if(!this.test){
        Toast("短信验证码错误");
      }else{
          var url =common.apidomain+"/authCodeInfo/confirmLogin";
          let param={"phoneNum":this.tel,"authCode":this.test,"cityId":cityId,"openId":getOpenID()};
            this.$http.post(url,param).then(res=>{
              var data=res.data;
              var _this=this;
              if(data.code=="0000"){
                this.tonken=data.result.token;
                Toast("登录成功");
                setCookie(this.tonken);
                setTimeout(function(){
                     _this.$router.push({path:"/home"})
                },1000)
              }else{
                  this.test="";
                  Toast(data.error);
              }
            })
      }
    }
  },
   mounted(){
     
   },
    created(){
      let _this=this;
      // if(this.$route.path==='/login'){
      //   alert("k")
      //   window.addEventListener("popstate", function(e) { 
      //               _this.$router.push({path:_this.$store.state.path});
      //       }, true); 
      // }
      
        
      Indicator.close();
    }
}
 
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  #box{
    height:100vh;
    margin:0;
  }
.login{
    // margin-top:30%;
    >.tel{
     display: flex;
     padding:.4rem 32/50rem;
     border-bottom: 1px solid rgba(0,0,0,0.1);
     >p{
      width:2.5rem;
      height:70/50rem;
      font-size: 28/50rem;
      line-height: 70/50rem;
     }
     >.telNumber{
      border:none;
      flex:1;
      padding:0;
      height:70/50rem;
      margin-bottom: 0;
     }
     >span{
     line-height: 70/50rem;
      width:3rem;
      text-align: right;
      color:#EB5312;
      font-size: 26/50rem;
     }
     >.send_to{
      color:#ccc;
       width:5rem;
       margin-left:.8rem;
     }
    }
}
.submit{
  width:686/50rem;
  height:88/50rem;
  border:none;
  background: #C8C8CB;
  border-radius: 8px;
  margin:0 auto;
  display: block;
  color:#fff;
  font-size: 28/50rem;
  margin-top:2rem;
}
.active{
   background: #EB5312;
}
#box{
  width:100%;
    padding-top:2rem;
  background:#fff;
}
.state{
  text-align: center;
  font-size: 24/50rem;
  line-height: 2rem;
  >span{
    color:#EB5312;
  }

}
</style>
