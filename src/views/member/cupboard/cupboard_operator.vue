<template>
	<div id="register">
	<c-title :hide="false" text='智能柜操作'></c-title>
	<div class="content-box">
		<div class="name">
			<h2>柜子名称:{{cup_name}}</h2>
			<span>格子：{{cup_id}}</span>
		</div>
		
		<div class="item">
			<ul>
				<li class="launch" @click="delivery">
					<i class="iconfont icon-cupboard-download"></i><br>
					<span>投放</span>
				</li>
				<li class="del" @click="empty">
					<i class="iconfont icon-cupboard-del"></i><br>
					<span>删除</span>
				</li>
			</ul>
		</div>
		
	</div>
	</div>
</template>

<script> 
import cupboard_operator from "./cupboard_operator_controller";
export default cupboard_operator;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#register {
  h1 {
    line-height: 2.5rem;
  }

  .content-box {
    background-color: #fff;
    padding-top: 3rem;
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

    .item {
      margin-top: 5rem;

      ul {
        display: flex;

        li {
          flex: 1;
        }

        .launch {
          i {
            font-size: 3.5rem;
            color: #259b24;
          }

          span {
            font-size: 14px;
            margin-top: 0.375rem;
            display: inline-block;
          }
        }

        .del {
          i {
            font-size: 3.5rem;
            color: #f15353;
          }

          span {
            font-size: 14px;
            margin-top: 0.375rem;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>