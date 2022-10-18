<template>
  <div id="microshop_apply">
    <div class="m_header">
      <span class="iconfont icon-left" @click="goBack"></span>
      <span class="title">注册协议</span>
    </div>

    <ul class="levelList">
      <div v-html="signature"></div>
    </ul>
  </div>
</template>
<script>
import micro_shop_apply_reg_info_controller from "./micro_shop_apply_reg_info_controller";
export default micro_shop_apply_reg_info_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.applySucHide {
  display: none;
}

#microshop_apply {
  .shopKeeperInfo {
    color: #aeaeae;
    font-size: 12px;

    span {
      display: inline-block;
      width: 1.125rem;
      height: 1.125rem;
      font-size: 18px;
      line-height: 1.1875rem;
      font-weight: 400;
      color: white;
      background: #fcc15d;
      margin: 0.1875rem 0.3125rem 0.5rem;
      border-radius: 50%;
      position: relative;
      top: 0.125rem;
    }
  }

  .active {
    border-color: #f15959 !important;
  }

  .m_header {
    width: 100%;
    height: 2.8125rem;
    line-height: 2.8125rem;
    background: #fff;
    position: relative;
    border-bottom: 0.0625rem solid #ccc;

    span {
      display: inline-block;
      width: 1rem;
      height: 1.5rem;
      float: left;
      font-weight: normal;
      margin-left: 0.625rem;
      font-size: 1.875rem;
    }

    .el-button {
      width: 20%;
      float: right;
      font-size: 12px;
      font-weight: normal;
      color: #888;
      line-height: 2.8125rem;
      padding: 0;
    }

    span.title {
      width: 60%;
      font-size: 15px;
      font-weight: bold;
      box-sizing: border-box;
      padding-left: 18%;
    }
  }

  .banner {
    width: 100%;
    height: 9.375rem;
    background: #fff;

    img {
      height: 100%;
    }
  }

  h3 {
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    padding: 0.9375rem;
    margin-top: 0.625rem;
  }

  .levelList::after {
    content: "";
    display: block;
    clear: both;
  }

  .levelList {
    padding: 0.9375rem;

    li:nth-child(3n) {
      margin-right: 0;
    }

    li {
      width: 30%;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 1.2rem;
      float: left;
      margin-right: 5%;
      margin-bottom: 0.625rem;
      position: relative;

      span {
        color: gray;
        height: 1.125rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: break-all;
        font-size: 14px;
      }

      .haveLevel {
        color: gray;

        b {
          color: gray;
        }

        span {
          font-size: 14px;
          color: gray;
          height: 1.125rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          word-break: break-all;
        }

        div {
          background: gray;
          opacity: 0.5;
        }
      }

      div {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        border: 1px solid #e3e5e6;
      }

      b {
        color: #fcc15d;
        font-size: 14px;
        font-weight: 600;
      }

      span {
        color: #a9a9aa;
        font-size: 14px;
      }
    }

    li:last-child {
      margin: 0;
    }
  }

  .btn {
    width: 70%;
    padding: 0.625rem;
    font-size: 14px;
    color: #fff;
    background: #f15353;
    border-radius: 0.625rem;
    margin: 0 auto;
    margin-top: 1.875rem;
  }

  .success {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 6;
    height: 100%;
    background-image: url(../../../assets/images/applySuccessBg.png);
    background-size: cover;
    background-position: 0 -1.25rem;
    padding: 3.125rem 0.9375rem;
    box-sizing: border-box;

    .close {
      position: absolute;
      width: 1.875rem;
      height: 1.875rem;
      top: 1.875rem;
      right: 0.9375rem;
      border-radius: 50%;

      i {
        width: 1.875rem;
        height: 1.875rem;
        color: #f25654;
        font-size: 30px;
      }
    }

    .top {
      text-align: left;

      .touxiang {
        width: 4.0625rem;
        height: 4.0625rem;
        float: left;
        margin-left: 0.9375rem;
        border-radius: 50%;

        img {
          width: 4.0625rem;
          height: 4.0625rem;
        }
      }

      .name {
        padding: 0.9375rem;
        line-height: 1.5rem;
        font-size: 16px;
        float: left;
        color: #90886e;
        margin-left: 0.3125rem;

        span {
          font-weight: bold;
          font-size: 18px;
          color: #676047;
        }
      }
    }

    .top::after {
      content: "";
      display: block;
      clear: both;
    }

    .content {
      color: #f3635a;
      font-size: 24px;
      line-height: 12.5rem;
      font-weight: bold;
    }

    p {
      color: #999179;
      font-size: 16px;
      line-height: 1.375rem;
      padding: 1.25rem;
      margin-top: 1.25rem;
    }

    .btn {
      margin-top: 1.25rem;
      color: #fff;
      font-size: 18px;
    }
  }
}
</style>
