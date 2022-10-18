<!-- 发现-小视频  用户协议组件 -->
<template>
  <div id="vidaoAreement">
    <c-title :hide="false" :text="'用户协议'" > </c-title>
    <div class="image-box">
      <!-- 图片实现等宽高 -->
      <img :src="this.backgroundUrl" alt="" v-if="!this.fun.isTextEmpty(this.backgroundUrl)" class="imgClass" />
      <img
        src="../../assets/images/img_default.png"
        alt=""
        v-if="this.fun.isTextEmpty(this.backgroundUrl)"
        class="imgClass"
      />
    </div>
    <div class="content">
      <img src="../../assets/images/agreen_video@2x.png" alt="" class="icon_video" @click="gotoRelease" />
      <p class="text">视频</p>
      <van-checkbox v-model="checked" class="textCheck"
        >阅读并同意<span style="color: #1c96fe;" @click.stop="gotoAgreement">《用户协议》</span></van-checkbox
      >
      <!--<transition name="bounce">-->
      <!--<span class="btnClass"-->
      <!--v-if="isDisagree">请先阅读并同意《用户协议》</span>-->
      <!--</transition>-->
    </div>
    <div style="height: 2.8125rem;"></div>
    <van-popup
      v-model="showAgreement"
      class="mint-popup-3"
      position="right"
      closeOnClickModal="true"
      modal="false"
      style="z-index: 9999;"
    >
      <div class="city-info">
        <van-nav-bar
          left-arrow
          title="协议"
          fixed
          @click-left="popClose"
          :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
        />

        <div>
          <div style="height: 2.5rem; clear: both;"></div>

          <div id="a_content" v-html="protocol_content"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      backgroundUrl: '',
      checked: true,
      isDisagree: false,
      showAgreement: false,
      protocol_content: ''
    };
  },
  activated() {
    this.init();
    this.getBackground();
    this.getAgreement();
  },
  computed: {},
  components: { cTitle },
  methods: {
    init() {
      this.checked = true;
      this.backgroundUrl = '';
      this.isDisagree = false;
      this.showAgreement = false;
      this.protocol_content = '';
    },
    //获取背景图
    getBackground() {
      // validate_page 实名认证判断
      $http.get('plugin.video-share.frontend.set.getBackground', {validate_page: 1}).then(res => {
        if (res.result === 1) {
          this.backgroundUrl = res.data.background;
        } else {
          console.log(res.msg);
        }
      });
    },
    getAgreement() {
      $http.get('plugin.video-share.frontend.set.getAgreement').then(res => {
        if (res.result == 1) {
          this.protocol_content = res.data.agreement;
        } else {
          this.protocol_content = res.msg;
        }
      });
    },
    gotoRelease() {
      zhuge.track('视频发布用户协议页面-点击发布按钮');
      if (this.checked) {
        localStorage.removeItem('shareVideoPath');
        this.$router.push(this.fun.getUrl('releaseVideo', {}));
      } else {
        Toast('请先勾选阅读并同意《用户协议》');
        this.isDisagree = false;
        setTimeout(() => {
          this.isDisagree = true;
        }, 0);
      }
    },
    gotoAgreement() {
      this.showAgreement = true;
      zhuge.track('进入视频发布用户协议页面');
    },
    popClose() {
      this.showAgreement = false;
    }
  },
  watch: {
    checked(val) {
      if (val) {
        this.isDisagree = false;
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#vidaoAreement {
  .image-box {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;

    .imgClass {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .content {
    display: flex;
    flex-direction: column;

    .icon_video {
      width: 5rem;
      height: 5rem;
      margin-top: 1.6rem;
    }

    .text {
      font-size: 1rem;
      margin: 0.59rem auto 1rem;
    }

    .textCheck {
      color: #999;
      margin: 0 auto;
    }

    .bounce-enter-active {
      animation: bounce-in 0.2s;
    }

    .bounce-leave-active {
      animation: bounce-in 0.2s reverse;
    }

    @keyframes bounce-in {
      0% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.05);
      }

      100% {
        transform: scale(1);
      }
    }

    .btnClass {
      display: block;
      width: 15rem;
      height: 2rem;
      background-color: #ddd;
      border-radius: 0.25rem;
      color: #333;
      line-height: 2rem;
      text-align: center;
      margin: 0.75rem auto 0;
    }
  }

  .city-info {
    overflow-y: scroll;
    width: 100vw;
    height: 100vh;
    background: #fff;
    border: none;
  }

  .mint-header {
    background: none;
    color: #666;
    border-bottom: 0.0625rem solid #e8e8e8;
  }

  #a_content {
    margin: 0 20px;
  }

  .van-nav-bar,
  /deep/.van-nav-bar__content {
    height: 40px;
  }

  /deep/.van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/.van-nav-bar .van-icon {
    color: #666;
  }

  /deep/.van-nav-bar__left {
    padding: 0 0 0 10px;
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
    left: 50%;
    margin-left: -187.5px;
  }
}
</style>
