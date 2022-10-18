<template>
	<div id="register">
    <c-title :hide="false" text='投放商品'></c-title>
	<div class="content-box">
		<div class="name">
			<h2>柜子名称:{{cup_name}}</h2>
			<span>格子：{{cup_id}}</span>
		</div>
		<div class="code-box">
			<input type="text" placeholder="请输入商品条形码或扫码录入" v-model="cup_code">
			<i class="iconfont icon-saoma" style="font-size: 1.5rem; color: #999;" @click.native="scanCode"></i>
		</div>
		<div class="btn">
			<van-button type="hollow" @click.native="delivery">确认投放</van-button><br>
			<span>请将物品平整放入框中，并关好箱门！谢谢</span>
		</div>
		
	</div>
	

	</div>
</template>

<script>
import cupboard_delivery_controller from "./cupboard_delivery_controller";
export default cupboard_delivery_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#register {
  .content-box {
    background-color: #fff;
    padding-top: 3rem;
    margin-top: 0.625rem;
    height: 38.5625rem;

    .name {
      h2 {
        font-size: 16px;
        margin-bottom: 0.625rem;
        color: #333;
      }

      span {
        color: #999;
        font-size: 14px;
      }
    }

    .code-box {
      border: solid 0.0625rem #ebebeb;
      width: 80%;
      height: 2.25rem;
      line-height: 2.25rem;
      border-radius: 0.1875rem;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 0 0.375rem;
      margin-top: 2.5rem;

      input {
        width: 90%;
        border: none;
        font-size: 14px;
      }
    }

    .btn {
      margin-top: 5rem;

      button {
        width: 69%;
        height: 2.5rem;
        margin: 0 auto;
        background-color: #259b24;
        border: none;
        color: #fff;
        border-radius: 0.25rem;
        font-size: 14px;
        padding: 0;
      }

      span {
        color: #f15353;
        display: inline-block;
        margin-top: 0.625rem;
      }
    }
  }
}
</style>