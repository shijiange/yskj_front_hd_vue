<template>
  <div id="fixed-price" v-if="loading">
    <div :style="{ display: activityStatus ? 'none' : 'block' }">
      <!-- 显示默认图案 -->
      <div
        class="top-container"
        :class="activityData.rule == 0 ? 'bg' : ''"
        :style="{
          background: activityData.rule == 1 ? 'transparent' : '',
          height: activityData.rule == 1 ? 'auto' : '8.6563rem'
        }"
      >
        <img :src="custom_thumb_url" alt="" v-if="activityData.rule == 1" />
        <div class="activity-info clearfix " :class="activityData.rule == 1 ? 'custom' : ''">
          <div class="left fl">
            <p class="goods-count" v-if="activityData.rule == 0">以下商品{{ activityData.pack_price }}元任选{{ activityData.goods_count }}件</p>
            <span class="describe fl" v-if="!shootFlag">距离活动结束还剩</span>
            <span class="describe fl" v-if="shootFlag">距开抢时间还剩</span>
            <van-count-down :time="timeLength" format="DD天" :style="{ color: activityData.rule == 1 ? '#f87166' : '' }" />
            <van-count-down :time="timeLength" :auto-start="true" @finish="finish">
              <template #default="timeData" :auto-start="true">
                <span class="block">{{ timeData.hours }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.minutes }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.seconds }}</span>
              </template>
            </van-count-down>
          </div>
          <span class="fr " :class="activityData.rule == 0 ? 'rules' : ''" @click="rulesDetailClick">活动详情<i class="iconfont icon-advertise-next ico-arrow"></i></span>
        </div>
      </div>
      <ul class="goods-list " :class="activityData.rule == 0 ? 'position-relatvie' : ''">
        <li class="item clearfix" v-for="item in goodsList" :key="item.id" @click="showGoodPup(item.id)">
          <img :src="item.thumb" alt="" class="item-img" />
          <div class="goods-text">
            <p class="goods-name">{{ item.title }}</p>
            <div class="goods-price">
              <span class="price"
                >&yen;<i class="price-num">{{ item.price }}</i></span
              >
              <div class="select" @click.stop>
                <template v-if="(!goodsCartsTotal[item.id] && item.has_option != 1) || (goodsCartsTotal[item.id] && goodsCartsTotal[item.id].total == 0)">
                  <transition name="slide-fadeone">
                    <i class="iconfont icon-life-game-plus icon-cart" @click.stop="addCart(item.id, 1, 0)"></i>
                  </transition>
                </template>
                <template v-if="goodsCartsTotal[item.id] && item.has_option != 1 && goodsCartsTotal[item.id].total != 0">
                  <transition name="slide-fade">
                    <van-stepper
                      v-model.number="goodsCartsTotal[item.id].total"
                      :max="optionsMaxCount"
                      min="0"
                      @plus="addGoods({ id: goodsCartsTotal[item.id].id, total: goodsCartsTotal[item.id].total })"
                      @minus="reduceGoods({ id: goodsCartsTotal[item.id].id, total: goodsCartsTotal[item.id].total })"
                      @blur="blurCart({ id: goodsCartsTotal[item.id].id, total: goodsCartsTotal[item.id].total })"
                      integer
                      theme="round"
                      button-size="22"
                      :disabled="optionsMaxCount == 0 ? true : false"
                    />
                  </transition>
                </template>
                <template v-if="item.has_option == 1">
                  <div class="option-text-btn" @click.stop="selectOption(item.id)">
                    <i class="iconfont specs-text" @click.stop="selectOption(item.id)">选规格</i>
                    <em class="specsNum" v-if="goodsCartsTotal[item.id]">{{ goodsCartsTotal[item.id].total }}</em>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="!isLoadMore">
        <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;" v-if="isLoadMore" @click="getMoreData">
          {{ $i18n.t("加载更多") }}
        </div>
        <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;" v-if="!isLoadMore">
          {{ $i18n.t("没有更多了") }}
        </div>
      </div>
      <!-- 点击分享 -->
      <div class="share-box">
        <!-- <span class="btn-share" @click="shareClick">
          <van-icon name="share" size="30px" color="#f14e4e" />
        </span> -->
        <div class="more">
          <ul class="more-item" :style="{ display: moreFlag ? 'none' : 'block' }" :class="moreFlag ? 'm-top' : ''">
            <li @click="goMember()"><span>会员中心</span></li>
            <li @click="shareClick"><span>分享</span></li>
            <li @click="goHome()"><span>主页</span></li>
          </ul>
          <div class="icon-img" @click="moreClick">
            <img v-if="!moreFlag" src="../../assets/images/close2.png" alt="" />
            <img v-if="moreFlag" src="../../assets/images/more.png" alt="" />
          </div>
        </div>
      </div>

      <div class="go-shop" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <div class="left-cart">
          <div class="fl cart-box" @click="carListClick">
            <span class="carnum-style">{{ cartsNum }}</span>
            <i class="iconfont icon-all_buycar cart"></i>
          </div>
          <div class="cart-text">
            <p>
              合计:<i class="price">&#165;{{ cartsTotal }}</i>
              <van-icon name="warning-o" color="#999" @click="hintClick()" />
            </p>
            <p class="des" v-if="cartsTotal <= 0">赶快选购商品参与促销活动吧</p>
            <p class="des" v-if="cartsNum - activityData.goods_count < 0 && cartsTotal != 0">
              再{{ activityData.goods_count - cartsNum }}买件,下单立享【{{ activityData.pack_price }}元任选{{ activityData.goods_count }}件】
            </p>
            <p class="des" v-if="cartsNum >= activityData.goods_count" style="color: #f14e4e;">下单立享【{{ activityData.pack_price }}元任选{{ activityData.goods_count }}件】</p>
          </div>
        </div>
        <span class="go-cart" @click="checkGoods()">去结算</span>
      </div>
      <!-- 规则详情 -->
      <van-action-sheet v-model="rulesShow" title="规则详情">
        <div class="rules-content">
          <p class="rules-title">活动时间</p>
          <p class="rules-text">{{ startTime }}至{{ endTime }}</p>
          <p class="rules-title">活动内容</p>
          <p class="rules-text">1、活动范围内，任选{{ activityData.goods_count }}件仅需{{ activityData.pack_price }}元</p>
          <p class="rules-text">2、此优惠可无限叠加，买的越多优惠越多</p>
          <p class="rules-title">优惠叠加</p>
          <p class="rules-text">不可以与其他优惠互动同时使用</p>
        </div>
        <p class="know" @click="knowClick">我知道了</p>
      </van-action-sheet>
      <!-- 分享 -->
      <van-share-sheet v-model="showShare" title="立即分享给好友" :options="showShareData" @select="onSelect" />
      <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
      <!-- 海报弹窗 -->
      <van-popup v-model="posterFlag">
        <div class="poster-box">
          <img :src="extension_poster" alt="" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }" />
        </div>
      </van-popup>
    </div>
    <!-- 规格详情弹窗 -->
    <div class="specs-win" style="height: 100%;">
      <yz-specs :goodsInfo="goodinfo" v-model="popupSpecs" v-on:closeSpecsPopup="close_yz_specs_popup" :carts="carts"> </yz-specs>
    </div>
    <!-- 购物车列表弹窗 -->
    <yz-cart-list :cardata="carList" v-on:onEmit="carListClose" class="carlist" v-model="showCarList" v-on:blur="blurCart" v-on:plus="addGoods" v-on:minus="reduceGoods">
      <!-- 底部购物车 -->
      <div style="height: 2.7rem;"></div>
      <div class="go-shop" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <div class="left-cart">
          <div class="fl cart-box" @click="carListClick">
            <span class="carnum-style">{{ cartsNum }}</span>
            <i class="iconfont icon-all_buycar cart"></i>
          </div>
          <div class="cart-text">
            <p>
              合计:<i class="price">&#165;{{ cartsTotal }}</i>
              <van-icon name="warning-o" color="#999" @click="hintClick()" />
            </p>
            <p class="des" v-if="cartsTotal <= 0">赶快选购商品参与促销活动吧</p>
            <p class="des" v-if="cartsNum - activityData.goods_count < 0 && cartsTotal != 0">
              再{{ activityData.goods_count - cartsNum }}买件,下单立享【{{ activityData.pack_price }}元任选{{ activityData.goods_count }}件】
            </p>
            <p class="des" v-if="cartsNum >= activityData.goods_count" style="color: #f14e4e;">下单立享【{{ activityData.pack_price }}元任选{{ activityData.goods_count }}件】</p>
          </div>
        </div>
        <span class="go-cart" @click="checkGoods()">去结算</span>
      </div>
    </yz-cart-list>
    <!-- 商品详情页弹窗 -->
    <yzGoodsPopup v-model="showgp" :goodsInfo="goodinfo" v-on:showgoodspecs="showgoodspecs"></yzGoodsPopup>

    <!-- 配送方式有冲突 -->
    <!-- 购物车结算配送方式冲突 -->
    <van-popup v-model="showChoose" round style="width: 20rem;">
      <div class="delivery-wapper">
        <div class="block" @click.stop>
          <div class="choose-title">
            您的购物车配送方式有冲突，请选择其中一种配送方式~
          </div>

          <div class="choose-content">
            <van-radio-group v-model="radioChoose">
              <div v-for="(item, index) in dispatch_types" :key="index" style="padding: 0.5rem 0;">
                <van-radio :name="index.toString()" checked-color="#ff4949">
                  <div class="radio-title">{{ item.name }}({{ item.member_carts.length }}件)</div>
                </van-radio>
                <ul class="radio-list">
                  <li class="radio-item" v-for="(goods, i) in item.member_carts" :key="i">
                    <p>{{ goods.title }}</p>
                    <p v-if="goods.option_title" style="font-size: 12px; color: #666;">规格：{{ goods.option_title }}</p>
                  </li>
                </ul>
              </div>
            </van-radio-group>
          </div>

          <div class="buttons">
            <div class="button-item">
              <div class="button-content" @click="showChoose = false">返回</div>
            </div>
            <div class="button-item">
              <div class="button-content red" @click="submitGoods">去结算</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 提示弹窗 -->
    <van-action-sheet v-model="hintShow" title="提示">
      <div class="rules-content hint">
        合计金额及提示仅为初步预估，请以最终下单金额为准。
      </div>
      <p class="know" @click="knowClick">我知道了</p>
    </van-action-sheet>
    <!-- 活动结束 -->
    <div class="activity-end" :style="{ display: activityStatus ? 'block' : 'none' }">
      <img class="end-img" src="../../assets/images/activity-end.png" alt="" />
      <p class="end-text">活动结束</p>
      <p class="go-stroll" @click="goHome()">去逛逛</p>
    </div>
  </div>
