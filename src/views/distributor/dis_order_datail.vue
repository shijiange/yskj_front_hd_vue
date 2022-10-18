<!-- 渠道商订货详情 -->
<template>
<div id="dis_order_datail">
  <c-title :hide="false" :text="'订货详情'"></c-title>
  <div >
    <div class="top_box">
      <div class="title_1">订货成功</div>
      <div class="title_2">共2件商品 订货总价：{{$i18n.t('money')}}254821</div>
    </div>
    <div class="main">
      <ul class="goods_list">
        <li class="list_child" v-for="(item, index) in 2" :key="index">
          <div class="img">
            <img src="../../assets/images/reward_bgimg.png" alt="">
          </div>
          <div class="right_good">
            <div class="good_title">Clarifique Valueset现货不用等丨全新兰蔻「极光水」Clarifique Valueset现货不用等丨全新兰蔻「极光水」</div>
            <div class="good_other">
              <div class="money">{{$i18n.t('money')}} 1233</div>
              <div>x 1</div>
            </div>
          </div>
        </li>
      </ul>
      <div class="order_total">共3件商品 订货总价：<em style="color: #ff2c29; font-weight: bold;">{{$i18n.t('money')}}254821</em> </div>
    </div>
    <div style="height: 1.875rem; background-color: #eee;"></div>
    <div class="order_details">
      <div class="childs">订单号：01512815462216164646</div>
      <div class="childs">订货人：麻辣小辣椒</div>
      <div class="childs">下单时间：2020-04-29 21:25:36</div>
      <div class="childs">付款时间：2020-04-29 21:25:36</div>
    </div>
  </div>
</div>
</template>

<script>
import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data () {
    return {
    };
  },
  components: {
    cTitle
  },
  computed: {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
#dis_order_datail {
  background: #fff;
  text-align: left;

  .top_box {
    height: 6.25rem;
    padding: 1.5rem 1.5rem 0;
    overflow: hidden;
    background: url('../../assets/images/background-image150.png');
    background-size: 100% 100%;
    font-weight: bold;
    color: #fff;
  }

  .main {
    .goods_list {
      color: #000;

      .list_child {
        display: flex;
        padding: 1rem;
        border-bottom: 0.0625rem solid #f2f2f2;

        .img {
          width: 4rem;
          height: 4rem;
          border-radius: 0.375rem;
          overflow: hidden;
          margin-right: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .right_good {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;

          .good_title {
            line-height: 1.25rem;
            font-size: 0.75rem;
            color: #000;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .good_other {
            display: flex;
            justify-content: space-between;

            .money {
              color: #ff2c29;
            }
          }
        }
      }
    }

    .order_total {
      height: 3rem;
      line-height: 3rem;
      text-align: right;
      padding: 0 1rem;
    }
  }

  .order_details {
    padding: 1rem;
    color: #666;

    .childs {
      padding-bottom: 0.625rem;
    }
  }
}
</style>
