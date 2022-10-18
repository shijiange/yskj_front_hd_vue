
import { Toast } from "vant";
import { scrollMixin } from "../../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeIndex: 0,
      applyLevelList: [],
      listData: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    changeVanTabIndex(index) {
      console.log(index);
      this.getData();
    },
    async getData() {
      Toast.loading({
        message: "请稍等",
        forbidClick: true
      });
      let data = {};
      data.getTeamLevel = "getTeamLevel";
      if (this.applyLevelList.length != 0) {
        data.level_id = this.applyLevelList[this.activeIndex].id;
      }
      let res = await $http
        .get("plugin.collage.api.team-performance.InformationData", data);
      Toast.clear();
      if (res.result != 1) {
        Toast(res.msg);
        return;
      }
      this.applyLevelList = res.data.getTeamLevel.level;

      this.listData = res.data.getTeamLevel.list.data;
      this.isLoadMore = true;
      this.total_page = res.data.getTeamLevel.list.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        let data = {};
        data.getTeamLevel = "getTeamLevel";
        if (this.applyLevelList.length != 0) {
          data.level_id = this.applyLevelList[this.activeIndex].id;
        }
        this.page += 1;
        data.page = this.page;
        $http
          .post("plugin.collage.api.team-performance.InformationData", page)
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.getTeamLevel.list.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    }
  }
};