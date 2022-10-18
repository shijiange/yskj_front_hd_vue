<template>
  <div id="telephone">
    <!--<div class="input">
        <input type="text" name="" placeholder="请输入需要充值的金额">
        <span class="rt"></span>
    </div>-->
    <ul class="box">
      <li v-for="(item,index) in items" :key='index'>
        <div class="par" @click="selectStyle($event,item)" :class="{'active':item.recharge==moneyHotspot}">
          <b>{{item.recharge}}</b>
          <p>{{item.discount}}</p> <i></i>
          <div class="info" :class="{'active':item.recharge==moneyHotspot}"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      isactive: true,
      moneyHotspot: 99999,//热选值
      items: [
        { recharge: "", money: "" }
      ]
    };
  },
  methods: {
    showTel(mPhone) {
      this.getGoodsOptionPrice(mPhone);
    },
    selectStyle(e, money) {
      if (!money.discount) {
        this.$dialog.alert({ message: "请输入手机号码！" });

        return;
      }
      this.moneyHotspot = money.recharge;
      if (money.discount) {
        this.sourceMoney = money.discount;
        this.disableds = false;
        this.$emit("payMoney", money.discount);
      }
    },
    // 获取话费商品规格预价格
    getBalance() {
      let that = this;
      $http.get("plugin.recharge.api.goods.goodsOption", {}, "加载中...").then((response) => {
        if (response.result == 1) {
          this.items = response.data;
        } else {
          that.$dialog.alert({ message: response.msg });

        }
      }, function(response) {
        that.$dialog.alert({ message: response.msg });
      });

    },

    //获取用户实际充值金额
    getGoodsOptionPrice(mobile) {
      let that = this;
      $http.get("plugin.recharge.api.goods.goodsOptionPrice", { mobile }, "加载中...").then((response) => {

        if (response.result == 1) {
          this.items = response.data;

        } else {
          that.$dialog.alert({ message: response.msg });

        }
      }, function(response) {
        that.$dialog.alert({ message: response.msg });

      });

    }
  },
  mounted() {
    this.getBalance();
  },
  watch: {
    mPhones: function(val) {
      console.error(999999999, val);
      this.getPhoneInfo(val);
      if (!this.fun.isMoblie(val)) {
        this.getGoodsOptionPrice(val);
      } else {
        this.$dialog.alert({ message: "请输入正确的手机号码！" });

      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: border-box;
  }

  #telephone {
    background: #fff;
    padding: 0.875rem;

    .input {
      margin: 0.4375rem 0.8125rem;
      box-sizing: border-box;

      input {
        width: 96%;
        height: 2.1875rem;
        font-size: 12px;
        border-radius: 0.1875rem;
        border: 0.0625rem solid #ccc;
        padding-left: 4%;
        background: #fff;
        outline: 0;
        color: #000;
      }
    }

    .box {
      overflow: hidden;

      li {
        width: 33.3%;
        float: left;
        height: 4.625rem;
        margin-bottom: 0.625rem;

        div {
          margin: 0.375rem 0.375rem;
          border: 0.0625rem solid #ebebeb;
          height: 100%;
          border-radius: 0.25rem;
          box-sizing: border-box;
          padding-top: 1.25rem;

          b {
            font-size: 24px;
            color: #666;
            font-weight: normal;
          }

          p {
            font-size: 10px;
            color: #999;
          }
        }

        .active {
          border: 0.0625rem solid #36d2b6;
          position: relative;

          i {
            width: 1.875rem;
            height: 1rem;
            display: inline-block;
            position: absolute;
            right: 0;
            bottom: 0;
            background: url(../../../../../assets/images/checkeD.png) no-repeat 0.0625rem 0;
          }
        }

        .par {
          position: relative;
        }

        .info {
          width: 100%;
          height: 100%;
          z-index: 100;
          position: absolute;
          top: -0.375rem;
          left: -0.375rem;
        }
      }
    }
  }
</style>