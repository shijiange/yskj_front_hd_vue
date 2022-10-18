<template>
  <div class="invoicing">
    <!-- 发票插件 -->
    <invoice-pop ref="invoicePop" @openAddList="invoiceShowAddressFun" @confirm="subInvoice"></invoice-pop>
    <cOrderList
      @apply_invoice = "apply_invoice"
      ref="mychild"
      :datasource="list"
      :orderType="orderType"
      :isDefault="true"
    ></cOrderList>
    <!-- 快递地址选择器 -->
    <div style="text-align: center;" v-show="showAddress">
      <yz-address-list v-model="showAddress" v-on:confirm="confirmSelectAddress"></yz-address-list>
    </div>
    <!-- 快递地址选择器 end -->
  </div>
</template>
<script>
import cOrderList from "components/orderList";
import invoicePop from "@/views/goods/components/invoice-pop";
export default {
  props: ["list","sinvoice","toast"],
  data(){
    return {
      isInitData:false,
      address:{},
      showAddress:false,
      json:{}
    }
  },
  methods:{
    getInvoice() {
      let invoicePop = this.$refs.invoicePop;
      if(!this.isInitData){
        invoicePop.initData(this.sinvoice);
        this.isInitData = true;
      }
      invoicePop.address = this.address;
      invoicePop.pluginShow = false;
      invoicePop.popShow = true;
    },
    subInvoice(data) {
      $http.post("plugin.invoice.frontend.index.confirm-invoicing",{data:{...this.json,...data}}).then(({result,msg})=>{
        if (result==1) {
          this.toast.success("申请成功");
          this.$emit("getlist");
        }else{
          this.toast.fail(msg)
        }
      })
    },
    confirmSelectAddress(address){
      this.$refs.invoicePop.address = address;
    },
    invoiceShowAddressFun(){
      this.showAddress = true;
    },
    apply_invoice({has_many_order_goods,id,address}){
      let goods_ids = has_many_order_goods.map(item => item.goods_id);
      this.json = {order_id: id, goods_id: goods_ids};
      this.address = address;
      this.getInvoice();
    }
  },
  components: {
    cOrderList,
    invoicePop,
    yzAddressList:() => import("@/components/ui_components/yz_addressList/index")
  }
}
</script>
<style scoped>
.invoicing{
  text-align: center;
}
</style>