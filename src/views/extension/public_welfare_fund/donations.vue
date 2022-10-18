<template>
  <div>
    <c-title text="公益支出"></c-title>
    <div class="welfare-donations">
      <h2>公益可用金额：{{ available_amount }}元</h2>
      <div class="donations-block">
        <div>
          <p class="label">申请支出金额</p>
          <div class="input-box">
            <!-- <van-icon class="iconfont icon-fontclass-jifen"></van-icon> -->
            <span class="moeny-symbol">{{ $i18n.t("money") }}</span>
            <van-field v-model.number="amount" placeholder="0.00"></van-field>
            <!-- <span class="all-exchange-btn" @click="amount = available_amount">全部兑换</span> -->
          </div>
        </div>
        <van-divider class="van-divider"></van-divider>
        <div class="remark">
          <p class="label">备注</p>
          <van-field v-model.trim="remarks" placeholder="请输入备注" :required="true"></van-field>
        </div>
      </div>

      <div class="submit-btn" @click="debounceMethods(submitRequest)">提交申请</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      available_amount: 0,
      amount: "",
      remarks: ""
    };
  },

  activated() {
    this.initData();
    this.getExpendData();
  },

  methods: {
    getExpendData() {
      $http.get("plugin.public-fund.frontend.controllers.fund.expendIndex", {}, "loading").then(res => {
        if (res.result != 1) {
          return this.$toast(res.msg);
        }
        let { amount, is_expend_member } = res.data;
        this.available_amount = amount;
        if (!is_expend_member) {
          // this.$dialog.corfirm()
          this.$router.go(-1);
        }
      });
    },

    submitRequest() {
      if (!this.amount) {
        return this.$toast("请输入支出金额");
      }
      if (!this.remarks) {
        return this.$toast("请输入备注");
      }
      if (this.amount > this.available_amount) {
        return this.$toast("支出金额不能大于可支出金额");
      }
      $http
        .post(
          "plugin.public-fund.frontend.controllers.fund.expend",
          {
            amount: this.amount,
            remark: this.remarks
          },
          "提交中..."
        )
        .then(res => {
          if (res.result != 1) {
            return this.$toast(res.msg);
          }
          this.$toast("申请成功");
          this.$router.push(this.fun.getUrl("publicWelfare"));
        })
        .catch(err => {});
    },

    debounceMethods(func, ...args) {
      let context = this;
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      let callNow = !this.debounceTimer; //是否立即执行
      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null;
      }, 800);
      if (callNow) func.apply(context, args);
    },
    initData() {
      this.available_amount = 0;
      this.amount = "";
      this.remarks = "";
    },

    deactivated() {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
    }
  },

  components: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.welfare-donations {
  padding: 0.9rem;
  text-align: left;
  .donations-block {
    margin-top: 0.9rem;
    padding: 1rem 2rem;
    background-color: #ffffff;
    box-shadow: 0rem 0.063rem 0.25rem 0rem rgba(7, 11, 33, 0.11);

    .label {
      font-size: 14px;
      color: #333333;
    }
    /deep/ .input-box {
      display: flex;
      align-items: center;
      .icon-fontclass-jifen {
        font-size: 28px;
        color: #f15353;
      }
      .moeny-symbol {
        color: #f15353;
      }
      .van-cell::after {
        display: none;
      }
      .van-field__control {
        height: 38px;
        font-size: 24px;
      }
    }
    .all-exchange-btn {
      font-size: 12px;
      color: #f15353;
      white-space: nowrap;
      cursor: default;
    }

    .van-divider {
      margin: 8px 0 16px 0;
    }

    .remark /deep/ .van-cell--required::before {
      left: 4px;
      font-size: 16px;
    }
  }

  .submit-btn {
    width: 17.5rem;
    height: 2.438rem;
    margin: 1.8rem auto;
    line-height: 2.438rem;
    color: #ffffff;
    background-image: linear-gradient(#f15353, #f15353), linear-gradient(#4d1717, #4d1717);
    border-radius: 0.375rem;
    text-align: center;
    cursor: default;
  }
}
</style>
