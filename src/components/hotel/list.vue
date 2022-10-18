<template>
  <div>
    <div
      class="goods"
      v-for="(item,i) in datas" :key='i'
      style="display: flex;"
      @click="gotoHomePage(item)"
    >
      <div class="img">
        <img :src="item.thumb" />
      </div>
      <ul class="info">
        <li class="info_a">
          {{ item.hotel_name }}
          <font>{{ item.has_one_category.name }}</font>
        </li>
        <li class="info_b">
          <span v-if="false">4.8<font>棒</font></span
          >{{ item.order_total }}+人消费
        </li>
        <li class="info_c">距我{{ item.distance }}{{ item.unit }}</li>
        <li class="info_d" v-if="!fun.isTextEmpty(item.order_time)">
          最新预定：{{ getTime(item.order_time) }}
        </li>
        <li class="info_e">
          <font>{{$i18n.t('money')}}</font><span>{{ item.room_amount }}</span>
          <font>起</font>
          <!-- <span
            style="float:right"
            v-if="show"
            class="boder-btn"
            @click.stop="goChooseRoom(item)"
            >订房</span
          > -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {return{};},
  props: {
    datas: {
      default: []
    },
    show: {
      default: false
    },
    start: {
      default: ""
    },
    end: {
      default: ""
    }
  },
  methods: {
    gotoHomePage(value) {
      this.$router.push(
        this.fun.getUrl(
          "HotelHome",
          { id: value.id },
          { city: value.address.city, start: this.start, end: this.end }
        )
      );
    },

    getTime(time) {
      return time.day == 0
        ? time.hour == 0
          ? time.min == 0
            ? "一分钟之前"
            : `${time.min}分钟之前`
          : `${time.hour}小时之前`
        : `${time.day}天之前`;
    },

    // goChooseRoom(value) {
    //   this.$router.push(
    //     this.fun.getUrl(
    //       "HotelChooseRoom",
    //       { id: value.id },
    //       { start: this.start, end: this.end }
    //     )
    //   );
    // }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.goods {
  display: flex;
  margin-bottom: 0.625rem;

  .img {
    width: 6.25rem;
    height: 6.25rem;
    background: #f8f8f8;
    overflow: hidden;
    margin: 0 0.625rem;

    img {
      width: 100%;
    }
  }

  .info {
    text-align: left;
    width: 16rem;
    padding-right: 0.625rem;
    border-bottom: solid 0.0625rem #ebebeb;
    padding-bottom: 0.625rem;

    .info_a {
      font-size: 16px;
      font-weight: bold;
      line-height: 1.5rem;
      max-height: 3rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;

      font {
        font-size: 12px;
        color: #8c8c8c;
        font-weight: normal;
        margin-left: 0.625rem;
      }
    }

    .info_b {
      font-size: 12px;
      color: #8c8c8c;

      span {
        font-size: 20px;
        color: #337ef9;
        font-weight: bold;
        margin-right: 0.625rem;

        font {
          font-size: 14px;
          font-weight: normal;
        }
      }
    }

    .info_c {
      font-size: 12px;
      color: #8c8c8c;
    }

    .info_d {
      font-size: 12px;
      color: #259b24;
    }

    .info_e {
      color: #f15353;

      span {
        font-size: 20px;
        font-weight: bold;
      }

      font:last-child {
        color: #8c8c8c;
      }

      .boder-btn {
        letter-spacing: 1px;
        margin: 0.65rem 0 0 0.6rem;
        background-color: #f15353;
        font-size: 16px;
        font-weight: 500;
        width: 3.6rem;
        height: 1.4rem;
        line-height: 1.4rem;
        text-align: center;
        border-radius: 0.2rem;
        border: 1px solid #f15353;
        color: #fff;
      }
    }
  }
}
</style>
