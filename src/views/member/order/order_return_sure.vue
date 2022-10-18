<template>
    <div id="refund">
        <c-title :hide="false" text='退还商品'></c-title>
        <div id="state">
            <span>商品状态:</span>
            <span>{{order_status}}</span>
        </div>
        <div class="content">
            <div class="address">
                <p>归还地址:</p>
                <p style="margin-top: 0.625rem; padding-left: 0.3125rem;">
                    <p><i class="fa fa-map-marker" style="margin-right: 0.3125rem; float: left;"></i>收件人:{{name}} {{mobile}}</p>
                    <p style="margin-top: 0.1875rem;">{{address}}</p>
                </p>
            </div>
            <div class="address">
                <p>退还快递:<span style="float: right;">{{express}}</span></p>
            </div>
            <div class="address">
                <p>快递单号:<span style="float: right;">{{express_sn}}</span></p>
            </div>
            <div class="address">
                <p>退还金额:<span style="float: right;">{{$i18n.t('money')}}{{deposit_total}}</span></p>
            </div>
        </div>
    </div>
</template>

<script>
import order_return_sure_controller from './order_return_sure_controller';
export default order_return_sure_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #refund {
    background: #fff;

    .address {
      margin-top: 0.625rem;

      p {
        text-align: left;
        font-size: 14px;
        line-height: 0.875rem;

        span {
          font-size: 12px;
          line-height: 0.75rem;
        }
      }
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

    .content {
      padding: 0 0.625rem 0 0.625rem;
    }
  }
</style>
