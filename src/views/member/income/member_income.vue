<template>
	<div id="income">
		<c-title :hide="false" :text='`${income_name_text}`'></c-title>
		<div id="userinfo">
			<ul>
				<li>
					<span>{{$i18n.t('money')}}{{total_income}}</span>
					<br>累计{{income_name_text}}</li>
				<li>
					<span>{{$i18n.t('money')}}{{income}}</span>
					<br>可{{this.fun.initWithdrawal()}}{{income_name_text}}</li>
				<li>
					<span class="tixi" @click="gotoIncome">
						{{this.fun.initWithdrawal()}}
					</span>
				</li>
			</ul>
		</div>
		<h3>未{{this.fun.initWithdrawal()}}{{income_name_text}}</h3>
		
		<template>
			<van-grid :column-num="3" square >
        <van-grid-item :link="fun.getUrl('',{})" v-for="(plug,i) in plugs" :key='i'>
          <div>
            <i class="iconfont" :class="plug.ico" style="font-size: 1.5rem; color: #ff685d;"></i>
            <span slot="text">{{plug.type_name}} <font>{{$i18n.t('money')}}{{plug.income}}</font></span>
          </div>
        </van-grid-item>
      </van-grid>
		</template>
		
		<p class="mszf">
			<router-link :to="fun.getUrl('presentationRecord')">{{this.fun.initWithdrawal()}}明细
				<span></span>
				<i class="fa fa-angle-right"></i>
			</router-link>
		</p>
	</div>
</template>
<script>
import member_incomecontroller from './member_incomecontroller';
export default member_incomecontroller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#income {
  #userinfo {
    background: #fff;
    margin-bottom: 0.625rem;

    ul {
      display: flex;
      align-items: center;
    }

    ul li:last-child {
      border: 0;
    }

    ul li {
      color: #8c8c8c;
      text-align: center;
      display: block;
      flex: 1;
    }

    ul li span {
      color: #222;
      font-size: 16px;
      margin-bottom: 0.3125rem;
      display: inline-block;
    }

    ul li {
      width: 33.3333%;
      margin: 0.625rem 0;
      box-sizing: border-box;
      font-size: 12px;
    }

    .tixi {
      color: #fff;
      font-size: 14px;
      border: 0.0625rem solid #ff5757;
      border-radius: 0.875rem;
      background: #ff5757;
      padding: 0.1875rem 1rem;

      a {
        color: #fff;
      }
    }
  }

  h3 {
    background: #f5f5f5;
    margin: 0;
    padding: 0 0.625rem;
    text-align: left;
    font-weight: normal;
    font-size: 0.75rem;
    height: 2rem;
    box-sizing: border-box;
    line-height: 2rem;
  }

  #gongge {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background: #fff;
    padding: 0.625rem 0;

    li {
      flex: 33% 0 0;
      flex-direction: row;

      i {
        font-size: 2.125rem;
        color: #ccc;
        margin: 0.625rem 0;
      }

      font {
        color: #e84e40;
      }

      a {
        color: #000;

        img {
          width: 1.4375rem;
          margin: 0.3125rem 0;
        }
      }
    }
  }

  .mszf {
    background: #fff;
    padding: 0 0.625rem;
    margin: 0;
    text-align: left;
    overflow: hidden;
    margin-top: 0.625rem;
    height: 2.75rem;
    box-sizing: border-box;
    line-height: 2.75rem;
    font-size: 14px;
    color: #333;

    i {
      font-size: 1.0625rem;
      float: right;
      line-height: 2.75rem;
    }

    span {
      float: left;
    }

    a {
      color: #000;
      display: block;
    }
  }
}
</style>
