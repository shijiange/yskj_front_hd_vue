<template>
  <div id="pay_list" ref="pay_list">
    <c-title :hide="false"
             text="付费列表"
    ></c-title>
    <!-- 优化 -->
    <div class="content">
      <div class="list">
        <div class="image">
          <img :src="dataInfo.thumb" v-if="dataInfo.thumb">
          <img src="../../assets/images/img_default.png" v-if="!dataInfo.thumb">
        </div>
        <div class="right">
          <div class="title">{{dataInfo.title}}</div>
          <div class="cash">
            <span class="fu">{{$i18n.t("money")}}</span><span>{{dataInfo.money}}</span>
          </div>
          <div class="author">
            <span>{{dataInfo.author}}</span>
            <span>{{timestampToTime(dataInfo.virtual_created_at)}}</span>
          </div>
        </div>
      </div>

    </div>
    <div class="btn" :class="[fun.getPhoneEnv() == 3 ? 'pc' : '']">
      <div class="money">
        <span class="fu">{{$i18n.t("money")}}</span><span>{{dataInfo.money}}</span>
      </div>
      <div class="right-btn" @click="confirm">
        付费阅读
      </div>
    </div>
    <van-popup v-model="rewardPayshow"
               position="bottom"
               :overlay="true">
      <div class="rewardPay">
        <div class="payMode">
          <ul>
            <li @click="payBtn(item.value, item.name)"
                v-for="(item, index) in btnData"
                :key='index'>
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="cancel"
             @click="rewardPayCancelBtn">取消
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import pay_list_controller from "./pay_list_controller";

export default pay_list_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #pay_list {
    position: relative;
    background-color: #fff;
    height: 100vh;

    .content {
      padding: 0 0.75rem;
      background-color: #fff;
      padding-bottom: 4.5625rem;
      padding-top: 1.5rem;

      .list {
        margin-bottom: 1rem;
        display: flex;

        .image {
          width: 7.125rem;
          height: 5.5625rem;
          box-sizing: border-box;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 1rem;
          justify-content: space-between;

          .title {
            color: #333;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .cash {
            color: #ff2c28;
            margin-top: 1rem;
            text-align: left;

            .fu {
              font-size: 12px;
            }
          }

          .author {
            margin-top: 0.5rem;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666;
            text-align: left;
            align-items: center;
          }
        }
      }

      .list:last-child {
        margin-bottom: 0;
      }
    }

    .btn {
      height: 3.0625rem;
      background-color: #fff;
      box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.11);
      width: 100%;
      position: fixed;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.4375rem;

      .money {
        color: #ff2c28;
        text-align: left;

        .fu {
          font-size: 12px;
        }
      }

      .right-btn {
        width: 7.875rem;
        height: 2.125rem;
        background-color: #ff2c29;
        border-radius: 1.0625rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #fff;
      }
    }

    .rewardPay {
      background-color: #f2f2f2;

      .content {
        background-color: #fff;

        span {
          color: #1c96fe;
        }

        text-align: left;
        padding: 0.6rem;
        min-height: 3.44rem;
        font-size: 0.8rem;
        line-height: 1rem;
        width: 100%;
        white-space: normal;
        word-break: break-all;
        word-wrap: break-word;
      }

      .payMode {
        ul {
          li {
            background-color: #fff;
            height: 3.44rem;
            border-bottom: 0.06rem solid #eee;
            font-size: 1rem;
            color: #333;
            line-height: 3.44rem;
          }

          li:last-of-type {
            border-bottom: none;
            margin-bottom: 0.69rem;
          }
        }
      }

      .cancel {
        background-color: #fff;
        height: 3.44rem;
        border-bottom: 0.06rem solid #eee;
        font-size: 1rem;
        color: #333;
        line-height: 3.44rem;
      }
    }
  }

  .pc {
    width: 375px !important;
  }

</style>