</template>

<script>
import fixedPrice_controller from "./fixedPrice_controller";
export default fixedPrice_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#fixed-price {
  text-align: left;
  padding-bottom: 4.6875rem;

  .clearfix::after {
    clear: both;
    display: block;
    content: "";
    visibility: hidden;
    height: 0;
    font-size: 0;
  }

  .clearfix {
    /* 触发 hasLayout */
    zoom: 1;
  }

  .fr {
    float: right;
  }

  .fl {
    float: left;
  }

  .bg {
    background-image: linear-gradient(to bottom, #f14e4e 65%, #f2dbdb);
  }

  .dsplay-none {
    display: none;
  }

  .top-container {
    float: left;
    width: 100%;
    height: 8.6563rem;

    img {
      width: 100%;
      height: auto;
    }

    .activity-info {
      padding-left: 0.9375rem;
      margin-top: 0.7813rem;
      color: #fff;

      .left {
        .goods-count {
          margin-bottom: 0.625rem;
          font-size: 1rem;
        }

        .describe {
          font-size: 0.8125rem;
        }

        .van-count-down {
          float: left;
          color: #fff;

          &:nth-of-type(1) {
            margin: 0 0.5rem;
          }
        }

        .colon {
          display: inline-block;
          margin: 0 4px;
          color: #fff;
          font-size: 0.5625rem;
          font-weight: bold;
        }

        .block {
          display: inline-block;
          width: 22px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          background-color: #f87166;
          border-radius: 0.125rem;
        }
      }

      .rules {
        padding-left: 0.3125rem;
        float: right;
        width: 5rem;
        height: 1.4375rem;
        line-height: 1.4375rem;
        text-align: center;
        background-color: #ff717b;
        border-radius: 23px 0 0 23px;
        font-size: 0.5rem;

        .ico-arrow {
          padding: 0;
          padding-top: 3px;
          vertical-align: middle;
        }
      }
    }

    .custom {
      color: #202020;
      padding-bottom: 0.625rem;
    }

    .top-info {
      padding-top: 1.25rem;
      color: #fff;

      .icon-color-arrow {
        vertical-align: middle;
      }

      .van-icon-arrow {
        padding-left: 0.25rem;
        vertical-align: middle;
      }
    }
  }
  // 配送方式不同的弹窗
  .delivery-wapper {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2002;

    .block {
      position: relative;
      width: 19rem;
      height: 22rem;
      border-radius: 15px;
      background-color: #fff;
      padding: 0.5rem;
      text-align: left;

      .choose-title {
        color: #878787;
        padding: 0.5rem;
        border-bottom: solid 1px #f5f5f5;
      }

      .choose-content {
        height: 15rem;
        overflow-y: scroll;
      }
    }

    .radio-title {
      font-size: 16px;
      font-weight: bold;
    }

    .radio-list {
      padding: 0.5rem;
    }

    .radio-item {
      padding: 0.5rem 0;
      border-bottom: solid 1px #f5f5f5;
    }

    .buttons {
      display: flex;
      position: absolute;
      bottom: 0.5rem;
      width: 100%;

      .button-item {
        flex: 1;
        display: flex;
        align-items: center;

        .button-content {
          margin: 0 auto;
          width: 6.5rem;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
          border-radius: 0.5rem;
          border: solid 1px #b5b5b5;
          color: #000;
        }

        .button-content.red {
          color: #fff;
          background-color: #f15353;
          border: none;
        }
      }
    }
  }
  // .more {
  //   position: fixed;
  //   left: 0.625rem;
  //   bottom: 3.125rem;
  //   width: 1.5625rem;
  //   height: 6.25rem;
  //   background-color: pink;
  // }
}

