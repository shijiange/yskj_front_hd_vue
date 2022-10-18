<template>
  <div id="search"
       transition="fadeInLeft">
    <div id="soso"
         class="uou"
         :class="{ mout: amout }"
         :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
      <div class="search">
        <div slot="prepend"
            @click="goback">
			<i class="iconfont icon-back"></i>
		</div>
        <div class="searchBox">
          <form @submit.prevent
                action="#">
            <input type="search"
                   placeholder="搜索当前品牌商品标题"
                   @keypress="enterSearch"
                   v-model="inputs" />
          </form>
          <div class="img-icon"
               @click="search">
            <div class="img-icon-btn"></div>
          </div>
        </div>

        <div style="position: absolute; right: 1rem; top: 1rem;">
          <i class="fa fa-th-large"
             v-show="view"
             @click="$store.commit('views')"></i>
          <i class="fa fa-th-list"
             v-show="!view"
             @click="$store.commit('views')"></i>
        </div>
      </div>
      <c-sort :goods="datas"
              v-on:sortIn="sortOut"
              text="搜索结果"></c-sort>
    </div>
    <div style="height: 2.5rem; display: block;"></div>
    <div class="page-loadmore-wrapper"
         ref="wrapper"
         :style="{ height: wrapperHeight + 'px' }"
         v-if="hidden">
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <c-goodsList :goods="datas"
                     :goods_template="goods_template"
                     text="搜索结果"
                     class="osll"
                     :loading="loading"></c-goodsList>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import cGoodsList from "components/goodsList";
import cSort from "components/sort";
import { scrollMixin } from "../../utils/mixin";

