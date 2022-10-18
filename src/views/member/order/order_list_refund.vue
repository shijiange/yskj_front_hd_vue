<template>
  <div id="refund">
    <c-title :hide="false" :text="title"></c-title>

    <div class="return-goods" v-if="returnGoolsList && returnGoolsList.length > 0">
      <div class="return-goods-item" v-for="item in returnGoolsList" :key="item.id">
        <div class="goods-img">
          <img :src="item.goods_thumb" alt="" />
        </div>
        <div class="goods-content">
          <div class="goods-title">
            {{ item.goods_title }}
          </div>
          <div class="goods-options">{{ item.goods_option_title }} x{{ item.refund_total }}</div>
          <div class="goods-price">￥{{ item.refund_price }}</div>
        </div>
      </div>
    </div>

    <div class="info">
      <ul class="mode" style="position: relative;">
        <li>申请类型：<span style="position: absolute; left: 24%; z-index: 999;"></span></li>
        <li class="select">
          <button @click="openComponentsPop('returnType')">{{ returnTypeItem.name ? returnTypeItem.name : "请选择" }}</button>
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
    </div>
    <div class="info" v-if="order_status >= 2 && returnTypeItem.value == 0">
      <ul class="mode" style="position: relative;">
        <li>收货状态：<span style="position: absolute; left: 24%; z-index: 999;"></span></li>
        <li class="select">
          <button @click="openComponentsPop('receivingStatus')">{{ receivingStatus == "not_received" ? "未收到货" : "已收到货" }}</button>
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
    </div>
    <div class="info" v-if="returnTypeItem.value != 2">
      <ul class="cause" style="position: relative;padding-right:0;">
        <li>
          申请原因：
        </li>
        <li class="select" style="line-height:1.5rem;display:flex;align-items:center;">
          <button @click="openComponentsPop('returnReason')">
            <span style="display:inline-block;text-align:left;">{{ returnReasons ? returnReasons : "请选择" }}</span>
          </button>
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
      <ul class="sum">
        <li>退款商品金额：</li>
        <li class="right">{{ money }}{{ $i18n.t("元") }}</li>
      </ul>
    </div>
    <div class="prompt" v-show="this.returnTypeItem.value != 2">提示：您的退款最大金额为{{ money }}{{ $i18n.t("元") }}</div>
    <van-cell-group>
      <van-field
        v-if="refundable_freight"
        type="number"
        v-model="freight_price"
        label="退款运费金额："
        right-icon="warning-o"
        :placeholder="`不超过${refundable_freight}元`"
        @click-right-icon="showInstructionsFn"
        label-class="w-7"
        :readonly="order_status == 1 ? true : false"
      />
      <van-field v-if="refundable_other" type="number" v-model="other_price" label="退款其他金额：" :placeholder="`不超过${refundable_other}元`" error-message="包含手续费、服务费" label-class="w-7" />
    </van-cell-group>

    <div class="info" v-if="returnTypeItem.value != 0 && receivingStatus != 'not_received'">
      <ul class="mode" style="position: relative;">
        <li>返回方式：<span style="position: absolute; left: 24%; z-index: 999;"></span></li>
        <li class="select">
          <button @click="openComponentsPop('returnMethods')">{{ returnMethodsName }}</button>
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
    </div>
    <div class="recovery-info" v-if="returnTypeItem.value != 0 && returnMethods == 1 && jdTakeParts != null">
      <div class="recovery-itme" @click="openComponentsPop('editAddress')">
        <div class="recovery-text">
          取件地址：
        </div>
        <div class="recovery-content" v-if="jd_address.pick_up_name">
          <div class="recovery-desc">{{ jd_address.pick_up_name }}/{{ jd_address.pick_up_tel }}</div>
          <div class="recovery-desc">{{ jd_address.addressName }} {{ jd_address.street }} {{ jd_address.pick_up_address }}</div>
        </div>
        <div class="recovery-content" v-else>请选择</div>
        <div class="next-icon">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="recovery-itme" @click="openComponentsPop('pickUpTime')">
        <div class="recovery-text">
          取件时间：
        </div>
        <div class="recovery-content">
          <div class="icon_time" style="text-align:right;">
            <span v-if="start_time">{{ start_time.substring(5) }} - {{ end_time.substring(5) }}</span>
            <i v-if="!start_time" class="iconfont icon-record_time"></i>
          </div>
        </div>
        <div class="next-icon">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="recovery-itme">
        <div class="recovery-text">
          重量：
        </div>
        <div class="recovery-content">
          <div class="inputs">
            <div class="input-item">
              <input type="text" v-model="jd_weight" />
              <span class="unit">kg</span>
            </div>
          </div>
        </div>
      </div>
      <div class="recovery-itme">
        <div class="recovery-text">
          体积：
        </div>
        <div class="recovery-content">
          <div class="inputs">
            <div class="input-item">
              <input type="text" placeholder="长" v-model="jd_length" />
              <span class="unit">cm</span>
            </div>
            <span class="ride">*</span>
            <div class="input-item">
              <input type="text" placeholder="宽" v-model="jd_width" />
              <span class="unit">cm</span>
            </div>
            <span class="ride">*</span>
            <div class="input-item">
              <input type="text" placeholder="高" v-model="jd_height" />
              <span class="unit">cm</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="explain">
      <span>申请说明：</span>
      <textarea type="text" placeholder="请输入申请售后服务的原因" maxlength="100" v-model="returnExplain"></textarea>
    </div>

    <!-- 售后类型 -->
    <returnTypePop ref="returnType" :refundTypes="refundTypes" @confirm="confrimReturnType" />

    <!-- 选择售后商品 -->
    <returnGoodsPop ref="returnGoods" :goodsList="returnAllGoodsList" @confirm="confrimReturnGoods" />

    <!-- 退款原因 -->
    <return-reason-pop ref="returnReason" @confirm="confirmReturnReason" v-if="returnTypeItem && returnTypeItem.reasons" :reasonList="returnTypeItem.reasons[receivingStatus]" />

    <!-- 收货状态 -->
    <receivingStatusPop ref="receivingStatus" @confirm="confirmReceivingStatus" />

    <!-- 退货方式 -->
    <returnMethodsPop ref="returnMethods" @confirm="confirmReturnMethods" :send_back_way="send_back_way" />

    <!-- 取件时间 -->
    <pickUpTimePop ref="pickUpTime" @confirm="confirmPickUpTime"></pickUpTimePop>

    <!-- 修改地址 -->
    <editAddressPop ref="editAddress" @confirm="confirmEditAddress" />

    <div class="explain">
      <span>上传图片凭证：</span>
      <yz_uploader ref="yz_uploader" v-model="fileList1" />
    </div>

    <div style="height: 1.25rem;"></div>
    <div class="submit-refund" @click="confirmRefund" style="position: relative;">
      提交申请
      <yzSubscribe v-on:confirm="confirmSub" v-on:error="errorSub" :tagName="'refund'" :styleWidth="'300px'" :styleSubWidth="'300px'"></yzSubscribe>
    </div>

    <van-popup v-model="showInstructions" round position="bottom" closeable :style="{ height: '30%' }">
      <van-nav-bar title="退款运费说明" />
      <div style="padding: 1rem;line-height: 1.5rem;">
        由卖家承担：货品质量问题，假货等<br />
        由买家承担：个人原因不喜欢，不想要等
      </div>
    </van-popup>
  </div>
