<template>
  <div class="reimburse">
    <c-title :hide="false" text="退款"></c-title>
    <div class="imagebox" v-if="introduction.refundbanner">
      <img class="image" :src="introduction.refundbanner">
    </div>
    <van-form v-if="notsubmitted" @submit="onSubmit">
      <div class="content">
        <van-field v-model="applyModel.realname" class="input" required label-width="7.688rem" label="原订单收件人姓名:"
                   placeholder="请输入姓名"/>
        <van-field v-model="applyModel.mobile" class="input" required label-width="8.719rem" label="原订单收件人手机号:"
                   placeholder="请输入手机号"/>
        <van-cell size="14rem" required value="上传凭证"/>

        <div class="imgflex">
          <van-uploader :after-read="onRead1">
            <div
              style="padding: 0.2rem; width: 10rem; height: 6rem; margin: 0 auto; display: flex;">
              <img :src="applyModel.images && applyModel.images[0]?applyModel.images[0]:require('../../../assets/images/picUpCard_upImg.png')"
                   style="width: 100%; height: 100%;"
                   class="avatar">
            </div>
          </van-uploader>
          <van-uploader :after-read="onRead2">
            <div
              style="padding: 0.2rem; width: 10rem; height: 6rem; margin: 0 auto; display: flex;">
              <img :src="applyModel.images && applyModel.images[1]?applyModel.images[1]:require('../../../assets/images/picUpCard_upImg.png')"
                   style="width: 100%; height: 100%;"
                   class="avatar">
            </div>
          </van-uploader>
          <van-uploader :after-read="onRead3">
            <div
              style="padding: 0.2rem; width: 10rem; height: 6rem; margin: 0 auto; display: flex;">
              <img :src="applyModel.images && applyModel.images[2]?applyModel.images[2]:require('../../../assets/images/picUpCard_upImg.png')"
                   style="width: 100%; height: 100%;"
                   class="avatar">
            </div>
          </van-uploader>
        </div>

        <!--<van-image-preview v-model="showImages" :images="applyModel.images">-->
        <!--</van-image-preview>-->

        <div style="display: flex; margin-top: 1rem;">
          <van-checkbox v-model="instroductionSelect" class="checkbox text" checked-color="#f15353"
                        shape="square"></van-checkbox>
          <p @click="showIntroduction">退款说明</p>
        </div>
      </div>
      <button @click="setApplyData" class="submit">提交退款申请</button>
    </van-form>

    <van-popup v-model="introductionShow" round closeable>
      <p class="popup-title">退款说明</p>
      <div class="popup-box" v-html="introduction.refund_explain"></div>
    </van-popup>

    <div v-if="!notsubmitted">
      <div class="submitted">
        <van-icon name="checked" color="#f15353" size="2.656rem"/>
      </div>
      <div class="text">退款申请提交成功，等待审核</div>
    </div>

  </div>
</template>
<script>
import pickUpCardReimburseController from "./pick_up_card_reimburse_controller";

export default pickUpCardReimburseController;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .reimburse {
    background-color: #fff;
    text-align: left;
    min-height: 100vh;

    .title {
      display: flex;
      line-height: 2.75rem;
      letter-spacing: 0;
      padding-left: 0.906rem;

      .van-icon {
        flex: 1;
        display: flex;
      }

      .van-icon::before {
        top: 0.969rem;
        padding-top: 0.969rem;
      }

      span {
        flex: 1;
        margin-left: -3rem;
      }
    }

    .content {
      padding-left: 0.531rem;
      line-height: 1.5rem;

      .van-cell__value {
        .van-field__control {
          display: flex;
          flex-wrap: wrap;

          .van-uploader {
            flex: 0 0 50%;
            background-color: #fff;
          }
        }
      }

      .introduction {
        padding-left: 0;
        font-size: 0.938rem;

        .text {
          padding: 0.4rem;
          padding-bottom: 3.281rem;
        }
      }
    }

    .submit {
      margin: 1rem 2rem;
      width: 19.125rem;
      height: 2.5rem;
      background-color: #f15353;
      border: none;
      color: #fff;
      border-radius: 0.469rem;
    }

    .imagebox {
      text-align: center;
      padding: 0.531rem;

      img {
        width: 21.563rem;
        border-radius: 0.625rem;
      }
    }

    .submitted {
      display: flex;
      justify-content: center;
      padding-top: 6.125rem;
      padding-bottom: 1.063rem;
    }

    .text {
      text-align: center;
      font-size: 0.938rem;
      color: #333;
    }

    .checkbox {
      display: flex;
      margin-right: 0.3rem;
      padding-left: 1rem;
    }
  }

  .popup-title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding: 0.5rem;
  }

  .popup-box {
    width: 18rem;
    height: 18rem;
    margin: 0 auto;
    padding: 0.5rem;
    overflow-y: scroll;
  }

  .imgflex {
    display: flex;
    flex-wrap: wrap;
    margin: 1rem 0.5rem;
  }
</style>
