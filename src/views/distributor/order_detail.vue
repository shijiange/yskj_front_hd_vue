<template>
  <div id="goodsinfo" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title :hide="false" text="订单详情"></c-title>

    <div class="addr">
      <ul class="addr-info">
        <template v-if="orderType == 'DeliveryReplenish' && !this.fun.isTextEmpty(this.service_station)">
          <i class="iconfont icon-dingwei"></i>
          <li style="margin-bottom: 0.5rem; font-size: 16px;">
            服务站：{{ service_station.service_name }}&nbsp;&nbsp;&nbsp;（{{ service_station.mobile }}）
          </li>
          <li style="color: #999;">
            {{ service_station.full_address }}
          </li>
          <div style="border-bottom: 1px solid #ebebeb; height: 0.5rem;"></div>
        </template>
        <template v-if="order_data.dispatch_type_id == 8 && !this.fun.isTextEmpty(order_data.package_deliver)">
          <li style="margin-bottom: 0.5rem; font-size: 14px;">提货人：{{ receiver }}&nbsp;&nbsp;&nbsp;{{ mobile }}</li>
          <li style="margin-bottom: 0.5rem; font-size: 14px;">
            提货点：{{ package_deliver.deliver_name }}&nbsp;&nbsp;&nbsp;{{ package_deliver.deliver_mobile }}
          </li>
          <li style="color: #333;">
            <i class="iconfont icon-dingwei"></i>
            {{ package_deliver.full_address }}
          </li>
        </template>
        <template v-if="order_data.dispatch_type_id == 8 && this.fun.isTextEmpty(order_data.package_deliver)">
          <li style="margin-bottom: 0.5rem; font-size: 14px;">
            获取收货信息出错了，请联系客服！
          </li>
        </template>
        <template v-if="order_data.dispatch_type_id != 8">
          <i class="iconfont icon-dingwei"></i>
          <li style="margin-bottom: 0.5rem; font-size: 16px;">收件人：{{ receiver }}&nbsp;&nbsp;&nbsp;（{{ mobile }}）</li>
          <li style="color: #999;">
            <span v-if="orderType == 'hotel'" style="margin-right: 0.3125rem;"> {{ hotel_name | escapeTitle }} </span
            >{{ address }}
          </li>
        </template>
      </ul>
      <div class="clearfix"></div>
    </div>
    <div
      class="goods"
      v-for="(good, i) in order_data.has_many_order_goods"
      :key="i"
      @click="toGoodsDetail(good, order_data.is_virtual, good.is_course)"
    >
      <div class="img"><img :src="good.thumb" /></div>

      <ul class="inner">
        <li class="name">{{ good.title | escapeTitle }}</li>
        <li class="option" v-show="order_data.is_virtual == 0">规格: {{ good.goods_option_title }}</li>
        <li class="option" style="margin-top: 2px;" v-if="order_data.plugin_id == 40">
          押金:
        </li>
      </ul>
      <ul class="price">
        <li class="money" style="margin-top: 3px;">
          <small>{{ $i18n.t('money') }}</small>
          {{ good.price }}
        </li>
        <li class="option" style="margin-top: 10px;" v-if="!(orderType == 'hotel')">×{{ good.total }}</li>
        <li class="option" v-if="orderType == 'hotel'">{{ night_day }}晚{{ order_data.goods_total }}间</li>
        <li class="option" style="margin-top: 9px;" v-if="order_data.plugin_id == 40">
          {{ good.lease_toy_goods.deposit }}
        </li>
      </ul>
      <div style="clear: both;"></div>
    </div>
    <div class="tbs">
      <div class="tbs-number-tra">
        <ul class="number">
          <li class="left">订单编号:</li>
          <li class="right">{{ order_data.order_sn }}</li>
        </ul>
        <ul class="tra" v-if="order_data.plugin_id == 40">
          <li class="left">租期:</li>
          <li class="right">{{ order_data.lease_toy.return_days }}天</li>
        </ul>
        <ul class="tra">
          <li class="left">交易状态:</li>
          <li class="right">{{ order_data.status_name }}</li>
        </ul>
        <ul class="tra" v-if="order_data.note">
          <li class="left">买家留言:</li>
          <li class="right">{{ order_data.note }}</li>
        </ul>
        <ul class="tra" v-if="order_data.plugin_id == 40">
          <li class="left">租金总金额:</li>
          <!-- <li class="right">{{$i18n.t('money')}}{{order_data.goods_price*order_data.lease_toy.return_days}}</li> -->
          <li class="right">{{ $i18n.t('money') }}{{ order_data.order_goods_price }}</li>
        </ul>
      </div>
      <div class="tbs-number-tra" v-if="orderType == 'hotel'">
        <ul class="number">
          <li class="left">入住日期:</li>
          <li class="right">{{ hotel_start }}</li>
        </ul>
        <ul class="number">
          <li class="left">离店日期:</li>
          <li class="right">{{ hotel_end }}</li>
        </ul>
        <ul class="number">
          <li class="left">天数:</li>
          <li class="right">{{ night_day }}天</li>
        </ul>
        <ul class="number">
          <li class="left">房间数量:</li>
          <li class="right">{{ order_data.goods_total }}间</li>
        </ul>
      </div>
      <template v-if="order_data.cashier_order">
        <div class="info">
          <ul class="time">
            <li class="left">下单时间:</li>
            <li class="right">{{ order_data.cashier_order.created_at }}</li>
          </ul>
          <ul class="name">
            <li class="left">姓名:</li>
            <li class="right">{{ order_data.cashier_order.realname }}</li>
          </ul>
          <ul class="member">
            <li class="left">电话:</li>
            <li class="right">{{ order_data.cashier_order.mobile }}</li>
          </ul>
        </div>
      </template>

      <template v-if="orderType != 'myDeliver'">
        <template v-if="order_data.pay_type_name">
          <ul class="Pay-method">
            <li class="left">支付方式:</li>
            <li class="right">{{ order_data.pay_type_name }}</li>
          </ul>
        </template>
        <div id="discount">
          <template v-for="(info,index) in order_data.order_discount">
            <ul class="Discount" :key="index">
              <li class="left">{{ info.name }}:</li>
              <li class="right">{{ $i18n.t('money') }}{{ info.amount }}</li>
            </ul>
          </template>
          <template v-for="(item,ind) in order_data.order_fees">
            <ul class="Discount" :key="ind">
              <li class="left">{{ item.name }}:</li>
              <li class="right">{{ $i18n.t('money') }}{{ item.amount }}</li>
            </ul>
          </template>
        </div>
        <template v-if="pay_type_id == '' && orderType == 'shop'">
          <ul class="Fre">
            <li class="left">运费:</li>
            <li class="right">{{ $i18n.t('money') }}{{ order_data.dispatch_price }}</li>
          </ul>
        </template>
        <ul class="Sub">
          <li class="left">商品小计:</li>
          <li class="right" v-if="!(order_data.plugin_id == 40)">
            {{ $i18n.t('money') }}{{ order_data.order_goods_price }}
          </li>
          <li class="right" v-if="order_data.plugin_id == 40">
            {{ $i18n.t('money') }}{{ order_data.order_goods_price }}
          </li>
        </ul>
        <ul class="Sub" v-if="order_data.plugin_id == 40">
          <li class="left">押金:</li>
          <li class="right">{{ $i18n.t('money') }}{{ order_data.lease_toy.deposit_total }}</li>
        </ul>
        <ul class="Real-pay">
          <li class="left" v-if="!(order_data.plugin_id == 40)">
            实付款:
          </li>
          <li class="left" v-if="order_data.plugin_id == 40">
            合计:（押金{{ $i18n.t('money') }}{{ order_data.lease_toy.deposit_total }}可退）:
          </li>
          <li class="right">
            <small>{{ $i18n.t('money') }}</small>
            {{ order_data.price }}
          </li>
        </ul>
      </template>
    </div>
    <div class="detail_pay">
      <div
        class="order_delete"
        v-for="(item, index) in order_data.button_models"
        :key="index"
        @click="operation(item, order_data)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="qrcode">
      <van-popup v-model="showQrcode" position="center" modal="true">
        <img :src="qrcode" style="width: 100%;" />
        <div style="height: 1.875rem;">请核销员扫码</div>
      </van-popup>
    </div>

    <van-dialog v-model="dialogVisible" :showConfirmButton="false">
      <div class="title">确认发货</div>
      <section style="width: 100%; text-align: left;">
        <div style="width: 100%; height: 80px;" v-if="addresseeInfo">
          <div style="width: 28%; height: 30px; float: left; line-height: 30px;">
            收件人信息:
          </div>
          <div style="width: 70%; float: left;">
            <div style="width: 100%; height: 30px; line-height: 30px; overflow: visible;">
              <span>收件人:{{ addresseeInfo.realname }}</span>
              <span>({{ addresseeInfo.mobile }})</span>
            </div>
            <div style="width: 100%; overflow: visible; margin-bottom: 10px;">收货地址:{{ addresseeInfo.address }}</div>
          </div>
        </div>
        <div style="width: 100%; height: 45px; line-height: 45px;">
          <div style="float: left; width: 28%; height: 45px;">快递公司:</div>
          <div style="float: left; height: 45px; width: 60%;">
            <van-button plain type="primary" @click="seleRegional">
              {{ regional }}
            </van-button>
          </div>
        </div>
        <div style="width: 100%; height: 45px; line-height: 45px;">
          <div style="float: left; width: 28%; height: 45px;">快递单号:</div>
          <div style="float: left; height: 45px; width: 60%;">
            <van-cell-group>
              <van-field v-model="numberName" placeholder="请输入快递单号" />
            </van-cell-group>
          </div>
        </div>
      </section>
      <div class="foot">
        <van-button type="primary" style="float: right;" @click="sendGoogs">确 定 </van-button>
        <van-button type="default" style="float: right;" @click="sendCancel">取 消 </van-button>
      </div>
    </van-dialog>
    <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
      <van-picker :columns="columns" @change="onChange" @cancel="onCancelbtn" @confirm="onConfirmbtn" show-toolbar />
    </van-popup>
  </div>
