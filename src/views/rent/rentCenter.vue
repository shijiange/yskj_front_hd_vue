<template>
  <div id="rentCenter">
    <div class="m-header">
      <router-link :to="fun.getUrl('rentDepositDetail')">
        <div class="money">押金明细</div>
      </router-link>
      <h3>{{$i18n.t('money')}}{{data.cash}}</h3>
      <p>我的押金</p>
      <h4>冻结金额{{data.freeze}}{{$i18n.t('元')}} <b @click="changePop()">?</b></h4>
      <div class="btn">

        <router-link :to="fun.getUrl('rentCharge')">
          <button type="button">充值</button>
        </router-link>

        <router-link :to="fun.getUrl('rentDeposit')">
          <button type="button">{{this.fun.initWithdrawal()}}</button>
        </router-link>

      </div>
    </div>

    <!-- 弹窗 -->
    <div class="modal"
         v-show="active">
      <div class="modal-dialog">
        <div class="close"
             @click="closeModal()">
          <img src="../../assets/images/close.png">
        </div>
        <h1 class="title">冻结金额说明</h1>
        <p>如果你无法简洁的表达你的想法，那么说明你还不都了解他---阿尔伯特-爱因斯坦</p>
      </div>
    </div>

    <div id="orderlist">
      <div class="ordertltie">

        <router-link :to="fun.getUrl('rentMyOrder',{ status:'0' })">
          <div class="ordername">我的订单</div>
          <div class=""><i class="fa fa-angle-right"></i>
          </div>
        </router-link>
      </div>
      <div class="order_all">
        <router-link :to="fun.getUrl('rentMyOrder',{ status:'1' })">
          <div class="order_pub">
            <div class="badge">{{waitPay==0?'':waitPay}}</div>
            <i class="fa money"></i>
            <br>待付款
          </div>
        </router-link>
        <router-link :to="fun.getUrl('rentMyOrder',{ status:'2' })">

          <div class="order_pub">
            <div class="badge ">{{waitSend==0?'':waitSend}}</div>
            <i class="fa box"></i>
            <br>待发货
          </div>
        </router-link>
        <router-link :to="fun.getUrl('rentMyOrder',{ status:'3' })">

          <div class="order_pub">
            <div class="badge ">{{waitReceive==0?'':waitReceive}}</div>
            <i class="fa car"></i>
            <br>待收货
          </div>

        </router-link>

        <router-link :to="fun.getUrl('rentMyOrder',{ status:'4' })">
          <div class="order_pub">
            <div class="badge">{{waitrRefund==0?'':waitrRefund}}</div>
            <i class="fa refun"></i>
            <br>待归还
          </div>
        </router-link>

        <router-link :to="fun.getUrl('rentAfterSalas')">
          <div class="order_pub">
            <div class="badge">{{waitrRefund==0?'':waitrRefund}}</div>
            <i class="fa refun"></i>
            <br>待退款
          </div>
        </router-link>
      </div>

      <div class="ordertltie">

        <router-link :to="fun.getUrl('rentGuide')">
          <div class="ordername">租赁指南</div>
          <div class=""><i class="fa fa-angle-right"></i>
          </div>
        </router-link>
      </div>
      <div class="ordertltie"
           @click="btnsPop=true">

        <router-link :to="fun.getUrl('')">
          <div class="ordername">客服热线</div>
          <div class="tel">789879676</div>
        </router-link>
        <div class="modal"
             v-show="btnsPop"
             @click.stop="btnsPop=false">
          <div class="btns"
               @click.stop>
            <button>呼叫</button>
            <button>添加到通讯录</button>
          </div>
        </div>
      </div>
    </div>

    <c-Footer></c-Footer>
  </div>
</template>

