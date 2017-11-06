<template>
    <div id="box">
      <div id="tetailed_box">
      <div class="title">
        {{data.orderState}}
        <div v-if="ordrerState(data.order.state)&&surplusMinute>0">
          <p class="surplus_tate" v-if="data.order.state=='01'">
            剩余{{surplusMinute}}分钟自动关闭
          </p>
          <p class="surplus_tate" v-else v-show="master(data.order.state)"> 维修师傅：{{data.order.master}} 工号：{{data.order.masterId}}</p>
        </div>
      </div>
      <!--师傅位置-->

      <!--师傅位置end-->
      <div class="info">
          <div class="saver_type">
            <div class="saver_title">
              服务类别：
            </div>
            <p class="text">{{title}}</p>
          </div>
        <div class="saver_type">
            <div class="saver_title">
              服务时间：
            </div>
            <p class="text">{{data.order.appointmentDatetime | moment('YYYY-MM-DD HH:mm:ss')}}</p>
          </div>
        <div class="saver_type">
            <div class="saver_title">
              服务地址：
            </div>
            <p class="text">{{data.order.linkmanDetails}}</p>
          </div>
        <div class="saver_type">
            <div class="saver_title">
              联系电话：
            </div>
            <p class="text">{{data.order.linkmanPhoneNum}}</p>
          </div>
      </div>
      <!--已完成-->
      <div class="keep_container" v-if="true">
        <ul class="mui-table-view">
          <li class="mui-table-view-cell" v-for="(item,index) in data.services">
            <p class="cause_top">
              <span class="cause_type">{{item.serviceFullName}}</span>
            </p>
            <p class="cause">
              <span class="cause_name" v-text="item.serviceTags" v-if="item.serviceTags!='null'">

              </span>
              <span class="sum">
                x{{item.serviceSize}}
              </span>
            </p>
          </li>
        </ul>
        <div class="defray_content">
          <div class="defray_right open_price">
            <p>
              上门费
              <span class="defray_price">￥ {{data.services[0].price1}}</span>
            </p>
            <p>
                合计
              <span class="defray_price">￥ {{data.serviceTotalCreditAmount+data.serviceTotalWaitPay}}</span>
                <!--{{data.serviceTotal}}-->
            </p>
            <p v-if="data.serviceTotalCreditAmount">
            优惠金额
              <span class="defray_price">￥{{data.serviceTotalCreditAmount}} </span>
              <!--<span class="defray_describe">(含维修不费）</span>-->
            </p><p v-if="data.serviceTotalWaitPay!=undefined&&data.serviceTotalWaitPay!=''">
            应付款
              <span class="defray_price">￥{{data.serviceTotalWaitPay}} </span>
              <!--<span class="defray_describe">(含维修不费）</span>-->
            </p>
          </div>
        </div>
      </div>
      <div class="identifier">
        <p>订单编号：{{data.order.id}}</p>
        <p> 下单时间：{{data.order.createTime | moment('YYYY-MM-DD HH:mm:ss')}} </p>
        <p>
        </p>
      </div>
      <!--结算和评价-->
         <div class="footer" v-if="isFooter(data.order.state)">
           <a class="accounts_btn" @click="comment(data.order)" href="javascript:;" 
           v-if="data.order.state=='12'||data.order.state=='18'">去评价</a>
              <a class="accounts_btn" href="javascript:;" @click="defray(data.order.id)" v-if="affirmOrder(data.order.state)">确认付款</a>
              <a class="accounts_btn cancel" href="javascript:;"
              v-if="isCancel(data.order.state,data.order.serviceBeginTime)"  @click="cancel">取消订单</a>
        <p class="amount" v-if="data.order.state!='12'">合计：<span>￥{{data.serviceTotal}}</span></p>
      </div>
      </div>
        <transition name="fad">
      <div class="alert" v-if="isAlert" @click="isCanc" id="alert">
    
          <div style="position:absolute;bottom:0;width:100vw;background:#fff">
            <mt-radio
              align="right"
              title="取消原因"
              v-model="value"
              :options="options">
            </mt-radio>
            <textarea v-model="textValue" id="" cols="30" rows="10" v-if="value==='0'">
            </textarea>
            <div class="footer">
              <div class="accounts_btn" @click="submit">确认取消</div>
            </div>
          </div>
       
      </div>
       </transition> 
    </div>
</template>
<script>
  import {timeDate} from "../../js/datetime"
  import { MessageBox } from 'mint-ui';
  import common from "../../js/baseHttp"
  import {Toast} from "mint-ui"
  import moment from "moment"
  import {getCookie,getOpenID} from "../../js/cookie"
  import {getSession} from "../../js/session"
  import {isWeixin,onBridgeReady} from "../../js/isWeixin"
  import { Indicator } from 'mint-ui';
  import {ths,orderStatus,cancel,affirm,Footer,isMaster} from "./js/isStatus"
  export default {
    watch:{
      value:function(){
      }
    },
        data() {
            return {
              isAlert:false,
              value:"",
              serviceBeginTime:"",
              textValue:"",
              options : [
              {
                label: '不要这个服务了',
                value: '不要这个服务了'
              },
              {
                label: '信息填写错误，重新预约',
                value: '信息填写错误，重新预约'
              },
              {
                label: '临时有事时间无法安排',
                value: '临时有事时间无法安排'
              },
              {
                label: '师傅无法准时上门',
                value: '师傅无法准时上门'
              },
              {
                label: '师傅缺少工具或配件无法维修',
                value: '师傅缺少工具或配件无法维修'
              },
              {
                label: '产品标价不合理',
                value: '产品标价不合理'
              },
              {
                label: '其他',
                value: '0'
              }
            ],
              classTitle:this.$store.state.classTitle,
              data:"",
              surplusMinute:"",
              title:"",
              inventoryList:[
                {
                name:"压缩机线束",
                price:"压缩机线束"
              },{
                name:"压缩机线束",
                price:"压缩机线束"
              }
              ],
              startDate:"", //服务开始时间
              createdDate:"",//服务创建时间
              isShow:false,//显示隐藏wweikuan
              accomplish:false,
            }
        },
      mounted() {
        var timeCreater = this.data.order.createTime;
        // console.log(new Date()-0);
        var ti = (new Date().getTime() - timeCreater);
        this.surplusMinute = Math.abs(moment(ti).format("mm") - 30);
        var _this = this;
        var pic = setInterval(function () {
//          if (this.surplusMinute < 0) {
//            clearInterval(pic);
//            let url = common.apidomain + "/order/cancel";
//            let params = {"orderId": _this.data.order.id, "token": getCookie()};
//            _this.$http.post(url, params).then(res => {
//              var data = res.data;
//              var _this = this;
//              if (data.code === "0000") {
//                Toast("取消成功");
//                clearInterval(pic);
//                setTimeout(() => {
//                  _this.$router.back(-1);
//                  return;
//                }, 1500);
//              } else {
//                return;
//                Toast(data.error);
//                clearInterval(pic);
//              }
//              clearInterval(pic);
//              return;
//            });
//
          ti = ((new Date().getTime() - timeCreater));
          this.surplusMinute = Math.abs(moment(ti).format("mm") - 30);
        },60000);
      },
        methods: {

          isCanc(event){
             if(event.target.id==="alert"){
              this.isAlert=false;
             }
          },


          submit(){
            var value;
            if(this.value==='0'){
            value=this.textValue
            }else{
              value=this.value
            }
            if(!value){
              Toast("请选择原因");
              return;
            }
            this.isAlert=false;
            var _this=this;
            let url =common.apidomain+"/order/cancel";
                let params={"orderId":_this.data.order.id,"token":getCookie(),"cancelContent":value};
                _this.$http.post(url,params).then(res=>{
                  var data=res.data;
                  var _this=this;
                  if(data.code=="0000"){
                    Toast("取消成功");
                    setTimeout(()=>{
                    
                       window.location.href="http://www.dingdingkuaixiu.com/#/order";
                    },800);
                  }else{
                     Toast(data.error);
                     window.location.href="http://www.dingdingkuaixiu.com/#/order";
                  }
                })

          },
          comment(masterInfo){
            this.$store.commit("changeComment",masterInfo);
            this.$router.push({path:"/comment"});
          },
          isShowWk(){
           this.isShow=!this.isShow;
           if(this.isShow){
             setTimeout(()=>{
               this.$refs.myUl.style.height=21*(this.inventoryList.length+1)+"px";
               this.$refs.myUl.style.transition="height .5s";
             },1)
           }else{
             this.$refs.myUl.style.height="0px";
           }
          },
          cancel(){
            this.isAlert=true;
          },
        
          defray(orderID){   //订单支付；
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
                  onBridgeReady({appid:re.appid,timestamp:JSON.stringify(re.timestamp),noncestr: re.nonce_str,package:re.package, signType:re.signType,paySign:re.paySign},this)
                }
              }else{
                Indicator.close();
                Toast(data.error);
              }
            })
          },


 //显示剩余时间 start
          ordrerState(input){
            return orderStatus(input);
          },
 //显示剩余时间 end

