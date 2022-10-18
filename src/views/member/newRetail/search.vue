<!-- 搜索页 -->
<template>
  <div id="newRetail-search">
    <c-title :hide="false" :text="titleName"></c-title>
    <van-search v-model="searchValue" show-action shape="round" placeholder="请输入商品名称" @search="getGood">
      <template #action>
        <div @click="getGood">搜索</div>
      </template>
    </van-search>
    <good-list class="goods-list" :goodsList="goodsList" :mode="this.$route.params.type"></good-list>
  </div>
</template>

<script>
import goodList from "./child/goodlist";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      pageType: null,
      titleName: "",
      searchValue: "",
      goodsList: [],
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  activated() {
    this.pageType = this.$route.params.type;
    this.titleName = this.$route.params.type == 2 ? "代理套餐" : "进货";
    this.fun.setWXTitle(this.titleName);
    this.getGood();
  },

  components: { goodList },

  computed: {},

  methods: {
    getGood() {
      let _url = '';
      let _json = {};
      if(this.pageType == 2){
        _url = "plugin.new-retail.frontend.index.AgentPackage";
        _json.goods_name = this.searchValue;
      }else{
        _url = "plugin.new-retail.frontend.index.purchaseIndependently";
        _json = {
          'search[goods_name]': this.searchValue,
        };
      }
      $http
        .get(_url, _json, "")
        .then(response => {
          if (response.result === 1) {
            this.goodsList = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
            if (response.msg != "请登录") {
              that.$router.go(-1);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        let _url = '';
        let _json = {};
        if(this.pageType == 2){
          _url = "plugin.new-retail.frontend.index.AgentPackage";
          _json.goods_name = this.searchValue;
        }else{
          _url = "plugin.new-retail.frontend.index.purchaseIndependently";
          _json = {
            'search[goods_name]': this.searchValue,
          };
        }
        _json.page = that.page;
        $http
          .get(_url, _json, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.goodsList = that.goodsList.concat(nextPageData); //进行数组拼接
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
/* #newRetail-search { */

/* } */
</style>
