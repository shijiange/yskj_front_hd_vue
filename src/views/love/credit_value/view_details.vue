<template>
  <div>
    <c-title :hide="false" :text="'信用值明细'"> </c-title>
    <van-tabs color="#377aff"
        @click="tabsChange"
        v-model="active"
        :sticky="true"
        offset-top="150px"
      >
        <van-tab title="全部" name="3"></van-tab>
        <van-tab title="收入" name="1"></van-tab>
        <van-tab title="支出" name="2"></van-tab>
      </van-tabs>

    <d-list
      @load="getData"
      :finished="loadFinished"
      :loading="isLoadMore"
      :showStatusText="loadFinished"
    >
      <div class="containe" v-if="list && list.length > 0">
        <div class="item-box" v-for="item in list" :key="item.id">
          <div class="left-box">
            <span class="titile">{{ item.business_name }}</span>
            <span class="time">{{ item.created_at }}</span>
          </div>
          <div class="right-box">
            <span class="price">{{ item.amount }}</span>
            <span class="type">{{ item.change_name }}</span>
          </div>
        </div>
      </div>
      <div class="blank" v-else>
        <img src="../../../assets/images/blank.png" />
        <span>还没有记录哦</span>
      </div>
    </d-list>


  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from "vant";
import DList from "@/components/dlist";
export default {
  data() {
    return {
      active: 3,
      page: 1,
      loadFinished: false,
      isLoadMore: false,
      list: []
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    tabsChange() {
      this.page = 1;
      this.isLoadMore = false;
      this.loadFinished = false;
      this.getData();
    },
    async getData() {
      if (this.isLoadMore === true) return;
      if (this.loadFinished) {
        Toast('没有更多了'); // 是否还有更多
        return;
      }
      this.isLoadMore = true;
      let res = await $http.post(
        "plugin.credit-inventory.frontend.controllers.detail.index",
        {
          page: this.page,
          detail_type: this.active
        },
        "加载中"
      );
      console.log(res);
      this.isLoadMore = false;
      if (res.result === 0) {
        Toast.fail(res.msg);
        return;
      }
      this.page++;
      if (res.data.last_page === res.data.current_page || res.data.data.length < res.data.per_page) {
        this.loadFinished = true;
      }
      if (res.data.current_page > 1) {
        this.list = this.list.concat(res.data.data);
        console.log(this.list);
        return;
      }
      this.list = res.data.data;
    },

    init() {
      this.page = 1;
      this.loadFinished = false;
      this.isLoadMore = false;
      this.historyList = [];
    }
  },
  components: {
    cTitle,
    DList
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.item-box {
  display: flex;
  width: 22rem;
  height: 5rem;
  margin: 0 auto;
  margin-top: 1rem;
  background-color: #fff;
  border-radius: 10px;
  padding: 1rem;
  font-size: 15px;
  font-weight: 500;

  .left-box {
    flex: 1;
    display: flex;
    text-align: left;
    flex-direction: column;
    justify-content: space-between;
  }

  .right-box {
    display: flex;
    text-align: right;
    flex-direction: column;
    justify-content: space-between;
  }

  .titile {
    color: #383839;
  }

  .time {
    font-size: 12px;
    color: #969696;
  }

  .price {
    color: #f14e4e;
  }

  .type {
    color: #333;
  }
}
</style>
