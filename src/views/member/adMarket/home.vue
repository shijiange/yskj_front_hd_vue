<!-- 广告市场 首页 -->
<template>
  <div id="ad_Home">
    <c-title :hide="false"
             text="广告中心"></c-title>
    <div class="member">
      <img :src="userInfo.avatar"
           alt="" />
      <div class="name">{{ userInfo.nickname }}</div>
    </div>
    <div class="main">
      <div class="title">设备管理</div>
      <router-link :to="fun.getUrl('MyDevice')"
                   class="li">
        <i class="iconfont icon-adsystem_my_equipment"
           style="color: #00b2ff;"></i>
        <div class="text">我的设备</div>
        <i class="fa fa-angle-right"></i>
      </router-link>
      <router-link :to="fun.getUrl('DeviceManger')"
                   class="li">
        <i class="iconfont icon-adsystem_ad_admin"
           style="color: #ffba1f;"></i>
        <div class="text">广告管理</div>
        <i class="fa fa-angle-right"></i>
      </router-link>
    </div>
    <div class="main">
      <div class="title">我是广告主</div>
      <router-link :to="fun.getUrl('ADApply')"
                   class="li"
                   v-if="status == 1">
        <i class="iconfont icon-adsystem_ad_apply"
           style="color: #f55a24;"></i>
        <div class="text">广告主申请</div>
        <i class="fa fa-angle-right"></i>
      </router-link>
      <div class="li"
           v-if="status == 2||status == 0"
           @click="gotoAdvertiser">
        <i class="iconfont icon-adsystem_ad_center"
           style="color: #3b66f5;"></i>
        <div class="text">广告主中心</div>
        <i class="fa fa-angle-right"></i>
      </div>
    </div>
    <van-popup v-model="showAdvertiser"
               round
               @close="closeAdvertiser"
               closeable
               class='set-popup-class'>
      <img src="../../../assets/images/addcheck.png"
           alt="">
      <div class="titleone">申请成功</div>
      <div class="titletwo">等待平台审核</div>
    </van-popup>
    <van-popup v-model="showManger"
               round
               @close="closeManger"
               class='set-popups-class'>
      <img src="../../../assets/images/adsystem_pic_noequipment@2x.png"
           alt="">
      <div class="titleone">您暂无可用设备</div>
      <div class="titletwo">无法进入广告管理</div>
      <div class="closeMangerBtn"
           @click="closeManger">确认</div>
    </van-popup>
  </div>
</template>

<script>
import cTitle from "components/title";

export default {
  data() {
    return {
      userInfo: {},
      status: null,
      showAdvertiser: false,
      showManger: false
    };
  },

  activated() {
    this.init();
    this.getInfo();
    this.getMemberverify();
    if (this.$store.state.adApply) {
      this.showAdvertiser = true;
    }
    if (this.$store.state.adDevice) {
      this.showManger = true;
    }
  },

  components: { cTitle },

  computed: {},

  methods: {
    closeAdvertiser() {
      this.showAdvertiser = false;
      this.$store.commit("setAdApply", false);
    },
    closeManger() {
      this.showManger = false;
      this.$store.commit("setAdDevice", false);
    },
    init() {
      this.status = null;
      this.userInfo = {};
      this.showAdvertiser = false;
      this.showManger = false;
    },
    getInfo() {
      $http
        .get("plugin.advert-market.frontend.center.getInfo", {}, "")
        .then(response => {
          if (response.result == 1) {
            this.userInfo = response.data;
          } else {
            console.log(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMemberverify() {
      $http
        .get("plugin.advert-market.frontend.advertMember.verify", {}, "")
        .then(response => {
          if (response.result == 1) {
            this.status = response.data.status;
          } else {
            this.status = response.data.status;
            console.log(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoAdvertiser() {
      if (this.status == 0) {
        this.showAdvertiser = true;
        return;
      } else {
        this.$router.push(this.fun.getUrl("advertiser", {}));
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#ad_Home {
  text-align: left;
  color: #333;

  .member {
    display: flex;
    padding: 1.375rem 1.813rem;
    background: #fff;
    margin-bottom: 0.594rem;

    img {
      width: 2.875rem;
      height: 2.875rem;
      border-radius: 100%;
      overflow: hidden;
    }

    .name {
      flex: 1;
      padding-left: 0.844rem;
      font-weight: bold;
      font-size: 0.875rem;
    }
  }

  .main {
    background: #fff;
    margin-bottom: 0.594rem;
    padding: 0 1.15rem;

    .title {
      width: 100%;
      height: 2.625rem;
      line-height: 2.625rem;
      font-size: 1rem;
      font-weight: bold;
      color: #333;
    }

    .li {
      display: flex;
      height: 2.5rem;
      line-height: 2.5rem;

      .iconfont {
        font-size: 1.25rem;
      }

      .text {
        flex: 1;
        padding-left: 0.813rem;
      }

      i {
        font-size: 1.063rem;
        line-height: 2.5rem;
      }
    }
  }

  .set-popup-class,
  .set-popups-class {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    width: 13rem;
  }

  .set-popup-class {
    img {
      width: 3rem;
      height: 3rem;
      margin: 2rem 0 0.825rem;
    }

    .titleone {
      color: #f35353;
      font-weight: bold;
      font-size: 1rem;
      margin-bottom: 2.063rem;
    }

    .titletwo {
      margin-bottom: 2.688rem;
    }
  }

  .set-popups-class {
    img {
      width: 4.625rem;
      height: 3.719rem;
      margin: 1.25rem 0;
    }

    .titleone {
      color: #f35353;
      font-weight: bold;
      font-size: 1rem;
      margin-bottom: 0.625rem;
    }

    .titletwo {
      margin-bottom: 2rem;
    }

    .closeMangerBtn {
      width: 8.825rem;
      height: 1.875rem;
      line-height: 1.875rem;
      text-align: center;
      font-size: 1rem;
      background: #f35353;
      color: #fff;
      border-radius: 0.938rem;
      margin-bottom: 1.531rem;
    }
  }
}
</style>
