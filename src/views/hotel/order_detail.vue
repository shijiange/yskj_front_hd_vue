<template>
    <div id="hotel_detail">
        <c-title :hide="false" text='订单详情' ></c-title>
        <div id="content">
            <div class="content_a">
                <i class="iconfont icon-dingwei"></i>
                <ul class="address">
                    <li class="address_a">收件人：卡卡（15219025049）</li>
                    <li class="address_b">广东省广州市白云区新市街道</li>
                </ul>
            </div>
            <div class="content_b">
                <div class="img">
                    <img src="">
                </div>
                <ul class="goods_info">
                    <li class="info_a">
                        <span>逸林客房</span>
                        <span>{{$i18n.t('money')}}773.00</span>
                    </li>
                    <li class="info_b">
                        <span>规格：行政客房</span>
                        <span>1晚/间</span>
                    </li>
                </ul>
            </div>
            <ul class="content_c">
                <li>
                    <span>订单编号</span>
                    <span>SN201913416OP</span>
                </li>
                <li>
                    <span>交易状态</span>
                    <span>待付款</span>
                </li>
            </ul>
            <ul class="content_d">
                <li>
                    <span>入住日期</span>
                    <span>2019-01-14</span>
                </li>
                <li>
                    <span>离店日期</span>
                    <span>2019-01-15</span>
                </li>
                <li>
                    <span>天数</span>
                    <span>1晚</span>
                </li>
                <li>
                    <span>房间数量</span>
                    <span>1间</span>
                </li>
            </ul>
            <div class="e_box">
                <ul class="content_e">
                    <li>
                        <span>单品满减优惠</span>
                        <span>{{$i18n.t('money')}}0.00</span>
                    </li>
                    <li>
                        <span>全场满减优惠</span>
                        <span>{{$i18n.t('money')}}0.00</span>
                    </li>
                    <li>
                        <span>优惠券优惠</span>
                        <span>{{$i18n.t('money')}}0.00</span>
                    </li>
                    <li>
                        <span>抵扣金额</span>
                        <span>{{$i18n.t('money')}}0.00</span>
                    </li>
                    <li>
                        <span>商品小计</span>
                        <span>{{$i18n.t('money')}}23.00</span>
                    </li>
                </ul>
                <p>实付款：<span>{{$i18n.t('money')}}<font>23.00</font></span></p>
            </div>
            <div class="foot">
                <button type="button">取消订单</button>
                <button type="button">支付</button>
            </div>
        </div>
    </div>
</template>


<script>
import controller from './order_detail_controller';
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#hotel_detail {
  padding-bottom: 60px;

  #content {
    .content_a {
      background: #fff;
      padding: 0.75rem 0.875rem;
      display: flex;

      i {
        font-size: 1rem;
        color: #666;
        margin-right: 0.625rem;
      }

      .address {
        font-size: 14px;

        li {
          text-align: left;
        }

        .address_a {
          margin-bottom: 0.5rem;
          font-size: 16px;
        }

        .address_b {
          color: #8c8c8c;
        }
      }
    }

    .content_b {
      background: #fff;
      margin-top: 0.625rem;
      padding: 0.625rem 0.875rem;
      display: flex;

      .img {
        width: 4rem;
        height: 4rem;
        overflow: hidden;
        margin-right: 0.625rem;
        background: #ccc;

        img {
          width: 100%;
        }
      }

      .goods_info {
        width: 17.0625rem;

        li {
          display: flex;
          justify-content: space-between;
        }

        .info_a {
          font-size: 15px;
          margin-bottom: 0.625rem;
          line-height: 1.5rem;
        }

        .info_b {
          color: #8c8c8c;
          font-size: 12px;
        }
      }
    }

    .content_c,
    .content_d,
    .content_e {
      background: #fff;
      margin-top: 0.625rem;
      padding: 0.625rem 0.875rem;

      li {
        display: flex;
        justify-content: space-between;
        line-height: 1.875rem;
        font-size: 14px;
      }
    }

    .e_box {
      background: #fff;

      p {
        line-height: 2.5rem;
        border-top: solid 0.0625rem #ebebeb;
        font-size: 14px;
        text-align: right;
        padding: 0 0.875rem;

        span {
          color: #f15353;
          font-weight: bold;

          font {
            font-size: 18px;
          }
        }
      }
    }

    .foot {
      background: #fff;
      border-top: solid 0.0625rem #ebebeb;
      height: 3.125rem;
      line-height: 3.125rem;
      width: 100%;
      position: fixed;
      bottom: 0;
      padding: 0 0.875rem;
      text-align: right;

      button {
        border: solid 0.0625rem #666;
        font-size: 12px;
        border-radius: 0.1875rem;
        padding: 0.25rem 0.625rem;
        margin-left: 0.625rem;
      }
    }
  }
}
</style>
