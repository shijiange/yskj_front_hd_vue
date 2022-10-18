<template>
  <div id="member_add_bank_second">
    <c-title :hide="false" text="填写银行卡信息"></c-title>
    <div class="content">
      <div class="item">
        <span style="width: 4rem; text-align: left; display: inline-block;">银行</span>
        <input type="text" disabled="true" placeholder="请选择所属银行" v-model="bank_name" />
        <i class="iconfont icon-advertise-next" @click="show2 = true"></i>
      </div>
      <div class="item">
        <span style="width: 4rem; text-align: left; display: inline-block;">卡类型</span>
        <input type="text" disabled="true" placeholder="请选择银行卡类型" v-model="bank_type" />
        <i class="iconfont icon-advertise-next" @click="show3 = true"></i>
      </div>
      <div class="item" v-if="radio1 == 1">
        <span style="width: 4rem; text-align: left; display: inline-block;">安全码</span>
        <input type="number" placeholder="卡背面末三位" v-model="cvv" />
      </div>
      <div class="item" v-if="radio1 == 1">
        <span style="width: 4rem; text-align: left; display: inline-block;">有效期</span>
        <input type="text" disabled="true" placeholder="请选择有效期" v-model="expire_date" />
        <i class="iconfont icon-advertise-next" @click="openDate"></i>
      </div>
      <div class="tip">
        提醒:后续只能绑定该持卡人的银行卡
      </div>
      <div class="item" v-if="bank.length <= 0">
        <span style="width: 4rem; text-align: left; display: inline-block;">姓名</span>
        <input type="text" placeholder="请输入姓名" v-model="payer_name" />
      </div>
      <div class="item" v-if="bank.length <= 0">
        <span style="width: 4rem; text-align: left; display: inline-block;">证件类型</span>
        <input type="text" disabled="true" placeholder="请选择证件类型" v-model="id_type" />
        <i class="iconfont icon-advertise-next" @click="show4 = true"></i>
      </div>
      <div class="item" v-if="bank.length <= 0">
        <span style="width: 4rem; text-align: left; display: inline-block;">证件号</span>
        <input placeholder="请输入证件号" v-model="id_no" />
      </div>
      <div class="item">
        <span style="width: 4rem; text-align: left; display: inline-block;">手机号</span>
        <input type="number" placeholder="请填写银行卡预留手机号" v-model="payer_phone" />
      </div>

      <!-- 绑定会员手机验证 -->
      <template v-if="check_open">
        <div class="item" >
          <span style="width: 4rem; text-align: left; display: inline-block;">绑定手机号</span>
          <input type="number" :disabled="true" placeholder="请填写绑定的手机号" v-model="member_phone" />
        </div>
        <div class="item" v-if="isOpenCaptcha == 1">
          <span style="width: 4rem; text-align: left; display: inline-block;">图形验证码</span>
          <input placeholder="请填写右侧图形验证码" v-model="captcha" />
          <img style="width: 7.5rem; height: 2.5rem; z-index: 999;" :src="imgCodeLink" @click="getCaptchaImg" v-if="imgCodeLink"/>
        </div>
        <div class="item">
          <span style="width: 4rem; text-align: left; display: inline-block;">验证码</span>
          <input type="number" placeholder="请填写验证码" v-model="v2_code" />
          <span class="getcodeClass" @click="VerificationCode" v-show="!count">获取验证码</span>
          <span class="getcodeClass" v-show="count">{{ count }}秒后重新获取</span>
        </div>
      </template>

      <div class="check">
        <van-checkbox v-model="checked" style="margin-right: 1rem;" checked-color="#ff2c29"></van-checkbox>
        <div>
          <span style="color: #b0b0b0;">同意</span>
          <span style="color: #ff8988;" @click="show5 = true">《用户协议》</span>
        </div>
      </div>
      <div class="bank-btn" @click="addBank">
        下一步
      </div>
    </div>
    <van-popup class="bank" v-model="show2" position="bottom" :style="{ height: '60%' }">
      <div class="title">
        所属银行
        <i class="iconfont icon-close11" @click="show2 = false"></i>
      </div>
      <div class="content">
        <ul>
          <van-radio-group v-model="radio" checked-color="#ff2c29">
            <li v-for="(item, index) in datas" :key="index" class="radio">
              <span>{{ item.text }}</span>
              <van-radio :name="item.id"></van-radio>
            </li>
          </van-radio-group>
        </ul>
        <div class="btn" @click="confirm">
          确定
        </div>
      </div>
    </van-popup>
    <van-popup class="card" v-model="show3" position="bottom" :style="{ height: '60%' }">
      <div class="title">
        银行卡类型
        <i class="iconfont icon-close11" @click="show3 = false"></i>
      </div>
      <div class="content">
        <ul>
          <van-radio-group v-model="radio1" checked-color="#ff2c29">
            <li v-for="(item, index) in card" :key="index" class="radio">
              <span>{{ item.text }}</span>
              <van-radio :name="item.id"></van-radio>
            </li>
          </van-radio-group>
        </ul>
        <div class="btn" @click="cardConfirm">
          确定
        </div>
      </div>
    </van-popup>
    <van-popup class="type" v-model="show4" position="bottom" :style="{ height: '60%' }">
      <div class="title">
        证件类型
        <i class="iconfont icon-close11" @click="show4 = false"></i>
      </div>
      <div class="content">
        <ul>
          <van-radio-group v-model="radio2" checked-color="#ff2c29">
            <li v-for="(item, index) in idType" :key="index" class="radio">
              <span>{{ item.text }}</span>
              <van-radio :name="item.id"></van-radio>
            </li>
          </van-radio-group>
        </ul>
        <div class="btn" @click="typeConfirm">
          确定
        </div>
      </div>
    </van-popup>
    <van-popup class="message" v-model="show5" position="center" :style="{ width: '70%' }">
      <div class="title">
        用户协议
        <i class="iconfont icon-close11" @click="show5 = false"></i>
      </div>
      <div class="content">
        <div v-html="user_agrt"></div>
      </div>
    </van-popup>
    <van-popup v-model="tapTimeOne" position="bottom" :style="{ width: '100vw' }">
			<van-datetime-picker
				v-model="date"
				type="year-month"
				title=""
				:formatter="formatter"
				ref="datetime"
				@confirm="shijian"
				@cancel="taptwo = false"
			/>
		</van-popup>
  </div>
