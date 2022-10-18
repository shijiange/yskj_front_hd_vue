<template >
	<div id="info">
		<c-title :hide="false" text='修改信息'></c-title>
		<van-field :label="custom_title"  v-model="custom_value" placeholder='请输入信息'  center clearable/>
		<div style="height: 1.875rem;"></div>
		<van-button type="primary" size="large" color="#f15353" style="margin: 0 auto; width: 90%;" @click="submitInfo()">确认</van-button>
		<div style="height: 0.625rem;"></div>
	</div>
</template>
<script>
import info_custom_controller from './info_custom_controller';
export default info_custom_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#info span {
  font-size: 14px !important;
}

.list1 {
  margin-top: 0.625rem;
  height: 2.75rem;
  width: 97%;
  background: #fff;
  padding: 0 0 0 3%;
  border-top: 0.0625rem solid #e6e1e1;
  font-size: 14px;
  line-height: 2.75rem;
  color: #333;
  text-align: left;
}

.list1 i.fa.fa-angle-right {
  float: right;
  line-height: 2.75rem;
  display: inline-block;
  font-size: 0.9rem;
  margin-right: 0.375rem;
  color: #929292;
  width: 1.25rem;
  height: 1.25rem;
  text-align: center;
  background-size: 1.25rem;
}

.fa-angle-right {
  color: #999;
  font-size: 26px;
  float: right;
  line-height: 3.125rem;
  margin-left: 0.375rem;
  margin-right: 0.3125rem;
}

.btmobile {
  top: 0;
  line-height: 3rem;
  right: 100;
  width: 5rem;
  font-size: 12px;
  color: #f15353;
}

#info .mint-button {
  margin: 0 2%;
}

.maleall {
  background: #fff;
  text-align: left;
}

.males {
  line-height: 3.125rem;
  display: flex;
  border-top: 0.0625rem solid #f3f3f3;
  margin-left: 0.625rem;
}

.maleall span {
  color: #888;
  font-size: 14px;
  vertical-align: middle;
  width: 28%;
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
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

#myimg {
  flex: 1;
  text-align: right;
}

.popup-con {
  width: 100%;
}

.el-upload img {
  width: 30%;
}

.avatar-uploader-icon {
  padding-right: 1.5625rem;
}

.mint-cell-wrapper {
  background: red;
}

.mint-button {
  margin: 0.3125rem 0;
}

#info .mint-cell-wrapper {
  padding: 0;
}

.van-cell {
  padding: 10px 12px;
  font-size: 16px;
  color: #555;
}
</style>