.describe {
  float: left;
}

.van-count-down {
  float: left;
  color: #fff;

  &:nth-of-type(1) {
    margin: 0 0.5rem;
  }
}

.colon {
  display: inline-block;
  margin: 0 4px;
  color: #fff;
  font-size: 0.5625rem;
  font-weight: bold;
}

.block {
  display: inline-block;
  width: 22px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #f87166;
  border-radius: 0.125rem;
}

.goods-list {
  padding: 0.4688rem;
  margin: 0 auto;
  width: 95%;
  height: auto;
  background-color: #fff;
  border-radius: 0.625rem;
  overflow: hidden;

  .item {
    padding: 0.3125rem 0;
    height: 100%;
    margin-bottom: 0.625rem;
    display: flex;

    .item-img {
      width: 7.0625rem;
      height: 7.0625rem;
      border-radius: 0.3125rem;
      flex-shrink: 0;
      margin-right: 0.75rem;
    }

    .goods-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        width: 100%;
        // height: 2.5rem;
        line-height: 1.25rem;
        font-size: 0.9375rem;
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .goods-price {
        display: flex;
        justify-content: space-between;

        .price {
          font-size: 0.7813rem;
          color: #f14e4e;

          .price-num {
            padding-left: 0.3125rem;
            font-size: 0.9375rem;
          }
        }

        .icon-cart {
          width: 1.5313rem;
          height: 1.5313rem;
          line-height: 1.4rem;
          color: #f14e4e;
          font-size: 1.25rem;
          border: solid 1px #f14e4e;
          border-radius: 50%;
          text-align: center;
        }

        .specsNum {
          position: absolute;
          display: inline-block;
          top: -1rem;
          right: -0.375rem;
          height: 1.3rem;
          line-height: 1.3rem;
          padding: 0 0.45rem;
          text-align: center;
          color: #fff;
          font-size: 0.5rem;
          background-color: #ee0a24;
          border-radius: 50%;
        }

        .stepper {
          float: right;
          text-align: right;
          width: 9.375rem;
        }

        .option-text-btn {
          position: relative;
        }
      }
    }

    .specs-text {
      float: right;
      padding: 0.3125rem;
      color: #fff;
      font-size: 0.5rem;
      border-radius: 0.3125rem;
      background-color: #ee0a24;
    }
  }
}

