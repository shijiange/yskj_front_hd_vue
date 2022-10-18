import DList from "@/components/dlist";
import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      lng: "",
      lat: "",
      address: "",
      point: "",
      location: "",
      value: "",
      projectList: [],
      upgradeCodeLoading: false,
      upgradeCodeFinished: false,
      upgradeCodePage: 1
    };
  },
  activated() {
    // this.ready()
    this.fun
      .getLocation()
      .then(res => {
        this.location = res;
        this.address = res.title;
        this.getNearyData();
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    // 点击搜索
    btnSearch() {
      this.projectList = [];
      this.upgradeCodeLoading = false;
      this.upgradeCodeFinished = false;
      this.upgradeCodePage = 1;
      this.getNearyData();
    },
    getNearyData() {
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      this.lng = p.lng;
      this.lat = p.lat;
      $http
        .get("plugin.store-projects.frontend.project.get-list", {
          lng: this.lng,
          lat: this.lat,
          page: this.upgradeCodePage,
          name: this.value ? this.value : ""
        }, "loading")
        .then(response => {
          if (response.result === 1) {
            const { data: data, current_page, last_page } = response.data;
            if (data.length === 0 || current_page === last_page) {
              this.upgradeCodeFinished = true;
            }
            this.projectList.push(...data);
            this.upgradeCodeLoading = false;
            this.upgradeCodePage++;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    tolocation() {
      this.$store.commit("setReferer", window.location.href);
      this.$router.push(this.fun.getUrl("o2oLocation"));
    },
    // 点击跳转到详情
    btnDetail(id) {
      this.$router.push(this.fun.getUrl("VerificationProjectDetails", { id: id }));
    }
  },
  components: { DList, cTitle }
};
