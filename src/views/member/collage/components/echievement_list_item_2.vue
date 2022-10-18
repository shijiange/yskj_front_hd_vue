<template>
	<div class="wrapper">
		<div class="item">
			<div class="c1 cc">
				<span>拼单单号：{{item.id}}</span>
				<span class="price">+{{item.price}}</span>
			</div>
			<div class="c2 cc">
				时间：{{item.created_at}}
			</div>
			<div class="c3 cc">下级平级会员昵称：{{item.lower_level_name}}</div>
			<div class="c4 cc">分红金额：{{item.lower_amount || 0}}</div>
		</div>
	</div>
</template>

<script>


export default {
  props:{
    item:{}
  },
  components:{},
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .wrapper {
    padding: 0 0.75rem;
    background: #fff;

    .item {
      padding: 0.75rem 0 0.381rem;
      display: flex;
      flex-direction: column;
      border-bottom: 0.031rem solid #ededed;

      .c1 {
        display: flex;
        justify-content: space-between;
      }

      .cc {
        padding: 0.2rem 0.6rem;
        text-align: left;
        font-size: 0.75rem;
        letter-spacing: 0.038rem;
        color: #767676;

        .price {
          color: #ff2c29;
          font-size: 0.75rem;
        }
      }
    }
  }

</style>