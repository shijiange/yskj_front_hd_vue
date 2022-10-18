// import { Toast } from 'vant';
import caseMobile from "./mycomponents/case_mobile";
import serviceTemplate from "./mycomponents/service";
import { scrollMixin } from "../../../../utils/mixin";
import cFoot from "components/foot";
import U_foot from "components/new_diy/foot";
import emptyImage from "../../../../assets/images/new_diy/image.png";


export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      emptyImage,
      view_show: false,
      banner: [],
      newCase: [],
      special: [],
      advert: {
        ad1: [],
        ad2: []
      },
      ad1: {},
      ad2: {},
      hotCategory: [],
      category_index: -1,
      hotCasesList: [],
      show1: false,
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  mounted() {
    // this.getDatas()
  },
  activated() {
    this.getDatas();
    console.log(this.$store.state.temp.item);
  },
  methods: {
    getDatas() {
      let that = this;
      $http.post("plugin.case-library.api.mobile.home.index", {}, "").then(
        response => {
          if (response.result === 1) {
            that.view_show = true;
            that.banner = response.data.banner;
            that.newCase = response.data.newCase;
            that.special = response.data.special;
            that.hotCategory = response.data.hotCategory;
            that.advert = response.data.advert;
            that.ad1 = that.advert.ad1.length && that.advert.ad1.length == 0 ? "" : that.advert.ad1;
            that.ad2 = that.advert.ad2.length && that.advert.ad2.length == 0 ? "" : that.advert.ad2;
            that.hotCasesList = response.data.hotCases.data;
            that.total_page = response.data.hotCases.last_page;
            if (that.hotCategory.length >= 1) {
              that.category_index = that.hotCategory[0].id;
            }
          } else {
            that.$dialog.alert({ message: response.msg });

          }
        },
        function(response) {
          that.$dialog.alert({ message: response.msg });

        }
      );
    },
    changeCategory(id) {
      this.category_index = id;
      this.isLoadMore = true;
      this.getList(id);
    },
    getList(id) {
      let that = this;
      $http.post("plugin.case-library.api.mobile.home.home-cut-category", { cid: id }, "").then(
        response => {
          if (response.result === 1) {
            that.hotCasesList = [];
            that.hotCasesList = response.data.hotCases.data;
            that.total_page = response.data.hotCases.last_page;
            that.page = response.data.hotCases.current_page;
            this.isLoadMore = true;
            if (that.hotCasesList.length <= 0) {
              that.isLoadMore = false;
            }
          } else {
            that.$dialog.alert({ message: response.msg });

          }
        },
        function(response) {
          that.$dialog.alert({ message: response.msg });

        }
      );
    },

    getMoreData() {
      console.log("加载更多启动");
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        let json = {
          cid: that.category_index,
          page: that.page
        };
        $http
          .post("plugin.case-library.api.mobile.home.home-cut-category", json, "")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.hotCases.data;
              that.hotCasesList = that.hotCasesList.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    gotoCaseDetail(id) {
      this.$router.push(this.fun.getUrl("caseLibraryDetail", { id: id }));
    },
    gotoSpecial(id) {
      this.$router.push(this.fun.getUrl("caseLibrarySubjectDetail", { id: id }));
    },

    gotoOther(type) {
      let name = "";
      if (type == "new") {
        name = "caseLibraryNewMobile";
      } else if (type == "category") {
        name = "caseLibraryCategory";
      } else if (type == "ranking") {
        name = "caseLibraryRankingMobile";
      } else if (type == "area") {
        name = "caseLibraryAreaMobile";
      } else if (type == "subjectList") {
        name = "caseLibrarySubjectList";
      }
      this.$router.push(this.fun.getUrl(name, {}));
    },
    closeWin() {
      this.show1 = false;
    },
    openWin() {
      this.show1 = true;
    }
  },
  components: { caseMobile, serviceTemplate, cFoot, U_foot }
};