</template>
<script>
import order_list_refundcontroller from "./order_list_refundcontroller";
export default order_list_refundcontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#refund {
  text-align: left;
  font {
    display: block;
    color: #8c8c8c;
    line-height: 2rem;
    padding: 0 0.625rem;
    font-size: 14px;
  }

  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0.625rem 0.875rem;
    align-items: center;
    span {
      width: 5.375rem;
      flex: none;
      font-size: 16px;
      line-height: 1;
    }
    .my-value {
      color: #f15353;
      flex: 2;
      text-align: left;
      font-size: 16px;
      span {
        color: red;
      }
    }
    .mint-popup {
      width: 100%;
    }
  }

  .el-select {
    width: 100%;
  }

  .info {
    background-color: #fff;

    .cause,
    .mode {
      line-height: 2.75rem;
      margin-left: 0.875rem;
      padding-right: 0.875rem;
      border-bottom: solid 0.0625rem #ebebeb;
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      i {
        font-size: 18px;
        color: #999;
        margin-left: 0.5rem;
      }

      li:nth-child(2) {
        color: #8c8c8c;
      }

      input {
        text-align: right;
        width: 90%;
        border: none;
      }

      .select {
        flex: 2;
        text-align: right;
      }

      button {
        width: 90%;
        color: #999;
        border: none;
        text-align: right;
        padding: 0;
        background-color: #fff;
      }
    }

    .sum,
    .explain {
      display: flex;
      padding: 0 0.875rem;
      line-height: 2.75rem;
      font-size: 14px;

      li:nth-child(2) {
        color: #f15353;
      }
    }

    .explain {
      li:nth-child(2) {
        flex: 3;
      }

      input {
        border: none;
        width: 100%;
        font-size: 14px;
        color: #8c8c8c;
      }
    }

    .sum .right,
    .explain .right {
      padding-left: 0.625rem;
    }
  }

  .explain {
    background-color: #fff;
    padding: 0 0.875rem 0.875rem 0.875rem;
    font-size: 14px;

    span {
      line-height: 2.75rem;
      text-align: left;
    }

    textarea {
      border: none;
      background-color: #fafafa;
      width: 100%;
      height: 4.5rem;
      border-radius: 0.25rem;
      padding: 0.375rem;
      line-height: 1.25rem;
      color: #8c8c8c;
      font-size: 12px;
    }
  }

  .prompt {
    line-height: 1.875rem;
    padding: 0 0.875rem;
    font-size: 12px;
    color: #8c8c8c;
  }

  .return-cause {
    h1 {
      line-height: 2.8125rem;
      text-align: center;
      font-size: 14px;
      border-bottom: solid 1px #e2e2e2;
    }

    ul {
      padding: 0.625rem 0.875rem 0 0.875rem;

      li {
        line-height: 2.25rem;
      }
    }
  }

  .submit-refund {
    height: 3rem;
    line-height: 3rem;
    font-size: 16px;
    width: 80%;
    margin: 0 auto;
    background: #f15353;
    color: #fff;
    text-align: center;
    border-radius: 30px;
  }
}

