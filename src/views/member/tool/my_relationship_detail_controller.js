import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
// import { Toast } from 'vant';

export default {
  mixins: [scrollMixin],
  data() {
    return {
      count: 0,
      member_id: "",
      orderCount: "", //销售额
      orderNum: "", //销售笔数
      member: {},

      projectList: [],

      // more
      allLoad: false,
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.member_id = this.$route.params.uid;
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

    getData() {
      this.init();
      $http
        .post(
          "plugin.member-center-agent.api.index",
          {
            page: this.page,
            member_id: this.member_id
          },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.orderCount = response.data.order.orderCount;
            this.member = response.data.member;
            this.orderNum = response.data.order.orderNum;
            this.count = response.data.count;
            this.levelList = response.data.level;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {}
};
