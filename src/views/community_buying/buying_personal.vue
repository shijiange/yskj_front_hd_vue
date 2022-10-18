<!-- 社区团购 会员端 -->
<template>
  <div id="buying_personal" :style="{ '--color': `${themeColor}` }">
    <c-title :hide="false" text="社区团购"></c-title>
    <div class="top-box">
      <div class="deliver" :style="{ backgroundColor: `${themeColor}` }">
        <img :src="deliver.avatar" alt="" class="deliver-thumb" />
        <div class="deliver-info">
          <div class="deliver-name">{{ deliver.deliver_name }}</div>
          <div class="region"><i class="iconfont icon-fontclass-dizhi"></i>{{ deliver.address }}</div>
          <div class="address">{{ deliver.full_address }}</div>
        </div>
        <div class="buyInfo" v-if="!fun.isTextEmpty(deliver.aptitute) || !fun.isTextEmpty(deliver.thumb)" @click="changeTemplate">
          {{ isBusinessInfo ? "团购商品" : "商家信息" }}
        </div>
      </div>
    </div>
    <div class="notice">
      <i class="iconfont icon-fontclass-gonggao"></i>
      <div class="notice-text" v-html="group.description"></div>
    </div>

    <div class="countdown">
      <i class="iconfont icon-naozhong"></i>
      <template v-if="group.group_status != 2">
        <div style="font-weight: bold;">距离活动{{ group.group_status == 1 ? "结束" : "开始" }}还剩</div>
        <van-count-down :time="time" class="tiem-box" @finish="finishTime">
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
      <template v-if="group.group_status == 2">活动已结束</template>
    </div>

    <div class="goods-list" v-if="!isBusinessInfo">
      <div class="good-child" v-for="item in group.deliver_goods" :key="item.id" @click="showGoodPup(item.id)">
        <div class="good-img">
          <img :src="item.thumb" alt="" />
        </div>
        <div class="good-info">
          <div class="good-title">{{ item.title }}</div>
          <div class="goods-purchased">
            <i class="iconfont icon-fontclass-redu"></i>
            <div class="text">已售{{ item.show_sales }}件</div>
            <i class="iconfont icon-fontclass-kucun"></i>
            <div class="text">库存{{ item.stock }}件</div>
          </div>
          <div class="good-buy">
            <div class="good-price">
              {{ $i18n.t("money") }}
              <div class="price">{{ item.price }}</div>
              <template v-if="item.has_option == 1">起</template>
            </div>
            <div class="select" @click.stop v-if="group.group_status == 1">
              <template v-if="(!goodsCartsTotal[item.id] && item.has_option != 1) || (goodsCartsTotal[item.id] && goodsCartsTotal[item.id].total == 0)">
                <transition name="slide-fadeone">
                  <i class="iconfont icon-life-game-plus" @click.stop="addCart(item.id, 1, 0)" :style="{ backgroundColor: `${themeColor}` }"></i>
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
                <div class="option-text-btn" :style="{ backgroundColor: `${themeColor}` }" @click.stop="selectOption(item.id)">
                  选规格<em v-if="goodsCartsTotal[item.id]">{{ goodsCartsTotal[item.id].total }}</em>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container" v-if="!isBusinessInfo">
      <div class="floatBtn">
        <div class="my" :style="{ backgroundColor: `${themeColor}` }" :class="[alertFlag ? 'close' : '']" @click.stop="openAlert">
          <div v-if="!alertFlag">
            <i style="height: 35px;" class="iconfont icon-fontclass-wode"></i>
            <div>我的</div>
          </div>
          <i v-else style="height: 52px; font-size: 36px;" class="iconfont icon-close11"></i>
        </div>

        <div :style="{ backgroundColor: `${themeColor}` }" @click.stop="gotoUrl('orderlist', { status: 0 })" class="cc" :class="[alertFlag ? 'c1 ccs' : '']">
          订单
        </div>
        <div :style="{ backgroundColor: `${themeColor}` }" @click.stop="showShare = true" class="cc" :class="[alertFlag ? 'c2 ccs' : '']">
          分享
        </div>
        <div :style="{ backgroundColor: `${themeColor}` }" @click.stop="gotoUrl('member')" class="cc" :class="[alertFlag ? 'c3 ccs' : '']">
          <div>会员</div>
          <div>中心</div>
        </div>
        <div :style="{ backgroundColor: `${themeColor}` }" v-if="deliver.isManager" @click.stop="gotoUrl('communityBuyIndex')" class="cc" style="padding: 0 5px;" :class="[alertFlag ? 'c4 ccs' : '']">
          社群团购
        </div>
      </div>
    </div>

    <!-- 底部购物车 -->
    <div class="bottom-car set-pc-styleLeft" v-if="!isBusinessInfo && group.group_status == 1">
      <div class="car-box" :style="{ borderColor: `${themeColor}` }">
        <div class="car-num" @click.stop="showCarList = true">
          <div class="car-num-box">
            <i class="iconfont icon-all_buycar"></i>
            <div class="carnum-style" :style="{ backgroundColor: `${themeColor}` }">{{ cartsNum }}</div>
          </div>

          <div class="small-price">{{ $i18n.t("money") }}</div>
          {{ cartsTotal }}
        </div>
        <div class="car-add" :style="{ backgroundColor: `${themeColor}` }" @click.stop="checkGoods">结算</div>
      </div>
      <!-- <div class="car-box endstyle" v-if="info.state == 1">活动已结束</div> -->
    </div>

    <!-- 商家信息 -->
    <div v-if="isBusinessInfo">
      <div class="wrapper">
        <div class="h2">
          <div class="iconfont icon-fontclass-zhizhao"></div>
          <div class="name">资质</div>
        </div>
        <div class="quality">
          <img v-for="(item, index) in deliver.aptitute" :src="item" :key="index" />
        </div>
        <div class="h2 h2-business">
          <div class="iconfont icon-business icon-fontclass-shengchengjilu"></div>
          <div class="name">商家图片</div>
        </div>
        <div class="business">
          <img v-for="(item, index) in deliver.thumb" :src="item" :key="index" />
        </div>
      </div>
    </div>
    <!-- 商品详情页弹窗 -->
    <yzGoodsPopup v-model="showgp" :themeColor="themeColor" :goodsInfo="goodinfo" v-on:showgoodspecs="showgoodspecs"></yzGoodsPopup>
    <!-- 商品规格弹窗 -->
    <!-- v-on:addGoods="addGoods"
        v-on:reduceGoods="reduceGoods" -->
    <yz-specs v-model="popupSpecs" :themeColor="themeColor" :carts="carts" :goodsInfo="goodinfo" v-on:closeSpecsPopup="close_yz_specs_popup"></yz-specs>

    <!-- 购物车列表弹窗 -->
    <yz-cart-list :themeColor="themeColor" :cardata="carList" class="carlist" v-model="showCarList" v-on:blur="blurCart" v-on:plus="addGoods" v-on:minus="reduceGoods">
      <!-- 底部购物车 -->
      <div class="bottom-car set-pc-styleLeft">
        <div class="car-box">
          <div class="car-num" @click.stop="showCarList = false">
            <div class="car-num-box">
              <i class="iconfont icon-all_buycar"></i>
              <div class="carnum-style">{{ cartsNum }}</div>
            </div>

            <div class="small-price">{{ $i18n.t("money") }}</div>
            {{ cartsTotal }}
          </div>
          <div class="car-add" @click.stop="checkGoods">结算</div>
        </div>
      </div>
    </yz-cart-list>
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    <!-- 海报弹窗 -->
    <van-popup v-model="showposter" position="center" style="background-color: transparent;">
      <img :src="poster_url" alt="" style="width: 16rem;" />
    </van-popup>
    <!-- 微信分享提示 -->
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>

