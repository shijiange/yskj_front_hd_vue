// import { Toast } from 'vant';
import caseMobile from "./components/mycomponents/case_mobile";
import headTemplate from "./components/mycomponents/head";
import serviceTemplate from "./components/mycomponents/service";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      showPC: false,
      show: false,
      page_type: "",
      get_url: "",
      order_by: "new",
      province_list: [],
      city_list: [],
      title_word: "最新案例",
      list: [],
      province_id: "",
      city_id: "",
      province_text: "",
      area_text: "",
      city_text: "",
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
    this.province_list = district;

    self.initData();
    console.log(district);
  },
  methods: {
    initData() {
      console.log("123232332");
      let that = this;
      this.page_type = this.$route.name;
      this.show = false;
      this.city_list = [];
      this.order_by = "new";
      this.title_word = "最新案例";
      this.list = [];
      this.province_id = "";
      this.city_id = "";
      this.province_text = "";
      this.city_text = "";
      this.page = 1;
      this.isLoadMore = true; //判断是否要加载更多的标志
      this.total_page = 0; //总页数
      // 区域列表
      if (this.page_type == "caseLibraryAreaMobile") {
        that.get_url = "plugin.case-library.api.mobile.home.region-case";
        that.getList("area", "area");
      }
      // 最新、热门列表
      else {
        that.get_url = "plugin.case-library.api.mobile.home.new-case-list";
        that.getList("new", that.order_by);
      }
    },
    getList(page_type, order_by) {
      let that = this;
      if (order_by) {
        that.order_by = order_by;
        if (that.order_by == "new") {
          that.title_word = "最新案例";
        } else if (that.order_by == "hot") {
          that.title_word = "热门案例";
        } else if (that.order_by == "area") {
          that.title_word = "区域案例";
        }
      }
      let json = {};
      if (page_type == "new") {
        json = {
          order_by: that.order_by
        };
      } else if (page_type == "area") {
        that.title_word = "区域案例";
        json = {
          province_id: that.province_id || "",
          city_id: that.city_id || ""
        };
      }
      $http.post(that.get_url, json, "").then(
        response => {
          if (response.result === 1) {
            that.list = [];
            that.list = response.data.case.data;
            that.total_page = response.data.case.last_page;
            that.page = response.data.case.current_page;
            that.isLoadMore = true;
            if (that.list.length == 0) {
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
    openArea() {
      this.show = true;
    },
    changePro(item) {
      console.log(item);
      this.city_list = item.c;
      this.province_id = item.v;
      this.province_text = item.n;
      this.city_id = "";
    },
    changeCity(item) {
      console.log(item);
      this.city_id = item.v;
      this.city_text = item.n;
      this.area_text = this.province_text + "  " + this.city_text;
      this.getList("area", "area");
      this.show = false;
    },
    getMoreData() {
      console.log("加载更多启动");
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        let json = {};
        if (that.page_type == "caseLibraryAreaMobile") {
          json = {
            province_id: that.province_id,
            city_id: that.city_id,
            page: that.page
          };
        } else {
          json = {
            order_by: that.order_by,
            page: that.page
          };
        }

        $http
          .post(that.get_url, json, "")
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
    caseMobile,
    headTemplate,
    serviceTemplate
  }
};
