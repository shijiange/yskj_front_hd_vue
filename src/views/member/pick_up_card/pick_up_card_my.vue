<template>

	<div class="page">
		<c-title :hide="false" text="我的卡"></c-title>

		<div class="listData">
			<div class="item" @click="toPickCardMyDet(item.id)" v-for="item in listData" :key="item.id">
				<div class="name">{{item.name}}</div>
				<div class="desc">
					<div class="type">{{item.category}}</div>
					<div class="cc">总数：<span class="number">{{item.total}}</span></div>
					<div class="cc">已使用：<span class="number">{{item.isused}}</span></div>
					<div class="cc">未使用：<span class="number">{{item.notused}}</span></div>
				</div>
			</div>
			
		</div>



	</div>

</template>

<script>
import pickUpCardMyController from "./pick_up_card_my_controller";

export default pickUpCardMyController;
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #fff;
}

.listData {
  text-align: left;

  .item {
    padding-top: 0.638rem;
    padding-left: 0.969rem;
    height: 5.406rem;
    border-bottom: 0.656rem solid #f2f2f2;

    &:last-child {
      border-bottom: none;
    }

    .name {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 0.938rem;
      color: #333;
    }

    .desc {
      margin-top: 0.581rem;
      display: flex;
      align-items: center;

      .type {
        font-size: 0.688rem;
        color: #333;
        padding: 0.313rem 0.344rem 0.281rem 0.438rem;
        background-color: #f0f0f0;
        border-radius: 0.125rem;
      }

      .cc {
        margin-left: 1.25rem;
        font-size: 0.813rem;
        color: #333;

        .number {
          color: #f15353;
        }
      }
    }
  }
}

</style>