import DConnectCustomerService from "@/components/other/common/DConnectCustomerService";
import nearbyProjectCard from "./nearby_project_card";
import serviceCard from "./service_card";
import cTitle from "components/title";
import cMent from "components/ment";
import { Toast } from "vant";
export default {
  data() {
    return {
      projectName: "",
      address: "",
      lng: "",
      lat: "",
      point: "",
      location: "",
      searchVal: "",
      // 获取幻灯片数据
      carousels: [],
      // 项目分类数据
      project_category_list: [],
      // 获取推荐项目数据
      projects: [],
      // 附近项目数据
      nearyData: [],
      upgradeCodePage: 1,
      upgradeCodeTotalPage: 1,
      // 下拉加载
      loading: false,
      finished: false,

      locationShow: "",
    };
  },
  activated() {
    this.projectName = this.fun.getCustomTextLang("store_projects.project", "项目");
    if (this.locationShow === 1) {
      this.$router.go(0);
    }
    this.fun
      .getLocation()
      .then(res => {
        this.location = res;
        this.address = res.title;
        this.getHomeData();
        this.getNearyData();
      })
      .catch(err => {
        console.log(err);
        this.locationShow = 1;
      });
  },
  methods: {
    initData() {
      this.upgradeCodePage = 1;
      this.upgradeCodeTotalPage = 1;
      this.loading = false;
      this.finished = false;
      this.nearyData = [];
    },
    // 获取首页数据
    getHomeData() {
      if (!this.location) {
        return;
      }
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      this.lng = p.lng;
      this.lat = p.lat;
      $http
        .get(
          "plugin.store-projects.frontend.index.get-data",
          {
            lng: this.lng,
            lat: this.lat
          },
          "load"
        )
        .then(response => {
          if (response.result === 1) {
            this.carousels = response.data.carousels;
            this.project_category_list = response.data.project_category_list;
            this.projects = response.data.projects;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取附近项目数据
    getNearyData() {
      if (!this.location || this.loading || this.upgradeCodePage > this.upgradeCodeTotalPage) {
        return;
      }
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      this.lng = p.lng;
      this.lat = p.lat;
      this.loading = true;
      $http
        .get(
          "plugin.store-projects.frontend.project.get-list",
          {
            lng: this.lng,
            lat: this.lat,
            page: this.upgradeCodePage,
            name: this.searchVal
          },
          "load"
        )
        .then(response => {
          if (response.result === 1) {
            const { data: data, current_page, last_page } = response.data;
            if (data.length === 0 || current_page === last_page) {
              this.finished = true;
            }
            this.upgradeCodeTotalPage = last_page;
            this.loading = false;
            this.nearyData.push(...data);
            this.upgradeCodePage++;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转到分类
    btnCategory(id) {
      this.$router.push(this.fun.getUrl("CategoryProjectList", { id: id }));
    },
    // 点击跳转到详情
    btnDetail(id) {
      this.$router.push(this.fun.getUrl("VerificationProjectDetails", { id: id }));
    },
    // 点击跳转搜索
    btnSearch() {
      this.$router.push(this.fun.getUrl("SearchProject"));
    },
    tolocation() {
      this.$store.commit("setReferer", window.location.href);
      this.$router.push(this.fun.getUrl("o2oLocation"));
    }
  },
  components: { DConnectCustomerService, nearbyProjectCard, serviceCard, cTitle, cMent }
};