.share-box {
  position: fixed;
  bottom: 5.5rem;
  width: 5rem;
  height: 12.5rem;

  .more {
    margin-left: 0.8rem;
  }

  .more-item li {
    margin-bottom: 0.4688rem;
    width: 2.813rem;
    height: 2.813rem;
    // line-height: 2.813rem;
    color: #fff;
    font-size: 12px;
    border-radius: 50%;
    text-align: center;
    background-color: #f14e4e;

    &:nth-child(1) {
      padding-top: 3px;
    }

    &:nth-child(2) {
      padding-top: 0.8rem;
    }

    &:nth-child(3) {
      padding-top: 0.8rem;
    }
  }

  .icon-img {
    position: absolute;
    padding-top: 4px;
    left: 1rem;
    top: 10rem;
    width: 2.188rem;
    height: 2.188rem;
    line-height: 2.188rem;
    border-radius: 50%;
    text-align: center;
    background-color: #f14e4e;

    img {
      width: 1.2rem;
      height: 1.2rem;
    }

    .m-top {
      margin-top: 2.5rem;
    }
  }

  .more-item li span {
    width: 25px;
    display: inline-block;
  }

  .btn-share {
    display: inline-block;
    margin-right: 0.4688rem;
    height: 2.5rem;
    text-align: right;

    .van-icon-share {
      width: 3.2rem;
      height: 3.2rem;
      line-height: 3rem;
      text-align: center;
      position: absolute;
      right: 0.3125rem;
      background-color: #fff;
      border-radius: 50%;
      border: 1px solid #eee;
    }
  }
}

