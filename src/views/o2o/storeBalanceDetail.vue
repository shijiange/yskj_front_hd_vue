<template>
  <div id="storeBalanceDetail">
    <c-title :hide="false" :text="title + '明细'"></c-title>
    <van-tabs v-model="active" @click="swichTabTItem">
      <van-tab title="全部"></van-tab>
      <van-tab title="收入"></van-tab>
      <van-tab title="支出"></van-tab>
    </van-tabs>
    <div v-if="recordsList && recordsList.length > 0">
      <router-link v-for="(item, i) in recordsList" :key="i" :to="fun.getUrl('details', { item: item.id ,name:'store'})">
        <div class="tbs">
          <ul class="item2">
            <li>{{ item.mold_name }}</li>
            <li>{{ title }}：{{ item.after_balance }}</li>
            <li class="item1">{{ item.created_at }}</li>
          </ul>
          <div class="item3" v-if="item.type == 1">
            <span class="add">+ {{ item.change_balance }}</span>
          </div>
          <div class="item3" v-if="item.type == -1">
            <span class="reduce">{{ item.change_balance }}</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      title: "",
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      active: "0",
      recordsList: []
    };
  },
  methods: {
    getData() {
      let istype = this.active == "0" ? "0" : this.active == "1" ? "1" : "-1";
      $http
        .post("plugin.store-cashier.frontend.store.balance.log.index", { store_id: this.$route.params.store_id, log_type: istype }, "")
        .then(response => {
          this.isShow = true;
          if (response.result === 1) {
            console.log(response.data.list);
            this.page = 1;
            this.recordsList = response.data.list.data;
            this.total_page = response.data.list.last_page;
            this.title = response.data.title;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    init() {
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.active = "0";
      this.recordsList = [];
    },
    swichTabTItem(){
      this.page = 1;
      this.total_page = 0;
      this.recordsList = [];
      this.isLoadMore = true;
      this.getData();
    },
    //获取更多数据
    getMoreData() {
      let istype = this.active == "0" ? "0" : this.active == "1" ? "1" : "-1";
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.store-cashier.frontend.store.balance.log.index",
            {
              page: this.page,
              store_id: this.$route.params.store_id,
              log_type: istype
            },
            "加载中"
          )
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.list.data;
                this.recordsList = this.recordsList.concat(myData); //数组拼接
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            function (response) {
              // error callback
            }
          );
      }
    }
  },
  activated() {
    this.init();
    this.getData();
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.tbs {
  background: #fff;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  padding: 0.625rem 0.875rem;
  border-bottom: 0.0625rem solid #ebebeb;
  font-size: 14px;

  .item1 {
    color: #8c8c8c;
    font-size: 12px;
  }

  .item2 {
    flex: 2;
    text-align: left;

    li {
      line-height: 1.5rem;
    }
  }

  .item3 {
    .add {
      font-size: 18px;
      color: #259b24;
    }

    .reduce {
      font-size: 18px;
      color: #f15353;
    }
  }
}
</style>