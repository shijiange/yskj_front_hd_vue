<template >
<div id="evaluate">
	<c-title :hide="false" text='回复评论'></c-title>
       
	<div id="pjall">
				<div style="height: 0.625rem;"></div>
		<!--<el-input-->
<!--type="textarea"-->
  <!--:rows="2"-->
  <!--placeholder="请输入评论内容"-->
  <!--v-model="comment">-->
<!--</el-input>-->
		<van-cell-group>
			<van-field v-model="comment"  type="textarea" placeholder="请输入评论内容" rows="2"
			/>
		</van-cell-group>
		<!--<textarea placeholder="这次买的商品满意吗？写点心得给其他顾客参考吧。长度在5-100字之间" type="textarea" rows="4" v-model="comment"></textarea>-->
		
	</div>
	<van-button type="primary" @click="toComment">提交评价</van-button>
	<!--<el-button type="primary" @click="toComment">提交评价</el-button>-->
</div>
</template>
<script>
import replyEvaluate from './order_list_replyEvaluate_controller';
export default replyEvaluate;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#evaluate {
  #shop { background: #fff; padding: 0.625rem; }

  .goods {
    display: flex;
    align-items: stretch;
    flex-flow: row wrap;
    background: #efeded;
    padding: 0.3125rem;
    margin-bottom: 0.3125rem;

    .img { flex: 3; img { width: 100%; } }
    .inner { flex: 5; padding: 0 0.3125rem; display: flex; flex-direction: column; align-items: flex-start; }
    .name { flex: 5; text-align: left; }
    .price { flex: 2; align-items: center; }
    .option { color: #888; font-size: 12px; flex: 1; }
  }

  #pjall {
    background: #fff;
    padding: 0.9375rem;
    textarea { width: 87%; margin-top: 0.625rem; padding: 0.625rem; }

    #pj {
      text-align: left;
      span { float: left; font-size: 14px; padding-right: 0.625rem; }
    }

    .van-cell-group {
      border: 1px solid #bfcbd9;
      border-radius: 4px;

      .van-cell {
        border-radius: 4px;
      }
    }
  }
  button { width: 100%; }
}
</style>