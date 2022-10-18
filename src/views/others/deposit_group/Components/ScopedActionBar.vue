<template>
  <!-- //! 模块数组，请尽量不要用在其它模块，如其它模块也需使用请提取为全局组件，并且去掉Scoped前缀 -->
  <d-fixed-container
    class="good-action"
    left="0px"
    bottom="0px"
    height="3.06rem"
    width="100%"
    :center="true"
    zIndex="2000"
  >
    <van-row style="height: 100%; background: #fff;">
      <van-col span="10" style="height: 100%;">
        <van-row type="flex" align="center" style="justify-content: space-evenly; height: 100%;">
          <van-col span="8">
            <van-goods-action-icon icon="shop-o" text="首页" @click="goToHomePage" />
          </van-col>
          <van-col span="8">
            <van-goods-action-icon icon="chat-o" text="客服" @click="customerService.showPopup=true" />
          </van-col>
        </van-row>
      </van-col>
      <van-col span="14">
        <div
          class="good-action-button"
          :class="{ 'good-action-button_active':active }"
          @click="clickButton"
        ><van-loading color="white" v-show="loading"></van-loading>{{ buttonText }}</div>
      </van-col>
    </van-row>
    <d-connect-customer-service
      :show="customerService.showPopup"
      :tel="service.tel"
      :online="service.online"
      :qrcode="service.qrcode"
      @closed="customerService.showPopup=false"
    ></d-connect-customer-service>
  </d-fixed-container>
</template>

<script>
import { GoodsActionIcon as VanGoodsActionIcon,Loading as VanLoading } from "vant";
import DFixedContainer from "@/components/other/common/DFixedContainer";
import DConnectCustomerService from "@/components/other/common/DConnectCustomerService";
export default {
  props: {
    buttonText: {
      type: String,
      default: "立即下定"
    },
    service: {
      type: Object,
      default() {
        return { qrcode: null, online: null, tel: null };
      }
    },
    active: {
      type: Boolean,
      default: true
    },
    loading:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      customerService: {
        showPopup: false,
        tel: null,
        online: null,
        qrcode: null
      }
    };
  },
  methods: {
    goToHomePage() {
      this.$router.push(this.fun.getUrl("home"));
    },
    clickButton() {
      this.$emit("clickButton");
    }
  },
  components: {
    DFixedContainer,
    DConnectCustomerService,
    VanGoodsActionIcon,
    VanLoading
  }
};
</script>

<style scoped>
.good-action {
  background-color: white;
}

.good-action-button {
  height: 3.06rem;
  line-height: 3.06rem;
  width: 100%;
  font-size: 1rem;
  color: white;
  background-color: #b1b1b1;
}

.good-action-button_active {
  background-color: #f14e4e;
}
</style>