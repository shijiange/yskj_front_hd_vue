<template>
    <div class="page">
       <c-title text="奖励记录"></c-title>

		<div class="list">
			<div class="item" v-for="item in listData" :key="item.id">
				<div class="top">
					<div class="orderNum">{{item.has_one_order.order_sn}}</div>
					<div class="price">{{item.amount}}</div>
				</div>
				<div class="bot">
					<div class="time">{{item.created_at}}</div>
					<div class="status">未释放：{{$i18n.t('money')}}{{item.not_release}}</div>
				</div>
			</div>
		</div>

    </div>
</template>

<script>
import regionalAwardsRecordController from './regional_awards_record_controller';

export default regionalAwardsRecordController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page { background: rgb(245, 245, 245); min-height: 100vh; }

  .list {
    .item {
      width: 23.438rem;
      height: 5.188rem;
      padding: 1.2rem 0.938rem 0.8rem 0.813rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #fff;
      margin-bottom: 0.438rem;

      .top {
        display: flex;
        justify-content: space-between;
        font-size: 1rem;

        .orderNum {
          color: #333;
        }

        .price {
          color: #f15353;
        }
      }

      .bot {
        display: flex;
        justify-content: space-between;

        .time {
          font-size: 0.813rem;
          color: #8c8c8c;
        }

        .status {
          font-size: 0.875rem;
          color: #333;
        }
      }
    }
  }

</style>
