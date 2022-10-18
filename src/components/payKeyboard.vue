<template>
  <div class="components" style="z-index: 3000; position: fixed;">
    <van-overlay :show="payKeyboardShow">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;" v-if="restrict == 'once'">
        <transition name="van-slide-right">
          <div class="payKeyboardWrapper" v-show="payKeyboardShow">
            <!-- 密码输入框 -->
            <div class="payKeyboardTop">
              <div class="payKeyboard">
                <div class="header">
                  <div class="title">请输入密码</div>
                  <i class="iconfont icon-guanbi" @click="closePayKeyboard"></i>
                </div>
                <div class="input">
                  <van-password-input :value="payKeyboardText" />
                </div>
                <div class="tips" @click="gotoBalance">忘记密码</div>
              </div>
            </div>

            <!-- 数字键盘 -->
            <van-number-keyboard title="安全键盘" :show="true" v-model="payKeyboardText" @input="onInput2" @blur="closePayKeyboard" />
          </div>
        </transition>
      </div>
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;" v-if="restrict == 'more'" id="yz_payCode">
        <transition name="van-slide-right">
          <div class="payKeyboard">
            <div class="header">
              <div class="title">请输入密码</div>
              <i class="iconfont icon-guanbi" @click="closePayKeyboard"></i>
            </div>
            <div class="input">
              <van-field v-model="payKeyboardText" type="password" label="密码">
                <template #button>
                  <van-button size="small" type="primary" :disabled="payKeyboardText.length < 8" @click="submit">确认</van-button>
                </template>
              </van-field>
            </div>
            <div class="tips" @click="gotoBalance">忘记密码</div>
          </div>
        </transition>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  props: ["payKeyboardShow"],
  data() {
    return {
      payKeyboardText: "",
      restrict: null,
      isPassword: false, //是否设置密码
      minLength: 8, //开启多位密码8-16位,最小位数
      maxLength: 16 //开启多位密码8-16位,最大位数
    };
  },
  created() {},
  watch: {
    payKeyboardShow: function() {
      if (this.payKeyboardShow && !this.restrict) {
        this.checkCode();
      }
    }
  },
  methods: {
    checkCode() {
      $http.get("payment.password.multiple", {}, "").then(response => {
        if (response.result == 1) {
          if (response.data) {
            this.restrict = "more";
          } else {
            this.restrict = "once";
          }
        } else {
          this.restrict = "more";
          console.log(response.msg);
        }
      });
    },
    // 多位密码提交
    submit() {
      // 多位密码为8位到16位数字加英文
      if (this.payKeyboardText.length <= this.maxLength && this.payKeyboardText.length >= this.minLength) {
        this.payKeyboardText = `${this.payKeyboardText}`;
        this.$emit("complete", this.payKeyboardText);
        this.payKeyboardText = "";
        this.payKeyboardShow = false;
        this.$emit("update:payKeyboardShow", false);
      } else {
        Toast("请输入正确密码");
        this.payKeyboardText = "";
        this.payKeyboardShow = false;
        this.$emit("update:payKeyboardShow", false);
      }
    },
    closePayKeyboard() {
      this.payKeyboardShow = false;
      this.payKeyboardText = "";
      this.$emit("close", false);
      this.$emit("update:payKeyboardShow", false);
    },
    isHasPassword() {
      $http.get("member.balance-password.is-has-password", {}, "").then(response => {
        if (response.result == 1) {
          this.isPassword = response.data.is_has;
        }
      });
    },
    gotoBalance() {
      this.$router.push(this.fun.getUrl("balance_password", {}));
      // if(this.isPassword){
      //   this.$router.push(this.fun.getUrl('balance_password', {}));
      // }else {
      //   this.$router.push(this.fun.getUrl('set_balance_password', {}));
      // }
    },
    onInput2(text) {
      if (this.payKeyboardText.length < 6) {
        this.payKeyboardText = `${this.payKeyboardText}${text}`;
        if (this.payKeyboardText.length == 6) {
          this.$emit("complete", this.payKeyboardText);
          this.payKeyboardText = "";
          this.payKeyboardShow = false;
          this.$emit("update:payKeyboardShow", false);
        }
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#yz_payCode {
  /deep/ .van-field__label {
    width: 3rem;
    line-height: 2rem;
  }

  .payKeyboard {
    width: 80%;
    height: 10rem;
    background: #fff;
    border-radius: 0.5rem;

    .header {
      height: 2.596rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .title {
        font-size: 1rem;
        letter-spacing: 0.05rem;
        color: #000;
      }

      .icon-guanbi {
        position: absolute;
        top: 0.875rem;
        right: 1.25rem;
        color: #000;
      }
    }

    .input {
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
    }

    .tips {
      color: red;
    }
  }
}

.payKeyboardWrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;

  .payKeyboardTop {
    width: 100%;
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .payKeyboard {
    width: 80%;
    height: 10rem;
    background: #fff;
    border-radius: 0.5rem;

    .header {
      height: 2.596rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .title {
        font-size: 1rem;
        letter-spacing: 0.05rem;
        color: #000;
      }

      .icon-guanbi {
        position: absolute;
        top: 0.875rem;
        right: 1.25rem;
        color: #000;
      }
    }

    .input {
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
    }

    .tips {
      color: red;
    }
  }
}
</style>
