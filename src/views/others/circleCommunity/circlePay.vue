<template>
  <div v-if="circleInfo">
    <c-title text="支付订单"></c-title>
    <d-pay-details :amount="circleInfo.price" :showBalance="false" :showOrderNumber="false"></d-pay-details>
    <d-pay-method :amount="circleInfo.price" :data="methods" :api="'plugin.circle.frontend.circle-pay.index'"
                  :apiJson="{circle_id: this.circleId}" @pay-success="paySuccess"></d-pay-method>
  </div>
</template>

<script>
import DPayDetails from "@/components/other/common/DPayDetails";
import DPayMethod from "@/components/other/common/DPayMethod";
import { Toast } from "vant";
export default {
  async activated() {
    if (!this.$route.query.circle_id) {
      Toast("圈子不存在");
      this.$router.go(-1);
    }
    this.circleId = this.$route.query.circle_id;
    await this.getCircleInfo();
    this.getPayMethod();
  },
  data() {
    return {
      circleId: null,
      circleInfo: null,
      methods: []
    };
  },
  methods: {
    async getCircleInfo() {
      await $http.get("plugin.circle.frontend.circle.get-circle", { circle_id: this.circleId }, "").then(({ data: response, result, msg }) => {
        if (result === 0) {
          Toast(msg);
          this.$router.go(-1);
        }
        this.circleInfo = response;
      });
    },
    getPayMethod() {
      $http.get("plugin.circle.frontend.circle-pay.get-pay-button").then(({ data: response, result, msg }) => {
        if (result === 0) {
          Toast(msg);
          return;
        }
        this.methods = response.buttons;
      });
    },
    paySuccess(payInfo){
      this.$router.go(-1);
    }
  },
  components: {
    DPayDetails,
    DPayMethod
  }
};
</script>

<style scoped>
.pay-details {
  margin: 0.5625rem 0.9375rem;
}

.pay-method {
  margin: 1.8125rem 0.9375rem 2.5625rem;
}
</style>