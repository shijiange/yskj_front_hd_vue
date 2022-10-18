<template>
	<div id="pay_status">
		<div class="pay_state">
			<img src="../../../assets/images/order_pay_succ.png"/>
		</div>
		<p class="pay_yes">下单成功</p>
		<div class="pay_btn">
			<button class="check_order"><router-link :to= "fun.getUrl('orderlist',{ status:'0' })">查看订单</router-link></button>
			<button class="return_home"><router-link :to= "fun.getUrl('home')">返回首页</router-link></button>
		</div>
	</div>
</template>

<script>

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #pay_status {
    .pay_state {
      width: 33%;
      text-align: center;
      margin: 5rem auto;
      img { width: 100%; }
    }

    .pay_yes {
      font-weight: bold;
      text-align: center;
      color: #999;
      line-height: 2.75rem;
      font-size: 16px;
    }

    .pay_btn {
      text-align: center;

      button {
        width: 43%;
        height: 2.5rem;
        margin: 0 3%;
        border-radius: 0.25rem;
        font-size: 16px;
        border: 0;
        a { color: #fff; }
      }

      .check_order {
        background-color: #f15353;
        color: #fff;
      }

      .return_home {
        background-color: #25ad25;
        color: #fff;
      }
    }
  }
</style>