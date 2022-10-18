<template>
  <div id="clockin">
    <div class="J-weixin-tip weixin-tip">
      <div id="clockin-detail">
        <c-title :hide="false" :text="clockin_title" totext="我的战绩" tolink="ClockPunchRecord"></c-title>
        <!-- 新页面 -->
        <div id="clock_content">
          <div class="clock_info">
            <ul class="info">
              <li class="info_a">打卡可随机瓜分金额({{ $i18n.t('元') }})</li>
              <li class="info_b">
                <span>{{ totalAmonut }}</span>
              </li>
              <li class="info_c">打卡时间 {{ clock_begintime }}：00 - {{ clock_endtime }}：00</li>
              <li class="info_d">当前有{{ totalNumber }}人参与打卡挑战</li>
            </ul>
            <router-link :to="fun.getUrl('ClockPunchRule')">
              <div class="rule">
                <img src="../../assets/images/clock_rule.png" />
                <span>活动规则</span>
              </div>
            </router-link>
            <van-button
              @click.native="clokinBtnCallBack(btnStatus)"
              size="large"
              :disabled="forbidden"
              class="btn"
              type="hollow"
            >
              {{ message }}

              <van-count-down :time="cutDownTime" class="time" format="DD天HH时mm分ss秒" @finish="cutDownCallBack" v-if="cutDownTime"></van-count-down>
            </van-button>

            <van-action-sheet v-model="actionSheetShow" :actions="actionSheetItems" cancel-text="取消" :close-on-click-action="true" />
          </div>
          <div class="clock_state">
            <h1>打卡状况</h1>
            <ul>
              <li>
                <span>{{ clockInNum }}</span
                >人成功
                <img src="../../assets/images/success.png" />
              </li>
              <li>
                <span>{{ notClockInNum }}</span
                >人失败
                <img src="../../assets/images/fail.png" />
              </li>
            </ul>
          </div>
          <div class="clock_use">
            <div class="use_a" v-if="clockFirstShow && clockFirstMember">
              <div class="header">
                <img :src="clockFirstMember.has_one_member.avatar" style="width: 100%; height: 100%;" />
              </div>
              <img class="hat" src="../../assets/images/clock_hat.png" />
              <span>早起之星</span>
              <ul class="name">
                <li>{{ clockFirstMember.has_one_member.nickname }}</li>
                <li>{{ clockFirstMember.clock_in_at }}打卡</li>
              </ul>
            </div>
            <div class="use_a" v-if="luckyMemberShow && luckyMember">
              <div class="header">
                <img :src="luckyMember.has_one_member.avatar" style="width: 100%; height: 100%;" />
              </div>
              <img class="hat" src="../../assets/images/clock_hat.png" />
              <span>幸运之星</span>
              <ul class="name">
                <li>{{ luckyMember.has_one_member.nickname }}</li>
                <li>{{ luckyMember.amount }}{{ $i18n.t('元') }}</li>
              </ul>
            </div>
            <div class="use_a" v-if="continueMemberShow && continueMember">
              <div class="header">
                <img :src="continueMember.has_one_member.avatar" style="width: 100%; height: 100%;" />
              </div>
              <img class="hat" src="../../assets/images/clock_hat.png" />
              <span>毅力之星</span>
              <ul class="name">
                <li>{{ continueMember.has_one_member.nickname }}</li>
                <li>连续{{ continueMember.clock_num }}次</li>
              </ul>
            </div>
          </div>

        </div>
        <!-- end -->
      </div>
    </div>

    <!-- <van-popup v-model="popupSpecs" position="bottom" >
      <div class="ispaskey">
        <van-password-input
          :value="payarr"
          :focused="popupSpecs"
          @focus="popupSpecs = true"
        />
        <van-number-keyboard
          title="安全键盘"
          v-model="payarr"
          :show="true"
          @blur="popupSpecs = false"
          @input="onInput"
          @delete="onDelete"
        />
      </div>

    </van-popup> -->
    <pay-keyboard :payKeyboardShow.sync="popupSpecs" @complete="onInput"></pay-keyboard>
  </div>
</template>

<script>
import clockin_controller from './clockin_controller';
export default clockin_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.ispaskey {
  .van-number-keyboard {
    position: relative;
  }
}

.van-button__text {
  display: flex;
  align-items: center;
}

.van-count-down {
  color: #fff;
  font-size: 20px;
}

