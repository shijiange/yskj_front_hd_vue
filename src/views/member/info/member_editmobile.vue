<template>
	<div id="alterAddress">
		<c-title :hide="false" :text='action_name' :goback='false'></c-title>
		<div style="height: 10px;"></div>
		<van-field v-model='form.mobile' label="手机号码" placeholder="请输入手机号码" clearable center />
		<van-field
		v-model='form.code'
		center
		clearable
		label="验证码"
		placeholder="请输入验证码"
		>
		<template #button>
			<van-button size="small" type="primary" @click="VerificationCode" color="#f15353" >{{CodeStr}}</van-button>
		</template>
		</van-field>
		<van-field v-model='form.password' label="密码" type="password" placeholder="请输入密码" clearable center />
		<van-field v-model='form.confirm_password' label="确认密码" type="password" placeholder="请输入确认密码" clearable center />

		<div class="maleall">

			<div class="address_addnav" @click="alterAction">
				<i class="fa fa-pencil-square-o"></i>
				<span>{{action_name}}</span>
			</div>

		</div>
	</div>
</template>
<script>
import member_editmobilecontroller from './member_editmobilecontroller';
export default member_editmobilecontroller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#alterAddress #code {
  background: #ccc;
  padding: 0.1875rem 0.3125rem;
  border-radius: 0.1875rem;
}

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

#alterAddress .males {
  line-height: 3.125rem;
  display: flex;
  border-top: 0.0625rem solid #d9d9d9;
  margin-left: 0.625rem;
}

.maleall span {
  font-size: 16px;
  vertical-align: middle;
  width: 6.5625rem;
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

.van-cell {
  padding: 10px 12px;
  font-size: 16px;
  color: #333;
}
</style>
