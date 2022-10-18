<template>
  <div class="invoice-details">
    <c-title :hide="false" text="发票详情"></c-title>
    <div class="content">
      <div class="invoice">
        <div class="title">
          <i class="iconfont" :class="isInvoicing ? 'icon-all_select_active' : 'icon-fontclass-gantanhao'" ></i>
          <div>
            <div style="font-size:1rem;">{{invoiceDetails.status==1?"已开票":"未开票"}}</div>
            <div class="amount"  >{{ invoiceDetails.status == 1 ? "已" : "预计可" }}开发票金额：{{ $i18n.t('money') }}{{ invoiceDetails.invoice_amount || "0.00"}}</div>
          </div>
        </div>
        <div class="detailed">
          <div class="title-name">增值税{{get_invoice_type(invoiceDetails.invoice_type)}}</div>
          <actict-steps :list="list" :active="invoiceDetails.order_invoice_status"></actict-steps>
          <div style="position: relative;">
            <item lable="发票类型" :text="get_invoice_type(invoiceDetails.invoice_type)"></item>
            <item lable="发票内容" :text="invoiceDetails.content"></item>
            <div class="download-invoice">
              <div class="invoiced-img-box"  @click="preview(invoiceDetails.invoice)"  v-if="invoiceDetails.invoice">
                <img :src="invoiceDetails.invoice" alt="" srcset="">
                <div class="img-num">1张</div>
              </div>

              <div class="download" @click="downpdf(invoiceDetails)" v-if="invoiceDetails.status==1 && invoiceDetails.invoice_type==0">
                  <i class="iconfont icon-fontclass-xiazai"></i>下载发票
              </div>

            </div>

            <item lable="发票抬头" :text="invoiceDetails.collect_name"></item>
            <item lable="抬头类型" :text="invoiceDetails.rise_type==1?'个人':'单位'"></item>
            <item lable="开票金额" :text="$i18n.t('money') + invoiceDetails.invoice_amount" color="#f15353"></item>
            <item lable="申请时间" :text="invoiceDetails.created_at"></item>
            <item lable="开票时间" :text="invoiceDetails.invoice_time"></item>
          </div>
        </div>
      </div>

      <!-- 纸质发票显示 -->
      <div class="info" v-if="invoiceDetails.invoice_type==1">
        <item lable="收票人" :text="invoiceDetails.col_name"></item>
        <item lable="联系电话" :text="invoiceDetails.col_mobile"></item>
        <item lable="详细地址" :text="invoiceDetails.col_address"></item>
      </div>

      <div class="shop">
        <div class="shop-name">
          <i class="iconfont icon-fontclass-dianpu" style="font-size:1.5rem;"></i>
          <span>{{invoiceDetails.shop_name}}</span>
        </div>
        <div class="shop-info">
          <template v-if="goods.length>1">
              <div class="inventory-box">
                <div class="inventory-item" v-for="(item,i) in goods" :key="i">
                  <img :src="item.thumb" alt srcset />
                </div>
              </div>
          </template>
          <template v-if="goods.length<=1&&goods[0]">
            <div class="shop-img">
              <img :src="goods[0].thumb" alt srcset />
            </div>
            <div  class="shop-info-name van-multi-ellipsis--l3">{{goods[0].title}}</div>
          </template>
          <div class="goods-info" v-if="goods.length<=1&&goods[0]">
            <div class="price">{{ $i18n.t('money') }}{{invoiceDetails.invoice_amount || "0.00"}}</div>
            <div>共{{invoiceDetails.goods_count || 0}}件</div>
          </div>
        </div>
        <item lable="订单编号" :text="has_one_order.order_sn"></item>
        <item lable="开票时间" :text="has_one_order.create_time"></item>
        <item lable="订单状态" :text="has_one_order.status_name"></item>
      </div>
    </div>
    <div :style="{height:invoiceDetails.invoice_type==0?'4.2rem':'1rem'}"></div>
    <div class="addInvoice" :class="fun.getPhoneEnv() == 3 ? 'pcStyle' : ''" v-if="invoiceDetails.invoice_type==0">
      <div class="addInvoice-text"></div>
      <div class="addInvoice-del" @click="sendEmail(invoiceDetails.invoice_type)">发送邮箱</div>
    </div>

    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <div class="wrapper-item">
          <div style="margin: 1rem 0;">请确认邮箱地址</div>
          <van-cell-group class="group">
            <van-field v-model="email" placeholder="请填写正确的邮箱地址" />
          </van-cell-group>
          <div class="tips">提交成功后，系统会自动将您的发票发送至您的邮箱。</div>
          <div class="enter">
            <div @click.stop="show = false">取消</div>
            <div class="right" @click.stop="send">确定</div>
          </div>
        </div>
      </div>
    </van-overlay>
    <van-overlay :show="showInvoice_image">
      <div class="wrapper" style="text-align: center;">
        <img style="width: 90%;max-height: 30vh;" :src="invoice_image" alt="" srcset="">
      </div>
    </van-overlay>
  </div>