</template>

<script>
import order_detail_controller from './order_detail_controller';

export default order_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.qrcode {
  width: 100%;
  margin: 0 auto;
}

.van-dialog {
  width: 90%;
  padding: 4%;
  height: 22rem;

  .van-dialog__content {
    section {
      height: 15rem;
    }

    .title {
      padding-bottom: 1.5rem;
      font-weight: bold;
    }
  }
}

#goodsinfo {
  .addr {
    text-align: left;
    padding: 0 0.75rem;
    background: #fff;
    border-bottom: #ebebeb 0.0625rem solid;
    margin-bottom: 0.625rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;

    i {
      font-size: 1rem;
      color: #333;
      float: left;
      margin-right: 0.625rem;
      margin-top: 0.0625rem;
    }

    p {
      text-align: left;

      span {
        color: #858585;
        font-size: 12px;
      }
    }

    .addr-info {
      /* float: left; */
      font-size: 14px;
    }

    .clearfix {
      clear: both;
    }
  }

  .goods {
    background-color: #fff;

    .img {
      padding: 0.625rem 1rem;
      width: 26vw;
      float: left;

      img {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
    }

    .inner {
      width: 50%;
      float: left;
      padding: 0.625rem 0 0 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .name {
      text-align: left;
      margin-bottom: 0.625rem;
      font-size: 14px;
    }

    .money {
      margin-bottom: 0.625rem;
      font-size: 14px;
    }

    small {
      font-size: 12px;
    }

    .price {
      width: 20%;
      float: left;
      align-items: center;
      text-align: right;
      padding: 0.625rem 0 0 0;
    }

    .option {
      color: #888;
      font-size: 12px;
      flex: 1;
    }
  }

  .detail_good {
    background: #fff;

    .content {
      text-align: left;
      background: #efeded;
      padding: 0.625rem;
      color: #8c6700;
    }

    a {
      color: #000;
    }

    h3 {
      text-align: left;
      margin: 0.5625rem 0;

      i {
        font-size: 1.25rem;
        padding-right: 0.3125rem;
      }
    }
  }

  .tbs {
    font-size: 14px;
    width: 100%;
    margin-bottom: 6.5rem;

    .left {
      flex: 2;
      text-align: left;
    }

    .right {
      flex: 3;
      text-align: right;
    }

    .tbs-number-tra {
      background-color: #fff;
      width: 100%;
      padding: 0.625rem 0.875rem;
      margin-top: 0.625rem;

      li {
        line-height: 1.875rem;
      }
    }

    .Sub {
      width: 100%;
      display: flex;
      justify-content: space-between;
      line-height: 1.875rem;
      padding: 0 0.875rem 0.625rem 0.875rem;
      background-color: #fff;
    }

    .Real-pay {
      background-color: #fff;
      display: flex;
      justify-content: flex-end;
      line-height: 2.25rem;
      padding: 0 0.875rem;
      border-top: solid 0.0625rem #ebebeb;
      font-size: 16px;

      .left {
        color: #333;
        text-align: right;
      }

      .right {
        color: #f15353;
        font-size: 18px;
        flex: 0;
        display: flex;
      }

      small {
        font-size: 12px;
      }
    }

    .Fre {
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      padding: 0 0.875rem;
      line-height: 1.875rem;
    }

    #discount {
      margin-top: 0.625rem;
      padding-top: 0.625rem;
      background-color: #fff;
    }

    .Discount {
      width: 100%;
      line-height: 1.875rem;
      display: flex;
      justify-content: space-between;
      padding: 0 0.875rem;
    }

    .number,
    .tra {
      line-height: 1.75rem;
      display: flex;
      justify-content: space-between;
    }

    .Pay-method {
      background-color: #fff;
      width: 100%;
      display: flex;
      justify-content: space-between;
      line-height: 2.25rem;
      padding: 0 0.875rem;
      border-top: solid 0.0625rem #ebebeb;
    }

    .info {
      padding: 0 0.75rem;
      line-height: 1.75rem;
      border-top: solid 0.0625rem #e2e2e2;

      .time,
      .name,
      .member {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .detail_pay {
    min-height: 3.0625rem;
    width: 100%;
    background: #fff;
    padding: 0 0.75rem;
    border-top: 1px solid #ebebeb;
    position: fixed;
    bottom: 0;
    box-sizing: border-box;

    .order_delete {
      margin-left: 0.5rem;
      background: #fff;
      padding: 0.25rem 0.625rem;
      margin-top: 0.6875rem;
      border-radius: 0.25rem;
      color: #333;
      float: right;
      border: 0.0625rem solid #666;
    }

    input {
      padding: 0.25rem 0.625rem;
      border: solid 0.0625rem #666;
      border-radius: 0.1875rem;
      background-color: #fff;
      margin-top: 0.6875rem;
      float: right;
      color: #333;
      font-size: 12px;
    }
  }

  .rent-info {
    border-bottom: solid 0.0625rem #e2e2e2;
    background-color: #fff;

    ul {
      padding: 1rem 0.875rem;

      li {
        display: flex;
        justify-content: space-between;
        line-height: 1.5rem;
        font-size: 14px;

        span:first-child {
          color: #8c8c8c;
        }
      }
    }

    .info {
      border-top: solid 0.0625rem #ebebeb;
      margin: 0 0.875rem;
      line-height: 1.875rem;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
  }

  .commodity {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;

    .jpg {
      width: 30%;
      overflow: hidden;
      margin-right: 0.625rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    ul {
      position: relative;
      width: 70%;

      li {
        display: flex;
        justify-content: space-between;
      }

      li:first-child {
        margin-bottom: 0.625rem;

        .left {
          text-align: left;
          width: 60%;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        i {
          font-size: 0.75rem;
          color: #ff9500;
        }
      }

      .red {
        font-size: 14px;
        color: #f15353;

        small {
          font-size: 12px;
          color: #333;
          margin-left: 0.625rem;
        }
      }

      .left {
        font-size: 14px;
      }

      .rent {
        position: absolute;
        bottom: 0;
      }
    }
  }
}

#goodsinfo.pcStyle {
  .detail_pay {
    width: 375px;
  }

  .goods {
    .img {
      width: 26%;
    }
  }
}

.mint-header {
  background: none;
  color: #666;
}

.is-fixed .mint-header-title {
  font-weight: bold;
}

.mint-header.is-fixed {
  border-bottom: 0.0625rem solid #ebebeb;
  background: #fff;
  z-index: 99;
}

.is-right a {
  font-size: 12px;
}
</style>
