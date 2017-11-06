<template>
    <div>
      <div class="keep_container" v-for="(item,index) in dataList" :key="index">
        <h4 class="order_number">交易订单号  {{item.order.id}} <span class="status">{{item.orderState}}</span></h4>
        <ul class="mui-table-view" >
          <li class="mui-table-view-cell"   v-for="(item1,index) in item.services"  @click="sendDetailed(item,index)" >
            <p class="cause_top">
              <span class="cause_type">{{item1.serviceFullName}}</span>
              <span class="mui-badge">￥{{item1.price1}}</span>
            </p>
            <p class="cause">
              <span class="cause_name">
               {{item1.serviceFullName}}
              </span>
              <span class="sum">
               ￥{{item1.price1}}
              </span>
            </p>
          </li>
        </ul>
        <div class="defray_content">
          <div class="defray_right open_price">
            <p>
              共 {{item.serviceTotalSize}} 件
              合计
              <span class="defray_price">￥{{item.serviceTotalWaitPay}} </span>
              <br>
              <span class="defray_describe defray" v-if="true">已付款&nbsp;&nbsp;&nbsp;</span>{{item.serviceTotalPay}}<br>
              <span class="defray_describe defray" v-if="true">已退款&nbsp;&nbsp;&nbsp;</span>{{item.serviceTotalRefund}}
            </p>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  import common from "../../js/baseHttp"
  import {getCookie} from "../../js/cookie"
  import { Indicator } from 'mint-ui';
    export default {
      props:["isAlert"],
        data() {
            return {
              dataList:'',
            }
        },
        methods: {
          sendDetailed(item,index){
            this.$store.commit("changeOrder",item);
            this.$router.push({path:"/staymoney"});
          },
        },
        created() {
          let token=getCookie();
          let url=common.apidomain+"/order/getorders?type=3&token="+token;
          this.$http.get(url).then(res=>{
            var data=res.data.result;
            this.dataList=data;
            this.isAlert.isShow3=false;
            if(this.dataList.length===0){
              this.isAlert.isShow3=true;
            }
          })
        }
    }
</script>
<style scoped lang="less">

  .defray{
    color:#C8C8CB !important;
  }
</style>


