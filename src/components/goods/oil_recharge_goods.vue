<template>
  <div class="page">
    <div class="title" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '', titleBgMode == 'white' ? 'white' : '']">
      <div class="title-icon-wrapper">
        <i class="iconfont icon-member-left" @click="gotoBack"></i>
      </div>
      <div class="title-icon-wrapper">
        <i class="iconfont icon-fontclass-shouye" @click="gotoHome"></i>
      </div>
    </div>
    <div class="banner">
      <img :src="bannerUrl" alt="" />
    </div>
    <div class="recharge">
      <div class="tabs">
        <div class="tabs-item" @click.stop="handClickSpecs(item)" :class="rechargeSpecId == item.id ? 'active' : ''" v-for="(item, i) in rechargeType.specitem" :key="i">{{ item.title }}</div>
      </div>

      <div class="recharge-box">
        <div class="input-box" style="margin-bottom:1.5rem;">
          <input type="text" v-model="account" @blur="getMobileByAccount" placeholder="请输入油卡号" />
        </div>
        <div class="input-box">
          <input type="text" v-model="mobile" :disabled="mobile_disabled" placeholder="请输入手机号" />
        </div>
        <div class="warning">注意：请输入油卡绑定的手机号，暂不支持未实名绑定手机号的油卡，一卡一号，如油卡充值使用其他手机号会造成锁卡操作</div>
        <div class="desc">{{ rechargeItem.desc_text }}</div>
        <div class="recharge-title">充值金额</div>
        <div class="recharge-items">
          <div class="recharge-item" @click="handClickOptions(item)" :class="optionsId == item.id ? 'active' : ''" v-for="(item, i) in displayOptions" :key="i">
            <div class="recharge-activity" v-if="item.diff_price > 0">立减{{ item.diff_price }}元</div>
            <div class="recharge-price"><span>￥</span>{{ item.face_value }}</div>
            <div class="recharge-discount">优惠价￥{{ item.product_price }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="goods-details">
      <div class="goods-details-title">
        <div class="line"></div>
        <div class="text">商品详情</div>
        <div class="line"></div>
      </div>
      <div id="a_content" v-html="goodsInfo.content" @click="handleHtml($event)" style="text-align: left;"></div>
      <p v-if="fun.isTextEmpty(goodsInfo.content)" style="color: #666;">暂无该商品详情 ~</p>
    </div>

    <div class="footer" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div class="footer-left">
        <div class="service footer-left-item" @click="show1 = true">
          <i class="iconfont icon-fontclass-kefu"></i>
          <span>客服</span>
        </div>
        <div class="order footer-left-item" @click="gotoOrderList">
          <i class="iconfont icon-kc_line_order"></i>
          <span>订单</span>
        </div>
      </div>
      <div class="footer-right" @click="sendRecharge">
        立即充值
      </div>
    </div>

    <div class="fixed-qrcode" @click="postShow">
      <i class="iconfont icon-bc_eweima"></i>
    </div>

    <div class="fixed-topping" v-if="titleBgMode == 'white'" @click="setTopping">
      <i class="iconfont icon-fontclass-zhiding"></i>
    </div>
    <yz-goodsposter v-model="posterShow" :posterData="posterImg" :goodstype="true"></yz-goodsposter>
    <cservice-popup :show="show1" :cservice="cservice" :service_mobile="service_mobile" :service_QRcode="service_QRcode" @close="show1 = false" />
  </div>
</template>

<script>
import cservicePopup from "./children/plugin/cservicePopup";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
let cache_account = "";
export default {
  props: ["goods_info"],
  components: { cservicePopup, yzGoodsposter },
  data() {
    return {
      titleBgMode: "transparent",
      goodsInfo: {},

      rechargeType: {},
      rechargeItem: {},
      rechargeSpecId: 0,

      displayOptions: [], //显示的规格，根据快充慢充来显示
      optionsId: 0,

      show1: false,
      service_QRcode: "",
      service_mobile: "",
      cservice: "",

      account: "",
      mobile: "",
      mobile_disabled: false,

      bannerUrl: "",

      posterShow: false,
      posterImg: null
    };
  },
  created() {
    cache_account = "";
    this.goodsInfo = this.goods_info.get_goods;
    this.rechargeType = this.goodsInfo.has_many_specs[0];
    this.handClickSpecs(this.rechargeType.specitem[0]);

    //轮播图
    if (this.goods_info && this.goods_info.plugin && this.goods_info.plugin.oilRechargeGoods) {
      this.bannerUrl = this.goods_info.plugin.oilRechargeGoods.banner;
    }

    //客服相关
    if (this.goods_info.customer_service) {
      // 客服
      this.service_QRcode = this.goods_info.customer_service.service_QRcode;
      this.service_mobile = this.goods_info.customer_service.service_mobile;
      this.cservice = this.goods_info.customer_service.cservice;
    }

    //分享
    this.fun.wxShare(
      "",
      { mid: this.fun.getKeyByMid(), goods_id: this.goodsInfo.id },
      {
        title: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_title ? this.goodsInfo.has_one_share.share_title : this.goodsInfo.title,
        imgUrl: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_thumb ? this.goodsInfo.has_one_share.share_thumb : this.goodsInfo.thumb,
        description: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_desc ? this.goodsInfo.has_one_share.share_desc : ""
      }
    );
    this.handleScroll();
  },
  destroyed() {
    window.removeEventListener("scroll", this.windowScroll);
  },

  methods: {
    handleScroll() {
      window.addEventListener("scroll", this.windowScroll);
    },
    windowScroll() {
      let scroll = document.documentElement && document.documentElement.scrollTop;
      if (scroll >= 50 && this.titleBgMode == "transparent") {
        this.titleBgMode = "white";
      } else if (scroll <= 50 && this.titleBgMode == "white") {
        this.titleBgMode = "transparent";
      }
    },
    gotoOrderList() {
      this.$router.push(this.fun.getUrl("orderlist"));
    },
    setTopping() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    },
    getMobileByAccount(type) {
      if(cache_account == this.account){
        if( type === 1){
          this.gotoGoodsOrder();
        }
        
        return;
      }
      $http.get("plugin.oil-recharge.frontend.index.getMobileByAccount", { account: this.account }, "").then(res => {
        if (res.result != 1) return this.$toast(res.msg);
        console.log(res.data);
        let mobile = res.data.mobile;
        if (mobile == "") {
          this.mobile_disabled = false;
        } else {
          this.mobile_disabled = true;
          this.mobile = mobile;
        }
        cache_account = this.account;
        if (type === 1) {
          this.gotoGoodsOrder();
        }
      });
    },
    gotoGoodsOrder() {
      let json_data = {
        goodsId: this.goodsInfo.id,
        optionsId: this.optionsId,
        total: 1,
        tag: -2,
        oil_mobile: this.mobile,
        oil_account: this.account
      };
      this.$router.push(this.fun.getUrl("goodsorder", {}, json_data));
    },

    handClickSpecs(item) {
      if (this.rechargeSpecId == item.id) return;
      this.rechargeSpecId = item.id;
      this.rechargeItem = item;
      let has_many_options = this.goodsInfo.has_many_options;
      let arr = [];
      for (let i = 0; i < has_many_options.length; i++) {
        if (has_many_options[i].specs.indexOf(item.id) >= 0) {
          arr.push(has_many_options[i]);
        }
      }
      this.displayOptions = arr;
      this.optionsId = 0;
    },
    handClickOptions(item) {
      this.optionsId = item.id;
    },

    sendRecharge() {
      // 手机慢充
      if (!this.mobile) {
        this.$toast("请输入充值手机号码！");
        return false;
      } else {
        let reg_txt = /^[1][0-9]{10}$/;
        if (!reg_txt.test(this.mobile)) {
          this.$toast("请输入正确的充值手机号码！");
          return false;
        }
      }
      if (this.optionsId <= 0) return this.$toast("请选择规格ID");

      this.getMobileByAccount(1);
    },

    gotoBack() {
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
      } else if (this.url) {
        this.$router.push(this.fun.getUrl(this.url));
      } else {
        this.$router.go(-1);
      }
    },

    gotoHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },

    //海报生成
    postShow() {
      if (!this.fun.isTextEmpty(this.posterImg)) {
        this.posterShow = true;
      } else {
        let toastPoster = this.$toast({
          duration: -1, // 持续展示 toast
          message: "正在为您生成海报中"
        });
        let url = "";
        let Jons = {};
        this.isFrontCanvas = true;
        url = "goods.goods-poster.new-goods-poster";
        Jons = {
          id: this.$route.params.id
        };

        Jons.id = this.$route.params.id;
        $http
          .get(url, Jons, "")
          .then(response => {
            toastPoster.clear();
            if (response.result == 1) {
              // isFrontCanvas 是否需要前端生成海报
              this.posterImg = this.isFrontCanvas ? response.data : `${response.data.image_url}?${Date.now()}`;
              this.posterShow = true;
            } else {
              this.posterShow = false;
              this.$dialog.alert({ message: response.msg });
            }
          })
          .catch(error => {
            toastPoster.clear();
          });
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: 3rem;
  background: rgb(247, 247, 247);
}

.pcStyle {
  width: 375px;
  margin: 0 auto;
  left: 50% !important;
  margin-left: -187.5px;
}

.title {
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding-left: 1.281rem;
  padding-right: 1.281rem;
  z-index: 1;

  .title-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }

  .icon-member-left {
    font-weight: bold;
    color: #fff;
  }

  .icon-fontclass-shouye {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
  }

  &.white {
    background: #fff;

    .title-icon-wrapper {
      background: transparent;
    }

    .icon-member-left {
      color: #000;
    }

    .icon-fontclass-shouye {
      color: #000;
    }
  }
}

