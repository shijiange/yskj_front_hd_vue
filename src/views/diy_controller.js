// import { mapState } from "vuex";
import cTitle from "components/title";
import cMent from "components/ment";
import cGoodsList from "components/goodsList";
import { Toast } from 'vant';
import banner from "components/temp/banner";
import showbanner from "components/temp/banner";
import showmenu from "components/temp/menu";
import showtitle from "components/temp/title";
import showsearch from "components/temp/search";
import showline from "components/temp/line";
import showblank from "components/temp/blank";
import showrichtext from "components/temp/richtext";
import showpicture from "components/temp/picture";
import showcube from "components/temp/cube";
import showarea from "components/temp/area";
import showshop from "components/temp/shop";
import showgoods from "components/temp/goods";
import shownearbygoods from "components/temp/near_goods";
import shownotice from "components/temp/notice";
import showlocation from "components/temp/location";
import showstore from "components/temp/stores";
import showbusiness from "components/temp/business";
import showvideo from "components/temp/video";
import showdiyform from "components/temp/form";
import cMyswipe from "components/myswipe";
import { Swipe, SwipeItem } from "components/meswipe";
import showsign from "components/temp/showsign";
import showcoupon from "components/cupcon";
import showarticle from "components/article";
import showheadline from "components/topline";
import showflashsale from "components/time_limit";
import showassemble from "components/time_group";
import showlivestreaming from "components/temp/livestreaming";
import showtogetherpurchase from "components/temp/group_buy";

