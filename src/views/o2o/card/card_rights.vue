<template>
  <div id="card_rights">
    <c-title :hide="false" text='权益说明'></c-title>
    <div id="content">
        <p>
权益介绍详情 &gt;
1正式PLUS会员在京东商城上购买符合活动范围的商品，将获得实付款价格0.5%-2%的购物回馈，回馈以京豆形式返还；据统计， 平均每位PLUS会员购物获得的京豆数约为普通用户10倍；
2所得京豆可进行抵现（京豆和现金的抵扣比例为100:1）；
当账户中京豆数量大于等于1000个时，可以在结算商品时进行抵现；一年内购物回馈京豆数量累计不超过50000个；
用户服务
PLUS
正式会员
订单完成后3个自然日内京豆到账
订单完成时间需在PLUS会员有效期内
PLUS
试用会员
试用期内累积10倍返京豆数。
试用期/试用结束后30天内开通正式，京豆到账。
京，在线下使用产生的订单交易不参加回馈。
购物返京豆的比例支持动态调整，部分特殊商品返利不遵循回馈比例，以订单实际返利为准。
2 如何使用京豆
当账户中京豆数量大于等于1000个（1000京豆=10{{$i18n.t('元')}}）时，可以在结算商品时进行抵现。

更多京豆使用帮助 &gt;
</p>
    </div>

  </div>
</template>

<script>
import controller from "./card_rights_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #card_rights {
    background-color: #fff;

    #content {
      p {
        padding: 0.875rem 1.25rem;
        text-align: left;
        font-size: 15px;
        line-height: 1.25rem;
      }
    }
  }
</style>
