<template>
  <div class="timeAppointment_search">
    <c-title :hide="false" text="搜索"></c-title>
    <div class="searchBox">
      <div class="search">
        <i class="iconfont icon-all_search_2" @click="tapTab"></i>
        <van-field v-model="keyword" placeholder="请输入搜索内容" @keyup.enter="tapTab" />
      </div>
    </div>
    <van-tabs v-model="active" @change="tapTab">
      <van-tab :title="`预约${appointmentLang.service}`"></van-tab>
      <van-tab :title="appointmentLang.reserve_obj"></van-tab>
    </van-tabs>
    <div class="goodsList" v-if="active == 0">
      <i-Sort :good="sortGood" @tapJson="getChild"></i-Sort>
      <div class="loadNomore" v-show="sortGood.length == 0 || isLoadMore">
        <img src="@/assets/images/no-more-product.png" />
      </div>
    </div>
    <div class="userList" v-if="active == 1">
      <div class="list" v-for="item in userInfo" :key="item.id" @click="goUser(item.id)">
        <div class="img">
          <img :src="item.thumb" alt="" />
        </div>
        <div class="goosDetail">
          <div class="title">{{ item.name }}</div>
          <div class="intro">{{ item.description }}</div>
        </div>
      </div>
      <div class="loadNomore" v-show="userInfo.length == 0 || isLoadMore">
        <img src="@/assets/images/no-more-product.png" />
      </div>
    </div>
  </div>
</template>
<script>
import ISort from "./component/sortList";
import { scrollMixin } from "../../utils/mixin";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      sortGood: [],
      userInfo: [],
      postjson: {},
      keyword: "",

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.active = this.$route.params.ind == 1 ? 1 : 0;
    this.initData();
    this.getData();
  },
  computed: {
    appointmentLang() {
      if (this.$store.state.shopLanguage?.reserve_simple) {
        return this.$store.state.shopLanguage.reserve_simple;
      } else {
        return { reserve_obj: "预约人员", service: "服务" };
      }
    }
  },
  methods: {
    goUser(kid) {
      this.$router.push(this.fun.getUrl("AppointmentUserDe", { id: kid }));
    },
    tapTab(e) {
      this.initData();
      this.getData();
    },
    getChild(e) {
      this.initData();
      this.postjson = e;
      this.getData(this.postjson);
    },
    getData(info) {
      let url = "";
      let json = {};
      if (this.active == 0) {
        url = "plugin.reserve-simple.frontend.goods.search-goods";
        json = {
          "search[keyword]": this.keyword,
          page: this.page
        };
        if (info) {
          if (info.order_by) {
            json.order_by = info.order_by;
          }
          if (info.order_field) {
            json.order_field = info.order_field;
          }
        }
      } else {
        url = "plugin.reserve-simple.frontend.obj.search-objs";
        json = {
          keyword: this.keyword,
          page: this.page
        };
      }
      $http
        .get(url, json, "加载中")
        .then(response => {
          if (response.result === 1) {
            if (this.active == 0) {
              this.sortGood = response.data.data;
            } else {
              this.userInfo = response.data.data;
            }
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page += 1;
        let isjson;
        let info = this.postjson;
        if (this.active == 0) {
          isjson = {
            "search[keyword]": this.keyword,
            page: this.page
          };
          if (info) {
            if (info.order_by) {
              isjson.order_by = info.order_by;
            }
            if (info.order_field) {
              isjson.order_field = info.order_field;
            }
          }
        } else {
          isjson = {
            page: this.page,
            keyword:this.keyword
          };
        }
        if (this.keyword) {
          isjson.search.keyword == this.keyword;
        }
        $http.get("plugin.reserve-simple.frontend.goods.search-goods", isjson,'加载中').then(res => {
          this.isLoadMore = true;
          if (res.result === 1) {
            var nextPageData = response.data.data;
            if (this.active == 0) {
              this.sortGood = this.sortGood.concat(nextPageData);
            } else {
              this.userInfo = this.userInfo.concat(nextPageData);
            }
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        });
      }
    },
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.sortGood = [];
      this.userInfo = [];
    }
  },
  components: {
    ISort
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.timeAppointment_search {
  min-height: 100vh;
  background: #fff;
  .loadNomore {
    display: flex;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
      width: 5rem;
      height: 5rem;
    }
  }
}
.userList {
  padding: 0 0.94rem;
  padding-top: 1.44rem;
  background: #fff;
  .list {
    display: flex;
    padding-bottom: 1.53rem;
    .goosDetail {
      text-align: left;
      margin-left: 0.75rem;
      overflow: hidden;
      .title {
        font-size: 0.88rem;
        color: #4f4f4f;
        font-weight: bold;
      }
      .intro {
        margin-top: 0.56rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    .img {
      flex-shrink: 0;
      width: 2.81rem;
      height: 2.81rem;
      background-color: #dcdcdc;
      border-radius: 1.41rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
  }
}
.goodsList {
  padding: 0 0.94rem;
  background: #fff;
  overflow: hidden;
}
.searchBox {
  width: 100%;
  height: 2.75rem;
  padding: 0.44rem 0.94rem;
  overflow: hidden;
  box-sizing: border-box;
  background: #fff;
  .search {
    background-color: #f6f6f6;
    border-radius: 0.94rem;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 1rem;
    .iconfont {
      margin-right: 0.38rem;
    }
    .van-cell {
      padding: 0;
      background: #f6f6f6;
    }
  }
}
</style>