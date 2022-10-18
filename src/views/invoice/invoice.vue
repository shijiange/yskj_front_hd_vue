<template>
  <div id="invoice">
    <c-title :hide="false" text="发票详情"></c-title>
    <div id="content">
      <div class="state">发票状态：{{ invoice_status }}</div>
      <div class="order">订单编号：{{ order_number }}</div>
      <div class="state" v-if="phone">手机号：{{ phone }}</div>
      <div class="info">
        <ul class="info_a">
           <li class="type" style="position:relative;">
            <span>发票类型：{{ invoice_type }}</span>
            <van-button type="default" size="mini" v-if="previewUrl" @click.native="checkInvoice">查看发票</van-button>
            <a :href="dowm" v-if="dowm" download target="_blank" style="margin-left:75px;overflow:hidden;">
              <van-button type="default" size="mini">下载发票</van-button>
            </a>
          </li>
          <li>发票内容：商品明细</li>
          <li>抬头类型：{{ rise_type }}</li>
          <li>抬头名称：{{ call }}</li>
          <li v-if="company_number">纳税人识别号：{{ company_number }}</li>
          
          <li>开票金额：{{ invoice_price }}</li>
          <li v-if="invoice_time">开票时间：{{ invoice_time }}</li>
           <li>申请时间：{{ apply_time }}</li>       
	 </ul>
      </div>
    </div>
    <van-image-preview v-model="show1" :images="list" ></van-image-preview>
  </div>
</template>
<script>
import invoice_Controller from './invoice_Controller';
export default invoice_Controller;
</script>
<style lang="scss" rel="stylesheet/scss">
#invoice {
  #content {
    background: #fff;
    color: #666;
    font-size: 14px;
    margin-top: 0.375rem;
    border-radius: 10px;

    .state {
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: left;
      border-bottom: solid 0.0625rem #ebebeb;
      padding: 0 0.875rem;
    }

    .order {
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: left;
      border-bottom: solid 0.0625rem #ebebeb;
      padding: 0 0.875rem;
    }

    .info {
      padding: 0.625rem 0.875rem;
      border-bottom: solid 0.0625rem #ebebeb;

      .info_a {
        li {
          line-height: 1.875rem;
          text-align: left;
        }

        .type {
          button {
            font-size: 12px;
            border: solid 0.0625rem #ebebeb;
            margin: 0 0.3125rem;
            padding: 0 0.625rem;
            border-radius: 0.125rem;
            color: #333;
            position: absolute;
            top: 3px;
          }
        }
      }
    }
  }
}
</style>
