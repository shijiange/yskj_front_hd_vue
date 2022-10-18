<template>
    <div id="refund">
        <c-title :hide="false" text='售后详情'></c-title>
        <!-- <div id="state">
            <span>商品状态:</span>
            <span>{{order_status}}</span>
        </div> -->

            <div class="return-address">
                <h1>归还地址:</h1>
                <ul>
                    <li><i class="fa fa-map-marker" style="margin-right: 0.3125rem;"></i></li>
                    <li class="info">
                        <span>{{address}}</span><br>
                        <span>收件人:{{name}} {{mobile}}</span>
                    </li>
                </ul>
            </div>
            <ul class="express">
                <li class="address">
                    <span class="left">退还快递:</span><span class="right">{{express}}</span>
                </li>
                <li class="address">
                    <span class="left">快递单号:</span><span class="right">{{express_sn}}</span>
                </li>
                <li class="address">
                    <span class="left">退还时间:</span><span class="right">{{return_time}}</span>
                </li>
            </ul>

            <ul class="deposit">
                <li class="address">
                    <span class="left">押金金额:</span><span class="right">{{$i18n.t('money')}}{{deposit_total}}</span>
                </li>

                <li class="address">
                    <span class="left">押金扣除(逾期):</span><span class="right">{{$i18n.t('money')}}{{be_overdue}}</span>
                </li>

                <li class="address">
                    <span class="left">押金扣除(破损):</span><span class="right">{{$i18n.t('money')}}{{be_damaged}}</span>
                </li>


                <li class="address">
                    <span class="left">说明:</span><span class="right">{{explain}}</span>
                </li>

                <li class="address">
                    <span class="left">退还押金金额:</span><span class="right">{{$i18n.t('money')}}{{return_deposit}}</span>
                </li>

                <li class="address">
                    <span class="left">退还方式:</span><span class="right">{{return_mode}}</span>
                </li>
            </ul>





    </div>
</template>

<script>
import order_return_sure_controller from './order_return_after_detail_controller';
export default order_return_sure_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #refund {
    .return-address {
      background-color: #fff;
      padding-left: 0.875rem;
      text-align: left;

      h1 {
        line-height: 2.25rem;
        font-size: 14px;
        font-weight: normal;
        color: #8c8c8c;
      }

      ul {
        font-size: 14px;
        display: flex;

        span {
          display: inline-block;
        }

        i {
          font-size: 16px;
          color: #666;
          margin-top: 0.625rem;
        }

        .info {
          padding: 0.625rem 0;
          margin-left: 0.625rem;

          span:first-child {
            margin-bottom: 0.625rem;
          }
        }
      }
    }

    .express {
      margin-top: 0.625rem;
      background-color: #fff;
      padding: 0.625rem 0.875rem;
      font-size: 14px;

      .address {
        display: flex;
        line-height: 1.875rem;
        justify-content: space-between;

        .left {
          color: #8c8c8c;
        }
      }
    }

    .deposit {
      margin-top: 0.625rem;
      background-color: #fff;
      padding: 0.625rem 0.875rem;
      font-size: 14px;

      .address {
        display: flex;
        justify-content: space-between;
        line-height: 1.875rem;

        .left {
          color: #8c8c8c;
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
  }
</style>
