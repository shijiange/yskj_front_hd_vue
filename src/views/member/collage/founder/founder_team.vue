<template>
	<div class="page">
		<c-title text="我的团队"></c-title>
		<van-tabs v-model="activeIndex" @change="changeVanTabIndex">
			<van-tab :title="item.name"  v-for="item in applyLevelList" :key="item.id"></van-tab>
		</van-tabs>


		<div class="itemHeader" v-if="listData.length>0">
			<div class="c1">团员信息</div>
			<div class="c2">出单数量</div>
			<div class="c3">出单金额</div>
		</div>
		
		<div class="listItems">
			<div class="item" v-for="item in listData" :key="item.id">
				<div class="face">
					<img :src="item.has_one_member.avatar_image" alt="">
				</div>
				<div class="info">
					<div class="name">{{item.has_one_member.nickname}}</div>
					<div class="time">加入时间: {{item.created_at}} </div>
				</div>
				<div class="num">{{item.order_num}}</div>
				<div class="price">{{item.sum_amount}}</div>
			</div>
		</div>

	</div>
		
</template>



<script>

import founderTeamController from './founder_team_controller';

export default founderTeamController;

</script>


<style lang="scss" rel="stylesheet/scss" scoped>
  .page { background: rgb(246, 248, 252); min-height: 100vh; padding-bottom: 3.0625rem; }

  .itemHeader {
    height: 2.75rem;
    display: flex;
    align-items: center;
    color: #3f3f3f;
    font-size: 0.75rem;

    .c1 {
      margin-left: 4.9rem;
    }

    .c2 {
      margin-left: 6rem;
    }

    .c3 {
      margin-left: 1.844rem;
    }
  }

  .listItems {
    background: #fff;
    padding: 0 0.813rem;

    .item {
      height: 4.344rem;
      display: flex;
      align-items: center;

      .face {
        width: 2.875rem;
        height: 2.875rem;
        border-radius: 50%;
        background-color: #ededed;

        img {
          width: 2.875rem;
          height: 2.875rem;
          border-radius: 50%;
        }
      }

      .info {
        width: 9rem;
        margin-left: 0.75rem;
        text-align: left;

        .name {
          color: #1e1b1b;
          font-size: 0.875rem;
        }

        .time {
          margin-top: 0.3rem;
          font-size: 0.75rem;
          color: #919191;
        }
      }

      .num {
        width: 4rem;
        font-size: 0.875rem;
        color: #1e1b1b;
      }

      .price {
        margin-left: 0.8rem;
        width: 4rem;
        font-size: 0.875rem;
        color: #1e1b1b;
      }
    }
  }
</style>