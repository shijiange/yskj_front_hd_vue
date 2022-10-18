<template>
  <div class="page" id="signLunch">
    <c-title text="合同中心"></c-title>

    <div class="header" v-if="member.nickname">
      <div class="face">
        <img :src="member.avatar" alt="" />
      </div>
      <div class="header-box">
        <div class="nickname">{{ member.nickname }}</div>
        <div class="desc" @click="toSign">
          <div class="name">{{ member.realname }}</div>
          <div class="label">{{ details.person_status == 1 ? "已认证" : "个人未认证" }}</div>
        </div>
        <!--<div class="desc" @click="toSign">-->
        <!--<div class="name">{{ member.company_name }}</div>-->
        <!--<div class="label">{{ member.company_status == 1 ? "已认证" : "企业未认证" }}</div>-->
        <!--</div>-->
      </div>
    </div>

    <div class="container myContract">
      <div class="container-title">我的合同</div>
      <div class="container-box">
        <div class="container-flex" @click="gotoPages('contractList', {}, { status: 0 })">
          <div class="num">{{ my_contract.all_count }}</div>
          <div class="desc">全部合同</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractList', {}, { status: 3 })">
          <div class="num">{{ my_contract.self_no_sign }}</div>
          <div class="desc">待我签署</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractList', {}, { status: 1 })">
          <div class="num">{{ my_contract.self_signed }}</div>
          <div class="desc">我已签署</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractList', {}, { status: 2 })">
          <div class="num">{{ my_contract.finish_count }}</div>
          <div class="desc">已完成</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractList', {}, { status: 4 })">
          <div class="num">{{ my_contract.over_time_count }}</div>
          <div class="desc">已超时</div>
        </div>
      </div>
    </div>

    <div class="container contractBill">
      <div class="container-title">合同账单</div>
      <div class="fixed-btn" @click="gotoPages('searchAll')">购买合同</div>
      <div class="container-box">
        <div class="container-flex" @click="gotoPages('contractBills')">
          <div class="num">{{ contract_bill.contract_num_sum }}</div>
          <div class="desc">购买数量</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractBills')">
          <div class="num">{{ contract_bill.use_num_sum }}</div>
          <div class="desc">已使用数量</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractBills')">
          <div class="num">{{ contract_bill.rest_num_sum }}</div>
          <div class="desc">可使用数量</div>
        </div>
      </div>
    </div>

    <div style="height: 2rem;"></div>
  </div>
</template>

<script>
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      member: {},
      details: {},
      my_contract: {},
      contract_bill: {}
    };
  },
  activated() {
    this.getDetails();
  },
  methods: {
    toSign() {
      if (this.details.person_status != 1) {
        this.$router.push(this.fun.getUrl("personBank"));
      }
      // else if (this.details.status == 1 && this.details.company_status != 1) {
      //   this.$router.push(this.fun.getUrl("signCompany"));
      // }
    },
    gotoPages(url, params = {}, query = {}) {
      this.$router.push(this.fun.getUrl(url, params, query));
    },
    getDetails() {
      $http.get("plugin.yun-sign.frontend.h5.member.personIndex", {}, "loading").then(res => {
        if (res.result != 1) {
          return this.$toast(res.msg);
        }
        this.details = res.data;
        this.member = res.data.member;
        this.my_contract = res.data.my_contract || {};
        this.contract_bill = res.data.contract_bill || [];
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./common.scss";

#signLunch {
  .header {
    display: flex;
    width: 23.438rem;
    padding: 1.531rem 0.938rem 2.531rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/sign_index_header_bg.png");
    background-size: cover;
    background-repeat: no-repeat;

    .face {
      width: 3.125rem;
      height: 3.125rem;
      border-radius: 50%;

      img {
        width: 3.125rem;
        height: 3.125rem;
        border-radius: 50%;
      }
    }

    .header-box {
      display: flex;
      flex-direction: column;
      padding-left: 0.625rem;
      text-align: left;

      .nickname {
        margin-bottom: 0.2rem;
        font-size: 1rem;
        color: #fff;
      }

      .desc {
        display: flex;
        align-items: center;
        margin-top: 0.2rem;
        font-size: 0.75rem;
        color: #fff;

        .label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.15rem 0.4rem;
          line-height: 1rem;
          margin-left: 0.594rem;
          background-color: #0c73c6;
          border-radius: 0.547rem;
          font-size: 0.625rem;
          color: #fff;
        }
      }
    }
  }

  .container {
    .fixed-btn {
      position: absolute;
      top: 0.6rem;
      right: 0.75rem;
      width: 3.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1.406rem;
      font-size: 0.625rem;
      color: #fa761d;
      border-radius: 0.188rem;
      border: solid 0.063rem #fa761d;
    }

    .container-box {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;

      .container-flex {
        .num {
          font-weight: bold;
          font-size: 0.875rem;
          color: #282828;
        }

        .desc {
          margin-top: 0.425rem;
          font-size: 0.688rem;
          color: #4f4f4f;
        }
      }
    }
  }

  .myContract {
    margin-top: -1.5rem;
  }

  .companyContract {
    margin-top: 0.625rem;
  }

  .contractBill {
    margin-top: 0.625rem;
  }
}

.v-leave {
  opacity: 1;
  width: 6.313rem;
}

.v-leave-active {
  /* 用3s的时间过渡从隐藏开始到隐藏结束 */
  opacity: 0;
  width: 0 !important;
  transition: all 0.5s;
}
</style>
