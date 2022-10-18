// import { mapState } from 'vuex';
import cTitle from "components/title";
import { Toast } from "vant";
// import BScroll from 'better-scroll';

export default {
  data() {
    return {
      position_switch: "",
      show: true,
      status: false,
      sixCity: [],
      hotCity: [],
      citys: [],
      address: "",
      city: "",
      point: ""
    };
  },
  //computed: mapState(['mailInfo']),

  mounted() {
    window.addEventListener("scroll", this.slider);
  },
  created() {
    this.status = this.$route.query.tag == "activity";
  },
  computed: {
    shortcutList() {
      return this.citys.map(group => {
        return String(group.title).substr(0, 1);
      });
    }
  },
  activated() {
    this.status = this.$route.query.tag == "activity";
    if (this.status) {
      this.$route.meta.foot = true;
      this.$emit("changeFoot", this.$route.meta.foot);
    }
    this.getSixCityList();
    this.getCityList();
    this.fun.setWXTitle(this.$store.state.temp.item.janst);
  },
  methods: {
    getSixCityList() {
      let api;
      if (this.$route.query.tag == "hotel") {
        api = "plugin.hotel.frontend.hotel.hotel.get-hot-citys";
      } else if (this.$route.query.tag == "oil") {
        api = "plugin.easy-refuel.frontend.index.getHotCitys";
      } else if (this.$route.query.tag == "activity") {
        api = "plugin.activity-apply.api.index.getHotCitys";
      } else if (this.$route.query.tag == "community") {
        api = "plugin.store-community.frontend.community.getHotCitys";
      } else {
        api = "plugin.store-cashier.frontend.store.store.getHotCitys";
      }
      $http.get(api,{},'加载中').then(
        response => {
          if (response.result === 1) {
            this.sixCity = response.data.citys;
            if (response.data.position_switch) {
              this.position_switch = response.data.position_switch;
            }
          } else {
            console.log(response.msg);
          }
        },
        response => {
          //alert('网络错误，请稍后再试！')
        }
      );
    },
    getCityList() {
      let api;
      if (this.$route.query.tag == "hotel") {
        api = "plugin.hotel.frontend.hotel.hotel.get-city-initials";
      } else if (this.$route.query.tag == "oil") {
        api = "plugin.easy-refuel.frontend.index.getCitys";
      } else if (this.$route.query.tag == "activity") {
        api = "plugin.activity-apply.api.index.getCityInitials";
      } else if (this.$route.query.tag == "community") {
        api = "plugin.store-community.frontend.community.getCityInitials";
      } else {
        api = "plugin.store-cashier.frontend.store.store.getCityInitials";
      }
      $http.get(api).then(
        response => {
          if (response.result === 1) {
            this.citys = response.data.initials;
          } else {
            console.log(response.msg);
          }
        },
        response => {
          //alert('网络错误，请稍后再试！')
        }
      );
    },
    Jump(event, index) {
      let text = event.currentTarget.innerHTML;
      Toast(text);
      let jump = document.querySelectorAll(".d_jump");

      if (typeof jump[index] === "undefined") {
        return;
      }

      // 获取需要滚动的距离
      let total = jump[index].offsetTop;
      // Chrome
      document.body.scrollTop = total;
      // Firefox
      document.documentElement.scrollTop = total;
      // Safari
      window.pageYOffset = total;
    },
    toHot() {
      let text = event.currentTarget.innerHTML;
      Toast(text);
      let jump = document.querySelectorAll(".hot-location");

      // 获取需要滚动的距离
      let total = jump.offsetTop;
      // Chrome
      document.body.scrollTop = total;
      // Firefox
      document.documentElement.scrollTop = total;
      // Safari
      window.pageYOffset = total;
    },
    setCity(areaname) {
      if (!areaname) {
        let point = {
          lat: "",
          lng: ""
        };
        let pos = {
          address: "",
          city: "",
          title: "",
          point: point,
          timestamp: Math.round(new Date() / 1000)
        };
        this.$store.commit("updateLocation", pos);
        this.$store.commit("setLocation", pos);
        localStorage.setItem("myLocation", JSON.stringify(pos));
        console.log(this.$store.state.o2oLocation, this.$store.state.referer);
        if (this.$store.state.referer) {
          window.location.href = this.$store.state.referer;
        } else {
          this.$router.push(this.fun.getUrl("o2oHome", { fromHome: 1 }));
        }
      } else if (this.$route.query.tag) {
        this.city = areaname;
        this.$router.push(
          this.fun.getUrl("o2oCity", {}, { tag: this.$route.query.tag, city: areaname })
        );
      } else {
        this.city = areaname;
        this.$router.push(this.fun.getUrl("o2oCity", {}, { city: areaname }));
      }
    },
    toGeolocation() {
      if (this.$route.query.tag) {
        this.$router.push(this.fun.getUrl("o2oLocation_loc", {}, { tag: this.$route.query.tag }));
      } else {
        this.$router.push(this.fun.getUrl("o2oLocation_loc"));
      }
    },
    goback() {
      this.$router.go(-1);
    },

    tosearch() {
      if (this.$route.query.tag) {
        this.$router.push(
          this.fun.getUrl("o2oLocation_loc", { fromHome: 1 }, { tag: this.$route.query.tag })
        );
      }else {
        this.$router.push(this.fun.getUrl("o2oLocation_loc", { fromHome: 1 }));
      }
    },
    slider() {
      var top = document.documentElement.scrollTop || document.body.scrollTop;
      if (top < 50) {
        this.amout = false;
      } else {
        this.amout = true;
      }
    },
  },

  components: {
    cTitle,
  },

};
