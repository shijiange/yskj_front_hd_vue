<template>
  <div class="page">
    <c-title text="活码修改"></c-title>

    <div class="wrapper">

      <div class="item">
        <span class="name">活码名称</span>
        <input class="input"
               v-model="form.code_name"
               type="text"
               placeholder="输入活码名称">
      </div>

      <div class="item">
        <span class="name">引导语</span>
        <input class="input"
               v-model="form.code_guide"
               type="text"
               placeholder="输入引导语">
      </div>

      <div class="item"
           style="height: 4.063rem;">
        <span class="name">客服二维码</span>
        <div @click="selectIndex(1)">
          <van-uploader :after-read="onRead">
            <div style="padding: 0.2rem; width: 3.375rem; height: 3.375rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex;">
              <img :src="temp_customer_service?temp_customer_service:require('../../../assets/images/up_icon.png')"
                   :style="{width:(temp_customer_service?'100%':'50%'),height:(temp_customer_service?'100%':'50%')}"
                   class="avatar">
            </div>
          </van-uploader>
        </div>

      </div>

      <div class="item">
        <span class="name">客服引导语</span>
        <input class="input"
               v-model="form.customer_service_guide"
               type="text"
               placeholder="输入客服引导语">
      </div>

      <div class="item"
           v-if="auth_recommend">
        <span class="name">推荐</span>
        <van-switch size="1.5rem"
                    active-color="#00b075"
                    v-model="form.recommend" />
      </div>

      <div class="item"
           :style="{height:form.explain?'7.688rem':''}">
        <span class="name">说明</span>
        <van-switch size="1.5rem"
                    v-model="form.explain"
                    active-color="#00b075" />
        <textarea placeholder="输入活动说明"
                  v-if="form.explain"
                  class="textarea"
                  v-model="form.explain_content"></textarea>
      </div>

      <div class="images">
        <div @click="selectIndex(2)">
          <van-uploader :after-read="onRead">
            <div style="padding: 0.2rem; width: 5.156rem; height: 5.156rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex; flex-direction: column;">
              <div>
                <img :src="imageUrl?imageUrl:require('../../../assets/images/up_icon.png')"
                     :style="{width:(imageUrl?'100%':'2.25rem'),height:(imageUrl?'100%':'2.25rem'),marginTop:'0.575rem'}"
                     class="avatar">
              </div>
              <p style="font-size: 0.75rem; color: #666; margin-top: 0.325rem;">添加群二维码</p>
            </div>
          </van-uploader>
        </div>

        <div class="imgItem"
             v-for="(item,key) in qrCodeArr"
             :key="key">
          <div class="qrcode">
            <img :src="item.temp_img"
                 alt="">
            <i @click="delRQCode(key)"
               class="iconfont icon-guanbi delImg"></i>
            <div class="overdue"
                 v-if="item.expireFlag">已过期</div>
          </div>
          <div class="entry">
            <input type="text"
                   v-model="item.num"
                   placeholder="扫码上限">
            <span>人</span>
          </div>
        </div>

      </div>

      <!-- 占位，底部按钮 -->
      <div style="height: 3.063rem; width: 100%;"></div>

    </div>

    <div class="btn"
         @click="send">
      保存
    </div>

  </div>
</template>

<script>
import groupCodeEditController from './group_code_edit_controller.js';

export default groupCodeEditController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .page { background: #fff; min-height: 100vh; }

    .wrapper {
      padding-left: 0.781rem;

      .item {
        padding-right: 1.313rem;
        height: 3.031rem;
        border-bottom: 0.031rem solid #f0f0f0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;

        .name {
          font-size: 1rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0.05rem;
          color: #000;
        }

        .input {
          color: #757575;
          font-size: 1rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          border: none;
          text-align: right;
          letter-spacing: 0.05rem;

          &::-webkit-input-placeholder {
            color: #757575;
          }
        }

        .textarea {
          border: none;
          font-size: 0.875rem;
          width: 20.781rem;
          line-height: 1.5rem;
          letter-spacing: 0.044rem;
          color: #878787;
        }
      }

      .images {
        margin-top: 0.813rem;
        padding-right: 1.313rem;
        display: grid;
        grid-template-columns: repeat(3, 5.157rem);
        grid-column-gap: 2.469rem;
        grid-row-gap: 1.6rem;

        .imgItem {
          .qrcode {
            width: 5.156rem;
            height: 5.156rem;
            border: 1px dashed #c0ccda;
            position: relative;
            padding: 0.2rem;

            img {
              width: 100%;
              height: 100%;
            }

            .delImg {
              position: absolute;
              border-radius: 50%;
              font-size: 0.5rem;
              width: 1rem;
              height: 1rem;
              right: -0.5rem;
              top: -0.5rem;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #999;
              background-color: #ececec;
            }

            .overdue {
              position: absolute;
              top: 0.2rem;
              left: 0.2rem;
              right: 0.2rem;
              bottom: 0.2rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.75rem;
              color: #fff;
              background-color: rgba(0, 0, 0, 0.5);
            }
          }
        }

        .entry {
          margin-top: 0.406rem;
          display: flex;
          align-items: center;

          input {
            text-align: center;
            width: 4.156rem;
            height: 1.25rem;
            font-size: 0.75rem;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0;
            color: #999;
            border: solid 0.031rem #efefef;
          }

          span {
            margin-left: 0.25rem;
            font-size: 0.75rem;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0;
            color: #666;
          }
        }
      }
    }

    .btn {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3.063rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: normal;
      font-stretch: normal;
      line-height: 1.5rem;
      letter-spacing: 0.05rem;
      color: #fff;
      background-color: #00b075;
      transition: 0.5s;

      &:active {
        background-color: #00b060;
      }
    }

</style>
