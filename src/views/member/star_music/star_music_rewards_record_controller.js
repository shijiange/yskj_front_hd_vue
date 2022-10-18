import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      screenShow: false,

      labelId: 0,
      labels: [
        { id: 1, name: "星主奖励" },
        { id: 2, name: "V星主奖励" },
        { id: 3, name: "星拼补贴" },
        { id: 4, name: "V星拼补贴" },
        { id: 5, name: "新星奖励" },
        { id: 6, name: "乐拼奖励" }
      ],
      listData: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  mounted() {

  },
  created() {
    this.getData();

    console.log("执行");
  },
  methods: {
    getData() {
      this.page = 1;
      this.isLoadMore = true;
      let reward_type_id = this.labelId;
      let json = {};
      if (reward_type_id != 0) json.reward_type_id = reward_type_id;
      $http.get("plugin.star-spell.frontend.index.rewardRecord", json, "").then(res => {
        if (res.result != 1) {
          Toast(res.msg);
          return;
        }
        console.log(res);
        this.listData = res.data.data;
        this.share = res.data.share;
        this.isLoadMore = true;
        this.total_page = res.data.last_page;
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
        let reward_type_id = this.labelId;
        let json = { page: this.page };
        if (reward_type_id != 0) json.reward_type_id = reward_type_id;
        $http
          .get("plugin.star-spell.frontend.index.rewardRecord", json)
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
    setLabelId(id) {
      if (this.labelId == id) return;
      this.labelId = id;
      this.screenShow = false;
      this.getData();
    }
  }
};