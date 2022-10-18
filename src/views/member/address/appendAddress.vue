<template>
  <div id="appendAddress">
    <c-title :hide="false" text="添加收货地址"></c-title>
    <van-field class="inp-field" v-model="form.username" label="收件人" placeholder="请输入收件人" center clearable />
    <van-field class="inp-field" v-model="form.mobile" label="联系电话" placeholder="请输入联系电话" center clearable />
    <div class="maleall">
      <label class="males"
        ><span>设置默认地址 </span>
        <div class="address" style="">
          <van-switch:v-model="form.isdefault" size="23px" active-color="#f15353" inactive-color="#fff" />
        </div>
      </label>
    </div>
    <div class="maleall">
      <label for="male" class="males"
        ><span>所在省份 </span>
        <el-select v-model="provicevalue" placeholder="请选择省份" @change="selectProviceHandle">
          <el-option v-for="item in provinceoptions" :label="item.areaname" :key="item.value" :value="item">
          </el-option>
        </el-select>
      </label>
    </div>
    <div class="maleall">
      <label for="male" class="males"
        ><span>所在城市 </span>
        <el-select v-model="cityvalue" placeholder="请选择城市" @change="selectCityHandle">
          <el-option v-for="item in cityoptions" :label="item.areaname" :key="item.value" :value="item"> </el-option>
        </el-select>
      </label>
    </div>
    <div class="maleall">
      <label for="male" class="males"
        ><span>所在区县 </span>
        <el-select v-model="regionvalue" placeholder="请选择区县" @change="selectRegionHandle">
          <el-option v-for="item in regionoptions" :label="item.areaname" :key="item.value" :value="item"> </el-option>
        </el-select>
      </label>
    </div>

    <van-field class="inp-field" v-model="form.address" placeholder="请输入详细地址" center clearable>{{
      detailAddress
    }}</van-field>
    <div style="height: 5rem;"></div>
    <div class="address_addnav" @click="appendAddress"><i class="fa fa-plus-circle"></i><span>保存</span></div>
  </div>
</template>
<script>
import appendAddress_controller from './appendAddress_controller';
export default appendAddress_controller;
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
  height: 2.75rem !important;
  line-height: 2.75rem !important;
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

/deep/.inp-field.van-cell {
  padding: 10px;

  /deep/.van-field__label {
    flex: none;
    white-space: nowrap;
    width: 4.5rem;
    margin-right: 20px;
    color: #333;
    text-align: left;
    font-size: 16px;
  }

  input::placeholder {
    color: #555;
    font-size: 16px;
  }
}

/deep/.van-switch {
  float: right;
  margin-right: 10px;
}
</style>