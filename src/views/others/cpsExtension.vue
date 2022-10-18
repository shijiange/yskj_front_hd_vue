<template>
  <div id="cpsExtension" :style="{ backgroundColor: datas.page_setting ? datas.page_setting.background_color : '#ffb32f' }">
    <div class="navtab" :style="{ backgroundColor: datas.page_setting ? datas.page_setting.tab_color : '#ffb32f' }">
      <van-tabs
        ref="tabsNav"
        v-model="active"
        @click="actChange"
        :background="datas.page_setting ? datas.page_setting.tab_color : '#ffb32f'"
        title-active-color="#ffffff"
        title-inactive-color="#ffe3be"
        swipe-threshold="4"
        color="#ffffff"
      >
        <van-tab :title="item.another_name" v-for="(item, ind) in info" :key="ind"></van-tab>
      </van-tabs>
    </div>
    <div class="banner">
      <img :src="datas.top_image ? datas.top_image : topImg" alt="" @click="toLink(datas.top_image)" />
    </div>
    <div class="contenbox">
      <div class="topbox">
        <div class="coupon" style="background-color: #fff8ed;">
          <i class="iconfont icon-fontclass-youhuiquan1" style="color: #fe9a03; font-size: 2rem;"></i>
          <div>先领券</div>
        </div>
        <div class="rightIcon order">
          <i class="iconfont icon-advertise-next" style="margin-right: -0.6rem;"></i>
          <i class="iconfont icon-advertise-next"></i>
        </div>
        <div class="coupon " style="background-color: #eef8fe;">
          <i class="iconfont icon-fontclass-xaidan" style="color: #2f9cff; font-size: 2rem;"></i>
          <div>再下单</div>
        </div>
        <div class="rightIcon order">
          <i class="iconfont icon-advertise-next" style="margin-right: -0.6rem;"></i>
          <i class="iconfont icon-advertise-next"></i>
        </div>
        <div class="coupon" style="background-color: #eff3ff;">
          <i class="iconfont icon-fontclass-fanli" style="color: #3c6eff; font-size: 2rem;"></i>
          <div>拿返利</div>
        </div>
        <!-- 圆 -->
        <div class="circleBox">
          <div class="circle" :style="{ backgroundColor: datas.page_setting ? datas.page_setting.background_color : '' }"></div>
          <div class="circle circle2" :style="{ backgroundColor: datas.page_setting ? datas.page_setting.background_color : '' }"></div>
        </div>
        <div class="circleBox2">
          <div class="circle" :style="{ backgroundColor: datas.page_setting ? datas.page_setting.background_color : '' }"></div>
          <div class="circle circle2" :style="{ backgroundColor: datas.page_setting ? datas.page_setting.background_color : '' }"></div>
        </div>
        <!-- 圆end -->
      </div>
      <div class="bottomBox">
        <!-- 连接start -->
        <div class="circleBox">
          <div class="circle" :style="{ backgroundColor: datas.page_setting ? datas.page_setting.background_color : '' }"></div>
          <div class="circle circle2" :style="{ backgroundColor: datas.page_setting ? datas.page_setting.background_color : '' }"></div>
        </div>
        <div class="circleBox2">
          <div class="circle" :style="{ backgroundColor: datas.page_setting ? datas.page_setting.background_color : '' }"></div>
          <div class="circle circle2" :style="{ backgroundColor: datas.page_setting ? datas.page_setting.background_color : '' }"></div>
        </div>
        <div class="line" style="top: -1.05rem; right: 2.8rem;"></div>
        <div class="line" style="top: -1.05rem; right: 3.7rem;"></div>
        <div class="line" style="top: -1.05rem; left: 2.8rem;"></div>
        <div class="line" style="top: -1.05rem; left: 3.7rem;"></div>
        <!-- 连接end -->
        <!-- 二维码 start -->
        <div class="codeBox" v-if="datas.mini_qrcode_url">
          <img :src="datas.mini_qrcode_url" alt="" />
        </div>
        <!-- 二维码end -->

        <!-- 优选按钮 start -->
        <template v-for="(item, ind) in buttonArr">
          <div v-if="buttonArr" :key="ind">
            <div class="redBtn_wm" v-if="item == datas.another_id && item != '1104'" @click="toLink(datas.web_url, datas)">{{ datas.page_setting.button_text }}</div>
            <div class="redBtn" v-if="item == '1104' && datas.another_id != '1104'" @click="goPageYx('1104')">领取优选红包</div>
            <div class="redBtn" v-if="datas.another_id == '1104'" @click="toLink(datas.web_url)">领取优选红包</div>
          </div>
        </template>

        <!-- 优选按钮 end -->

        <!-- 分享 -->
        <div class="priceShare_s" @click="getShare">
          <i class="iconfont icon-fontclass-fenxiang1"></i>
          分享给好友
        </div>
      </div>
      <template>
        <div class="redBox" v-if="datas.page_setting">
          <div v-for="(item, ind) in datas.page_setting.bottom_button" :key="ind">
            <div class="hotel_left" v-if="item == '1101'" @click="goPage('1101')">
              <div class="txt">酒店红包</div>
              <div class="hbBtn">免费领取</div>
            </div>
            <div class="market_right" v-if="item == '506'" @click="goPage('506')">
              <div class="txt">商超红包</div>
              <div class="hbBtn">免费领取</div>
            </div>
          </div>
        </div>
        <div class="elmfruits" v-if="datas.another_id == '101'">
          <div class="elmLeft">
            <div>饿了么果蔬红包</div>
            <div class="txt">最高36元天天领</div>
          </div>
          <div class="elmRight" @click="goPage('103')">免费领取</div>
        </div>
        <div class="rule">
          <div class="ruleBox" v-html="datas.bottom_message"></div>
          <div class="ruletxt">活动规则</div>
        </div>
      </template>
    </div>
    <van-popup v-model="show" style="width: 20rem;">
      <div class="shareImg">
        <img :src="shareImg" alt="" @click="imgPreview(shareImg)" />
      </div>
    </van-popup>
    <yz_bindMobile v-show="show1" ref="yz_bindMobile" @bindSuccess="getdata"></yz_bindMobile>
  </div>
