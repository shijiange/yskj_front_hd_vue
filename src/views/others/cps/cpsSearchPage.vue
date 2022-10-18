<template>
  <div id="cpsSearchPage">
    <c-title :hide="false" :text="channel_type_name"></c-title>
    <van-search shape="round" v-model="searchKey" show-action placeholder="请输入搜索关键词" @search="onSearch">
      <template #action>
        <div @click="onSearch" style="color: #e64a40;">搜索</div>
      </template>
    </van-search>
    <div class="tabs">
      <template v-if="!channel_type">
        <van-tabs v-model="searchActive" sticky @change="onSearch">
          <van-tab name="pdd" title="拼多多">
            <div class="listbox">
              <d-list @load="searchCPSGood" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
                <cpslist :datas="goodsData" :ratio_data="ratio_data"></cpslist>
              </d-list>
            </div>
          </van-tab>
          <van-tab name="jd" title="京东">
            <div class="listbox">
              <d-list @load="searchCPSGood" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
                <cpslist :datas="goodsData" :ratio_data="ratio_data"></cpslist>
              </d-list>
            </div>
          </van-tab>
          <van-tab name="tb" title="淘宝">
            <div class="listbox">
              <d-list @load="searchCPSGood" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
                <cpslist :datas="goodsData" :ratio_data="ratio_data"></cpslist>
              </d-list>
            </div>
          </van-tab>
        </van-tabs>
      </template>

      <div v-if="channel_type">
        <div class="listbox">
          <d-list @load="searchCPSGood" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
            <cpslist :datas="goodsData" :ratio_data="ratio_data"></cpslist>
          </d-list>
        </div>
      </div>
    </div>
    <div v-if="goodsData.length <= 0">
      暂无数据
    </div>
  </div>
</template>
<script>
import { cpsApi } from "../../../utils/cpsApi"; //引入CPS方法
import cpslist from "components/new_diy/component/cpslist";
import DList from "@/components/dlist";
export default {
  mixins: [cpsApi],
  data() {
    return {
      searchActive: 'pdd',
      searchKey: '',

      channel_type: "",
      channel_type_name: "商品列表",
      material_id: '',  // 淘宝
    };
  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      if(this.$route.query.channel_type) {
        this.channel_type = this.$route.query.channel_type;
      }
      if(this.$route.query.keyword) {
        this.searchKey = this.$route.query.keyword;
      }

      if(this.$route.query.material_id) {
        this.material_id = this.$route.query.material_id;
      }
      this.searchActive = this.$route.query.status || 'pdd';
      this.getCPSLogin('list');
    }
  },
  activated() {
    if (this.$route.params.fromHome === 1) {
      if(this.$route.query.channel_type) {
        this.channel_type = this.$route.query.channel_type;
      }
      if(this.$route.query.keyword) {
        this.searchKey = this.$route.query.keyword;
      }
      if(this.$route.query.material_id) {
        this.material_id = this.$route.query.material_id;
      }
      this.searchActive = this.$route.query.status || 'pdd';
      this.getCPSLogin('list');
    }
  },
  methods: {
    onSearch(e){
      this.page = 1;
      this.isLoadMore = true;
      this.goodsData = [];
      this.searchCPSGood();
    },
  },
  components: { DList, cpslist }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#cpsSearchPage {
  min-height: 100vh;
  background: #fff;

  .tabs {
    margin-bottom: 10px;
  }

  .listbox {
    margin: 10px;
  }
}
</style>
