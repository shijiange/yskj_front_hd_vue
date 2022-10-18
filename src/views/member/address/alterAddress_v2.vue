<template>
  <div id="appendAddress" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title :hide="false" text="修改收货地址"></c-title>
    <div style=" margin-top: 0.625rem;"></div>

    <van-cell-group :border="false" style="margin-bottom: 10px;" class="felx-height">
      <van-field v-model="form.username" placeholder="请输入收件人" clearable center :border="false">
        <span slot="label">收件人：</span>
      </van-field>
      <van-field v-model="form.mobile" placeholder="请输入联系电话" clearable center :border="false">
        <span slot="label">联系电话：</span>
      </van-field>
    </van-cell-group>

    <van-cell-group :border="false" style="margin-bottom: 10px;" class="felx-height">
      <van-cell :border="false" title-style="text-align:left;color:#555">
        <span slot="title">设置默认地址：</span>
        <span slot="default">
          <van-switch v-model="form.isDefault" active-color="#f15353" inactive-color="#fdfdfd"  size="27px"/>
        </span>
      </van-cell>
    </van-cell-group>

    <div>
      <van-cell-group :border="false" style="margin-bottom: 10px;" class="address-sel felx-height">
        <van-cell :border="false" is-link center title-style="text-align:left;color:#555">
          <span slot="title">所在地区：</span>
          <van-field
            v-model="addressName"
            placeholder="请选择收货地址"
            clearable
            center
            :border="false"
            @click.stop="addressShow = true"
            style="color: transparent; text-shadow: 0 0 0 #ccc;"
          />
        </van-cell>

        <van-cell :border="false" is-link center title-style="text-align:left;color:#555" v-if="isShowStreet" >
          <span slot="title">街道：</span>
          <van-field
            v-model="form.streetName"
            placeholder="请选择街道"
            clearable
            readonly
            center
            :border="false"
            @click.stop="streetTip"
            style="color: transparent; text-shadow: 0 0 0 #ccc;"
          />
        </van-cell>
      </van-cell-group>

      <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="district"></yd-cityselect>
    </div>
    <!-- <mt-field label="" v-model="form.address" placeholder="请输入详细地址"></mt-field> -->
    <van-cell-group style="height: 118px;" class="leave-words">
      <van-cell>
        <van-field
          v-model="form.address"
          rows="3"
          autosize
          type="textarea"
          maxlength="100"
          placeholder="请输入详细地址"
          show-word-limit
        />
      </van-cell>
    </van-cell-group>

    <div style="height: 3.75rem;"></div>

    <div class="address_addnav" @click="alterAddresshandle"><i class="fa fa-plus-circle"></i><span>保存</span></div>

    <van-popup v-model="streetShow" position="right" duration="0" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar title="选择街道">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <!-- <div style="clear:both;margin-top:2.5rem;"></div> -->
      <van-cell is-link  center v-for="(item, i) in districtVal" :key="i" @click.native="streetConfirm(item.areaname)">
          <span slot="title">{{ item.areaname }}</span>
          <span slot="default"></span>
      </van-cell>

    </van-popup>
  </div>
</template>
<script>
import alertAddress_v2_controller from './alterAddress_v2_controller';
export default alertAddress_v2_controller;
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

#appendAddress.pcStyle .address_addnav {
  width: 375px;
  left: auto;
}

#appendAddress /deep/.van-field__label {
  white-space: nowrap;
  margin-right: 0;
  width: auto;
}

#appendAddress /deep/.van-cell {
  padding-left: 12px;

  input::placeholder,
  textarea::placeholder {
    color: #666;
  }
}

#appendAddress .van-cell__title {
  flex: none;
}

#appendAddress .felx-height .van-cell {
  height: 50px;
}

#appendAddress .leave-words /deep/.van-cell {
  padding: 10px 8px;
}

#appendAddress .address-sel /deep/.van-field__control {
  color: #ccc;
}
</style>
