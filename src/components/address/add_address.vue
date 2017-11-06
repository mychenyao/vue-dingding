<template>
    <div id="box">
      <!--<mt-field label="联系人" placeholder="请输入用户名" ></mt-field>-->
      <!--<mt-field label="手机" placeholder="请输入手机号" type="tel"></mt-field>-->
      <div class="input_box">
        <div class="content">
          <div class="contacts">联系人</div>
          <input class="user_name" type="text" v-model="name" @blur="testName(name)" @focus="clearPositio('1')">
        </div>
        <div class="content">
          <div class="contacts">手机</div>
          <input class="user_name" @blur="telTest(tel)" type="tel" v-model="tel" @focus="clearPositio('1')">
        </div>
        <div class="content">
          <div class="contacts">地区</div>
          <p class="user_name">{{position}}</p>
          <div class="select1" @click="select">请选择 &nbsp;<b></b> </div>
        </div>
        <div class="content">
          <div class="contacts">街道</div>
          <p class="user_name" v-text="isStreet"></p>
          <div class="select1" @click="selectStreet">请选择  &nbsp;<b></b> </div>
        </div>
        <div class="content replenish">
           <textarea @focus="clearPositio('1')" class="user_name" @change="importText" v-model="text" @keyup="testText(text)"  placeholder="请补充地址信息，如5号楼4单元26号"></textarea>
        </div>
      </div>
      <div class="select_option" v-if="isSelectOption">
        <div class="success_res">
          <div class="cancel"  @click="clearPositio">取消</div>
          <div class="success" @click="isShowPosition">完成</div>
        </div>
        <mt-picker :slots="slots" @change="onValuesChangePosition"></mt-picker>
      </div>
      <div class="select_option" v-if="isSelectStreet">
        <div class="success_res">
          <div class="cancel"  @click="clearStreet('2')">取消</div>
          <div class="success" @click="selectorStreet">完成</div>
        </div>
        <mt-picker :slots="slotsStreet" @change="onValuesChangeStreet"></mt-picker>
      </div>
      <div class="footer" @click="meory(isStreet,text,position)">
        <div class='accounts_btn' >
          保存
        </div>
      </div>
    </div>
</template>
<script>

