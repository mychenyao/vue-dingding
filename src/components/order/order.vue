<template>
  <div id="box">
   <mt-navbar v-model="selected">
		  <mt-tab-item id="1">进行中</mt-tab-item>
		  <mt-tab-item id="2">已完成</mt-tab-item>
		  <mt-tab-item id="3">已取消</mt-tab-item>
</mt-navbar>
<!-- tab-container -->
<mt-tab-container v-model="selected" :swipeable="bool">
  <mt-tab-container-item id="1">
    <!--待付款-->
   	<div class="keep_container" v-for="(item,index) in dataList" :key="index">
   		<h4 class="order_number">交易订单号 {{item.order.id}}<span class="status">{{item.orderState}}</span></h4>
   		<ul @click="sendDetailed(item,index)"  class="mui-table-view">
		    <li class="mui-table-view-cell" v-for="(item1,index) in item.services">
		        <p class="cause_top">
              <span class="cause_type">{{item1.serviceFullName}}</span>
              <span class="mui-badge">￥{{item1.price1}}</span>
            </p>
		        <p class="cause">
              <span class="cause_name">
                <!--故障原因-->
                    {{item1.serviceName}}
              </span>
              <span class="sum">
               x{{item1.serviceSize}}
              </span>
		        </p>
		    </li>
		</ul>
    <div class="defray_content">
        <div class="defray_right">
          <p>
            共 {{item.serviceTotalSize}} 件
           合计
            <span class="defray_price">￥{{item.serviceTotalWaitPay}} </span>
            <!--<span class="defray_describe" >(含维修不费）</span>-->
          </p>
         <div class="defray_bottom" @click="sendDetailed(item,index)"  v-if="isAffirm(item.order.state)">确认支付</div>
        </div>
    </div>
   	</div>

    <div class="alert" v-if="isAlert.isShow1">
      <img src="../../../static/images/wudingdan.png" alt="">
      <p>你还没有订单哦！</p>
      <router-link tag="div" class="accounts" to="/home">立即下单</router-link>
    </div>
  </mt-tab-container-item>
  <mt-tab-container-item id="2">
    <accomplish :isLodow="lodow" v-if="isShow" :isAlert="isAlert"></accomplish>


    <div class="alert" v-if="isAlert.isShow2">
      <img src="../../../static/images/wudingdan.png" alt="">
      <p>你还没有订单哦！</p>
      <router-link tag="div" class="accounts" to="/home">立即下单</router-link>
    </div>
  </mt-tab-container-item>
  <mt-tab-container-item id="3" v-if="isShow" >
    <cancel :isAlert="isAlert"></cancel>
    <div class="alert" v-if="isAlert.isShow3">
      <img src="../../../static/images/wudingdan.png" alt="">
      <p>你还没有订单哦！</p>
        <router-link tag="div" class="accounts" to="/home">立即下单</router-link>
    </div>
  </mt-tab-container-item>
</mt-tab-container>
  </div>
</template>
<script>
 import {setCookie,getCookie} from "../../js/cookie"
const accomplish = resolve =>require(["./accomplish"],resolve);
const cancel = resolve =>require(["./cancel"],resolve);
 import common from "../../js/baseHttp"
 import {Toast} from "mint-ui";
 import { Indicator } from 'mint-ui';
 import {AFFIRM} from "@/components/savertype/js/isStatus"
export default {
  components:{
    accomplish,
    cancel
  },
  data () {
    return {
      bool:true,
      j:true,
      isAlert:{
        isShow1:true,
        isShow2:true,
        isShow3:true
      },
      value:"",
      isShow:false,
    	selected:"1",
      dataList:[],
      lodow:false,
//      sendHttpData:"",
    }
  },

  methods:{
    isAffirm(input){
     return AFFIRM(input);
    },
    active(){
      alert("k")
    },
    sendDetailed(item,index){
      this.$store.commit("changeOrder",item);
      this.$router.push({path:"/staymoney"});
    },
    getData(){
      Indicator.open('加载中');
        var token=getCookie();
      if(token){
          let url=common.apidomain+"/order/getorders";
          this.$http.get(url,{params:{"token":token,"type":"1"}}).then(res=>{
            var data=res.data.result;
            if(res.data.code==="0000"){
              this.dataList=data;
              Indicator.close();
              this.isShow=true;
              this.isAlert.isShow1=false;
              if(this.dataList.length===0){
                this.isAlert.isShow1=true;
              }
            }else{
              Toast(res.data.error);
              Indicator.close();
              setTimeout(()=>{
//                this.$router.push({path:"/login"})
              },2500)
            }
          });
        }else{
          Indicator.close();
          this.$router.push({path:"/login"})
        }
    }
  },
  watch:{

  },
   mounted(){
    },
    created(){
      this.getData();

    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .alert{

    width:100vw;
    height:85vh;
    text-align: center;

    >img{
      transform:translateY(50%);
      width:380/50rem;
      height: 380/50rem;
    }
    >.accounts{
      font-family: PingFangSC-Regular;
      font-size: 32/50rem;
      color: #FFFFFF;
      letter-spacing: 0;
      transform:translateY(5.2rem);
      background: #EB5312;
      margin:0 auto;
      border-radius: 4px;
      width:280/50rem;
      line-height: 88/50rem;
      height: 88/50rem;
    }
    >p{
      font-family: PingFangSC-Regular;
      font-size: 28/50rem;
      color: #4A4A4A;
      transform:translateY(4.5rem);
    }
  }

a{
	color:#000;
}
#box{
  font-family: PingFangSC-Regular;
  margin-bottom:1.96rem;
.mint-tab-item{
	font-family: PingFangSC-Regular;
	font-size: 32/50rem;
	padding-top:.7rem;
	letter-spacing: 0;
}
>.mint-navbar{
	height:100/50rem;
}
}
.mint-navbar {
	.mint-tab-item.is-selected{
		border-bottom: 3px solid #EB5312;
		color:#EB5312;
	}
}
.mint-tab-item-label{
	font-family: PingFangSC-Regular;
	font-size: 32/50rem;
	letter-spacing: 0;
}
.keep_container{
	background:#fff;
	margin-top:.5rem;
	>.order_number{
		font-family: PingFangSC-Regular;
		font-size:24/50rem;
		color: #9B9B9B;
		height:60/50rem;
		padding:0 32/50rem;
		line-height:60/50rem;
		font-weight: normal;
		letter-spacing: 0;
		>.status{
			color: #EB5312;
			float:right;
		}
	}
    .cause_top{
      margin-bottom:2%;
      color: #4A4A4A;
      letter-spacing: 0;
      .mui-badge,.cause_type{
        background:none;
        font-family: PingFangSC-Regular;
        font-size: 28/50rem;

    }
     > .mui-badge{
        float:right;
       padding-right:0;
      }
	}
	.mui-table-view-cell{

		font-family: PingFangSC-Regular;
		font-size: 28/50rem;
		color: #4A4A4A;
    border-bottom:1px solid rgba(230,230,230,0.50);
    padding:30/50rem 34/50rem;
		letter-spacing: 0;
		>.cause{
      letter-spacing: 0;
      /*overflow: hidden;*/
      height:auto;
			>.cause_name{
				float:left;
			}
			>.sum{
				float:right;
			}
			>.cause_name,.sum{
        color: #C8C8CB;
				font-size: 22/50rem;
				font-family: PingFangSC-Regular;

				letter-spacing: 0;
			}
		}
	}
}
.mui-table-view-cell:after{
  background:none;
}
.mui-table-view-cell:last-of-type{
  border-bottom:none;
}

  /*支付*/
.defray_content{
  width:100%;
  overflow: hidden;
  padding:14/50rem;
  padding-right:.6rem;
  >.defray_right{
    float:right;
   overflow: hidden;
    height:120/50rem;
    position:relative;
    width:12rem;
    >p{
      font-size:22/50rem;
      color:#9B9B9B;
      text-align: right;
      >.defray_price{
        font-size: 28/50rem;
        color: #000;
        letter-spacing: 0;
      }
      >.defray_describe{
        color:#000;
      }

      >.final{
        font-size: 28/50rem;
        color: #EB5312;
        letter-spacing: 0;
      }
    }

   >.defray_bottom{
      background: #EB5312;
      border: 1px solid #EB5312;
     position:absolute;
     right:0;
     bottom:.1rem;
     font-size: 24/50rem;
     color: #FFFFFF;
     letter-spacing: 0;
      border-radius: 28/50rem;
      width:150/50rem;
      text-align: center;
      margin-left:1.2rem;
      float: right;
      line-height: 55/50rem;
      height:56/50rem;
    }
  }
.open_price{
  height:auto;
}
}
  /*&.fade-enter-active, &.fade-leave-active{*/
    /*transition: all 2s ease*/
  /*}*/

 /*&.fade-enter, &.fade-leave-active{*/
   /*transform:translateX(100px);*/
  /*}*/


</style>
