<template>
  <div id="red_integral">
    <c-title :hide="false"
             text='红积分'></c-title>
    <div class='user-red'>
      <div class='rednum'>
        <p>红积分</p>
        <span>{{72.00}}</span>
      </div>
      <div class='proportion'>
        <router-link :to="fun.getUrl('withdrawal')">
          <p>{{this.fun.initWithdrawal()}}到创业金</p>
        </router-link>
        <span>收取{{}}%的手续费</span>
      </div>
    </div>
    <div id="tabs"
         style="margin-top: 0.625rem;">
      <van-tabs v-model="activeName">
        <van-tab name="first" title="获得历史"></van-tab>
      </van-tabs>
      <!--<el-tabs>-->
      <!--<el-tab-pane label="获得历史">-->
      <div>
      <!-- <mt-tab-container v-model="activeName"> -->
        <div v-show="activeName=='first'">
        <!-- <mt-tab-container-item id="first"> -->
          <ul>
            <li>
              <span class="time">2018-03-09&nbsp;&nbsp;16:19:23</span>
              <span>赠送数量：200</span>
            </li>
            <li>
              <span class="time">2018-03-09&nbsp;&nbsp;16:19:23</span>
              <span>赠送数量：200</span>
            </li>
            <li>
              <span class="time">2018-03-09&nbsp;&nbsp;16:19:23</span>
              <span>赠送数量：200</span>
            </li>
          </ul>
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
import member_red_integralcontroller from "./member_red_integralcontroller";
export default member_red_integralcontroller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#red_integral {
  .user-red {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0.75rem;
    background: #f15353;
    box-sizing: border-box;

    .rednum {
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
      p {
        font-size: 12px;
        font-weight: bold;
        color: #f15353;
        background: #fff;
        padding: 0.3125rem 0.625rem;
        border-radius: 0.25rem;
      }

      span {
        color: #fff;
        font-size: 14px;
        margin-top: 0.375rem;
        display: block;
      }
    }
  }

  #tabs {
    ul {
      margin-top: 0.25rem;
      background-color: #fff;

      li {
        padding: 0 0.75rem;
        display: flex;
        justify-content: space-between;
        height: 2.75rem;
        line-height: 2.75rem;
        font-size: 14px;
        border-bottom: solid 0.0625rem #e2e2e2;

        .time {
          color: #8c8c8c;
        }
      }
    }
  }
}
</style>