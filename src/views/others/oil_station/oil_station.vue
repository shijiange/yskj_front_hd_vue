<template>
  <div>
    <!--<c-title :hide="false" :text="'全国油站'">-->
    <!--</c-title>-->
    <!--<div style="height: 40px"></div>-->
    <div class="container" v-show="url">
      <iframe :src="url" id="iframe" ref="iframe" width="100%" height="100%" frameborder="0"
              allow="geolocation"
      ></iframe>
      <!--;payment;fullscreen;accelerometer;midi;vibrate;camera;autoplay;-->
      <!--sandbox="allow-forms allow-modals allow-popups allow-scripts allow-top-navigation allow-storage-access-by-user-activation"-->
    </div>
    <yz_bindMobile v-show="show" ref="yz_bindMobile" @bindSuccess="getData"></yz_bindMobile>

    <div class="fixed-box" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <router-link class="fixed-item" :to="fun.getUrl('home')">
        <i class="iconfont icon-zhuye2" style="font-size: 28px;"></i>
        <span>首页</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import yz_bindMobile from "components/ui_components/yz_bindMobile";

export default {
  data() {
    return {
      url: "",
      show: false,
    };
  },
  activated() {
    this.show = false;
    this.getData();
    window.addEventListener('message', this.handleMessage);
  },
  deactivated() {
    window.removeEventListener('message', this.handleMessage);
  },
  methods: {
    handleMessage(event) {
      window.location.href = event.data;
    },
    getData() {
      $http.post("plugin.oil-station.frontend.index.getPageData", {}, "...").then(
        (response)=> {
          if (response.result == 1) {
            this.url = response.data.oil_url;
            this.fun.wxShare(
              "",
              {},
              {
                title: "全国加油优惠-" + this.$store.state.temp.mailInfo.name,
                description: "400+城市油站加油优惠，平台会员专享特权！"
              }
            );
          } else {
            // response.data.bind_mobile = 1 需要绑定手机
            this.show = true;
            this.$nextTick(()=> {
              this.$refs.yz_bindMobile.initShow();
            });
          }
        },
        (response)=> {
          console.log(response);
        }
      );
    },
  },
  components: {
    yz_bindMobile,
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .container {
    width: 100%;
    height: 100vh;
  }

  .fixed-box {
    position: fixed;
    bottom: 8rem;
    right: 2%;
    color: #518bff;

    &.pcStyle {
      right: 32%;
    }

    .fixed-item {
      width: 3.5rem;
      height: 3.5rem;
      margin-bottom: 10px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      flex-direction: column;

      span {
        font-size: 12px;
      }

      i {
        font-size: 25px;
      }
    }
  }
</style>