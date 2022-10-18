<!-- 推荐官-查看详情 -->
<template>
  <div id="installationSeverExtension">
    <c-title :hide="false" :text="info.worker_name"></c-title>
    <div class="head">
      <div class="headMember">
        <div class="imgbox">
          <img :src="info.avatar" alt="" />
        </div>
        <div class="rright">
          <div class="userName">{{ info.nickname }}</div>
          <div class="userId">ID:{{ info.uid }}</div>
        </div>
      </div>
      <div class="orderDetail">
        <div class="left">
          <div class="num">{{ info.service_count }}</div>
          <div>累计服务笔数</div>
        </div>
        <div class="right">
          <div class="num">{{ $i18n.t("money") }}{{ info.sum_amount }}</div>
          <div>累计收益</div>
        </div>
      </div>
    </div>
    <div class="detailBox">
      <div class="title">
        <div class="line"></div>
        佣金
      </div>
    </div>
    <div class="gridBox">
      <div class="grid" @click="gotoDeatail(0)">
        <div class="price">{{ info.expect_amount }}{{ $i18n.t("元") }}</div>
        <div class="gridNmae">预计佣金</div>
      </div>
      <div class="grid" @click="gotoDeatail(1)">
        <div class="price">{{ info.unsettle_amount }}{{ $i18n.t("元") }}</div>
        <div class="gridNmae">未结算佣金</div>
      </div>
      <div class="grid" @click="gotoDeatail(2)">
        <div class="price">{{ info.settle_amount }}{{ $i18n.t("元") }}</div>
        <div class="gridNmae">已结算佣金</div>
      </div>
      <div class="grid" @click="gotoDeatail(4)">
        <div class="price">{{ info.unwithdraw_amount }}{{ $i18n.t("元") }}</div>
        <div class="gridNmae">未提现佣金</div>
      </div>
      <div class="grid" @click="gotoDeatail(3)">
        <div class="price">{{ info.withdraw_amount }}{{ $i18n.t("元") }}</div>
        <div class="gridNmae">已提现佣金</div>
      </div>
      <div class="grid" @click="gotoDeatail(5)">
        <div class="price">{{ info.disabled_amount }}{{ $i18n.t("元") }}</div>
        <div class="gridNmae">无效佣金</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      info: []
    };
  },

  activated() {
    this.getInfo();
  },

  components: {},

  computed: {},
  methods: {
    getInfo() {
      $http
        .post("plugin.live-install.frontend.worker.workerAmountPage", {}, "")
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
            this.fun.setWXTitle(response.data.worker_name);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoDeatail(num) {
      this.$router.push(this.fun.getUrl("installationSeverDividends", { active: num }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#installationSeverExtension {
  .head {
    width: 100%;
    height: 8.28rem;
    background-color: #ee2e2b;

    .headMember {
      width: 100%;
      height: 5.63rem;
      display: flex;
      // justify-content: center;
      align-items: center;
      padding: 0 1.56rem;
      box-sizing: border-box;

      .rright {
        flex: 1;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        align-items: flex-start;

        .userName {
          width: 100%;
          font-size: 1rem;
          color: #fff;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .userId {
          font-size: 0.75rem;
          color: #fff;
          padding: 0.34rem 0.5rem 0.3rem 0.5rem;
          background-color: #f36b69;
          border-radius: 0.83rem;
          margin-top: 0.53rem;
        }
      }

      .imgbox {
        width: 2.88rem;
        height: 2.88rem;
        background-color: cornsilk;
        border-radius: 100%;
        overflow: hidden;
        margin-right: 0.63rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .orderDetail {
      width: 100%;
      height: 2.66rem;
      background: #f36b69;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #fff;
    }
  }

  .title {
    color: #202020;
    font-size: 0.94rem;
    padding-left: 0.94rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 1rem;

    .line {
      width: 0.13rem;
      height: 0.93rem;
      background-color: #ee2e2b;
      border-radius: 0.05rem;
      margin-right: 0.16rem;
    }
  }

  .gridBox {
    display: flex;
    flex-wrap: wrap;
    margin: 1.4rem 0;

    .grid {
      width: 33%;
      margin-bottom: 2rem;
      text-align: center;
    }

    .gridNmae {
      font-size: 0.75rem;
      color: #8c8c8c;
    }

    .price {
      font-size: 1.13rem;
      color: #f15353;
      margin-bottom: 0.72rem;
    }
  }
}
</style>
