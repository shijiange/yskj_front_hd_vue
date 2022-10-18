import { scrollMixin } from "../../../utils/mixin";
import { Toast } from "vant";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      explainFlag: false,
      searchText: "",
      slide: [],
      listData: [],
      share: {},

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  mounted() {

  },
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    init() {
      this.page = 1;
      this.isLoadMore = true;
    },
    getData() {

      let keyword = this.searchText;
      let json = {};
      if (keyword != "") json.keyword = keyword;
      $http.get("plugin.star-spell.frontend.index.index", json, "").then(res => {
        if (res.result != 1) {
          Toast(res.msg);
          return;
        }
        this.slide = res.data.slide;
        this.listData = res.data.star_goods.data;
        this.share = res.data.share;
        this.isLoadMore = true;
        this.total_page = res.data.star_goods.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }

      });

    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        let keyword = this.searchText;
        let json = { page: this.page };
        if (keyword != "") json.keyword = keyword;
        $http
          .get("plugin.star-spell.frontend.index.index", json)
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.star_goods.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },
    onSearch() {
      this.getData();
      // console.log(this.oldSearchText)

    },
    //去开团
    gotoStarMusicOpenGroup() {
      this.$router.push(this.fun.getUrl("starMusicOpenGroup", {}));
    },
    gotoStarMusicMy() {
      this.$router.push(this.fun.getUrl("starMusicMy", {}));
    },
    gotoStarMusicGoodsDetails(id) {
      this.$router.push(this.fun.getUrl("starMusicGoodsDetails", { id }));
    }
  }
};