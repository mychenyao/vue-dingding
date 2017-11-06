<template>
    <div id="box">
       <div class="location_box" v-for="(item,index) in positionInfo" :key="index" @click="addPosition">
         <p class="border_image"></p>
         <p class="bottom"></p>
         <i class="border_img_bottom"></i>
         <b class="position_icon"></b>
          <div class="content">
              <p>{{item.linkmanDetails}}{{item.linkmanArea}} {{item.linkmanAddress}}</p>
          </div>
         <b class="right_arrow"></b>
       </div>
      <!--add服务-->
      <div class="add_serve first">
          <div class="addserve_tite">
             <p>{{title}}</p>
            <div class="right_add" @click="returnFirst">
              <b></b>
              
              <p> 添加服务</p>

            </div>
          </div>
      </div>

<!--故障统计-->
 <div class="add_serve hitch" v-for="(item,index) in dataList" :key="index">
        <div class="addserve_tite">
          <div class="product_right">
           {{item.fullName}}
            <p>
              {{item.tagsName.join(",")}}
            </p>
            <p>   X {{item.size}}</p>
          </div>
          <div class="right_add right_number">
            <div class="numbox">
              <button class="subtract" @click="subtract(index)" type="button">-</button>
              <input class="number" type="number" v-model="item.size" disabled >
              <button class="addnumber" @click="add(index,item)" type="button" >+</button>
            </div>
          </div>
        </div>
      </div>
<!--服务时间-->
      <router-link tag="div" to="/serve_date" class="location_box serve_box_date" >
        <b class="position_icon tate"></b>
        <div class="content">
          <p>{{date}}</p>
        </div>
        <b class="right_arrow"></b>
      </router-link>
      <div class="serve_explain">
        <b></b>
        <router-link tag="p" to="/saverInfo" class="explain_text">《服务流程及收费说明》</router-link>
      </div>

      <!--付款-->

      <div class="footer" v-show="true">
        <a class="accounts_btn" href="javascript:;" @click="submit">确认付款</a>
        <p class="amount">合计：<span>￥{{sumpric}}</span></p>
      </div>
    </div>
