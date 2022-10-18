<template>
  <div>
    <yz-blank v-show="isShow" :datas="goods" text="没找到相关产品，换个词搜搜吧"></yz-blank>
    <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
      <c-goodsList :goods="goods" :goods_template="goods_template" text="搜索结果" class="osll" :loading="!isLoadMore"></c-goodsList>
    </d-list>
  </div>
</template>

<script>
import DList from "@/components/dlist";
import cGoodsList from "components/goodsList";
import yzBlank from "components/ui_components/yz_blank";
export default {
  data () {
    return {
      groupId: '',
      isShow: true,

      loading: false,
      goods: [],
      page: 1,
      isLoadMore: true,
      isLoading: false,
      total_page: 0, //总页数

      goods_template: "",
    };
  },

  activated () {
    console.log(this.$route);
    this.groupId = this.$route.params.id;
    this.getData();
  },

  methods: {
    getData () {
      $http.get("plugin.group-code.api.group-code.get-goods", {id: this.groupId})
        .then(res => {
          this.isShow = true,
          this.isLoading = false;
          if (res.result == 1) {
            window.scrollTo(0, 0);
            this.isLoadMore = true;
            this.loading = false;
            this.total_page = res.data.last_page || 0;
            this.goods_template = res.data.goods_template;
            this.goods = res.data.data;

            // 搜索结果为空
            if (this.total_page <= 1) {
              this.isLoadMore = false;
            }
          } else {
            this.goods = [];
            this.isLoadMore = false;
            this.isShow = true;
          }
        });
    },


    getMoreData() {
      if (this.loading === true || this.isLoadMore === false) {
        return;
      }

      console.log("加载更多启动");
      this.loading = true; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.isLoadMore = false;
        console.log("没了");
      } else {
        this.page += 1;
        $http.get("plugin.group-code.api.group-code.get-goods", {id: this.groupId, page: this.page}, "...")
          .then(res => {
            this.isLoadMore = true;
            this.loading = false;
            if (res.result == 1) {
              let nextPageData = res.data.data;
              this.goods = this.goods.concat(nextPageData); //进行数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
  },

  components: {
    cGoodsList,
    DList,
    yzBlank
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
</style>