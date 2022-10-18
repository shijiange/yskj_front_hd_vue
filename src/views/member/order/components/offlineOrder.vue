<template>
  <div class="offline-order-detail">
    <div class="goods-box" v-for="(good, i) in order_data.has_many_order_goods" :key="i">
      <div class="order-num">
        订单号：{{ order_data.order_sn }}
      </div>
      <div class="goods" @click="toGoodsDetail(good, order_data.is_virtual, good.is_course)">
        <div class="left-img">
          <img :src="good.thumb" alt="">
        </div>
        <div class="right-info" style="flex: 1;">
          <h3 class="goods-title overflow-2">{{ good.title | escapeTitle }}</h3>
          <div class="goods-option">x{{ good.total }}</div>
          <div class="bottom-box">
            <div class="price">{{ $i18n.t("money") }}{{ good.price }}</div>
            <div class="btns">
              <span
                v-for="(btn, index) in good.buttons"
                :key="index"
                :class="btn.value == 2 ? 'view-comment-btn' : 'comment-btn'"
                @click.stop="evaluateOpration(btn, good, order_data)"
              >{{ btn.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <template v-if="order_data.ys_order_detail && order_data.ys_order_detail.length > 0">
        <div class="extend-more">
          <span @click="showMore = !showMore">展开<van-icon :name="showMore?'arrow-down':'arrow'"></van-icon></span>
        </div>
        <!-- 订单详情 -->
        <transition name="fade">
          <ul class="goods-info" v-if="showMore">
            <li class="item" v-for="(ysItem, ysIndex) in order_data.ys_order_detail" :key="ysIndex">{{ysItem}}</li>
          </ul>
        </transition>
      </template>
      <div class="pay-amount">
        <div>应收：{{$i18n.t('money')}}{{order_data.order_goods_price}}</div>
        <div>实收：{{$i18n.t('money')}}{{order_data.price}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['order_data'],
  data () {
    return {
      showMore: false,
      toi: this.fun.getKeyByI(),
    };
  },

  methods: {
    // 跳转商品详情页面
    toGoodsDetail(goods, isshow, showCourse) {
      if ((this.order_data.deposit_ladder && this.order_data.deposit_ladder.activity_id) || (this.order_data.deposit_ladder_dj && this.order_data.deposit_ladder_dj.activity_id)) {
        let activity_id = this.order_data.deposit_ladder && this.order_data.deposit_ladder.activity_id ? this.order_data.deposit_ladder.activity_id : this.order_data.deposit_ladder_dj.activity_id;
        //尾款商品跳转详情
        //id:活动id
        this.$router.push(this.fun.getUrl("depositGroupActivity", {}, { id: activity_id }));
        return;
      }
      if (this.order_data.plugin_id == 54) {
        this.$router.push(this.fun.getUrl("GroupGoods", { id: "0", store_id: goods.store_id || 0 }, { fight_groups: goods.goods_id }));
      } else {
        this.$router.push(this.fun.getUrl("goods", { id: goods.goods_id }));
      }
    },

    // 跳转评价
    evaluateOpration(btn, item, order) {
      //value-0 value-1追加评价 value-2查看评价详情
      if (btn.value == 0) {
        this.$router.push({ name: "evaluate", params: { order_id: order.id, id: item.id }, query: { i: this.toi } });
      } else if (btn.value == 1) {
        this.$router.push({ name: "addevaluate", params: { order_id: order.id, item: item }, query: { i: this.toi } });
      } else if (btn.value == 2) {
        //CommentDetails
        this.$router.push({
          name: "CommentDetails",
          params: {
            order_id: order.id,
            goods_id: item.goods_id,
            comment_id: 0,
            order_goods_id: item.id,
            uid: 0
          },
          query: { i: this.toi }
        });
      }
    },
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.offline-order-detail {
  background: #fff;
  margin: 0.625rem;
  padding-bottom: 1rem;
  .overflow-2{
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-flex: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .goods-box {
    padding: 0.85rem;
    border-radius: 10px;
    text-align: left;
    .order-num {
      font-size: 12px;
      color: #666666;
    }
    .goods {
      display: flex;
      align-items: center;
      margin-top: 0.781rem;
    }
    .left-img {
      width: 4.375rem;
      height: 4.375rem;
      margin-right: 0.5rem;
      border-radius: 0.188rem;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .goods-title {
      font-size: 14px;
      color: #333333;
    }
    .goods-option {
      color: #666666;
      margin: 0.5rem 0;
    }
    .bottom-box {
      display: flex;
      justify-content: space-between;
    }
    .comment-btn {
      display: inline-block;
      margin-left: 0.5rem;
      color: #f14e4e;
      font-size: 12px;
      padding: 0.3rem 1.3rem;
      border-radius: 1rem;
      border: solid 0.031rem #f14e4e;
    }
    .view-comment-btn {
      display: inline-block;
      margin-left: 0.5rem;
      color: #565656;
      border-radius: 15px;
      padding: 0.25rem 0.625rem;
      border: 0.0625rem solid #9f9c9c;
    }
    .extend-more {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #898989;
    }

    .goods-info {
      display: grid;
      grid-template-columns: repeat(2,1fr);
      gap: 0.5rem;
      margin: 0.8rem;
      padding: 0.844rem;
      font-size: 14px;
      border-radius: 0.188rem;
      background-color: #f7f7f7;
      text-align: left;
      white-space: break-spaces;
      word-break: break-all;
    }

    .pay-amount {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 0.8rem;
      color: #1e1e1e;
      font-size: 14px;
    }

    .fade-enter-active, .fade-leave-active {
      transition: all .5s;
      opacity: 1;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
  }


}
</style>