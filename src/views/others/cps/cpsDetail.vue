<template>
  <div id="cpsDetail" v-if="goodsDetail.item_id">
    <!--<c-title :hide="false" text="商品详情"></c-title>-->
    <div class="topimg">
      <div class="header-box set-pc-styleLeft" :class="{ hoet: hoet }">
        <div class="back" @click="goBack">
          <i class="iconfont icon-member-left"></i>
        </div>
        <div class="member" @click="gotoUrl('member')">
          <i class="iconfont icon-wode-wode"></i>
        </div>
      </div>
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" v-if="goodsDetail.cover_image">
        <van-swipe-item>
          <img :src="goodsDetail.cover_image" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="contenBox">
      <!-- 价格 -->
      <div class="goodsPrice">
        <div style="display: flex;">
          <div class="goodsPrice_left">
            <span>￥</span><span class="goodsPrice_left_price">{{ goodsDetail.discount_price }}</span>
          </div>
          <div class="goodsPrice_left_row" v-if="goodsDetail.price > goodsDetail.discount_price">
            <span>折后价</span>
            <span class="original">原价￥{{ goodsDetail.price }}</span>
          </div>
        </div>
        <div class="goodsPrice_right">
          <span>已售 {{ goodsDetail.month_sales }}</span>
        </div>
      </div>
      <!-- 商品名称 -->
      <div class="goodsDetail">
        <div class="goodsDetail_left">
          <div class="shopType">{{ goodsDetail.platform_id == 2 ? "拼多多" : goodsDetail.platform_id == 1 ? "淘宝" : "京东" }}</div>
          <span>{{ goodsDetail.title }}</span>
        </div>
        <div class="goodsDetail_right">
          <div>预估赠送</div>
          <div style="color: #e64a40;">{{ ratioCommissionAmount }}{{ ratio_data.ratio_name }}</div>
        </div>
      </div>
      <!-- 优惠券 -->
      <div class="couponBox" v-if="goodsDetail.coupon_money > 0">
        <div class="dor">￥</div>
        <span class="couponBox_price">{{ goodsDetail.coupon_money }}</span>
        <div style="margin-left: 0.44rem;">
          <div style="text-align: left;">优惠券</div>
          <div class="time">{{ goodsDetail.coupon_starttime }}~{{ goodsDetail.coupon_endtime }}</div>
        </div>
        <div class="couponRight" @click="getCoupon">立即领券</div>
      </div>
      <!-- 门店 -->
      <div class="storeIn">
        <div class="store_left">
          <img :src="goodsDetail.shop_logo || goodsDetail.platform_icon" alt="" />
        </div>
        <div class="store_right">
          <div class="storeName">
            <span>{{ goodsDetail.shop_name }}</span>
            <!--<span class="btn">进入店铺</span>-->
          </div>
          <div class="evaluate" v-if="goodsDetail.dsr_info">
            <div>
              宝贝描述 <span style="color: #ff2424;">{{ goodsDetail.dsr_info.descriptionMatch }}</span>
            </div>
            <div>
              卖家服务 <span style="color: #ff2424;">{{ goodsDetail.dsr_info.serviceAttitude }}</span>
            </div>
            <div>
              物流服务 <span style="color: #ff2424;">{{ goodsDetail.dsr_info.deliverySpeed }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <!-- 详情 -->
    <div class="describe">
      <div class="describe_top">
        <span>宝贝描述</span>
        <div class="describe_top_r" @click="toShowContent">
          {{ showContent ? "收起" : "展开" }}
          <van-icon name="arrow-up" v-if="showContent" />
          <van-icon name="arrow-down" v-if="!showContent" />
        </div>
      </div>
      <div class="content" v-if="showContent">
        <img v-for="(img, i) in goodsDetail.images" :key="i" :src="img" alt="" />
      </div>
    </div>
    <!-- 下单导航 -->
    <div class="orderNav set-pc-styleLeft">
      <div class="leftNav">
        <div class="leftNav_min" @click="gotoUrl('home')">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/cps/icon-xiaoxi@2x@2x.png" alt="" />
          首页
        </div>
        <!--<div class="leftNav_min leftNav_min_right">-->
        <!--<i class="iconfont icon-fontclass-pingfen"></i>-->
        <!--收藏-->
        <!--</div>-->
      </div>
      <div class="btnAR">
        <div class="orderNav_left" @click="shareWeixin">
          <div class="orderNav_left_top">立即分享</div>
          <div class="orderNav_left_bottom" v-if="Number(shareCommissionAmount) > 0">收益{{ shareCommissionAmount }}</div>
        </div>
        <div class="orderNav_right" @click="getCoupon">
          <div class="orderNav_right_top">{{ goodsDetail.coupon_money > 0 ? "立即领券" : "立即购买" }}</div>
          <div class="orderNav_right_bottom" v-if="goodsDetail.coupon_money > 0">省{{ goodsDetail.coupon_money }}元</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { cpsApi } from "../../../utils/cpsApi"; //引入CPS方法
export default {
  mixins: [cpsApi],
  data() {
    return {
      good: {},
      hoet: false,
      showContent: true,

      ratioCommissionAmount: 0,
      shareCommissionAmount: 0
    };
  },
  activated() {
    this.good = this.$route.query;
    this.showContent = true;
    this.getCPSLogin("good");
    window.addEventListener("scroll", this.handleScroll);
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    getCoupon() {
      window.location.href = this.goodsDetail.coupon_click_url;
    },
    toShowContent() {
      this.showContent = !this.showContent;
    },
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7 || this.fun.isCPS()) {
        this.appShare();
        return;
      }
      this.$dialog.alert({ message: "请点击右上角微信分享" });
    },
    //app获取分享数据
    appSharesinit() {
      $http.post("member.member.wxJsSdkConfig", { url: document.location.href }).then(response => {
        if (response.result == 1) {
          this.appShare(response.data);
        }
      });
    },
    //app分享设置
    appShare(data) {
      let uid = window.localStorage.getItem("uid");
      let _link = document.location.href + "&share_tag=2";
      _link = this.fun.isMid(_link, uid);

      let _title = this.goodsDetail.title;
      let _imgUrl = this.goodsDetail.cover_image;
      let _desc = this.goodsDetail.title;

      let json = {
        title: _title, // 分享标题
        desc: _desc, // 分享描述
        link: _link, // 分享链接
        imgUrl: _imgUrl // 分享图标
      };
      if (this.fun.isCPS()) {
        if (this.fun.isIosOrAndroid() === "ios") {
          shareByH5IOS({ body: "shareByH5IOS", json: JSON.stringify(json) });
        } else {
          shareByH5Android(JSON.stringify(json));
        }
      } else {
        YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
      }
    },
    goBack() {
      if (this.fun.isCPS()) {
        if (this.fun.isIosOrAndroid() === "ios") {
          routeBackUrlIOS({ body: "routeBackUrlIOS" });
        } else {
          routeBackUrlAndroid();
        }
        return;
      }
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    gotoUrl(name, params = {}) {
      this.$router.push(this.fun.getUrl(name, params));
    },
    handleScroll() {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      this.hoet = top <= 40 ? false : true;
    }
  },
  components: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
/deep/.van-nav-bar {
  z-index: 2;
}

#cpsDetail {
  .orderNav {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 4.38rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.63rem 0 0.8rem;
    background: #fff;

    .leftNav {
      display: flex;
      margin-right: 0.5rem;

      .leftNav_min_right {
        margin-left: 1.5rem;
      }

      .leftNav_min {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #777;

        .icon-fontclass-pingfen {
          color: #aaa;
          font-size: 1.3rem;
        }

        img {
          width: 1.13rem;
          height: 1.13rem;
        }
      }
    }

    .btnAR {
      flex: 1;
      display: flex;

      .orderNav_right {
        flex: 1;

        /* width: 8.13rem; */
        height: 3.13rem;
        background-color: #e64a40;
        border-radius: 0 1.56rem 1.56rem 0;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        color: #fff;

        .orderNav_right_bottom {
          font-size: 0.75rem;
        }

        .orderNav_right_top {
          font-size: 1rem;
        }
      }

      .orderNav_left {
        flex: 1;

        /* width: 8.13rem; */
        height: 3.13rem;
        background-color: #e9c69a;
        border-radius: 1.56rem 0 0 1.56rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        .orderNav_left_bottom {
          color: #605446;
          font-size: 0.75rem;
        }

        .orderNav_left_top {
          font-size: 1rem;
          color: #272727;
        }
      }
    }
  }

  .describe {
    background-color: white;
    padding-bottom: 5.31rem;
    overflow: hidden;

    .describe_top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.59rem 0.63rem;

      span {
        font-size: 1rem;
      }

      .describe_top_r {
        display: flex;
        align-items: center;
        color: #666;
        font-size: 0.88rem;
      }
    }

    .content {
      img {
        max-width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .line {
    background: #fafafa;
    height: 0.31rem;
    width: 100%;
  }

  .storeIn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.88rem;

    .store_right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;

      .evaluate {
        width: 80%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.75rem;
        color: #777;
      }

      .storeName {
        text-align: left;
        font-size: 14px;
        margin-bottom: 0.3rem;

        .btn {
          padding: 0.19rem 0.47rem;
          background-color: #f0f0f0;
          color: #777;
          font-size: 0.63rem;
          border-radius: 0.5rem;
        }
      }
    }

    .store_left {
      margin-right: 0.63rem;
      width: 2.75rem;
      height: 2.75rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .contenBox {
    background-color: white;
    padding: 1rem 0.63rem 0.56rem 0.63rem;

    .couponBox {
      background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/cps/xqyhq.png");
      background-repeat: no-repeat;
      background-size: cover;
      height: 3.5rem;
      width: 100%;
      margin-top: 1.3rem;
      display: flex;
      align-items: center;
      color: #fee3b7;
      padding-left: 0.59rem;
      font-size: 0.75rem;
      position: relative;

      .time {
        text-align: left;
        font-size: 0.63rem;
        color: #afa89d;
      }

      .couponRight {
        position: absolute;
        right: 1.25rem;
        top: 0.88rem;
        width: 5.13rem;
        height: 1.75rem;
        background-image: linear-gradient(0deg, #eccb97 0%, #fee3b7 100%);
        border-radius: 0.88rem;
        color: #39342e;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dor {
        height: 100%;
        display: flex;
        align-items: flex-end;
        padding-bottom: 0.8rem;
      }

      .couponBox_price {
        font-size: 1.75rem;
      }
    }
    // 商品名称
    .goodsDetail {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goodsDetail_left {
        flex: 1;
        font-size: 1rem;
        color: #272727;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        .shopType {
          margin-right: 0.3rem;
          background: #bb3e26;

          /* width: 2.4rem; */

          /* height: 1.2rem; */
          padding: 2px 3px;
          color: #fff;
          text-align: center;
          line-height: 1.2rem;
          border-radius: 0.35rem;
          font-size: 12px;
          display: inline-grid;
        }
      }

      .goodsDetail_right {
        padding: 3px;
        margin-left: 1.16rem;
        width: 4.38rem;
        background-color: #fee3b7;
        border-radius: 0.31rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        font-size: 10px;
        word-break: break-all;
      }
    }
    // 价格
    .goodsPrice {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.7rem;

      .goodsPrice_right {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 0.5rem;
        font-size: 0.75rem;
        color: #999;
      }

      .goodsPrice_left {
        color: #e64a40;
        margin-right: 0.75rem;

        .goodsPrice_left_price {
          font-size: 2.38rem;
        }
      }

      .goodsPrice_left_row {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 0.75rem;
        color: #e64a40;

        span {
          text-align: left;
        }

        .original {
          text-decoration: line-through;
          color: #999;
        }
      }
    }
  }

  .topimg {
    width: 100%;
    min-height: 10rem;
    position: relative;

    .header-box {
      position: fixed;
      width: 100%;
      height: 2.5rem;
      display: flex;
      top: 0;
      z-index: 5;

      &.hoet {
        background: #fff;

        .back,
        .member {
          background: #fff;
          color: #1f1f1f;
        }
      }
    }

    .back {
      background-color: #6d6d6b;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      color: #fff;
      position: absolute;
      top: 0.63rem;
      left: 0.63rem;
      z-index: 1;
    }

    .member {
      background-color: #6d6d6b;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      color: #fff;
      position: absolute;
      top: 0.63rem;
      right: 0.63rem;
      z-index: 1;
    }

    img {
      width: 100%;
    }
  }
}
</style>
