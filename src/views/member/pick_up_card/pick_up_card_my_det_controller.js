import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  components: {
    cTitle
  },
  data() {
    return {
      active: 0,
      activeNames: "1",
      listData: [],
      total_count: 0,
      isused_count: 0,
      notused_count: 0,

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数


    };
  },
  created() {
    this.getData();
  },
  methods: {
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    getData() {
      this.initData();
      console.log(this.$route.query);
      $http.get("plugin.picking-card.frontend.pickingCard.bindMemberCardList", {
        status: this.active,
        card_id: this.$route.query.cardId
      }).then((response) => {
        if (response.result === 1) {
          console.log(response);
          this.listData = response.data.data;
          this.total_count = response.data.total_count;
          this.isused_count = response.data.isused_count;
          this.notused_count = response.data.notused_count;

          this.isLoadMore = true;
          this.total_page = response.data.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
        }
      });
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.picking-card.frontend.pickingCard.bindMemberCardList", {
            page: this.page,
            status: this.active,
            card_id: this.$route.query.cardId
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;

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
    changeActive(evt) {
      console.log(evt, this.active);
      this.getData();
    }
  }
};