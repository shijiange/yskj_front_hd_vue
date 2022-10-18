import { scrollMixin } from "../../../utils/mixin";
import { Toast } from "vant";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      sid: null,
      sitem: null,
      listData: [],

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  mounted() {

  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      this.page = 1;
      this.isLoadMore = true;
      $http.get("plugin.star-spell.frontend.index.openTeam", {}, "").then(res => {
        if (res.result != 1) {
          Toast(res.msg);
          return;
        }
        this.listData = res.data.data;
        this.total_page = res.data.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }
      });

    },
    openGroup() {
      let { sid, sitem } = this;
      if (sid == null) return Toast("请选择要开的团");
      $http.post("plugin.star-spell.frontend.team.openTeam", {
        at_id: sid,
        goods_data: { goods_id: sitem.goods_id, total: 1, option_id: 0 }
      }, "").then(res => {
        Toast(res.msg);
        if (res.result != 1) {

          return;
        }
        setTimeout(() => {
          this.gotoStarMusicGoodsDetails(res.data.leader_id);

        }, 800);
        console.log(res);
      });

    },
    gotoStarMusicGoodsDetails(id) {
      this.$router.push(this.fun.getUrl("starMusicGroupDetails", { id }));
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.star-spell.frontend.index.openTeam", {
            page: this.page
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

            }
          });
      }
    },
    setSid(item) {
      this.sitem = item;
      this.sid = item.activity_id;
    },
    gotoStarMusicIndex() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("starMusicIndex", {}));
      } else {
        this.$router.go(-1);
      }

    },
    gotoStarMusicMy() {
      this.$router.push(this.fun.getUrl("starMusicMy", {}));
    }
  }
};