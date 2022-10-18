<template>
  <div id="hasBeenReturned">

    <c-title :hide="false" text='我的订单'></c-title>

    <div class="m-header">
      <router-link :to="fun.getUrl('rentDepositDetail')">
        <div class="money">转赠记录</div>
      </router-link>
      <h3>已归还 </h3>
      <p>您的订单于{{returned.endTim}}已归还</p>
    </div>
    <div class="returnAddr">
      <div class="return addr">
        <div class="lf"><span>还</span></div>
        <div class="rt">
          <p>收货人：{{returned.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{returned.tel}}</p>
          <p>归还地址：{{returned.addr}}</p>
        </div>
      </div>
      <div class="recive addr">
        <div class="lf"><span>收</span></div>
        <div class="rt">
          <p>收货人：{{returned.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{returned.tel}}</p>
          <p>归还地址：{{returned.addr}}</p>
        </div>
      </div>
      <div class="remark"><i class="iconfont icon-jiage"></i>备注：请于五月二号上午送达，下午无人在公司</div>
    </div>
    <div class="content">
      <div class="data">
        <div class="lf">
          <i class="iconfont icon-quyufenhong"></i>
          租赁日期
        </div>
        <div class="rt">
          <p>起始：{{returned.startTim}}</p>
          <p>归还：{{returned.endTim}}</p>
          <h3>共计：{{returned.day}}天</h3>
        </div>
      </div>
      <div class="pro">
        <img src="" alt=""/>
        <div class="title">
          <p>{{returned.name}}</p>
          <b>颜色：{{returned.color}}</b>
        </div>
        <div class="rt">
          <p class="rent">租金：{{$i18n.t("money")}}{{returned.send}}/天</p>
          <p>押金：{{$i18n.t("money")}}{{returned.rental}}</p>
          <p>x{{returned.num}}</p>
        </div>
      </div>
      <div class="money">
        <p><span class="lf">租金 <i @click="rentalTip()">?</i></span> <span class="rt">{{$i18n.t("money")}}{{returned.rental}}</span>
        </p>
        <p><span class="lf">押金 <b>(冻结)</b><i @click="depositTip()">?</i></span> <span class="rt">{{$i18n.t("money")}}{{returned.deposit}}</span>
        </p>
        <p><span class="lf">运费 </span> <span class="rt">{{$i18n.t("money")}}{{returned.send}}</span></p>
        <div class="all">
          合计：<span>{{$i18n.t("money")}}{{returned.send}}</span>
        </div>
      </div>
    </div>
    <ul class="orderDetail">
      <li><span class="lf">订单编号：</span> <span class="rt">14143213123123131</span></li>
      <li><span class="lf">支付方式：</span> <span class="rt">微信支付</span></li>
      <li><span class="lf">下单时间：</span> <span class="rt">{{returned.startTim}}</span></li>
      <li><span class="lf">付款时间：</span> <span class="rt">{{returned.startTim}}</span></li>
    </ul>

    <!-- 弹窗 -->
    <div class="modal" v-show="rental">
      <div class="modal-dialog">
        <div class="close" @click="closeModal()">
          <img src="../../../assets/images/close.png">
        </div>
        <h1 class="title">租金说明</h1>
        <p>如果你无法简洁的表达你的想法，那么说明你还不都了解他---阿尔伯特-爱因斯坦</p>
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="modal" v-show="deposit">
      <div class="modal-dialog">
        <div class="close" @click="closeModal()">
          <img src="../../../assets/images/close.png">
        </div>
        <h1 class="title">押金冻结说明</h1>
        <p>如果你无法简洁的表达你的想法，那么说明你还不都了解他---阿尔伯特-爱因斯坦</p>
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";

export default {
  components: { cTitle },
  data() {

    return {
      rental: false,
      deposit: false,
      returned: {
        time: "16:56",
        name: "李天一",
        tel: "13234454546",
        addr: "广东省广州市白云区云霄路",
        startTim: "2017-05-02 00:00",
        endTim: "2018-07-04 00:00",
        day: "2",
        send: "10.00",
        rental: "22000.00",
        deposit: "1000.00",
        num: "10",
        color: "白色"
      }
    };
  },
  methods: {
    rentalTip() {
      this.rental = !this.rental;
    },
    depositTip() {
      this.deposit = !this.deposit;
    },
    closeModal() {
      this.rental = false;
      this.deposit = false;
    }
  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  #hasBeenReturned {
    .m-header {
      text-align: center;
      padding: 0 0.9375rem;
      background: #fff;
      clear: both;

      .money {
        text-align: right;
        float: right;
        height: 2.5rem;
        line-height: 2.5rem;
        color: #e51c23;
      }

      h3 {
        line-height: 1.875rem;
        padding-top: 1.25rem;
        text-align: center;
        padding-left: 2.5rem;
        font-weight: normal;
        color: #ff9500;

        i {
          padding-left: 0.625rem;
          color: #919097;
        }
      }

      p {
        clear: both;
        line-height: 1.875rem;

        i {
          padding-right: 0.625rem;
        }
      }
    }

    .returnAddr {
      margin-top: 0.625rem;

      .addr {
        display: flex;
        flex-flow: row;
        height: 4.375rem;
        background: #fff;
        border-bottom: 0.0625rem solid #ccc;

        div.lf {
          width: 3.125rem;

          span {
            width: 1.875rem;
            height: 1.875rem;
            display: inline-block;
            text-align: center;
            line-height: 1.875rem;
            border-radius: 50%;
            color: #fff;
            margin-top: 1.25rem;
          }
        }

        div.rt {
          flex: 1;
          padding: 0.9375rem;

          p {
            text-align: left;
            line-height: 1.25rem;
          }
        }
      }

      .return {
        div.lf {
          span {
            background: #ff9500;
          }
        }

        div.rt {
          color: #ff9500;
        }
      }

      .recive {
        div.lf {
          span {
            background: #666;
          }
        }

        div.rt {
          color: #101010;
        }
      }

      .remark {
        line-height: 1.25rem;
        background: #fff;
        padding: 0.625rem 0.9375rem;
        text-align: left;

        i {
          padding-right: 8px;
        }
      }
    }

    .content {
      background: #fff;
      margin-top: 0.625rem;

      .data {
        height: 3.75rem;
        padding: 0.625rem 0.9375rem;

        div.lf {
          line-height: 3.75rem;
        }

        div.rt {
          text-align: right;

          h3 {
            color: #e51c23;
            font-weight: normal;
            font-size: 14px;
            padding-top: 0.25rem;
          }
        }
      }

      .pro {
        background: #e3e3e3;
        margin-top: 0.625rem;
        padding: 0.625rem 0.9375rem;
        overflow: hidden;

        img {
          float: left;
          width: 4.375rem;
          height: 3.4375rem;
          background: #fff;
        }

        .title {
          float: left;
          padding-left: 0.3125rem;
          text-align: left;

          p {
            padding-bottom: 0.1875rem;
          }

          b {
            color: #555;
            font-size: 12px;
            font-weight: normal;
          }
        }

        div.rt {
          text-align: right;

          .rent {
            color: #e51c23;
          }
        }
      }

      .money {
        overflow: hidden;
        padding-top: 0.625rem;

        p {
          line-height: 1.5625rem;
          height: 1.5625rem;
          padding: 0 0.9375rem;

          span.lf {
            b {
              color: #e51c23;
              font-weight: normal;
            }

            i {
              width: 1.0625rem;
              height: 1.0625rem;
              display: inline-block;
              background: #e51c23;
              border-radius: 50%;
              line-height: 1.0625rem;
              text-align: center;
              color: #fff;
              margin-left: 0.3125rem;
              font-style: normal;
            }
          }
        }

        p:nth-child(3) {
          padding-bottom: 0.625rem;
        }

        .all {
          border-top: 0.0625rem solid #ccc;
          padding: 0.625rem 0.9375rem;
          text-align: right;
          height: 2.0625rem;
          line-height: 2.0625rem;

          span {
            color: #e51c23;
            font-size: 16px;
          }
        }
      }
    }

    .orderDetail {
      padding: 0.625rem 0.9375rem;
      background: #fff;
      margin-top: 0.625rem;

      li {
        height: 1.875rem;
        line-height: 1.875rem;
      }
    }

    /* 弹窗样式 */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 999;

      .modal-dialog {
        width: 18.75rem;
        height: 11.875rem;
        background: #fff;
        border-radius: 0.375rem;
        border-top: 0.625rem solid #f15353;
        margin: 50% auto;
        position: relative;

        .close {
          position: absolute;
          top: -3.125rem;
          right: 0;
        }

        .title {
          color: #666;
          font-size: 14px;
          font-weight: bold;
          line-height: 2.1875rem;
          text-align: left;
          padding-left: 1.5625rem;
          padding-top: 0.625rem;
        }

        p {
          padding: 0 0.9375rem;
          text-align: left;
        }
      }
    }
  }
</style>
