<!-- 线下招商会 -->
<template>
  <div id="offline_investment">
    <c-title :hide="false" :text="plugin_name"></c-title>
    <div class="container">
      <div class="countdown" v-if="info.end_time">
        <template v-if="info.status == 1">
          <template v-if="new Date().getTime() < Number(info.end_time * 1000) && new Date().getTime() > Number(info.start_time * 1000)">
            距离活动结束还剩
            <van-count-down :time="fun.getTimeDifference(info.end_time)" class="tiem-box">
              <template #default="timeData">
                <span class="block">{{ timeData.days >= 10 ? timeData.days : "0" + timeData.days }}</span>
                <span class="colon"> 天: </span>
                <span class="block"> {{ timeData.hours >= 10 ? timeData.hours : "0" + timeData.hours }}</span>
                <span class="colon"> 时: </span>
                <span class="block"> {{ timeData.minutes >= 10 ? timeData.minutes : "0" + timeData.minutes }}</span>
                <span class="colon"> 分: </span>
                <span class="block"> {{ timeData.seconds >= 10 ? timeData.seconds : "0" + timeData.seconds }}</span>
                <span class="colon"> 秒</span>
              </template>
            </van-count-down>
          </template>
          <template v-if="new Date().getTime() < Number(info.start_time * 1000)">
            距离活动开始还有
            <van-count-down :time="fun.getTimeDifference(info.start_time)" class="tiem-box">
              <template #default="timeData">
                <span class="block">{{ timeData.days >= 10 ? timeData.days : "0" + timeData.days }}</span>
                <span class="colon"> 天: </span>
                <span class="block"> {{ timeData.hours >= 10 ? timeData.hours : "0" + timeData.hours }}</span>
                <span class="colon"> 时: </span>
                <span class="block"> {{ timeData.minutes >= 10 ? timeData.minutes : "0" + timeData.minutes }}</span>
                <span class="colon"> 分: </span>
                <span class="block"> {{ timeData.seconds >= 10 ? timeData.seconds : "0" + timeData.seconds }}</span>
                <span class="colon"> 秒</span>
              </template>
            </van-count-down>
          </template>
        </template>
        <template v-if="info.status == 0">活动未开始</template>
        <template v-if="info.status == -1">活动已失效</template>
      </div>
      <div class="notice">
        <div class="notice-title">{{ info.title }}</div>
      </div>
      <div class="goods-list">
        <div class="good-child" v-for="item in info.goods" :key="item.id" @click="showGoodPup(item.id)">
          <div class="good-img">
            <img v-lazy="item.thumb" alt="" />
          </div>
          <div class="good-info">
            <div class="good-title">{{ item.title }}</div>
            <div class="good-buy">
              <div class="good-price">
                {{ $i18n.t("money") }}
                <div class="price">{{ item.price }}</div>
                <template v-if="item.has_option == 1"> 起</template>
              </div>
              <div class="buy-btn">立即购买</div>
            </div>
          </div>
        </div>
        <div v-if="info.goods.length == 0" style="padding: 1rem;">暂无可下单商品</div>
      </div>
    </div>
    <!-- 商品详情页弹窗 -->
    <yzGoodsPopup v-model="showgp" :goodsInfo="goodinfo" v-on:showgoodspecs="showgoodspecs">
      <template v-slot:add-icon>
        <div class="add-icon-box" @click.stop="showgoodspecs">立即购买</div>
      </template>
    </yzGoodsPopup>
    <!-- 商品规格弹窗 -->
    <yz-specs :goodsInfo="goodinfo" v-model="popupSpecs" v-on:closeSpecsPopup="close_yz_specs_popup"></yz-specs>
  </div>
</template>

