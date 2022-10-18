<template>
  <div class="record">
    <c-title :text="info.plugin_name"></c-title>
    <div class="member">
      <img :src="info.avatar" class="member-image"/>
      <div class="nickname">{{info.nickname}}</div>
    </div>
    <div class="total-box">
      累计金额：
      <span class="total">{{info.total}}</span>
    </div>
    <van-tabs :active="active" sticky offset-top="40">
      <van-tab title="奖励记录">
        <yz-blank text="暂无奖励记录" v-if="(!list || list.length==0) && !loading"></yz-blank>
        <ul class="list" v-else>
          <li class="list-item" v-for="(item,i) in list" :key="i">
            <div style="flex: 1;">
              <div class="sn">奖励ID：{{item.id}}</div>
              <div class="date">{{item.created_at}}</div>
            </div>
            <div class="money">
              <small>{{ $i18n.t("money") }}</small>
              <span>{{item.amounts}}</span>
            </div>
          </li>
          <li style="text-align: center;padding: 1rem 0;" v-if="noMore">没有更多了~~</li>
        </ul>
        <div class="loading" v-show="loading">
          <van-loading size="24px">加载数据中...</van-loading>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { scrollMixin } from '@/utils/mixin';
import yzBlank from "@/components/ui_components/yz_blank";
export default {
  mixins:[scrollMixin],
  components:{yzBlank},
  data() {
    return {
      active: 0,
      info:{plugin_name:"分销收入奖励记录"},
      isLoadMore:false,
      list:[],
      loading:false,
      page:1,
      noMore:false
    }
  },
  activated(){
    this.getdata();
  },
  methods:{
    initdata(){
      this.isLoadMore = false;
      this.page = 1;
      this.info = {};
      this.list = [];
    },
    setMore(bool){
      this.noMore = bool;
      this.isLoadMore = !bool;
    },
    getdata(){
      this.loading = true;
      this.initdata();
      $http.post("plugin.distribution-income.frontend.controllers.center.index").then(({result,data,msg})=>{
        this.loading = false;
        if(result == 1){
          this.info = data.info;
          this.fun.setWXTitle(this.info.plugin_name || "分销收入奖励记录");
          this.setMore(this.page == data.list.last_page);
          this.list = data.list.data;
        }else this.$toast(msg)
      })
    },
    getMoreData(){
      this.loading = true;
      this.isLoadMore = false;
      let page = this.page + 1;
      $http.post("plugin.distribution-income.frontend.controllers.center.index",{page}).then(({result,data,msg})=>{
        this.loading = false;
        if(result == 1){
          this.list = this.list.concat(data.list.data);
          this.page = page;
          this.setMore(this.page == data.list.last_page);
        }else this.$toast(msg)
      })
    }
  }
}
</script>

<style scoped lang="scss">
$spacing: 0.8rem;
$money: #f15353;
.record {
  text-align: left;
  .member {
    width: 100%;
    height: 7.375rem;
    background-color: #ee2e2b;
    display: flex;
    align-items: center;
    .member-image {
      width: 2.875rem;
      height: 2.875rem;
      border-radius: 50%;
      margin: 0 $spacing;
    }
    .nickname {
      flex: 1;
      font-size: 1rem;
      color: #fff;
      line-height: 1.2rem;
    }
  }
  .total-box {
    line-height: 2.8125rem;
    height: 2.8125rem;
    font-size: 1rem;
    background-color: #fff;
    padding: 0 $spacing;
    margin-bottom: 0.5rem;
    .total {
      color: $money;
    }
  }

  .list {
    // max-height: calc(100vh - 7.375rem - 40px - 2.8125rem - 3.3rem);
    // overflow-y: auto;
    background-color: #fff;
    padding: 0 $spacing;
    .list-item {
      height: 4rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ebebeb;
      font-size: $spacing;
      line-height: 1.4rem;
      .sn {
        color: #333;
      }
      .date {
        color: #8c8c8c;
        font-size: 0.75rem;
      }
      .money {
        color: $money;
      }
    }
  }
  .loading{
    height:4rem;
    display:flex;
    justify-content: center;
    align-items: center;
  }
}
</style>