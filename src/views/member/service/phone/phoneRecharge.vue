<template>
  <div id="phoneRecharge">
    <c-title :hide="false" text='手机充值' tolink='rechargeRecord' totext='充值记录'></c-title>
    <!-- <div class="telephone">
        <p v-if="tele">
            <b class="lf">13450772233</b>
            <span class="rt">广东移动</span>
        </p>
        <p v-else>
          <input type="tel" :placeholder="请输入电话号码" v-model.lazy="MobilePhone">
        </p>
    </div> -->
    <div class="member">
      <input type="text" placeholder="请输入手机号码">
      <span>广东移动</span>
      <div class="line"></div>
    </div>
    <div class="content">
      <ul class="tab-btn">
        <li :class="{active:isActive}" @click="changeActive(true)">充话费</li>
        <li :class="{active:!isActive}" @click="changeActive(false)">充流量</li>
      </ul>
      <telephone @payMoney="computMoney" v-show="isActive" ref="upTel"></telephone>
      <traffic @payMoney="computMoney" v-show="!isActive"></traffic>
    </div>
    <div class="m-footer">
      <p class="subtotal"><span class="lf">商品小计</span> <span class="rt">{{$i18n.t("money")}}{{sourceMoney}}</span></p>
      <div class="clear"></div>
      <div class="integral">
        <div class="lf">
          <b>积分</b> <span>可用积分&nbsp;<font>600</font>&nbsp;积分,抵扣&nbsp;<font>{{scoreMoney}}&nbsp;</font>元</span>
        </div>
        <van-switch class="rt" v-model="useScore" active-color="#f15353" inactive-color="#fff" size="25px"/>
      </div>
      <div class="clear"></div>
      <div class="amount">
        <span class="lf">合计:{{$i18n.t("money")}}<b>{{computedMoney}}</b></span>
        <!--<router-link :to= "fun.getUrl('rechargePay',{chineseLang:true})">-->
        <router-link :to="fun.getUrl('rechargePay')">
          <button class="rt" type="button">提交订单</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import telephone from "./components/telephone";
import traffic from "./components/traffic";
import cTitle from "components/title";

export default {
  components: { telephone, traffic, cTitle },
  data() {
    return {
      isActive: true,
      MobilePhone: "",
      tele: false,
      scoreMoney: 6.00,
      computedMoney: 10.00,
      sourceMoney: 10.00,
      useScore: false
    };
  },
  methods: {
    changeActive(b) {
      this.isActive = b;
    },
    computMoney(source) {
      console.error("组件打印", source);
      if (this.useScore) {
        this.sourceMoney = source;
        this.computedMoney = source - this.scoreMoney;
      } else {
        this.computedMoney = this.sourceMoney = source;
      }
    }
  },
  watch: {
    MobilePhone: function(val) {
      this.$refs.upTel.showTel(val);
    },
    useScore: function(val) {
      if (val) {
        this.computedMoney = this.sourceMoney - this.scoreMoney;
      } else {
        this.computedMoney = this.sourceMoney;
      }
    },
    isActive: function(val) {
      if (val) {
        this.computedMoney = 10;
        this.sourceMoney = 10;
        this.useScore = false;
      } else {
        this.computedMoney = 44.5;
        this.sourceMoney = 44.5;
        this.useScore = false;
      }
    }
  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: border-box;
  }

  #phoneRecharge {
    .member {
      background-color: #fff;
      margin-top: 0.625rem;
      padding: 0.625rem 0 0.625rem 0.875rem;
      text-align: left;

      input {
        border: none;
        font-size: 24px;
        color: #333;
        line-height: 1.875rem;
      }

      span {
        display: block;
        color: #8c8c8c;
        line-height: 1.5rem;
      }

      .line {
        border-bottom: solid 0.0625rem #ebebeb;
        margin-top: 0.625rem;
      }
    }

    .telephone {
      height: 2.8125rem;
      padding: 0 0.8125rem;
      background: #fff;

      p {
        height: 2.8125rem;

        b.lf {
          font-size: 22px;
          color: #1bba9e;
          font-weight: normal;
        }

        span.rt {
          font-size: 12px;
          color: #666;
        }

        input {
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          color: #1bba9e;
          font-size: 22px;
        }
      }
    }

    .content {
      background: #fff;
      margin-bottom: 8.75rem;
      margin-top: 0.625rem;

      .tab-btn {
        height: 2.4375rem;
        background: #fff;

        li {
          display: inline-block;
          width: 50%;
          line-height: 2.4375rem;
          float: left;
          color: #666;
          font-size: 16px;
          border-bottom: 0.125rem solid transparent;
          border-bottom: solid 0.0625rem #ebebeb;
        }

        li.active {
          color: #f15353;
          border-bottom: 0.1875rem solid #f15353;
        }
      }
    }

    .m-footer {
      box-shadow: 0 0 0.375rem 0 rgba(204, 204, 204, 0.6);
      width: 100%;
      position: fixed;
      bottom: 0;
      background: #fff;
      z-index: 199;

      .subtotal {
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.875rem;
        margin: 0;

        span.lf {
          color: #333;
          font-size: 16px;
        }

        span.rt {
          font-size: 16px;
          color: #f15353;
        }
      }

      .integral {
        border-top: 0.0625rem solid #ebebeb;
        height: 2.8125rem;
        line-height: 2.8125rem;
        margin-left: 0.875rem;
        padding-right: 0.875rem;

        div.lf {
          b {
            color: #333;
            font-size: 16px;
            margin-right: 0.625rem;
            font-weight: normal;
          }

          span {
            color: #8c8c8c;
            font-size: 12px;

            font {
              color: #f15353;
              font-size: 14px;
            }
          }
        }
      }

      .amount {
        border-top: solid 0.0625rem #e2e2e2;
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0 0 0.875rem;
        margin-bottom: 0;
        box-sizing: border-box;

        span.lf {
          color: #333;
          font-size: 16px;
        }

        button.rt {
          width: 6.875rem;
          height: 2.8125rem;
          color: #fff;
          font-size: 16px;
          background: #f15353;
          border: 0;
        }
      }
    }
  }

  /deep/ .van-switch {
    top: 0.5rem;

    .van-switch__node {
      top: -1px;
    }
  }
</style>
