import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
// import { Toast } from 'vant';

export default {
  mixins: [scrollMixin],
  data() {
    return {
      active: 0,

      domain: "",
      projectList: [],

      // more
      allLoad: false,
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.uid = this.$route.params.id;
    this.getData();
  },
  methods: {
    init() {
      this.allLoad = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.projectList = [];
    },
    onClick() {
      this.getData();
    },

    getData() {
      this.init();
      $http
        .post(
          "plugin.lower-footprint.api.lower_footprint_list.getLowerMemberDetail",
          {
            page: this.page,
            category_type: this.active == 0 ? "goods" : "articleContent",
            member_id: this.uid
          },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.projectList = response.data.data;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.allLoad = true;
      } else {
        this.page = this.page + 1;
        $http
          .post(
            "plugin.lower-footprint.api.lower_footprint_list.getLowerMemberDetail",
            {
              page: this.page,
              category_type: this.active == 0 ? "goods" : "articleContent",
              member_id: this.uid
            },
            "加载中"
          )
          .then(
            response => {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.projectList = that.projectList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            response => {
              // error callback
            }
          );
      }
    },
    gotoDetail(item) {
      switch (item.page_type) {
      case "goods":
        if (!this.fun.isTextEmpty(item.has_one_goods)) {
          this.$router.push(this.fun.getUrl("goods", { id: item.has_one_goods.id }));
        }
        break;
      case "groups":
        if (!this.fun.isTextEmpty(item.has_one_fight_groups)) {
          this.$router.push(this.fun.getUrl("GroupGoods", { id: item.has_one_fight_groups.id }));
        }
        break;
      case "grabGroup":
        if (!this.fun.isTextEmpty(item.has_one_goods)) {
          this.$router.push(this.fun.getUrl("grab_group", { id: item.has_one_goods.id }));
        }
        break;
      case "articleContent":
        if (!this.fun.isTextEmpty(item.has_one_article)) {
          this.$router.push(this.fun.getUrl("articleContent", { id: item.has_one_article.id }));
        }
        break;
      case "voiceDetail":
        if (!this.fun.isTextEmpty(item.has_one_article)) {
          this.$router.push(this.fun.getUrl("VoiceDetail", { article_id: item.has_one_article.id }));
        }
        break;

      default:
        break;
      }
    }
  },
  components: {}
};