.go-shop {
  position: fixed;
  bottom: 0;
  width: 23.4375rem;
  background-color: #fff;
  border: 1px solid #ddd;

  .left-cart {
    float: left;
    height: 100%;

    &:nth-of-type(1) {
      color: #333;
      font-size: 1rem;
    }

    .price {
      color: #f14e4e;
      font-size: 1rem;
      padding: 0 0.3125rem;
      font-weight: 700;
      vertical-align: middle;
    }

    .van-icon-warning-o {
      vertical-align: middle;
    }

    .des {
      font-size: 0.75rem;
      color: #999;
    }

    .carnum-style {
      position: absolute;
      height: 1rem;
      left: 1.6563rem;
      top: 0.25rem;
      line-height: 1rem;
      background: #f14e4e;
      border-radius: 1rem;
      color: #fff;
      padding: 0.0313rem 0.3rem;
      font-size: 0.75rem;
    }
  }

  .go-cart {
    margin-top: 0.9rem;
    margin-right: 0.3rem;
    float: right;
    width: 5.625rem;
    height: 2.125rem;
    line-height: 2.2rem;
    text-align: center;
    background-color: #f14e4e;
    border-radius: 34px;
    color: #fff;
    font-size: 1rem;
  }

  .cart {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 40px;
    color: #f14e4e;
  }

  .cart-box {
    margin-right: 0.4688rem;
    width: 2.5rem;
    height: 3.75rem;
    line-height: 3.3rem;
  }

  .cart-text {
    margin-top: 0.5rem;
    width: 13rem;
    height: 100%;
    margin-left: 4rem;
  }
}

