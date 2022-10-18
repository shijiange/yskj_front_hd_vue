<template>
  <div id="bankcardinformmationsedit">
    <c-title :hide="false" text="银行卡信息"></c-title>
    <div class="big_bank_box">
      <ul class="bank_ul">
        <li>
          <div>
            账户类型：
          </div>
          <div class="bank_radio" style="height: 4rem; width: 75%;">
              <van-radio-group v-model="radio"  direction="horizontal" class="van-group">
                  <van-radio name="对公账户" v-if="toPublic" >对公账户</van-radio>
                  <van-radio name="对私账户"  v-if="toPrivate">对私账户</van-radio>
            </van-radio-group>
          </div>
        </li>
        <li>
          <div>
            银行帐号：
          </div>
          <span v-if="!status">{{receiverAccountNoEnc}}</span>
          <input
            type="text"
            v-if="status === true"
            placeholder="请输入银行卡卡号"
            v-model="receiverAccountNoEnc"
          />
        </li>
        <li>
          <div>
            持卡人：
          </div>
          <input
            type="text"
            :readonly="status ? false : 'readonly'"
            placeholder="请输入持卡人名称"
            v-model="receiverNameEnc"
          />
        </li>
        <li v-if="radio === '对公账户'">
          <div>
            账户联行号：
          </div>
          <input
            type="text"
            :readonly="status ? false : 'readonly'"
            placeholder="对公账户必须填写"
            v-model="receiverBankChannelNo"
          />
        </li>
        <li style="border: none;">
          <div>
            设为默认账户：
          </div>
          <div style="text-align: right;" class="bank_swich">
             <van-switch v-model="is_default" inactive-color="#f15353" />
          </div>
        </li>
      </ul>
    </div>
    <div class="bank_butto" @click="change" v-if="!status">
      点击修改
    </div>
    <div class="bank_butto" @click="addTiJiao" v-else>
      确认修改
    </div>
    <div class="bank_button_delete" @click="deleteChange">
      删除账户
    </div>
  </div>
</template>
<script>
import bankcardinedit_controller from "./bankcardinedit_controller.js";
export default bankcardinedit_controller;
</script>
<style  lang="scss" rel="stylesheet/scss" scoped>
  #bankcardinformmationsedit {
    .big_bank_box {
      left: 0;
      top: 5.44rem;
      width: 23.44rem;
      height: 19.31rem;
      line-height: 1.25rem;
      text-align: center;

      .bank_ul {
        padding-left: 5px;

        li {
          height: 4rem;
          line-height: 4rem;
          padding-left: 1rem;
          border-bottom: 1px solid #c6c6c6 !important;
          display: flex;
          text-align: left;

          input {
            border: none;
          }

          div {
            left: 0.81rem;
            // top: 6.88rem;
            // width: 5.69rem;
            height: 1.38rem;
            color: rgba(16, 16, 16, 1);
            font-size: 0.94rem;
            text-align: left;
          }

          .bank_swich {
            left: 17.94px;
            top: 21.31px;
            width: 4.69rem;
            display: flex;
            justify-content: center;
            height: 4rem;
            align-items: center;
            // margin-left: 10rem;
          }
        }

        .van-switch {
          width: 2em;
          height: 1em !important;
          font-size: 26px !important;
        }
      }
    }

    .bank_butto {
      left: 0.75rem;
      top: 26.56rem;
      width: 21.88rem;
      height: 2.69rem;
      border-radius: 0.25rem;
      background-color: rgba(37, 155, 36, 1);
      color: rgba(255, 255, 255, 1);
      font-size: 0.88rem;
      text-align: center;
      margin: 2rem auto;
      line-height: 2.69rem;
    }

    .bank_button_delete {
      left: 0.75rem;
      top: 31.19rem;
      width: 21.88rem;
      height: 2.69rem;
      line-height: 2.69rem;
      border-radius: 0.25rem;
      background-color: rgba(221, 39, 39, 1);
      color: rgba(255, 255, 255, 1);
      font-size: 0.88rem;
      text-align: center;
      margin: 1rem auto;
    }

    .van-group {
      padding-top: 1.3rem;
    }

    .van-radio {
      overflow: inherit;
    }
  }
</style>
