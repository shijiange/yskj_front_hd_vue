<template>
  <div id="pay_back">
    <c-title :hide="false" :text="'支付成功'"> </c-title>
    <div class="pay_back">
      <img class="pay_succee" src="../../../../assets/images/pay_succee.png" alt="" />
      <p style="font-size: 1.06rem; font-weight: bold">订单已支付</p>
      <div class="loadingStyle">
        <span style="font-size: 0.75rem">等待处理中</span>
        <div class="loadingEx">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <!--消费红包-->
    <van-overlay :show="showPacket" @click="closePacket">
      <div class="wrapper">
        <div class="block" @click.stop>
          <img @click="toPacket" src="@/assets/images/consume_packet.png" />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      Interval: null,
      showPacket: false
    };
  },
  mounted() {
    this.getData();
  },
  // watch:{
  //   $route(to, from) {
  //     console.log('当前',to,from,)
  //   }
  // },
  deactivated() {
    clearInterval(this.Interval);
    this.Interval = null;
  },
  methods: {
    toPacket() {
      this.$router.replace(this.fun.getUrl("ConsumePacketSuccess", {}, { order_id: this.order_ids }));
    },
    getData() {
      $http
        .post("order.merge-pay.check-order-pay", {
          order_pay_id: this.$route.params.ids
        })
        .then(response => {
          if (response.result == 1) {
            if (response.data.status == 1) {
              // 支付成功，判断有没有消费红包
              this.checkoutConsumePacket(response.data.redirect);
              clearInterval(this.Interval);
              this.Interval = null;
            } else {
              // 支付不成功 轮询
              if(!this.Interval) {
                this.Interval = setInterval(() => {
                  this.getData();
                }, 5000);
              }
            }
          } else {
            Toast.success(response.msg);
          }
        });
    },
    checkoutConsumePacket(redirect) {
      if (JSON.parse(window.localStorage.getItem("globalParameter")).consume_red_packet_status == 1 && this.$route.params.ids) {
        // 判断消费红包开启再请求
        $http
          .post(
            "plugin.consume-red-packet.Frontend.Modules.Packet.Controllers.has.index",
            {
              order_id:String(this.$route.params.ids).split(",")
            },
            "loading"
          )
          .then(
            response => {
              if (response.result == 1) {
                this.showPacket = true;
              } else {
                this.toRedirect(redirect);
              }
            },
            response => {
              this.toRedirect(redirect);
            }
          );
      } else {
        this.toRedirect(redirect);
      }
    },
    closePacket() {
      this.showPacket = false;
      this.toRedirect();
    },
    toRedirect(redirect) {
      if (this.$route.params.is_cps) {
        Toast.success("支付成功");
        this.$router.push(this.fun.getUrl("cpsPwd", { order_id: this.order_ids }));
        return;
      }
      if (this.$route.params.pageUrl) {
        Toast.success("支付成功");
        if (this.pageUrl == "enroll") {
          this.$router.push(this.fun.getUrl("activityHome"));
        } else {
          this.$router.push(this.fun.getUrl("Myshaky"));
        }
        return;
      }
      this.payCallBack(redirect);
    },
    payCallBack(redirect) {
      if (this.fun.isTextEmpty(redirect)) {
        this.$router.push(this.fun.getUrl("home"));
      } else {
        if (redirect && redirect.indexOf("showBalances") > -1) {
          this.goShowBalances();
        } else {
          window.location.href = redirect;
        }
      }
    },
    goShowBalances() {
      this.$router.push(
        this.fun.getUrl("showBalances", {
          pay_sn: this.order_sn,
          pay_type: "pay"
        })
      );
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .block {
      width: 14rem;
      height: 18rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
.pay_back {
  min-height: 100vh;
  background-color: #fff;
}
.loadingStyle {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.81rem;
}
.pay_succee {
  margin: 20px;
  width: 7.84rem;
  height: 6.19rem;
}

.loadingEx {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 0.44rem;
}

.loadingEx span {
  display: inline-block;
  width: 0.31rem;
  height: 0.31rem;
  margin-right: 5px;
  border-radius: 50%;
  background: #ff4c4c;
  -webkit-animation: load 1.04s ease infinite;
}

.loadingEx span:last-child {
  margin-right: 0px;
}

@-webkit-keyframes load {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.loadingEx span:nth-child(1) {
  -webkit-animation-delay: 0.13s;
}

.loadingEx span:nth-child(2) {
  -webkit-animation-delay: 0.26s;
}

.loadingEx span:nth-child(3) {
  -webkit-animation-delay: 0.39s;
}
</style>