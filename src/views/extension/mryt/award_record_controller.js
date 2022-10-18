import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

const documentElement = document.documentElement;

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      type: "",
      rewardsData: {},
      recordsList: [],
      activeName: "-1",
      WXtitle: "",
      api: "",
      listApi: "",

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  created() {
    this.type = this.$route.query.name;
    this.WXtitle = this.$route.query.reward_name;
    if (this.$route.params.fromHome !== 1) {
      this.initData(this.type);
      this.getIndex();
      this.getData();
    }
  },
  activated() {
    this.type = this.$route.query.name;
    this.WXtitle = this.$route.query.reward_name;
    if (this.$route.params.fromHome === 1) {
      //保持原来状态
      this.initData(this.type);
      this.getIndex();
      this.getData();
    }
  },
  methods: {
    toDetail(item) {
      this.$router.push(
        this.fun.getUrl("AwardDetail", {}, { id: item.id, name: this.type })
      );
    },
    getTab(tab) {
      // 赋值
      documentElement.scrollTop = 0;
      this.getData();
    },
    initData(type) {
      this.rewardsData = {};
      this.recordsList = [];
      this.activeName = "-1";
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      switch (type) {
      case "teamManagement":
        this.api = "plugin.mryt.api.team-manage.index";
        this.listApi = "plugin.mryt.api.team-manage.getList";
        break;
      case "team":
        this.api = "plugin.mryt.api.team.index";
        this.listApi = "plugin.mryt.api.team.getList";
        break;
      case "thanks":
        this.api = "plugin.mryt.api.thanksgiver.index";
        this.listApi = "plugin.mryt.api.thanksgiver.getList";
        break;
      case "education":
        this.api = "plugin.mryt.api.train.index";
        this.listApi = "plugin.mryt.api.train.getList";
        break;
      case "immediate":
        this.api = "plugin.mryt.api.direct-award.index";
        this.listApi = "plugin.mryt.api.direct-award.getList";
        break;
      case "tier":
        this.api = "plugin.mryt.api.tier.index";
        this.listApi = "plugin.mryt.api.tier.getList";
        break;
      default:
        this.WXtitle = "奖励记录";
        break;
      }
      this.fun.setWXTitle(this.WXtitle);
    },
    getIndex() {
      const that = this;
      $http.get(that.api, {}, "加载中").then(
        function(response) {
          if (response.result === 1) {
            that.rewardsData = response.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        });
    },
    //获取数据
    getData() {
      this.isLoadMore = false;
      this.page = 1;
      $http
        .get(this.listApi, { status: this.activeName }, "加载中")
        .then(
          response => {
            if (response.result === 1) {
              this.isLoadMore = true;
              this.total_page = response.data.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              this.recordsList = response.data.data;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response);
          }
        )
        .catch(err => {
          console.error(err);
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
            this.listApi,
            {
              status: this.activeName,
              page: this.page
            },
            "加载中"
          )
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.data;
                this.recordsList = this.recordsList.concat(myData); //数组拼接
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            response => {
              // error callback
            }
          )
          .catch(err => {
            console.error(err);
          });
      }
    }
  },
  components: { cTitle }
};
