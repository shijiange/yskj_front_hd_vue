<template>
	<div id="toBeSend">

		<c-title :hide="false" text='订单详情'></c-title>

		<div class="m-header">
			<h3>{{status_name}}</h3>
			<div class="btn" v-for="(btn,i) in buttons" :key='i'>
				<button type="button" class="payBtn" @click="operation(btn)">{{btn.name}}</button>
			</div>
		</div>
		<div class="returnAddr">
			<div class="return addr" v-if="lease_order_return_address">
				<div class="lf">
					<span>还</span>
				</div>
				<div class="rt">
					<p>收货人：{{lease_order_return_address.realname}}&nbsp;&nbsp;&nbsp;&nbsp;{{lease_order_return_address.mobile}}</p>
					<p>归还地址：{{lease_order_return_address.address}}</p>
				</div>
			</div>
			<div class="recive addr">
				<div class="lf">
					<span>收</span>
				</div>
				<div class="rt">
					<p>收货人：{{address_info.realname}}&nbsp;&nbsp;&nbsp;&nbsp;{{address_info.mobile}}</p>
					<p>归还地址：{{address_info.address}}</p>
				</div>
			</div>
			<div class="remark">
				<i class="iconfont icon-jiage"></i>备注:</div>
		</div>
		<div class="content">
			<div class="data">
				<div class="lf">
					<i class="iconfont icon-quyufenhong"></i>
					租赁日期
				</div>
				<div class="rt">
					<p>起始：{{lease_order.start_time}}</p>
					<p>归还：{{lease_order.end_time}}</p>
					<h3>共计：{{lease_order.time_lift}}天</h3>
				</div>
			</div>
			<template v-for=" goods in has_many_order_goods">
				<div class="pro" :key="goods.id">
					<img :src="goods.thumb" alt="" />
					<div class="title">
						<p>{{goods.title}}</p>
						<b>规格:{{goods.goods_option_title}}</b>
					</div>
					<div class="rt">
						<p>x{{goods.total}}</p>
					</div>
				</div>
				<div class="money" :key="goods.id">
					<p>
						<span class="lf">租金
							<i @click="rentalTip()">?</i>
						</span>
						<span class="rt">{{$i18n.t('money')}}{{goods.price}}</span>
					</p>
					<p>
						<span class="lf">押金
							<i @click="depositTip()">?</i>
						</span>
						<span class="rt">{{$i18n.t('money')}}{{goods.lease_order.cash}}</span>
					</p>

				</div>
			</template>
			<div class="money">
				<p>
					<span class="lf">运费 </span>
					<span class="rt">{{$i18n.t('money')}}{{dispatch_price}}</span>
				</p>
			</div>

			<div class="all">
				合计：
				<span>{{$i18n.t('money')}}{{price}}</span>
			</div>

		</div>
		<ul class="orderDetail">
			<li>
				<span class="lf">订单编号：</span>
				<span class="rt">{{order_sn}}</span>
			</li>
			<li>
				<span class="lf">支付方式：</span>
				<span class="rt">{{pay_type_name}}</span>
			</li>
			<li>
				<span class="lf">下单时间：</span>
				<span class="rt">{{create_time}}</span>
			</li>
			<li>
				<span class="lf">付款时间：</span>
				<span class="rt">{{pay_time}}</span>
			</li>
		</ul>

		<!-- 弹窗 -->
		<div class="modal" v-show="rental">
			<div class="modal-dialog">
				<div class="close" @click="closeModal()">
					<img src="../../../assets/images/close.png">
				</div>
				<h1 class="title">租金说明</h1>
				<p>如果你无法简洁的表达你的想法，那么说明你还不都了解他---阿尔伯特-爱因斯坦</p>
			</div>
		</div>
		<!-- 弹窗 -->
		<div class="modal" v-show="deposit">
			<div class="modal-dialog">
				<div class="close" @click="closeModal()">
					<img src="../../../assets/images/close.png">
				</div>
				<h1 class="title">押金冻结说明</h1>
				<p>如果你无法简洁的表达你的想法，那么说明你还不都了解他---阿尔伯特-爱因斯坦</p>
			</div>
		</div>
	</div>
</template>

