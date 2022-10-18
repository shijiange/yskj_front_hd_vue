<template>
  <div id="white_integral">
    <c-title :hide="false"
             text='白积分'></c-title>
    <div class='user-white'>
      <div class='whitenum'>
        <p>白积分</p>
        <span>{{}}</span>
      </div>
      <div class='proportion'>
        <span>每期赠送比例:{{}}</span>
      </div>
    </div>
    <div id="tabs" style="margin-top: 0.625rem;">
      <van-tabs v-model="activeName">
        <van-tab name="first" title="获得历史"></van-tab>
      </van-tabs>
      <div>
        <!-- <mt-tab-container v-model="activeName"> -->
        <div v-show="activeName=='first'">
          <!-- <mt-tab-container-item id="first"> -->
          <div class="list">
            <div class="nember">
              <h1>订单编号：</h1>
              <span>SN20180309</span>
            </div>
            <ul>
              <li>
                <span class="time">订单时间：</span>
                <span>2018-03-09&nbsp;&nbsp;16:19:23</span>
              </li>
              <li>
                <span class="time">订单金额</span>
                <span>{{$i18n.t("money")}}200</span>
              </li>
              <li>
                <span class="time">获得数量：</span>
                <span>200个</span>
              </li>
            </ul>
          </div>
          <div class="list">
            <div class="nember">
              <h1>订单编号：</h1>
              <span>SN20180309</span>
            </div>
            <ul>
              <li>
                <span class="time">订单时间：</span>
                <span>2018-03-09&nbsp;&nbsp;16:19:23</span>
              </li>
              <li>
                <span class="time">订单金额</span>
                <span>{{$i18n.t("money")}}200</span>
              </li>
              <li>
                <span class="time">获得数量：</span>
                <span>200个</span>
              </li>
            </ul>
          </div>
          <!--</el-tab-pane>-->
          <!-- </mt-tab-container-item> -->
        </div>
        <!-- </mt-tab-container> -->
      </div>
      <!--</el-tabs>-->
    </div>
  </div>
</template>
<script>
import member_white_integralcontroller from "./member_white_integralcontroller";

export default member_white_integralcontroller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #white_integral {
    .user-white {
      display: flex;
      justify-content: space-between;
      background: #f15353;
      box-sizing: border-box;
      padding: 1rem 0.75rem;

      .whitenum {
        text-align: center;
        color: #fff;

        p {
          font-size: 18px;
          font-weight: bold;
        }

        span {
          font-size: 18px;
          line-height: 1.7rem;
        }
      }

      .proportion {
        color: #fff;
        font-size: 14px;
      }
    }

    #tabs {
      .list {
        background-color: #fff;
        margin-top: 0.375rem;

        .nember {
          display: flex;
          justify-content: space-between;
          height: 2.5rem;
          line-height: 2.5rem;
          padding-right: 0.75rem;
          margin-left: 0.75rem;
          font-size: 14px;
          border-bottom: solid 0.0625rem #e2e2e2;
        }

        ul {
          background-color: #fff;
          padding: 0.625rem 0;

          li {
            padding: 0 0.75rem;
            display: flex;
            justify-content: space-between;
            height: 1.875rem;
            line-height: 1.875rem;
            font-size: 14px;

            .time {
              color: #8c8c8c;
            }
          }
        }
      }
    }
  }
</style>


