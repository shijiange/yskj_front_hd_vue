<template>
  <div id="logistics">
    <c-title :hide="false" text="物流详情"></c-title>

    <div class="my_wrapper">
      <span><img :src="thumb"/></span>
      <div class="my-value">
        <p>
          <b> 物流状态</b>
          <font>{{ status_name }}</font>
        </p>
        <p>承运公司：{{ company_name }}</p>
        <p>运单编号：{{ express_sn }}</p>
        <p>官方电话：{{ tel }}</p>
      </div>
    </div>
    <ul id="wlinfo">
      <!--time: "2017-03-31 15:59:56", ftime: "2017-03-31 15:59:56", context: "[广东广州白云区公司]快件已被 已签收 签收", location: "广东广州白云区公司"-->
      <li v-for="(item, i) in express_info" :key="i">
        {{ item.context }}
        <br /><span>{{ item.ftime }}</span>
      </li>
    </ul>
    <yz-blank :datas="express_info" text="暂无物流信息" :isBtn="false"></yz-blank>
    <div style="height: 0.625rem;"></div>
  </div>
</template>
<script>
import order_list_logisticscontroller from './order_list_logisticscontroller';
export default order_list_logisticscontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#logistics {
  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0.625rem;
    align-items: center;

    span {
      flex: 1;
      font-size: 16px;
      line-height: 1;

      img {
        width: 100%;
      }
    }

    .my-value {
      flex: 3;
      text-align: left;
      color: #8c8c8c;
      margin-left: 0.625rem;

      b {
        color: #000;
        font-size: 14px;
      }

      font {
        font-size: 14px;
        margin-left: 0.3125rem;
        color: #259b24;
      }

      p {
        margin: 0;
        font-size: 12px;
      }
    }
  }

  #wlinfo {
    background: #fff;
    margin-top: 0.625rem;
    color: #8c8c8c;
    padding-top: 0.625rem;

    li {
      border-left: 0.125rem solid #bbb;
      text-align: left;
      padding: 0 0.625rem 0.625rem 1.25rem;
      margin-left: 1.25rem;
      position: relative;

      span {
        font-size: 12px;
        border-bottom: #dcdcdc 0.0625rem solid;
        display: block;
        line-height: 1.5rem;
      }
    }

    li::after {
      content: '.';
      border-radius: 50%;
      background: #8c8c8c;
      width: 0.625rem;
      height: 0.625rem;
      display: block;
      position: absolute;
      top: 0.125rem;
      left: -0.375rem;
    }

    li:first-child {
      color: #259b24;
    }

    li:first-child::after {
      background: #259b24;
      border: #42b983 0.25rem solid;
      // left: -0.625rem;
      top: 0;
    }
  }
}
</style>
