<template>
	<div class="wrapper">
		<div class="item">
			<div class="face">
				<img :src="item.has_one_member.avatar_image" alt="">
			</div>
			<div class="name">{{item.has_one_member.nickname}}</div>
			<div class="price">+{{item.price}}</div>
		</div>
	</div>
</template>

<script>


export default {
  props:{
    item:{},
  },
  components:{},
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .wrapper {
    padding: 0 0.75rem;
    background: #fff;

    .item {
      padding: 0.75rem 0 0.781rem;
      display: flex;
      align-items: center;
      border-bottom: 0.031rem solid #ededed;

      .face {
        width: 2.875rem;
        height: 2.875rem;
        background-color: #ededed;
        border-radius: 50%;

        img {
          width: 2.875rem;
          height: 2.875rem;
          border-radius: 50%;
        }
      }

      .name {
        white-space: nowrap;
        margin-left: 0.75rem;
        width: 13rem;
        text-align: left;
        color: #1e1b1b;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.875rem;
      }

      .price {
        padding-left: 1rem;
        color: #ff2c29;
        font-size: 0.875rem;
      }
    }
  }

</style>