<template>
  <div id="box" v-show="lo">
   	<div class="nav_position">
   	<router-link to="/appliance" class="position_text">
		       {{current_option.name}}<b class="size"></b>
	</router-link>
   	</div>
	 <!-- 1.0 轮播图：mint-ui中的 swipe组件实现 -->
	<mt-swipe :auto="2000000">
		 <mt-swipe-item v-for="(item,index) in bannerList" :key="item.image">
       <a class="banner_box" :href="item.url">

			<img :src="item.image"></a>

		 </mt-swipe-item>

	</mt-swipe>
    <div class="menu_list" ref="menu_box">
     <p id="barcaver"></p>
         <div class="mui-content">
		        <ul class="mui-table-view mui-grid-view mui-grid-9" ref="menu_ul">
		            <li v-if="false" class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 icon_content">
		            <router-link to="/wash/001" class="link">
		                    <span class="mui-icon mui-icon-home"></span>
		                    <div class="mui-media-body">家电清洗</div>
                </router-link>
		            </li>
		            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 icon_content">
						<router-link to="/wash/002" class="link">
		                    <span class="mui-icon mui-icon-email">
		                    </span>
		                    <div class="mui-media-body">家电维修</div></router-link>
		             </li>
		            <li  class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 icon_content">
						<router-link to="/wash/003" class="link">
		                    <span class="mui-icon mui-icon-chatbubble"></span>
		                    <div class="mui-media-body">手机维修</div></router-link>
		            </li>
		            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 icon_content"><router-link to="/wash/004" class="link">
		                    <span class="mui-icon mui-icon-location"></span>
		                    <div class="mui-media-body">家居维修</div></router-link>
		            </li>
		            <li v-if="false" class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 icon_content"><router-link to="/wash/005" class="link">
		                    <span class="mui-icon mui-icon-search"></span>
		                    <div class="mui-media-body">开锁服务</div></router-link>
		             </li>
		            <li v-if="false" class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 icon_content"><router-link to="/wash/006" class="link">
		                    <span class="mui-icon mui-icon-phone"></span>
		                    <div class="mui-media-body">管道维修</div></router-link>
		            </li>
		            <li v-if="false" class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 icon_content"><router-link to="/wash/007" class="link">
                        <span class="mui-icon mui-icon-phone computer"></span>
                        <div class="mui-media-body">电脑维修</div></router-link>
                </li>
                <li v-if="false" class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 icon_content">
                <router-link to="/wash/008" class="link">
                        <span class="mui-icon mui-icon-phone computer"></span>
                        <div class="mui-media-body">卫浴洁具</div></router-link>
                </li><li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 icon_content">
                <router-link to="/wash/009" class="link">
		                    <span class="mui-icon mui-icon-phone computer"></span>
		                    <div class="mui-media-body">卫浴洁具</div></router-link>
		            </li>
		        </ul>
		</div>
    </div>
    <!--公告栏-->
    <div class="announcement">
    	<b class="icon"></b>
    	<div class="notice" ref="autobox">
    		<ul ref="auto_ul">
    			<li v-for="(item,index) in noticeInfo"><a :href="item.url">{{item.name}}: {{item.remark}}</a></li>
    		</ul>
    	</div>
    </div>
    <!--商品列表-->
    <div class="goods_container">
    	<ul class="mui-table-view">
		    <li class="mui-table-view-cell mui-media goods_list" v-for="(item,index) in articleList" :key="item.name">
		        <a :href="item.url">
		            <img class="mui-media-object mui-pull-left" :src="item.image">
		            <div class="mui-media-body">
		               {{item.name}}
		                <p class='norop'>{{item.remark}}</p>
                    <b class="right_Icon"></b>
		                <p class="activity" v-if="false">{{item.showKey}}》</p>
		            </div>
		        </a>
		    </li>
		 </ul>
    </div>

  </div>

