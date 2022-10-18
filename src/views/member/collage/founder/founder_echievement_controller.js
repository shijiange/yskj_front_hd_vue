import month from "../components/month";

import echievementListItem1 from "../components/echievement_list_item_1";
import echievementListItem2 from "../components/echievement_list_item_2";
import echievementListItem3 from "../components/echievement_list_item_3";
import { Toast } from "vant";
import { scrollMixin } from "../../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  components: { month, echievementListItem1, echievementListItem2, echievementListItem3 },
  data() {
    return {
      headerTagIndex: 0,
      vanTagIndex: 0,
      tag3Items: ["直接奖励", "工资奖励", "拼单奖励", "招待费用", "平级奖", "育人奖"],
      tag3Index: 0,
      currentSelectedMonth: 0,
      currentSelectedYear: 0,
      monthShow: false,
      listData: [],
      power: 0,  //是否显示团队业绩
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数

    };
  },
  mounted() {

  },
  activated() {
    //this.getData();
  },
  methods: {
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    setHeaderTagIndex(index) {
      this.headerTagIndex = index;
      console.log("setHeaderTagIndex");
      this.getData();
    },
    setTag3Index(key) {
      this.tag3Index = key;
      this.getData();
      console.log("setTag3Index");
    },
    openMonth() {
      this.monthShow = !this.monthShow;
    },
    selectedMonth(event) {
      this.monthShow = false;
      this.currentSelectedMonth = event.month;
      this.currentSelectedYear = event.year;
      console.log("selectedMonth");
      this.getData();
      console.log(event);
    },
    changeVanTabIndex(index) {
      this.getData();
      if (index != 3) this.monthShow = false;
    },
    async getData() {
      this.initData();
      Toast.loading({
        message: "请稍等",
        forbidClick: true
      });
      let formData = {};

      //判断是个人业绩还是团队业绩
      if (this.headerTagIndex == 0) {
        formData.getTeam = "getTeam";
      } else if (this.headerTagIndex == 1) {
        formData.getPersonal = "getPersonal";
      }
      console.log(this.headerTagIndex);
      formData.bonus_type = (this.tag3Index + 1);

      formData.data_type = (this.vanTagIndex + 1);

      if (this.vanTagIndex == 3) {
        formData.month = this.currentSelectedYear + "" + this.currentSelectedMonth;
      }

      let res = await $http.post("plugin.collage.api.team-performance.InformationData", formData);
      Toast.clear();
      console.log(res);
      if (res.result == 1) {
        let resutl;
        if (this.headerTagIndex == 0) {
          resutl = res.data.getTeam;
          this.power = resutl.power;
          if (this.power == 0) {
            this.setHeaderTagIndex(1);
          }
        } else if (this.headerTagIndex == 1) {
          resutl = res.data.getPersonal;
        }

        this.listData = resutl.list.data;
        this.isLoadMore = true;
        this.total_page = resutl.list.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }
      }
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        //判断是个人业绩还是团队业绩
        if (this.headerTagIndex == 0) {
          formData.getTeam = "getTeam";
        } else if (this.headerTagIndex == 1) {
          formData.getPersonal = "getPersonal";
        }
        console.log(this.headerTagIndex);
        formData.bonus_type = (this.tag3Index + 1);

        formData.data_type = (this.vanTagIndex + 1);

        if (this.vanTagIndex == 3) {
          formData.month = this.currentSelectedMonth;
        }
        this.page += 1;
        formData.page = this.page;
        $http
          .post("plugin.collage.api.team-performance.InformationData", formData)
          .then(res => {
            console.log(res);
            this.isLoadMore = true;

            if (res.result === 1) {
              let resutl;
              if (this.headerTagIndex == 0) {
                resutl = res.data.getTeam;
              } else if (this.headerTagIndex == 1) {
                resutl = res.data.getPersonal;
              }
              var nextPageData = resutl.list.data;

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