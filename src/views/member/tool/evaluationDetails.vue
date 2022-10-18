<template>
  <div id="evaluationDetails">
    <c-title :hide="false" text='评价详情'></c-title>
    <div class="pj">
      <div layout="row" layout-align="start center" id="user">
        <div><img src="https://sfault-avatar.b0.upaiyun.com/726/291/726291045-57fdead795d4e_big64"/></div>
        <div>jan横雅</div>
        <div>2017.03.12 09:12:37</div>
      </div>
      <p>快递太慢，人员不足，卖家不在线~~~~~！！！！无人处理！</p>
      <img
        src="https://imgsa.baidu.com/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=09cb7f2fb33533fae1bb9b7cc9ba967a/7c1ed21b0ef41bd5bd7d1ed553da81cb39db3de0.jpg"/>
    </div>
    <div class="ChaseRatings">
      <h3>用户当天追评</h3>
      <p>快递太慢，人员不足，卖家不在线~~~~~！！！！无人处理！<br/>
        <img
          src="https://imgsa.baidu.com/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=09cb7f2fb33533fae1bb9b7cc9ba967a/7c1ed21b0ef41bd5bd7d1ed553da81cb39db3de0.jpg"/>
        <img
          src="https://imgsa.baidu.com/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=09cb7f2fb33533fae1bb9b7cc9ba967a/7c1ed21b0ef41bd5bd7d1ed553da81cb39db3de0.jpg"/>
        <img
          src="https://imgsa.baidu.com/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=09cb7f2fb33533fae1bb9b7cc9ba967a/7c1ed21b0ef41bd5bd7d1ed553da81cb39db3de0.jpg"/>
      </p>
      <div class="goods">

        <div class="img">
          <router-link :to='{name:"goods",params:{id:1}}'><img
            src="http://www.heliaigou.com/attachment/images/0/2016/12/Nw93tt3t5T9v3C5527Rjw9Xwwr22W9.jpg"></router-link>
        </div>
        <div class="inner">
          <div class="name">
            <router-link :to='{name:"goods",params:{id:1}}'> 奥康增高男鞋 新款真皮系带隐形内增高皮鞋韩版休闲鞋透气低帮鞋</router-link>
          </div>
          <div class="option">规格: 兰色+37</div>
        </div>

        <div class="price">
          <font>{{$i18n.t("money")}}299<br/> ×1</font>

        </div>
      </div>
    </div>

    <div class="AllComments">
      <h3><i class="fa fa-comment-o"></i>全部评论</h3>
      <div class="pj">
        <div layout="row" layout-align="start center" id="user">
          <div><img src="https://sfault-avatar.b0.upaiyun.com/726/291/726291045-57fdead795d4e_big64"/></div>
          <div>jan横雅</div>
          <div>2017.03.12 09:12:37</div>
        </div>
        <p>快递太慢，人员不足，卖家不在线~~~~~！！！！无人处理！</p>
        <img
          src="https://imgsa.baidu.com/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=09cb7f2fb33533fae1bb9b7cc9ba967a/7c1ed21b0ef41bd5bd7d1ed553da81cb39db3de0.jpg"/>
      </div>
      <div class="hf"><span @click="Reply">回复</span></div>
    </div>

  </div>

</template>
<script>
import evaluationDetailsController from "./evaluationDetailsController";

export default evaluationDetailsController;

</script>
<style lang="scss" rel="stylesheet/scss">
  #evaluationDetails {
    #user {
      div:nth-child(1) {
        flex: 1;
        padding: 0.3125rem 0.125rem;

        img {
          width: 90%;
          border-radius: 50%;
        }
      }

      div:nth-child(2) {
        flex: 5;
        text-align: left;
      }

      div:nth-child(3) {
        color: #908a8a;
        font-size: 12px;
        padding-right: 0.625rem;
      }
    }

    .pj {
      background: #fff;
      padding: 0 0.625rem;

      p {
        text-align: left;
        margin: 0;
      }

      img {
        width: 100%;
      }
    }

    .ChaseRatings {
      background: #fff;
      padding: 0.625rem 0;

      h3 {
        color: #e84e40;
        text-align: left;
        font-weight: normal;
        border-top: #e8e8e8 0.0625rem solid;
        margin: 0 0.625rem;
      }

      p {
        text-align: left;
        margin: 0;
        margin: 0 0.625rem;
        border-bottom: #e8e8e8 0.0625rem solid;

        img {
          width: 30%;
          margin-left: 0.3125rem;
        }
      }
    }

    .goods {
      display: flex;
      align-items: stretch;
      flex-flow: row wrap;
      background: #e0e0e0;
      padding: 0.3125rem;
      margin: 0.625rem;

      a {
        color: #000;
      }

      .img {
        flex: 3;

        img {
          width: 100%;
        }
      }

      .inner {
        flex: 5;
        padding: 0 0.3125rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .name {
        flex: 5;
        text-align: left;
      }

      .price {
        flex: 2;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        font {
          flex: 3;
        }

        span {
          border: solid 0.0625rem #bfcbd9;
          border-radius: 0.8125rem;
          padding: 0.0625rem 0.625rem;
          font-size: 12px;
          line-height: 1.2rem;
          margin: 0;
          background: #fff;
        }
      }

      .option {
        color: #888;
        font-size: 12px;
        flex: 1;
      }
    }

    .AllComments {
      margin-top: 0.625rem;
      background: #fff;

      h3 {
        text-align: left;
        line-height: 2rem;
        padding-left: 0.625rem;
      }
    }

    .hf {
      border-top: #e8e8e8 0.0625rem solid;
      margin: 0.625rem;
      text-align: right;
      padding: 0.9375rem 0;

      span {
        border: #b1a6a6 0.0625rem solid;
        padding: 0.25rem 1.25rem;
        border-radius: 0.5625rem;
      }
    }
  }
</style>
