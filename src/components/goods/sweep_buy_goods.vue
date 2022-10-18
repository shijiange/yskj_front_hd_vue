<template>
  <div class="page">
    <c-title text="扫码买单"></c-title>

    <div class="header">
      <div class="header-wrapper">
        <div class="logo">
          <img :src="details.thumb" alt="" />
        </div>
        <div class="name">{{ details.title }}</div>
      </div>
    </div>

    <div class="inputs">
      <div class="text">付款金额</div>
      <div class="price-wrapper">
        <div class="company">￥</div>
        <div class="price" v-if="passValueArr.length > 0">{{ money }}</div>
        <div class="price notText" v-else>{{ money }}</div>
      </div>
    </div>

    <div class="goods-details">
      <div class="details-title">
        <div class="line dr"></div>
        <span>收款码详情</span>
        <div class="line dl"></div>
      </div>
      <div class="wrapper" v-html="details.content" v-if="details.content"></div>
      <div class="notText" v-else>暂无详情</div>
    </div>

    <div class="fixed-qrcode" @click="cserviceShow = !cserviceShow">
      <i class="iconfont icon-fontclass-yunkefu"></i>
    </div>

    <div class="fixed-topping" v-if="titleBgMode == 'white'" @click="setTopping">
      <i class="iconfont icon-fontclass-zhiding"></i>
    </div>

    <cservice-pop :show="cserviceShow" :cservice="cservice_info.cservice" :service_QRcode="cservice_info.service_QRcode" :service_mobile="cservice_info.service_mobile"></cservice-pop>

    <div class="numberKeyboard" :class="{ disabled: details.status != 1 }">
      <van-number-keyboard :show="show" theme="custom" close-button-text="付款" @close="confirmPay" @delete="handkeyboarddelete" @input="handkeyboardinput" extra-key="." />
    </div>
  </div>
</template>

<script>
import cservicePop from "@/components/goods/children/plugin/cservicePopup";
export default {
  props: ["goods_info"],
  components: { cservicePop },
  data() {
    return {
      show: true,
      titleBgMode: "transparent",
      money: "0",
      passValueArr: [],
      maxlength: 8,

      details: {},
      cservice_info: {},
      cserviceShow: false
    };
  },
  created() {
    this.fun.setWXTitle("扫码买单");
    this.handleScroll();
    this.getDetails();
  },
  destroyed() {
    window.removeEventListener("scroll", this.windowScroll);
  },
  methods: {
    confirmPay() {
      if (this.details.status != 1) {
        return this.$toast("当前收款码已关闭，请联系客服！");
      }
      if(Number(this.money) == 0){
        return this.$toast("付款金额必须大于0");
      }
      if(this.passValueArr && this.passValueArr[this.passValueArr.length-1]=="."){
        return this.$toast("请输入完整数字");
      }
      this.$router.push(this.fun.getUrl("cashier_pay", { store_id: 0 }, { cashier_type: "scanning_payment", goods_id: this.$route.params.id, price: this.money }));
    },
    getDetails() {
      this.details = this.goods_info.get_goods;
      this.cservice_info = this.goods_info.customer_service;
    },

    handkeyboarddelete() {
      this.passValueArr.pop();
      this.money = this.passValueArr.length == 0 ? "0" : this.passValueArr.join("");
    },
    handkeyboardinput(value) {
      if (this.passValueArr.length >= this.maxlength) {
        let floatNum = this.getFloatNum();
        if (value == "." || (floatNum != -1 && floatNum < 2)) {
          // 这两个不return
        } else {
          return;
        }
      }
      if (value == ".") {
        if (this.passValueArr.length == 0) return;
        if (this.passValueArr.includes(".")) return;
      }
      let floatNum = this.getFloatNum();
      if (floatNum >= 2) return;
      this.passValueArr.push(value);
      this.money = this.passValueArr.length == 0 ? "0" : this.passValueArr.join("");
    },
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
    setTopping() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    },
    //获取当前小数点后有几位
    getFloatNum() {
      let index = this.passValueArr.indexOf(".");
      if (index >= 0) {
        index++;
        let len = this.passValueArr.length;
        index = len - index;
      }
      return index;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background-color: #f2f2f2;
  min-height: 100vh;
}

.header {
  width: 100%;
  padding-bottom: 3.282rem;
  margin-bottom: -3.282rem;
  background-color: #feca12;
  border-radius: 0rem 0rem 2.406rem 2.406rem;
  .header-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 1.594rem;
    padding-bottom: 1.594rem;
    .logo,
    .logo img {
      width: 2.188rem;
      height: 2.188rem;
      background-color: #ffffff;
      border-radius: 0.125rem;
    }
    .name {
      max-width: 15.625rem;
      margin-left: 0.688rem;
      font-size: 20px;
      color: #333;
    }
  }
}

.inputs {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 22.188rem;
  height: 6.563rem;
  padding: 0.938rem 0.969rem;
  margin: 0 auto;
  text-align: left;
  background-color: #ffffff;
  border-radius: 0.313rem;
  .text {
    font-size: 13px;
    color: #4b4b4b;
  }
  .price-wrapper {
    display: flex;
    align-items: flex-end;
    padding-bottom: 0.325rem;
    font-weight: bold;
    border-bottom: 0.063rem solid #dfdfdf;
    .company {
      font-size: 13px;
      color: #1f1f1f;
    }
    .price {
      transform: translateY(0.4rem);
      margin-left: 1rem;
      font-size: 28px;
      color: #2a2a2a;
      &.notText {
        color: #a4a4a4;
      }
    }
  }
}

.goods-details {
  width: 22.188rem;
  margin: 0.625rem auto;
  padding-bottom: 244px;
  background: #fff;
  border-radius: 0.313rem;
  .details-title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9a9a99;
    padding: 1rem 0.69rem;
    box-sizing: border-box;
    overflow: hidden;
    .line {
      background: #ced0d2;
      width: 3rem;
      height: 1px;
    }
    .dr {
      margin-right: 0.8rem;
    }
    .dl {
      margin-left: 0.8rem;
    }
  }
  .wrapper {
    padding: 0.5rem;
    text-align: left;
    img {
      max-width: 100%;
    }
  }
}

.fixed-qrcode {
  position: fixed;
  right: 50%;
  transform: translateX(11rem);
  bottom: 18.5rem;
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
  bottom: 15.5rem;
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

/deep/.numberKeyboard {
  .van-number-keyboard__sidebar {
    .van-key__wrapper:nth-child(1) {
      flex: 1;
    }
    .van-key__wrapper:nth-child(2) {
      flex: 3;
      .van-key--blue {
        background: #21bf63;
      }
    }
  }
}
/deep/.numberKeyboard.disabled {
  .van-number-keyboard__sidebar {
    .van-key__wrapper:nth-child(2) {
      .van-key--blue {
        color: #101010;
        background: #cbced0;
      }
    }
  }
}
</style>
