import cTitle from "components/title";
import { Toast } from "vant";
import yz_bindMobile from "components/ui_components/yz_bindMobile";
export default {
  data() {
    return {
      info: [],
      active: 0,
      datas: [],
      topImg: "",
      buttonArr: [],
      shareImg: [],
      show: false,
      show1: false
    };
  },
  activated() {
    this.getdata();
  },
  mouted() {},
  methods: {
    init() {
      this.topImg = "";
      this.shareImg = "";
    },
    imgPreview(data) {
      ImagePreview(data);
    },
    toLink(url, datas) {
      console.log(datas);

      // if(this.fun.isCPS()){
      //   // cps下的外卖领取跳小程序，其他按原来跳转
      //   if(datas.another_id == '101'){
      //     let json = {mini_route: datas.mini_path, mini_id: datas.mini_app_id};
      //     if(this.fun.isIosOrAndroid() === 'ios') {
      //       miniWXIOS({body:'miniWXIOS', json: JSON.stringify(json)});
      //     }else{
      //       miniWXAndroid(JSON.stringify(json));
      //     }
      //   }else{
      //     window.location.href = url;
      //   }
      // }else{
      // h5端直接跳转
      window.location.href = url;
      // }
    },
    getShare() {
      let url = "";
      if (this.$route.params.child) {
        url = "plugin.cps-sub-platform.frontend.plat-activity.getPlatPoster";
      } else {
        url = "plugin.aggregation-cps.api.plat-activity.getPlatPoster";
      }
      $http
        .get(url, { activity_id: this.info[this.active].activity_id, poster_type: 1 }, "")
        .then(
          response => {
            if (response.result == 1) {
              console.log(response);
              this.shareImg = response.data.url;
              this.show = true;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.error(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    goPageYx(ind, kindex) {
      let info = this.info;
      this.getPage(kindex);
      for (let i = 0; i < info.length; i++) {
        if (info[i].another_id == ind) {
          this.$refs.tabsNav.scrollTo(i);
        }
      }
    },
    goPage(ind) {
      let info = this.info;
      for (let i = 0; i < info.length; i++) {
        if (info[i].another_id == ind) {
          this.getPage(info[i].activity_id);
          this.$refs.tabsNav.scrollTo(i);
        }
      }
    },
    actChange(e) {
      this.init();
      this.getPage(this.info[e].activity_id);
    },
    getdata() {
      let that = this;
      let url = "";
      if (this.$route.params.child) {
        url = "plugin.cps-sub-platform.frontend.plat-activity.getPlatList";
      } else {
        url = "plugin.aggregation-cps.api.plat-activity.getPlatList";
      }
      $http
        .get(url, {}, "")
        .then(
          response => {
            if (response.result == 1) {
              that.info = response.data;
              // let ind = response.data[that.active].activity_id;
              if (this.$route.params.tab) {
                for (let i = 0; i < that.info.length; i++) {
                  if (that.$route.params.tab == that.info[i].activity_id) {
                    that.goPageYx(that.info[i].another_id, this.$route.params.tab);
                  }
                }
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.error(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    getPage(type) {
      let that = this;
      let url = "";
      if (this.$route.params.child) {
        url = "plugin.cps-sub-platform.frontend.plat-activity.getPlatDetail";
      } else {
        url = "plugin.aggregation-cps.api.plat-activity.getPlatDetail";
      }
      $http
        .get(url, { activity_id: type }, "")
        .then(
          response => {
            if (response.result == 1) {
              that.datas = response.data;
              let arr = [];
              for (let i in that.datas.page_setting.tab_image) {
                if (i == response.data.another_id) {
                  // banner图
                  this.topImg = `https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/cps/${that.datas.page_setting.tab_image[i]}`;
                }
                arr.push(i);
              }
              that.buttonArr = arr;
            } else {
              if (response.data.bind_mobile) {
                that.show1 = true;
                that.$nextTick(() => {
                  that.$refs.yz_bindMobile.initShow();
                });
              } else {
                Toast(response.msg);
              }
            }
          },
          response => {
            console.error(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: {
    cTitle,
    yz_bindMobile
  }
};
