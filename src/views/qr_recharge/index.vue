<template>
  <div id="login">
    <c-title :hide="false" text="充值码"></c-title>
    <div style="margin-bottom: 0.625rem;"></div>
    <van-cell-group>
      <van-cell center>
        <span  style="width: 88px; text-align: left; font-size: 16px;">充值码：</span>
        <input type="text"  placeholder="请输入充值码" v-model.trim="code" style="font-size: 16px; border: none;" />
        <van-button style="height: 26px;" slot="right-icon" size="small" @click.native="verifyCode" type="primary"
          >验证</van-button
        >
      </van-cell>
    </van-cell-group>

    <div v-if="isShowType">充值类型:{{ type_name }}</div>
    <div v-if="isShowType">充值面值:{{ price }}</div>
    <div class="van-button-group">
      <van-button size="large" style="height: 40px;" @click.native="submit" type="danger" :disabled="isDisabled"
        >确定充值</van-button
      >
    </div>
  </div>
</template>

<script>
import index_controller from './index_controller';
export default index_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.van-button-group {
  padding-top: 15px;
  padding-left: 12px;
  padding-right: 12px;
}

#login {
  width: 100%;

  h1 {
    color: #42b983;
  }

  .mint-button--large {
    margin-top: 0.625rem;
  }

  #bts {
    margin: auto 0.3125rem;
  }

  .forget {
    line-height: 2.5rem;
    float: right;

    a {
      color: #999;
    }
  }

  .vip_main {
    background: #fff;
    margin-top: 3.125rem;

    .title {
      padding: 0.625rem;
      font-size: 12px;
      border-bottom: 0.0625rem solid #ebebeb;
      text-align: center;
    }

    .weixin {
      padding: 0.9375rem 0.625rem;
      overflow: hidden;
      font-size: 12px;
      color: #999;

      .ico1,
      .ico2 {
        width: 15%;
        float: left;
      }

      .ico1 {
        i {
          background: #32cd32;
        }
      }

      .ico2 {
        i {
          background: #fece00;
        }
      }

      .text {
        float: left;
        width: 85%;

        .t1 {
          font-size: 14px;
          color: #333;
          margin-bottom: 0.3125rem;
          text-align: left;
        }

        .t2 {
          text-align: justify;
        }
      }

      i {
        background: #32cd32;
        height: 2.25rem;
        width: 2.25rem;
        border-radius: 1.125rem;
        color: #fff;
        text-align: center;
        line-height: 2.375rem;
        font-size: 18px;
      }
    }

    .vip1 {
      border-bottom: 0.0625rem solid #ebebeb;
    }
  }

  .btn {
    height: 2.875rem;
  }
}
</style>
