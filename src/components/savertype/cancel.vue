<template>
    <div id="box">
      <div id="tetailed_box">
      <div class="title">
        已取消
        <p class="surplus_tate" v-if="false">   剩余29分钟自动关闭</p>
      </div>

      <div class="info">
          <div class="saver_type">
            <div class="saver_title">
              服务类别：
            </div>
            <p class="text">家电清洗</p>
          </div>
        <div class="saver_type">
            <div class="saver_title">
              服务时间：
            </div>
            <p class="text">家电清洗</p>
          </div>

        <div class="saver_type">
            <div class="saver_title">
              服务地址：
            </div>
            <p class="text">家洗家电清洗</p>
          </div>
        <div class="saver_type">
            <div class="saver_title">
              联系电话：
            </div>
            <p class="text">家电清洗</p>
          </div>
      </div>
      <!--已完成-->
      <div class="keep_container" v-if="true">
        <ul class="mui-table-view">
          <li class="mui-table-view-cell">
            <p class="cause_top">
              <span class="cause_type">双门维修</span>
              <span class="mui-badge">￥11</span>
            </p>
            <p class="cause">
              <span class="cause_name">
                故障原因
              </span>
              <span class="sum">
                x13
              </span>
            </p>
          </li>
          <li class="mui-table-view-cell">
            <p class="cause_top">
              <span class="cause_type">双门维修</span>
              <span class="mui-badge">￥11</span>
            </p>
            <p class="cause">
              <span class="cause_name">
                故障原因
              </span>
              <span class="sum">
                x13
              </span>
            </p>
          </li>
        </ul>
        <div class="defray_content">
          <div class="defray_right open_price">
            <p>
              已付款
              <span class="defray_price">￥30 </span>
              <span class="defray_describe">(含维修不费）</span>
            </p>
            <p>
              已退款
              <span class="defray_price">￥30 </span>
              <!--<span class="defray_describe">(含维修不费）</span>-->
            </p>
          </div>
        </div>
      </div>
      <div class="identifier">
        <p>订单编号：201708172000000001</p>
        <p> 下单时间：2017-09-09 </p>
      </div>
      </div>
    </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
    export default {
        data() {
            return {
              inventoryList:[{
                name:"压缩机线束",
                price:"压缩机线束"
              },{
                name:"压缩机线束",
                price:"压缩机线束"
              }
              ],
              isShow:false,//显示隐藏wweikuan
              accomplish:false,
            }
        },
        methods: {
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
            MessageBox({
              title: '提示',
              message: '2小时内订单扣除30手续费',
              showCancelButton:true,
              confirmButtonClass:"queRen",
              cancelButtonClass:"quX",
              cancelButtonText:" ",
              confirmButtonText:"确认取消"
            }).then(res=>{
              console.log(res)
            });
          }
        },
        created() {

            var type=this.$route.params.type;
            if(type=="1"){
//              this.accomplish=true;
            }
        }
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
        >.surplus_tate{
          font-size: 24/50rem;
          color: #FFFFFF;
          letter-spacing: 0;
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

</style>
