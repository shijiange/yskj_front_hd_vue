<template>

  <div id="details">
    <c-title :hide="false"
             :text='`${this.fun.initWithdrawal()}详情`'></c-title>
    <div class="tbs">
      <div class="number"
           style="flex: 100%;"><span
        style="color: #8c8c8c;">{{this.fun.initWithdrawal()}}编号</span><span>{{withdraw_sn}}</span></div>
      <div class="left"
           style="flex: 20%;"><span class="">{{this.fun.initWithdrawal()}}类型</span></div>
      <div class="right"
           style="flex: 80%;"><span class="red">{{type_name}}</span></div>
      <div class="left">{{this.fun.initWithdrawal()}}金额</div>
      <div class="right">{{amounts}}元</div>
      <div class="left"
           style="flex: 20%;">{{this.fun.initWithdrawal()}}时间
      </div>
      <div class="right"
           style="flex: 80%;">{{created_at}}
      </div>
      <div class="left">{{this.fun.initWithdrawal()}}{{poundage_name}}</div>
      <div class="right">{{actual_poundage}}元</div>
      <div class="left">提现劳务税</div>
      <div class="right">{{actual_servicetax}}元</div>
      <div class="left">打款金额</div>
      <div class="right">{{actual_amounts}}元</div>

    </div>
    <div class="tbs"
         v-for=" (item,i) in incomes" :key='i'>
      <!--<div class="left" style="flex: 60%;">订单编号  {{item.order_sn}}</div>
			<div class="right" style="flex: 40%;">订单金额  {{item.price}}元</div>-->
      <div class="left"
           style="flex: 40%;">计算金额: {{item.commission_amount}}元
      </div>
      <div class="right"
           style="flex: 60%;">结算方式: {{item.formula}}
      </div>
      <div class="left"
           style="flex: 40%;">佣金: {{item.commission}}元
      </div>
      <div class="right"
           style="flex: 60%;">比例: {{item.commission_rate}}%
      </div>

      <!--<div class="goods">
				<div class="img"><img src="http://www.heliaigou.com/attachment/images/0/2016/12/Nw93tt3t5T9v3C5527Rjw9Xwwr22W9.jpg"></div>
				<div class="name"><font>奥康增高男鞋 新款真皮系带隐形内增高皮鞋韩版休闲鞋透气低帮鞋</font><span>收入类型：51.01元</span></div>
				<div class="option"><font>1级</font><span class="red">已审核</span></div>
			</div>-->
    </div>
    <!--<div class="tbs">
			<div class="left" style="flex: 60%;">订单编号  1181559382029</div>
			<div class="right" style="flex: 40%;">订单金额  200.00元</div>
			<div class="left"style="flex: 40%;">申请金额  100元</div>
			<div class="right" style="flex: 60%;">审核通过金额 86.00元</div>

			<div class="goods">
				<div class="img"><img src="http://www.heliaigou.com/attachment/images/0/2016/12/Nw93tt3t5T9v3C5527Rjw9Xwwr22W9.jpg"></div>
				<div class="name"><font>奥康增高男鞋 新款真皮系带隐形内增高皮鞋韩版休闲鞋透气低帮鞋</font><span>收入类型：51.01元</span></div>
				<div class="option"><font>1级</font><span class="red">已审核</span></div>
			</div>
			<div class="goods">
				<div class="img"><img src="http://www.heliaigou.com/attachment/images/0/2016/12/Nw93tt3t5T9v3C5527Rjw9Xwwr22W9.jpg"></div>
				<div class="name"><font>奥康增高男鞋 新款真皮系带隐形内增高皮鞋韩版休闲鞋透气低帮鞋</font><span>收入类型：51.01元</span></div>
				<div class="option"><font>1级</font><span class="red">已审核</span></div>
			</div>
		</div> 		-->
  </div>

</template>
<script>
import member_income_presentationRecord_presentationDetails_controller
  from "./member_income_presentationRecord_presentationDetails_controller";

export default member_income_presentationRecord_presentationDetails_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #details {
    .tbs {
      display: flex;
      align-items: center;
      background: #fff;
      flex-flow: row wrap;
      padding: 0.625rem 0.875rem;
      line-height: 1.5rem;
      margin-bottom: 0.625rem;
      font-size: 12px;

      .left {
        text-align: left;
        flex: 65%;
        color: #8c8c8c;
        line-height: 1.875rem;
      }

      .right {
        text-align: right;
        flex: 35%;
        line-height: 1.875rem;
      }

      .red {
        color: red;
      }

      .goods {
        display: flex;
        align-items: stretch;
        flex-flow: row wrap;
        background: #e6e6e6;
        padding: 0.3125rem;
        margin-top: 0.3125rem;
      }

      .img {
        flex: 25%;

        img {
          width: 100%;
          margin-top: 0.4375rem;
        }
      }

      .name {
        flex: 60%;
        text-align: left;
        padding: 0 0.625rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        font {
          flex: 5;
        }

        span {
          flex: 1;
        }
      }

      .option {
        flex: 15%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        font {
          flex: 5;
          text-align: right;
          width: 100%;
        }

        .red {
          flex: 1;
          text-align: right;
          width: 100%;
        }
      }

      .number {
        display: flex;
        justify-content: space-between;
        line-height: 1.875rem;
      }
    }
  }
</style>