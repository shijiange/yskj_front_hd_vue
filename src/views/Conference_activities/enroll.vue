<template >
  <div id="enroll-once" v-show="showPage">
    <c-title :hide="false" text="立即报名"></c-title>
    <div class="enroll-content">
      <div class="top">
        <div class="left-image">
          <img :src="activity.thumb">
        </div>
        <div class="right-info">
          <p class="title">{{activity.title}}</p>
          <p class="address">{{city.substr(0,2)}}|{{activity.address}}</p>
          <p class="money"><span class="price"
                  v-if="activity.cash>0.00"><b>{{$i18n.t('money')}}</b>{{activity.cash}}</span><span class="cash"
                  v-if="activity.cash<=0.00">免费活动</span><span>已报名<b>{{count}}</b>/{{activity.limit}}</span></p>
        </div>
        <div class="time"><i class="iconfont icon-record_time"></i><span>{{timestampToTime(activity.start_time)}}</span><span>至{{timestampToTime(activity.end_time)}}</span></div>
      </div>
      <div class="deduct">
        <div>
          <div v-for="(item,index) in order_deductions"
               class="model"
               :key="index">
            <span>可用{{item.coin}}{{item.name}}抵扣{{item.amount}}元</span>
            <van-switch v-model="item.checked" @change="switchChange(item.code,item.checked)" size="28px" active-color="#f15353" inactive-color="#fff" />
          </div>
        </div>
        <div class="total"><span>合计</span><span class="right">{{$i18n.t('money')}}{{total_price}}</span></div>
      </div>
      <!-- <diyform :datas="datas"
               :form_data_id="!fun.isTextEmpty(activity.form_data_id)?activity.form_data_id.form_data_id:''"
               :type="type"
               :payStatus="payStatus"
               :applyStatus="applyStatus"
               :activityId="activity.id"
               :count="count"
               :orderId="orderId"
               :limit="activity.limit"
               :cash="activity.cash"
               :info="info"></diyform> -->
      <diyfroms
        v-if="info"
        modeType="activity"
        :form_id="datas.data.form_id"
        :form_data_id="!fun.isTextEmpty(activity.form_data_id)?activity.form_data_id.form_data_id:''"
        :desThumb="false"
        :payStatus="payStatus"
        :applyStatus="applyStatus"
        :activityId="activity.id"
        :type="type"
        :info="info"
      ></diyfroms>
    </div>
  </div>
</template>
<script>
import enroll_controller from "./enroll_controller";
export default enroll_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/index.scss"; //弹窗样式
#enroll-once {
  .enroll-content {
    .top {
      padding: 0.5rem 0.8rem;
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;

      .left-image {
        width: 8rem;
        height: 5rem;
        display: flex;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .right-info {
        margin-left: 0.5rem;
        display: flex;
        align-items: baseline;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;

        .title {
          margin-bottom: 5px;
          display: -webkit-box;
          overflow: hidden;
          white-space: normal;
          text-overflow: ellipsis;
          word-wrap: break-word;
          -webkit-line-clamp: 2;

          /* autoprefixer: off */
          -webkit-box-orient: vertical;
          text-align: left;
        }

        .address {
          width: 100%;
          margin-bottom: 5px;
          text-align: right;
          color: #999;
        }

        .money {
          display: flex;
          justify-content: space-between;
          width: 100%;

          .cash {
            color: #f15353;
            font-size: 16px;
          }

          .price {
            text-align: left;
            color: #f15353;
            font-size: 16px;

            b {
              font-size: 12px;
            }
          }

          span {
            b {
              color: #f15353;
            }
          }
        }
      }

      .time {
        margin-top: 5px;
        color: #999;
        display: flex;
        align-items: center;
      }
    }

    .count {
      margin-top: 1rem;

      .count-top {
        padding: 1rem 0;
        padding-left: 0.8rem;
        padding-right: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;

        .limit {
          color: #999;
          font-size: 12px;
        }

        .count-num {
          display: flex;

          span {
            width: 2rem;
            height: 2rem;
            display: flex;
            background-color: #f7f8fa;
            align-items: center;
            justify-content: center;
            border: solid 1px #ccc;
          }

          input {
            outline: none;
            width: 2rem;
            height: 2rem;
            background-color: #f7f8fa;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;
            border: solid 1px #ccc;
            border-left: none;
            border-right: none;
          }
        }
      }

      .count-bottom {
        background-color: #fff;
        padding: 0.8rem;
        border-top: dashed 1px #ccc;
        display: flex;
        justify-content: space-between;

        .price {
          color: #eb5648;
          font-size: 16px;
        }
      }
    }

    .input {
      margin-top: 1rem;
      background-color: #fff;
      padding-bottom: 0.8rem;

      b {
        color: rgba(232, 78, 64, 1);
        margin-right: 2px;
      }

      .yd-cell-item {
        padding-left: 0.8rem;
        border-bottom: solid 1px #ccc;
      }
      // .upload {
      //   padding-left: 0.8rem;
      //   text-align: left;
      //   .van-uploader {
      //     display: block;
      //     margin-top: 0.8rem;
      //   }
      // }
      .my_img {
        padding-left: 0.8rem;
        background: #fff;

        .title {
          text-align: left;
        }

        .img_uploader {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-top: 10px;

          .photoBox {
            position: relative;
            width: 4.5rem;
            height: 4.5rem;
            border: 1px dashed #c0ccda;
            margin-right: 0.2rem;
            margin-left: 0.2rem;
            margin-bottom: 0.2rem;

            img {
              width: 100%;
              height: 100%;
            }

            i {
              width: 1.2rem;
              height: 1.2rem;
              position: absolute;
              top: 0.1rem;
              right: 0.1rem;
              background: url("../../assets/images/close_iocn.png");
              background-size: 100%;
            }
          }

          .van-uploader {
            width: 4.5rem;
            height: 4.5rem;
            overflow: hidden;
            background: #f2f2f2;
            margin-left: 0.2rem;
            margin-right: 0.875rem;
            margin-bottom: 0.9375rem;

            .van-icon {
              font-size: 24px;
              line-height: 4.5rem;
              color: #666;
            }
          }
        }
      }
    }

    .button {
      width: 80%;
      background-color: rgba(232, 78, 64, 1);
      padding: 1rem 0;
      text-align: center;
      margin: 0 auto;
      margin-top: 1rem;
      margin-bottom: 2rem;

      span {
        color: #fff;
      }
    }

    .pay-method {
      padding: 1rem 0;
      padding-bottom: 0;

      .title {
        padding-left: 0.8rem;
        text-align: left;

        b {
          color: rgba(232, 78, 64, 1);
          margin-right: 2px;
          opacity: 0;
        }
      }

      ul {
        li:first-child {
          margin-top: 1rem;
        }

        li {
          width: 21.5625rem;
          padding: 0 0.625rem;
          display: -ms-flexbox;
          display: flex;
          font-size: 16px;
          justify-content: flex-start;
          align-items: center;
          height: 2.625rem;
          border-radius: 0.375rem;
          background: #fff;
          border: solid 0.0625rem #dedede;
          margin: 0 auto;
          margin-bottom: 1rem;

          .icon_bg {
            width: 2.25rem;
            height: 1.5rem;
            border-radius: 0.1875rem;
            line-height: 1.5rem;
            margin-right: 0.625rem;

            i {
              color: #fff;
              font-size: 1.5rem;
            }
          }
        }
      }
    }

    .deduct {
      padding: 1rem;
      background-color: #fff;
      margin-top: 1rem;
      margin-bottom: 1rem;

      .model {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .right {
        color: #f15353;
      }
    }
  }
}
</style>
