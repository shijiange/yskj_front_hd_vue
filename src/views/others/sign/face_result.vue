<template>
  <div class="result">
    <!--<c-title :hide="false" :text="'人脸识别结果'">-->
    <!--</c-title>-->
    <!--<div style="height: 40px"></div>-->

    <!--成功-->
    <div class="success-box" v-if="noIdentify">
      <div style="text-align: center;">
        <i class="iconfont icon-zb_successful"></i>
      </div>
      <p style="font-size: 20px; font-weight: bold; padding-bottom: 10px;">签署成功</p>
      <p style="line-height: 1.5;">恭喜你，完成了身份验证<span class="link" @click="toPage">点击返回合同中心</span></p>
      <!--<p style="line-height: 1.5;">合同已签署成功，返回<span class="link" @click="toSign">合同列表</span>可查看已签署合同</p>-->
    </div>
    <!--成功end-->

    <!--失败-->
    <div class="fail-box" v-if="!noIdentify">
      <div style="text-align: center;">
        <i class="iconfont icon-adsystem_icon_cancle"></i>
      </div>
      <p style="font-size: 20px; font-weight: bold;">签署失败</p>
      <p style="padding-top: 10px;">{{msg}}</p>
      <p style="padding: 10px;">签署失败，您本次的人脸识别未通过，<span class="link" @click="toPage">请重新签署</span></p>
    </div>
    <!--失败end-->
  </div>
</template>

<script>
// import { Toast } from 'vant';

export default {
  data() {
    return {
      noIdentify: true,
      msg: '',
      face_sign_id: '',
      face_sign_token: '',
    };
  },
  activated() {
    this.noIdentify = this.fun.getKey("res") == 1;
    if(this.fun.getKey('msg')) {
      this.msg = decodeURIComponent(this.fun.getKey('msg'));
    }
    // this.face_sign_id = this.fun.getKey("face_sign_id");
    // this.face_sign_token = this.fun.getKey("face_sign_token");
    // this.getFaceData();
  },
  methods: {
    toPage() {
      if(this.fun.getKey('shop_sign') == 1) {
        this.$router.push(this.fun.getUrl("signIndexPlu"));
      }else {
        this.$router.push(this.fun.getUrl("signIndex"));
      }
    },
    toSign() {
      this.$router.push(this.fun.getUrl("contractList"));
    },
    getFaceData() {
      $http
        .get("plugin.yun-sign.frontend.h5.contract.face-sign-contract",
          {face_sign_id:this.face_sign_id, face_sign_token: this.face_sign_token},
          "..."
        ).then(response => {
          if (response.result === 1) {
            this.noIdentify = true;
          } else {
            this.noIdentify = false;
            this.$dialog.alert({message:response.msg});
          }
        },
        response => {
          this.$dialog.alert({message:response.msg});

        }
        );
    },
  },
  components: {}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .result {
    background: #fff;
    min-height: 100vh;
    padding-bottom: 50px;
  }

  .success-box,
  .fail-box {
    position: absolute;
    top: 40%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);

    img {
      width: 70px;
      height: 70px;
      margin-bottom: 10px;
    }

    .icon-adsystem_icon_cancle {
      font-size: 80px;
      color: red;
    }

    .icon-zb_successful {
      font-size: 80px;
      color: limegreen;
    }

    .link {
      cursor: pointer;
      color: #409eff;
    }
  }

</style>