export default {
  data() {
    return {
      amout: false,
      index2: 1,
      category: [],
      goodsListData: [],
      ads: [],
      banner: banner,
      bannername: "banner",
      bannerData: [],
      other: "",
      content: "",
      show: true,
      oftemp: false,
      dftempData: false,
      follow: false,
      isfollow: false,
      pageinfo: "",
      page_id: 0,
      showDiy: [],
      temp: { item: { janst: "" } },
      sliderNav: {},
      shareInfo: {}, //分享信息
      isLocation: false,
      isInHome: 0,
    };
  },

  mounted() {
    // window.scrollTo(0, 0);
    window.diyHomeScrollTop = 0;
    window.addEventListener("scroll", this.slider);
    // this.fun.setWXTitle("");
    // this.temp = { item: { janst: "" } };
    // this.getTemp();
    // this.getShareData(); //获取装修分享数据
  },
  created() {
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'goods') {
      // 不是进入商品也就要重新请求接口 任务编号: 49212
      window.page_id = 0;
    }
    window.diyHomeScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  deactivated() {
    // window.removeEventListener("scroll", this.slider);
  },
  activated() {
    // 先初始化页面标题
    // this.temp = { item: { janst: "" } };
    // this.sliderNav = {};

    // 是否从别的装修页面或者首页装修过来

    if (window.page_id != this.fun.getKey("page_id") || window.isInHome || !this.temp.system) {
      this.isInHome = 1;
      // window.isInHome = 0; 是否首页或者别的装修页面过来的
      this.fun.setWXTitle("");
      this.getTemp();
    } else {
      let title = window.localStorage.getItem("diypage_title");
      this.fun.setWXTitle(title);
      if (window.location.href.indexOf("#/diy?") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.diyHomeScrollTop);
        }, 200);
      }
    }
    window.page_id = this.fun.getKey("page_id");
    // this.getShareData(); //获取装修分享数据
    window.isInDiy = 1; // 判断是否进入了装修页
  },
  beforeUpdate() { },
  methods: {
    //获取装修信息
    getTemp() {
      // let page_id = this.fun.isTextEmpty(this.fun.getKey("page_id"))? this.$route.params.page_id: this.fun.getKey("page_id");
      // console.log("page_id=====", page_id);
      $http
        .get("home-page.index", { page_id: this.fun.getKey("page_id") })
        .then(
          response => {
            if (!response) return;
            if (response.result === 1) {
              // this.initShare(); //初始化分享设置

              if (!response.data.default) {
                for (let j of response.data.item.data) {
                  j.temp = "show" + j.temp;
                  if (
                    j.temp == "showlocation" ||
                    j.temp == "showstore" ||
                    j.temp == "showbusiness"
                  ) {
                    this.isLocation = true;
                  }
                }

                if (this.isLocation) {
                  this.getLocation();
                }
                // 设置的标题（装修）
                response.data.item.janst =
                  response.data.item.pageinfo.params.title;

                this.temp.item.janst = response.data.item.pageinfo.params.title;

                this.sliderNav = response.data.item.topmenu;
              } else {
                // 设置的标题（默认）
                response.data.item.janst = response.data.mailInfo.name;
                this.temp.item.janst = response.data.mailInfo.name;

                this.sliderNav = response.data.item.topmenu;
              }
              this.temp = response.data;
              if (response.data.memberDesigner) {
                this.getShareData(response.data.memberDesigner);
              }
              window.isInHome = 0;
              this.isInHome = 0;
              // this.$store.commit("tempIndex", response.data);
              this.$store.commit("setWatchDiypage", response.data.item.pageinfo.params.allowauth);
              response.data.item.janst
                ? this.fun.setWXTitle(response.data.item.janst)
                : this.fun.setWXTitle("");
              this.temp.item.janst
                ? this.fun.setWXTitle(response.data.item.janst)
                : this.fun.setWXTitle("");
              // 标题存到缓存，页面切换没有请求接口时，用缓存里的标题
              window.localStorage.setItem("diypage_title", this.temp.item.janst ? this.temp.item.janst : '_');
              if (window.location.href.indexOf("#/diy?") > -1) {
                setTimeout(() => {
                  window.scrollTo(0, window.diyHomeScrollTop);
                }, 200);
              }

            } else {
              window.isInHome = 1;
              console.log(response.msg);
            }
          },
          response => {
            console.log(response);
          }
        );
    },
    getLocation() {
      var that = this;
      var myLocation = this.$store.state.o2oLocation;

      if (!myLocation.point) {
        var mapObj = new AMap.Map("iCenter");
        mapObj.plugin("AMap.Geolocation", function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", onComplete); // 返回定位信息
          AMap.event.addListener(geolocation, "error", onError); // 返回定位出错信息
        });

        function onComplete(obj) {
          console.log("objjjjj", obj);
          // var res =
          //   "经纬度：" +
          //   obj.position +
          //   "\n精度范围：" +
          //   obj.accuracy +
          //   "米\n定位结果的来源：" +
          //   obj.location_type +
          //   "\n状态信息：" +
          //   obj.info +
          //   "\n地址：" +
          //   obj.formattedAddress +
          //   "\n地址信息：" +
          //   JSON.stringify(obj.addressComponent, null, 4);
          //alert(JSON.stringify(obj.addressComponent, null, 4));
          var position = obj.position.toString().split(",");
          that.point = {
            lat: position[1],
            lng: position[0]
          };
          that.address = obj.formattedAddress;
          that.title = obj.formattedAddress;
          that.city = !that.fun.isTextEmpty(obj.addressComponent.city)
            ? obj.addressComponent.city
            : obj.addressComponent.province;

          var pos = {
            address: obj.formattedAddress,
            city: that.city,
            title: obj.formattedAddress,
            point: that.point
          };
          console.log("test pos", pos);
          that.$store.commit("updateLocation", pos);
          that.$store.commit("setLocation", pos);
        }

        function onError(obj) {
          Toast("定位失败,请手动切换位置");
        }
      }
    },
    //获取装修分享数据
    getShareData(data) {
      // let page_id = this.fun.isTextEmpty(this.fun.getKey("page_id"))
      //   ? this.$route.params.page_id
      //   : this.fun.getKey("page_id");
      // $http.get("member.member.designer", { id: page_id }).then(
      //   response => {
      //     if (response.result === 1) {
      //console.log("装修分享的数据", response.data);
      this.shareInfo = data;
      // this.initShare(); //初始化分享设置
      this.fun.wxShare(
        "",
        { mid: this.fun.getKeyByMid(), page_id: this.fun.getKey("page_id") },
        {
          title: this.shareInfo.title?this.shareInfo.title:'',
          imgUrl: this.shareInfo.img?this.shareInfo.img:'',
          description: this.shareInfo.desc?this.shareInfo.desc:''
        }
      );
      //     } else {
      //       console.log(response.msg);
      //     }
      //   },
      //   response => {}
      // );
    },

    //初始化分享设置
    initShare() {
      // let page_id = this.fun.isTextEmpty(this.fun.getKey("page_id"))? this.$route.params.page_id: this.fun.getKey("page_id");
      // console.log("page_id=====", page_id);
      let that = this;
      // console.log(document.location.href);
      let _url = document.location.href;
      let json = {
        url: _url,
        mid: this.fun.getKeyByMid(),
        page_id: this.fun.getKey("page_id")
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function (response) {
          // console.log(response)
          if (response.result == 1) {
            //console.log("装修分享wxJsSdkConfig",response.data);
            if (response.data.config) {
              that.share(response.data);
            }
          } //else {
          //}
        },
        function (response) {
          console.log("报错", response);
        }
      );
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        let _title = that.shareInfo.title;

        let _link = document.location.href + "&share_tag=2";
        //that.fun.getKeyByMid()
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.shareInfo.img;
        let _desc = that.shareInfo.desc;

        wx.showOptionMenu();

        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
      });
    },

    tosearch() {
      this.$router.push(this.fun.getUrl("search", { fromHome: 1 }));
    },
    slider() {
      var top = document.documentElement.scrollTop || document.body.scrollTop;
      top < 50 ? (this.amout = false) : (this.amout = true);
    },

    gotoAdvs(link) {
      if (!this.fun.isTextEmpty(link)) {
        window.location.href = link; //跳转
      }
    }
  },
  watch: {
    $route(to, from) {
      //刷新参数放到这里里面去触发就可以刷新相同界面了
      // this.getTemp();
    }
  },

  components: {
    cTitle,
    cMent,
    cGoodsList,
    banner,
    showbanner,
    showsign,
    showmenu,
    showtitle,
    showsearch,
    showline,
    showblank,
    showrichtext,
    showpicture,
    showcube,
    showarea,
    showshop,
    showgoods,
    shownearbygoods,
    shownotice,
    showlocation,
    showstore,
    cMyswipe,
    Swipe,
    SwipeItem,
    showcoupon,
    showarticle,
    showheadline,
    showflashsale,
    showbusiness,
    showassemble,
    showvideo,
    showdiyform,
    showlivestreaming,
    showtogetherpurchase
  },
};
