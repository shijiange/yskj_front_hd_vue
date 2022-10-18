<template>
  <div id="register">
    <c-title :hide="false" text="银行卡信息"></c-title>


    <van-cell-group :border="false">
      <van-cell :border="false" title-class="left-van" center>
        <span slot="title">开户行：</span>
        <input
          slot="default"
          :readonly="status ? false : 'readonly'"
          type="text"
          placeholder="请输入开户行"
          v-model.trim="bank_name"
        />
      </van-cell>

      <van-cell :border="false" title-class="left-van" center>
        <span slot="title">开户行省份：</span>
        <input
          slot="default"
          :readonly="status ? false : 'readonly'"
          type="text"
          placeholder="请输入开户行省份"
          v-model.trim="bank_province"
        />
      </van-cell>

      <van-cell :border="false" title-class="left-van" center>
        <span slot="title">开户行城市：</span>
        <input
          slot="default"
          :readonly="status ? false : 'readonly'"
          type="text"
          placeholder="请输入开户行城市"
          v-model.trim="bank_city"
        />
      </van-cell>
      <van-cell :border="false" title-class="left-van name" center>
        <span slot="title">开户行支行：</span>
        <input
          slot="default"
          :readonly="status ? false : 'readonly'"
          type="text"
          placeholder="请输入开户行支行"
          v-model.trim="bank_branch"
        />
      </van-cell>

      <van-cell :border="false" title-class="left-van" center>
        <span slot="title">账号：</span>
        <p slot="default" v-if="!status" class="bank_id">{{ bank_id }}</p>
        <input slot="default" v-if="status === true" type="number" placeholder="请输入账号" v-model.trim="bank_id"/>
      </van-cell>

      <van-cell :border="false" title-class="left-van" center>
        <span slot="title">姓名：</span>
        <!-- <p slot="default" v-if="!status" class="bank_id">{{ bank_id }}</p>  #78520 -->
        <input
          slot="default"
          :readonly="status ? false : 'readonly'"
          type="text"
          placeholder="请输入姓名"
          v-model.trim="bank_user"
        />
      </van-cell>
    </van-cell-group>

    <div class="van-button-group">
      <van-button size="large" v-if="!status" type="danger" @click.native="change">点击编辑</van-button>
      <van-button size="large" v-else type="primary" @click.native="bind">提交</van-button>
    </div>
  </div>
</template>

<script>
import bank_info_controller from "./bank_info_controller";

export default bank_info_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .van-button-group {
    padding-top: 15px;
    padding-left: 12px;
    padding-right: 12px;
  }

  #register {
    .bank_id {
      width: 100%;
      text-align: left;
    }

    .van-cell {
      padding-left: 0.7188rem;
      padding-right: 0.1875rem;

      input {
        width: 100%;
        border: none;

        &::placeholder {
          font-size: 16px;
        }
      }

      span {
        font-size: 16px;
      }
    }

    /deep/ .van-field__label {
      margin-right: 0;
      white-space: nowrap;
      width: auto;

      span {
        color: #333;
      }
    }

    /deep/ .van-field__body input::-webkit-input-placeholder {
      color: #666;
    }

    .left-van {
      text-align: left;
      white-space: nowrap;
      flex: 0.3;
    }

    .name {
      flex: 0.1;
    }
  }
</style>
