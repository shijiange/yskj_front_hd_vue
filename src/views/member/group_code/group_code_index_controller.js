/**
 * Created by win 10 on 2020/7/21.
 */
import { Toast } from "vant";

import cAdd from "./components_add.vue";
import cListItem from "./components_list_item.vue";
import { Swipe, SwipeItem } from "vant";

import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  components: { cAdd, Swipe, SwipeItem, cListItem },
  data() {
    return {
      bannerList: [],
      rankingList: [],
      recommendList: [],
      shop_log: "",

      searchText: "",

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  mounted() {

  },
  activated() {
    this.initData();
    this.getIndexData();
    console.log("执行");
  },
  methods: {
    initData() {
      this.searchText = "";
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    async getIndexData() {
      Toast.loading({
        message: "",
        forbidClick: true
      });
      let res = await $http.get("plugin.group-code.api.group-code.index");
      Toast.clear();

      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }

      this._setBannerList(res.data.set);
      this.rankingList = res.data.rankingList;
      this.recommendList = res.data.recommend.data;
      this.shop_log = res.data.shop_log;

      this.isLoadMore = true;
      this.total_page = res.data.recommend.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }

    },

    //加载更多数据
    async getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        let res = await $http.get("plugin.group-code.api.group-code.index", {
          page: this.page
        });

        this.isLoadMore = true;
        if (res.result === 1) {
          var nextPageData = res.data.recommend.data;

          this.recommendList = this.recommendList.concat(nextPageData);
          //this.status = res.data.status;
        } else {
          this.page = this.page - 1;
          this.isLoadMore = false;

        }
      }
    },

    _setBannerList(data) {
      console.log(data);
      this.bannerList = [];
      let obj1 = {};
      if (!this.fun.isTextEmpty(data.banner1)) {
        obj1.img = data.banner1;
        obj1.url = data.banner1_url;
        this.bannerList.push(obj1);
      }
      let obj2 = {};
      if (!this.fun.isTextEmpty(data.banner2)) {
        obj2.img = data.banner2;
        obj2.url = data.banner2_url;
        this.bannerList.push(obj2);
      }
      let obj3 = {};
      if (!this.fun.isTextEmpty(data.banner3)) {
        obj3.img = data.banner3;
        obj3.url = data.banner3_url;
        this.bannerList.push(obj3);
      }
    },
    gotoRanking() {
      this.$router.push(
        this.fun.getUrl("groupCodeRanking")
      );
    },
    gotoGroupCodeLabel(item) {
      this.$router.push(
        this.fun.getUrl("groupCodeLabel", {}, { groupCodeId: item.id })
      );
    },
    gotoGroupCodeSearch() {
      // console.log(this.oldSearchText)
      this.$router.push(
        this.fun.getUrl("groupCodeSearch", {}, { searchText: this.searchText })
      );
    }
  }
};
