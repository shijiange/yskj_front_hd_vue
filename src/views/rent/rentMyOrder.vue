<template>
	<div id="rentMyOrder">
		<c-title :hide="false" text='我的订单'></c-title>
		<div class="grandparent">
			<div class="allTitle">
				<van-tabs v-model="selected" id='tabcon' @click="swichTabTItem">
					<van-tab name="0" title="全部"></van-tab>
					<van-tab name="1" title="待付款"></van-tab>
					<van-tab name="2" title="待发货"></van-tab>
					<van-tab name="3" title="待收货"></van-tab>
					<van-tab name="4" title="待归还"></van-tab>
					<van-tab name="5" title="归还中"></van-tab>
					<van-tab name="6" title="已完成"></van-tab>
					<van-tab name="7" title="已转租"></van-tab>
					<van-tab name="8" title="已取消"></van-tab>
				</van-tabs>

			</div>
		</div>

		<div style="height: 2.8125rem;"></div>

		<van-pull-refresh v-model="isLoading"  @refresh="loadTop" success-duration="刷新成功">
			<div>
				<div v-show="selected==0">
					<cOrderList :datasource="orderList" :status="0" class='osll'></cOrderList>
				</div>
				<div v-show="selected==1">
					<cOrderList :datasource="orderList" :status="1" class='osll'></cOrderList>
				</div>
				<div v-show="selected==2">
					<cOrderList :datasource="orderList" :status="2" class='osll'></cOrderList>
				</div>
				<div v-show="selected==3">
					<cOrderList :datasource="orderList" :status="3" class='osll'></cOrderList>
				</div>
				<div v-show="selected==4">
					<cOrderList :datasource="orderList" :status="4" class='osll'></cOrderList>
				</div>

				<div v-show="selected==5">
					<cOrderList :datasource="orderList" :status="5" class='osll'></cOrderList>
				</div>
				<div v-show="selected==6">
					<cOrderList :datasource="orderList" :status="6" class='osll'></cOrderList>
				</div>
				<div v-show="selected==7">
					<cOrderList :datasource="orderList" :status="7" class='osll'></cOrderList>
				</div>
				<div v-show="selected==8">
					<cOrderList :datasource="orderList" :status="8" class='osll'></cOrderList>
				</div>
			</div>
		</van-pull-refresh>
		<div class="loadNomore" v-show='allLoaded'>
			<img src="assets/images/no-more-product.png" />
		</div>
		<div style="height: 4.375rem;"></div>
		<c-Footer></c-Footer>
	</div>
</template>
<script>
import rentMyOrderController from './rentMyOrderController';
export default rentMyOrderController;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.osll {
  min-height: 100vh;
}

.contes {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 2.1875rem;
  background: #fff;
  line-height: 2.1875rem;
  border-top: #e2e2e2 solid 0.0625rem;
  text-align: right;

  button {
    border: solid 0.0625rem #f15353;
    background: #fff;
    border-radius: 0.875rem;
    margin-right: 0.3125rem;
    color: #f15353;
  }
}

.loadNomore img {
  width: 20%;
}

#rentMyOrder {
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;

  .grandparent {
    width: 100%;
    height: 2.8125rem;
    overflow-x: auto;
    overflow-y: hidden;
    position: fixed;
    z-index: 9;

    .allTitle {
      height: 2.8125rem;
      background: #f00;

      .mint-navbar {
        top: 2.5rem;
      }
    }
  }
}
</style>
