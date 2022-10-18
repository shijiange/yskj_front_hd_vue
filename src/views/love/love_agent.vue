<template>
  <div id="love_agent">
    <c-title :hide="false" text='代理商奖励详情'></c-title>
    <div style="height: 1.25rem; background-color: #fff;"></div>
    <p>团队代理等级奖励({{$i18n.t("元")}})</p>
    <p id="money">+900
      <small></small>
    </p>
    <p id="dingjing">冻结</p>
    <div class="tbs">
      <div class="left">现团队等级</div>
      <div class="right">社区店</div>
      <div class="left">原团队等级</div>
      <div class="right">形象店</div>
      <div class="left">现团队等级奖励</div>
      <div class="right">100.00{{$i18n.t("元")}}</div>
      <div class="left">原团队等级奖励</div>
      <div class="right">100.00{{$i18n.t("元")}}</div>
    </div>
    <div class="lise"></div>
    <div class="tbs">
      <div class="left">升级时间</div>
      <div class="right">6958303457745602122</div>
      <div class="left">订单完成时间</div>
      <div class="right">2017-07-07 12:11:00</div>
      <div class="left">奖励时间</div>
      <div class="right">2017-07-07 12:11:00</div>
    </div>
  </div>
</template>
<script>
import cTitle from "components/title";

export default {
  data() {
    return {
      balance: 0
      //是否开启充值

    };
  },
  methods:
      {

        getBalance() {

          var that = this;
          $http.get("finance.balance.balance", {}, "加载中...").then(function(response) {

            if (response.result == 1) {
              console.log(response.data);

            } else {
              that.$dialog.alert({ message: response.msg });
            }

          }, function(response) {
            that.$dialog.alert({ message: response.msg });

          });

        }

      },
  activated() {

  },
  components: { cTitle }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #love_agent {
    background-color: #fff;
    padding-bottom: 0.625rem;

    p {
      background-color: #fff;
      font-size: 14px;
    }

    #money {
      font-weight: bold;
      color: #333;
      font-size: 28px;
      line-height: 3rem;

      small {
        font-size: 14px;
      }
    }

    #dingjing {
      padding-bottom: 0.625rem;
      background-color: #fff;
      color: #8c8c8c;
      margin: 0 auto;
    }

    .lise {
      margin: 0.625rem 0.9375rem;
      border-bottom: 0.0625rem solid #ebebeb;
      display: block;
    }

    .tbs {
      display: flex;
      align-items: center;
      background: #fff;
      padding: 0 0.9375rem;
      flex-flow: row wrap;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 1.875rem;

      .left {
        flex: 40%;
        text-align: left;
      }

      .right {
        flex: 60%;
        text-align: right;
      }
    }
  }
</style>
