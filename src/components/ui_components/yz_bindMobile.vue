<!-- 绑定手机组件 可自定义图片、文字、按钮-->
<template>
  <div id="yz_bindMobile">
    <van-popup v-model="showVerification" round :close-on-click-overlay="false">
      <div class="verification">
        <div style="padding: 10px 0;">
          <em class="name"></em>
          <span>请先绑定手机号</span>
        </div>
        <!-- 验证码弹窗 -->
        <div class="inputBox">
          <em class="name">手机号</em>
          <input type="number" placeholder="请输入手机号" id="phone" v-model="form.mobile" />
        </div>
        <div class="inputBox" v-if="imgcode">
          <em class="name" style="width: 25%;">图形验证码</em>
          <input type="text" placeholder="请输入图形验证码" style="width: 35%;" id="captcha" v-model="form.captcha" />
          <img class="getcodeImg" style="width: 40%; height: 2.5rem; z-index: 999;" :src="imgcode" @click="getimgdata()" />
        </div>
        <div class="inputBox">
          <em class="name">验证码</em>
          <input type="number" placeholder="请输入验证码" id="code" v-model="form.code" /><span class="getcodeClass" @click="VerificationCode" v-show="!count">获取验证码</span
          ><span class="getcodeClass" v-show="count">{{ count }}秒后重新获取</span>
        </div>
        <div @click.stop="showContent = true" v-show="protocol_content" class="protocol">{{ protocol_title }}</div>
        <div class="bottomBox">
          <!--<div class="btn1" @click="showVerification = false">取消</div>-->
          <div class="btn2" @click="bindMobile">确认</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showContent" class="mint-popup-3" closeOnClickModal="true" modal="false" style="z-index: 2004; border-radius: 0.656rem;">
      <div class="city-info">
        <van-nav-bar title="协议" fixed />

        <div>
          <div style="height: 2.5rem; clear: both;"></div>

          <div id="a_content" v-html="protocol_content"></div>
          <div
            style="width: 12.75rem;
                  height: 2.313rem;
                  background-color: #f04d4d;
                  border-radius: 0.188rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #fff;
                  font-size: 1.193rem;
                  margin: 0 auto;
                  margin-top: 1.5rem;
                  margin-bottom: 1.063rem;"
            @click="showContent = false"
          >
            确定
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  props: {
    //数据，为空才显示
    datas: {
      type: [String, Object, Array]
    }
  },
  data() {
    return {
      showVerification: false, //绑定手机
      imgcode: "",
      count: "",
      form: {
        mobile: "",
        //验证码
        code: "",
        captcha: ""
      },
      showContent: false,
      protocol_title: "",
      protocol_content: ""
    };
  },
  deactivated() {
    this.showVerification = false;
  },
  destroyed() {
    this.showVerification = false;
  },
  methods: {
    initShow() {
      this.getimgdata();
      this.getProtocolInfo();
      this.showVerification = true;
    },
    hide() {
      this.showVerification = false;
    },
    //协议信息
    getProtocolInfo() {
      $http.get("setting.get-member-protocol").then(
        response => {
          if (response.result == 1) {
            this.protocol_content = response.data.content;
            this.protocol_title = response.data.title;
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    getimgdata() {
      $http
        .get("home-page.getCaptcha")
        .then(res => {
          if (res.data.captcha.status && res.data.captcha.status == "0") {
            this.imgcode = null;
          }
          if (res.data.captcha.img) {
            this.imgcode = res.data.captcha.img;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取验证码
    VerificationCode() {
      if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
        Toast("请填图形验证码");
        return;
      }
      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast("请填写手机号");
      } else {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: "发送中"
        });
        $http
          .get("member.register.sendCodeV2", {
            mobile: this.form.mobile,
            captcha: this.form.captcha
          })
          .then(
            response => {
              Toast.clear();
              if (response.result == 1) {
                this.getCode();
              } else {
                //刷新图形验证码
                Toast(response.msg);
                this.form.captcha = "";
                this.getimgdata();
              }
            },
            response => {
              console.log(response.msg);
            }
          );
      }
    },
    // 60秒倒计时
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            clearInterval(this.timer);
            this.count = 0;
            this.timer = null;
          }
        }, 1000);
      }
    },
    bindMobile() {
      //发送获取验证码的请求
      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast("手机号码不能为空");
        return;
      }
      if (this.fun.isMoblie(this.form.mobile)) {
        Toast("请输入正确的手机号");
        return;
      }
      if (this.fun.isTextEmpty(this.form.code)) {
        Toast("请填写验证码");
        return;
      }
      if (this.imgcode) {
        if (this.fun.isTextEmpty(this.form.captcha)) {
          Toast("图形验证码不能为空");
          return;
        }
      }

      $http.post("member.member.justBindMobile", this.form, "正在绑定手机..").then(
        response => {
          if (response.result == 1) {
            Toast("绑定成功！");
            this.showContent = false;
            this.showVerification = false;
            this.$emit("bindSuccess");
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#yz_bindMobile {
  .verification {
    width: 22rem;
    padding: 0 0.75rem;
    margin: 0 auto;

    .text {
      padding: 1.725rem 2rem 2.125rem;
      color: #666;
      text-align: center;
      font-size: 0.75rem;
    }

    .inputBox {
      height: 3rem;
      display: flex;
      border-bottom: 0.0625rem solid #ebebeb;
      text-align: left;
      align-items: center;
      margin-top: 0.625rem;

      .name {
        width: 65px;
        color: #000;
      }

      input {
        border: none;
      }

      #phone {
        flex: 1;
      }

      #code {
        width: 45%;
      }

      .getcodeClass {
        display: inline-block;
        height: 1.75rem;
        line-height: 1.75rem;
        background-color: #f54242;
        color: #fff;
        border-radius: 0.625rem;
        padding: 0 0.625rem;
        font-size: 0.75rem;
      }

      .getcodeImg {
        display: inline-block;
        height: 1.25rem;
        line-height: 1.25rem;
        flex: 1;
      }
    }

    .bottomBox {
      padding-top: 2rem;
      padding-bottom: 1rem;
      display: flex;
      justify-content: space-around;

      .btn1,
      .btn2 {
        width: 6rem;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        color: #fff;
        font-size: 1rem;
        border-radius: 1.234rem;
      }

      .btn1 {
        background: #bcbcbc;
      }

      .btn2 {
        background: #f71515;
      }
    }
  }

  .city-info {
    border-radius: 0.656rem;
    width: 20rem;
    height: 32rem;
    margin: 0 auto;
    // padding-bottom: 5rem;
    background: #fff;

    header {
      border-radius: 0.656rem 0.656rem 0 0;
    }

    #a_content {
      // width: 14.438rem;
      margin: 0 1.063rem 0 0.75rem;
      height: 24rem;
      overflow-y: scroll;

      /deep/img {
        max-width: 100%;
        display: flex;
      }

      img {
        max-width: 100%;
        height: auto;
        display: inline-block;
      }
    }
  }

  .protocol {
    text-align: left;
    font-weight: bold;
    margin: 1rem 0.5rem 0 0.5rem;
    color: #f71515;
  }
}
</style>