import {positionSeesionFun} from "./positionFun"
//  import slider from 'slider'// 引入slider组件
  import {Toast} from "mint-ui"
  import { Indicator } from 'mint-ui';
  import {setCookie,getCookie} from "../../js/cookie"
  import common from "../../js/baseHttp";
  var area=[];//区级数据；
  var province=[]; //省级数据
  var city=[]; //市级数据
  var sheng=[];
  var streetData=[]; //街道
  export default {
    methods: {
      meory(a,b,c){

          if(!(/^1[34578]\d{9}$/.test(this.tel))){
            Toast("手机号格式不正确");
            return
          }else if(!(/^[0-9a-zA-Z\u4e00-\u9fa5_]{1,20}$/.test(this.name))){
            Toast("用户名格式不正确");
            return
          }else if(this.text.length>=60){
            Toast("详细地址描述不得多于60个字符");
            return
          }else if(!a||!b||!c){
            Toast("信息不完整");
            return;
          }
        //保存
        Indicator.open('正在保存');
        var token=getCookie(),pams,url;
        if(this.indexId==='1'){//修改地址
          pams={"linkmanName":this.name,"linkmanPhoneNum":this.tel,"linkmanAddress":this.text,
            "linkmanAreaId":this.streetId,
            "id":this.id,
            "token":token};
          url=common.apidomain+"/userSite/updateUserSite";
        }else{                                    //添加地址
          pams={"linkmanName":this.name,"linkmanPhoneNum":this.tel,"linkmanAddress":this.text,
            "linkmanAreaId":this.streetId,
            "token":token};
          url=common.apidomain+"/userSite/saveUserSite";
        }
        this.$http.post(url,pams).then(res=>{
          if(res.data.code==="0000"){
            Indicator.close();
            Toast("保存成功");
            setTimeout(()=>{
              this.$router.push({path:"/address"})
            },1000)
          }
        });
      },
      testText(text){
        if(text.length>=60){
          Toast("详细地址描述不得多于60个字符");
        }
      },
      testName(name){
        if(!(/^[0-9a-zA-Z\u4e00-\u9fa5_]{1,20}$/.test(name))){
          Toast("用户名格式不正确");
          return false
        }else{
          return true
        }
      },
      telTest(val){
       if(!(/^1[34578]\d{9}$/.test(this.tel))){
         Toast("手机号格式不正确");
         return false;
       }else{
         return true;
       }
      },
      getShengId(data){
        if(!data){
          return;
        }
        for(let x =0;x < this.provinceList.length;x++){
          if(data === this.provinceList[x].name){
            return this.provinceList[x].id;
          }
        }
        return "01";
      },
      getCityValues(picker,shengId){
        var url2 = common.apidomain+"/areainfo/findlistareaInfo?id="+shengId;
        this.$http.get(url2).then(res=>{
            this.cityList=res.data.result;
            city = [];
            for(let i=0;i<this.cityList.length;i++){
              city.push(this.cityList[i].name);
            }
            sheng[1] = city[0];
            picker.setSlotValues(1,city);
          if(!this.cityList[0]){
            return;
          }
          this.getAreaValues(picker,this.cityList[0].id);
        });
      },
      getShiId(data){
        if(!data){
          return;
        }
        for(let x=0;x<this.cityList.length;x++){
          if(data == this.cityList[x].name){
            return this.cityList[x].id;
          }
        }
      },
      getStreet(data) {       //得到街道
        if(!data){
          return;
        }
        for(let x=0;x<this.xianList.length;x++){
          if(data === this.xianList[x].name){
            return this.xianList[x].id;
          }
        }
      },
      getAreaValues(picker,shengId){
        var url2 = common.apidomain+"/areainfo/findlistareaInfo?id="+shengId;
        this.$http.get(url2).then(res=>{
          this.xianList=res.data.result;
          area = [];
          for(var i=0;i<this.xianList.length;i++){
            area.push(this.xianList[i].name);
          }
          sheng[2] = area[0];
          picker.setSlotValues(2,area);
        });
      },
      clearPositio(s){ //取消选择；省市区；

        this.isSelectOption=false;
        if(s==='1'){
          this.clearStreet("1");
          return;
        }
          this.shiId="";
          this.position="";
      },
      clearStreet(s){
        if(s==='1'){
          this.isSelectStreet=false;
          return;
        }
          this.isSelectStreet=false;
          this.isStreet="";
      },//取消选择 街道
      chackchange(values){
        if(sheng[0]!=values[0])return 0;
        if(sheng[1]!=values[1])return 1;
        if(sheng[2]!=values[2])return 2;
        return 999;
      },

      //选择省市区

      onValuesChangePosition(picker,values){
        if(this.flag){
          this.flag=false;
            console.log(values[0]='广东省');
        }
        if(!this.jieliufa)return;
        this.position = (values[0]===undefined?"":values[0])+" "+(values[1]===undefined?" ":values[1])+" "+(values[2]===undefined?" ":values[2]);
        if(values[0]==undefined){
          this.position="";
        }
//        debugger
        var c = this.chackchange(values);

        if(0==c){
//          debugger
          this.getCityValues(picker,this.getShengId(values[0]));
          sheng[0] = values[0];
        }else if(1==c){
          this.getAreaValues(picker,this.getShiId(values[1]));
          sheng[1] = values[1];

        }else if(2==c){
          sheng[2] = values[2];

        }else if(999==c){
        }
        //  values[2]
        this.shiId = this.getStreet(values[2])  //区对象数组 得到区id 传给街道
      },
      getAreaList(){
          getAreaList().then(respon=>{
            let code=respon["code"];
          })
      },
      onValuesChangeStreet(picker, values) {
        this.isStreet=values[0]
      },
//获取省市区 start
      select(){   //深市区选择；
        this.flag=true;
       area=[];//区级数据；
        province=[]; //省级数据
        city.length=0; //市级数据
        city=[]; //市级数据
       sheng=[];
        if(this.isSelectStreet){
          return;
        }
        this.isSelectOption=!this.isSelectOption;
        this.position='';
        this.slotsStreet[0].values=[];
        this.isStreet="";
      },
//获取省市区 end
      isShowPosition(){
        this.isSelectOption=false;
        if(this.isSelectStreet){
          this.isSelectStreet= !this.isSelectStreet;
        }
      },
//获取街道数据 start
      selectStreet(){
        this.slotsStreet[0].values= streetData;
        if(this.isSelectOption){
          return;
        }
        this.isSelectStreet=!this.isSelectStreet;
          var url=common.apidomain+"/areainfo/findlistareaInfo?id="+this.shiId;
          this.$http.get(url).then(res=>{
              if(res.data.code!=="0000"){
                Toast("请选择省市区");
                this.isSelectStreet=!this.isSelectStreet;
                return;
              }
            this.streetList=[];
            this.streetList=res.data.result;
//              debugger;
            streetData.length=0;                      //把街道列表清空

            for(var i=0;i<this.streetList.length;i++){
              streetData.push(this.streetList[i].name);
            }
            console.log(this.streetList);
            console.log(streetData);
          })
      },
//获取街道数据 end
//选择街道点击完成 start
      selectorStreet(){
        this.streetList.forEach((res,i)=>{
          if( res.name==this. isStreet){
            this.streetId=res.id
          }
        });
        this.isSelectStreet= !this.isSelectStreet;
      },
//选择街道点击完成 end
      importText(){

      },
      change(){
        Indicator.close();
      }
    },
    watch:{
      "$route":"change"
    },
    data() {
      return {
        jieliufa:false,//
        flag:true,
        text:"",
        id:"",
        isSelectOption:false,//选择省份城市
        isSelectStreet:false,//选择街道
        tel:"",
        position:"",
        streetId:"", //街道id
        isStreet:"", //选择前的
        street:"", //选择街道后的内容
        name:"",
        shiId:'',  //获取市 id   去获取得到街道
        provinceList:[],
        cityList:[],
        xianList:[],
        addressProvince: '省',
        addressCity: '市',
        addressXian:'区',
        indexId:"",
        slots: [
          {
            flex: 1,
            values: province,
            className: 'slot1',
            textAlign: 'center',
          }, {
            flex: 1,
            values:city,
            className: 'slot3',
            textAlign: 'center',
          }, {
            flex: 1,
            values: area,
            className: 'slot3',
            textAlign: 'center'
          }
        ],
        slotsStreet:[
          {
            flex: 1,
            values: streetData, //街道；
            className: 'slot1',
            textAlign: 'center',
          }
        ]
      };
    },
    created(){
    area.length=0;//区级数据；
    province.length=0; //省级数据
    city.length=0; //市级数据
    sheng.length=0;
    streetData.length=0; //街道
      if(this.$route.params.index==='1'){
        positionSeesionFun(this)
      }else{
        this.indexId="0";
      }

      let url=common.apidomain+"/areainfo/findlistareaInfo?id=0";
      this.$http.get(url).then(res=>{
        // province=[];  //清空
        this.provinceList=res.data.result;
        for(var i=0;i<this.provinceList.length;i++){  //把省级name放到数组里面去
          province.push(this.provinceList[i].name);
        }
        province= Array.from(new Set(province));
        if(this.provinceList.length>0){
          var url2 = common.apidomain+"/areainfo/findlistareaInfo?id="+this.provinceList[0].id;
          this.$http.get(url2).then(res=>{
            // city=[];
            this.cityList=res.data.result;
            for(var i=0;i<this.cityList.length;i++){
              city.push(this.cityList[i].name);
            }
            city= Array.from(new Set(city) )

            if(this.cityList.length>0){
              var url3 = common.apidomain+"/areainfo/findlistareaInfo?id="+this.cityList[0].id;
              this.$http.get(url3).then(res=>{
                // area=[];
                this.xianList = res.data.result;
                for(var i=0;i<this.xianList.length;i++){
                  area.push(this.xianList[i].name);
                }
                area= Array.from(new Set(area) )
                sheng.push(province[0]);
                sheng.push(city[0]);
                sheng.push(area[0]);
                this.jieliufa =true;
              });
            }
          });
        }
      });
    }
  }
