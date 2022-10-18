import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      PopupShow: false,
      url: "plugin.product-market.api.order.index",

      domain: "",
      projectList: [],

      showList: [],

      // more
      allLoad: false,
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
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
    gotoDetail(id) {
      this.$router.push(this.fun.getUrl("footprintMemberDetail", { id: id }));
    },
    getData() {
      this.init();
      $http
        .post(
          "plugin.lower-footprint.api.lower_footprint_list.getLowerMemberList",
          {
            page: this.page
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
          .get(
            "plugin.lower-footprint.api.lower_footprint_list.getLowerMemberList",
            {
              page: this.page
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
    }
  },
  components: {}
};