//显示按钮 start
       //是否显示确认付款按钮 start
          affirmOrder(input){
            return affirm(input)
          },
      //是否显示确认付款按钮 end

      //显示底部 start
          isFooter(input){
            return Footer(input);
          },
      //显示底部 end

      //显示取消 start
          isCancel(input,serviceBeginTime){
            return cancel(input,serviceBeginTime);
          },
      //显示取消 end
      //master info start
          master(input){
            return isMaster(input);
          }
      //master info end
//显示按钮 end
        },
        created() {
          ths(this);
          this.data=this.$store.state.orderDetails;
          console.log(this.data);
          this.serviceBeginTime=this.data.order.serviceBeginTime
          for(var k in this.classTitle){
            if(this.data.order.fLabelBusiness===k){
                this.title=this.classTitle[k];
             break;
            }
          }
          let xiaItem=this.data.order.createTime;
          let startDate= this.data.order.serviceBeginTime;
          if(startDate){
             this.startDate=startDate;
           }else{
            this.startDate=xiaItem;
           }
          let type=this.$route.params.type;
          let newDate=new Date()-0;
          let shenYu=30*60-(newDate-xiaItem)/60;
        },
    }
</script>

<style scoped lang="less">
  #box{
    /*师傅位置*/
    >#tetailed_box{
      >.footer{
        width:100%;
        position:fixed;
        bottom:0;
        left:0;
        height:98/50rem;
        text-align: right;
        line-height: 98/50rem;
        background: #FFFFFF;
        font-family: PingFangSC-Medium;
        font-size: 32/50rem;
        color: #EB5312;
        font-weight: 600;
        letter-spacing: 0;
        >.accounts_btn{
          height:100%;
          float:right;
          display: inline-block;
          background: #EB5312;
          width:200/50rem;
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: 32/50rem;
          color: #FFFFFF;
          letter-spacing: 0;
        }
        >.amount{
          float:right;
          padding-right:.5rem;
          font-family: PingFangSC-Regular;
          font-size: 32/50rem;
          color: #4A4A4A;
          letter-spacing: 0;
          >span{
            color: #EB5312;
          }
        }
        >.cancel{
          color: #FFFFFF;
          background: #C8C8CB;
        }
      }
      >.serve_position{
        width:100%;
        padding:25/50rem 1.6rem;
        background:#fff;
        margin-bottom:.4rem;
        font-family: PingFangSC-Regular;
        font-size: 24/50rem;
        color: #4A4A4A;
        letter-spacing: 0;
        position:relative;
        >i{
          position:absolute;
          background:red;
        }
        >.position_icon{
          width:30/50rem;
          height:38/50rem;
          left:25/50rem;
          top:50%;
          background:url(../../../static/images/positio.png)center center no-repeat;
          background-size:100% 100%;
          transform:translateY(-50%);
        }
        >.right_icon{
          width:16/50rem;
          height:26/50rem;
          right:25/50rem;
          top:50%;
          background:url(../../../static/images/right1.png)center center no-repeat;
          background-size:100% 100%;
          transform:translateY(-50%);

        }
        >.right_wk{
          background:url(../../../static/images/bottom3.png)center center no-repeat;
          background-size:100% 100%;
          width:26/50rem;
          height:16/50rem;
        }
        >.inventory{
          font-size: 24/50rem;
          color: #EB5312;
          letter-spacing: 0;
          float:right;
        }
      }
      >.title{
        width:100%;
        height:160/50rem;
        /*<!--line-height:160/50rem;-->*/
        padding-left:32/50rem;
        padding-top:47/50rem;
        margin-bottom:.2rem;
        background:url(../../../static/images/bg2.png) center center no-repeat;
        background-size:100% 100%;
        font-family: PingFangSC-Medium;
        font-size: 32/50rem;
        color: #FFFFFF;
        letter-spacing: 0;
        >div{
          >.surplus_tate{
            font-size: 24/50rem;
            color: #FFFFFF;
            letter-spacing: 0;
          }
        }

      }
      >.wk{
        padding-left:.7rem;
        margin-bottom:0;
      }
    }
    .identifier{
      padding:32/50rem;
      padding-top:.2rem;
      >p{
        font-family: PingFangSC-Regular;
        font-size: 22/50rem;
        color: #9B9B9B;
        letter-spacing: 0;
        line-height: .7rem;
      }
    }
    .info{
      width:100%;
      background:#fff;
      padding:20/50rem 0;
      >.saver_type{
        margin-top:.3rem;
        display: flex;
        font-family: PingFangSC-Regular;
        font-size: 24/50rem;
        color: #9B9B9B;
        letter-spacing: 0;
        >.saver_title{
          width:21%;
          margin-left:32/50rem;
        }
        >.text{
          flex:1;
          color:#4a4a4a;
          font-size: 24/50rem;
        }
      }
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
    .mui-table-view:before{
      background:none;
    }
    /*底部*/
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
        >p{
          font-size:22/50rem;
          color:#9B9B9B;
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
    .district_list{
      height:0;
      margin:0;
      width:100%;
      background:#fff;
      padding:.3rem 0;
      overflow: hidden;
      border-top:1px solid rgba(0,0,0,0.1);
    }
    .district_list > li{
      overflow: hidden;
      padding:0px 32/50rem;
      font-family: PingFangSC-Regular;
      font-size: 22/50rem;
      color: #9B9B9B;
      letter-spacing: 0;
      >.price_right{
        float:right;
      }
      >.type_left{
        float:left;
      }
    }
  }
/*alert*/
  .mint-actionsheet{
      text-align:left;
      padding:0 20px;
      background:#fff;
    .mint-actionsheet-listitem{
      padding-left:20px;
    }
  }
  .alert{
    background:rgba(0,0,0,0.5);
    width:100%;
    position:absolute;
    left:0;
    top:0;
    z-index: 99;
    height: 100%;
  }
  textarea{
    width:686/50rem;
    margin:0;
    height:146/50rem;
    margin-top:5px;
    transform:translateX(0.7rem);
    background: #D8D8D8;
    border-radius: 8/50rem;
    border:none;

  }
  &.fad-enter-active, &.fad-leave-active{
  transition: all .4s ease
  }

  &.fad-enter, &.fad-leave-active{
   transform:translateY(1000px);
  }

</style>
<style lang="less">
  .mint-msgbox-wrapper
    .quX{
      position:absolute;
      right:0;
      top:0;
      background:url(../../../static/images/conse1.png)center center no-repeat;
      background-size:100% 100%;
      background-origin: content-box;
      font-size: 20px;
      width:50px;
      padding:10px;
      height:50px;
    }
  .queRen{
    background:rgba(0,0,0,.2);
    color:#fff;
    line-height: 31px;
    font-size: 17px;
  }
  .mint-actionsheet-list{

  }
  .mint-actionsheet-listitem{
    font-family: PingFangSC-Regular;
    font-size: 28/50rem;
    color: #4A4A4A;
    letter-spacing: 0;
  }
  .mint-cell:last-of-type{
    .mint-cell-wrapper{
    }
  }
  .mint-radiolist-title{
    text-align:center;
    font-family: PingFangSC-Regular;
    font-size: 32/50rem;
    color: #4A4A4A;
    line-height:3em;
    letter-spacing: 0
  }
  .mint-radio-label{
    font-family: PingFangSC-Regular;
    font-size: 28/50rem;
    color: #4A4A4A;
    letter-spacing: 0;
  }
  .footer {
    width: 100%;
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
