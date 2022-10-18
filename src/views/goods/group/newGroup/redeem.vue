<!-- 珍珠激活兑换 -->
<template>
  <div id="redeem">
    <c-title :hide="false" :text="`${plugin_name}激活兑换`"></c-title>
    <img class="redeem-top-img" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pearl_bg.png" alt="" />
    <div class="redeem-main">
      <div class="redeem-num-box">
        <img class="redeem-icon1" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pearl_img1.png" alt="" />
        <div class="redeem-num-box-left">
          <div class="redeem-num-h2">{{ plugin_name }}奖励</div>
          <div class="redeem-num-h3">当前拥有{{ plugin_name }}数量：{{ pearl }}</div>
        </div>
      </div>

      <div class="redeem-btn" @click="exchangeIntegral">激活兑换{{ plugin_name }}</div>
      <div style="margin-bottom: 1rem; color: #000;" @click="gotoLog">兑换明细 <i class="iconfont icon-member_right"></i></div>
      <div style="text-align: left;">
        {{ plugin_name }}璀璨时刻！<br />
        {{ plugin_name }}可在商城等价现金使用。
      </div>
    </div>

    <van-popup v-model="show" class="redeem-popup" @click-overlay="getData">
      <div class="redeem-popup-main rollback" v-if="show">
        <div class="redeem-popup-h1">恭喜您</div>
        <div class="redeem-popup-h3">成功兑换{{ plugin_name }}</div>
        <div class="redeem-popup-total">{{ exchange_pearl }}</div>
        <div class="redeem-popup-text">已发放到您的个人财务</div>
        <div class="redeem-popup-btn" @click="gotoUrl('love_index')">点击查看</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      pearl_value: 1,
      show: false,
      plugin_name: "",
      pearl: 0,
      exchange_pearl: ""
    };
  },
  components: {},
  computed: {},
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      $http
        .post("plugin.zhp-group-lottery.frontend.pearl.exchange-page", { activity_id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.plugin_name = response.data.plugin_name;
            this.fun.setWXTitle(`${response.data.plugin_name}激活兑换`);
            this.pearl = response.data.pearl;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    exchangeIntegral() {
      $http
        .post("plugin.zhp-group-lottery.frontend.pearl.exchange-pearl", { activity_id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.show = true;
            this.exchange_pearl = response.data.exchange_pearl;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    gotoUrl(name, params = {}) {
      this.show = false;
      this.$router.push(this.fun.getUrl(name, params));
    },
    gotoLog() {
      this.show = false;
      this.$router.push(this.fun.getUrl("redeemLog", { id: this.$route.params.id }));
    }
  }
};
</script>
<style lang="scss" scoped>
#redeem {
  padding-bottom: 40px;
  background: #e21710;
  min-height: 100vh;

  .redeem-top-img {
    width: 100%;
    font-size: 0;
    display: flex;
  }

  .redeem-main {
    width: 95%;
    margin: 0 auto;
    margin-top: -2px;
    background: #fff;
    padding: 2rem 1.5rem;
    color: #7f4d0e;

    .redeem-num-box {
      display: flex;
      align-items: center;
      text-align: left;

      .redeem-icon1 {
        width: 7.75rem;
        height: 6.156rem;
        object-fit: contain;
      }

      .redeem-num-box-left {
        flex: 1;
        display: flex;
        flex-direction: column;

        .redeem-num-h2 {
          font-size: 18px;
          line-height: 1.875rem;
          padding-top: 0.6rem;
        }
      }
    }

    .border-style {
      border-top: 1px solid #f1f1f1;
      border-bottom: 1px solid #f1f1f1;
    }

    .red-color {
      color: #e6423b;
    }

    .redeem-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 3rem;
      line-height: 3rem;
    }

    .redeem-btn {
      width: 100%;
      height: 2.625rem;
      line-height: 2.625rem;
      background: #e7c472;
      margin-bottom: 0.875rem;
    }
  }

  .redeem-popup {
    width: 100%;
    background: transparent;
  }

  .redeem-popup-main {
    width: 100%;
    height: 26.75rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pearl_img2.png");
    background-size: 100%;
    background-repeat: no-repeat;

    .redeem-popup-h1 {
      font-size: 22px;
      color: #fff;
      padding-top: 6.75rem;
    }

    .redeem-popup-h3 {
      color: #fff;
      padding-top: 0.5rem;
    }

    .redeem-popup-total {
      color: #fff3ad;
      padding-top: 2.875rem;
      font-size: 3rem;
      line-height: 3rem;
    }

    .redeem-popup-text {
      color: #fff;
      padding-top: 2.438rem;
      font-size: 10px;
    }

    .redeem-popup-btn {
      width: 14.344rem;
      height: 2.938rem;
      line-height: 2.938rem;
      text-align: center;
      color: #e7283a;
      font-size: 1.138rem;
      text-indent: 1rem;
      margin: 2.125rem auto 0;
      background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pearl_btn.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
  }

  .rollback {
    transition: transform 2s;
    transform-style: preserve-3d;
    animation: PacketRollback 0.5s 0.5s both linear;
  }

  @keyframes PacketRollback {
    0% {
      transform: rotateY(0deg) scale(0);
    }

    30% {
      transform: rotateY(90deg) scale(0.3);
    }

    60% {
      transform: rotateY(180deg) scale(0.6);
    }

    80% {
      transform: rotateY(270deg) scale(0.7);
    }

    to {
      transform: rotateY(360deg) scale(1);
    }
  }
}
</style>
