<template>
  <div>
    <van-popup v-model="popShow" closeable position="bottom" round>
      <div class="deliveryTime">
        <div class="deliveryTime-title">送达时间</div>
        <div class="deliveryTime-container">
          <div class="deliveryTime-day">
            <div class="deliveryTime-day-item" v-for="(item, key) in day_list" :key="key" :class="{ active: key == day_index }" @click="setDayIndex(key)">
              {{ item.day }}
            </div>
          </div>
          <div class="deliveryTime-hour">
            <div class="deliveryTime-hour-item" v-for="(item, key) in time_list" :key="key" :class="{ active: key == time_index }" @click="setTimeIndex(key)">
              <span>{{ item.start_time_str }}-{{ item.end_time_str }}</span>
              <i class="iconfont icon-all_select_active" v-if="key == time_index"></i>
            </div>
          </div>
        </div>
        <div class="deliveryTime-btn-wrapper">
          <div class="deliveryTime-btn-item" @click="confirm">完成</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      popShow: false,

      day_list: [],
      day_index: 0,

      time_list: [],
      time_index: null
    };
  },
  created() {},
  methods: {
    setPopShow(flag) {
      this.popShow = flag;
    },
    setListData(arr, default_choose = 0) {
      if(arr.length==0) return;
      this.day_list = arr;
      this.time_list = arr[0].time_arr;

      //开启默认选择最近时间
      if (default_choose == 1) {
        this.setDayIndex(0);
        this.setTimeIndex(0);
        this.confirm();
      }
    },
    setDayIndex(index) {
      if (this.day_index == index) return;
      this.day_index = index;
      this.time_index = null;
      this.time_list = this.day_list[index].time_arr;
    },
    setTimeIndex(index) {
      this.time_index = index;
    },
    confirm() {
      if (this.time_index == null) return;
      let time = this.time_list[this.time_index];
      time.day = this.day_list[this.day_index].day;
      this.$emit("confirm", time);
      this.setPopShow(false);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.deliveryTime {
  height: 27rem;
  .deliveryTime-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    font-size: 18px;
    color: #2a2a2a;
    font-weight: bold;
  }
  .deliveryTime-container {
    display: flex;
    height: 20rem;
    background: #f7f7f7;
    .deliveryTime-day {
      width: 7.813rem;
      height: 100%;
      overflow: auto;
      .deliveryTime-day-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2.575rem;
        font-size: 15px;
        color: #333333;
        &.active {
          color: #f05152;
          background-color: #ffffff;
        }
      }
    }
    .deliveryTime-hour {
      flex: 1;
      height: 100%;
      padding-left: 1.563rem;
      padding-right: 1.094rem;
      overflow: auto;
      background: #fff;
      .deliveryTime-hour-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 2.575rem;
        font-size: 15px;
        &.active {
          color: #f05152;
        }
        .iconfont {
          font-size: 16px;
          color: #f05152;
        }
      }
    }
  }
  .deliveryTime-btn-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    padding: 0 2.313rem;
    .deliveryTime-btn-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 2.188rem;
      font-size: 13px;
      font-weight: bold;
      color: #ffffff;
      background-color: #f05152;
      border-radius: 1.094rem;
    }
  }
}
</style>
