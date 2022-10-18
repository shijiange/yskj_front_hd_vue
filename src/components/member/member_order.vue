<template>
  <div
    id="hotel_order"
    :style="{
      backgroundColor: Params.memberordercolor,
      backgroundImage:
        'url(' +
        (Params.memberorderbg == '2' ? Params.memberorderimg : '') +
        ')',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <router-link
      :to="
        fun.getUrl('hotelOrderlist', {
          status: '0',
          orderType: 'hotel'
        })
      "
    >
      <div class="title_box">
        <div class="spare"></div>
        <span>{{ Params.memberordername }}</span>
        <i class="fa fa-angle-right"></i>
      </div>
    </router-link>
    <ul class="item_box">
      <li>
        <router-link
          :to="
            fun.getUrl('hotelOrderlist', {
              status: '1',
              orderType: 'hotel'
            })
          "
        >
          <div class="badge-hotel" v-if="waitPay != 0">
            {{ waitPay }}
          </div>
          <img :src="Order[0].imgurl" alt="" />
          <span :style="{ color: Order[0].color }">{{ Order[0].text }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="
            fun.getUrl('hotelOrderlist', {
              status: '2',
              orderType: 'hotel'
            })
          "
        >
          <div class="badge-hotel" v-if="waitSure != 0">
            {{ waitSure }}
          </div>
          <img :src="Order[1].imgurl" alt="" />
          <span :style="{ color: Order[1].color }">{{ Order[1].text }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="
            fun.getUrl('hotelOrderlist', {
              status: '3',
              orderType: 'hotel'
            })
          "
        >
          <div class="badge-hotel" v-if="waitEnter != 0">
            {{ waitEnter }}
          </div>
          <img :src="Order[2].imgurl" alt="" />
          <span :style="{ color: Order[2].color }">{{ Order[2].text }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="
            fun.getUrl('hotelOrderlist', {
              status: '5',
              orderType: 'hotel'
            })
          "
        >
          <div class="badge-hotel" v-if="waitCheckOut != 0">
            {{ waitCheckOut }}
          </div>
          <img :src="Order[3].imgurl" alt="" />
          <span :style="{ color: Order[3].color }">{{ Order[3].text }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["member_order", "Order", "Params"],
  data() {
    return {
      waitPay: 0,
      waitSure: 0,
      waitEnter: 0,
      waitCheckOut: 0,
    };
  },
  mounted() {
    if (this.member_order.hotel_order) {
      this.member_order.hotel_order.forEach(item => {
        if (item.status == 0) {
          this.waitPay = item.total;
        } else if (item.status == 1) {
          this.waitSure = item.total;
        } else if (item.status == 2) {
          this.waitEnter = item.total;
        } else if (item.status == 11) {
          this.waitCheckOut = item.total;
        }
      });
    }
  },
  watch:{
    member_order: {
      handler(newValue, oldValue) {
        if (this.member_order.hotel_order) {
          this.member_order.hotel_order.forEach(item => {
            if (item.status == 0) {
              this.waitPay = item.total;
            } else if (item.status == 1) {
              this.waitSure = item.total;
            } else if (item.status == 2) {
              this.waitEnter = item.total;
            } else if (item.status == 11) {
              this.waitCheckOut = item.total;
            }
          });
        }
      },
      deep: true
    }
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// 酒店的样式
#hotel_order {
  background: #fff;
  margin: 0.625rem 0;

  .title_box {
    line-height: 2.5rem;
    display: flex;
    padding: 0 0.875rem;
    font-weight: bold;
    position: relative;
    // border-bottom: solid 0.0625rem #ebebeb;
    .spare {
      width: 0.25rem;
      height: 1rem;
      border-radius: 0.0625rem;
      background-color: #f15353;
      margin-top: 0.75rem;
      margin-right: 0.375rem;
    }

    span {
      font-size: 16px;
    }

    i {
      font-size: 1.25rem;
      color: #c9c9c9;
      line-height: 2.5rem;
      position: absolute;
      right: 0.875rem;
    }
  }

  .item_box {
    display: flex;
    padding: 0.875rem 0;

    li {
      width: 25%;
      position: relative;

      img {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 1.25rem;
      }

      span {
        margin-top: -0.25rem;
        display: block;
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>
