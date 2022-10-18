<template>
	<div id="commission">
		<c-title :hide="false" text='管理奖'></c-title>
	
		<div v-for="(item,i) in datas" :key='i'>
	
			<div class="tbs">
				<div class="item1">下级 {{item.has_one_subordinate.nickname}}
					<br />{{item.created_at}}</div>
				<div class="item2">
					<span class="reg">管理奖 +{{item.manage_amount}}</span>
	
					<br/>{{item.status_name}}</div>
			</div>
	
			<!--<div class="times">2017年3月</div>-->
			<!--<router-link :to="{ name: 'commissionDetails', params: { id: 12 }}">
					<div class="tbs">
						<div class="item1">商品名字
							<br/>984.15元</div>
						<div class="item2"><span class="reg">佣金   +3.00</span>
							<br />2013.09.05 09:51:05</div>
					</div>
				</router-link>-->
		</div>
	
	</div>
</template>
<script>
import manage_controller from './manage_controller';
export default manage_controller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#commission {
  .times {
    text-align: left;
    text-indent: 0.625rem;
    line-height: 2rem;
    background: #ddd;
  }

  .tbs {
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0.625rem 0;
    border-bottom: 0.0625rem solid #d9d9d9;

    .item1 {
      color: #000;
      flex: 50%;
      text-align: left;
      padding-left: 0.9375rem;
    }

    .item2 {
      flex: 50%;
      text-align: right;
      color: #a79d9d;
      padding-right: 0.9375rem;

      .reg {
        color: #259b24;
      }
    }
  }
}
</style>