<style lang="scss" rel="stylesheet/scss" scoped>
p,
ul,
li {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

#share {
  .m_header {
    width: 100%;
    height: 2.8125rem;
    padding-right: 0.9375rem;
    box-sizing: border-box;
    background: #fff;
    line-height: 2.8125rem;
    font-size: 18px;

    span {
      display: inline-block;
      width: 1rem;
      height: 1.5rem;
      float: left;
      margin-left: 0.625rem;
      font-size: 30px;
    }

    i {
      font-size: 16px;
      float: right;
      font-style: normal;
    }
  }

  .top {
    background: #fff;
    position: relative;
    text-align: center;

    i {
      line-height: 48px;
      font-style: normal;
      font-size: 14px;
      display: block;
    }

    .content {
      width: 7.5rem;
      margin: 0 auto;
      font-size: 16px;
      text-align: center;

      span {
        font-size: 28px;
        font-weight: bold;
        color: #333;
        display: inline-block;
      }

      b {
        line-height: 1.5rem;
        font-weight: normal;
        color: #fff;
        background: #f15353;
        width: 3.75rem;
        height: 1.5rem;
        display: inline-block;
      }
    }
  }

  .middle,
  .bott {
    text-align: left;
    padding: 0.625rem 0.75rem;
    line-height: 1.875rem;
    color: #343434;
    background: #fff;
    margin-bottom: 0.5rem;
  }

  .middle {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;

    .lrest {
      flex: 50%;
      color: #8c8c8c;
    }

    .resot {
      flex: 50%;
      text-align: right;
    }
  }
}
</style>
<template>
	<div id="share">
		<div>
	
			<c-title :hide="false" :text='mailFullReturnTitle'></c-title>
			<div class="top">
				<i>{{mailFullReturnAmount}}（元）</i>
				<div class="content">
					<span>{{amount}}</span>
				</div>
			</div>
			<div class="middle">
				<template>
					<div class="lrest" v-if="info">营业额</div>
					<div class="resot" v-if="info">{{turnover}}元</div>

					<div class="lrest" v-if="info">权益单价</div>
					<div class="resot" v-if="info">{{unit_price}}元/个</div>

					<div class="lrest" v-if="info">{{mailFullReturnName}}比例</div>
					<div class="resot" v-if="info">{{ratio}}%</div>

					<div class="lrest" v-if="info">{{mailFullReturnName}}总额</div>
					<div class="resot" v-if="info">{{amount_total}}元</div>

					<div class="lrest" v-if="info">剩余{{mailFullReturnName}}金额</div>
					<div class="resot" v-if="info">{{amount_surplus}}元</div>

					<div class="lrest">{{mailFullReturnName}}时间</div>
					<div class="resot">{{created_at}}</div>
				</template>
			</div>
		</div>
	</div>
</template>


<script>
import full_return_list_info_controller from './full_return_list_info_controller';
export default full_return_list_info_controller;
</script>