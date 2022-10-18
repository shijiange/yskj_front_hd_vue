<template>
  <div id="aftersales">
    <c-title :hide="false" text="售后详情"></c-title>
    <!-- <div class="bar-header">
      <span class="title">退款</span>
    </div> -->

    <!-- <div class="section">
      <div class="close">
        <div class="state">
          <b>{{ status_name }}</b>
          <p v-if="reject_reason">
            驳回原因：<span>{{ reject_reason }}</span>
          </p>
        </div>
        <div class="flow">
          <h2>退款申请流程：</h2>
          <ul>
            <li>1、发起退款申请</li>
            <li>2、商家确认后退款到您的账户</li>
            <li><p>如果商家未处理：请及时与商家联系</p></li>
          </ul>
        </div>

      </div>
      <div class="address" v-if="address && address.contact">
        <dl>
          <dt>退货地址信息</dt>
          <dd>收件人：{{ address.contact }}</dd>
          <dd>联系电话：{{ address.mobile }}</dd>
          <dd>
            退货地址：{{ address.province_name }} {{ address.city_name }}
            {{ address.district_name }} {{ address.street_name }}
            {{ address.address }}
          </dd>
        </dl>
      </div>
      <div class="line"></div>
      <div class="consult-detail">
        <h1>协商详情</h1>
        <ul class="list">
          <li>
            <span>售后类型：</span> <b> {{ refund_type_name }}</b>
          </li>
          <li>
            <span>退款金额：</span> <b> {{$i18n.t('money')}} {{ price }}</b>
          </li>
          <li>
            <span>退款原因：</span> <b> {{ reason }}</b>
          </li>
          <li>
            <span>退款说明：</span> <b> {{ content }}</b>
          </li>
          <li>
            <span>申请时间：</span> <b> {{ create_time }}</b>
          </li>
          <li>
            <span>卖家留言：</span> <b>{{ remark.length > 0 ? remark : '无' }}</b>
          </li>
          <li v-if="images && images.length > 0">
            <span>图片凭证：</span>
            <div class="imgUploader">
              <div class="photoBox" v-for="(val, index) in images" :key="index">
                <img :src="val" @click="showimg(index)" />
              </div>
            </div>
            <van-image-preview v-model="show" :images="images" :start-position="imgIndex"> </van-image-preview>
          </li>
        </ul>
      </div>

      <div style="height: 3.0625rem;"></div>
      <div class="detail_pay" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" v-if="button_models.length > 0 && !fun.isWXWork()">
        <template  v-for="(item, index) in button_models">
          <div
            :key="index"
            v-if="index < 2"
            class="order_delete"
            @click="operation(item)"
          >
            {{ item.name }}
          </div>
          <div :key="index" v-if="index == 2 && button_models.length > 2" class="order_delete red-button" @click.stop="showMore(item)">更多</div>
          <div class="trans" :key="index" v-if="index == 2 && showID == item.value"></div>
          <div class="more-button" :key="index" v-if="index == 2 && showID == item.value">
            <p v-for="(item, ind) in button_models" :key="ind" v-shop="ind >= 2"  @click="operation(item)">
              {{ item.name }}
            </p>
          </div>
        </template>
      </div>

    </div> -->

    <div class="aftersales-status">
      <span>{{ status_name }}</span>
      <span v-if="reject_reason"> 驳回原因：{{ reject_reason }} </span>
    </div>

    <div class="page-wrapper">
      <div class="return-info">
        <div class="return-info-text">售后信息</div>
        <div class="return-goods-list">
          <div class="return-goods-item" v-for="item in refund_order_goods" :key="item.id">
            <div class="return-goods-face">
              <img :src="item.goods_thumb" alt="" />
            </div>
            <div class="return-goods-content">
              <div class="return-goods-title">{{ item.goods_title }}</div>
              <div class="return-goods-desc">
                <labels v-if="item.marketing_order_goods && item.marketing_order_goods.is_gift" labelStyle="margin-top:0px;" :labels="[item.marketing_order_goods.gift_type == 4 ? '换购' : '赠品']"></labels>
                <div class="return-goods-num">数量：{{ item.refund_total }}</div>
                <div class="return-goods-price" v-if="myData.refund_type != 2">
                  申请退款金额：<span class="goods-price">￥{{ item.refund_price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="return-details">
          <div class="return-details-item">售后类型：{{ refund_type_name }}</div>
          <div class="return-details-item" v-if="myData.refund_type != 2">
            退款金额：{{ $i18n.t("money") }} {{ price }}
            <div v-if="freight_price || other_price" style="color:#999;font-size:12px;">
              （<template v-if="freight_price">含运费{{ $i18n.t("money") }}{{ freight_price }}</template
              ><template v-if="other_price"> 其他费用{{ $i18n.t("money") }}{{ other_price }}</template
              >）
            </div>
          </div>
          <div class="return-details-item">售后原因：{{ reason }}</div>
          <div class="return-details-item">申请说明：{{ content }}</div>
          <div class="return-details-item" v-if="images && images.length > 0">
            <div class="photoBox" v-for="(val, index) in images" :key="index">
              <img :src="val" @click="showimg(index)" />
            </div>
            <van-image-preview v-model="show" :images="images" :start-position="imgIndex"> </van-image-preview>
          </div>
          <div class="return-details-item">申请时间：{{ create_time }}</div>
          <div class="return-details-item">卖家留言：{{ remark.length > 0 ? remark : "无" }}</div>
        </div>
      </div>
      <div class="address-info">
        <div class="address-info-text">退货地址信息</div>
        <div class="address-contact address-text">{{ address.contact }} {{ address.mobile }}</div>
        <div class="address-site address-text">{{ address.province_name }} {{ address.city_name }} {{ address.district_name }} {{ address.street_name }} {{ address.address }}</div>
        <div class="address-express address-text" v-if="return_express && return_express.express_sn">
          <div class="address-express-num">快递单号：{{ return_express.express_sn }}</div>
          <div class="address-express-btn" @click="gotoLogistics">查看物流</div>
          <i class="iconfont icon-advertise-next"></i>
        </div>
      </div>
      <div class="recovery-info" v-if="myData.other_data && myData.refund_way_type == 1">
        <!-- refund_way_type:1京东上门||0：自行寄回 -->
        <div class="recovery-info-text">取件信息</div>
        <div class="recovery-items">
          <div class="recovery-itme">
            <div class="recovery-text">
              取件地址：
            </div>
            <div class="recovery-content">
              <div class="recovery-desc">{{ myData.other_data.pick_up_name }}/{{ myData.other_data.pick_up_tel }}</div>
              <div class="recovery-desc">
                {{ myData.other_data.pick_up_address }}
              </div>
            </div>
          </div>
          <div class="recovery-itme">
            <div class="recovery-text">
              取件时间：
            </div>
            <div class="recovery-content">{{ myData.other_data.start_time }} {{ myData.other_data.end_time }}</div>
          </div>
        </div>
      </div>
      <div class="negotiation-record" @click="gotoNegotiationRecord">
        <span>协商记录</span>
        <i class="iconfont icon-advertise-next"></i>
      </div>
    </div>

    <div style="height: 3.0625rem;"></div>
    <div class="detail_pay" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" v-if="button_models.length > 0 && !fun.isWXWork()">
      <template v-for="(item, index) in button_models">
        <div :key="index" v-if="index < 2" class="order_delete" @click="operation(item)">
          {{ item.name }}
        </div>
        <div :key="index" v-if="index == 2 && button_models.length > 2" class="order_delete red-button" @click.stop="showMore(item)">更多</div>
        <div class="trans" :key="index" v-if="index == 2 && showID == item.value"></div>
        <div class="more-button" :key="index" v-if="index == 2 && showID == item.value">
          <p v-for="(item, ind) in button_models" :key="ind" v-show="ind >= 2" @click="operation(item)">
            {{ item.name }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import order_aftersalescontroller from "./order_aftersalescontroller";
export default order_aftersalescontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.aftersales-status {
  background-color: #f15353;
  color: white;
  line-height: 2.25rem;
  padding: 1rem 0.875rem;
  text-align: left;
  span {
    font-size: 16px;
    margin-bottom: 0.625rem;
    display: block;
  }
}
.page-wrapper {
  padding: 0.625rem 0.938rem;
}
.return-info {
  padding: 0 0.844rem;
  background-color: #ffffff;
  border-radius: 0.625rem;
  .return-info-text {
    display: flex;
    align-items: center;
    height: 2.5rem;
    font-size: 15px;
    color: #292929;
    border-bottom: 0.031rem solid #f2f2f2;
  }
  .return-goods-list {
    border-bottom: 0.031rem solid #f2f2f2;
    .return-goods-item {
      display: flex;
      padding: 0.719rem 0;
      .return-goods-face {
        width: 3.438rem;
        height: 3.438rem;
        border-radius: 0.188rem;
        img {
          width: 3.438rem;
          height: 3.438rem;
          border-radius: 0.188rem;
        }
      }
      .return-goods-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        height: 3.438rem;
        margin-left: 0.438rem;
        .return-goods-title {
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 13px;
          color: #333333;
        }
        .return-goods-desc {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .return-goods-num {
            font-size: 11px;
            color: #717171;
          }
          .return-goods-price {
            font-size: 12px;
            color: #1e1e1e;
            .goods-price {
              color: #f14e4e;
            }
          }
        }
      }
    }
  }
  .return-details {
    padding: 0.5rem 0;
    text-align: left;
    font-size: 11px;
    color: #767676;
    .return-details-item {
      display: flex;
      flex-wrap: wrap;
      line-height: 1.625rem;
      font-size: 13px;
      color: #292929;
      .photoBox {
        position: relative;
        width: 4.5rem;
        height: 4.5rem;
        border: 1px dashed #c0ccda;
        margin: 0.5rem 0;
        margin-right: 0.5rem;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
}
.address-info {
  padding: 0 0.844rem;
  margin-top: 0.625rem;
  text-align: left;
  background-color: #ffffff;
  border-radius: 0.625rem;
  .address-info-text {
    display: flex;
    align-items: center;
    height: 2.5rem;
    font-size: 15px;
    color: #292929;
    border-bottom: 0.031rem solid #f2f2f2;
  }
  .address-text {
    line-height: 1.5rem;
    font-size: 13px;
    color: #454545;
  }
  .address-contact {
    padding-top: 0.5rem;
  }
  .address-express {
    display: flex;
    align-items: center;
    padding-bottom: 0.5rem;
    .address-express-num {
      flex: 1;
    }
    .address-express-btn {
      font-size: 11px;
      color: #f14e4e;
    }
    .icon-advertise-next {
      color: #f14e4e;
    }
  }
}
.recovery-info {
  padding: 0 0.844rem;
  margin-top: 0.625rem;
  text-align: left;
  background-color: #ffffff;
  border-radius: 0.625rem;
  .recovery-info-text {
    display: flex;
    align-items: center;
    height: 2.5rem;
    font-size: 15px;
    color: #292929;
    border-bottom: 0.031rem solid #f2f2f2;
  }
  .recovery-items {
    padding: 0.5rem 0;
    .recovery-itme {
      display: flex;
      padding: 0.3rem 0;
      .recovery-text {
        padding-right: 0.5rem;
      }
      .recovery-content {
        flex: 1;
      }
    }
  }
}

.negotiation-record {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.5rem;
  padding: 0 0.844rem;
  margin-top: 0.625rem;
  font-size: 15px;
  color: #292929;
  background-color: #fff;
  border-radius: 0.625rem;
}

#aftersales {
  .imgUploader {
    margin-top: 10px;
    width: 75%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    background: #fff;

    .photoBox {
      position: relative;
      width: 4.5rem;
      height: 4.5rem;
      border: 1px dashed #c0ccda;
      margin-right: 0.2rem;
      margin-left: 0.2rem;
      margin-bottom: 0.2rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }

  .address {
    box-sizing: border-box;
    background: #fff;
    padding: 0 0.3125rem;
    margin-top: 0.9375rem;
    text-align: left;

    dt {
      height: 2.5rem;
      line-height: 2.5rem;
      font-size: 16px;
      border-bottom: solid 0.0625rem #ccc;
      text-indent: 0.3125rem;
    }

    dd {
      line-height: 1.875rem;
      font-size: 15px;
      text-indent: 0.9375rem;
    }
  }

  #list {
    margin-top: 3.25rem;

    i {
      background: #dadada;
      border-radius: 1rem;
      padding: 0.125rem 0.625rem;
      font-size: 12px;
    }

    p {
      text-align: left;
    }

    .mytall {
      position: relative;
      width: 80%;
      background: #dbd9b7;
      margin: 0.3125rem auto;
      border-radius: 0.25rem;
      padding: 0.625rem;
      margin-bottom: 0.9375rem;

      h4 {
        margin: 0;
        line-height: 1.7rem;
        text-align: left;
        border-bottom: #fff 0.0625rem solid;
      }

      .atte {
        position: absolute;
        left: -0.5625rem;
        display: block;
        width: 0;
        height: 0;
        top: 10%;
        border-top: 0.625rem solid transparent;
        border-right: 0.625rem solid #dbd9b7;
        border-bottom: 0.625rem solid transparent;
      }
    }

    .you {
      background: #b3d1c1;

      .attes {
        position: absolute;
        right: -0.5625rem;
        display: block;
        width: 0;
        height: 0;
        top: 10%;
        border-top: 0.625rem solid transparent;
        border-left: 0.625rem solid #b3d1c1;
        border-bottom: 0.625rem solid transparent;
      }
    }
  }
}

.bar-header {
  width: 100%;
  height: 2.5rem;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.bar-header .title {
  display: inline-block;
  line-height: 2.75rem;
  font-size: 20px;
}

.section {
  margin-bottom: 1.25rem;
  width: 100%;
}

.section .close::after {
  display: table;
  content: "";
  clear: both;
}

.section .close {
  background: #fff;
}

.state {
  background-color: #f15353;
  color: white;
  line-height: 2.25rem;
  padding: 1rem 0.875rem;
  text-align: left;

  b {
    font-size: 16px;
    margin-bottom: 0.625rem;
    display: block;
  }
}

.flow {
  text-align: left;

  h2 {
    line-height: 2.25rem;
    border-bottom: solid 0.0625rem #ebebeb;
    margin-left: 0.875rem;
    font-weight: normal;
    font-size: 14px;
  }

  ul {
    font-size: 12px;
    padding: 0.625rem 0.875rem;
  }

  li {
    line-height: 1.75rem;

    p {
      color: #8c8c8c;
      display: inline-block;
    }
  }
}

.section .close p {
  line-height: 1.125rem;
  text-align: left;
}

.section .close p b {
  padding-right: 0.5rem;
}

.section .close p span {
  color: #fff;
}

.consult-detail {
  background-color: #fff;
  margin: 0.625rem 0 0.9375rem 0;

  h1 {
    margin-left: 0.875rem;
    padding-right: 0.875rem;
    line-height: 2.25rem;
    border-bottom: solid 0.0625rem #ebebeb;
    font-size: 14px;
    font-weight: normal;
    text-align: left;
  }

  ul {
    padding: 0.625rem 0.875rem;
    font-size: 12px;
  }

  li {
    display: flex;
    line-height: 1.75rem;

    span {
      color: #8c8c8c;
    }

    b {
      margin-left: 0.625rem;
      font-weight: normal;
    }
  }
}

.section .back {
  width: 100%;
  height: 1.25rem;
}

.section .detail {
  line-height: 2.5rem;
  font-weight: bold;
  background: #fff;
  font-size: 16px;
  margin-bottom: 1.25rem;
  padding-left: 1.25rem;
}

.section .list {
  text-align: left;
}

.section .list > div {
  line-height: 2.5rem;
  background: #fff;
  border: 0.0625rem solid #aaa;
  border-bottom: 0;
  border-radius: 0.1875rem;
  padding-left: 0.9375rem;
}

.section .list > div:first-child {
  margin-bottom: 1.25rem;
  border: 0.0625rem solid #aaa;
}

.section .list > div:last-child {
  border-bottom: 0.0625rem solid #aaa;
}

.section .list > div span {
  color: #888;
}

.section .list > p {
  text-align: right;
  padding-right: 0.625rem;
}

.section .list .question {
  display: inline-block;
  width: 0.9375rem;
  height: 0.9375rem;
  border-radius: 50%;
  border: 0.0625rem solid #aaa;
  margin: 0 0.3125rem;
  text-align: center;
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;

  .order_delete {
    min-width: 65px;
    margin-left: 0.5rem;
    background: #fff;
    padding: 0.25rem 0.625rem;
    border-radius: 15px;
    color: #333;
    border: 0.0625rem solid #666;
  }

  .red-button {
    border: 0.0625rem solid #f15353;
    background-color: #f15353;
    color: #fff;
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

  .trans {
    position: absolute;
    right: 1.875rem;
    bottom: 2.5rem;
    width: 0;
    height: 0;
    border-width: 0.8rem 0.8rem 0;
    border-style: solid;
    border-color: #f5f5f5 transparent transparent;
  }

  .more-button {
    position: absolute;
    border: solid 1px #e2e2e2;
    width: 70px;
    border-radius: 5px;
    background: #fff;
    right: 0.875rem;
    bottom: 3.2rem;

    p {
      padding: 0.3rem 0.1rem;
      border-top: 1px solid #e2e2e2;
    }
  }

  &.pcStyle {
    width: 375px;
  }
}
</style>
