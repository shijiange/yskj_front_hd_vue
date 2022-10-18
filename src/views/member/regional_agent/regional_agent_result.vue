<template>
	<div class="page">
		<c-title text="查询结果"></c-title>

		<div class="tool">
			<div class="selected">
				<div class="selectedName">{{area}}</div>
			</div>
			<div class="count">
				总数：{{total}}
			</div>
		</div>

		<div class="items">
			<div class="item" v-for="item in listData" :key="item.id">
				<div class="face">
					<img v-if="item.has_one_member" :src="item.has_one_member.avatar_image" alt="">
				</div>
				<div class="name" v-if="item.has_one_member">{{item.has_one_member.nickname}}</div>
				<div class="agent">{{item.level_name}}</div>
			</div>
		</div>

				
	</div>
</template>

<script>
import RegionalAgentResultController from './regional_agent_result_controller.js';

export default RegionalAgentResultController;
</script>



<style lang="scss" rel="stylesheet/scss" scoped>

  .page { background: #fff; min-height: 100vh; }

  .tool {
    display: flex;
    padding: 1.031rem 1.563rem 1.031rem 0.781rem;
    justify-content: space-between;

    .selected {
      flex: 1;
      padding-right: 1rem;
      display: flex;

      .selectedName {
        text-align: left;
        margin-right: 0.5rem;
        color: #0176ff;
        font-size: 0.875rem;
      }
    }

    .count {
      font-size: 0.875rem;
      color: #666;
    }
  }

  .items {
    padding: 0 0.813rem;

    .item {
      display: flex;
      align-items: center;
      height: 4.406rem;
      border-bottom: 0.031rem solid #ededed;

      .face {
        width: 2.875rem;
        height: 2.875rem;
        border-radius: 50%;
        background-color: #ededed;

        img {
          width: 2.875rem;
          height: 2.875rem;
          border-radius: 50%;
          background-color: #ededed;
        }
      }

      .name {
        margin-left: 0.719rem;
        flex: 1;
        text-align: left;
        font-size: 0.875rem;
        color: #1e1b1b;
      }

      .agent {
        font-size: 0.875rem;
        color: #1e1b1b;
      }
    }
  }

</style>