</template>
<script>
import {autoiscroll} from "../../static/js/autoiscroll";
import {setSession,getSession} from "../js/session"
import common from "../js/baseHttp"
import { Indicator } from 'mint-ui';
export default {
  data () {
    return {
      current_option:'',
      bannerList:[],
      noticeInfo:[],
      lo:false,
      articleList:[]
    }
  },
   mounted(){
      // iscroll({box:this.$refs.menu_box,ul:this.$refs.menu_ul,isTop:false});
      autoiscroll({box:this.$refs.autobox,ul:this.$refs.auto_ul});
    },
  created() {
//     this.$http.post("http://app.dingdingkuaixiu.com/wechat/services/pay").then(res=>{
//       console.log(res.data);
//     });
//    Indicator.open('加载中');

      
    var url=common.apidomain+'/homedata';
    this.$http.get(url).then(res=>{
      this.lo=true;
      let data=res.data.result;
      this.bannerList=data.slideShow //轮播图
        console.log(data.slideShow );
      this.noticeInfo=data.commonMessages;//公告栏
      this.articleList=data.articleInfo;
      console.log(this.articleList)
    });
//    //定位城市；
    var current=remote_ip_info['city']+"市";
    if(getSession()[0]){
      current=getSession()[0].name;
    }
    let positionUrl=`${common.apidomain}/areainfo/findOneForName?name=${current}`;
     this.$http.get(positionUrl).then(res=>{

       let data2=res.data.result;

       if(!data2){
         this.$http.get(common.apidomain+"/areainfo/findOneForName?name=深圳市").then(res=>{
           let data=res.data.result;
           setSession(data);
              this.current_option = getSession()[0];
         });
       }else{
         setSession(data2);
         this.current_option =  getSession()[0];
       }
     });
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.nav_position{
		position:absolute;
		right:5%;
		top:10px;
		z-index: 99;
		>.position_text{
			font-family: PingFangSC-Regular;
			color:rgba(235,83,18,1);
			font-size: 0.5rem;
		}
    .size{
			width:.5rem;
			height:.5rem;
			background:url(../../static/images/bottom.png)center center no-repeat;
			background-size:100% 100%;
			display: inline-block;
			vertical-align: middle;
		}
    .size{
      font-size:28/50rem;
    }
	}
  #box{
    position:relative;
    margin-bottom:1.96rem;
  }
  .menu_list{
      width:100%;
      position:relative;
    >.mui-content {
        width:100%;
        padding-left: 22px;
      > .mui-table-view:first-child{
          margin-top:0;
     }
      .icon_content{
        padding-left:0;
        padding-right:0;
        width:165/50rem;
        >.link{
          margin-right:0;
          display: inline-block;
        }
      }
      .icon_content:first-of-type{
      
          
     
      }
    }
  }
  .mint-swipe{
		height: 326/50rem;
	}
	.mint-swipe-item img{
		width: 100%;
		height:100%;
	}
	.mint-swipe-item{
		width: 100%;
		height: 100%;
  }
  //菜单列表
  .mui-content,.mui-content ul{
    height:246/2px;
    margin-top:0;
    background-color: #fff;
    >li{
      width:90px;
    }
  }
  // @media screen and (max-width: 414px) {
  //    .mui-content,.mui-content ul {
    
  //        width:95*9px;
  //   }
  // }
  //  @media screen and (max-width: 375px) {
  //    .mui-content,.mui-content ul {
      
  //        width:95*8px;
  //   }
  // }
  // @media screen and (max-width: 325px) {
  //    .mui-content,.mui-content ul {
    
  //        width:95*7px;
  //   }
  // }
	.mui-grid-view.mui-grid-9 .mui-table-view-cell{
		border-right:0px;
		border-bottom:0px;
	}
	.mui-grid-view.mui-grid-9{
		border-top:0px;
		border-left:0px;
	}
	.mui-icon-home:before,
	.mui-icon-email:before,
	.mui-icon-chatbubble:before,
	.mui-icon-location:before,
	.mui-icon-search:before,
	.mui-icon-phone:before{
		content: '';
		display: inline-block;
		width: 50px;
		height: 50px;
		background-repeat: round;
	}

	.mui-icon-home:before{
		background-image: url(../../static/images/qingxi.png);
	}
	.mui-icon-email:before{
	background-image: url(../../static/images/jiadianweixiu.png);
	}
	.mui-icon-chatbubble:before{
		background-image: url(../../static/images/shoujiweixiu.png);
	}
	.mui-icon-location:before{
		background-image: url(../../static/images/jiaju.png);
	}
	.mui-icon-search:before{
	background-image: url(../../static/images/kaisuo.png);
	}
	.mui-icon-phone:before{
	background-image: url(../../static/images/guandao.png);
  }
  .computer:before{
	background-image: url(../../static/images/diannao.png);
  }
   .mui-table-view.mui-grid-view{
    .mui-table-view-cell{
      /*padding:0;*/
      .mui-media-body{
        margin-top:0px;
      }
    }
  }
  .announcement{
  	height:30px;
  	width:100%;
  	line-height: 30px;
  	margin-top:15px;
  	position:relative;
  	background:#fff;
  	>.notice{
  		height:100%;
  		margin-left:1.8rem;
  		font-size: 24/50rem;
  		position:relative;
  		overflow: hidden;
		>ul{
			position:absolute;
			left:0;
			top:0;
			padding:0;
			transition:top .3s ease;
			margin:0;
			li{
				list-style: none;
				>a{
          display: block;
					color:rgba(155,155,155,1);
				}
			}
		}
  	}
  	>.icon{
  		position:absolute;
  		left:1rem;
  		top:20%;
  		width:15px;
  		background:url(../../static/images/give.png)center center no-repeat;
  		background-size:100% 100%;
  		height:15px;

  	}
  }
  .goods_container{
  	margin-bottom:98/50rem;
  	>.mui-table-view{
  		>.goods_list{
  			height:200/50rem;
  			/*max-height: 162px;*/
  			>a{
  				height:200/50rem;
  				>.mui-pull-left{
  					width:210/50rem;
  					height:100%;
					max-width:none;
  				}
  				>.anorop{

			}
  			}
  			.mui-media-body{
  				font-size: 28/50rem;
  				position:relative;
  				height:100%;
  				>p{
  					font-size: 24/50rem;
  					color:rgba(155,155,155,1);
  					width:100%;
  				}
  				>.mui-ellipsis{

  					width:100%;
  				}
  				>.activity{
  					position:absolute;
  					left:0;
  					bottom:0;
  					color:rgba(235,83,18,1);
  				}
  			}
  		}
  	}
  	.mui-table-view-cell > a:not(.mui-btn){
  		white-space:normal;
  		line-height: 36/50rem;
  	}
  }
  .banner_box{
    display: block;
  }
  #barcaver{
    width:100%;
    height:18px;
    background:#fff;
    z-index: 99;
    position:absolute;
    left:0;
    bottom:0;
  }
  .right_Icon{
    display: block;
    float:right;
    width:10px;
    height:15px;
    background:url(../../static/images/right.png)center center no-repeat;
    background-size:100% 100%;
  }
</style>
<style lang="less">
  .mint-swipe-indicators{
      .mint-swipe-indicator{
        background:#fff !important;

      }
      .is-active{
        background:#EB5312 !important;
      }
  }


</style>
