<template>
  <div id="appendAddress">
    <c-title :hide="false" text="添加收货地址"></c-title>
    <div style="margin-top: 0.625rem;"></div>
    <van-field v-model="form.username" placeholder="请输入收件人" label="收件人：" />
    <van-field v-model="form.mobile" placeholder="请输入联系电话" type="tel" label="联系电话：" />

    <van-field name="switch" label="设置默认地址：" label-width="7.5rem" class="default-address">
      <template #input>
        <van-switch v-model="form.isDefault" size="25px" active-color="#f15353" inactive-color="#ffffff"  />
      </template>
    </van-field>

    <div>
      <van-field label="所在地区：" is-link :value="addressName" @click.stop="addressShow = true" readonly />
      <van-field v-if="strShow" label="街道：" is-link :value="form.street" @click.stop="streetChoose" readonly />

      <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="district"></yd-cityselect>
    </div>

    <van-field v-model="form.address" rows="3" autosize type="textarea" placeholder="请输入详细地址" />

    <div style="height: 3.75rem;"></div>

    <div class="address_addnav set-pc-style" @click="appendAddress">
      <i class="fa fa-plus-circle"></i><span>保存</span>
    </div>

    <van-popup v-model="streetShow" position="bottom" :overlay="true">
      <van-picker
        title="选择街道"
        show-toolbar
        value-key="areaname"
        :columns="districtVal"
        @confirm="streetConfirm"
        @cancel="onCancel"
      />
    </van-popup>

  </div>
</template>
<script>
import appendAddress_v2_controller from './appendAddress_v2_controller';

export default appendAddress_v2_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.address_addnav {
  width: 100%;
  padding: 0 3% 0 6% !important;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #f15353 !important;
  color: #fff !important;
  text-align: center;
  height: 2.8125rem !important;
  line-height: 2.8125rem !important;
}

.popup-con {
  width: 100%;
}

#appendAddress .mint-field .mint-cell-title {
  text-align: left;
}

.address_addnav i {
  color: #fff;
  font-size: 22px;
  position: absolute;
  top: 50%;
  height: 1.125rem;
  line-height: 1.125rem;
  margin-left: -2.125rem;
  margin-top: -0.5625rem;
}

.maleall {
  background: #fff;
  text-align: left;
}

#appendAddress .males {
  line-height: 3.125rem;
  display: flex;
  align-items: center;
  border-top: 0.0625rem solid #d9d9d9;
  margin-left: 0.625rem;
  padding-right: 0.625rem;

  .address {
    display: inline-block;
    position: relative;
    width: 100%;
    float: right;
    box-sizing: border-box;
    padding-top: 0;
  }
}

.maleall span {
  font-size: 16px;
  vertical-align: middle;
  width: 6.5625rem;
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
  line-height: 3.125rem;
}

#address {
  flex: 1;
  line-height: 3.125rem;

  .mint-button--default {
    line-height: 3.125rem;
    text-align: left;
    font-size: 16px;
  }
}

.default-address {
  /deep/.van-field__body {
    float: right;
  }
}

/deep/.van-cell--clickable:active {
  background-color: #fff;
}
</style>
