import singlepoolItem2 from "../components/singlepool_item_2";
import singlepoolItem3 from "../components/singlepool_item_3";
import { Toast } from "vant";
import { scrollMixin } from "../../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  components: { singlepoolItem2, singlepoolItem3 },
  data() {
    return {
      sort: { up: false, dows: false, tab: 0 },

      screenShow: false,
      screenObj: {
        minPrice: "",
        maxPrice: "",
        status: 0
      },
      vanTagIndex: 0,
      sortObj: null,
      listData: [],
      power: 0,

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
    toggle(event, n) {
      this.sort.up = n;
      let sort_name = "";
      if (n == 4) {
        this.$emit("showscreen");
      } else {
        if (n == 1) sort_name = "1";
        if (n == 2) sort_name = "2";
        if (n == 3) sort_name = "3";
        if (n == 5) sort_name = "id";
        if (event.target.className == "grid-content up") {
          event.target.className = "grid-content down";
          this.sortOut({ sort_name, sort_status: "1" });
        } else {
          event.target.className = "grid-content up";
          this.sortOut({ sort_name, sort_status: "2" });
        }
      }
    },
    sortOut(e) {
      console.log(e);
      this.sortObj = e;
      this.getData();
      //this.$emit("watchSort",e);
    },
    setScreenStatus(status) {
      this.screenObj.status = status;
    },
    screenOnReset() {
      this.screenObj = {
        minPrice: "",
        maxPrice: "",
        status: 0
      };
    },
    screenOnConfirm() {
      this.screenShow = false;
      this.getData();
    },
    async getData() {
      this.initData();
      Toast.loading({
        message: "请稍等",
        forbidClick: true
      });
      let search = {};
      if (this.sortObj != null) {
        if (this.sortObj.sort_name == 1) {
          search["time_type"] = this.sortObj.sort_status;
        } else if (this.sortObj.sort_name == 2) {
          search["amount_type"] = this.sortObj.sort_status;
        }
      }
      search["locking_type"] = (this.screenObj.status - 1);
      if (this.screenObj.maxPrice != "") search["max_amount"] = this.screenObj.maxPrice;
      if (this.screenObj.minPrice != "") search["mim_amount"] = this.screenObj.minPrice;

      let res = await $http
        .post("plugin.collage.api.team-performance.InformationData", {
          getSinglePool: "getSinglePool",
          search
        });
      Toast.clear();
      if (res.result == 1) {
        this.power = res.data.getSinglePool.power;
        console.log(this.power);
        this.listData = res.data.getSinglePool.list.data;

        this.isLoadMore = true;
        this.total_page = res.data.getSinglePool.list.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }
      }
      console.log(res);


    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {

        let search = {};
        if (this.sortObj != null) {
          if (this.sortObj.sort_name == 1) {
            search["time_type"] = this.sortObj.sort_status;
          } else if (this.sortObj.sort_name == 2) {
            search["amount_type"] = this.sortObj.sort_status;
          }
        }
        search["locking_type"] = (this.screenObj.status - 1);
        if (this.screenObj.maxPrice != "") search["max_amount"] = this.screenObj.maxPrice;
        if (this.screenObj.minPrice != "") search["mim_amount"] = this.screenObj.minPrice;

        this.page += 1;
        $http
          .post("plugin.collage.api.team-performance.InformationData", {
            getSinglePool: "getSinglePool",
            page: this.page,
            search
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.getSinglePool.list.data;

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
    async addCollage(item) {
      console.log(item);
      Toast.loading({
        message: "正在加入中",
        forbidClick: true
      });
      let res = await $http
        .post("plugin.collage.api.index.InformationData", {
          addCollage: "addCollage",
          project_id: item.id
        });
      Toast.clear();

      if (res.result == 1) {
        Toast(res.data.addCollage);
        item.is_collage = 1;
      } else {
        Toast(res.msg);
      }
    },
    changeVanTabIndex(index) {

    }

  }
};