#clockin-detail {
  width: 100%;
  font-size: 16px;
  // 新样式
  #clock_content {
    background-color: #fff;
    height: 39.1875rem;

    .clock_info {
      position: relative;
      color: #fff;
      height: 23.75rem;
      background-image: url(../../assets/images/clock_bg.png);
      background-repeat: no-repeat;
      background-size: 100%;

      .info {
        padding-top: 2.5rem;

        .info_a {
          font-size: 18px;
        }

        .info_b {
          font-size: 16px;
          line-height: 3rem;

          span {
            font-size: 48px;
            color: #ffe676;
          }
        }

        .info_c,
        .info_d {
          font-size: 16px;
          line-height: 1.75rem;
        }
      }

      .rule {
        position: absolute;
        top: 1.25rem;
        right: 0.625rem;

        img {
          width: 1.75rem;
        }

        span {
          font-size: 12px;
          display: block;
          color: #ffe676;
        }
      }

      .btn {
        width: 17.1875rem;
        height: 3.25rem;
        line-height: 3.25rem;
        font-size: 20px;
        margin: 0 auto;
        background-image: url(../../assets/images/clock_btn.png);
        background-size: 100%;
        background-repeat: no-repeat;
        position: absolute;
        bottom: 0.5rem;
        left: 3.125rem;
        border: none;
        color: #fff;
        opacity: 1;
      }
    }

    .clock_state {
      padding-top: 1rem;

      h1 {
        height: 1.875rem;
        line-height: 1.875rem;
        font-size: 16px;
        background-image: url(../../assets/images/clock_state.png);
        background-repeat: no-repeat;
        background-size: 11.875rem 1.875rem;
        background-position: center;
        color: #355b46;
      }

      ul {
        margin-top: 0.625rem;
        display: flex;
        justify-content: center;

        li {
          display: flex;
          color: #8c8c8c;
          font-size: 16px;

          span {
            color: #666;
          }

          img {
            width: 1.25rem;
            height: 1.25rem;
            margin-left: 0.25rem;
          }
        }

        li:first-child {
          margin-right: 1rem;
        }
      }
    }

    .clock_use {
      margin-top: 1.25rem;
      display: flex;

      .use_a {
        position: relative;
        width: 33.33%;

        .header {
          z-index: 1;
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 1.875rem;
          overflow: hidden;
          margin: 0 auto;

          img {
            width: 100%;
          }
        }

        .hat {
          width: 1.5rem;
          position: absolute;
          top: -0.625rem;
          left: 1.5rem;
          z-index: 0;
        }

        span {
          z-index: 2;
          position: relative;
          bottom: 0.625rem;
          display: block;
          margin: 0 auto;
          width: 3.75rem;
          height: 1.25rem;
          line-height: 1.25rem;
          color: #fff;
          font-size: 12px;
          border-radius: 1.5rem;
          background: linear-gradient(to right, #fdde8e, #68c978);
        }

        .name {
          font-size: 14px;

          li:first-child {
            color: #666;
          }

          li:last-child {
            color: #ffb14c;
          }
        }
      }
    }
  }
  // end

  .clockin-pay {
    margin-top: 0.625rem;

    .status {
      background-color: #fff;
      margin-bottom: 1.25rem;

      h1 {
        line-height: 2.5rem;
        border-bottom: solid 0.0625rem #ebebeb;
      }

      span {
        margin: 1.25rem 0;
        display: inline-block;
      }
    }

    .success {
      color: #16d285;
      font-size: 18px;
    }

    .fail {
      color: #f15353;
      font-size: 18px;
    }

    button {
      margin: 0 auto;
      height: 2.5rem;
      background-color: #f15353;
      color: #fff;
      border-radius: 0.3125rem;
      width: 80%;
      font-size: 16px;
    }
  }

  .clockin-pay-content {
    margin-top: 0.625rem;

    h1 {
      font-size: 20px;
    }

    .clockin-pay-people {
      .success {
        color: #13ce66;
      }

      .fail {
        color: #ff4949;
      }
    }

    .clockin-top {
      width: 90%;
      margin: 1.25rem 5% 0 5%;
      float: left;

      .clockin-top-early {
        float: left;
        width: 30%;

        img {
          width: 60%;
          height: 60%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          -o-border-radius: 50%;
          border-radius: 50%;
        }

        p {
          width: 80%;
          height: 1.25rem;
          line-height: 1.25rem;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0.125rem auto;
        }

        .clockin-top-name {
          width: 80%;
          background-color: red;
          height: 1.125rem;
          margin: 0 auto;
          color: #fff;
          line-height: 1.125rem;
          font-size: 14px;
        }
      }

      .clockin-top-lucky {
        float: left;
        width: 30%;
        margin-right: 5%;
        margin-left: 5%;

        img {
          width: 60%;
          height: 60%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          -o-border-radius: 50%;
          border-radius: 50%;
        }

        p {
          width: 80%;
          height: 1.25rem;
          line-height: 1.25rem;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0.125rem auto;
        }

        .clockin-top-name {
          width: 80%;
          background-color: red;
          height: 1.125rem;
          margin: 0 auto;
          color: #fff;
          line-height: 1.125rem;
          font-size: 14px;
        }
      }

      .clockin-top-persist {
        float: left;
        width: 30%;

        img {
          width: 60%;
          height: 60%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          -o-border-radius: 50%;
          border-radius: 50%;
        }

        p {
          width: 80%;
          height: 1.25rem;
          line-height: 1.25rem;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0.125rem auto;
        }

        .clockin-top-name {
          width: 80%;
          background-color: red;
          height: 1.125rem;
          margin: 0 auto;
          color: #fff;
          line-height: 1.125rem;
          font-size: 14px;
        }
      }
    }
  }

  .yd-btn-hollow {
    border: none;
    background-color: transparent;
  }
}
</style>
