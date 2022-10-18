<template>
  <div id="search"
       transition="fadeInLeft">
    <div id="soso"
         class="uou"
         :class="{'mout':amout}"
         :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
      <div class="search">

        <div class="back"
             @click='goback'><i class="fa fa-angle-left"></i></div>
        <div class="search-box">
          <form @submit.prevent
                action="#">
            <input type="search"
                   placeholder="请输入内容"
                   @keypress="enterSearch"
                   v-model="inputs"
                   @click.native='hidebox'>
          </form>
          <i class="iconfont icon-sousuo1"
             style="color: #ccc;"
             @click='search'></i>
        </div>
        <div style="position: absolute; right: 1rem;">
          <i class="fa fa-th-large"
             v-show="view"
             @click="$store.commit('views')"></i>
          <i class="fa fa-th-list"
             v-show="!view"
             @click="$store.commit('views')"></i>
        </div>
      </div>

    </div>
    <div style="height: 3.4375rem; display: block;"></div>
      <c-goodsList :goods='goods'
                   text='搜索结果'
                   class='osll'
                   :styleCon="styleObj"
                   :loading='loading'
                   :jumpSo='jumpSo'
                   :storeId='storeId'></c-goodsList>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { scrollMixin } from "../../../utils/mixin";
import cGoodsList from "components/goodsList";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      // title: '搜索',
      inputs: "", //input-name
      amout: false, //class
      allLoaded: true, //loadmore-all
      goload: false, //loadmore--if
      goods: [], //goodList 数据
      loading: false, //goodList--boolean

      styleObj: {
        display: "inline-block",
        marginRight: "25px",
        backgroundColor: "white",
        marginLeft: "5px",
        position: "static"
      },
      jumpSo: true,
      storeId: "",
      pageNum: 1,
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
    };
  },
  computed: {
    ...mapState(["view"])
  },
  methods: {
    ...mapMutations(["views"]),
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },
    //通用功能
    showbox() {
      this.show = !this.show;
    },
    //隐藏盒子
    hidebox() {
      this.show = false;
    },
    search() {
      this.pageNum = 1;
      this.goods = [];
      this.goload = true;
      this.isLoadMore =true;
      this.gotoSearch();
    },
    //loadmore
    // loadBottom() {
    //   if (this.allLoaded == false) {
    //     this.gotoSearch();
    //     this.$refs.loadmore.onBottomLoaded();
    //   }
    // },
    getMoreData(){
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.pageNum >= that.total_page) {
        this.isNOMore = true;
        return;
      } else {
        that.pageNum += 1;
        let json = {
          store_id: this.$route.params.store_id,
          kwd: this.inputs,
          page: this.pageNum
        };
        $http
          .get(
            "plugin.store-cashier.frontend.store.goods.get-goods-by-kwd",
            json,
            "加载中..."
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              this.goods = this.goods.concat(res.data.data);
            } else {
              that.pageNum = that.pageNum - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //返回
    goback() {
      this.$router.go(-1);
    },
    //搜索请求
    gotoSearch() {
      let json = {
        store_id: this.$route.params.store_id,
        kwd: this.inputs,
        page: this.pageNum
      };
      $http
        .get("plugin.store-cashier.frontend.store.goods.get-goods-by-kwd", json)
        .then(response => {
          if (response.result == 1) {
            // this.pageNum = Number(this.pageNum) + 1;
            // this.loading = false;
            // this.allLoaded = false;
            // // 搜索结果为空
            // if (response.data.total <= 0) {
            //   this.loading = true;
            //   this.allLoaded = true;
            //   return;
            // }
            this.goods = this.goods.concat(response.data.data);
            // console.log("商品内容", this.goods);
            // if (response.data.current_page == response.data.last_page) {
            //   this.loading = true;
            //   this.allLoaded = true;
            //   return;
            // }
            // 移除mt-loadmore，加载更多
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            this.loading = true;
            this.allLoaded = true;
          }
        });
    },
    gotoCouponSearch() {
      this.goload = true;
      let json = {
        store_id: this.$route.params.store_id,
        page: this.pageNum
      };
      let _url = "";
      if (this.$route.params.fromHome == 2) {
        json.goods_ids = this.$route.query.gid;
        _url = "plugin.store-cashier.frontend.store.goods.get-goods-by-ids";
      } else if (this.$route.params.fromHome == 3) {
        json.category_id = this.$route.query.cid;
        _url =
          "plugin.store-cashier.frontend.store.goods.get-goods-by-category-id-and-store-id";
      } else {
        this.$router.go(-1);
      }
      $http.get(_url, json).then(response => {
        if (response.result == 1) {
          this.pageNum = Number(this.pageNum) + 1;
          this.loading = false;
          this.allLoaded = false;
          // 搜索结果为空
          if (this.$route.params.fromHome == 2) {
            if (response.data.total <= 0) {
              this.loading = true;
              this.allLoaded = true;
              return;
            }
            this.goods = this.goods.concat(response.data.data);
            console.log("商品内容", this.goods);
            if (response.data.current_page == response.data.last_page) {
              this.loading = true;
              this.allLoaded = true;
              return;
            }
          } else {
            this.goods = response.data;
          }
        } else {
          this.loading = true;
          this.allLoaded = true;
        }
      });
    }
  },
  activated() {
    this.storeId = this.$route.params.store_id;
    this.amout = false;
    this.loading = false;
    if (this.$route.params.fromHome !== 1) {
      if (window.location.href.indexOf("#/store/search/") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.storeSearchScrollTop);
        }, 200);
      }
      // 不是从上一级点进的不清空
      this.gotoCouponSearch();
    } else {
      this.goods = [];
      this.inputs = "";
      this.pageNum = 1;
    }
  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      this.goods = [];
      this.inputs = "";
      this.pageNum = 1;
    }
  },
  mounted() {
    window.storeSearchScrollTop = 0;
  },
  beforeRouteLeave(to, from, next) {
    window.storeSearchScrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  components: {
    cGoodsList
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#search {
  .osll {
    min-height: 100vh;
    overflow: scroll;
  }

  .uou {
    width: 100%;
    position: fixed;
    z-index: 99;
    top: 0;
    transition: 0.2s;
    -webkit-transition: 0.2s;
    background: #fff;
  }

  #sort {
    line-height: 2.5rem;
    font-size: 14px;
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