<script>
import buying_personal_controller from "./buying_personal_controller";
export default buying_personal_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#buying_personal {
  padding-bottom: 80px;

  /deep/img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }

  .top-box {
    padding: 0.875rem;
    background: #fff;

    .deliver {
      position: relative;
      background-color: var(--color);
      box-shadow: 0 0.156rem 0.406rem 0 rgba(3, 0, 0, 0.32);
      border-radius: 0.625rem;
      overflow: hidden;
      display: flex;
      padding: 1rem;

      .deliver-thumb {
        width: 3.313rem;
        height: 3.313rem;
        background-color: #1a1e27;
        // border: solid 0.125rem #b8b9ba;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 1.25rem;
      }

      .deliver-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: left;
        color: #fff;

        .deliver-name {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .region {
          margin-bottom: 0.375rem;

          i {
            font-size: 1rem;
          }
        }

        .address {
          font-size: 0.75rem;
        }
      }

      .buyInfo {
        position: absolute;
        top: 1.344rem;
        right: 0;
        font-size: 0.75rem;
        color: var(--color);
        width: 3.888rem;
        height: 1.375rem;
        padding-left: 0.625rem;
        line-height: 1.375rem;
        background-color: #fff;
        border-radius: 0.68rem 0 0 0.68rem;
      }
    }
  }

  .notice {
    display: flex;
    padding: 0.93rem 1.25rem 0.93rem 0.93rem;
    background-color: #fff;

    i {
      color: var(--color);
      font-size: 1rem;
      margin-right: 0.5rem;
    }
  }

  .notice .notice-text {
    color: var(--color);
    font-size: 0.75rem;
    flex: 1;
    overflow: hidden;

    img {
      max-width: 100% !important;
    }
  }

  .countdown {
    height: 2.938rem;
    padding: 0 0.938rem;
    color: #202020;
    font-size: 1rem;
    display: flex;
    align-items: center;

    i {
      font-size: 1.25rem;
      color: var(--color);
      font-weight: bold;
      margin-right: 0.25rem;
    }

    .tiem-box {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      margin-left: 0.5rem;

      .block {
        width: 1.5rem;
        height: 1.5rem;
        line-height: 1.5rem;
        border-radius: 50%;
        overflow: hidden;
        background: #fff;
        color: var(--color);
        display: block;
      }
    }
  }

  .goods-list {
    padding: 0 0.938rem;

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
          font-size: 0.938rem;
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

          i {
            color: #ff7c48;
          }
        }

        .good-buy {
          display: flex;

          .option-text-btn {
            background: var(--color);
            font-size: 0.75rem;
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
              background: inherit;
              height: 1rem;
              line-height: 1rem;
              padding: 0 0.25rem;
              font-size: 12px;
              box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
            }
          }

          .good-price {
            font-size: 0.75rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            flex: 1;
            color: var(--color);

            .price {
              font-size: 1.125rem;
            }
          }

          .select {
            flex-shrink: 0;
            padding: 0.25rem 0.25rem 0;

            .iconfont {
              background: var(--color);
              color: #fff;
              width: 1.25rem;
              height: 1.25rem;
              text-align: center;
              line-height: 1.25rem;
              border-radius: 50%;
              display: block;
            }

            /deep/.van-stepper {
              /deep/.van-stepper__minus {
                color: var(--color);
                border-color: var(--color);
              }

              /deep/.van-stepper__plus {
                background-color: var(--color);
              }
            }
          }
        }
      }
    }
  }

  .bottom-car {
    position: fixed;
    width: 100%;
    height: 4.5rem;
    left: 0;
    bottom: -1px;
    display: flex;
    align-items: center;
    background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0), #fff 19%);

    .car-box {
      border: 1px solid var(--color);
      border-radius: 1.5rem;
      display: flex;
      align-items: center;
      height: 3rem;
      line-height: 3rem;
      width: 90%;
      margin: 0 auto;
      overflow: hidden;

      .car-num-box {
        position: relative;
        width: 3rem;
        text-align: center;

        .carnum-style {
          position: absolute;
          height: 1rem;
          right: 0;
          top: 5px;
          line-height: 1rem;
          background: var(--color);
          border-radius: 1rem;
          color: #fff;
          padding: 0 0.25rem;
          font-size: 0.75rem;
        }
      }

      .car-num {
        width: 50%;
        // text-indent: 1.25rem;
        text-align: left;
        color: var(--color);
        display: flex;

        i {
          font-size: 1.5rem;
        }

        .small-price {
          font-size: 0.75rem;
        }

        font-size: 1.125rem;
      }

      .car-add {
        flex: 1;
        text-align: center;
        background-color: var(--color);
        color: #fff;
      }
    }

    .endstyle {
      background: #d8d8d8;
      border-color: #d8d8d8;
      color: #fff;
      text-align: center;
      font-size: 1.25rem;
      display: block;
    }
  }

  .carlist {
    .bottom-car {
      position: relative;
    }
  }

  .container {
    position: fixed;
    left: 50%;
    bottom: 5rem;
    width: 2.813rem;
    height: 2.813rem;
    border-radius: 50%;
    transform: translateX(-10rem);

    .floatBtn {
      width: 2.813rem;
      height: 2.813rem;
      border-radius: 50%;
      position: relative;

      .my {
        width: 2.813rem;
        height: 2.813rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 0.688rem;
        color: #fff;
        position: relative;
        z-index: 2;
        border-radius: 50%;
        background-color: var(--color);
        box-shadow: 0 0.094rem 0.219rem 0 rgba(131, 131, 131, 0.59);
        transition: 0.5s;

        &.close {
          transform: rotate(720deg) scale(0.7);
        }
      }

      .cc {
        position: absolute;
        left: 0;
        top: 0;
        width: 2.813rem;
        height: 2.813rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 0.688rem;
        color: #fff;
        background-color: var(--color);
        transition: 0.5s;
      }

      .ccs {
        box-shadow: 0 0.094rem 0.219rem 0 rgba(255, 255, 255, 0.2);
      }

      .c1 {
        top: -4rem;
      }

      .c2 {
        top: -8rem;
      }

      .c3 {
        top: -12rem;
      }

      .c4 {
        top: -16rem;
      }
    }
  }

  .wrapper {
    background-color: #fff;
    margin-top: 0.625rem;
    padding-top: 0.938rem;
    padding-left: 0.938rem;
    height: calc(100% - 11rem);

    .h2 {
      display: flex;
      align-items: center;

      .iconfont {
        color: var(--color);
        font-size: 50px;

        &.icon-business {
          font-size: 40px;
        }
      }

      .name {
        font-size: 1.063rem;
        margin-left: 0.5rem;
        color: #202020;
      }

      &.h2-business {
        margin-top: 1.5rem;
      }
    }

    .quality {
      img {
        width: 12.5rem;
        height: 9.375rem;
      }
    }

    .business {
      img {
        width: 6.25rem;
        height: 6.25rem;
        margin-right: 0.625rem;
      }
    }
  }
}
</style>