</template>
<script>
  import {getSession,setSession,getLocalStorage,setLocalStorage,removerStorage,setSize} from "../../js/session"
  import {setCookie,getCookie,getOpenID} from "../../js/cookie"
  import {isWeixin,onBridgeReady} from "../../js/isWeixin"
  import common from "../../js/baseHttp";
  import {Toast}  from "mint-ui"
  import { Indicator } from 'mint-ui';
  export default {
        data() {
            return {
              dataList:[],
              date:"请选择服务时间",
              cDate:"",
              title:"",
              size:[],
              positionInfo:[{"linkmanDetails":"请选择服务地址"}], //服务地址
              newId:"",
              sumpric:"",
            }
        },
        computed:{
        },
        methods: {
          //添加服务地址 start
          addPosition(){
            this.$store.commit("addPosition",this.$route.path);
            this.$router.push({path:"/address"})
          },
          //添加服务地址 end
          returnFirst(){
            this.$store.commit("changePaths","n");
            this.$router.back(-1);
          },
          subtract(index){  //减减
            if(this.dataList[index].size<=1){
              this.dataList.splice(index,1);
              removerStorage("fullName");
              this.dataList.forEach(v=>{
                setLocalStorage("fullName",v);
              });

              return;
            }
            let sizeO=this.dataList[index];
            sizeO.size--;
            this.$set(this.dataList,index,sizeO);
            setSize("fullName",this.dataList);
            this.sumpir();
          },
          add(index,item){                                                    //加加
            let sizeO=this.dataList[index];
            if(this.dataList[index].size>20 || item.isSecondPayment=='1'){
              return;
            }
            sizeO.size++;
            this.$set(this.dataList,index,sizeO);
            setSize("fullName",this.dataList);
            this.sumpir();
          },
          submit(){
            if(this.date==="请选择服务时间"){
              Toast("请选择预约时间");
              return;
            }
//            Indicator.open('请稍后');
            var sendId=[];
            
            this.dataList.forEach((e,i)=>{
              let obj={};
              obj.id=e.id;
              obj.size=JSON.stringify(e.size);
              obj.serviceTags=e.tagsName.join(",");
              sendId.push(obj);
            });
            var positionID=this.positionInfo[0].id;
            var token=getCookie();
            if(token){
              var params={
              token:token,
              appointmentDatetime: this.cDate,
              serviceRemark:'服务说明测试', //提交提交订单
              serviceIdsJson:JSON.stringify(sendId),
              serviceAreaId:positionID
            };
               
            let url= common.apidomain+"/order/submit";
            this.$http.post(url,params).then(res=>{
               var data=res.data;
               Indicator.close();

              if(data.code==="0000"){
                console.log(data,"提交157行")
                 var orderID=data.result.orderid;
                 let url1=common.apidomain+"/fapayjournalaccount/payorder";
                 let str= returnCitySN["cip"]+','+returnCitySN["cname"];
                  if(getOpenID()===undefined){
                    return Toast("未授权OPENID");
                  }
                  Indicator.open('正在请求支付请稍后');

                let param={openId:getOpenID(),orderId:orderID,payType:"1",token:token,userIp:str.split(",")[0]};     //调支付接口
                this.$http.post(url1,param).then(res=>{
                  Indicator.close();
                   let data=res.data;
                  if(data.code==="0000"){
                    if(isWeixin()){
                      var re=data.result;
                      Indicator.close();
                      onBridgeReady({appid:re.appid,timestamp:JSON.stringify(re.timestamp),noncestr: re.nonce_str,package:re.package, signType:re.signType,paySign:re.paySign},this)
                    }
                        Indicator.close();
                      }else{
                          Toast(data.error);
                      }
                 })
               }else{
                    console.log(data,"181行")
                 Toast(data.error);
                 setTimeout(()=>{
//                   this.$router.push({path:"/login"});
                 },1500);
               }
            })
            }else{
              Toast("token为空");
            }
          },
          sumpir(){
            var price=0;
            var newArrPier=[];
            this.dataList.forEach((e,i)=>{
              if(e.isSecondPayment==="0"){  //一次付款；       1二次付款   0一次付款
              price+=((e.price1-0)+(e.price2-0)*e.price2Discount)*(e.size-0)
              }else if(e.isSecondPayment==="1"){
                   newArrPier.push(e.price1);
              }
            });
            if(this.dataList[0].isSecondPayment==="1"){
              Array.max = function( array ){
                return Math.max.apply( Math, array);
              };
              price=Array.max(newArrPier);
            }
            this.sumpric=price  //价格
          },
        },
        created() {



          this.$store.commit("changePaths","o");
          let yuDate=this.$store.state.yuDate; //传给后台的预约时间；
         this.cDate=yuDate;
          if(yuDate==''){
            this.date='请选择服务时间';
          }else{
            var neDate=yuDate;
            this.date=neDate;
          }
          //title标题
          let title= Array.from(new Set(getLocalStorage("title")));
          this.title=title[0];

          let dataIfo=getLocalStorage("fullName");
          this.dataList=dataIfo;

//          this.dataList.forEach((v,i)=>{
//            this.dataList[i].size=getLocalStorage("size")[i].size
//          });
//          for(var k=0;k<dataIfo.length;k++){
//            for(var i=0;i<this.dataList.length;i++){
//                if(dataIfo[k].id==this.dataList[i].id){
//                     this.dataList[i];
//                  console.log(this.dataList[i])
////                  this.dataList[i].size-0+1
//                }
//            }
//          }
          var arr = this.dataList;
         
         if(this.dataList[0].isSecondPayment==='0'){
          var hash = {};
              arr = arr.reduce(function(item, next) {
                hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                return item
              }, []);
              this.dataList=arr;
              this.sumpir();
              var optionList=getLocalStorage("OPTION");
              if(optionList!=""){
                this.positionInfo=optionList;
              }else{
    //            this.positionInfo="请选择服务地址"
              }
         }else{
               var optionList=getLocalStorage("OPTION");
             this.sumpir();
              if(optionList!=""){
                this.positionInfo=optionList;
              }
         }
          
           
        }
  }
