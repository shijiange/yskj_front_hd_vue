<template>
  <div class="content">
    <div class="content-item" v-for="(item,i) in list" :key="i">
        <item :lable="item.rise_type==1?'个人':'单位'" :text="get_invoice_type(item.invoice_type)"></item>
        <item lable="开票金额" :text="$i18n.t('money')+item.price" color="#f15353"></item>
        <item lable="订单号" :text="item.order_sn">
        <!-- <router-link :to="orderDetails(item.id,'shop')"> -->
          <div class="order-details" @click="orderDetails(item.order_id)">
              <span>订单详情</span>
              <van-icon name="arrow" />
          </div>
        <!-- </router-link> -->
        </item>
        <item lable="申请时间" :text="item.created_at"></item>
        <div class="van-hairline--top shop-box">
          <div class="shop-box-left">
            <i class="iconfont  icon-fontclass-dianpu"></i>
            <span class="shop-name">{{item.shop_name}}</span>
          </div>
          <router-link :to="fun.getUrl('invoiceDetails', { id: item.id })">
            <div class="details">查看详情</div>
          </router-link>
        </div>
    </div>
  </div>
</template>
<script>
import lable from "./lable.vue";
export default {
  props:{
    list:{
      type: Array,
      default: []
    }
  },
  data(){
    return {
      last_page:null,
      page:1,
      loading:false,
      isLoading:false
    }
  },
  methods:{
    get_invoice_type(type){
      // 发票类型代码：0-电子发票；1-普通发票；2-专用发票；
      switch (type) {
        case 0: return "电子发票";
        case 1: return "普通发票";
        case 2: return "专用发票";
        default: return "其他发票";
      }
    },
    orderDetails(order_id){
      // orderType=shop 自营类型订单
      this.$router.push(
        this.fun.getUrl("HotelOrderDetail", {
          order_id,
          orderType: "shop"
        })
      );
      // console.log(this.fun.getUrl("member/orderdetail/", {goodsId:2724}, {goodsId:2724}));
      // /goodsorder?goodsId=2724
      // this.$router.push(this.fun.getUrl("member/orderdetail", {goodsId:2724}, {goodsId:2724}));
    },
  },
  components:{
    item:lable
  }
};
</script>
<style lang="scss" scoped>

.content {
  .order-details{
    color: #f15353;
    font-size: 0.69rem;
    }
  .content-item {
    width: 22.19rem;
    margin: 0.63rem auto;
    background-color: #fff;
    border-radius: 0.3rem;
    padding: 1rem 1rem 0;
    .shop-box {
      height: 3rem;
      display: flex;
      align-items: center;
      margin-top: 0.5rem;

      .shop-box-left {
        color: #1d1d1d;
        flex: 1;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        text-align: left;
        .shop-name {
          margin-left: 0.4rem;
          font-size: 0.81rem;

        }
      }
      .details {
        line-height: 1.56rem;
        width: 4.06rem;
        font-size: 0.69rem;
        border: solid 0.03rem #f15353;
        border-radius: 0.78rem;
        color: #f15353;
        text-align: center;
        margin-left: .5rem;
      }
    }
  }
}
</style>