<script>
import yzGoodsPopup from "components/ui_components/yz_goodsPopup";
import yzSpecs from "components/ui_components/yz_specs";
export default {
  data() {
    return {
      showgp: false,
      popupSpecs: false,
      activity_gid: null, //上一个查看详情的商品id,
      goodinfo: {},
      info: {
        goods: []
      },
      plugin_name: "",
      store_id: null //如为门店商品，下单需要门店id
    };
  },

  activated() {
    this.getData();
  },

  components: { yzGoodsPopup, yzSpecs },

  computed: {},

  mounted() {},

  methods: {
    getData() {
      $http
        .get("plugin.merchant-meeting.frontend.index.activity", { activity_id: this.$route.params.id }, ".")
        .then(res => {
          if (res.result == 1) {
            //status 0未开始，1进行中，-1已失效
            this.fun.setWXTitle(res.data.plugin_name);
            this.plugin_name = res.data.plugin_name;
            this.info = res.data.activity;
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    showgoodspecs() {
      this.popupSpecs = true;
    },
    close_yz_specs_popup(_optionsId, goodsCount, clicktype) {
      this.popupSpecs = false;
      if (clicktype == 1) {
        this.showgp = false;
        //点击确认按钮
        let _json = {
          tag: "-2",
          goodsId: this.activity_gid,
          optionsId: _optionsId,
          total: goodsCount,
          merchant_meeting: this.$route.params.id //传活动id
        };
        if (this.store_id) {
          _json.store_id = this.store_id;
        }
        this.$router.push(this.fun.getUrl("goodsorder", {}, _json));
      }
    },
    showGoodPup(_id) {
      if (this.activity_gid == _id) {
        this.showgp = true;
        return;
      }
      this.activity_gid = _id;
      $http
        .get("plugin.overseas.frontend.goods.get-goods-page", { id: Number(_id) }, ".")
        .then(res => {
          if (res.result == 1) {
            this.goodinfo = res.data.get_goods;
            this.goodinfo.end_time = this.info.end_time;
            if (res.data.get_goods.content) {
              let str = this.goodinfo.content.replace(/src=\"http:/gi, 'src="https:');
              this.goodinfo.content = str;
            } else {
              this.goodinfo.content = "暂无该商品详情";
            }
            this.store_id = res.data.goods_type == "store_goods" ? res.data.get_store_info.store_id : 0;

            setTimeout(() => {
              this.showgp = true;
            }, 800);
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#offline_investment {
  /deep/ .van-popup__close-icon {
    border-radius: 50%;
    background: #f2f2f2;
    padding: 0.25rem;
    font-size: 14px;
    color: #9b9b9b;
  }

  .container {
    position: relative;
    padding: 0 0.875rem;

    .tiem-box {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-left: 0.5rem;

      .block {
        width: 1.5rem;
        height: 1.5rem;
        line-height: 1.5rem;
        border-radius: 50%;
        overflow: hidden;
        background: #fff;
        color: #f14e4e;
        display: block;
      }
    }

    .countdown {
      display: flex;
      color: #fff;
      height: 3.625rem;
      line-height: 3.625rem;
      align-items: center;

      .bottom_time {
        color: #fff;
        display: flex;
        margin-left: 0.5rem;

        /deep/ span {
          color: #fff;
          font-size: 12px;
          display: flex !important;
          align-items: center;
        }

        em {
          background-color: #fff;
          color: #f14e4e;
          border-radius: 50%;
          overflow: hidden;
          line-height: 1.375rem;
          // display: flex;
          // justify-content: center;
          // align-items: center;
        }

        .radius-box {
          width: 1.375rem;
          height: 1.375rem;
          display: block;
        }

        .bottom_time {
          margin-top: 0.125rem;
        }
      }
    }

    .notice {
      background: #fff;
      border-radius: 0.625rem;
      padding: 1rem 0.75rem;
      margin-bottom: 0.625rem;
      text-align: left;

      .notice-title {
        font-size: 18px;
        font-weight: bold;
        color: #000;
        margin-bottom: 0.5rem;
      }
    }

    .goods-list {
      .good-child {
        display: flex;
        overflow: hidden;
        padding: 0.875rem;
        background: #fff;
        border-radius: 0.625rem;
        margin-bottom: 0.625rem;

        .good-img {
          width: 7rem;
          height: 7rem;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 0.375rem;
          margin-right: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .good-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          text-align: left;
          // overflow: hidden;
          .good-title {
            font-size: 16px;
            line-height: 1.5rem;
            height: 3.125rem;
            font-weight: bold;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .goods-purchased {
            display: flex;
            height: 1.5rem;
            line-height: 1.5rem;
            color: #666;

            .buyer-imgs {
              margin: 0 0.5rem;

              img {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
                overflow: hidden;
                margin-left: -0.5rem;
              }
            }
          }

          .good-buy {
            display: flex;

            .option-text-btn {
              background: #f14e4e;
              font-size: 12px;
              color: #fff;
              padding: 0 0.25rem;
              height: 1.375rem;
              line-height: 1.375rem;
              border-radius: 0.25rem;
              position: relative;

              em {
                position: absolute;
                top: -12px;
                right: -8px;
                border-radius: 1rem;
                background: #f14e4e;
                height: 1rem;
                line-height: 1rem;
                padding: 0 0.25rem;
                font-size: 12px;
                box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
              }
            }

            .good-price {
              font-size: 12px;
              font-weight: bold;
              display: flex;
              align-items: baseline;
              flex: 1;
              color: #f14e4e;

              .price {
                font-size: 18px;
                padding: 0 2px;
              }
            }

            .select {
              flex-shrink: 0;
              padding: 0.25rem 0.25rem 0;

              .iconfont {
                background: #f14e4e;
                color: #fff;
                width: 1.25rem;
                height: 1.25rem;
                text-align: center;
                line-height: 1.25rem;
                border-radius: 50%;
                display: block;
              }
            }
          }

          .buy-btn {
            background: #f14e4e;
            color: #fff;
            font-size: 12px;
            height: 1.25rem;
            line-height: 1.25rem;
            padding: 0 0.5rem;
            border-radius: 4px;
          }
        }
      }
    }
  }

  .add-icon-box {
    height: 1.875rem;
    line-height: 1.875rem;
    background: #f14e4e;
    color: #fff;
    font-size: 12px;
    text-align: center;
    width: 4rem;
    border-radius: 4px;
  }

  .container::after {
    content: "";
    width: 100%;
    z-index: -1;
    height: 7.5rem;
    position: absolute;
    left: 0%; //椭圆左边隐藏10%，右边隐藏10%
    top: 0;
    border-radius: 0 0 100% 100%; //左上角，右上角，右下角，左下角
    background: #f14e4e;
  }

  /* 可以设置不同的进入和离开动画 */

  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(15px);
    opacity: 0;
  }

  /* 可以设置不同的进入和离开动画 */

  /* 设置持续时间和动画函数 */
  .slide-fadeone-enter-active {
    opacity: 0;
  }
}
</style>
