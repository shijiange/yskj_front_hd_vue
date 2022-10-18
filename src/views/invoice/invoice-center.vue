<template>
  <div class="invoiceCenter">
    <van-sticky>
      <c-title :hide="false" text="发票中心"></c-title>
      <van-tabs v-model="active" @change="activeType">
        <van-tab :name="1" title="已开票"></van-tab>
        <van-tab :name="2" title="申请中发票"></van-tab>
        <van-tab :name="3" title="申请开票"></van-tab>
        <van-tab :name="4" title="发票抬头"></van-tab>
      </van-tabs>
    </van-sticky>
    <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="min-height: 50vh;"> -->
      <keep-alive>
        <component :is="'invoice' + active" :toast="Toast" :status="active" :list="list" :total="total" @getlist="getList(true)" :sinvoice="sinvoice"></component>
      </keep-alive>
      <div v-show="list &&list.length <=0 && !loading && !isLoading">
        <yz-blank text="暂无数据" :isBtn="false"></yz-blank>
      </div>
      <div class="list-loading" v-show="loading">
        <van-loading size="1.5rem" >加载中...</van-loading>
      </div>
      <van-divider dashed v-show="noMore && !loading && list.length >0">没有更多的数据了~~~</van-divider>
    <!-- </van-pull-refresh> -->
  </div>
</template>
<script>
import Invoiced from "./component/Invoiced.vue";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
export default {
  mixins:[scrollMixin],
  activated(){
    this.getList(true);
  },
  data() {
    return {
      active: 0,
      Toast,
      httpUrl:"plugin.invoice.frontend.index.index",
      page:1,
      last_page:null,
      loading:false,
      isLoading:false,
      list:[],
      total:0,
      noMore:false,
      isLoadMore:true,
      sinvoice:[]
    }
  },
  methods:{
    initPage(){
      this.list = [];
      this.page = 1;
      this.last_page = null;
      this.total = 0;
    },
    activeType(type){
      if (type==1 || type==2) {
        this.httpUrl = "plugin.invoice.frontend.index.index";
      }else if(type == 3){
        this.httpUrl = "plugin.invoice.frontend.index.not-invoice";
      }else{
        this.httpUrl = "plugin.invoice.frontend.rise.get-list";
      }
      this.getList(true);
    },
    getList(loading=true){
      this.loading = loading;
      this.initPage();
       $http.get(this.httpUrl,{status:this.active,page:1}).then(({result,msg,data})=>{
         this.loading = false;
         this.isLoading = false;
        if (result == 1 && data) {
          data.data = data.data || [];
          if(this.active == 3){
            this.sinvoice = data.sinvoice;
            data.data.forEach(item => {
              item.button_models = [{name: "申请开票", value: "apply_invoice", api: "test", type: ""}]
            });
          }else if(this.active == 4){
            data.data.forEach(item=>{
              item.change = false;
            })
          }
          this.list = data.data;
          this.total = data.total;
          this.last_page = data.last_page;
        }else {
          this.last_page = 1;
          Toast(msg);
        }
      })
    },
    getMoreData(){
      this.isLoadMore = false;
      if(this.page == this.last_page){
        Toast("没有更多的数据了")
        this.noMore = true;
        return false
      }else{
        this.loading = true;
        let page = this.page + 1;
        $http.get(this.httpUrl,{page}).then(({ result, msg, data }) => {
          this.loading = false;
          this.isLoadMore = true;
          if (result == 1) {
             data.data = data.data || [];
            if(this.active == 3){
              // this.sinvoice = data.sinvoice;
              data.data.forEach(item => {
                item.button_models = [{name: "申请开票", value: "apply_invoice", api: "test", type: ""}]
              });
            }else if(this.active == 4){
              data.data.forEach(item=>{
                item.change = false;
              })
            }
            this.list = this.list.concat(data.data)
            this.page = page;
          }else Toast(msg)
        })
      }
    },
    onRefresh(){
      //下拉刷新
      this.getList(false);
    },
  },
  components: {
    invoice1: Invoiced,
    invoice2: Invoiced,
    invoice3: () => import("./component/apply.vue"),
    invoice4: () => import("./component/Invoice-header.vue"),
    yzBlank
  }
}
</script>
<style lang="scss" scoped>
.invoiceCenter{
  text-align: left;
}
.list-loading{
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}
</style>