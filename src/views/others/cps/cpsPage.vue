<template>
  <div id="cpsPage">
    <c-title :hide="false" text="聚合页"></c-title>

    <div v-if="showPage">
      <template v-for="(item, index) in components">
        <component :key="index" :is="item.component_key" :isBottom="isBottom" :lastIndex="lastIndex"
                   :btnFlag="btnFlag" :id="item.id" :page_id="page_id" :component_key="item.component_key"
                   :datas="item.remote_data" :index="index"></component>
      </template>
    </div>
  </div>
</template>
<script>
import U_tabcontrol from "components/new_diy/tabcontrol";

const documentElement = document.documentElement;
const body = document.body;
export default {
  data() {
    return {
      components: [],
      page_id: "",
      page_info: {},
      isBottom: false,
      btnFlag: false,

      current_page: 1,
      total_page: 0,
      isLoadMore: true,
      lastIndex: "",

      showPage: false,
    };
  },
  created() {
    this.getCPSdata();
    // mounted 肯定是第一次进来
    this.isMounted = true;
  },
  activated() {
    if (window.cps_page_id != this.fun.getKey("page_id") || window.isInHome) {
      if (!this.isMounted) {
        this.getCPSdata();
      }
    }
    window.cps_page_id = this.fun.getKey("page_id");
    window.addEventListener("scroll", this.handleScroll);
    if (this.isMounted) {
      // 防止下次进入同样的页面还请求
      this.isMounted = false;
    }
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 获取装修或者是默认的数据
    getCPSdata() {
      this.showPage = false;
      $http.get("home-page.index", { page_id: this.fun.getKey("page_id") }, "加载中").then(
        response => {
          if (!response) return;
          if (response.result === 1) {
            this.showPage = true;

            this.page_id = response.data.item.id;
            if (response.data.item.page) {
              this.total_page = response.data.item.page.total_page;
              this.current_page = response.data.item.page.current_page;
              this.lastIndex = response.data.item.page.count - 1;
              this.isLoadMore = true;
            }

            this.page_info = response.data.item.page_info;
            this.components = response.data.item.datas;
            this.fun.wxShare(
              "",
              {},
              {
                title: this.page_info.page_title?this.page_info.page_title:'',
                imgUrl: this.page_info.page_icon?this.page_info.page_icon:'',
                description: this.page_info.page_description?this.page_info.page_description:''
              }
            );
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        });
    },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(
          body.clientHeight,
          documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          body.clientHeight,
          documentElement.clientHeight
        );
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 60) {
        this.btnFlag = true;
      } else {
        this.btnFlag = false;
      }

      //滚动事件触发
      if (Number(this.getScrollTop() + this.getClientHeight() + 105) >= this.getScrollHeight()) {
        if (this.isLoadMore) {
          this.getMoreDecorate();
        }
        //此处发起请求
        this.isBottom = true;
      } else {
        this.isBottom = false;
      }
    },
    getMoreDecorate() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.current_page < this.total_page) {
        this.current_page = this.current_page + 1;
        $http.get("plugin.decorate.frotend.decorate-api.get-page", {
          decorate_page: this.current_page,
          decorate_id: this.page_id
        }, "..").then((response) => {
          if (response.result == 1) {
            this.isLoadMore = true;
            this.components = this.components.concat(response.data.datas);
          } else {
            this.isLoadMore = false;
            this.current_page = this.current_page - 1;
          }
        });
      } else {
        console.log("加载完了");
      }
    },
  },
  components: {
    U_article: () => import('../../../components/new_diy/article.vue'),
    U_backup: () => import('../../../components/new_diy/backup.vue'),
    U_blank: () => import('../../../components/new_diy/blank.vue'),
    U_button: () => import('../../../components/new_diy/button.vue'),
    U_community: () => import('../../../components/new_diy/community.vue'),
    U_coupons: () => import('../../../components/new_diy/coupons.vue'),
    U_cpssearch: () => import('../../../components/new_diy/cpssearch.vue'),
    U_cube: () => import('../../../components/new_diy/cube.vue'),
    U_deposit: () => import('../../../components/new_diy/deposit.vue'),
    U_form: () => import('../../../components/new_diy/form.vue'),
    U_goods: () => import('../../../components/new_diy/goods.vue'),
    U_goodscps: () => import('../../../components/new_diy/goodscps.vue'),
    U_goodsgroup: () => import('../../../components/new_diy/goodsgroup.vue'),
    U_goodsnearby: () => import('../../../components/new_diy/goodsnearby.vue'),
    U_goodsrush: () => import('../../../components/new_diy/goodsrush.vue'),
    U_headline: () => import('../../../components/new_diy/headline.vue'),
    U_homedata: () => import('../../../components/new_diy/homedata.vue'),
    U_line: () => import('../../../components/new_diy/line.vue'),
    U_livestreaming: () => import('../../../components/new_diy/livestreaming.vue'),
    U_location: () => import('../../../components/new_diy/location.vue'),
    U_lottery: () => import('../../../components/new_diy/lottery.vue'),
    U_maps: () => import('../../../components/new_diy/maps.vue'),
    U_notice: () => import('../../../components/new_diy/notice.vue'),
    U_richtext: () => import('../../../components/new_diy/richtext.vue'),
    U_search: () => import('../../../components/new_diy/search.vue'),
    U_staff: () => import('../../../components/new_diy/staff.vue'),
    U_shopfor: () => import('../../../components/new_diy/shopfor.vue'),
    U_shortvideo: () => import('../../../components/new_diy/shortvideo.vue'),
    U_signin: () => import('../../../components/new_diy/signin.vue'),
    U_simplegraph: () => import('../../../components/new_diy/simplegraph.vue'),
    U_slideshow: () => import('../../../components/new_diy/slideshow.vue'),
    U_stores: () => import('../../../components/new_diy/stores.vue'),
    U_storesranking: () => import('../../../components/new_diy/storesranking.vue'),
    U_suspendbutton: () => import('../../../components/new_diy/suspendbutton.vue'),
    U_tabcontrol,
    U_title: () => import('../../../components/new_diy/title.vue'),
    U_video: () => import('../../../components/new_diy/video.vue'),
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  /* #cpsPage {} */
</style>
