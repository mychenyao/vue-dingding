<template>
    <div id="box">
      <div class="nav_list">
          <ul>
            <li class="daily" :class="{daily_selector:isSelector==index}"  @click="selector(index)" v-if="item.isw"
            v-for="(item,index) in timeList" :key="index">
              <span>{{item.name}}</span>
              <p>{{item.time}}</p>
            </li>
          </ul>
      </div>
      <div class="nav_list time_list">
        <ul>
        <!-- ', -->
          <li class="daily" v-for="(item,index) in timeList2" :key="index" @click="selectHour(index,isErr[index])"
          :class="{'selector_hour':isSelectorHour==index}">
            <!--'err':!isErr[index]}-->
         {{item}}
          </li>
        </ul>
      </div>
      <p class="display_none_bar"></p>
      <button @click="submitBtn" class="submit" :class="{sub:isSelectorHour!=-1&&isSelector!=-1}">确认服务时间</button>
    </div>
</template>
<script>

    export default {
        data() {
            return {
              isSelector:"-1",
              timeList:[
                {name:"今天",time:"",isw:false},
                {name:"明天",time:"",isw:true},
                {name:"周五",time:"", isw:true},
                {name:"周六",time:"",isw:true},
                {name:"周日",time:"",isw:true},
              ],
              selectorTime:'',
              date:[],
              current:"",
              isErr:[],
              timeList2:[
                "08:00",
                "08:30",
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00",
                "14:30",
                "15:00",
                "15:30",
                "16:00",
                "16:30",
                "17:00",
                "17:30",
                "18:00"
              ],
              lastCurrentTime:'',
              isSelectorHour:"-1"
            }
        },
        methods: {
          selector(index){
           if(index==0){
              for(var i=0;i<this.timeList2.length;i++){
                if((this.timeList2[i].replace(/\:/, ""))-0<(this.current.getHours()+""+this.current.getMinutes())-0) {
                    this.isErr[i]=false
                }
              }
           }else{
            this.isErr=[];
             for(var i=0;i<21;i++){
              this.isErr.push(true);
            }
           }
            this.isSelector=index;
            this.selectorTime=this.date[index];
            this.isSelectorHour="-1";
          },
          selectHour(index,isErr){
            // this.selectorTime=''

            if(this.isSelector==-1||!isErr){
              return false;
            }
            this.isSelectorHour=index;
             // this.selectorTime=''
         this.lastCurrentTime = this.selectorTime+" "+this.timeList2[index]+":00";

          },
          submitBtn(){
              if(this.isSelectorHour!=-1&&this.isSelecto!=-1){
               this.lastCurrentTime =  this.lastCurrentTime.replace(/\//, "-");
//               let url=common.apidomain+"/order/getorders?type=1&token="+getCookie();

               this.$store.commit("yuDatetime",this.lastCurrentTime);
                this.$router.back(-1);
              }else{
                return false;
              }
          }
        },
        created() {
          var day1 =new Date();
          this.current=day1;
          var yue=day1.getMonth()+1;
          var ri=day1.getDate();

          var day1=new Date();
          day1.setTime(day1.getTime());
          var s1=day1.getFullYear()+"-"
           + (day1.getMonth()+1>9?day1.getMonth()+1:0+""+(day1.getMonth()+1)) +
            "/" + (day1.getDate()>10?day1.getDate():0+""+(day1.getDate()) )
           var day2=new Date();

          day2.setTime(day2.getTime()+24*60*60*1000);
        var s2=day2.getFullYear()+"-"
           + (day2.getMonth()+1>9?day2.getMonth()+1:0+""+(day2.getMonth()+1)) +
            "/" + (day2.getDate()>10?day2.getDate():0+""+(day2.getDate()) )

          var day3=new Date();
          day3.setTime(day3.getTime()+48*60*60*1000);
        var s3=day3.getFullYear()+"-"
           + (day3.getMonth()+1>9?day3.getMonth()+1:0+""+(day3.getMonth()+1)) +
            "/" + (day3.getDate()>10?day3.getDate():0+""+(day3.getDate()) )

          var day4=new Date();
          day4.setTime(day4.getTime()+72*60*60*1000);
        var s4=day4.getFullYear()+"-"
           + (day4.getMonth()+1>9?day4.getMonth()+1:0+""+(day4.getMonth()+1)) +
            "/" + (day4.getDate()>10?day4.getDate():0+""+(day4.getDate()) )

          var day5=new Date();
          day5.setTime(day5.getTime()+96*60*60*1000);
     var s5=day5.getFullYear()+"-"
           + ((day5.getMonth()+1)>9?(day5.getMonth()+1):0+""+(day5.getMonth()+1))+
            "/" + (day5.getDate()>10?day5.getDate():0+""+(day5.getDate()) )
              this.timeList[0].time=s1.substring(5);
              this.timeList[1].time=s2.substring(5);
              this.timeList[2].name=getDat(day3.getDay());
              this.timeList[2].time=s3.substring(5);
              this.timeList[3].name=getDat(day4.getDay());
              this.timeList[3].time=s4.substring(5);
              this.timeList[4].name=getDat(day5.getDay());
              this.timeList[4].time=s5.substring(5);
          console.log(day5.getMonth()+1>=10);

          function getDat(week){
            var str="";
              if (week == 0) {
                 str = "星期日";
              } else if (week == 1) {
                      str = "周一";
              } else if (week == 2) {
                      str = "周二";
              } else if (week == 3) {
                      str = "周三";
              } else if (week == 4) {
                      str = "周四";
              } else if (week == 5) {
                      str = "周五";
              } else if (week == 6) {
                      str = "周六";
              }
              return str;
          }
            this.date.push(s1);
            this.date.push(s2);
            this.date.push(s3);
            this.date.push(s4);
            this.date.push(s5);
             for(var i=0;i<21;i++){
              this.isErr.push(true);
            }

        }
    }
</script>
<style scoped lang="less">
.submit{
  width:100%;
  height:98/50rem;
  background:#ccc;
  position:absolute;
  bottom:0;
  left:0;
  color:#fff;
}
.sub{
  background: #EB5312;;
}
  #position{
    position:relative;
  }
  .nav_list{
      background:#fff;
      padding:.7rem 4%;
      width:100%;
      overflow: auto;
      padding-bottom:1.7rem;
      >ul{
        overflow: hidden;
        width:1100/50rem;
        >.daily{
          font-family: PingFangSC-Medium;
          font-size: 24/50rem;
          color: #4A4A4A;
          text-align:center;
          float:left;
          width:4rem;
          margin-left:.3rem;
          border-radius:4px;
          background: #FBFBFB;
          border: 1px solid #ECECEC;
          /*height:1.5rem;*/
          padding:.1rem 0;
          padding-bottom:.2rem;
          >p{
            line-height:.5rem;
            font-family: PingFangSC-Regular;
            font-size: 24/50rem;
            color: #9B9B9B;
          }
        }
        >.daily_selector{
           background:url(../../../static/images/select8.png) center center no-repeat;
          background-size:100% 100%;
        }
        >.daily:first-of-type{
          margin:0;
        }
      }
    ul::-webkit-scrollbar{
      display: none;
    }
  }
  .display_none_bar{
    width:100%;
    height:1.3rem;
    background:#eef3f4;
    /*background:red;*/
    position:absolute;
    top:3.2rem;
    left:0;
    z-index:999;
  }
  .time_list{
    padding-top:0;
    background:transparent;
    position:absolute;
    z-index: 99;
    left:0;
    top:4.4rem;
    >ul{
      width:100%;
      >.daily{
        margin-bottom:19/50rem;
        padding:0;
        width:153/50rem;
        height:80/50rem;
        margin-right:19.2/50rem;
        margin-left:0;
        line-height: 80/50rem;
      }
      >.selector_hour{
        background: #EB5312;
        color:#fff;
      }
      >.daily:first-of-type{
        margin-right:20/50rem;
      }
      >.err{
          background:#ccc;
       }
    }
  }

</style>


