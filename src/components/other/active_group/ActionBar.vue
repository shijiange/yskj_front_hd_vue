<template>
  <!-- //! 模块数组，请尽量不要用在其它模块，如其它模块也需使用请提取为全局组件，并且去掉Scoped前缀 -->
  <d-fixed-container
    class="good-action"
    left="0px"
    bottom="0px"
    height="3.06rem"
    width="100%"
    :center="true"
    zIndex="3"
  >
    <div style="height: 100%; background: #fff;display:flex">
      <div style="height: 100%;">
        <van-row type="flex" align="center" style="justify-content: space-evenly; height: 100%;">
          <van-col span="8">
            <van-goods-action-icon icon="shop-o" text="首页" @click="goToHomePage" />
          </van-col>
          <van-col span="8">
            <van-goods-action-icon icon="chat-o" text="客服" @click="customerService.showPopup=true" />
          </van-col>
          <van-col span="8" >
            <van-goods-action-icon text="排行榜" :class="{'red-text': isRankingPath}">
              <template #icon>
                <i class="iconfont icon-gongnengpaihangbang" @click="goToRanking" :class="{'red-text': isRankingPath}"></i>
              </template>
            </van-goods-action-icon>
          </van-col>
        </van-row>
      </div>
      <div style="flex:1">
        <div
          class="good-action-button"
          :class="{ 'good-action-button_active':active }"
          @click="clickButton"
        ><van-loading color="white" v-show="loading"></van-loading>{{ buttonText }}</div>
      </div>
    </div>
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
    activityId: [String, Number],
    buttonText: {
      type: String,
      default: "分享海报邀请好友"
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
      isRankingPath: false,
      customerService: {
        showPopup: false,
        tel: null,
        online: null,
        qrcode: null,
        posterSrc: '',
      },

    };
  },

  mounted () {
    if (this.$route.name === 'friendRanking') this.isRankingPath = true;
  },


  methods: {
    goToHomePage() {
      this.$router.push(this.fun.getUrl("home"));
    },
    goToRanking () {
      this.$router.push(this.fun.getUrl("friendRanking", {}, {id: this.activityId}));
    },
    clickButton() {
      this.$emit("clickButton", this.active);
    },

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

.red-text {
  color: #f14e4e;
}
</style>