<!-- 倒计时组件 timeEnd() -->

<template>
  <div>
    <template v-if="goods_type == 'GroupGoods' || goods_type == 'zhpGroup' || goods_type == 'groupWorkGood'">
      <!-- 拼团样式和商城商品样式区别较大 -->
      <div class="price_time">
        <div class="img">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/rob-time.png" width="16%;" />
        </div>
        <span class="text">超值<br />开团</span>
        <span class="price"
          >{{ $i18n.t("money") }}<font>{{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? goodsInfo.vip_level_status.word : goods_info.min_price }}</font
          >起</span
        >
        <div class="time" v-if="!this.fun.isTextEmpty(goods_info.end_time) || (goods_type == 'zhpGroup' && !this.fun.isTextEmpty(goods_info.start_time))">
          <template v-if="!isFinished">
            <span>{{ timestamp < goods_info.start_time ? "距离活动开始时间" : "活动截止倒计时" }}</span>
            <van-count-down
              :time="timestamp < goods_info.start_time ? fun.getTimeDifference(goods_info.start_time) : fun.getTimeDifference(goods_info.end_time)"
              class="bottom_time"
              format="DD 天 HH 时 mm 分 ss 秒"
              @finish="countDownEndFun"
              ref="countDown"
            >
              <template #default="timeData">
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.days }}</em> <span>天</span>
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.hours < 10 ? `0${timeData.hours}` : timeData.hours }} </em>
                <b style="color: #fff; font-size: 0.75rem;">:</b>
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.minutes < 10 ? `0${timeData.minutes}` : timeData.minutes }} </em>
                <b style="color: #fff; font-size: 0.75rem;">:</b>
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ Number(timeData.seconds) < 10 ? `0${timeData.seconds}` : timeData.seconds }} </em>
              </template>
            </van-count-down>
          </template>
          <p v-if="isFinished" style="text-align: right; color: #fff; padding-right: 10px; font-size: 14px;">已结束</p>
        </div>
      </div>
    </template>
    <template v-else-if="goods_type == 'grab_group'">
      <div class="rob-time1" v-if="goodsInfo.end_time">
        <div class="active-text">{{ timestamp < goodsInfo.start_time ? "活动开始倒计时" : "活动截止倒计时" }}</div>
        <div class="active-time">
          <van-count-down :time="fun.getTimeDifference(istimestamp)" class="bottom_time" format="DD天HH时mm分ss秒" @finish="begTimeBtn">
            <template #default="timeData">
              <em style="padding: 0.25rem 0.1875rem; border-radius: 0.125rem;">{{ timeData.days < 10 ? `0${timeData.days}` : timeData.days }}</em> 天
              <em style="padding: 0.25rem 0.1875rem; border-radius: 0.125rem;">{{ timeData.hours < 10 ? `0${timeData.hours}` : timeData.hours }}</em>
              <b>:</b>
              <em style="padding: 0.25rem 0.1875rem; border-radius: 0.125rem;">{{ timeData.minutes < 10 ? `0${timeData.minutes}` : timeData.minutes }}</em>
              <b>:</b>
              <em style="padding: 0.25rem 0.1875rem; border-radius: 0.125rem;">{{ timeData.seconds < 10 ? `0${timeData.seconds}` : timeData.seconds }}</em>
            </template>
          </van-count-down>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="time-buy" v-if="isBuy && (isTime || isBegTime)">
        <div class="buy-left">
          {{ limitedTimeCustomName }}
        </div>
        <div class="buy-right">
          <template v-if="!isBegTime">
            <div class="right-end">距结束余</div>
            <div class="right-time">
              <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(endTimeStr))" class="bottom_time" format="DD 天 HH 时 mm 分 ss 秒">
                <template #default="timeData">
                  <span>{{ timeData.days }} 天</span>
                  <span>{{ Number(timeData.hours) < 10 ? `0${timeData.hours}` : timeData.hours }} </span>
                  <b>:</b>
                  <span>{{ Number(timeData.minutes) < 10 ? `0${timeData.minutes}` : timeData.minutes }} </span>
                  <b>:</b>
                  <span>{{ Number(timeData.seconds) < 10 ? `0${timeData.seconds}` : timeData.seconds }} </span>
                </template>
              </van-count-down>
            </div>
          </template>

          <template v-if="isBuy && (!isTime || isBegTime)">
            <div class="right-end">距开始还剩</div>
            <div class="right-time">
              <van-count-down :time="begTimeStr" format="DD 天 HH 时 mm 分 ss 秒" class="bottom_time" @finish="begTimeBtn">
                <template #default="timeData">
                  <span>{{ timeData.days }} 天</span>
                  <span>{{ Number(timeData.hours) < 10 ? `0${timeData.hours}` : timeData.hours }} </span>
                  <b>:</b>
                  <span>{{ Number(timeData.minutes) < 10 ? `0${timeData.minutes}` : timeData.minutes }} </span>
                  <b>:</b>
                  <span>{{ Number(timeData.seconds) < 10 ? `0${timeData.seconds}` : timeData.seconds }} </span>
                </template>
              </van-count-down>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    goods_info: {
      type: Object,
      default: () => ({})
    },
    goods_type: {
      type: String,
      default: ""
    },
    loaging: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //限时购开始时间
      beginTime: 0,
      //显示购结束时间
      endTime: 0,

      endTimeStr: "",
      begTimeStr: "",
      //限时购开关
      isBuy: false,
      isTime: false,
      isBegTime: false,

      goodsInfo: {},
      limit_buy: {},

      istimestamp: null, //倒计时
      timestamp: Date.parse(new Date()) / 1000, //获取当前时间戳

      limitedTimeCustomName: "限时购", //* 自定义限时购名称
      isFinished: false //倒计时是否已结束
    };
  },
  components: {},
  computed: {},
  mounted() {
    //* 限时购，后台自定义限时购显示的文案
    let goodsInfo = this.goods_info.get_goods;
    if (goodsInfo && goodsInfo.has_one_goods_limit_buy && goodsInfo.has_one_goods_limit_buy.status === 1) {
      if (goodsInfo.has_one_goods_limit_buy.display_name) {
        this.limitedTimeCustomName = goodsInfo.has_one_goods_limit_buy.display_name;
      }
    }
    // this.init();
  },
  watch: {
    loaging(newVal, oldVal) {
      this.init();
    }
  },
  methods: {
    countDownEndFun() {
      if (this.goods_info.start_time && this.goods_info.end_time && this.timestamp >= this.goods_info.start_time && this.timestamp < this.goods_info.end_time) {
        this.begTimeBtn(); //从未开始进入已开始
      }
      if (this.goods_info.end_time && this.timestamp >= this.goods_info.end_time) this.timeEnd(); //活动结束
      this.timestamp = Date.parse(new Date()) / 1000;
      this.$refs.countDown.reset();
      this.isFinished = true;
    },
    begTimeBtn() {
      this.$emit("begTimeBtn");
    },
    timeEnd() {
      //倒计时结束时触发的回调方法
      // console.log("倒计时结束时触发的回调方法，timeEnd()");
      this.$emit("timeEnd");
    },
    init() {
      this.goodsInfo = this.goods_info.get_goods;
      this.limit_buy = this.goodsInfo.has_one_goods_limit_buy;
      //限时购
      if (!this.fun.isTextEmpty(this.limit_buy)) {
        this.isBuy = this.limit_buy.status == 1 ? true : false;
        this.beginTime = this.limit_buy.start_time;

        if (this.isBuy) {
          this.timeCompare(this.beginTime);
        }

        this.endTime = new Date(parseInt(this.limit_buy.end_time) * 1000);
        this.endTimeStr = String(this.endTime);

        // this.timeLimit = data.status;
      }

      if (this.goods_type == "grab_group") {
        this.istimestamp = this.timestamp < this.goodsInfo.start_time ? Number(this.goodsInfo.start_time) : Number(this.goodsInfo.end_time);
      }
    },
    //获取时间-限时购
    timeCompare(begin) {
      let beginTime = parseInt(begin) * 1000;
      let now = Date.parse(new Date());

      if (now >= beginTime) {
        this.isTime = true;
      } else {
        this.isTime = false;
        this.isBegTime = true;
        this.begTimeStr = String(beginTime - now);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.price_time {
  width: 100%;
  height: 3.125rem;
  background: #f15353;
  display: flex;
  align-items: center;

  .img {
    width: 10%;

    img {
      width: 60%;
    }
  }

  .text {
    width: 10%;
    color: #fff;
    font-size: 14px;
  }

  .price {
    width: 40%;
    font-size: 14px;
    color: #fff;
    padding-left: 0.875rem;
    text-align: left;

    font {
      font-size: 22px;
    }
  }

  .time {
    width: 40%;

    span {
      color: #fff;
      font-size: 12px;
      display: inline-block;
      margin-bottom: 0.25rem;
    }

    em {
      background-color: #fff;
      color: #333;
      display: inline-block;
      text-align: center;
    }
  }
}

.rob-time1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.875rem;
  height: 2.75rem;
  background: url(../../../assets/images/goods/time_buy_bg@2x.png) no-repeat center;
  background-size: 100%;
  color: #fff;
  font-size: 0.875rem;
  font-weight: bold;

  span {
    color: #fff;
    font-size: 0.75rem;
  }

  em {
    background-color: #fff;
    color: #000;
    font-weight: bold;
  }

  .bottom_time {
    margin-top: 0.125rem;
    line-height: 1rem;
    color: #fff;
  }
}

.time-buy {
  padding: 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: url(../../../assets/images/hot-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .buy-left {
    font-size: 20px;
    color: #fff;
    word-break: break-all;
    width: 50%;
    text-align: left;
  }

  .buy-right {
    .right-end {
      font-size: 12px;
      color: #f32e02;
      margin-bottom: 0.3rem;
    }

    .right-time {
      display: flex;

      span {
        font-size: 12px;
        line-height: 1.25rem;
      }

      span:not(:first-child) {
        margin: 0 0.3rem;
        display: block;
        padding: 1px 4px;
        background-color: #fc4a04;
        color: #fff;
      }
    }
  }

  .bottom_time {
    display: flex;
    color: #f32e02;
  }
}
</style>
