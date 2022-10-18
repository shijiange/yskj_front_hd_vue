<template>
  <div id="orderlist" v-if="Params.memberordershow != 2"
       :style="{
        backgroundColor: Params.memberordercolor,
        backgroundImage:
          'url(' +
          (Params.memberorderbg == '2'
            ? Params.memberorderimg
            : '') +
          ')',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      }">
    <div class="ordertltie">
      <router-link :to="fun.getUrl('orderlist', { status: '0' })">
        <div class="spare"></div>
        <div class="ordername">
          {{ Params.memberordername }}
        </div>
        <i class="fa fa-angle-right"></i>
      </router-link>
    </div>
    <div class="order_all">
      <router-link :to="fun.getUrl('orderlist', { status: '1' })">
        <div class="order_pub"
             v-if="Order[0]">
          <div class="badge"
               v-if="waitPay != 0">{{ waitPay }}</div>
          <img :src="Order[0].imgurl"
               alt="" />
          <br />{{ Order[0].text }}
        </div>
      </router-link>
      <router-link :to="fun.getUrl('orderlist', { status: '2' })">
        <div class="order_pub"
             v-if="Order[1]">
          <div class="badge "
               v-if="waitSend != 0">
            {{ waitSend }}
          </div>
          <img :src="Order[1].imgurl"
               alt="" />
          <br />{{ Order[1].text }}
        </div>
      </router-link>
      <router-link :to="fun.getUrl('orderlist', { status: '3' })">
        <div class="order_pub"
             v-if="Order[2]">
          <div class="badge "
               v-if="waitReceive != 0">
            {{ waitReceive }}
          </div>
          <img :src="Order[2].imgurl"
               alt="" />
          <br />{{ Order[2].text }}
        </div>
      </router-link>
      <router-link :to="fun.getUrl('aftersaleslist')">
        <div class="order_pub"
             v-if="Order[3]">
          <div class="badge"
               v-if="waitrRefund != 0">
            {{ waitrRefund }}
          </div>
          <img :src="Order[3].imgurl"
               alt="" />
          <br />{{ Order[3].text }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
// import { Toast } from 'vant';
export default {
  props: ["Params", "Order", "member_order"],
  data() {
    return {
      waitPay: 0,
      waitSend: 0,
      waitReceive: 0,
      waitrRefund: 0,
      name_of_withdrawal_text: ""
    };
  },
  mounted() {
    if (this.member_order.order) {
      // 0 待付款 1待发货 2待收货 3完成
      this.member_order.order.map(item => {
        if (item.status == 0) {
          this.waitPay = item.total;
        } else if (item.status == 1) {
          this.waitSend = item.total;
        } else if (item.status == 2) {
          this.waitReceive = item.total;
        } else if (item.status == 11) {
          this.waitrRefund = item.total;
        }
      });
    }
    this.customizeIncome();
  },
  watch: {
    member_order: {
      handler(newValue, oldValue) {
        if (this.member_order.order) {
          this.member_order.order.map(item => {
            if (item.status == 0) {
              this.waitPay = item.total;
            } else if (item.status == 1) {
              this.waitSend = item.total;
            } else if (item.status == 2) {
              this.waitReceive = item.total;
            } else if (item.status == 11) {
              this.waitrRefund = item.total;
            }
          });
        }
      },
      deep: true
    }
  },
  methods: {
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义提现字段
      this.name_of_withdrawal_text = mailLanguage.income.name_of_withdrawal;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  #orderlist {
    background: #fff;
    margin: 0.625rem 0;
  }

  .ordertltie {
    text-align: left;
    width: 100%;
    height: 2.5rem;
    // border-bottom: 0.0625rem solid #ebebeb;
    box-sizing: border-box;
    position: relative;

    a {
      display: flex;
      padding: 0 14px;
    }

    .spare {
      width: 0.25rem;
      height: 1rem;
      border-radius: 0.0625rem;
      background-color: #f15353;
      margin-top: 0.75rem;
      margin-right: 0.375rem;
    }

    i {
      line-height: 2.5rem;
      color: #c9c9c9;
      font-size: 1.25rem;
      float: right;
      position: absolute;
      right: 0.875rem;
    }

    a .ordername {
      float: left;
      line-height: 2.5rem;
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }
  }

  .order_pub {
    box-sizing: border-box;

    i {
      font-size: 24px;
      color: #999;
    }
  }

  .order_all {
    padding: 0.875rem 0;
    color: #666;
    overflow: hidden;
    display: flex;

    img {
      width: 2.25rem;
      height: 2.25rem;
    }

    a {
      width: 25%;
      -webkit-box-flex: 1;
    }

    .order_pub {
      padding-top: 0.125rem;
      text-align: center;
      color: #666;
      position: relative;
      font-size: 12px;

      i {
        font-size: 24px;
        color: #999;
        display: inline-block;
      }
    }
  }

  #orderlist .puball {
    color: #000;
    border-left: 0.0625rem solid #8f9295;
  }

  .badge {
    position: absolute;
    left: 56%;
    top: 0.125rem;
    background-color: #fff;
    border-radius: 0.625rem;
    color: #f15353;
    line-height: 0.875rem;
    font-size: 12px;
    padding: 0 0.3125rem;
    border: solid 1px #f15353;
  }

  .badge-hotel {
    position: absolute;
    left: 56%;
    top: 0.125rem;
    background-color: #fff;
    border: solid 1px #57d5ff;
    border-radius: 0.625rem;
    color: #57d5ff;
    line-height: 0.875rem;
    font-size: 12px;
    padding: 0 0.3125rem;
  }
</style>
