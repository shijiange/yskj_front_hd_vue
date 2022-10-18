import cTitle from "components/title";
import { Toast, Image, Search, Tabs, Tab, Grid, GridItem } from "vant";
import Tabbar from "@/components/circleCommunity/tabbar";
import DList from "@/components/dlist";
import CircleItem from "@/components/circleCommunity/circleItem";
export default {
  data() {
    return {
      banner: [],
      buttons: [],
      category: [],
      list: [],
      currentShowCategoryIndex: 0,
      circles: [],
      circlesPagination: {
        page: 1,
        finished: false,
        loading: false
      },
      circleCustomName:""
    };
  },
  activated() {
    this.loadBaseData();
    this.loadMoreCircle();
    this.getSet();
  },
  methods: {
    // 搜索页面跳转
    toSearch() {
      this.$router.push(this.fun.getUrl("circleSearch"));
    },
    // 圈子详情页面跳转
    toCircleDetails(id) {
      this.$router.push(this.fun.getUrl("circleDetails", {}, { id }));
    },
    switchCategory() {
      this.circles = [];
      this.circlesPagination = {
        page: 1,
        finished: false,
        loading: false
      };
      this.loadMoreCircle();
    },
    loadBaseData() {
      $http.get("plugin.circle.frontend.circle.index").then(response => {
        if (response.result !== 1) {
          Toast(response.msg);
          return;
        }
        this.banner = response.data.banner;
        this.buttons = response.data.button;
        this.category = response.data.category;
      });
    },
    loadMoreCircle() {
      if (this.circlesPagination.loading || this.circlesPagination.finished) {
        return;
      }
      this.circlesPagination.loading = true;
      let params = {};
      if (this.currentShowCategoryIndex == 0) {
        params = {
          is_recommend: 1
        };
      } else {
        params = {
          category_id: this.currentShowCategoryIndex
        };
      }
      params["page"] = this.circlesPagination.page;
      $http.get("plugin.circle.frontend.circle.get-circle-list", params).then(({ data: response, result, msg }) => {
        if (result === 0) {
          Toast(msg);
          return;
        }
        if (response.current_page == response.last_page || response.data.length < response.per_page) {
          this.circlesPagination.finished = true;
        }
        this.circlesPagination.page++;
        this.circles.push(...response.data);
        this.circlesPagination.loading = false;
      });
    },
    getSet() {
      $http.get("plugin.circle.frontend.circle.get-set").then(({ data: response, result, msg }) => {
        this.circleCustomName=response.plugin_name;
        this.fun.setWXTitle(response.plugin_name);
      });
    }
  },
  components: {
    cTitle,
    Tabbar,
    DList,
    CircleItem,
    VanImage: Image,
    VanSearch: Search,
    VanTabs: Tabs,
    VanTab: Tab,
    VanGrid: Grid,
    VanGridItem: GridItem
  }
};
