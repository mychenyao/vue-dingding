<template>
    <div id="box">
      <div class="container"  >
        <h3 class="classify_title">{{title}}</h3>
        <ul class="mui-table-view">
          <li class="mui-table-view-cell"
              @click="selectortype7(index,item.a,item)"
              v-for="(item,index) in childrenType"
              :key="index">
            <a href="javascript:;" :class="{'selector':selectorIndex==index}">{{item.b}}</a>
          </li>
        </ul>
      </div>
    </div>
</template>
<script>
    export default {
      props:["selectorIndex","childrenType","title"],
        data() {
            return {

            }
        },
        methods: {

        },
        created() {

        }
    }
</script>
<style scoped lang="less">
  #box{
    margin-bottom:0;
  }
  .container{
    background: #fff;

    padding:10px;
    padding-top: 0;
    margin:0 4%;
    margin-top:2%;
    .mui-table-view{
      display: flex;
      flex-wrap:wrap;
      &::after{
        width:0;
        height:0;
      }
      &::before{
        width:0;
        heihgt:0;
      }
      >.mui-table-view-cell{
        width:50%;
        border:none;
        padding:5px;
        padding-left:0;
        >a{
          display: block;
          margin:8/50rem;
          font-size: 28/50rem;
          color: #FFFFFF;
          background: #FBFBFB;
          color: #4A4A4A;
          border-radius: 5px;
          text-align: center;
          margin-left:0;
        }
        >.selector{
          background:rgba(235,83,18,1);
          color:#fff;
        }
        &::after{
          width:0;
          background-color:none;
        }
      }
    }
    >.price_title{
      text-align: center;
      border:none;
      padding-top:.9rem;
    }
    >.describe{
      height:1rem;
      width:100%;
      line-height: 1rem;
      font-family:PingFangSC-Regular;
      font-size: 22/50rem;
      margin-bottom: .3rem;
      color: #EB5312;
    }
  }
</style>


