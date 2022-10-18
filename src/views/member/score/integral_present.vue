<template>
  <div id="integral_share">
    <c-title :hide="false" :text="integral?integral:'积分'">
    </c-title>
    <div id="content">
      <div class="info">
        <div class="header">
          <img :src="member_avatar">
        </div>
        <ul class="name">
          <li>{{member_nickname}}</li>
        </ul>
        <ul class="list">
          <li>

            <div id="a_content" v-html="activity_explain"></div>
          </li>
          <!--<li>-->
          <!--<span>2</span>-->
          <!--<span>好友下载APP且注册完成后，您即可获得100元优惠券；</span>-->
          <!--</li>-->
          <!--<li>-->
          <!--<span>3</span>-->
          <!--<span>优惠券系统自动发放，在下单时系统自动减；</span>-->
          <!--</li>-->
        </ul>
        <div class="integral"><span>{{activity_average}}</span>{{integral?integral:'积分'}}</div>
      </div>
      <div class="btn" @click="receive">立即领取</div>
    </div>

  </div>
</template>
<script>
import integral_present_controller from "./integral_present_controller";

export default integral_present_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #integral_share {
    #content {
      height: 39.1875rem;
      background-image: url(../../../assets/images/integral_bg.png);
      background-position: center;
      background-size: 100%;

      .info {
        padding-top: 1.25rem;
        width: 19.75rem;
        height: 28.5rem;
        margin: 0 auto;
        background-image: url(../../../assets/images/info_bg.png);
        background-position: top center;
        background-size: 19.75rem 28.5rem;
        background-repeat: no-repeat;
        position: relative;

        .header {
          width: 4rem;
          height: 4rem;
          border-radius: 2rem;
          border: solid 0.125rem #fff;
          overflow: hidden;
          margin: 0 auto;

          img {
            width: 100%;
          }
        }

        .name {
          li {
            font-size: 18px;
            font-weight: bold;
            color: #ff7216;
            line-height: 2.25rem;
            padding: 0 1.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .list {
          height: 43%;
          margin: 1.25rem auto;
          padding: 0 1.875rem;

          li {
            height: 100%;
            overflow-y: scroll;
            display: flex;
            margin-bottom: 0.625rem;

            span:first-child {
              display: block;
              width: 1.5rem;
              height: 1.5rem;
              line-height: 1.25rem;
              font-size: 16px;

              /* border: solid 0.125rem #e8620c; */

              /* background: #ff9255; */
              color: #fff;
              border-radius: 0.4375rem;
              margin-right: 0.625rem;
            }

            span:last-child {
              width: 13.875rem;
              color: #ff7216;
              font-size: 16px;
              text-align: left;
              line-height: 1.5rem;
            }
          }
        }

        .integral {
          position: absolute;
          bottom: 3.75rem;
          left: calc(50% - 3.875rem);
          width: 7.75rem;
          height: 2.875rem;
          color: #ffe331;
          line-height: 2.875rem;
          font-size: 14px;
          background-image: url(../../../assets/images/integral_btn.png);
          background-size: 100%;
          background-repeat: no-repeat;

          span {
            font-weight: bold;
            font-size: 1.5rem;
          }
        }
      }

      .btn {
        margin: 2.5rem auto;
        color: #ff7216;
        font-weight: bold;
        line-height: 3.0625rem;
        font-size: 18px;
        width: 11.25rem;
        height: 3.0625rem;
        background-image: url(../../../assets/images/receive_btn.png);
        background-size: 100%;
      }
    }
  }

</style>