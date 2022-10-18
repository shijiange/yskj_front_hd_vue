import DConnectCustomerService from "@/components/other/common/DConnectCustomerService";
import serviceCard from "./service_card";
import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      address: "",
      lng: "",
      lat: "",
      location: "",
      nearyData: [],
      upgradeCodePage: 1,
      id: "",
      loading: false,
      finished: false
    };
  },
  activated() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    }
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
  watch: {
    $route(to, from) {
      if (to.name === "VerificationProjectList") {
        this.$router.go(0);
      }
    }
  },
  methods: {
    // 获取附近项目数据
    getNearyData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      this.lng = p.lng;
      this.lat = p.lat;
      $http
        .get("plugin.store-projects.frontend.project.get-list", {
          lng: this.lng,
          lat: this.lat,
          page: this.upgradeCodePage,
          category_id: this.id
        }, "loading")
        .then(response => {
          if (response.result === 1) {
            const { data: data, current_page, last_page } = response.data;
            if (data.length === 0 || current_page === last_page) {
              this.finished = true;
            }
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
    // 点击返回
    // btnGoback(){
    //   this.$router.go(-1);
    // },
    // 点击跳转到详情
    btnDetail(id) {
      this.$router.push(this.fun.getUrl("VerificationProjectDetails", { id: id }));
    },
  },
  components: { DConnectCustomerService, serviceCard, cTitle }
};
