<template>

  <div id="integral">
    <c-title :hide="false" :text="integralName"></c-title>
    <div id="integral2">
      <span>当前积分</span>
      <div class="nune"><b>{{integral}}</b>分</div>
    </div>
    <div id="integral3" style="display: none;">
      <img src="../../../assets/images/ico-integral.png" alt="">
      <span>花积分</span>
    </div>

    <p id="mszf"><span>近期收支明细</span><i class="fa fa-angle-right"
                                       style="font-size: 1.0625rem; padding-left: 0.3125rem;"></i>
      <router-link :to="fun.getUrl('integrallist',{selected:'1'})"><span class="more">更多</span></router-link>
    </p>
    <div id="tbs" v-for="(item,index) in mydata" :key="index">
      <div class="left">{{item.mode_name}}<br/><span>{{item.updated_at}}</span></div>
      <div class="right add" v-if="item.point<0">{{item.point}}</div>
      <div class="right reduce" v-if="item.point>0">+{{item.point}}</div>
    </div>
    <!--<div id="tbs">
     <div class="left">业务类型<br /><span>2017-03-03  17:00:00</span></div>
     <div class="right reduce">+98431</div>
   </div>   	-->
  </div>

</template>
<script>
import integral from "./member_integralcontroller";

export default integral;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #integral {
    #integral2 {
      background: #e84e40;
      color: #fff;
      padding: 1.875rem 0.625rem;
      overflow: hidden;

      .nune {
        float: right;
        font-size: 12px;

        b {
          font-size: 32px;
          font-weight: normal;
        }
      }

      span {
        float: left;
        line-height: 3rem;
      }
    }

    #integral3 {
      background: #e2483a;
      font-size: 14px;
      color: #fff;
      box-shadow: 0 0.1875rem 0.3125rem #de4141 inset;
      line-height: 1.2rem;
      padding: 0 0 0.625rem;

      img {
        position: relative;
        right: 0;
        bottom: -0.4375rem;
        width: 1.5625rem;
        margin-right: 0.625rem;
      }
    }

    #mszf {
      background: #f5f5f5;
      margin: 0.625rem 0 0 0;
      padding: 0 0.625rem;
      text-align: left;
      font-weight: normal;
      font-size: 12px;
      height: 2rem;
      box-sizing: border-box;
      line-height: 2rem;

      span {
        float: left;
        color: #888;
      }

      a {
        color: #000;
      }

      .more,
      i {
        float: right;
        line-height: 2rem;
      }
    }

    #tbs {
      display: flex;
      align-items: center;
      background: #fff;
      flex-flow: row wrap;
      padding: 0.625rem;
      line-height: 1.5rem;
      border-bottom: 0.0625rem solid #d9d9d9;

      .left {
        text-align: left;
        flex: 50%;
        color: #333;

        span {
          color: #888;
          font-size: 12px;
        }
      }

      .right {
        text-align: right;
        flex: 50%;
        font-size: 16px;
      }

      .add {
        color: #259b24;
      }

      .reduce {
        color: #e51c23;
      }
    }
  }
</style>