<script>
import toBeComplete_controller from './toBeComplete_controller';
export default toBeComplete_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#toBeSend {
  .m-header {
    text-align: center;
    padding: 0 0.9375rem;
    background: #fff;
    clear: both;

    .money {
      text-align: right;
      float: right;
      height: 2.5rem;
      line-height: 2.5rem;
      color: #e51c23;
    }

    h3 {
      line-height: 1.875rem;
      padding-top: 1.25rem;
      text-align: center;
      color: #ff9500;
      font-weight: normal;

      i {
        padding-left: 0.625rem;
        color: #919097;
      }
    }

    p {
      clear: both;
      line-height: 1.875rem;

      i {
        padding-right: 0.625rem;
      }
    }

    .btn {
      padding: 0.625rem 0;

      button {
        width: 5rem;
        height: 1.875rem;
        border-radius: 0.3125rem;
        border: 0.0625rem solid #ccc;
        outline: 0;
        background: #fff;
      }

      .payBtn {
        color: #f15353;
        border: 0.0625rem solid #f15353;
      }
    }
  }

  .returnAddr {
    margin-top: 0.625rem;

    .addr {
      display: flex;
      flex-flow: row;
      height: 4.375rem;
      background: #fff;
      border-bottom: 0.0625rem solid #ccc;

      div.lf {
        width: 3.125rem;

        span {
          width: 1.875rem;
          height: 1.875rem;
          display: inline-block;
          text-align: center;
          line-height: 1.875rem;
          border-radius: 50%;
          color: #fff;
          margin-top: 1.25rem;
        }
      }

      div.rt {
        flex: 1;
        padding: 0.9375rem;

        p {
          text-align: left;
          line-height: 1.25rem;
        }
      }
    }

    .return {
      div.lf {
        span {
          background: #ff9500;
        }
      }

      div.rt {
        color: #ff9500;
      }
    }

    .recive {
      div.lf {
        span {
          background: #666;
        }
      }

      div.rt {
        color: #101010;
      }
    }

    .remark {
      line-height: 1.25rem;
      background: #fff;
      padding: 0.625rem 0.9375rem;
      text-align: left;

      i {
        padding-right: 0.4375rem;
      }
    }
  }

  .content {
    background: #fff;
    margin-top: 0.625rem;

    .all {
      border-top: 0.0625rem solid #ccc;
      padding: 0.625rem 0.9375rem;
      text-align: right;
      height: 2.0625rem;
      line-height: 2.0625rem;

      span {
        color: #e51c23;
        font-size: 16px;
      }
    }

    .data {
      height: 3.75rem;
      padding: 0.625rem 0.9375rem;

      div.lf {
        line-height: 3.75rem;
      }

      div.rt {
        text-align: right;

        h3 {
          color: #e51c23;
          font-weight: normal;
          font-size: 14px;
          padding-top: 0.25rem;
        }
      }
    }

    .pro {
      background: #e3e3e3;
      margin-top: 0.625rem;
      padding: 0.625rem 0.9375rem;
      overflow: hidden;

      img {
        float: left;
        width: 4.375rem;
        height: 4.375rem;
        background: #fff;
      }

      .title {
        float: left;
        padding-left: 0.3125rem;
        text-align: left;

        p {
          padding-bottom: 0.1875rem;
        }

        b {
          color: #555;
          font-size: 12px;
          font-weight: normal;
        }
      }

      div.rt {
        text-align: right;

        .rent {
          color: #e51c23;
        }
      }
    }

    .money {
      overflow: hidden;
      padding-top: 0.625rem;

      p {
        line-height: 1.5625rem;
        height: 1.5625rem;
        padding: 0 0.9375rem;

        span.lf {
          b {
            color: #e51c23;
            font-weight: normal;
          }

          i {
            width: 1.0625rem;
            height: 1.0625rem;
            display: inline-block;
            background: #e51c23;
            border-radius: 50%;
            line-height: 1.0625rem;
            text-align: center;
            color: #fff;
            margin-left: 0.3125rem;
            font-style: normal;
          }
        }
      }

      p:nth-child(3) {
        padding-bottom: 0.625rem;
      }
    }
  }

  .orderDetail {
    padding: 0.625rem 0.9375rem;
    background: #fff;
    margin-top: 0.625rem;

    li {
      height: 1.875rem;
      line-height: 1.875rem;
    }
  }

  /* 弹窗样式 */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;

    .modal-dialog {
      width: 80%;
      height: 11.875rem;
      background: #fff;
      border-radius: 0.375rem;
      border-top: 0.625rem solid #f15353;
      margin: 50% auto;
      position: relative;

      .close {
        position: absolute;
        top: -3.125rem;
        right: 0;
      }

      .title {
        color: #666;
        font-size: 14px;
        font-weight: bold;
        line-height: 2.1875rem;
        text-align: left;
        padding-left: 1.5625rem;
        padding-top: 0.625rem;
      }

      p {
        padding: 0 0.9375rem;
        text-align: left;
      }
    }
  }
}
</style>
