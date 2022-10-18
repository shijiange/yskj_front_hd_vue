<template>
	<div id="transferRecord">
		<c-title :hide="false" text='转赠记录'></c-title>
		<div style="height: 45px;"></div>
		<div class="box">
			<ul v-for="(record,i) in records" :key='i'>
				<li>{{record.recording}}</li>
				<li>转赠时间：{{record.time}}</li>
				<li>{{record.infor}}人信息：</li>
				<li>昵称：{{record.kity}}</li>
				<li>会员ID：{{record.userId}}</li>
				<li>姓名：{{record.name}}</li>
				<li>联系电话：{{record.tel}}</li>
				<li>地址：{{record.addr}}</li>
				<li></li>
			</ul>
		</div>
	</div>
</template>

<script>
import cTitle from 'components/title';

export default{
  components: { cTitle },
  data(){
    return{
      records:[
        {addr:"广东省广州市白云区云霄路188号",tel:"13878237878",name:"李一天",userId:"100",kity:"甲",
          infor:"受赠",time:"2017-02-10 00:00",recording:"您已将该笔订单成功转赠给丙(会员名称)"},
        {addr:"广东省广州市白云区云霄路188号",tel:"13878237878",name:"李一天",userId:"100",kity:"甲",
          infor:"转赠",time:"2017-02-10 00:00",recording:"甲(会员名称)已将该笔订单成功转赠给您"}
      ]
    };
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#transferRecord {
  text-align: left;
  line-height: 1.875rem;

  .box {
    padding: 0.625rem 1.25rem;
    background: #fff;

    ul:first-child {
      color: #e51c23;

      li:nth-child(2) {
        border-bottom: 0.0625rem dotted #e51c23;
      }

      li:last-child {
        border: 0.0625rem solid #db2427;
        background: #e84e40;
      }
    }

    ul:last-child {
      padding-bottom: 0;
    }

    ul {
      padding: 0 0.9375rem;
      border-left: 0.0625rem solid #ccc;
      padding-bottom: 3.125rem;
      position: relative;

      li:first-child {
        line-height: 1.5625rem;
        vertical-align: top;
      }

      li:nth-child(2) {
        padding-bottom: 0.9375rem;
        border-bottom: 0.0625rem dotted #ccc;
      }

      li:nth-child(3) {
        padding-top: 0.9375rem;
      }

      li:last-child {
        width: 0.625rem;
        height: 0.625rem;
        border-radius: 50%;
        border: 0.0625rem solid #8c898c;
        background: #7d797d;
        position: absolute;
        top: 0;
        left: -0.4375rem;
      }
    }
  }
}

</style>