</template>
<script>
import member_add_bank_second_controller from './member_add_bank_second_controller';
export default member_add_bank_second_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#member_add_bank_second {
  height: 100vh;
  background-color: #fff;

  .content {
    padding-left: 1rem;

    .item {
      border-bottom: solid 1px #ccc;
      display: flex;
      text-align: left;
      padding: 1rem 0;
      padding-right: 1rem;
      align-items: center;

      input {
        outline: none;
        border: none;
        flex: 1;
        text-indent: 1rem;
      }
    }

    .getcodeClass {
      display: inline-block;
      height: 1.75rem;
      line-height: 1.75rem;
      background-color: #f54242;
      color: #fff;
      border-radius: 0.125rem;
      padding: 0 0.625rem;
      font-size: 0.75rem;
    }

    .tip {
      height: 3rem;
      display: flex;
      align-items: center;
      background: #ebebeb;
      color: #666;
      font-size: 12px;
      margin-left: -1rem;
      padding-left: 1rem;
    }

    .check {
      margin-top: 1rem;
      display: flex;
      align-items: center;
    }

    .bank-btn {
      width: 18.75rem;
      height: 2.875rem;
      background-color: #ff2c29;
      border-radius: 0.5625rem;
      font-size: 16px;
      margin: 0 auto;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1rem;
    }
  }

  .bank {
    .title {
      font-size: 16px;
      position: relative;
      padding: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        position: absolute;
        right: 0.5rem;
      }
    }

    .content {
      padding: 0 1rem;

      .radio {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }

      .btn {
        width: 80%;
        height: 2.875rem;
        background-color: #ff2c29;
        border-radius: 0.5625rem;
        margin: 0 auto;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
      }
    }
  }

  .card {
    .title {
      font-size: 16px;
      position: relative;
      padding: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        position: absolute;
        right: 0.5rem;
      }
    }

    .content {
      padding: 0 1rem;

      .radio {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }

      .btn {
        width: 80%;
        height: 2.875rem;
        background-color: #ff2c29;
        border-radius: 0.5625rem;
        margin: 0 auto;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
      }
    }
  }

  .type {
    .title {
      font-size: 16px;
      position: relative;
      padding: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        position: absolute;
        right: 0.5rem;
      }
    }

    .content {
      padding: 0 1rem;

      .radio {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }

      .btn {
        width: 80%;
        height: 2.875rem;
        background-color: #ff2c29;
        border-radius: 0.5625rem;
        margin: 0 auto;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
      }
    }
  }

  .message {
    .title {
      font-size: 16px;
      position: relative;
      padding: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        position: absolute;
        right: 0.5rem;
      }
    }

    .content {
      padding: 1rem;
      padding-top: 0;
      text-align: left;
    }
  }
}
</style>