.banner {
  width: 100%;
  min-height: 5rem;

  img {
    width: 100%;
    object-fit: contain;
  }
}

.recharge {
  width: 21.563rem;
  background-color: #fff;
  margin: -2.3rem auto 0;
  border-radius: 0.469rem;
  overflow: hidden;

  .tabs {
    display: flex;
    height: 2.813rem;
    .tabs-item {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 15px;
      color: #242424;
      background-color: #fff;
      &.active {
        font-size: 17px;
        font-weight: bold;
        color: #8c5a04;
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          width: 2.844rem;
          height: 0.219rem;
          background-color: #8c5a04;
          border-radius: 0.109rem;
        }
      }
    }
  }

  .recharge-box {
    padding: 1.306rem 1rem 0.8rem;
    text-align: left;

    .input-box {
      border-bottom: 0.031rem solid #d4d4d4;
      padding-bottom: 0.425rem;
      padding-left: 0.469rem;

      input {
        font-size: 14px;
        color: #282828;
        border: none;
      }
    }

    .warning {
      padding-left: 0.469rem;
      padding-top: 0.269rem;
      line-height: 1.125rem;
      font-size: 11px;
      color: #fe3d43;
    }
    .desc {
      padding-left: 0.469rem;
      padding-top: 0.269rem;
      line-height: 1.125rem;
      font-size: 11px;
      color: #6c6c6c;
    }

    .recharge-title {
      margin-top: 1.45rem;
      font-size: 13px;
      color: #242424;
    }

    .recharge-items {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 0.625rem;
      padding-top: 0.7rem;

      .recharge-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 6.031rem;
        height: 6.25rem;
        padding-top: 1.5rem;
        border-radius: 0.313rem;
        border: solid 0.031rem #acacac;

        .recharge-activity {
          position: absolute;
          left: 0;
          top: 0;
          font-size: 11px;
          color: #fff;
          padding: 0.125rem 0.344rem 0.156rem 0.438rem;
          background-image: linear-gradient(90deg, #fe3b42 0%, #fe6355 100%);
          border-radius: 0.313rem 0 0.313rem 0;
        }

        .recharge-price {
          font-size: 30px;
          color: #3b3b3b;

          span {
            font-size: 14px;
          }
        }

        .recharge-discount {
          margin-top: 0.4rem;
          font-size: 11px;
          color: #8c5a04;
        }

        &.active {
          border: none;
          background-color: rgba(245, 154, 31, 0.4);
          box-shadow: 0 0.125rem 0.366rem 0.041rem rgba(201, 129, 30, 0.76);

          .recharge-price {
            color: #fe6402;
          }
        }
      }
    }
  }
}

