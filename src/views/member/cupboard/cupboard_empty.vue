<template>
	<div id="register">
	
	<c-title :hide="false" text='清空商品'></c-title>
	<div class="content-box">
		<div class="name">
			<h2>柜子名称:{{cup_name}}</h2>
			<span>格子：{{cup_id}}</span>
		</div>
		<div class="goods-img">
			<div class="img"><img :src="this.fun.isTextEmpty(cup_img)?require('../../../assets/images/loading.jpg'):cup_img" ></div>
			<span>芸中商城商品名称</span>
		</div>
		<div class="btn">
			<van-button type="hollow" @click.native="empty">确认清空</van-button>
		</div>
		
		
	</div>
	</div>
</template>

<script>
import cupboard_empty_controller from "./cupboard_empty_controller";
export default cupboard_empty_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#register {
  .content-box {
    background-color: #fff;
    padding-top: 3rem;
    margin-top: 0.625rem;
    height: 38.5625rem;

    .name {
      h2 {
        font-size: 16px;
        margin-bottom: 0.625rem;
        color: #333;
      }

      span {
        color: #999;
        font-size: 14px;
      }
    }

    .goods-img {
      margin-top: 2.5rem;

      .img {
        width: 6.25rem;
        height: 6.25rem;
        background-color: #0487a1;
        margin: 0 auto;

        img {
          width: 100%;
          height: 100%;
        }
      }

      span {
        display: inline-block;
        margin-top: 0.625rem;
        font-size: 14px;
      }
    }

    .btn {
      margin-top: 5rem;

      button {
        width: 69%;
        height: 2.5rem;
        margin: 0 auto;
        background-color: #f15353;
        border: none;
        color: #fff;
        border-radius: 0.25rem;
        font-size: 14px;
        padding: 0;
      }
    }

    .prompt {
      border-radius: 0.25rem;

      h1 {
        line-height: 2.75rem;
        font-size: 16px;
      }

      span {
        display: inline-block;
        color: #999;
        font-size: 14px;
        line-height: 2.25rem;
        margin-bottom: 0.625rem;
      }

      ul {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        border-top: solid 0.0625rem #ebebeb;

        li {
          line-height: 2.5rem;
          flex: 1;
        }

        li:first-child {
          border-right: solid 0.0625rem #ebebeb;
        }
      }
    }
  }
}
</style>