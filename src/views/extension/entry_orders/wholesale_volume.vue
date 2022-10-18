<template>
  <div>
    <c-title :hide="false"
             :text="integral ? integral : '我的批发券'"
             tolink="CouponExrecord"
             :totext="integral ? integral : '获得记录'">
    </c-title>
    <div class="contaier">
      <div class="header">
        <div class="left_box">
          <div class="box_juan">批发券</div>
          <div class="box_num">{{total}}</div>
        </div>
        <div class="right_box"
             @click="gotoCoupon_exchange()">
          <i class=" iconfont icon-jifen"></i>
          <span>积分兑换</span>
        </div>
      </div>
      <div class="info_box">
        <div class="title">
          <span>批发券</span>
        </div>
        <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
          <ul>
            <li v-for="item in info"
                :key="item.id">
              <div class="box_title">
                <span>ID：{{item.id}}</span>
                <span>{{item.used_status}}</span>
              </div>
              <div class="cont_box">
                <div>总次</div>
                <div>{{item.usage_count}}</div>
              </div>
              <div class="cont_box">
                <div>已使用</div>
                <div>{{item.used_count}}</div>
              </div>
              <div class="bot_bottom">
                <div class="time">获得时间：{{item.created_at}}</div>
                <div class="right_icon"
                     @click="gotoVolume_detail(item.id)">
                  <span>明细</span>
                  <i class="fa fa-angle-right"></i>
                </div>
              </div>
            </li>
            <p style="margin: 1.5rem 0; color: #9e9e9e;"
               v-if="isNoMore">没有更多</p>
            <img src="../../../assets/images/blank.png"
                 alt=""
                 v-if="isNO"
                 style="width: 5rem; margin-top: 5rem;">
          </ul>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
import wholesaleVolume_controller from "./wholesaleVolume_controller";

export default wholesaleVolume_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.contaier {
  .header {
    width: 23.44rem;
    height: 5.13rem;
    background-color: #f15353;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left_box {
      margin-left: 0.91rem;

      .box_juan {
        font-size: 15px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0;
        color: #fff;
      }

      .box_num {
        margin-top: 0.625rem;
        font-size: 16px;
        line-height: 16px;
        font-weight: bold;
        font-stretch: normal;
        letter-spacing: 0;
        color: #fff;
        text-align: left;
      }
    }

    .right_box {
      width: 5.63rem;
      height: 1.75rem;
      line-height: 1.5rem;
      background-color: #fff;
      border-radius: 0.88rem;
      border: solid 0.06rem #c61b1b;
      margin-right: 0.94rem;

      i {
        width: 0.75rem;
        height: 0.75rem;
        color: #f15353;
      }

      span {
        width: 3rem;
        height: 0.75rem;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0;
        color: #f15353;
      }
    }
  }

  .info_box {
    margin-top: 0.44rem;

    .title {
      width: 100%;
      height: 2.5rem;
      line-height: 2.5rem;
      background-color: #fff;
      text-align: left;
      padding-left: 0.94rem;

      span {
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 15px;
        color: #333;
        border-left: 0.25rem solid #f15353;
        padding-left: 0.3rem;
        font-weight: bold;
      }
    }

    ul {
      li {
        width: 23.44rem;
        height: 8.13rem;
        background-color: #fff;
        margin-top: 0.4rem;

        .box_title {
          display: flex;
          justify-content: space-between;
          padding: 0.625rem 0.84rem 0 1rem;

          span {
            font-size: 16px;
            font-stretch: normal;
            letter-spacing: 0;
            color: #333;
            font-weight: bold;
          }

          span:nth-child(2) {
            color: #f15353;
            font-weight: 400;
          }
        }

        .cont_box {
          width: 8.75rem;
          height: 3.06rem;
          display: inline-block;
          margin-top: 0.625rem;

          div:nth-child(2) {
            margin-top: 0.825rem;
            font-size: 1rem;
            font-weight: bold;
          }
        }

        .bot_bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 0.66rem;

          .time {
            height: 0.72rem;
            font-size: 12px;
            margin-left: 0.97rem;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0;
            color: #8c8c8c;
          }

          .right_icon {
            padding-right: 0.56rem;

            span {
              width: 1.5rem;
              height: 0.75rem;
              font-size: 0.875rem;
              font-weight: normal;
              font-stretch: normal;
              letter-spacing: 0;
              color: #333;
            }

            i {
              width: 0.31rem;
              height: 0.56rem;
              font-size: 18px;
            }
          }
        }
      }

      li:nth-child(1) {
        margin-top: 2px;
      }
    }
  }
}
</style>
