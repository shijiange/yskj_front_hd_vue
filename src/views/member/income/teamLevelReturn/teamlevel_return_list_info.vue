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
    height: 5.9375rem;
    padding: 0.9375rem;
    background: #fff;
    position: relative;
    text-align: center;
    margin: 0.9375rem 0;

    i {
      font-style: normal;
      font-size: 16px;
      display: block;
    }

    .content {
      width: 7.5rem;
      margin: 0 auto;
      font-size: 16px;
      text-align: center;

      span {
        font-size: 28px;
        color: green;
        display: inline-block;
        padding-top: 0.75rem;
        margin-bottom: 0.3125rem;
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
    padding: 0.9375rem 0.9375rem;
    line-height: 2rem;
    color: #343434;
    background: #fff;
    margin-bottom: 0.5rem;
  }

  .middle {
    display: flex;
    flex-wrap: wrap;

    .lrest {
      flex: 70%;
    }

    .resot {
      flex: 30%;
      text-align: right;
    }
  }
}
</style>
<template>
	<div id="share">
		<div>

			<c-title :hide="false" :text='mailTeamReturnTitle'></c-title>
			<div class="top">
				<i>{{mailTeamAmount}}</i>
				<div class="content">
					<span>{{return_amount}}</span>{{$i18n.t('元')}}
					<br />
				</div>
			</div>
			<div class="middle">
				<template>
					<div class="lrest">商城总销售额</div>
					<div class="resot">{{mall_amount}}</div>

					<div class="lrest">{{mailTeamReturnRate}}</div>
					<div class="resot">{{rate}}%</div>
					<template v-for="(elem,index) in power_data">
						<div class="lrest" :key="index">{{elem.level}}</div>
						<div class="resot" :key="index">{{elem.level_num}}</div>
						<div class="lrest" :key="index">{{elem.team}}</div>
						<div class="resot" :key="index">{{elem.team_num}}</div>
					</template>


					<!--<div style="width:100%">-->
					<!--<ul class='rationList'>-->
						<!--<li v-for="elem in power_data" class="recordList">-->
							<!--<div>-->
							<!--<div class="lrest">{{elem.level}}</div>-->
							<!--<div class="resot">{{elem.level_num}}</div>-->
							<!--</div>-->
							<!--<div>-->
								<!--<div class="lrest">{{elem.team}}</div>-->
								<!--<div class="resot">{{elem.team_num}}</div>-->
							<!--</div>-->
						<!--</li>-->
					<!--</ul>-->
					<!--</div>-->
					<div class="lrest">总权益</div>
					<div class="resot">{{power_total}}</div>

				</template>
			</div>
			<div class="middle">
				<template>
					<div class="lrest">{{mailTeamReturnName}}ID</div>
					<div class="resot">{{id}}</div>

					<div class="lrest" style="flex: 30%;">{{mailTeamReturnName}}时间</div>
					<div class="resot" style="flex: 70%;">{{created_at}}</div>
				</template>
			</div>
		</div>
	</div>
</template>


<script>
import single_return_list_info_controller from './teamlevel_return_list_info_controller';
export default single_return_list_info_controller;
</script>
