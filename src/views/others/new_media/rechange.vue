<template>
  <div class="rechange">
    <c-title text="充值流量值"></c-title>
    <div class="wrapper">
      <div class="surplus">当前流量值：{{ flow }}</div>
      <div class="exchange">
        <div class="explain">
          <span>充值金额</span>
        </div>
        <div class="input">
          <input type="number" v-model="rechargeCounts" />
        </div>
        <div class="desc">注：1流量值等于人民币{{ exchangeRatio }}元</div>
        <div
          class="fees-paid"
          :style="{ visibility: feesPaid ? 'visible' : 'hidden' }"
        >需要支付{{ feesPaid }}元</div>
      </div>
    </div>

    <d-pay-method
      :data="payMethods"
      api="plugin.new-media-advertising.frontend.stream.get-pay-sn"
      :apiJson="payRequestQuery"
      @pay-success="rechargePaySuccess"
      :custom="true"
      @pay="rechargePay"
      @paying="rechargePaying"
      style="border-radius: 0;"
      class="recharge_way"
    >
      <div class="h1" slot="title">充值方式</div>
      <template slot-scope="scope">
        <div class="li method-item">
          <i class="iconfont" :class="[scope.method.className]" />
          {{ scope.method.name }}
        </div>
      </template>
    </d-pay-method>
  </div>
</template>

<script>
import DPayMethod from "@/components/other/common/DPayMethod";
let payLoading = null;
export default {
  data() {
    return {
      flow: 0,
      exchangeRatio: 0,
      payMethods: [],
      feesPaid: 0,
      rechargeCounts: 0,
      payRequestQuery: {
        stream: 0
      }
    };
  },
  mounted() {
    this.fun.setWXTitle("充值流量值");
    this.getUserFlow();
  },
  methods: {
    getUserFlow() {
      let loading = this.$toast.loading({
        message: "加载中",
        duration: 0,
        overlay: true
      });
      $http.get("plugin.new-media-advertising.frontend.stream.recharge-stream").then(({ data: { buttons, stream_eq_money, stream }, result, msg }) => {
        loading.clear();
        if (result === 0) {
          this.$toast(msg);
          return;
        }
        this.flow = Number(stream);
        this.exchangeRatio = stream_eq_money;
        for (let index = 0; index < buttons.length; index++) {
          const element = buttons[index];
          switch (Number(element.value)) {
          case 2:
            buttons[index]['className'] = "icon-balance_j";
            break;
          default:
          case 3:
            buttons[index]['className'] = "icon-balance_yue";
            break;
          }
        }
        this.payMethods = buttons;
      }).catch(() => {
        loading.clear();
      });
    },
    rechargePaying() {
      payLoading = this.$toast.loading({
        duration: 0,
        message: "支付中",
        overlay: true
      });
    },
    rechargePaySuccess({ data: { order_sn, uid } }) {
      payLoading.clear();
      this.$toast("充值成功");
      this.flow += Number(this.rechargeCounts);
    },
    rechargePay({ data: { order_sn }, payMethodCode }) {
      if (payMethodCode == 3) return;
      $http.post("plugin.new-media-advertising.frontend.stream.alipay", {
        order_sn
      }).then(({ result, data, msg }) => {
        if (result === 0) { this.$toast(msg); return; }
        if (data.indexOf("http") > -1) {
          location.href = data;
        } else {
          payLoading.clear();
          this.$toast("充值成功");
          this.flow += Number(this.rechargeCounts);
        }
      });
    }
  },
  watch: {
    rechargeCounts(newV) {
      this.feesPaid = Number(newV) * this.exchangeRatio;
      this.payRequestQuery.stream = newV;
    }
  },
  components: {
    DPayMethod
  }
};
</script>

<style scoped>
.rechange div,
.rechange span {
  box-sizing: border-box;
}

.wrapper {
  padding: 0.7rem 0.75rem;
  text-align: left;
}

.surplus {
  font-size: 0.7rem;
  color: #333;
}

.exchange {
  width: 100%;

  /* height: 6.7rem; */
  margin-top: 0.75rem;
  padding: 1.025rem 1.55rem 0.625rem;
  background-color: #fff;
  box-shadow: 0 0.05rem 0.2rem 0 rgba(7, 11, 33, 0.11);
  border-radius: 0.25rem;
}

.exchange .explain {
  display: flex;
  align-items: center;
  font-size: 0.675rem;
  color: #333;
}

.exchange .input {
  margin-top: 1.125rem;
  padding-bottom: 0.625rem;
  border-bottom: 0.025rem solid rgba(245, 245, 245);
}

.exchange .input input {
  width: 100%;
  font-size: 1.275rem;
  color: #333;
  border: none;
}

.exchange .desc {
  color: #888;
  margin-top: 0.5rem;
  font-size: 0.575rem;
}

.recharge_way {
  background: #fff;
  margin-top: 0.5rem;
}

.recharge_way .h1 {
  line-height: 2rem;
  text-align: left;

  /* padding: 0 0.7rem; */
  font-size: 0.8rem;
}

.recharge_way .li {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;

  /* line-height: 2.8rem; */
  font-size: 0.8rem;

  /* margin-left: 1rem;
  padding-right: 1rem; */
  width: 100%;
  text-align: left;

  /* border-bottom: solid 0.05rem #ebebeb; */
}

.recharge_way .li .iconfont_bg {
  background: #f15353;
  width: 1.8rem;
  height: 1.2rem;
  border-radius: 0.15rem;
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}

.recharge_way .li .icon-balance_yue {
  color: #fac337;
}

.recharge_way .li .icon-balance_i {
  color: #64b42e;
}

.recharge_way .li .icon-balance_j {
  color: #069ce7;
}

.recharge_way .li .iconfont {
  font-size: 1.6rem;
  margin-right: 0.5rem;
}

.fees-paid {
  margin-top: 0.1rem;
  color: #f15353;
  font-size: 0.575rem;
  visibility: hidden;
}
</style>