</template>
<script>
import cpsExtension_controller from "./cpsExtension_controller";

export default cpsExtension_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#cpsExtension {
  .van-popup {
    background: transparent !important;
  }

  .shareImg {
    width: 100%;

    img {
      width: 100%;
    }
  }

  .navtab {
    padding-left: 5.2rem;
    padding-right: 7rem;
  }

  .contenbox {
    padding: 0.81rem 0.94rem;
    box-sizing: border-box;
    // 饿了么
    .elmfruits {
      background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/cps/cpselmhb.png");
      background-size: cover;
      background-repeat: no-repeat;
      width: 21.56rem;
      height: 6.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.25rem 0 1.4rem;

      .elmLeft {
        font-size: 1.31rem;
        color: #5c739f;
        text-align: left;

        .txt {
          font-size: 1.06rem;
          color: #5c739f;
        }
      }

      .elmRight {
        width: 6.88rem;
        height: 2.06rem;
        background-color: #9cb6d9;
        border-radius: 1.03rem;
        font-size: 0.94rem;
        color: #5c739f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    // 外卖
    .redBox {
      display: flex;
      justify-content: space-between;
      margin-top: 0.63rem;

      .hotel_left {
        background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/cps/cpshotelhb.png");
        background-size: cover;
        background-repeat: no-repeat;
        width: 10.47rem;
        height: 5rem;
        padding: 0.8rem 0 0.63rem 0.94rem;
      }

      .market_right {
        background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/cps/cpsschb.png");
        background-size: cover;
        background-repeat: no-repeat;
        width: 10.47rem;
        height: 5rem;
        padding: 0.8rem 0 0.63rem 0.94rem;
      }

      .txt {
        font-size: 1.13rem;
        color: rgba(167, 99, 55, 1);
        text-align: left;
      }

      .hbBtn {
        margin-top: 0.6rem;
        width: 4.84rem;
        height: 1.56rem;
        background-color: #fff;
        border-radius: 0.78rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ff7366;
      }
    }

    .takeOutOpt {
      background-color: #fff;
      border-radius: 0.47rem;
      padding: 1.09rem 0.94rem 0.94rem 0.94rem;
      margin-top: 0.63rem;
      // 外卖商品
      .optLis {
        display: flex;
        align-items: center;

        .priceShare {
          font-size: 0.81rem;
          color: #f23104;
        }

        .boxtitleT {
          color: #262626;
          font-size: 0.63rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 0.44rem;
          margin-bottom: 0.39rem;
        }

        .optLisbox:nth-child(n + 2) {
          margin-left: 0.94rem;
        }

        .optLisbox {
          width: 4.22rem;
          margin-top: 0.88rem;

          .boximg {
            width: 4.22rem;
            height: 4.22rem;
            background-color: #c8c8c8;
            border-radius: 0.31rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 0.31rem;
            }
          }
        }
      }

      .optTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;

        .all {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: #8b8b8b;
        }
      }
    }

    .rule {
      width: 21.56rem;
      background-color: #fff;
      border-radius: 0.47rem;
      padding: 1.56rem 1.28rem 1.09rem 1.31rem;
      margin-top: 0.63rem;
      position: relative;

      .ruleBox {
        width: 18.97rem;
        border: dashed 0.03rem #f55f3e;
        border-radius: 0.4rem;
        padding: 1.69rem 0.59rem 1.69rem 0.94rem;

        /deep/ img {
          max-width: 100%;
        }
      }

      .ruletxt {
        position: absolute;
        left: 7.63rem;
        top: 0.8rem;
        font-size: 1.13rem;
        color: #f06230;
        width: 6.13rem;
        background-color: #fff;
        text-align: center;
      }
    }
    // 外卖end

    // 优选
    .optimization {
      padding: 1rem 1.09rem 1rem 1.09rem;
      background-color: #fff;
      margin-top: 0.63rem;

      .optLis {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 0.88rem;

        .optLisbox {
          height: 15.91rem;
          width: 9.22rem;
          margin-bottom: 0.97rem;

          .purchaseBtn {
            width: 5.31rem;
            height: 1.56rem;
            background-color: #e36535;
            border-radius: 0.78rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 0.81rem;
            margin-top: 0.63rem;
          }

          .priceShare {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.3rem;

            .priceShare_p {
              font-size: 0.94rem;
              color: #f23104;
            }

            .priceShare_s {
              font-size: 0.75rem;
              color: #7d7d7d;
            }
          }

          .boxtitleT {
            width: 100%;
            font-size: 0.88rem;
            color: #262626;
            text-align: left;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            margin-top: 0.6rem;
          }

          .boximg {
            width: 9.22rem;
            height: 9.22rem;
            background-color: #c8c8c8;
            border-radius: 0.31rem;

            img {
              border-radius: 0.31rem;
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .optTitle {
        text-align: left;
        font-size: 1rem;
        color: #262626;
      }
    }
    // 优选end
    .bottomBox {
      width: 100%;
      // height: 19.06rem;
      background-color: #fff;
      border-radius: 0.53rem;
      margin-top: 0.47rem;
      position: relative;
      padding: 3rem 3rem 2rem 3rem;

      .priceShare_s {
        color: #bfa446;
        font-size: 0.88rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1.09rem;
      }

      .codeBox {
        width: 9.69rem;
        height: 9.69rem;
        margin: 0 auto;
        margin-bottom: 1rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .redBtn_wm {
        width: 16rem;
        height: 3rem;
        background-color: #f95144;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.06rem;
        color: #fff;
        margin-bottom: 0.75rem;
      }

      .redBtn {
        width: 16rem;
        height: 3rem;
        background-color: #eecd59;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.06rem;
        color: #a76337;
      }

      .line {
        position: absolute;
        width: 0.38rem;
        height: 1.66rem;
        background-color: #fff;
        border-radius: 0.5rem;
      }

      .circleBox2 {
        position: absolute;
        top: 0.2rem;
        right: 2.69rem;
        display: flex;
      }

      .circleBox {
        position: absolute;
        top: 0.2rem;
        left: 2.69rem;
        display: flex;
      }

      .circle {
        width: 0.63rem;
        height: 0.63rem;
        border-radius: 100%;
      }

      .circle2 {
        margin-left: 0.25rem;
      }
    }

    .topbox {
      position: relative;
      width: 100%;
      height: 8.09rem;
      background-color: #fff;
      border-radius: 0.53rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.16rem;

      .circleBox2 {
        position: absolute;
        bottom: 0.2rem;
        right: 2.69rem;
        display: flex;
      }

      .circleBox {
        position: absolute;
        bottom: 0.2rem;
        left: 2.69rem;
        display: flex;
      }

      .circle {
        width: 0.63rem;
        height: 0.63rem;
        border-radius: 100%;
      }

      .circle2 {
        margin-left: 0.25rem;
      }

      .rightIcon {
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 1.4rem;
          color: #c5c5c5;
        }
      }

      .coupon {
        width: 4.69rem;
        height: 5rem;
        border-radius: 0.31rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
      }
    }
  }

  .banner {
    height: 10.94rem;
    width: 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