.pcStyle {
  width: 375px;
}

.rules-content {
  width: 100%;
  height: 14.0625rem;
  padding: 0 0.7813rem;
  font-size: 1.0625rem;
  color: #202020;

  .rules-title {
    margin-top: 0.9375rem;
  }

  .rules-text {
    font-size: 1rem;
    color: #333;
  }
}

.hint {
  font-size: 0.9375rem;
  color: #202020;
}

.know {
  margin: 1rem auto;
  width: 20.2188rem;
  height: 2.75rem;
  line-height: 2.75rem;
  text-align: center;
  background-color: #f14e4e;
  border-radius: 44px;
  color: #fff;
  font-size: 1.0625rem;
}

.van-popup {
  // /deep/深入添加样式
  /deep/.van-share-sheet__options {
    justify-content: space-around;
  }
}
// 当没有活动倒计时的商品列表的样式
.position-relatvie {
  position: relative;
  top: -3.5rem;
}

.activity-end {
  width: 100%;
  height: 100%;
  text-align: center;
}

.end-text {
  margin: 1.4rem 0 3.2rem 0;
  font-size: 1.1875rem;
}

.end-img {
  display: block;
  margin-top: 4.6875rem;
  width: 13.125rem;
  height: 10rem;
}

.go-stroll {
  margin: 0 auto;
  width: 11.25rem;
  height: 2.6875rem;
  line-height: 2.6875rem;
  text-align: center;
  font-size: 1.125rem;
  background-color: #f14e4e;
  color: #fff;
  border-radius: 1.3438rem;
}

.poster-box {
  width: 20.625rem;
  height: 25.4063rem;

  img {
    width: 100%;
    height: 100%;
  }

  background-size: 100% 100%;
  text-align: center;

  ul {
    overflow: hidden;

    li {
      &:nth-child(1) {
        color: #fff;
        font-size: 0.875rem;

        .store-name {
          margin: 0.5rem 0 2.5rem 0;
        }
      }

      &:nth-child(3) {
        font-size: 0.8125rem;
        color: #666;
      }

      &:nth-child(4) {
        margin: 1.5625rem 0 0.625rem 0;

        img {
          width: 5.625rem;
          height: 5.625rem;
        }
      }

      &:nth-child(5) {
        font-size: 1.0625rem;
        color: #202020;
      }
    }

    .win-first {
      font-size: 0.9375rem;
      color: #333;
    }

    .win-second {
      margin: 0.9375rem 0 2.2rem 0;
      font-size: 1.375rem;
      color: #f14e4e;
    }

    .store-img {
      display: block;
      margin-top: 0.625rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }
  }

  .fingerprint {
    position: absolute;
    bottom: -1.5625rem;
    z-index: 100;
  }

  /* 可以设置不同的进入和离开动画 */

  /* 设置持续时间和动画函数 */
  .slide-fadeone-enter-active {
    opacity: 0;
  }

  #fixed-price .poster-box img {
    width: 370px;
  }
}
</style>
<style lang="scss">
.pcStyle #fixed-price .set-pc-styleLeft {
  margin-left: 0;
}

.pcStyle #fixed-price .specifications {
  text-align: center;
}

.pcStyle #fixed-price .yz_wechatShareImg-main {
  position: absolute;
  width: 375px;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.pcStyle #fixed-price .yz_wechatShareImg-main p {
  width: 375px;
}
</style>
