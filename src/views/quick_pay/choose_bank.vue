<template>
  <div id="choose_bank">
    <c-title :hide="false" text="选择银行卡"></c-title>
    <div class="content">
      <div class="bank-list">
        <div
          class="bank"
          v-for="(item, index) in bank"
          :key="index"
          :class="getIconUrl(item)"
          @click.stop="toPay(item)"
        >
          <div class="top">
            <div class="avator">
              <img src="../../assets/images/bank_2.png" v-if="item.bank_name == '中国工商银行'" />
              <img src="../../assets/images/bank_1.png" v-if="item.bank_name == '中国银行'" />
              <img src="../../assets/images/bank_3.png" v-if="item.bank_name == '中信银行'" />
              <img src="../../assets/images/bank_4.png" v-if="item.bank_name == '上海银行'" />
              <img src="../../assets/images/bank_12.png" v-if="item.bank_name == '中国建设银行'" />
              <img src="../../assets/images/bank_5.png" v-if="item.bank_name == '光大银行'" />
              <img src="../../assets/images/bank_6.png" v-if="item.bank_name == '民生银行'" />
              <img src="../../assets/images/bank_7.png" v-if="item.bank_name == '北京银行'" />
              <img src="../../assets/images/bank_8.png" v-if="item.bank_name == '平安银行'" />
              <img src="../../assets/images/bank_9.png" v-if="item.bank_name == '交通银行'" />
              <img src="../../assets/images/bank_10.png" v-if="item.bank_name == '招商银行'" />
              <img src="../../assets/images/bank_11.png" v-if="item.bank_name == '广发银行'" />
              <img src="../../assets/images/bank_13.png" v-if="item.bank_name == '浦发银行'" />
              <img src="../../assets/images/bank_14.png" v-if="item.bank_name == '邮政银行'" />
            </div>
            <div class="right">
              <span>{{ item.bank_name }}</span>
              <span style="font-size: 14px;">{{ item.bank_type_name }}</span>
            </div>
          </div>
          <div class="bottom">
            <span>{{ changeBank(item.card_no) }}</span>
          </div>
          <div class="close" @click.stop="deleteBank(item)">
            <i class="iconfont icon-close11"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="btn" @click="toAdd">
      <div class="add"><span style="margin-right: 0.75rem; font-size: 24px;">+</span>添加银行卡</div>
    </div>
    <van-popup v-model="show1" position="bottom" :style="{ width: '100%', height: '50%' }">
      <div class="title">
        付款详情
        <i class="iconfont icon-close11" @click.stop="show1 = false"></i>
      </div>
      <div class="pay-content">
        <div class="item">
          <span>支付金额</span><span style="color: #ff2c29;">{{ $i18n.t('money') }}{{ amount }}</span>
        </div>
        <div class="item">
          <span>支付流水号</span><span style="color: #666;">{{ pay_sn }}</span>
        </div>
        <div class="item">
          <span>银行卡名称</span><span style="color: #666;">{{ bank_name }}</span>
        </div>
        <div class="item">
          <span>验证码</span
          ><input
            type="number"
            placeholder="请输入验证码"
            v-model="code"
            style="outline: none; border: none; text-align: right; width: 40%;"
          />
          <van-button type="default" :disabled="btnTag" :color="btnBg" size="small" @click.native="verificationCode">{{
            btnText
          }}</van-button>
        </div>
        <div style="text-align: left; color: #666; font-size: 12px;" class="item" v-if="start1">
          已向手机{{ payer_phone.substr(0, 3) + '****' + payer_phone.substr(7) }}发送短信
        </div>
        <div class="pay-btn" @click="pay">支付</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import choose_bank_controller from './choose_bank_controller';
export default choose_bank_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#choose_bank {
  position: relative;
  height: 100vh;
  background-color: #fff;

  .content {
    padding: 1rem 0.75rem;
    padding-bottom: 3.875rem;

    .bank-list {
      .bank {
        position: relative;
        width: 21.875rem;
        height: 8.4375rem;
        border-radius: 0.6875rem;
        padding-top: 1.25rem;
        padding-bottom: 1.5rem;
        padding-left: 0.75rem;
        margin-bottom: 1rem;

        .top {
          display: flex;

          .avator {
            width: 3rem;
            height: 3rem;
            background-color: #fff;
            border-radius: 50%;
            margin-right: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 2rem;
              height: 2rem;
            }
          }

          .right {
            display: flex;
            align-items: baseline;
            flex-direction: column;
            font-size: 16px;
            color: #fff;
            height: 3rem;
            justify-content: space-between;
          }
        }

        .bottom {
          margin-left: 3.75rem;
          margin-top: 2.1875rem;
          color: #fff;
          display: flex;
          align-items: center;
          font-size: 16px;
        }

        .close {
          position: absolute;
          right: 0.5rem;
          top: 0.5rem;
          z-index: 999;

          .icon-close11 {
            color: #fff;
            font-size: 20px;
          }
        }
      }
    }
  }

  .btn {
    width: 18.75rem;
    height: 2.875rem;
    background-color: #ff2c29;
    border-radius: 0.3125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    position: fixed;
    bottom: 1.25rem;
    left: 0;
    right: 0;
    margin: 0 auto;

    .add {
      display: flex;
      align-items: center;
    }
  }

  .title {
    padding-top: 1rem;
    padding-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    i {
      position: absolute;
      right: 1rem;
      color: #666;
    }
  }

  .pay-content {
    padding: 0 1rem;

    .item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      justify-content: space-between;
    }

    .pay-btn {
      width: 18.75rem;
      height: 2.875rem;
      background-color: #ff2c29;
      border-radius: 0.5625rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-top: 2rem;
    }
  }
}

.gongshang {
  background-image: linear-gradient(-90deg, #c7020f 53%, #f43038 100%);
}

.zhongguo {
  background-image: linear-gradient(-90deg, #c7020f 53%, #f43038 100%);
}

.zhongxin {
  background-image: linear-gradient(-90deg, #c7020f 53%, #f43038 100%);
}

.shanghai {
  background-image: linear-gradient(-90deg, #12489e 53%, #2865c5 100%);
}

.jianshe {
  background-image: linear-gradient(-90deg, #0362b3 53%, #3e94dd 100%);
}

.guangda {
  background-image: linear-gradient(-90deg, #691688 53%, #a12cc8 100%);
}

.mingsheng {
  background-image: linear-gradient(-90deg, #0072bc 53%, #1988d1 100%);
}

.beijing {
  background-image: linear-gradient(-90deg, #c7020f 53%, #eb2730 100%);
}

.pingan {
  background-image: linear-gradient(-90deg, #f05a23 53%, #fd7a49 100%);
}

.jiaotong {
  background-image: linear-gradient(-90deg, #063f78 53%, #1861aa 100%);
}

.zhaoshang {
  background-image: linear-gradient(-90deg, #c7020f 53%, #f32f37 100%);
}

.guangfa {
  background-image: linear-gradient(-90deg, #c7020f 53%, #f12d35 100%);
}

.pufa {
  background-image: linear-gradient(-90deg, #1b1bb0 53%, #3536df 100%);
}

.youzheng {
  background-image: linear-gradient(-90deg, #096 53%, #0bc285 100%);
}

.default {
  background-color: #ccc;
}
</style>
