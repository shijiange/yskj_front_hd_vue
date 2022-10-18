<!-- 社群接龙 -->
<template>
  <div id="community_solitaire">
    <c-title :hide="false" :text="'社群接龙'"></c-title>
    <div class="container">
      <!-- 飘窗 -->
      <div class="floating-window">
        <van-swipe class="swiperContainer" vertical :autoplay="2500" :show-indicators="false">
          <!-- <van-swipe-item class="swiperItem"></van-swipe-item> -->
          <van-swipe-item class="swiperItem" v-for="(item, key) in list.slice(0, 10)" :key="key">
            <div class="wrapper">
              <div class="image">
                <img :src="item.has_one_member ? item.has_one_member.avatar_image : require('../../../assets/images/img_default.png')" />
              </div>
              <div class="text">
                <span>{{ item.has_one_member ? item.has_one_member.nickname : "" }}完成接龙，购买了{{ item.title_list[0] }}</span>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="countdown" v-if="info.end_time">
        <template v-if="info.state == 0">
          <template v-if="new Date().getTime() < Number(info.end_time) && new Date().getTime() > Number(info.start_time)">
            距离活动结束还剩
            <van-count-down :time="Number(info.end_time) - new Date().getTime()" class="tiem-box">
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
          <template v-if="new Date().getTime() < Number(info.start_time)">
            距离活动开始还有
            <van-count-down :time="Number(info.start_time) - new Date().getTime()" class="tiem-box">
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
        <template v-else>活动已结束</template>
      </div>
      <div class="countdown" v-if="!info.end_time">正在为您加载中...</div>
      <div class="notice">
        <div class="notice-title">{{ info.activity_name }}</div>
        <div class="notice-award" v-if="!fun.isTextEmpty(info.rule_list)">
          <div class="notice-award-child" v-for="(item, index) in info.rule_list" :key="index">{{ item }}</div>
        </div>
        <div class="notice-content" v-html="info.desc"></div>
      </div>
      <div class="goods-list">
        <div class="good-child" v-for="item in info.goods_list" :key="item.id" @click="showGoodPup(item.id)">
          <div class="good-img">
            <img v-lazy="item.thumb || emptyImage" alt="" />
          </div>
          <div class="good-info">
            <div class="good-title">{{ item.title }}</div>
            <div class="goods-purchased" v-if="Number(item.count > 0)">
              <div class="buyer-imgs" >
                <img v-lazy="img || emptyImage" alt="" v-for="(img, i) in item.avatar_arr" :key="i" />
              </div>
              {{ item.count }}人已购买
            </div>
            <div class="good-buy">
              <div class="good-price">
                {{ $i18n.t("money") }}
                <div class="price">{{ item.price }}</div>
                <template v-if="item.has_option == 1">起</template>
              </div>
              <div class="select" @click.stop>
                <template v-if="(!goodsCartsTotal[item.id] && item.has_option != 1) || (goodsCartsTotal[item.id] && goodsCartsTotal[item.id].total == 0)">
                  <transition name="slide-fadeone">
                    <i class="iconfont icon-life-game-plus" @click.stop="addCartRequest(item.id, 1, 0)"></i>
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
                    选规格<em v-if="goodsCartsTotal[item.id]">{{ goodsCartsTotal[item.id].total }}</em>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buy-log" v-if="!fun.isTextEmpty(list)">
        <div class="buy-log-title">
          <div class="decoration left-decoration">
            <div class="line"></div>
            <div class="circle-o"></div>
            <div class="circle"></div>
          </div>
          <div class="title">他们都在买</div>
          <div class="decoration right-decoration">
            <div class="circle"></div>
            <div class="circle-o"></div>
            <div class="line"></div>
          </div>
        </div>

        <div class="log-list">
          <div class="list" v-for="item in list" :key="item.id">
            <div class="index">{{ item.pay_sort }}.</div>
            <img :src="item.has_one_member ? item.has_one_member.avatar_image : require('../../../assets/images/img_default.png')" alt="" class="avatar" />
            <div class="order-info">
              <div>{{ item.has_one_member ? item.has_one_member.nickname : "" }}</div>
              <div>{{ item.title_list[0] }}</div>
            </div>
            <div class="order-time">
              <div>
                {{
                  fun
                    .timestampToTime(item.pay_time)
                    .toString()
                    .slice(0, 10)
                }}
              </div>
              <div>
                {{
                  fun
                    .timestampToTime(item.pay_time)
                    .toString()
                    .slice(10)
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部购物车 -->
      <div class="bottom-car set-pc-styleLeft">
        <div class="car-box" v-if="info.state == 0 && new Date().getTime() < Number(info.end_time) && new Date().getTime() > Number(info.start_time)">
          <div class="car-num" @click.stop="showCarListM">
            <div class="car-num-box">
              <i class="iconfont icon-all_buycar"></i>
              <div class="carnum-style">{{ cartsNum }}</div>
            </div>

            <div class="small-price">{{ $i18n.t("money") }}</div>
            {{ cartsTotal }}
          </div>
          <div class="car-add" @click.stop="checkGoods">接龙购买</div>
        </div>
        <div class="car-box endstyle" v-if="info.state == 1">活动已结束</div>
        <div class="car-box endstyle" v-if="info.state == 0 && new Date().getTime() < Number(info.start_time)">
          活动未开始
        </div>
      </div>
      <!-- 海报弹窗 -->
      <van-popup v-model="showposter" position="center" style="background-color: transparent;">
        <img :src="poster_url" alt="" style="width: 16rem;" />
      </van-popup>
      <!-- 悬浮按钮 -->
      <div class="float-nav set-pc-style">
        <div class="nav-child" @click.stop="showShare = true"><i class="iconfont icon-zb_all_share"></i>分享</div>
        <router-link :to="fun.getUrl('orderlist', { status: 0 })" class="nav-child" tag="div"><i class="iconfont icon-fontclass-shangpindingdan"></i>订单 </router-link>
      </div>
    </div>
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
    <!-- 商品详情页弹窗 -->
    <yzGoodsPopup v-model="showgp" :goodsInfo="goodinfo" v-on:showgoodspecs="showgoodspecs"></yzGoodsPopup>
    <!-- 商品规格弹窗 -->

    <!-- v-on:addGoods="addGoods"
        v-on:reduceGoods="reduceGoods" -->
    <yz-specs :carts="carts" :goodsInfo="goodinfo" v-model="popupSpecs" v-on:closeSpecsPopup="close_yz_specs_popup"></yz-specs>

    <!-- 购物车列表弹窗 -->
    <yz-cart-list v-model="showCarList" :cardata="carList" class="carlist" v-on:blur="blurCart" v-on:plus="addGoods" v-on:minus="reduceGoods">
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
          <div class="car-add" @click.stop="checkGoods">接龙购买</div>
        </div>
      </div>
    </yz-cart-list>
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
    <yz-myinfo v-model="showFrom" v-on:confirm="confirmRrom" :mydata="mydata"></yz-myinfo>
  </div>
</template>

<script>
import index_controller from "./index_controller";

export default index_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#community_solitaire {
  padding-bottom: 80px;
  min-height: 100vh;

  /deep/ .van-popup__close-icon {
    border-radius: 50%;
    background: #f2f2f2;
    padding: 0.25rem;
    font-size: 0.875rem;
    color: #9b9b9b;
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
      border: 1px solid #f14e4e;
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
          background: #f14e4e;
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
        color: #f14e4e;
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
        background-color: #f14e4e;
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
    position: relative;
    padding: 0 0.875rem;

    .floating-window {
      position: fixed;
      top: 4rem;
      left: 50%;
      transform: translateX(-11rem);

      .swiperContainer {
        height: 3rem;
        width: 18.375rem;

        .swiperItem {
          height: 3rem;
          width: 18.375rem;

          .wrapper {
            width: 18.375rem;
            height: 2rem;
            margin: 0.5rem 0;
            display: flex;
            padding: 0 0.375rem;
            align-items: center;
            overflow: hidden;
            background: #ffcc32;
            border-radius: 1.5rem;

            .image {
              width: 1.5rem;
              height: 1.5rem;
              display: flex;
              margin-right: 0.5rem;
              align-items: center;

              img {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
                overflow: hidden;
              }
            }

            .text {
              font-size: 0.75rem;
              text-align: left;
              flex: 1;
              color: #fff;
              overflow: hidden; /* 超出部分隐藏 */
              text-overflow: ellipsis; /* 超出部分显示省略号 */
              white-space: nowrap; /* 规定段落中的文本不进行换行 */
            }
          }
        }
      }
    }

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
      height: 3rem;
      line-height: 3rem;
      align-items: center;

      .bottom_time {
        color: #fff;
        display: flex;
        margin-left: 0.5rem;

        /deep/ span {
          color: #fff;
          font-size: 0.75rem;
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
      padding: 0.75rem;
      margin-bottom: 0.625rem;
      text-align: left;

      .notice-title {
        font-size: 1.125rem;
        font-weight: bold;
        color: #000;
        margin-bottom: 0.5rem;
      }

      .notice-award {
        background-color: #fff7f7;
        border-radius: 0.125rem;
        padding: 0.5rem;
        color: #f14e4e;
        font-size: 0.75rem;
        line-height: 1.375rem;
        margin-bottom: 0.5rem;
      }

      .notice-content {
        font-size: 0.875rem;
        color: #666;

        /deep/ img {
          max-width: 100%;
        }
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
            font-size: 1rem;
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
                background: #f14e4e;
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
              color: #f14e4e;

              .price {
                font-size: 1.125rem;
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
        }
      }
    }

    .buy-log {
      background: #fff;
      border-radius: 0.625rem;
      color: #333;

      .buy-log-title {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem 0;

        .decoration {
          display: flex;
          align-items: center;

          .line {
            width: 2.5rem;
            border-bottom: 1px solid #f14e4e;
          }

          .circle-o {
            border-radius: 50%;
            border: 1px solid #f14e4e;
            height: 0.625rem;
            width: 0.625rem;
          }

          .circle {
            border-radius: 50%;
            border: 1px solid #f14e4e;
            height: 0.625rem;
            width: 0.625rem;
            background: #f14e4e;
          }
        }

        .left-decoration {
          .circle {
            margin-left: -5px;
          }
        }

        .right-decoration {
          .circle {
            margin-right: -5px;
          }
        }

        .title {
          margin: 0 0.875rem;
          color: #202020;
          font-size: 1rem;
        }
      }

      .log-list {
        padding: 0 0.875rem;

        .list {
          display: flex;
          align-items: center;
          text-align: left;
          padding-bottom: 0.75rem;
          font-size: 0.75rem;

          .index {
            width: 2rem;
          }

          .avatar {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            margin: 0;
            margin-right: 0.5rem;
          }

          .order-info {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;

            div {
              width: 100%;
              line-height: 1.125rem;
              overflow: hidden; /* 超出部分隐藏 */
              text-overflow: ellipsis; /* 超出部分显示省略号 */
              white-space: nowrap; /* 规定段落中的文本不进行换行 */
            }
          }

          .order-time {
            display: flex;
            line-height: 1.125rem;
            flex-direction: column;
            text-align: right;
          }
        }
      }
    }

    .float-nav {
      position: fixed;
      left: 0.875rem;
      bottom: 4.875rem;

      .nav-child {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.625rem;
        font-size: 0.625rem;
        color: #333;

        i {
          font-size: 1.125rem;
          color: #f14e4e;
        }
      }
    }
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
        }

        .button-content.red {
          color: #fff;
          background-color: #f15353;
          border: none;
        }
      }
    }
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
