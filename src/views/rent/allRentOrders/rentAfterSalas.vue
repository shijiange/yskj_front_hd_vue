<template>
	<div id="rentAfterSalas">
		<c-title :hide="false" text='售后列表'></c-title>
		<ul class="salasList">
			<li v-for="(sala,i) in salas" :key='i'>
				<p class="title"><span class="lf">{{sala.singleNum}}</span> <span class="rt">{{sala.status}}</span></p>
				<div class="pro">
					<img :src="sala.imgSrc" alt="" />
					<div class="rt">
						<p>{{sala.proTit}}</p>
						<h5>规格：</h5>
					</div>
				</div>
				<div class="text">退款</div>
				<div class="checkDetail">
					<span class="lf">退款金额:{{$i18n.t('money')}}{{sala.refundMoney}}</span>
					<button class="rt">查看详情</button>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import cTitle from 'components/title';
export default{
  components: { cTitle },
  data(){
    return{
      salas:[
        {singleNum:"SN20171914350766222",status:"待审核",imgSrc:"",proTit:"衫资2017春夏秋冬女装群批发假两件套群，中长款纯色假连衣裙"
          ,refundMoney:"110"},
        {singleNum:"SN20171914350766222",status:"待审核",imgSrc:"",proTit:"衫资2017春夏秋冬女装群批发假两件套群，中长款纯色假连衣裙"
          ,refundMoney:"110"},
      ]
    };
  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#rentAfterSalas {
  .salasList {
    li {
      margin-bottom: 0.625rem;

      .title {
        height: 2.1875rem;
        line-height: 2.1875rem;
        padding: 0 0.9375rem;
        background: #fff;
        span.rt { color: #f15353; }
      }

      .pro {
        padding: 0.625rem 0.9375rem;
        background: #f5f5f5;
        overflow: hidden;

        img {
          width: 25%;
          height: 5rem;
          float: left;
        }

        div.rt {
          width: 72%;
          text-align: left;
          padding-left: 3%;
          h5 { font-weight: normal; padding-top: 1.25rem; font-size: 10px; }
        }
      }

      .text {
        height: 2.1875rem;
        line-height: 2.1875rem;
        padding: 0 0.9375rem;
        background: #fff;
        text-align: left;
        border-bottom: 0.0625rem solid #eddcdc;
      }

      .checkDetail {
        background: #fff;
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.9375rem;

        button {
          margin-top: 0.375rem;
          padding: 0.3125rem 0.625rem;
          border-radius: 0.375rem;
          background: #fff;
          border: 0.0625rem solid #f15353;
          color: #f15353;
          outline: 0;
        }
      }
    }
  }
}
</style>
