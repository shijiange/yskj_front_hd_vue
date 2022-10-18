import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      type: "",
      record_title: "",
      activeName: "-1",
      title_api: "",
      list_api: "",
      rewardsData: {},
      recordsList: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },

  activated() {
    this.type = this.$route.query.name;
    this.record_title = this.$route.query.reward_name;
    this.initData(this.type);
    this.getData();
    this.getRecord_title();
  },

  methods: {
    initData(type) {
      this.rewardsData = {};
      this.recordsList = [];
      this.activeName = "-1";
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      switch (type) {
      case "DirectReward":
        this.title_api =
            "plugin.nominate.frontend.prize-home.nominate-prize-home";
        this.list_api =
            "plugin.nominate.frontend.prize-home.nominate-prize-list";
        break;
      case "PoorPrize":
        this.title_api =
            "plugin.nominate.frontend.prize-home.nominate-poor-prize-home";
        this.list_api =
            "plugin.nominate.frontend.prize-home.nominate-poor-prize-list";
        break;
      case "TeamAward":
        this.title_api =
            "plugin.nominate.frontend.prize-home.team-prize-home";
        this.list_api = "plugin.nominate.frontend.prize-home.team-prize-list";
        break;
      case "TeamPerformance":
        this.title_api =
            "plugin.nominate.frontend.prize-home.team-manage-prize-home";
        this.list_api =
            "plugin.nominate.frontend.prize-home.team-manage-prize-list";
        break;
      }
      this.fun.setWXTitle(this.record_title);
    },
    getRecord_title() {
      $http.get(this.title_api, {}, "加载中").then(res => {
        if (res.result === 1) {
          this.rewardsData = res.data;
        } else {
          Toast(res.msg);
        }
      });
    },
    getData() {
      this.recordsList = [];
      this.isLoadMore = false;
      this.page = 1;
      $http
        .get(
          this.list_api,
          {
            status: this.activeName,
            page: this.page
          },
          "加载中"
        )
        .then(res => {
          if (res.result === 1) {
            this.isLoadMore = true;
            this.total_page = res.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.recordsList = res.data.list.data;
          }
        });
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
            this.list_api,
            {
              status: this.activeName,
              page: this.page
            },
            "加载中"
          )
          .then(res => {
            this.isLoadMore = true;
            if (res.result === 1) {
              var myData = res.data.list.data;
              this.recordsList = this.recordsList.concat(myData); //数组拼接
            } else {
              res.page = res.page - 1;
              this.isLoadMore = false;
            }
          });
      }
    },
    handleClick() {
      //获取数据
      this.getData();
    },
    tackDet() {
      this.$router.push(this.fun.getUrl("TaskList"));
    }
  },
  components: {
    cTitle
  }
};