</script>
<style scoped lang="less">
  .serve_explain{
    padding:.2rem .8rem;
    margin-bottom:200px;
    >b{
      float:left;
      background:url(../../../static/images/selector3.png) center center no-repeat;
      background-size: 100% 100%;
      width:30/50rem;
      height:30/50rem;
      vertical-align:middle;
    }
    >.explain_text{
      font-family: PingFangSC-Regular;
      font-size: 24/50rem;
      color: #EB5312;
      line-height: .6rem;
      letter-spacing: 0;
    }
  }
.location_box{
  width:100%;
  background:#fff;
  padding:1rem 1.3rem;
  padding-right:.8rem;
  position:relative;
  border-top: inherit;
  margin-top:.2rem;
 >.border_image{
   width:100%;
   height:2px;
   position:absolute;
   top:0;
   left:0;
   background:url(../../../static/images/dizhi.png);
 }

  >b{
    top:50%;
    background:url(../../../static/images/position.png) center center no-repeat;
    background-size: 100% 100%;
    transform:translateY(-50%);
    position:absolute;
    vertical-align: middle;
  }
  >.position_icon{
    left:.8rem;
    width:30/50rem;
    height:1rem;
  }
  >.right_arrow{
    right:.8rem;
    height:26/50rem;
    width:16/50rem;
    background:url(../../../static/images/right.png) center center no-repeat;
    background-size: 100% 100%;
  }
  >.content{
    width:100%;
    padding:0 .8rem;
    >p{
      font-family: PingFangSC-Regular;
      font-size: 28/50rem;
      color: #4A4A4A;
      letter-spacing: 0;

    }
  }
  .tate{
    background:url(../../../static/images/tiem.png) center center no-repeat;
    background-size: 100% 100%;
    width:40/50rem;
    height:38/50rem;
  }
  >.bottom{
    width:100%;
    height:2px;
    position:absolute;
    bottom:0;
    left:0;
    background:url(../../../static/images/dizhi.png);
  }
}
.serve_box_date{
  margin-top:3%;
}
  .add_serve{
    margin-top:3%;
    width:100%;
    border-top:1px solid rgba(0,0,0,0.1);
    padding-right:.8rem;
    overflow: hidden;
    background:#fff;
    >.addserve_tite{

      >p{
        padding:30/50rem;
        float:left;
      }
      >.right_add{
        float: right;
        position:relative;
        padding-left:.5rem;
        overflow: hidden;
        height:88/50rem;
        padding-top:.7rem;
        >b{
          float: left;
          width:32/50rem;
          margin-right:.2rem;
          height:32/50rem;
          background:url(../../../static/images/add.png) center center no-repeat;
          background-size: 100% 100%;
          vertical-align: middle;
        }
        >p{
          float:left;
          font-family: PingFangSC-Regular;
          font-size: 28/50rem;
          color: #9B9B9B;
          letter-spacing: 0;
          line-height: .6rem;
          text-align: right;
        }
        .numbox{
          height:68/50rem;
          display: flex;
          width:196/50rem;
          padding:0;
          border:1px solid rgba(0,0,0,0.1);
          margin:0;
          border-radius:6px;
        }
        .addnumber{

        }
        .addnumber,.number,.subtract{
          padding:0;
          color: #EB5312;
          float:right;
          border-radius: 0;
          border:none;
          margin:0;
          height:100%;
          flex:1 !important;

        }
        .number{
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: 28/50rem;
          color: #4A4A4A;
          letter-spacing: 0;
          border:1px solid rgba(0,0,0,0.1);
          border-top:none;
          border-bottom:none;
        }
      }
      >.right_number{
        padding-top:.1rem;
        float:none;
        /*padding:0;*/
      }
      >.product_right{
        float:left;
        padding:.5rem;
        width:100%;
        padding-bottom:.3rem;
        font-family: PingFangSC-Regular;
        font-size: 28/50rem;
        color: #4A4A4A;
        letter-spacing: 0;
        >p{
          font-size: 22/50rem;
          color: #C8C8CB;
          padding-top:.3rem;
          letter-spacing: 0;
        }
      }
    }

  }
  .first{
    border:none;
  }
  .hitch{
      margin:0;
  }

  .footer{
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
    }


</style>





