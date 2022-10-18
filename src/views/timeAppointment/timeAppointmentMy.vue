<template>
  <div class="timeAppointmentMy">
    <c-title :hide="false" text="分时预约"></c-title>
    <div class="head">
      <div class="user">
        <div class="img">
          <img :src="userInfo.avatar" alt="" />
        </div>
        <div class="name">{{ userInfo.nickname }}</div>
      </div>
    </div>
    <div class="list">
      <div class="lis" @click="goUrl('timeAppointment_index')">
        <div class="left">
          <i class="iconfont icon-fontclass-anliku"></i>
          预约{{ appointmentLang.service }}
        </div>
        <div class="right">
          <i class="iconfont icon-advertise-next"></i>
        </div>
      </div>
      <div class="lis" @click="goUrl('timeAppointmentMylist', 1)">
        <div class="left">
          <i class="iconfont icon-fontclass-shangpindingdan"></i>
          我的预约
        </div>
        <div class="right">
          <i class="iconfont icon-advertise-next"></i>
        </div>
      </div>
      <div class="lis" @click="goUrl('timeAppointmentMylist', 2)" v-if="userInfo.is_boss == 1 || userInfo.is_worker == 1">
        <div class="left">
          <i class="iconfont icon-fx_haoyou"></i>
          {{appointmentLang.reserve_obj}}记录
        </div>
        <div class="right">
          <i class="iconfont icon-advertise-next"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      userInfo: []
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    goUrl(url, key) {
      if (url == "timeAppointmentMylist") {
        this.$router.push(this.fun.getUrl(url, { status: key }));
        return;
      }
      this.$router.push(this.fun.getUrl(url, {}));
    },
    getData() {
      $http
        .get("plugin.reserve-simple.frontend.member.get-info", {})
        .then(response => {
          if (response.result === 1) {
            this.userInfo = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  computed: {
    appointmentLang() {
      if (this.$store.state.shopLanguage?.reserve_simple) {
        return this.$store.state.shopLanguage.reserve_simple;
      } else {
        return { reserve_obj: "预约人员", service: "服务" };
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.list {
  margin: 0 0.63rem;
  background-color: #ffffff;
  border-radius: 0.31rem;
  margin-top: -2.1rem;
  padding: 1.44rem 1rem;
  .lis:last-child {
    margin-bottom: 0;
  }
  .lis {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    .right {
      .icon-advertise-next {
        font-size: 1.2rem;
      }
    }
    .left {
      font-size: 0.94rem;
      display: flex;
      align-items: center;
      .icon-fontclass-anliku {
        color: #fc8200;
        margin-right: 0.41rem;
        font-size: 1.3rem;
      }
      .icon-fontclass-shangpindingdan {
        color: #14a8ff;
        font-size: 1.3rem;
        margin-right: 0.41rem;
      }
      .icon-fx_haoyou {
        margin-right: 0.41rem;
        color: #ff2c41;
        font-size: 1.3rem;
      }
    }
  }
}
.head {
  width: 23.44rem;
  height: 8.13rem;
  background-image: linear-gradient(180deg, #ed3836 0%, #f5502b 38%, #fc6720 100%);
  border-radius: 0rem 0rem 1.56rem 1.56rem;
  padding: 1.63rem 0 0 1.56rem;
  box-sizing: border-box;
  .user {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .img {
      width: 2.81rem;
      height: 2.81rem;
      background-color: #000000;
      border: solid 0.06rem #ffffff;
      border-radius: 100%;
      margin-right: 0.69rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
    .name {
      font-size: 1rem;
      color: #ffffff;
    }
  }
}
</style>