.like-box {
  width: 21.563rem;
  margin: 0.625rem auto 0;
  padding: 0.688rem 0.656rem;
  text-align: left;
  background-color: #fff;
  border-radius: 0.469rem;

  .like-box-title {
    font-size: 15px;
    font-weight: bold;
    color: #5f5e5e;
  }

  .like-box-goods {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 0.625rem;
    grid-row-gap: 0.625rem;
    padding-top: 0.875rem;

    .like-box-good {
      overflow: hidden;

      .good-face {
        width: 6.313rem;
        height: 6.313rem;
        border-radius: 0.188rem;

        img {
          width: 6.313rem;
          height: 6.313rem;
          border-radius: 0.188rem;
        }
      }

      .good-name {
        padding-top: 0.5rem;
        font-size: 11px;
        font-weight: bold;
        color: #3e3e3e;
      }

      .good-price {
        padding-top: 0.3rem;
        font-size: 12px;
        font-weight: bold;
        color: #f14e4e;
      }
    }
  }

  .van-indicator {
    display: flex;
    justify-content: center;
    padding-top: 1.2rem;
    padding-bottom: 0.6rem;

    .li {
      width: 0.25rem;
      height: 0.25rem;
      margin-right: 0.406rem;
      background-color: #c2c2c2;

      &.active {
        width: 0.469rem;
        height: 0.25rem;
        background-color: #f14e4e;
        border-radius: 0.125rem;
      }
    }
  }
}

.goods-details {
  margin-top: 0.625rem;
  padding-bottom: 0.625rem;
  background: #fff;

  .goods-details-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    color: #999;

    .line {
      width: 4rem;
      height: 2px;
      border-radius: 1px;
      background: rgb(213, 214, 216);
    }

    .text {
      padding: 0 0.5rem;
    }
  }
}

.fixed-qrcode {
  position: fixed;
  right: 50%;
  transform: translateX(11rem);
  bottom: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;

  .iconfont {
    font-size: 20px;
    color: #fff;
  }
}

.fixed-topping {
  position: fixed;
  right: 50%;
  transform: translateX(11rem);
  bottom: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;

  .iconfont {
    font-size: 22px;
    color: #fff;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 2.813rem;

  .footer-left {
    display: flex;
    justify-content: space-evenly;
    width: 9.125rem;
    background-color: #fff;

    .footer-left-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #8c8c8c;
      font-size: 10px;
      font-weight: bold;

      .iconfont {
        color: #3c3c3c;
      }

      .icon-fontclass-kefu {
        font-size: 18px;
        height: 19px;
      }
    }
  }

  .footer-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    color: #8c5a04;
    background-color: #e6c36a;
  }
}
</style>
