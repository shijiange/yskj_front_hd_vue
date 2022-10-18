<template>
  <div id="appointment_time">
    <c-title :hide="false" :text="'可预约日期'">
    </c-title>

    <c-calendar v-if="showCalendar" ref="calendar"
                :events="calendarEvents"
                @select="selectedDay"
                @monthChanged="monthChanged">
    </c-calendar>

    <div class="main" v-if="timeList.length <= 0">
      <p class="tips">暂无预约</p>
    </div>

    <div class="main" v-else>
      <p class="tips">预约时间</p>
      <div class="times" v-for="(time,index) in timeList" :key="index">
        <span class="checked">{{time.start_time}}-{{time.end_time}}<em>已约</em></span>
        <!--<span>09:30-10:00</span>-->
      </div>
    </div>

  </div>
</template>

<script>
import showAppointment_controller from "./showAppointment_controller";

export default showAppointment_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #appointment_time {
    background: #fff;
    text-align: left;

    .main {
      padding: 1rem;
    }

    .tips {
      text-align: left;
      font-weight: bold;
      font-size: 15px;
    }

    .times {
      display: flex;
      margin-top: 1rem;

      span {
        position: relative;
        display: inline-block;
        background-color: #fe753e;
        border-radius: 5px;
        color: #fff;
        padding: 0.8rem 1rem;
        font-size: 14px;
        margin-right: 0.5rem;
      }

      em {
        position: absolute;
        right: 0;
        top: 0;
        background-color: #fff;
        border-radius: 0 5px 0 5px;
        opacity: 0.57;
        font-size: 10px;
        color: #999;
        padding: 0.2rem;
      }

      .checked {
        background-color: #e1e1e1;
      }
    }

    .blue {
      display: inline-block;
      padding: 0 0.1rem;
      border-radius: 2.5px;
      background-color: #6eabff;
      color: #fff;
    }
  }
</style>