var n = 1;
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      hidden: true,
      title: "搜索",
      inputs: "",
      amout: false,
      loading: false,
      allLoaded: true,
      topStatus: "",
      bottomStatus: "",
      wrapperHeight: 0,
      datas: [],
      goods_template:'',
      // 分页
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      isLoading:false
    };
  },
  computed: {
    ...mapState(["message", "blurst", "view"]),
    zoneId() {
      if (this.$store.state.zoneId == "") {
        this.$store.commit("setZoneId", window.localStorage.getItem("zoneId"));
      }
      return this.$store.state.zoneId;
    }
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
    sortOut(e) {
      if (this.datas.length == 0) {
        return;
      }
      console.log("得到的信息", e);
      n = 1;
      this.datas = [];
      this.order_field = e.order_field;
      this.order_by = e.order_by;
      this.gotoSearch(n);
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    //更新
    loadTop() {
      n = 1;
      this.datas = [];
      this.gotoSearch(n);
      // this.$refs.loadmore.onTopLoaded();
    },
    // 加载更多--废弃
    loadBottom() {
      // console.log("加载更多启动");
      // n++;
      // this.gotoSearch(n);
      // this.$refs.loadmore.onBottomLoaded();
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
      this.hidden = false;
      localStorage.setItem("isset", 1);
      this.$router.go(-1);
    },
    search() {
      n = 1;
      this.datas = [];
      this.gotoSearch(n);
    },
    gotoSearch(page = 1) {
      this.wrapperHeight = window.scrollTo(0, 0);
      this.loading = false;
      this.allLoaded = false;
      this.page = 1;
      let json = {
        keywords: this.inputs,
        page: page,
        brand_id: this.$route.params.id,
        as_id: this.zoneId,
        order_field: this.order_field,
        order_by: this.order_by
      };

      $http.get("goods.goods.get-goods-brand-list", json).then(json => {
        if (json.result == 1) {
          this.isLoadMore = true;
          this.total_page = json.data.goods.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.loading = false;
          this.allLoaded = false;
          // 搜索结果为空
          if (json.data.goods.data.length <= 0) {
            this.loading = true;
            this.allLoaded = true;
            return;
          }
          // 如果当前页数大于总页数 就不加载了
          if (json.data.goods.current_page > json.data.goods.last_page) {
            this.loading = true;
            this.allLoaded = true;
            return;
          }
          // this.datas.push(...json.data.goods.data);
          this.datas = [];
          this.datas = json.data.goods.data;
          this.goods_template = json.data.goods.goods_template;
          if (json.data.goods.data.length < 20) {
            this.loading = true;
            this.allLoaded = true;
            return;
          }
          this.isLoading = false;
        } else {
          console.log("请求有问题,错误信息：", json.msg);
          this.isLoading = false;
        }
      });
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        that.allLoaded = false;
        that.loading = true;
        return;
      } else {
        that.page += 1;
        let json = {
          keywords: that.inputs,
          page: that.page,
          brand_id: that.$route.params.id,
          as_id: that.zoneId,
          order_field: that.order_field,
          order_by: that.order_by
        };
        let _url = "goods.goods.get-goods-brand-list";
        $http
          .get(_url, json)
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.goods.data;
              that.datas = that.datas.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
  },
  activated() {
    this.hidden = true;
    this.isset = localStorage.getItem("isset");
    if (this.isset && this.$route.params.fromHome !== 1) {
      // localStorage.removeItem("isset");
      this.wrapperHeight = window.scrollTo(0, 0);
    }
    //keep分类不相同时，重载数据
    // this.datas = [];
    // this.inputs = '';
    //this.loadMore();
    else if (this.$route.params.fromHome !== 1) {
      // 不是从上一级点进的不清空
      this.wrapperHeight =
        document.documentElement.clientHeight -
        this.$refs.wrapper.getBoundingClientRect().top;
      // this.wrapperHeight=window.scrollTo(0,0)
    } else {
      // this.wrapperHeight = 83;
      this.wrapperHeight = window.scrollTo(0, 0);
      n = 1;
      this.datas = [];
      this.inputs = "";
      this.gotoSearch(n);
    }
  },
  created() {
    // this.hidden = true;
    // this.isset = sessionStorage.getItem("isset");
    // if (this.isset) {
    //   sessionStorage.removeItem("isset");
    //   this.wrapperHeight = window.scrollTo(0, 0);
    // }

    if (this.$route.params.fromHome !== 1) {
      this.hidden = true;
      this.datas = [];
      this.inputs = "";
      this.gotoSearch(1);
    }
  },
  components: { cGoodsList, cSort }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#search {
  .osll {
    min-height: 100vh;

    /* background: #FFF; */
    margin-top: 3rem;
    box-sizing: border-box;
  }
  // 	@descendent wrapper {
  //     overflow: scroll;
  // }
  .page-loadmore-wrapper2 {
    height: 100vh;
    overflow: hidden;
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

  .mout {
    top: -2.25rem;
  }
}

.search {
  overflow: hidden;
  background: #fff;
  border-bottom: 0.0625rem solid #f5f5f5;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 1rem;

  .mint-button.mint-button--default {
    float: left;
    width: 10%;
    border: none;
    padding-top: 0.4rem;
    box-shadow: none;
  }

  .searchBox {
    position: relative;
    font-size: 14px;
    display: inline-table;
    float: left;
    width: 80%;
    margin-left: 2%;
    height: 2.8125rem;

    input {
      vertical-align: middle;
      border: none;
      background: #f2f2f2 none;
      box-sizing: border-box;
      outline: 0;
      padding: 0.1875rem 0.625rem;
      height: 1.875rem;
      line-height: 1.875rem;
      margin-top: 0.5rem;
      color: #8c8c8c;
      font-size: 14px;
      width: 17.75rem;
      border-radius: 0.9375rem;
      z-index: 10;
    }

    .img-icon {
      border: none;
      color: #a9a9a9;
      display: table-cell;
      position: relative;
      border-radius: 0;
      height: 1.875rem;
      top: 0.0625rem;
      opacity: 2;
      left: -2.25rem;

      .img-icon-btn {
        position: absolute;
        z-index: 12;
        width: 1rem;
        height: 1rem;
        top: 50%;
        left: 50%;
        margin-left: -0.5rem;
        margin-top: -0.5rem;
        background:
          url("../../assets/images/search.png") no-repeat center
          center;
        background-size: 80% 80%;
      }
    }
  }
}
</style>