</script >
<style scoped lang="less">
  #box{
    margin-bottom:0;
  }
.select_option{
  position:absolute;
  bottom:100/50rem;
  left:50%;
  transform:translateX(-50%);
  width:100%;
  >.success_res{
    width:100%;
    padding:0 32/50rem;
    height:82/50rem;
    background:rgba(0,0,0,0.1);
    >div{
      float:left;
      width:3rem;
      font-weight: 600;
      line-height:82/50rem;
      font-family: PingFangSC-Medium;
      font-size: 32/50rem;
      color: #EB5312;
    }
    >.success{
      float:right;
      text-align: right;
    }
    >.picker{
      padding-left:30px;
      >.picker-items{
        >.slot3{
          // padding-left:40px !important;
        }
      }
    }
  }
}
.input_box{
  background:#fff;
  overflow: hidden;
  width:100%;
  padding:0 32/50rem;
  font-family: PingFangSC-Regular;
  font-size: 32/50rem;
  color: #9B9B9B;
  letter-spacing: -0.77px;
  padding-right:0;
  >.content{
    display: flex;
    height:88/50rem;
    position:relative;
    border-bottom:1px solid rgba(0,0,0,0.1);
    padding-right:32/50rem;
    >.contacts{
      width:20%;
      height:100%;
      font-size: 32/50rem;
      line-height: 88/50rem;
    }
    >.user_name{
      line-height: 88/50rem;
      color:#000;
      flex:1;
      padding:0;
      height:100%;
      border:none;
      // <!--height:34/50rem;-->
      margin:0;
    }
  }

  .mint-cell-value {
    > .mint-field-core {
      border: none;
    }
  }
  >.replenish{
    height:auto;
    >.user_name{
      margin-top:.5rem;
      font-family: PingFangSC-Regular;
      font-size: 30/50rem;
      color:#000;
      height:auto;
      padding-bottom:2rem;
      line-height: 1rem;
      letter-spacing: -0.77/50rem;
    }
    border:none;
  }
  .select1{
    position:absolute;
    right:.8rem;
    top:50%;
    transform:translateY(-50%);
    >b{
      display:inline-block;
      background:url(../../../static/images/right.png) center center no-repeat;
      background-size:100% 100%;
      width:16/50rem;
      height:26/50rem;
      vertical-align:middle;

    }
  }
}
.footer {
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
.slot1{
  margin-left:30px;
}
#box{
  padding-top:10px;
}
.input_box{
  // height:100vh;
}
.picker-items{
}
</style>
