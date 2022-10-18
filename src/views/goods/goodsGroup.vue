<template>
  <div>
    <c-title :hide="false" :text="navigationTitle">
    </c-title>
    <div class="banner-box" v-if="banner_src">
      <img :src="banner_src" alt="" @click="toLink">
    </div>
    <c-goodsList
      :goods="goodsList"
      :goods_template="goods_template"
      text="搜索结果"
      class="osll"
      :loading="loading"
    ></c-goodsList>
  </div>
</template>

<script>
import { scrollMixin } from '../../utils/mixin';
import cGoodsList from 'components/goodsList';
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      navigationTitle: '',
      goodsList: [],
      goods_template: '01',
      goodsShow: {},
      banner_src: "",
      banner_url: "",

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    switch (this.$route.params.goodtype) {
    case 'recommend':
      this.navigationTitle = '推荐商品';
      break;
    case 'hot':
      this.navigationTitle = '热销商品';
      break;
    case 'new':
      this.navigationTitle = '新品商品';
      break;
    case 'promotion':
      this.navigationTitle = '促销商品';
      break;
    default:
      this.navigationTitle = '商品列表';
      break;
    }
    this.fun.setWXTitle(this.navigationTitle);
    this.getData();
  },
  mounted() {
  },
  methods: {
    toLink() {
      if(this.banner_url) {
        window.location.href = this.banner_url;
      }
    },
    //获取数据
    getData() {
      let json = {
        page: this.page,
        goods_type: this.$route.params.goodtype
      };
      $http.post("plugin.pc-terminal.api.home.get-goods", json, " ").then(
        (response)=> {
          if (response.result === 1) {
            this.goodsShow = response.data.goodsShow;
            switch (this.$route.params.goodtype) {
            case 'recommend':
              this.banner_src = this.goodsShow.recommend_banner_src;
              this.banner_url = this.goodsShow.recommend_url;
              break;
            case 'hot':
              this.banner_src = this.goodsShow.hot_banner_src;
              this.banner_url = this.goodsShow.hot_url;
              break;
            case 'new':
              this.banner_src = this.goodsShow.new_banner_src;
              this.banner_url = this.goodsShow.new_url;
              break;
            case 'promotion':
              this.banner_src = this.goodsShow.promotion_banner_src;
              this.banner_url = this.goodsShow.promotion_url;
              break;
            default:
              this.banner_src = "";
              break;
            }
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.goodsList = response.data.list.data;
          } else {
            Toast(response.msg);
          }
        },
        (res)=> {
          console.log(res);
        }
      );
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.pc-terminal.api.home.get-goods",
            {
              page: this.page,
              goods_type: this.$route.params.goodtype
            },
            "加载中"
          )
          .then(
            (response)=> {
              this.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.list.data;
                this.goodsList = this.goodsList.concat(myData); //数组拼接
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            (response)=> {
              // error callback
            }
          );
      }
    },
  },

  components: {
    cGoodsList
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .banner-box {
    cursor: pointer;
    width: 100%;

    img {
      width: 100%;
    }
  }
</style>