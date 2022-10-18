<template>
  <div class="page">
    <c-title text="区域代理"></c-title>

    <div class="search">
      <div class="option" @click="optionShow = true">
        <span>{{optionData[optionIndex].name}}</span>
        <van-icon style="margin-left: 0.3rem;" name="arrow-down"/>
      </div>
      <div class="searchContent">
        <input class="input" v-model="area_name" placeholder="请输入区域"/>
        <div class="btn" @click="getSearch">搜索</div>
      </div>

    </div>

    <div class="wrapper">
      <div class="listItem">
        <div class="item" v-for="item in listData" :key="item.area_id" @click="gotoResult(item)">
          {{item.areaname}}
        </div>
      </div>
      <!-- <van-empty v-if="listData.length==0" description="没数据" /> -->
    </div>

    <van-action-sheet close-on-click-action v-model="optionShow" :actions="optionData" @select="onSelect"/>

  </div>
</template>

<script>
import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      area_name: "",
      listData: [],
      value1: 0,
      optionShow: false,
      optionIndex: 0,
      optionData: [
        { name: "省市区", value: 0 },
        { name: "街道", value: 1 }
      ],

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数

    };
  },
  activated() {
    this.initData();
  },
  methods: {
    initData() {
      this.area_name = "";
      this.optionShow = false;
      this, optionIndex = 0;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    async getSearch() {
      let { area_name, optionIndex } = this;
      if (area_name == "") return;
      Toast.loading({
        message: "搜索中",
        forbidClick: true
      });
      let res = await $http.get("plugin.agent-enquiry.Frontend.controllers.list.search-area", {
        area_name,
        type_id: optionIndex + 1
      });
      Toast.clear();
      if (res.result != 1) {
        Toast(res.msg);
        return;
      }
      this.listData = res.data.data;
      console.log(res.data);
      this.isLoadMore = true;
      this.total_page = res.data.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }

    },
    //加载更多数据
    getMoreData() {
      let { area_name, optionIndex } = this;
      if (area_name == "") return;
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.agent-enquiry.Frontend.controllers.list.search-area", {
            area_name,
            type_id: optionIndex + 1,
            page: this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },
    gotoResult(item) {
      this.$router.push(
        this.fun.getUrl("regionalAgentResult", {}, { area_id: item.id, level: item.level })
      );
    },
    onSelect(item, index) {
      this.optionIndex = index;
    }
  }
};
</script>


<style lang="scss" rel="stylesheet/scss" scoped>

  .page {
    background: #fff;
    min-height: 100vh;
  }

  .test {
    background: red;
  }

  .search {
    margin: 1rem auto 0;
    width: 20.5rem;
    height: 2.125rem;
    display: flex;

    .option {
      height: 2.125rem;
      color: #0176ff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .searchContent {
      margin-left: 1rem;
      height: 2.125rem;
      background-color: #f5f5f5;
      border-radius: 1.063rem;
      display: flex;
      align-items: center;
      position: relative;

      .input {
        width: 15.5rem;
        padding-right: 4rem;
        font-size: 0.813rem;
        color: #838383;
        padding-left: 1rem;
        border: none;
      }

      .btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 3.875rem;
        height: 2.125rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background-color: #0176ff;
        border-radius: 1.063rem;
      }
    }
  }

  .wrapper {
    .listItem {
      padding: 0 0.813rem;

      .item {
        padding-left: 0.5rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 0.031rem solid #ededed;
        font-size: 0.86rem;
        color: #222;
        transition: 0.2s;

        &:last-child {
          border-bottom: none;
        }

        &:active {
          background: #ededed;
        }
      }
    }
  }

</style>