<template>
  <div>
    <!-- 注销内容显示 -->
    <div class="cancellation">
      <div class="title">{{ cancelInfo.title }}</div>
      <div class="content" v-html="cancelInfo.content"></div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      cancelInfo: {},
    };
  },
  activated() {
    this.getData();
  },

  methods: {
    getData() {
      $http.get("member.cancel.getSet", {}, "加载中").then(res => {
        if (res.result !== 1) {
          Toast(res.msg);
          return;
        }
        this.cancelInfo = res.data.set;
      });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
  .cancellation {
    padding: 1.25rem;

    .title {
      font-size: 1rem;
      font-weight: bold;
      color: #333;
    }

    .content {
      min-height: 68vh;
      overflow: hidden;
      margin-top: 1rem;
      text-align: left;
    }

    .bottom-box {
      margin-top: 1rem;
      padding-left: 0.8rem;
    }

    .btn-submit {
      margin: 0 auto;
      margin-top: 1rem;
      width: 19.13rem;
      height: 2.5rem;
      background-color: #f15353;
      border-radius: 1.25rem;
      font-size: 0.94rem;
      line-height: 2.5rem;
      color: #fff;
    }

    .disabled {
      color: #6b6666;
      background-color: transparent;
      background-image: linear-gradient(0deg, #d2d2d2 0%, rgba(210, 210, 210, 0.64) 100%) !important;
    }
  }

  .succesed {
    font-size: 0.94rem;

    .img {
      margin: 2.69rem 0 0.5rem 0;
      width: 6.44rem;
      height: 6.44rem;
    }

    .btns {
      margin-top: 1.7rem;
      display: flex;
      justify-content: space-around;

      .btn-cancel {
        width: 8.88rem;
        height: 2.5rem;
        border-radius: 1.25rem;
        border: solid 0.03rem #f15353;
        line-height: 2.4rem;
        color: #f15353;
      }

      .btn-back {
        width: 8.88rem;
        height: 2.5rem;
        border-radius: 1.25rem;
        line-height: 2.4rem;
        color: #fff;
        background-color: #f15353;
      }
    }
  }

  .confirm-popup {
    padding: 1.3rem 1.5rem 0.5rem 1.5rem;

    .pop-title {
      font-size: 1.13rem;
      color: #202020;
    }

    .pop-content {
      margin: 1.5rem 0;
      text-align: left;
    }

    .bottom-btns {
      height: 2.5rem;
      display: flex;
      color: #030303;
      border-top: solid 1px #eee;

      div {
        flex: 1;
        font-size: 1.06rem;
        line-height: 2.5rem;
      }

      .confirm {
        color: #f14e4e;
      }
    }
  }

  .mobile-verification {
    height: calc(100vh - 40px);
    background: #fff;

    .btn-submit {
      margin: 0 auto;
      margin-top: 4rem;
      width: 19.13rem;
      height: 2.5rem;
      background-color: #f15353;
      border-radius: 1.25rem;
      font-size: 0.94rem;
      line-height: 2.5rem;
      color: #fff;
    }

    .icon-verification_phone,
    .icon-fontclass-yanzhengma {
      font-size: 1.5rem;
      color: #888;
    }

    .van-field__left-icon {
      display: inline-flex !important;
    }
  }
</style>
