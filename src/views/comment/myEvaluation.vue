<template>
  <div id="detailed">
    <c-title :hide="false"
             text='我的评价'></c-title>
    <van-tabs v-model="selected" @click="swichTabTItem">
      <van-tab name="0" title="待评价"></van-tab>
      <van-tab name="1" title="已评价"></van-tab>
      <!-- <mt-tab-item id="2"
                     @click.native="swichTabTItem">评价回复</mt-tab-item> -->
    </van-tabs>

    <div style="width: 100%; height: 0.0625rem;"></div>
    <!-- tab-container -->
    <div style="margin-top: 0.625rem;">
      <div v-show="selected==0" class="orderhoet">
        <div v-for="(item,i) in wait" class="listWarp" :key='i'>

          <div class="goods" v-for="(good,i) in item.has_many_order_goods" :key='i'>
            <div class="titleID">订单号：{{item.order_sn}}</div>
            <div class="product">
              <div class="img">
                <img :src="good.thumb">
              </div>
              <div class="warp">
                <ul class="inner">
                  <li class="name">{{good.title|escapeTitle}}</li>
                  <li class="option" v-if="good.goods_option_title">规格: {{good.goods_option_title}}</li>
                </ul>

                <ul class="price">
                  <li class="commodity_price">
                    <small>{{$i18n.t('money')}}</small>
                    {{good.price}}
                  <li>
                  <li class="option"> ×{{good.total}}</li>
                </ul>
              </div>
              <div class="evaluate"><span @click="toComment(item.id,good)">去评价</span></div>
            </div>
          </div>

        </div>
      </div>
      <div v-show="selected==1" class="orderhoet2">
        <div v-for="(item,i) in comment" :key='i'>
          <div class="goodsinfo"
               v-for="(good,i) in item.has_many_order_goods" :key='i'>
            <div class="goods" style="padding-top: 0.625rem;">
              <div class="img"><img :src="good.thumb"></div>
              <div class="warp">
                <ul class="inner">
                  <li class="name">{{good.title|escapeTitle}}</li>
                  <li class="option" v-if="good.goods_option_title">规格: {{good.goods_option_title}}</li>
                </ul>
                <ul class="price">
                  <li class="commodity_price">
                    <small>{{$i18n.t('money')}}</small>
                    {{good.price}}
                  </li>
                  <li class="option"> ×{{good.total}}</li>
                </ul>
              </div>
              <div class="butts">
                <span @click="opration({},good)">查看评价</span>
                <template v-for="(btn,index) in good.buttons" >
                  <span class="add-evaluate" v-if="btn.name != '查看评价'" @click="opration(btn,good)" :key="index">{{btn.name}}</span>
                </template>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div v-show="selected==2" class="orderhoet3">

        <div class="pall"
             v-for="(item,i) in other" :key='i'>
          <router-link :to="{name:'othercommentdetails',params:{comment_id:1},query:{i:toi}}">
            <div class="goodsinfo">
              <!--<div class="hrt"></div>-->
              <div class="goods" style="padding-top: 0.625rem;">

                <div class="img"><img :src="item.thumb"></div>


                <div class="warp">
                  <div class="inner">
                    <div class="name">
                      {{item.title}}
                    </div>
                    <div class="option2">
                      <font>
                        <small>{{$i18n.t('money')}}</small>
                        {{item.price}}</font>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import myEvaluation from "./myEvaluation_controller";

export default myEvaluation;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #detailed {
    a {
      color: #000;
    }

    .butts {
      // position: absolute;
      // right: 0.75rem;
      text-align: right;
      color: #333;
      span {
        padding: 0.25rem 0.625rem;
        border-radius: 15px;
        border: solid 0.0625rem #b1a6a6;
        display: inline-block;
        margin-right: 0.5rem;
      }
    }

    .orderhoet2,
    .orderhoet3 {
      margin-bottom: 0;
    }

    .orderhoet {
      margin-bottom: 0;

      .titleID {
        font-size: 14px;
        text-align: left;
        line-height: 2.25rem;
        padding: 0 0.875rem;
      }

      .listWarp ::after {
        content: "";
        display: block;
        clear: both;
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

    .pic {
      display: flex;
      align-items: stretch;
      flex-flow: row wrap;
      padding: 0.625rem;
      background: #fff;

      div {
        flex: 33% 0 0;

        img {
          width: 90%;
        }
      }
    }

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

    .mint-navbar .mint-tab-item {
      padding: 0.875rem 0;
    }

    .goodsinfo {
      padding: 0;
      background: #fff;
      position: relative;

      .hrt {
        border-top: #e0e0e0 0.0625rem solid;
        margin: 0.625rem 0;
      }
    }

    .goods::after {
      content: "";
      display: block;
      clear: both;
    }

    .goods {
      margin-top: 0;
      border-bottom: solid 0.0625rem #ebebeb;
      text-align: right;
      padding-bottom: 0.5rem;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      background: #fff;

      .img {
        width: 6rem;
        height: 6rem;
        margin-left: 0.875rem;
        margin-bottom: 0.625rem;
        margin-right: 0.625rem;
        float: left;
        display: inline-block;

        img {
          width: 100%;
          border-radius: 10px;
        }
      }

      .warp {
        width: 68%;
        min-height: 4.5rem;
        padding: 0 1rem 0 0;
        display: flex;
        justify-content: space-between;

        .inner {
          width: 70%;
          box-sizing: border-box;
          text-align: left;

          .name {
            text-align: left;
            color: #333;
            margin-bottom: 0.625rem;
            font-size: 14px;
          }
        }

        .price {
          width: 30%;
          align-items: center;
          text-align: right;
          box-sizing: border-box;

          p {
            margin-top: 0;
          }

          .yijp {
            background: #888;
            padding: 0 0.3125rem;
            color: #fff;
          }
        }
      }

      .commodity_price {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 0.625rem;
        font-size: 14px;
      }

      .evaluate span {
        border: solid 0.0625rem #f15353;
        border-radius: 15px;
        padding: 0.25rem 0.625rem;
        text-align: center;
        display: inline-block;
        // position: absolute;
        // right: 0.75rem;
        // bottom: 0.625rem;
        color: #f15353;
        margin-right: 0.5rem;
      }

      .option {
        color: #8c8c8c;
        font-size: 12px;
        flex: 1;
      }

      .option2 {
        color: #e84e40;
        font-size: 14px;
        flex: 1;
        width: 100%;

        font {
          float: left;
        }
      }
    }

    .qtpl {
      text-align: right;
      width: 100%;

      span {
        background: #fff;
        border: #b1a6a6 solid 0.0625rem;
        padding: 0.125rem 1.25rem;
        border-radius: 0.625rem;
      }
    }

    .pall {
      margin-bottom: 0.625rem;
    }
  }
</style>
