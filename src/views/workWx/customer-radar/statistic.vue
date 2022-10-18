<template>
  <div class="customer-statistic">
    <div class="header-box">
      <van-nav-bar class="nav-bar" left-arrow title="数据统计" @click-left="onClickLeft"></van-nav-bar>
      <div class="calendar-cell flex-j-sb flex-a-c" @click="showCalendar">
        <span>
          <van-icon class="iconfont icon-fontclass-rili"></van-icon>
          <span>{{timeText}}</span>
        </span>
        <van-icon name="arrow"></van-icon>
      </div>
      <div class="cumulative">
        <p>累计访问次数</p>
        <div>
          <span class="cumulative-num">{{cumulative.total}}</span>
          <span>较昨日{{ cumulative.yday_total }}</span>
        </div>
      </div>

      <div class="statistic-box">
        <div class="cumulative-box">
          <p class="statistic-title">累计访问人数</p>
          <p class="statistic-num">{{ cumulative.people_total }}</p>
          <div class="diff flex-j-sb flex-a-c">
            <span>较昨日{{ cumulative.yday_people_total }}</span>
            <van-icon class="iconfont icon-rise" :class="cumulative.yday_people_total > 0 ? 'increase-icon' : 'reduce-icon'"></van-icon>
          </div>
        </div>
        <div class="current-box">
          <p class="statistic-title">当日最高访问次数</p>
          <p class="statistic-num">{{ cumulative.max_number }}</p>
          <div class="diff flex-j-sb flex-a-c">
            <span>较昨日{{ cumulative.yday_max_number }}</span>
            <van-icon class="iconfont icon-rise" :class="cumulative.yday_max_number > 0 ? 'increase-icon' : 'reduce-icon'"></van-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="plane-block">
        <history-echart id="line-history-chart" :history="history"></history-echart>
      </div>
      <div class="plane-block">
        <port-echart barId="bar-port-chart" pieId="pie-port-chart" :port="port"></port-echart>
      </div>
      <div class="plane-block" v-if="rank.length > 0">
        <page-ranking :rankList="rank"></page-ranking>
      </div>
      <div class="plane-block" v-if="member.length > 0">
        <member-record :memberList="member" :currentTime="currentTime"></member-record>
      </div>
    </div>

    <van-popup v-model="isShowCalendar" position="bottom" round class="calendar-popup">
      <div class=popup-title>选择日期</div>
      <calendar
        :markDate="markDate"
        :agoDayHide="0"
        :futureDayHide="futureDayHide"
        ref="Calendar"
        @choseDay="changeDate"
      ></calendar>
    </van-popup>
  </div>
</template>

<script>
import calendar from "../../../components/workWx/calendar/index";

import historyEchart from "./components/historyEchart.vue";
import portEchart from "./components/portEchart.vue";
import pageRanking from "./components/pageRanking.vue";
import memberRecord from "./components/memberRecord.vue";
export default {
  data () {
    return {
      isShowCalendar: false,
      currentTime: new Date(),
      timeText: "",
      markDate: [],

      resData: null,
      cumulative: {},
      history: [],
      port: [],
      rank: [],
      member: []
    };
  },

  activated () {
    // 默认选中的时间
    this.timeText = this.fun.dateFormat("YYY-mm-dd", this.currentTime);
    this.markDate[0] = this.fun.dateFormat("YYYY/mm/dd", this.currentTime);
    this.getStatisticsByDay();
  },
  methods: {
    getStatisticsByDay () {
      $http.post("plugin.customer-radar.frontend.controller.member.browse-statistics.getStatisticsByDay", {date: this.currentTime})
        .then(res => {
          console.log(res);
          if (res.result !== 1) {
            return this.$toast(res.msg);
          }
          this.resData = res.data;
          let {cumulative, history, port, rank, member} = res.data;
          this.cumulative = cumulative;
          this.history = history;
          this.port = port;
          this.rank = rank && rank.slice(0, 10);
          this.member = member;
        });
    },
    showCalendar () {
      this.isShowCalendar = true;
    },
    changeDate (day) {
      this.markDate = [day];
      this.currentTime = new Date(day);
      this.timeText = this.fun.dateFormat("YYY-mm-dd", this.currentTime);
      this.isShowCalendar = false;
      this.getStatisticsByDay();
    },
    onClickLeft () {
      history.back();
    },
  },

  computed: {
    futureDayHide () {
      let tmp = Date.parse( new Date() ).toString();
      tmp = tmp.substr(0,10);
      return tmp;
    },
  },
  components: {
    historyEchart,
    portEchart,
    pageRanking,
    memberRecord,
    calendar
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.customer-statistic {
  background-color: #f2f2f2;
  /deep/ .header-box {
    padding: 0.94rem;
    padding-top: 0;
    color: #ffffff;
    background-image: url("../../../assets/images/workWx/customer_statistic_bg.png");
    background-size: cover;
    .van-nav-bar {
      background-color: transparent;
      .van-icon-arrow-left {
        font-size: 18px;
        color: #ffffff;
      }
      .van-nav-bar__title {
        font-size: 18px;
        color: #ffffff;
      }
    }
    .van-hairline--bottom::after {
      display: none;
    }

    .calendar-cell {
      margin-top: 2rem;
      font-size: 15px;
      .icon-fontclass-rili {
        margin-right: 0.5rem;
      }
    }

    .cumulative {
      font-size: 10px;
      line-height: 30px;
      .cumulative-num {
        font-size: 23px;
        font-weight: bold;
        margin-right: 0.3rem;
      }
    }

    .statistic-box {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 1.2rem;
      .cumulative-box, .current-box {
        width: 9.38rem;
        padding: 0.69rem;
        background-color: #ffffff;
        border-radius: 0.31rem;
        .statistic-title {
          font-size: 12px;
          color: #575757;
        }
        .statistic-num {
          font-size: 18px;
          font-weight: bold;
          padding: 0.5rem 0;
          color: #323232;
        }
        .diff {
          font-size: 10px;
          color: #868686;
        }
      }
    }

    .increase-icon {
      color: #ee2525;
    }
    .reduce-icon {
      color: #4aa22b;
      transform: rotateX(180deg);
    }
  }

  .container {
    padding-bottom: 1rem;
  }
  .plane-block {
    margin: 0.63rem 0.94rem;
    border-radius: 0.53rem;
    background-color: #ffffff;
  }

  /deep/ .calendar-popup {
    padding: 0.5rem 2rem;
    // .wh_content_li {
    //   color: #323232;
    // }
    // .wh_jiantou1 {
    //   border-top: 2px solid #323232;
    //   border-left: 2px solid #323232;
    // }
    // .wh_jiantou2 {
    //   border-top: 2px solid #323232;
    //   border-right: 2px solid #323232;
    // }
    // .wh_content_all {
    //   background-color: #ffffff;
    //   .wh_content_item {
    //     color: #323232;
    //   }
    // }
  }
}

.flex {
  display: flex;
}
.flex-j-c {
  display: flex;
  justify-content: center;
}
.flex-j-sb {
  display: flex;
  justify-content: space-between;
}
.flex-a-c {
  display: flex;
  align-items: center;
}
.flex-a-fe {
  display: flex;
  align-items: flex-end;
}
</style>