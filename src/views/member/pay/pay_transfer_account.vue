<template>
  <div id="transfer-accounts">
    <c-title :hide="false" text="转账"></c-title>
    <div class="pay-info">
      <ul>
        <h1>上传付款凭证</h1>
        <li>订单：{{ pay_info }}</li>
        <li>金额：{{ amount_info }}{{$i18n.t("元")}}</li>
        <div class="accounts-box">
          <div>
            <van-uploader
              :after-read="onRead"
            >
              <div
                style="padding: 1rem; width: 10rem; height: 10rem; border: 1px dashed #333; margin: 0 auto;"
              >
                <img :src="imageUrl
                      ? imageUrl
                      : require('../../../assets/images/up_icon.png')"
                     style="width: 100%;"
                     class="avatar"
                />
              </div>
            </van-uploader>
          </div>
        </div>
        <li>如是在没有凭证请联系发货方对账后再点击确认</li>
      </ul>
    </div>
    <div class="btn">

      <van-row>
        <van-button
          type="primary"
          style="width: 80%; margin-bottom: 0.4rem;"
          @click="confirmEvent"
        >确认已经汇款
        </van-button
        >
      </van-row>

    </div>

    <div>

      <van-row>
        <van-button type="danger" style="width: 80%;" @click="onLine"
        >在线付款
        </van-button
        >

      </van-row>

    </div>
    <section id="prompt-box">
      <div id="prompt-info">


        <h2>注意事项：汇款时请注意以下信息，请牢记！</h2>

        <ul>
          <li v-for="(item, index) in bank_info"
              :key='index'>
            {{ item.title }}: {{ item.text }}
          </li>
        </ul>

        <h2>注意事项：汇款时请注意以下信息，请牢记！</h2>
        <ul class="prompt-a">
          <li>
            1.线下公司转账订单，一个识别码对应一个订单和相应的金额，请勿多转账或者少转账。
          </li>
          <li>
            2.请在7天内付清款项，超过10天未对账系统自动会取消订单，到账周期为3个工作起。
          </li>
        </ul>
        <!-- <button type="button" @click="confirmTip">确认</button> -->
      </div>
    </section>


  </div>
</template>

<script>
import pay_transfer_account_controller from "./pay_transfer_account_controller";

export default pay_transfer_account_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  // setting sun
  .avatar {
    width: 100%;
    height: 100%;
  }

  .el-button--success {
    width: 80%;
    height: 2.875rem;
    margin-bottom: 0.75rem;
  }

  .el-button--danger {
    width: 80%;
    height: 2.875rem;
  }

  #transfer-accounts {
    padding-bottom: 20px;
    background-color: #fff;
    color: #333;

    .pay-info {
      h1 {
        font-size: 20px;
        line-height: 2.5rem;
        margin: 1.25rem 0;
      }

      .accounts-box {
        border: dashed 0.0625rem #ebebeb;
        background-color: #fafafa;
        display: flex;
        justify-content: center;
        margin: 0.625rem auto;
        // i{
        //     line-height: 7.5rem;
        // }
      }

      ul {
        li {
          line-height: 1.5rem;
          font-size: 16px;
        }

        li:last-child {
          font-size: 12px;
          color: #8c8c8c;
        }
      }
    }

    .btn {
      margin-top: 1rem;
      font-size: 16px;
      // button{
      //     padding:0;
      //     border:none;
      //     font-size:16px;
      //     width:80%;
      //     color:#fff;
      //     height:2.875rem;
      //     border-radius: 0.25rem;
      //     margin-bottom:0.75rem;
      // }
      // button:first-child{
      //     background-color:#09bb07;
      // }
      // button:last-child{
      //     background-color:#f15353;
      // }
    }

    #prompt-box {
      margin-top: 1.25rem;
    }

    #prompt-info {
      z-index: 20;
      height: 100%;
      // padding-top:2.5rem;
      padding-bottom: 0.625rem;
      background-color: #fafafa;
      margin: 0 0.625rem;
      border-radius: 0.25rem;

      .info-title {
        width: 100%;
        position: fixed;
        top: 0;
        padding: 0 0.875rem;
        display: flex;
        height: 2.5rem;
        line-height: 2.5rem;
        border-bottom: solid 0.0625rem #ebebeb;
        justify-content: center;
        background-color: #fff;

        .icon {
          width: 2.5rem;
          height: 2.5rem;
          position: absolute;
          right: 0;
          line-height: 2.5rem;
        }
      }

      h1 {
        font-size: 16px;
        text-align: center;
      }

      h2 {
        line-height: 2.5rem;
        padding: 0 0.875rem;
        font-size: 14px;
        text-align: left;
        color: #333;
      }

      .prompt-a li {
        text-indent: -0.625rem;
        margin-left: 0.625rem;
      }

      ul {
        margin: 0 0.875rem;

        li {
          padding: 0 0.625rem;
          line-height: 1.5rem;
          font-size: 14px;
          color: #8c8c8c;
          text-align: left;
          text-indent: 0.625rem;
        }
      }

      button {
        width: 21.6875rem;
        margin: 0 0.875rem;
        border: none;
        background-color: #f15353;
        height: 2.875rem;
        border-radius: 0.25rem;
        color: #fff;
        font-size: 16px;
        margin-top: 1.25rem;
      }
    }
  }
</style>
