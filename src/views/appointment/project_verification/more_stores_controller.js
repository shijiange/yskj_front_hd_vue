import { Toast } from "vant";
import cTitle from "components/title";

export default {
  data() {
    return {
      id: "",
      project_id:"",
      lng: "",
      lat: "",
      point: "",
      location: "",
      project: [],
      upgradeCodePage: 1,
      storeList: [],
      mailLanguage: "",
      projectName: "",
      name: "",
      loading: false,
      finished: false
    };
  },
  activated() {
    // if (this.$route.params.id && this.$route.params.project_id) {
    this.id = this.$route.params.id;
    this.project_id = this.$route.params.project_id;
    // }
    this.name = this.$route.params.name;
    this.mailLanguage = localStorage.getItem("mailLanguage");
    this.projectName = this.projectName = this.mailLanguage && JSON.parse(this.mailLanguage).store_projects ? JSON.parse(this.mailLanguage).store_projects.project : "项目";
    this.fun.getLocation()
      .then(res => {
        this.location = res;
        this.address = res.title;
        // this.initData();
        this.getDetailData();
        this.getStoreList();
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    initData() {
      this.loading = false;
      this.finished = false;
      this.upgradeCodePage = 1;
    },
    // 获取详情数据
    getDetailData() {
      if (!this.location) {
        return;
      }
      this.project = [];
      let url = "";
      let json = {};
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      this.lng = p.lng;
      this.lat = p.lat;
      if (this.name) {
        url = "plugin.store-projects.frontend.project-order.get-detail";
        json.id = this.id;
      } else {
        url = "plugin.store-projects.frontend.project.get-detail";
        json.lng = this.lng;
        json.lat = this.lat;
        json.project_id = this.project_id;
      }
      $http
        .get(url, json)
        .then(response => {
          if (response.result === 1) {
            this.project = response.data.project ? response.data.project : response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取商户列表
    getStoreList() {
      if (!this.location ) {
        return;
      }
      this.loading = true;
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      this.lng = p.lng;
      this.lat = p.lat;
      $http.get("plugin.store-projects.frontend.store.get-list-by-project-id", {
        lng: this.lng,
        lat: this.lat,
        project_id: this.project_id,
        page: this.upgradeCodePage
      })
        .then(response => {
          if (response.result === 1) {
            const { data: data, current_page, last_page } = response.data;
            if (data.length === 0 || current_page === last_page) {
              this.finished = true;
            }
            this.loading = false;
            this.storeList.push(...data);
            this.upgradeCodePage++;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击跳转到商户主页
    btnStore(item) {
      // 加store_type字段 1-门店 2-酒店
      if(item.store_type == 2) {
        this.$router.push(this.fun.getUrl("HotelHome", { id: item.id }));
      }else {
        this.$router.push(this.fun.getUrl("HomeSeller", { store_id: item.id }));
      }
    },
    //跳转核销使用
    btnUsere(data) {
      this.$router.push(this.fun.getUrl("WriteOff", { item: data }));
    }
  },
  components: { cTitle }
};
