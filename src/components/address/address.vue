<template>
  <div id="box">
  <div id="ress_box">
    <div class="address" v-if="(list.length=='0')">
      <img src="../../../static/images/wuposition.png" alt="">
      <p>你还没有添加服务地址哦！</p>
      <router-link tag="div" class="add_ress" to="/add_address/0">添加服务地址</router-link>
    </div>
    <!-- 添加信息 -->
    <div class="position_box">
      <mt-cell-swipe v-for="(item,index) in list" :key="index"
        :right="[
             {
                content: '删除',
                style: { background: '#eef3f4', color: '#EB5312' },
                handler:function(){del(index,item.id)}
                }
            ]">
        <b :class="{select:isSelector==index}" v-show="isSelector"></b>
        <div class="user_info" @click="select(index,item)">
          <div class="suer_name">{{item.linkmanName}}</div>
          <div class="tel">{{item.linkmanPhoneNum}}</div>
          <div class="location">{{item.linkmanDetails}}</div>
        </div>
        <div  class="revise_position" @click="modificationAddress(item)">
        </div>
      </mt-cell-swipe>
    </div>
    <div class="footer" v-show="(list.length>0)">
      <router-link class="accounts_btn" to="/add_address/0">添加服务地址</router-link>
    </div>
  </div>
  </div>
</template>
<script>
import common from "../../js/baseHttp"
import {setCookie,getCookie} from "../../js/cookie"
import {Toast} from "mint-ui"
import {removerStorage,getLocalStorage,setLocalStorage} from "../../js/session"
import { Indicator } from 'mint-ui';
  export default {
    data() {
      return {
        isSelector:"-1",
        list:[
         {name:"chenyao",tel:"1231223132132",position:"圳市南山区"}
        ]
      }
    },
    methods: {
//      GetQueryString(name){
//        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//        var r = window.location.search.substr(1).match(reg);
//        if(r!=null)return  unescape(r[2]); return null;
//      },
      modificationAddress(item){
        console.log(item);
        this.$store.commit("revisePOSITION",item);
        this.$router.push({path:"/add_address/1"})
      },
      del(index,id) {
        Indicator.open('正在删除');
        this.list[index].isShow=false;
        let url=common.apidomain+"/userSite/deleteUserSite?id="+id;
        this.$http.get(url).then(res=>{
          var data=res.data;
          if(data.code==="0000"){
            Indicator.close();
            if(id===getLocalStorage("OPTION")[0].id){
              removerStorage("OPTION");
            }
            this.getData();
            if(this.list.length===1){
                window.location.reload();
            };
            Toast("删除成功");
          }else{
            this.getData();
            Toast(data.error)
          }
        });
      },
      select(index,item){
        Indicator.open('请稍后');
        removerStorage("OPTION");
        setLocalStorage("OPTION",item);
        this.isSelector=String(index);
        setTimeout(()=>{
          Indicator.close();
          if(this.$store.state.previPosition==="/address"){
            return
          }
          this.$router.push({path:this.$store.state.previPosition});
          this.$store.commit("addPosition","/address");
        },100)
      },
      getData(){
        if(!getCookie()){
          this.$router.push({path:"/login"});
          return;
        }
        var url=common.apidomain+"/userSite/findlistUserSite?token="+getCookie();
        this.$http.get(url).then(res=>{
          var data=res.data;
          if(data.code==="0000"){
            Indicator.close();
            this.list=data.result;
          }else{
            Toast(data.error);
          }
        });
      }
    },
    watch:{

    },

    created() {
        this.getData();
    }
  }
</script>
<style lang="less">
  #box{
    >#ress_box{
      .address{
        width:100vw;
        margin:0 auto;
        text-align: center;
        margin-top:250/50rem;
        >img{
          width:380/50rem;
          height:380/50rem;
          margin:0 auto;
          display: block;
        }
        >.add_ress{
          width:280/50rem;
          height:88/50rem;
          background: #EB5312;
          border-radius: 8px;
          font-family: PingFangSC-Regular;
          font-size: 32/50rem;
          margin:0 auto;
          margin-top:.8rem;
          text-align:center;
          color: #FFFFFF;
          line-height:88/50rem;
          letter-spacing: 0;
        }
        >p{
          font-family: PingFangSC-Regular;
          font-size: 28/50rem;
          color: #4A4A4A;
          margin-top:28/50rem;
        }
      }
      >.position_box{
         /*padding-top:.5rem;*/
        >.mint-cell-swipe{
            height:160/50rem;
            position: relative;
            padding:0 30/50rem;
            width:100%;
            >.mint-cell-wrapper{
                overflow: visible;
                position:relative;
                height:100%;
                background:none;
                padding-left:0;
                border-bottom:1px solid rgba(0,0,0,0.1);
                >.mint-cell-value{
                  >.select{
                    position:absolute;
                    left:-.6rem;
                    top:0;
                    background:url(../../../static/images/sect.png) center center no-repeat;
                    background-size:100% 100%;
                    width:40/50rem;
                    height:40/50rem;
                  }
                  >.revise_position{
                      height: 44/50rem;
                      width:45/50rem;
                      position: absolute;
                      right: 0;
                      top:50%;
                      transform: translateY(-50%);
                      background:url(../../../static/images/bianji.png) center center no-repeat;
                      background-size: 100% 100%;
                    }
                   >.user_info{
                    height:160/50rem;
                    position: absolute;
                    font-size:28/50rem;
                    color:#4A4A4A;
                    padding-top:30/50rem;
                    top:0;
                    font-family: PingFangSC-Regular;
                    width:90%;
                    left:0;
                    >.usuer_name{
                      position: absolute;
                      left:0;
                      top:0;
                    }
                    >.tel{
                      padding-top:30/50rem;
                      position: absolute;
                      right:0;
                      padding-right:0;
                      top:0;
                    }
                    >.location{
                      position: absolute;
                      bottom:.5rem;
                      left:0;
                      padding-right:0;
                      height:48/50rem;
                      text-overflow: ellipsis;
                      font-size: 24/50rem;
                      color: #9B9B9B;
                      letter-spacing: 0;
                    }
                  }
                }
              }
              >.mint-cell-right{
                 background:#eef3f4;
                >.mint-cell-swipe-buttongroup{
                  >.mint-cell-swipe-button {
                        width:130/50rem;
                        // padding-top:1rem;
                        text-align: center;
                        font-family: PingFangSC-Light;
                        font-size: 22/50rem;
                        color: #EB5312;
                        letter-spacing: 0;
                        padding:0 10/50rem;
                        background:url(../../../static/images/del.png) center .5rem no-repeat !important;
                        background-size:60/50rem 60/50rem  !important;
                        line-height: 4.5rem;
                      }
                }
              }
          }
          >.mint-cell-swipe:last-of-type{
              >.mint-cell-wrapper{
                border-bottom: none;
              }
            }
          >.mint-cell:last-child{
            background:#fff;
          }
      }
      >.footer {
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
      margin-bottom:3rem;
    }
  }
</style>
