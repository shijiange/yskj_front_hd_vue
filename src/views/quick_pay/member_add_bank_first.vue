<template>
	<div id="member_add_bank_first">
			<c-title :hide="false" text='添加银行卡'></c-title>
			<div class="mes">请绑定持卡人本人的银行卡</div>
			<div class="line"></div>
			<div class="content">
				<div class="item" v-if="info.payer_name&&bank.length>0">
					<span>持卡人</span>
					<input type="text" disabled="true" v-model="info.payer_name"/>
				</div>
				<div class="item">
						<span>卡号</span>
						<input type="number"  v-model="num"/>
					</div>
			</div>
			<div class="line"></div>
			<div class="btn" @click="next()">
				下一步
			</div>
		</div>
	</template>
<script>
import member_add_bank_first_controller from "./member_add_bank_first_controller";
export default member_add_bank_first_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#member_add_bank_first {
  height: 100vh;
  background-color: #fff;

  .mes {
    padding: 1rem 0;
    padding-left: 1rem;
    color: #666;
    font-size: 12px;
    text-align: left;
  }

  .line {
    height: 0.625rem;
    background-color: #f2f2f7;
  }

  .content {
    background-color: #fff;
    padding: 0 1rem;

    .item {
      padding: 1.25rem 0;
      border-bottom: solid 1px #ccc;
      display: flex;
      align-items: center;

      input {
        flex: 1;
        border: none;
        outline: none;
        text-indent: 1.625rem;
      }
    }

    .item:last-child {
      border-bottom: none;
    }
  }

  .btn {
    margin: 0 auto;
    margin-top: 1.875rem;
    background-color: #ff2c29;
    border-radius: 0.5625rem;
    color: #fff;
    width: 18.75rem;
    height: 2.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
}
</style>
