<template>
  <div id="commission">
    <c-title :hide="false"
             :text="$yzt('commission.yuji')"></c-title>

    <div v-for="(item, i) in datas"
         :key="i">
      <div class="tbs">
        <ul class="item1">
          <li>{{ item.order_sn }}</li>
          <li>{{ item.price }}{{ $yzt("common.yuan") }}</li>
        </ul>
        <ul class="item2"
            v-if="item.status == 1">
          <li class="reg">
            {{ $yzt("common.yongjin") }}+{{ item.commission }}
          </li>
          <li>{{ item.created_at }}</li>
        </ul>

        <ul class="item2"
            v-if="item.status == 0">
          <li class="unreg">
            {{ $yzt("common.yongjin") }} +{{ item.commission }}
          </li>
          <li class="time">{{ item.created_at }}</li>
        </ul>
      </div>

      <!--<div class="times">2017年3月</div>-->
      <!--<router-link :to="{ name: 'commissionDetails', params: { id: 12 }}">
							<div class="tbs">
								<div class="item1">商品名字
									<br/>984.15元</div>
								<div class="item2"><span class="reg">佣金   +3.00</span>
									<br />2013.09.05 09:51:05</div>
							</div>
						</router-link>-->
    </div>
  </div>
</template>
<script>
import commission from "./commission_controller";
export default commission;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#commission {
  .times {
    text-align: left;
    text-indent: 0.625rem;
    line-height: 2rem;
    background: #ddd;
  }

  .tbs {
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0.625rem 0.75rem;
    border-bottom: 0.0625rem solid #e2e2e2;
    font-size: 14px;

    li {
      line-height: 24px;
    }

    .item1 {
      color: #000;
      flex: 50%;
      text-align: left;
    }

    .item2 {
      flex: 50%;
      text-align: right;
      color: #333;

      .reg {
        color: #259b24;
      }

      .unreg {
        color: #333;
      }

      .time {
        color: #8c8c8c;
      }
    }
  }
}
</style>
