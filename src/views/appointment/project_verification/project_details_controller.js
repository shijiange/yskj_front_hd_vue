import DConnectCustomerService from "@/components/other/common/DConnectCustomerService";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import serviceCard from "./service_card";
import cTitle from "components/title";
import { Toast } from "vant";
export default {
  data() {
    return {
      project: [],
      store: [],
      goods: [],
      address: "",
      lng: "",
      lat: "",
      location: "",
      point: "",
      city_name: "",
      id: "",
      isShow: false,
      projectName: "项目",
      projectList: [],
      showWechatshar:false
    };
  },
  activated() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    }
    this.projectName = this.fun.getCustomTextLang("store_projects.project", "项目");
    this.fun
      .getLocation()
      .then(res => {
        this.location = res;
        this.address = res.title;
        this.getDetailData();
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    // 获取详情数据
    getDetailData() {
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      this.lng = p.lng;
      this.lat = p.lat;
      $http
        .get("plugin.store-projects.frontend.project.get-detail", {
          lng: this.lng,
          lat: this.lat,
          project_id: this.id
        },'loading')
        .then(response => {
          if (response.result === 1) {
            this.project = response.data.project;
            this.store = response.data.store;
            this.goods = response.data.goods;
            this.projectList = [];
            this.project.banner_imgs.forEach(item => {
              this.projectList.push(item);
            });
            if (this.store.length > 4) {
              this.isShow = true;
            } else {
              this.isShow = false;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击分享
    share(){
      this.showWechatshar = true;
    },
    // 点击跳转更多商户
    btnMoreStore() {
      this.$router.push(this.fun.getUrl("MoreStores", { id: 0 , project_id : this.id }));
    },
    // 点击跳转到商户主页
    btnStore(item){
      // 加store_type字段 1-门店 2-酒店
      if(item.store_type == 2) {
        this.$router.push(this.fun.getUrl("HotelHome", { id: item.id }));
      }else {
        this.$router.push(this.fun.getUrl("HomeSeller", { store_id: item.id }));
      }
    },
    // 点击跳转商品详情
    btnGoodsDeatil(id){
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    }
  },
  components: { DConnectCustomerService ,yzWechatShareImg , serviceCard , cTitle}
};
