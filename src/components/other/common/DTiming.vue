<template>
  <div class="d-timing">
    <slot
      v-if="useSlot"
      v-bind="{
      milliseconds,
      seconds,
      days,
      hours,
      minutes,
      timeString
      }"
    ></slot>
    <template v-else>{{ timeString }}</template>
  </div>
</template>

<script>
import { getTimeElByMillisecond, getTimeDiff, timeElAddZero } from "../../../fun/modules/date";
let timer = null;
export default {
  props: {
    time: Number,
    startTime: Number,
    format: {
      type: String,
      //* d=天 h=小时 m=分钟 s=秒 ms=毫秒
      default: "d天h时m分s秒"
    },
    countdown: {
      type: Boolean,
      defualt: true
    },
    millisecond: {
      type: Boolean,
      default: false
    },
    useSlot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      milliseconds: 0,
      seconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      timeString: ""
    };
  },
  mounted() {
    timer = setInterval(
      () => {
        const { days, hours, minutes, seconds, millisecond } = getTimeElByMillisecond(getTimeDiff(this.time, Date.now()));
        if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0 && millisecond <= 0) {
          clearInterval(timer);
          timer = null;
          this.$emit("end"); //* 计时结束
          return;
        }
        this.milliseconds = millisecond;
        this.seconds = timeElAddZero(seconds);
        this.minutes = timeElAddZero(minutes);
        this.hours = timeElAddZero(hours);
        this.days = timeElAddZero(days);
        let timeString = this.format;
        timeString = timeString.replace("d", this.days);
        timeString = timeString.replace("h", this.hours);
        timeString = timeString.replace("m", this.minutes);
        timeString = timeString.replace("s", this.seconds);
        timeString = timeString.replace("ms", this.milliseconds);
        this.timeString = timeString;
      },
      this.millisecond ? 1 : 1000
    );
  }
};
</script>

<style>
</style>