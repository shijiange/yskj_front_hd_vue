<template>
  <div id="tokerSetMeal">
    <c-title :hide="false" :text="plugin_name"></c-title>
    <van-tabs v-model="active" background="#f2f2f2" title-active-color="#ee2e2b" @change="tabChange">
      <van-tab title="一次性消费"></van-tab>
      <van-tab title="多次消费"></van-tab>
    </van-tabs>
    <div style="width: 100%; height: 1.06rem;"></div>
    <List :datas="info" :activeNum="active"></List>
  </div>
</template>
<script>
import cTitle from "components/title";
import List from "./components/list";
import { Toast } from 'vant';
export default {
  data() {
    return {
      active: 0,
      id: "",
      info:[],
      plugin_name:''
    };
  },
  activated() {
    this.id = this.$route.params.id;
    this.getData();
  },
  methods: {
    tabChange(){
      this.getData();
    },
    getData() {
      var url;
      if (this.active == 0) {
        url = "plugin.customer-development.Frontend.controllers.detail.once";
      } else {
        url = "plugin.customer-development.Frontend.controllers.detail.many";
      }
      var that = this;
      $http.get(url,{id:that.id},'').then(response => {
        if (response.result === 1) {
          that.plugin_name = response.data.plugin_name?response.data.plugin_name:'拓客卡';
          that.fun.setWXTitle(that.plugin_name?that.plugin_name:'拓客卡');
          if(that.active == 1){
            let arr = response.data.member_cards;
            for(let i = 0 ;i <arr.member_many.length;i++){
              arr.member_many[i].cheacked = false;
            }
            that.info = arr;
          }else{
            that.info = response.data.member_cards;
          }
        } else {
          Toast(response.msg);
        }
      });
    },
  },
  components: {
    cTitle,
    List
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
