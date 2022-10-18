<template>
  <div id="store_verification">
    <!-- 客服 -->
    <div class="suspension">
      <img src="../../../../public/static/app/images/customer_service.png" alt="" @click="customerService.showPopup = true" />
      <img src="../../../../public/static/app/images/personal_center.png" alt="" @click="btnProject" />
    </div>
    <d-connect-customer-service
      :show="customerService.showPopup"
      :tel="customerService.tel"
      :online="customerService.online"
      :qrcode="customerService.qrcode"
      @closed="customerService.showPopup = false"
    ></d-connect-customer-service>
  </div>
</template>

<script>
import DConnectCustomerService from "@/components/other/common/DConnectCustomerService";
export default {
  data() {
    return {
      // 客服
      customerService: {
        showPopup: false,
        tel: "",
        online: "",
        qrcode: ""
      },
    };
  },
  activated() {
    this.getService();
  },
  methods: {
    // 跳转我的项目
    btnProject() {
      this.$router.push(this.fun.getUrl("StoreVerification"));
    },
    // 客服
    getService() {
      $http
        .get("plugin.store-projects.frontend.index.get-base-info", {}, " loading")
        .then(response => {
          if (response.result === 1) {
            this.customerService.tel = response.data.cservice.service_mobile;
            this.customerService.qrcode = response.data.cservice.service_QRcode;
            this.customerService.online = response.data.cservice.online;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
  components: { DConnectCustomerService }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.suspension {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 10%;
  transform: translateX(10rem);
  right: 46%;

  img {
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 0.97rem;
  }
}
</style>
