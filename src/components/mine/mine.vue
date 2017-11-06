<template>
  <div id="box">
    <div class="picture_back">
      <img src="../../../static/images/bg3.png" alt="">
    </div>
    <div class="picture_list">
      <div class="category_info">
        <router-link class="text_info" to="/order">
            <i class="icon"></i>
            我的订单
        </router-link>
      </div>
      <div class="category_info">
        <router-link class="text_info" to="/address">
            <i class="icon position"></i>
            地址管理
        </router-link>
      </div>
       <div class="category_info">
        <a class="text_info" @click="tel" >
            <i class="icon service"></i>
            客服热线
        </a>
      </div>
      <div class="category_info">
        <router-link class="text_info" to="/feedback" >
            <i class="icon suggestion"></i>
            意见反馈
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import {MessageBox} from "mint-ui"

    export default{
        data(){
            return{

            }
        },
        methods:{
          tel(){
            window.location.href = "tel:4009991891";
          },

        },
        created() {
        }
    }
</script>
<style scoped lang="less">
  .picture_back{
    width:100%;
    height:400/50rem;
    background:url(../../../static/images/bg1.png)center no-repeat;
    background-size:100% 100%;
    position:relative;
    >img{
      display: block;
      width:200/50rem;
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
    }
  }
  .picture_list{
    width:100%;
    display: flex;
     flex-wrap:wrap;
    >.category_info{
      width:50%;
      background:#FFF;
      height:300/50rem;
      border:1px solid #e6e6e6;
      border-left:none;
      border-top:none;
      >.text_info{
        display: block;
        width:100%;
        line-height:320/50rem;
        text-align:center;
        height:100%;
        color:rgba(74,74,74,1);
        font-family: PingFangSC-Regula;
        font-size: 32/50rem;
        >.icon{
          display: block;
          width:50/50rem;
          height:55.7/50rem;
          background:url(../../../static/images/wodedingdan.png)center no-repeat;
          background-size: 100% 100%;
          margin:0 auto;
          position:relative;
          top:50%;
          transform:translateY(-50%);
        }
        >.position{
          background:url(../../../static/images/position2.png)center no-repeat;
          background-size: 100% 100%;
        }
        >.service{
          background:url(../../../static/images/sever.png)center no-repeat;
          background-size: 100% 100%;
        }
        >.suggestion{
           background:url(../../../static/images/yijian.png)center no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    >.category_info:nth-of-type(even){
      border-right:none;
    }
  }
</style>