</template>
<script>
import details from "./invoice-details_Controller"
export default details;
</script>
<style lang="scss" scoped>
@import "./component/fixed.scss";
.price{color: #f15353;}
.invoice-details {
  text-align: left;
  // padding-bottom: 4.2rem;
  .download {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #f15353;
    font-size: 30rpx;
  }
  .download-invoice{
      position: absolute;
      right: .2rem;
      top: .2rem;
      .invoiced-img-box {
        position: relative;
        width: 6.875rem;
        height: 3.4375rem;
        border-radius: .4688rem;
        overflow: hidden;
        .img-num{
          text-align: center;
          position: absolute;
          bottom: 0;
          width: 100%;
          color: #fff;
          background-color: rgba(0,0,0,0.5)
        }
      }
  }
  img {
    width: 100%;
    height: 100%;
  }
  ::v-deep .van-cell {
    border: solid 0.03rem #cbcbcb;
    border-radius: 0.3rem;
  }
  .content {
    .invoice {
      background-image: linear-gradient(90deg, #d1a055 0%, #eac986 100%);
      .title {
        width: 100%;
        height: 5.15rem;
        display: flex;
        align-items: center;
        padding: 0 3rem;
        color: #fff;
        .iconfont {
          font-size: 1.3rem;
        }
        > div {
          margin-left: 0.6rem;
          .amount {
            font-size: 0.81rem;
            margin-top: 0.1rem;
          }
        }
      }

      .detailed {
        width: 100%;
        background-color: #fff;
        border-radius: 0.63rem 0.63rem 0rem 0rem;
        padding: 1rem;
        .title-name {
          color: #454343;
          font-size: 0.94rem;
          font-weight: 600;
        }
      }
    }
    .shop,
    .info {
      background-color: #fff;
      padding: 0 1rem;
      margin-top: 1rem;
      .shop-name {
        height: 3rem;
        display: flex;
        align-items: center;
      }
      .shop-info {
        display: flex;
        height: 3.44rem;
        align-items: center;
        margin-bottom: 0.5rem;
        .goods-info{
            text-align: center;
            line-height: 1.3rem;margin: .5rem;
        }
        .inventory-box {
          flex: 1;
          display: -webkit-box;
          overflow-x: auto;
          .inventory-item {
            width: 3.44rem;
            height: 3.44rem;
            border-radius: 0.3rem;
            overflow-x: auto;
          }
          .inventory-item:nth-child(n + 2) {
            margin-left: 1rem;
          }
        }
        .shop-img {
          width: 3.44rem;
          height: 3.44rem;
          border-radius: 0.2rem;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .shop-info-name {
          color: #0c0d0e;
          font-size: 0.88rem;
          margin-left: 0.8rem;
          flex: 1;
        }
      }
    }
  }
  .wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .wrapper-item {
      width: 19rem;
      height: 12.06rem;
      margin: 0 auto;
      background-color: #fff;
      color: #202020;
      font-size: 1rem;
      text-align: center;
      border-radius: 0.31rem;
      position: relative;
      .group {
        width: 16.25rem;
        margin: 1rem auto;
        height: 2.13rem;
      }
      .tips {
        font-size: 0.69rem;
        color: #4e4e4e;
        margin: 1rem 0;
      }
      .enter {
        position: absolute;
        bottom: 0;
        line-height: 2.72rem;
        display: flex;
        border-top: 0.1rem #d9dbdd solid;
        width: 100%;
        font-size: 0.88rem;
        > div {
          width: 50%;
        }
        .right {
          border-left: 0.1rem #d9dbdd solid;
          color: #f14e4e;
        }
      }
    }
  }
}
</style>