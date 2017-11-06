<template>
    <div id="box">
      <img src="./images/cuss.png" alt="" v-if="$route.params.status==='1'">
      <img src="./images/defeated.png" alt="" v-else>
      <div class="keep_container" v-for="(item,index) in dataList" :key="index" v-if="true">
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
              <!--v-if="isAffirm(item.order.state)"-->
            </p>
            <div class="defray_bottom" @click="sendDetailed(item.order.id)"  v-if="$route.params.status === '5'">确认支付</div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  import {getCookie,getOpenID} from "../../js/cookie"
  import {Toast} from "mint-ui"
  import common from "../../js/baseHttp"
  import {isWeixin,onBridgeReady} from "../../js/isWeixin"
    export default {
        data() {
            return {
              dataList:[]
            }
        },
        methods: {
          sendDetailed(orderID){
            if(!getOpenID()){
              return Toast("未授权OPENID");
            }
            Indicator.open('正在请求支付请稍后');
            let url1=common.apidomain+"/fapayjournalaccount/payorder";
            let str= returnCitySN["cip"]+','+returnCitySN["cname"];
            let param={openId:getOpenID(),orderId:orderID,payType:"1",token:getCookie(),userIp:str.split(",")[0]};     //调支付接口
            this.$http.post(url1,param).then(res=>{
              Indicator.close();
              let data=res.data;
              if(data.code==="0000"){
                if(isWeixin()){
                  Indicator.close();
                  let re=data.result;
                  Indicator.close();
                  onBridgeReady({appid:re.appid,timestamp:JSON.stringify(re.timestamp),noncestr: re.nonce_str,package:re.package, signType:re.signType,paySign:re.paySign})
                }
              }else{
                Indicator.close();
                Toast(data.error);
              }
            })
          }
        },
        created() {
          this.dataList.push(this.$store.state.orderDetails);
        }
    }
</script>
<style scoped lang="less">
#box{
  img {
    height: 240/50rem;
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
  .defray_bottom{
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

    .defray_bottom{
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
</style>


