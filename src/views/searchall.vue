<template>
  <div id="search" transition="fadeInLeft">
    <div id="soso" class="uou" :class="[{mout: amout}, this.fun.getPhoneEnv() == 3?'pcStyle':'']">
      <div class="search">
        <div class="back" @click="goback"><i class="fa fa-angle-left"></i></div>
        <div class="search-box">
          <form @submit.prevent action="#">
            <input
              type="search"
              placeholder="请输入内容"
              @keypress="enterSearch"
              v-model="inputs"
            />
          </form>
          <i
            class="iconfont icon-sousuo1"
            style="color: #ccc;"
            @click="search"
          ></i>
        </div>

        <div style="position: absolute; right: 1rem;">
          <i
            class="fa fa-th-large"
            v-show="view"
            @click="$store.commit('views')"
          ></i>
          <i
            class="fa fa-th-list"
            v-show="!view"
            @click="$store.commit('views')"
          ></i>
        </div>
      </div>
      <c-sort :goods="goods" v-on:sortIn="sortOut" text="搜索结果"></c-sort>
    </div>
    <div style="height: 5.4375rem; display: block;"></div>
    <c-goodsList :goods="goods" :goods_template="goods_template" text="搜索结果" class="osll" :loading="loading">
    </c-goodsList>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import cGoodsList from "components/goodsList";
import cSort from "components/sort";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      title: "搜索",
      inputs: "",
      amout: false,
      loading: false,
      goods: [],
      order_by: "",
      order_field: "",
      goods_template:'',
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  computed: mapState(["view"]),
  ...mapMutations(["views"]),
  mounted() {
    this.slider();
    window.searchallScrollTop = 0;
    if (this.$route.name == "searchAll") {
      this.search();
    }
  },
  beforeRouteLeave (to, from, next) {
    window.searchallScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  methods: {
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },
    sortOut(e) {
      if (this.goods.length == 0) {
        return;
      }
      this.goods = [];
      this.order_field = e.order_field;
      this.order_by = e.order_by;
      this.getData();
    },
    search() {
      this.goods = [];
      this.getData();
    },
    slider() {
      let that = this;
      window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        if (top < 80) {
          that.amout = false;
        } else {
          that.amout = true;
        }
      };
    },
    goback() {
      this.$router.go(-1);
    },
    getData() {
      this.page = 1;
      let json = {
        "search[keyword]": this.inputs,
        page: 1,
        order_field: this.order_field,
        order_by: this.order_by
      };
      $http
        .get("plugin.overseas.frontend.goods.search-goods", json, "loading")
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.goods = response.data.data;
            this.goods_template = response.data.goods_template;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      let json = {
        "search[keyword]": this.inputs,
        page: 1,
        order_field: this.order_field,
        order_by: this.order_by
      };
      if (this.page >= this.total_page) {
        this.loading = true;
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get("plugin.overseas.frontend.goods.search-goods", json, "加载中").then(
          response => {
            that.isLoadMore = true;
            this.loading = false;
            if (response.result === 1) {
              var myData = response.data.data;
              that.goods = that.goods.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              this.loading = true;
              that.isLoadMore = false;
              return;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    }
  },
  activated() {
    this.amout = false;
    if (window.location.href.indexOf("#/searchall?") > -1) {
      setTimeout(() => {
        window.scrollTo(0, window.searchallScrollTop);
      }, 200);
    }
  },
  components: { cGoodsList, cSort }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#search {
  .uou {
    width: 100%;
    position: fixed;
    z-index: 99;
    top: 0;
    transition: 0.2s;
    -webkit-transition: 0.2s;
    background: #fff;
  }

  .pcStyle {
    width: 375px;
  }

  .mout {
    top: -2.25rem;
  }
}

.search {
  height: 2.8125rem;
  line-height: 2.8125rem;
  position: relative;
  display: flex;
  overflow: hidden;
  background: #fff;
  border-bottom: 0.0625rem solid #f5f5f5;

  .back {
    width: 2.8125rem;

    i {
      line-height: 2.8125rem;
      font-size: 1.5rem;
    }
  }

  .search-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 75%;
    margin-top: 0.5rem;
    padding: 0 0.625rem;
    background-color: #f2f2f2;
    height: 1.75rem;
    line-height: 1.75rem;
    border-radius: 0.875rem;

    input {
      flex: 1;
      line-height: 1.75rem;
      border: none;
      color: #333;
    }

    i {
      position: absolute;
      right: 1rem;
      flex: 0 0 1.5rem;
    }
  }
}
</style>
