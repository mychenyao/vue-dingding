<template>
  <div>
    <!-- 1.0 利用mint-ui中的header组件实现整个系统的头部 -->
   <!--  <mt-header  class="title" fixed :title="title" v-if="isWix">
    </mt-header> -->
    <!-- 2.0 利用vue-router的 <router-view>进行占位 -->
    <router-view></router-view>

    <!-- 3.0 利用mui中的tabbar组件实现系统的底部 -->
     <nav class="footer_nav" v-show="isShow">
      <router-link class="route_link" to="/home">
        <span class="icon home"></span>
        <span class="text">首页</span>
      </router-link>
      <router-link to="/order" class="route_link">
        <span class="icon order">
        </span>
        <span class="text">订单</span>
      </router-link>
      <router-link class="route_link" to="/mine">
        <span class="icon mine"></span>
        <span class="text">我的</span>
      </router-link>
    </nav>
  </div>
</template>
<script>
  import {isWeixin,Fn} from "./js/isWeixin"
  import {getLocalStorage,setLocalStorage,getSession,setIsOpenId,getIsOpenId,removerStorage} from "./js/session"
  import {getOpenID,setOpenID} from "./js/cookie"
  import common from "./js/baseHttp"
  import {setCookie,getCookie} from "./js/cookie"
  import {title} from "./js/document_title"
  import {Toast} from 'mint-ui';
    export default{
        data(){
            return{
              isShow:true,
              isWix:true,
              title:"叮叮快修"
            }
        },
        methods:{

          GetQueryString(name){

            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
          },

          fetchDate(){
              if(this.$store.state.name!=""){
                    this.title=this.$store.state.name;
              }
            let path=this.$route.path;
              var titleRouter=path.substring(1,3);
                title(titleRouter);
            if(path==="/home" || path==="/order" || path==="/mine"){
              this.isShow=true;
              return;
            }
              this.isShow=false;
          },
        },
        mounted(){
        },
        created() {
          Fn(this);
//          console.log(isWeixin());
//调用监听路由方法           start
          this.fetchDate();
//调用监听路由方法           end
 
          if(isWeixin()&&(getOpenID()===""||getOpenID()===undefined)){
            if(!this.GetQueryString("code")) {
              let appId="wxb5b451d85729641a";
              setIsOpenId("isOpenKey",true);
              window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri=http%3a%2f%2fwww.dingdingkuaixiu.com%2findex.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
              return;
            }
            if(this.GetQueryString("code")&&getIsOpenId("isOpenKey")){
              var state=this.GetQueryString("state"), _this=this,code=this.GetQueryString("code");
              let url=common.apidomain+"/authCodeInfo/getopenidbycode?code="+code+"&state="+state;
              this.$http.get(url).then(res=>{
                let data=res.data;
                setOpenID(data.result);
                //通过openID 拿到token
                let openUrl=common.apidomain+"/authCodeInfo/gettoken?openid="+getOpenID();  //通过openid拿到token
                this.$http.get(openUrl).then(res=>{
                            let data=res.data;
                            removerStorage("OPTION")
                            if(data.code==="0000"){
                              setCookie(data.result.token);
                            }else{
                              Toast(data.error);
                              _this.$router.push({path:"/login"})
                            }
                    })
              });
            }
            }
        },
        watch: {
          // 如果路由有变化，会再次执行该方法
          "$route": "fetchDate"
        }
    }
</script>
<style scoped lang="less">
.footer_nav{
  width:100%;
  height:98/50rem;
  position:fixed;
  bottom:0;
  border-top:1px solid #E6E6E6;
  left:0;
  display: flex;
    >.route_link{
      flex:1;
      background:#fff;
      position:relative;
      >.text{
        font-family: PingFangSC-Regular;
        font-size: 22/50rem;
        color: #9B9B9B;
        position:absolute;
        left:50%;
        bottom:0.08rem;
        transform:translateX(-50%);
      }
      >.icon{
        display: block;
        transform:translateY(30%);
        margin:0 auto;
        height:40/50rem;
        width:40/50rem;
      }
      >.order{
          background:url(../static/images/dingdan2.png) center center no-repeat;
          background-size: 100% 100%;
      }
       >.mine{
          background:url(../static/images/wode1.png) center center no-repeat;
          background-size: 100% 100%;
      }
      >.home{
          background:url(../static/images/home.png) center center no-repeat;
          background-size: 100% 100%;
      }
    }
    >.router-link-active{
      >.text{
        color:#EB5312;
}
       >.order{
          background:url(../static/images/dingdan1.png) center center no-repeat;
          background-size: 100% 100%;
      }
       >.mine{
          background:url(../static/images/wo.png) center center no-repeat;
          background-size: 100% 100%;
      }
      >.home{
          background:url(../static/images/home2.png) center center no-repeat;
          background-size: 100% 100%;

      }
    }
}
input{
  margin-top:500px;
  width:200px;
  height:30px;
}
  .title{
    background:#000;
    height:88/50rem;
  }
  .mui-tab-item {
      >.mine{
          height:40/50rem;
          width:40/50rem;
          background:url(../static/images/wode1.png) center center no-repeat;
          background-size: 100% 100%;
          display: inline-block;
      }
    }
     .mui-bar-tab{
      height:98/50rem;
     }
</style>


