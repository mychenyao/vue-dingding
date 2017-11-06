<template>
  <div id="box">
    <textarea autofocus placeholder="请在此处您输入对我们的宝贵意见。" v-model="text">
    </textarea>
    <div class="footer">
      <div class="accounts_btn" @click="submit">保存</div>
    </div>
  </div>
</template>
<script>
  import {Toast} from "mint-ui"
  import common from "../../js/baseHttp"
   import {setCookie,getCookie} from "../../js/cookie"
    export default{
        data(){
            return{
              text:"",
              isFocus:false
            }
        },
        methods:{
          submit(){
            var token=getCookie();
            if(!token){return Toast("未能有效登陆")}
            if(this.text.trim()){
              let url=common.apidomain+"/feedback/savefeedback"
              this.$http.post(url,{"content":this.text,"token":token}).then(res=>{
                let data=res.data.result;
                if(data){
                   Toast(data);
                   setTimeout(()=>{ this.$router.back(-1)},1500)
                }
              })
            }else{
              Toast("内容不能为空");
            }
          }
        },
        created() {
        }
    }
</script>
<style scoped lang="less">
 textarea{
  width:100%;
   border:none;
   overflow: auto;
   background:transparent;
   height:6rem;
   font-family: NotoSansHans-Regular;
   font-size: 28/52rem;
 }
 .footer {
   width: 100%;
   position: fixed;
   bottom: 0;
   left: 0;
   height: 98/50rem;
   line-height: 98/50rem;
   background: #FFFFFF;
   font-family: PingFangSC-Medium;
   color: #EB5312;
   letter-spacing: 0;
   > .accounts_btn {
     height: 100%;
     display: inline-block;
     background: #EB5312;
     width:100%;
     text-align: center;
     font-family: PingFangSC-Regular;
     font-size: 32/50rem;
     color: #FFFFFF;
     letter-spacing: 0;
   }
 }
</style>


