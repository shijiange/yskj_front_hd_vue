<template>
	<div id="paymentRecord">
		<c-title :hide="false" text='缴费记录'></c-title>

		<ul>
			<li v-for="(pay,i) in payments" :key='i'>
				<!--后台配合改变-->
				<label :class=" 'a'+pay.icon "><i :class=" 'iconfont '+pay.icon "></i></label>
				<div>
					<p> <span class="left">水费</span> <i class="right">充值成功</i></p>
					<p> <b class="left">2017-05-01 11:00:00</b> <span class="right">{{$i18n.t('money')}}99.50</span></p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import cTitle from 'components/title';
export default {
  components: { cTitle },
  data() {
    return {
      payments:[
        {icon:"icon-guhua",name:"水费",state:"待付款",data:"2017-05-01 11:00:00",price:"{{$i18n.t('money')}}99.50"},
        {icon:"icon-dianfei",name:"电费",state:"待付款",data:"2017-05-01 11:00:00",price:"{{$i18n.t('money')}}99.50"},
        {icon:"icon-ranqifei",name:"燃气费",state:"待付款",data:"2017-05-01 11:00:00",price:"{{$i18n.t('money')}}99.50"},
      ]

      //icon-shuifei   icon-dianfei  icon-ranqifei  icon-guhua  icon-kuandai
    };
  },

};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#paymentRecord {
  li {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-flow: row;
    flex-flow: row;
    font-size: 16px;
    background: #fff;
    margin-bottom: 0.0625rem;
    padding: 0.625rem 0.875rem 0.625rem 0;

    label {
      width: 2.25rem;
      height: 2.25rem;
      line-height: 2.0625rem;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      margin: 0.8125rem 0.9375rem;

      /* background: #f00; */
      i { font-size: 1.5625rem; color: #fff; }
    }

    div {
      flex: 1;
      margin-top: 0.75rem;

      p {
        height: 1.5rem;
        line-height: 1.5rem;
        span { font-size: 16px; color: #333; }
        i { font-style: normal; font-size: 12px; color: #f15353; }
        b { font-weight: normal; font-size: 12px; color: #8c8c8c; }
        .left { float: left; }
        .right { float: right; }
      }
    }

    .aicon-shuifei { background: #6fb0d5; }
    .aicon-dianfei { background: #f0a85f; }
    .aicon-ranqifei { background: #e98488; }
    .aicon-guhua { background: #5cba8e; }
    .aicon-kuandai { background: #d2a2ee; }
  }
}
</style>
