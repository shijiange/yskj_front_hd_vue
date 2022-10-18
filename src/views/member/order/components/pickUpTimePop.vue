<template>
  <div>
    <van-popup v-model="popShow" closeable position="bottom" round>
      <div class="deliveryTime">
        <div class="deliveryTime-title">取件时间</div>
        <div class="deliveryTime-container">
          <div class="deliveryTime-day">
            <div class="deliveryTime-day-item" v-for="(item, key) in day_list" :key="key" :class="{ active: key == day_index }" @click="setTimeList(key)">{{ item.day }} ({{ item.day_str }})</div>
          </div>
          <div class="deliveryTime-hour">
            <div class="deliveryTime-hour-item" v-for="(item, key) in time_list" :key="key" :class="{ active: key == time_index }" @click="send(key)">
              <span>{{ item.pickupStartTime }}-{{ item.pickupEndTime }}</span>
              <i class="iconfont icon-all_select_active" v-if="key == time_index"></i>
            </div>
          </div>
        </div>
        <!-- <div class="deliveryTime-btn-wrapper">
          <div class="deliveryTime-btn-item">完成</div>
        </div> -->
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: [""],
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
      if (this.day_list.length == 0) {
        this.$dialog.alert({ message: "该地区暂无取货服务，请修改其他地址" });
        return;
      }
      this.popShow = flag;
    },
    setListData(arr) {
      this.day_list = arr;
      this.time_list = arr[0].pickupTimeRangeList;
    },
    setTimeList(index) {
      if (this.day_index == index) return;
      this.day_index = index;
      this.time_index = null;
      this.time_list = this.day_list[index].pickupTimeRangeList;
    },
    send(index) {
      this.time_index = index;
      let day = this.day_list[this.day_index].complete_day;
      let start_time = day + " " + this.time_list[index].pickupStartTime;
      let end_time = day + " " + this.time_list[index].pickupEndTime;
      this.$emit("confirm", { start_time, end_time });
      this.setPopShow(false);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.deliveryTime {
  height: 24rem;
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
