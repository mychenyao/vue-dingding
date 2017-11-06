<template>
    <div>
      <div class="keep_container" v-for="(item,index) in dataList" :key="index">
        <h4 class="order_number">交易订单号 {{item.order.id}}<span class="status">{{item.orderState}}</span></h4>
        <ul @click="sendDetailed(item,index)" class="mui-table-view">
          <li class="mui-table-view-cell" v-for="(item1,index) in item.services">
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
          <div class="defray_right">
            <p>
              共 {{item.serviceTotalSize}} 件
              合计
              <span class="defray_price">￥{{item.serviceTotalWaitPay}}</span>
              <!--<span class="defray_describe">(含维修不费）</span>-->
            </p>
            <div class="defray_bottom" v-if="item.order.state=='12'" @click="sendComment(index,item)">去评价</div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  import common from "../../js/baseHttp"
  import {setCookie,getCookie} from "../../js/cookie"
  import { Indicator } from 'mint-ui';
    export default {
    props:["isLodow","isAlert"],
        data() {
            return {
                dataList:""
            }
        },
        methods: {
          sendDetailed(item,index){
            this.$store.commit("changeOrder",item);
            this.$router.push({path:"/staymoney"});
          },
          sendComment(index,item){
              if(item.order.state=='12'){
                this.$router.push({path:"/comment"})
              }else{
                this.$store.commit("changeOrder",item);
              }
          }
        },
        created() {
          console.log(this.$store.state.orderDetails);
          let token=getCookie();
          let url=common.apidomain+"/order/getorders?type=2&token="+token;
          this.$http.get(url).then(res=>{
            var data=res.data.result;
            this.dataList=data;
            this.isAlert.isShow2=false;
            if(this.dataList.length===0){
              this.isAlert.isShow2=true;
            }
//            console.log(this.dataList)
          })
        }
    }
</script>
<style scoped lang="less">

</style>