.return-goods {
  padding: 1rem 1rem 0;
  margin-bottom: 1rem;
  background: #fff;
  .return-goods-item {
    display: flex;
    padding-bottom: 1rem;
    .goods-img {
      width: 4.688rem;
      height: 4.688rem;
      img {
        width: 4.688rem;
        height: 4.688rem;
      }
    }
    .goods-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 4.688rem;
      padding-left: 0.625rem;
      .goods-title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 15px;
        color: #2c2c2c;
      }
      .goods-options {
        font-size: 10px;
        color: #666;
      }
      .goods-price {
        font-size: 11px;
        color: #f14e4e;
      }
    }
  }
}

.recovery-info {
  padding: 0.5rem 0.875rem;
  padding-right: 0.7rem;
  background: #fff;
  border-bottom: 1px solid #ddd;
  .recovery-itme {
    display: flex;
    padding: 0.3rem 0;
    margin-bottom: 0.3rem;
    .recovery-text {
      padding-right: 0.5rem;
    }
    .recovery-content {
      flex: 1;
      .inputs {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .input-item {
          display: flex;
          align-items: center;
          input {
            width: 2.813rem;
            height: 2rem;
            padding: 0 0.3rem;
            text-align: center;
            font-size: 12px;
            color: #555555;
            border-radius: 0.188rem;
            border: solid 0.031rem #eeeeee;
            background: #f9f9f9;
          }
          .unit {
            display: flex;
            transform: translateY(-6px);
            height: 0.506rem;
            margin-left: 0.438rem;
            font-size: 12px;
            color: #555555;
          }
        }
        .ride {
          display: flex;
          align-items: center;
          padding-left: 0.5rem;
          padding-right: 0.625rem;
          color: #555555;
        }
      }
    }
  }
}

/deep/.w-7 {
  width: 7em;
}
</style>
