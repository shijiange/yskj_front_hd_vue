<template>
	<div id="trafficConfirmOrder" :class="'trafficConfirmOrder'+$store.state.service.lang">
		<c-title :hide="false" :text='language.title'></c-title>
		
		<div class="title">兰州电子单</div>
		<ul class="content">	
			<li>
				<label>车牌号</label>
				<div class="traffic">京A</div>
			</li>
			<li>
				<label>违章单号</label>
				<div class="traffic">1234567</div>
			</li>
			<li>
				<label>罚款金额</label>
				<div class="traffic"> <span>（罚金+滞纳金）</span>200</div>
			</li>
		</ul>
		
		<div class="m-footer">
            <div class="integral">
                <div>
                    <b>{{language.score}}</b> <span>{{language.scoreTip1}}&nbsp;<font>{{score}}</font>&nbsp;{{language.scoreTip2}}<font>&nbsp;{{scoreMoney}}&nbsp;</font>{{language.yuan}}</span>
                </div>
                <van-switch :class="{rt:$store.state.service.lang=='ch',lf:!$store.state.service.lang=='wei'}" v-model="useScore" active-color="#f15353" inactive-color="#fff" />
            </div>
            <div class="clear"></div>
            <div class="amount">
                <span>{{language.total}}<b>{{computedMoney}}</b></span>
                <router-link :to= "fun.getUrl('')">
                    <button type="button">{{language.btn}}</button>
                </router-link>
            </div>
        </div>
	</div>
</template>

<script>
import  trafficConfirmOrder_controller from './trafficConfirmOrder_controller';
export default trafficConfirmOrder_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
* { box-sizing: border-box; }

.trafficConfirmOrderch {
  .title { height: 40px; line-height: 40px; font-size: 16px; margin-bottom: 0.625rem; text-align: center; background: #fff; }

  .content {
    background: #fff;
    padding-left: 0.875rem;

    li:last-child {
      border: none;
    }

    li {
      font-size: 16px;
      padding-right: 0.875rem;
      background: #fff;
      height: 2.8125rem;
      line-height: 2.8125rem;
      display: flex;
      justify-content: space-between;
      flex-flow: row;
      border-bottom: solid 0.0625rem #ebebeb;

      label {
        width: 6.25rem;
        text-align: left;
        line-height: 2.8125rem;
        color: #8c8c8c;
      }

      .traffic {
        flex: 1;
        padding-left: 0.625rem;
        text-align: right;
        line-height: 2.6875rem;
        span { color: #a5a5a5; }
      }
    }
  }

  .m-footer {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;

    .integral {
      height: 2.8125rem;
      line-height: 2.8125rem;
      padding: 0 0.8125rem;

      div {
        float: left;

        b {
          color: #333;
          font-size: 16px;
          font-weight: noraml;
          margin-right: 0.625rem;
        }

        span {
          color: #333;
          font-size: 14px;
        }

        font {
          color: #f15353;
        }
      }
    }

    .amount {
      height: 45px;
      line-height: 45px;
      padding: 0 0 0 0.875rem;
      margin-bottom: 0;
      box-sizing: border-box;
      border-top: solid 0.0625rem #ebebeb;

      span {
        color: #333;
        font-size: 16px;
        float: left;
      }

      button {
        width: 6.875rem;
        height: 2.8125rem;
        color: #fff;
        font-size: 16px;
        background: #f15353;
        border: 0;
        float: right;
      }
    }
  }
}

.trafficConfirmOrderwei {
  .title { height: 3.125rem; line-height: 3.125rem; text-align: center; background: #fff; border-bottom: 0.0625rem solid #e8e8e8; }

  .content {
    padding: 0.3125rem 0;
    background: #fff;

    li {
      padding: 0 0.9375rem;
      background: #fff;
      height: 2.8125rem;
      line-height: 2.8125rem;
      display: flex;
      flex-flow: row;
      border-bottom: 0.0625rem solid #e2e2e2;

      label {
        width: 5rem;
        text-align: right;
        line-height: 2.8125rem;
        order: 2;
      }

      .traffic {
        order: 1;
        flex: 1;
        padding-right: 0.625rem;
        text-align: right;
        line-height: 2.6875rem;
        span { color: #a5a5a5; }
      }
    }

    .nobot {
      border-bottom: 0;
      margin-bottom: 0.625rem;
    }
  }

  .m-footer {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;

    .integral {
      height: 2.8125rem;
      line-height: 2.8125rem;
      padding: 0 0.8125rem;

      div {
        float: right;

        b {
          color: #333;
          font-size: 16px;
          font-weight: noraml;
          float: right;
        }

        span {
          color: #333;
          font-size: 12px;
        }

        font {
          color: #f15353;
        }
      }
    }

    .amount {
      height: 3.125rem;
      line-height: 3.125rem;
      padding: 0 0 0 0.8125rem;
      margin-bottom: 0;
      box-sizing: border-box;

      span {
        color: #333;
        font-size: 16px;
        float: left;
      }

      button {
        width: 6.5625rem;
        height: 2.5rem;
        color: #fff;
        font-size: 16px;
        background: #ff951b;
        border: 0;
        border-radius: 0.1875rem;
        margin-top: 0.5625rem;
        float: right;
      }
    }
  }
}

/deep/.van-switch {
  float: right !important;
  top: 0.5rem;
}

</style>