// import { Toast } from 'vant';
import headTemplate from "./components/mycomponents/head";
import serviceTemplate from "./components/mycomponents/service";
import { scrollMixin } from "../../../utils/mixin";
import emptyImage from "../../../assets/images/new_diy/image.png";

export default {
  mixins: [scrollMixin], //加载更多

  data() {
    return {
      emptyImage,
      showPC: false,
      list: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  mounted() {
  },
  activated() {
    let self = this;
    self.showPC = false;
    window.scrollTo(0, 0);
    if (document.getElementById("tinymceJs")) {
      self.showPC = true;
    }
    self.initData();
    self.getList();
  },
  methods: {
    initData() {
      this.list = [];
      this.page = 1;
      this.isLoadMore = true; //判断是否要加载更多的标志
      this.total_page = 0; //总页数
    },
    getList() {
      let that = this;
      $http.post("plugin.case-library.api.mobile.home.case-rank", {}, "").then(
        response => {
          if (response.result === 1) {
            that.list = [];
            that.list = response.data.case.data;
            that.total_page = response.data.case.last_page;
            that.page = response.data.case.current_page;
            this.isLoadMore = true;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          that.$dialog.alert({ message: response.msg });

        }
      );
    },
    gotoDetail(id) {
      this.$router.push(this.fun.getUrl("caseLibraryDetail", { id: id }));
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
          page: that.page
        };
        $http
          .post("plugin.case-library.api.mobile.home.case-rank", json, "")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.case.data;
              that.list = that.list.concat(nextPageData); //进行数组拼接
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
    }

  },
  computed: {},
  components: {
    headTemplate,
    serviceTemplate
  }
};