<script>
import cFooter from "./component/rentFoot";
export default {
  components: { cFooter },
  data() {
    return {
      active: false,
      btnsPop: false,
      data: {
        cash: "2000.00",
        freeze: "1000.00"
      }
    };
  },
  methods: {
    changePop() {
      this.active = !this.active;
    },
    closeModal() {
      this.active = false;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.list1 {
  height: 2.75rem;
  width: 97%;
  background: #fff;
  padding: 0 0 0 3%;
  border-top: 0.0625rem solid #e6e1e1;
  font-size: 14px;
  line-height: 2.75rem;
  color: #333;
  text-align: left;
}

.list1 i.fa.fa-angle-right {
  float: right;
  line-height: 2.75rem;
  display: inline-block;
  font-size: 14px;
  margin-right: 0.375rem;
  color: #929292;
  width: 1.25rem;
  height: 1.25rem;
  text-align: center;
  background-size: 1.25rem;
}

#rentCenter {
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
      color: #aaa;
    }

    h3 {
      clear: both;
      color: #e51c23;
      line-height: 1.875rem;
    }

    p {
      clear: both;
      color: #aaa;
      line-height: 1.875rem;
    }

    h4 {
      clear: both;

      b {
        width: 0.9375rem;
        height: 0.9375rem;
        border-radius: 50%;
        background: #e51c23;
        line-height: 0.9375rem;
        text-align: center;
        display: inline-block;
        color: #fff;
      }
    }

    .btn {
      padding: 0.625rem 0;

      button {
        width: 5rem;
        height: 1.875rem;
        border-radius: 0.3125rem;
        border: 0.0625rem solid #ccc;
        outline: 0;
        background: #fff;
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;

    .btns {
      margin: 60% 15%;
      width: 70%;

      button {
        float: left;
        width: 100%;
        height: 2.1875rem;
        text-align: left;
        line-height: 2.1875rem;
        background: #fff;
        border: 0;
        outline: 0;
      }

      button:first-child {
        border-bottom: 0.0625rem solid #ccc;
      }
    }

    .modal-dialog {
      width: 80%;
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

  #orderlist {
    margin: 0.625rem 0;
  }

  .ordertltie {
    background: #fff;
    text-align: left;
    text-indent: 0.9375rem;
    width: 100%;
    height: 2.286rem;
    border-bottom: 0.0625rem solid #f5f3f3;
    box-sizing: border-box;

    i {
      line-height: 2.286rem;
      color: #999;
      font-size: 20px;
      float: right;
      padding-right: 0.9375rem;
    }

    a .ordername {
      float: left;
      line-height: 2.286rem;
      font-size: 14px;
      color: #333;
    }

    .tel {
      float: right;
      color: #e51c23;
      padding-right: 0.9375rem;
      line-height: 2.286rem;
    }
  }

  .order_pub {
    width: 20%;
    position: relative;
    box-sizing: border-box;
  }

  #orderlist .puball {
    color: #000;
    border-left: 0.0625rem solid #8f9295;
  }

  .badge {
    position: absolute;
    left: 50%;
    top: -0.3125rem;
    background-color: #ff4949;
    border-radius: 0.625rem;
    color: #fff;
    line-height: 0.875rem;
    font-size: 12px;
    padding: 0 0.3125rem;
  }

  .order {
    width: 100%;
    background: #fff;
    margin-top: 0.625rem;
    border-bottom: 0.0625rem solid #f5f3f3;
  }

  .order_all {
    background: #fff;
    width: 100%;
    padding: 0.875rem 0;
    color: #666;
    overflow: hidden;
    margin-bottom: 1.25rem;
  }

  .order_all a i {
    font-size: 20px;
    margin-bottom: 0.25rem;
    width: 1.25rem;
    height: 1.25rem;
    background-size: 1.25rem;
  }

  .order_all a .money {
    background-image: url(../../assets/images/money.png);
  }

  .order_all a .box {
    background-image: url(../../assets/images/box.png);
  }

  .order_all a .car {
    background-image: url(../../assets/images/car.png);
  }

  .order_all a .refun {
    background-image: url(../../assets/images/refun.png);
  }

  .order_pub {
    height: 2.375rem;
    float: left;
    border-left: 0.0625rem solid #eee;
    padding-top: 0.125rem;
    text-align: center;
    color: #8c8c8c;
    position: relative;
    font-size: 12px;
  }

  .order_pub span {
    height: 0.875rem;
    background: #f30;
    border-radius: 0.5rem;
    position: absolute;
    top: 0;
    right: 6%;
    padding: 0 0.3125rem;
    font-size: 12px;
    color: #fff;
    line-height: 0.875rem;
  }
}
</style>












