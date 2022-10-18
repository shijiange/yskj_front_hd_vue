<template>
  <div id="secret_key">
    <c-title :hide="false" :text="name === 'blockchain'?'我的区块链地址':'我的秘钥'"></c-title>
    <div id="content">
      <div class="key_box">
        <!--<span>您已接受【商城名称】托管</span>-->
        <p>{{code}}</p>
        <van-button type="default" v-clipboard:copy="code" v-clipboard:success="onCopy" v-clipboard:error="onError">
          复制我的{{this.name === 'blockchain'?'区块链地址':'秘钥'}}
        </van-button>
      </div>
      <!--<p class="explain">-->
        <!--私钥说明-->
        <!--私钥说明私钥说明私钥说明私钥说明私钥说明私钥说明私钥说明-->
        <!--私钥说明私钥说明私钥说明私钥说明私钥说明私钥说明私钥说明私钥说明私钥说明私-->
        <!--钥说明私钥说明私钥说明-->
        <!--私钥说明私钥说明私钥说明私钥说明私钥说明私钥说明私钥说明私钥说明-->
        <!--私钥说明私钥说明私钥说明私钥说明私钥说明私钥说明-->
      <!--</p>-->
    </div>
  </div>
</template>

<script>
import secret_key_controller from "./secret_key_controller";

export default secret_key_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #secret_key {
    background: #fff;

    #content {
      padding-top: 1.25rem;
      min-height: 37.5rem;

      .key_box {
        margin: 0 auto;
        width: 21.5625rem;
        border-radius: 0.375rem;
        border: solid 0.0625rem #ebebeb;
        padding: 0.625rem 1.25rem 0 1.25rem;

        span {
          line-height: 2.5rem;
          display: block;
          font-size: 14px;
        }

        p {
          margin-top: 0.625rem;
          text-align: center;
          word-break: break-all;
          font-size: 14px;
        }

        button {
          padding: 0 1rem;
          margin: 1.25rem auto;
          border: solid 0.0625rem #ebebeb;
          color: #333;
          height: 1.875rem;
          line-height: 1.875rem;
          border-radius: 0.25rem;
          background: #fff;
          font-size: 14px;
        }
      }

      .explain {
        width: 345px;
        margin: 20px auto;
        color: #8c8c8c;
        text-align: left;
      }
    }
  }
</style>
