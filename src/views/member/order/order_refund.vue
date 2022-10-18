<template>
	<div id="refund">
		<c-title :hide="false" text='归还商品'></c-title>
		<!-- 状态1 -->
		<div v-if="order_status == 2" class="status-1">
			<ul class="money">
				<li>
					<span class="left">押金预计退还金额</span>
					<span>{{$i18n.t('money')}}{{refundMoney}}</span>
				</li>
			</ul>
			<p class="prompt">提示：最终退款金额已商品退还确认后为准</p>
			<p class="refund-add">退还地址：请务必按照选择的地址退回商品</p>
			<div class="add-box">
				<van-radio-group v-model="checked" @change="chooseAddress">
				<!--<el-radio-group v-model="checked" @change="chooseAddress">-->
					<div class="addr" v-for="(item,index) in address" :key='index'>
						<div style="width: 100%; font-size: 14px;">
							<p><i class="fa fa-map-marker" style="margin-right: 0.3125rem;"></i>收件人:{{item.contact_name}} {{item.mobile}}
								<div style="float: right;">
									<van-radio :name="item">&nbsp;</van-radio>
									<!--<el-radio :label="item">&nbsp;</el-radio>-->
								</div>
							</p><br>
							<p>{{item.address}}</p>
						</div>
					</div>
				<!--</el-radio-group>-->
				</van-radio-group>
			</div>
			<div class="express-member">
				<span>退还快递:</span>
				<input type="text" @click="expressShow" readonly placeholder="请选择退还快递" v-model="express">
			</div>
			<div class="express-member">
				<span>快递单号:</span>
				<input type="text" placeholder="请输入您的快递单号" v-model="expressSN">
			</div>
			<div class="submit">
				<input type="button" name="button" id="button" value="提交归还" @click="submit" />
			</div>
		</div>
		<!-- 状态2 -->
		<!-- <div v-if="order_status == 1">
			<div id="state">
				<span>商品状态:</span>
				<span>{{check_status}}</span>
			</div>
			<div class="return-money">
				<ul class="money">
					<li>
						<span class="left">押金退还金额</span>
						<span class="right">{{$i18n.t('money')}}{{refundMoney}}</span>
					</li>
				</ul>
				<p class="prompt">提示：最终退款金额已商品退还确认后为准</p>
			</div>
		</div> -->
		<van-popup v-model="popupVisible" position="bottom" style="width: 100%; height: 18.75rem;">
			<div style="height: 2.5rem; line-height: 2.5rem; background: #fff; color: #000; border-bottom: 0.0625rem solid #ebebeb;">选择快递</div>
			<div style="width: 100%; height: 18.75rem; overflow: scroll;">
				<div v-for="(item,i) in options" :key='i' style="height: 2.5rem; line-height: 2.5rem; border-bottom: 0.0625rem solid #ebebeb;" @click="expressChoose(item)">
					{{item.name}}
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
import refund from "./order_refund_controller";
export default refund;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#refund {
  .status-1 {
    padding: 0 0.875rem 2.8125rem 0.875rem;
    background-color: #fff;
  }

  .money {
    padding: 0.625rem 0;

    li {
      line-height: 1.625rem;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
  }

  .prompt {
    color: #f15353;
    text-align: left;
    line-height: 1.5rem;
    margin-bottom: 0.625rem;
  }

  .refund-add {
    text-align: left;
    font-size: 14px;
    line-height: 1.5rem;
    margin-bottom: 0.625rem;
  }

  .add-box {
    margin-bottom: 1.25rem;

    .addr {
      border-top: solid 0.0625rem #ebebeb;
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      align-items: center;
      background: #fff;
      padding: 1rem 0;

      .icon {
        font-size: 0.875rem;
        display: flex;

        i {
          line-height: 1.5rem;
          margin-right: 0.625rem;
        }
      }

      i {
        font-size: 16px;
        color: #333;
      }

      .fa-angle-right {
        font-size: 24px;
        color: #c9c9c9;
      }

      p {
        flex: 6;
        text-align: justify;
        font-weight: bold;
        line-height: 1.5rem;
        padding-right: 1rem;
        color: #333;

        span {
          font-size: 14px;
          font-weight: normal;
          color: #666;
        }
      }
    }
  }

  .refund-express {
    width: 100%;
    display: flex;
    text-align: left;
    font-size: 14px;

    span {
      width: 21%;
      line-height: 1.625rem;
    }

    select {
      width: 79%;
      border: solid 0.0625rem #ebebeb;
      background-color: #fff;
      height: 1.625rem;
      border-radius: 0.1875rem;
      padding: 0 0.25rem;
      color: #8c8c8c;
    }
  }

  .express-member {
    span {
      line-height: 1.625rem;
      width: 21%;
    }

    display: flex;
    justify-content: space-between;
    text-align: left;
    font-size: 14px;
    margin-top: 1.25rem;

    input {
      background-color: #fff;
      border: solid 0.0625rem #ebebeb;
      width: 79%;
      height: 1.625rem;
      border-radius: 0.1875rem;
      padding: 0 0.25rem;
    }
  }

  .remarks {
    justify-content: space-between;
    text-align: left;
    font-size: 14px;
    display: flex;
    margin-top: 1.25rem;

    span {
      margin-right: 0.625rem;
    }

    textarea {
      width: 79%;
      background-color: #fafafa;
      border: solid 0.0625rem #ebebeb;
      border-radius: 0.25rem;
      padding: 0.25rem;
      height: 4.25rem;
    }
  }

  .submit {
    margin-top: 1.25rem;

    input {
      width: 60%;
      height: 2rem;
      color: #fff;
      background-color: #f15353;
      border: none;
      border-radius: 0.25rem;
      font-size: 14px;
    }
  }

  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0.625rem;
    align-items: center;

    span {
      width: 6.5625rem;
      flex: none;
      font-size: 16px;
      line-height: 1;
    }

    .my-value {
      flex: 2;
      text-align: left;

      span {
        color: red;
      }
    }
  }

  .el-radio-group {
    display: block;
  }

  #state {
    display: flex;
    justify-content: space-between;
    background-color: #f15353;
    color: #fff;
    padding: 0 0.875rem;
    height: 3.75rem;
    text-align: left;

    span {
      font-size: 16px;
      font-weight: bold;
      line-height: 3.75rem;
    }
  }

  .return-money {
    background-color: #fff;
    padding: 0 0.875rem;
  }

  .money {
    padding: 0.625rem 0;
    border-bottom: solid 0.0625rem #ebebeb;

    li {
      line-height: 1.875rem;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }

    .right {
      color: #f15353;
    }
  }

  .prompt {
    color: #8c8c8c;
    text-align: left;
    line-height: 2.25rem;
  }

  .van-nav-bar,
  /deep/.van-nav-bar__content {
    height: 40px;
  }

  /deep/.van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/.van-nav-bar .van-icon {
    color: #666;
  }

  /deep/.van-nav-bar__left {
    padding: 0 0 0 10px;
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
    left: 50%;
    margin-left: -187.5px;
  }
}
</style>
