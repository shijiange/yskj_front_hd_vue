<template>
  <div id="app">
    <div
      id="appMain"
      :class="[fun.getPhoneEnv() == 3 && !fun.isApp() && (!$route.meta.isPC || ($store.state.caseLibrary != null && $store.state.caseLibrary.set.pc_style == 0)) ? 'pcStyle' : '']"
      :style="{
        width: fun.getPhoneEnv() == 3 && !fun.isApp() && (!$route.meta.isPC || ($store.state.caseLibrary != null && $store.state.caseLibrary.set.pc_style == 0)) ? '375px' : '',
        margin: fun.getPhoneEnv() == 3 && !fun.isApp() && (!$route.meta.isPC || ($store.state.caseLibrary != null && $store.state.caseLibrary.set.pc_style == 0)) ? '0 auto' : ''
      }"
    >
      <keep-alive>
        <router-view v-if="!$route.meta.notKeepAlive && isRouterAlive" :key="$route.fullPath" @changeFoot="initFoot"></router-view>
      </keep-alive>
      <router-view v-if="$route.meta.notKeepAlive && isRouterAlive" :key="$route.fullPath"></router-view>
      <loading></loading>
    </div>

    <!-- 返回直播按钮 -->
    <div id="returnLiveBtn" v-if="isShowReturnLiveBtn" @click.stop="gotoLiveRoom">
      <i class="fa fa-angle-left"></i><span class="rlbtext">返回直播<i class="iconfont icon-adsystem_icon_cancle clone_btn_style" @click.stop="clearLiveBtn"></i></span>
    </div>
    <!-- 返回直播按钮end -->

    <!--旧装修的底部导航-->
    <!--<c-foot v-if="!foot && $store.state.temp.item.menustyle && !$store.state.temp.item.menus.page_info"></c-foot>-->
    <!--旧装修的底部导航end-->

    <!--新装修的底部导航-->
    <U_foot
      v-if="!foot && ($store.state.temp.item.is_decorate === 1 || $store.state.temp.item.menus === '' || ($store.state.temp.item.menus && $store.state.temp.item.menus.page_info))"
      :id="id + '1'"
    ></U_foot>
    <!--新装修的底部导航end-->
    <qrCode v-if="fun.getPhoneEnv() == 3 && !fun.isApp() && (!$route.meta.isPC || ($store.state.caseLibrary != null && $store.state.caseLibrary.set.pc_style == 0)) && !fun.isWXWork()"></qrCode>
    <crmBind v-if="isShowCrmBind">
      <!-- 益生 crm账号绑定 -->
    </crmBind>
  </div>
</template>

<script>
// import cFoot from "components/foot";
import U_foot from "components/new_diy/foot";
import loading from "components/loading";
import qrCode from "components/qrCode";
import crmBind from "components/other/crmBind";
// import { mapState, mapMutations } from 'vuex';
import { Toast } from "vant";
//import BMap from 'BMap';

const language = require("../public/static/app/locales/language.json"); //加载本地数据文件

let isCreated = 0;
export default {
  data() {
    return {
      invite: "",
      //记录form请求微信form请求只发送一次
      selected: false,
      foot: true,
      zone: "",
      isLocation: false,
      isRouterAlive: true,

      is_Inviter: "",
      invite_mobile: "",

      id: "M" + new Date().getTime()
    };
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  computed: {
    isShowReturnLiveBtn() {
      return this.$store.state._isShowReturnLiveBtn;
    },
    isShowCrmBind() {
      return this.$store.state._isShowCrmBind;
    }
  },
  watch: {
    //监测路由变化
    $route(to, from) {
      if (from.path === "/") {
        if (this.fun.getKey("t")) {
          this.reload();
        }
      }
      if (this.$yzt("route." + to.name)) {
        //语言包
        this.fun.setWXTitle(this.$yzt("route." + to.name));
      } else if (to.meta.title) {
        this.fun.setWXTitle(to.meta.title);
      }
      this.foot = to.meta.foot;

      // 浏览足迹  页面切换时更新new_page_comeIn
      window.new_page_comeIn = 1;
    }
  },

  mounted() {
    // this.initBalanceLang();
    // this.setPcStyle()
    if (this.fun.getTyep() == 7) this.fun.setWXTitle("刷新中");

    this.$store.commit("onload");
    window.homeFirst = 0;
    let that = this;
    // this.tempInfo();

    /*区分关闭和刷新，关闭清理vid  start*/
    // 搬到index.html执行  因为要优先http.js执行
    // window.onload = function() {
    //   if (!window.sessionStorage["tempFlag"]) {
    //     window.localStorage.removeItem("uid");
    //     window.localStorage.removeItem("mid");
    //
    //     window.localStorage.removeItem("scope");
    //     window.localStorage.removeItem("appid");
    //     window.localStorage.removeItem("mob_parent");
    //     window.localStorage.removeItem("mob_user");
    //     window.localStorage.removeItem("timetamp");
    //     window.localStorage.removeItem("sign");
    //     window.localStorage.removeItem("videoReload");
    //     window.sessionStorage.removeItem("myLocation");
    //   } else {
    //     window.sessionStorage.removeItem("tempFlag");
    //   }
    // };
    window.onunload = function() {
      window.sessionStorage["tempFlag"] = true;
      window.localStorage.removeItem("vid");
      window.localStorage.removeItem("circle_invitation_id");
    };
    window.onbeforeunload = function() {
      window.sessionStorage["tempFlag"] = true;
      that.delCookie("memberlogin_status");
    };
    /*区分关闭和刷新，关闭清理vid end*/
  },
  created() {
    // this.getLanguage();
    if (isCreated === 0) {
      window.localStorage.removeItem("vid");
      // window.localStorage.removeItem("uid");
      window.localStorage.removeItem("mid");
      window.localStorage.removeItem("customizeHotelHead");
      // this.getParams();
      this.initShare();
      // this.getInvite();
      this.getNowPackageDeliver(); //更新自提点关联
    }
  },
  beforeUpdate() {
    if (isCreated === 1) {
      // this.getParams();
      this.initShare();
      // this.getInvite();
    }
  },

  updated() {
    isCreated = 1;
  },

  methods: {
    getLanguage(url) {
      if (!url) {
        url = "/addons/yun_shop/static/locales/" + this.fun.getKeyByI() + "/language.json";
      }
      $http.fetchUrl(url).then(
        response => {
          if (response.data.en) {
            $i18n.mergeLocaleMessage("en", response.data.en);
            $i18n.mergeLocaleMessage("zh", response.data.zh);
          } else {
            $i18n.mergeLocaleMessage("en", language.en);
          }
        },
        response => {
          $i18n.mergeLocaleMessage("en", language.en);
          // this.getLanguage('/addons/yun_shop/static/app/locales/language.json');
        }
      );
    },
    gotoLiveRoom() {
      this.$router.push(this.fun.getUrl("livePage"));
    },
    clearLiveBtn() {
      this.$store.commit("setReturnLiveBtn", false);
    },
    setPcStyle() {
      //pc端浏览器网页或者pc端微信网页 样式
      if (this.fun.getPhoneEnv() == 3 && !this.fun.isApp() && !this.$route.meta.isPC) {
        document.getElementById("appMain").style.width = "375px";
        document.getElementById("appMain").style.margin = "0 auto";
      }
    },
    initFoot(item) {
      this.foot = item;
    },
    getCookie(name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },
    delCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(name);
      if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    //new
    getParams() {
      let _url = document.location.href;

      // 要用post  链接太长
      $http
        .post("home-page.get-params", { url: _url }, " ")
        .then(response => {
          if (response.result === 1) {
            this.initLanguage(response.data.lang);
            this.initBalanceLang(response.data.balance);
            // this.getInvite(response.data.page);
            if (window.homeFirst === 0) {
              this.tempInfo(response.data.home);
            }
            if (response.data.home.memberinfo) {
              window.localStorage.uid = response.data.home.memberinfo.uid;
            }
            localStorage.setItem("globalParameter", JSON.stringify(response.data.globalParameter));
          } else {
            console.log(response.msg);
          }
        })
        .catch(err => {
          console.error(err, "app");
        });
    },
    //初始化语言设置
    initLanguage(data) {
      // let that = this;
      // let json = { i: this.fun.getKeyByI(), type: this.fun.getTyep() };
      // $http.get("setting.get-lang-setting", json).then(response => {
      //   if (response.result == 1) {
      //     console.log("lang-setting", response.data);
      localStorage.setItem("mailLanguage", JSON.stringify(data));
      // let mailLanguage = localStorage.getItem("mailLanguage");
      //   }
      // });
    },
    initBalanceLang(data) {
      // let that = this;
      // let json = { i: this.fun.getKeyByI(), type: this.fun.getTyep() };
      // $http.get("setting.get-balance", json).then(response => {
      //   if (response.result == 1) {
      localStorage.setItem("balanceLang", JSON.stringify(data));
      this.balanceLang = localStorage.getItem("balanceLang");
      //   }
      // });
    },

    tempInfo(data) {
      window.homeFirst = 1;
      var that = this;
      //
      if (!data) return;
      // if (response.result === 1) {
      if (!data.default) {
        for (let j of data.item.data) {
          j.temp = "show" + j.temp;
          if (j.temp == "showlocation" || j.temp == "showstore" || j.temp == "showbusiness") {
            that.isLocation = true;
          }
        }
        // 设置的标题（装修）
        if (data.item.pageinfo) {
          data.item.janst = data.item.pageinfo.params.title;
        }
      } else {
        // 设置的标题（默认）
        data.item.janst = data.mailInfo.name;
      }

      if (that.isLocation) {
        if (window.location.href.indexOf("/home?") > 0) {
          this.fun
            .getLocation()
            .then(res => {
              this.point = res.point;
              this.title = res.title;
              this.city = res.city;
            })
            .catch(err => {
              console.log(err);
            });
        }
      }

      this.$store.commit("tempIndex", data);
      // window.localStorage.setItem('tempIndex', JSON.stringify(data))  存vuex里不存localStorage

      // } else {
      //   console.log(response.msg);

      // }
      // },
      // response => {
      //
      // });
    },
    //是否开启邀请页面
    getInvite() {
      if (this.is_Inviter !== 1 || this.invite_mobile !== 1) {
        $http.get("member.member.isValidatePage").then(res => {
          if (res.result === 1) {
            this.is_Inviter = res.data.is_invite;
            this.invite_mobile = res.data.invite_mobile;
            if (res.data.is_bind_mobile !== 0) {
              this.bindMobile(res.data.is_bind_mobile);
            } else {
              if (res.data.is_login === 1) {
                //登录
                if (res.data.is_invite !== 1) {
                  //没有填写过邀请人
                  if (res.data.invite_page === 1) {
                    //开启了邀请页面
                    if (this.$store.state.is_Inviter) {
                      //不是第一次进入商城  点击了确认邀请人
                    } else {
                      if (window.location.href.indexOf("input_visit") > 0 || window.location.href.indexOf("member/editmobile") > 0) {
                        //是在这两个页面do nothing
                      } else if (window.location.href.indexOf("input_visit") < 0 || window.location.href.indexOf("member/editmobile") < 0) {
                        this.$router.push(this.fun.getUrl("Inviter"));
                      }
                    }
                  }
                } else {
                  //已经填写过邀请人
                  if (res.data.invite_mobile !== 1 && res.data.invite_page === 1) {
                    //没有绑定手机而且开启了邀请页面
                    if (window.location.href.indexOf("input_visit") > 0 || window.location.href.indexOf("member/editmobile") > 0) {
                      console.log("nothing");
                    } else if (window.location.href.indexOf("input_visit") < 0 || window.location.href.indexOf("member/editmobile") < 0) {
                      this.$router.push(this.fun.getUrl("Inviter"));
                    }
                  }
                }
              }
            }
          }
        });
      }
    },

    //查看用户是否需要绑定手机号
    // getIsBingMobile() {
    //   var that = this;
    //   let json = {};
    //   $http.get("home-page.bindMobile", json).then(
    //     function(response) {
    //       if (response.result == 1) {
    //         that.bindMobile(response.data.is_bind_mobile);
    //       }
    //     },
    //     function(response) {
    //       // error callback
    //     }
    //   );
    // },

    //查看用户是否需要绑定手机号
    bindMobile(e) {
      if (e == 1) {
        //跳转绑定手机页面
        //判断是否是app分享扫码进入商城
        if (window.location.href.indexOf("/member/scaneditmobile") >= 0) {
          window.localStorage.setItem("is_force_mobile", 999);
          this.$router.push(this.fun.getUrl("editmobile", { num: "", myparent: this }));
        } else {
          this.$router.push(this.fun.getUrl("editmobile", { num: "", myparent: this }));
        }
      } else if (e == 2) {
        if (window.location.href.indexOf("/member?") > -1 || this.$route.name == "member") {
          this.$router.push(this.fun.getUrl("editmobile", { num: "", myparent: this }));
        } else {
          return;
        }
      } else if (e == 3) {
        if (window.location.href.indexOf("/goods/") > -1 || this.$route.name == "goods") {
          this.$router.push(this.fun.getUrl("editmobile", { num: "", myparent: this }));
        } else {
          return;
        }
      } else if (window.location.href.indexOf("/member/extension?") > -1 || e == 4) {
        if (this.$route.name == "extension") {
          this.$router.push(this.fun.getUrl("editmobile", { num: "", myparent: this }));
        } else {
          return;
        }
      } else {
        return;
      }
    },

    //获取商城信息
    // getMailInfo() {
    //   let that = this;
    //   let json = { i: this.fun.getKeyByI(), type: this.fun.getTyep() };
    //   $http.get("setting.get", json).then(response => {
    //     if (response.result == 1) {
    //       console.log("统计代码：", response.diycode);
    //       this.$store.commit("setMailInfo", response.data);
    //     }
    //   });
    // },

    //获取用户信息
    // getMemberInfo() {
    //   var that = this;
    //   let json = { i: this.fun.getKeyByI(), type: this.fun.getTyep() };
    //   $http.get("member.member.getUserInfo", json, "").then(
    //     function(response) {
    //       if (response.result == 1) {
    //         that.$store.commit("savemodel", response.data);
    //       }
    //     },
    //     function(response) {
    //       // error callback
    //     }
    //   );
    // },

    //初始化分享设置
    initShare() {
      //不是微信端 不访问
      // let token = this.fun.getToken()   不知道有什么用  先注释
      // if (token) {
      //   this.wxLocationGet()
      //   return
      // }

      // if (window.localStorage.type == 5) {
      //   return;
      // }

      if (this.$route.meta.is_single_share) {
        // 加入设置了页面单独设置分享则不进行全局分享设置
        return;
      }
      let _url = document.location.href;
      this.fun.wxShare("", { url: _url }, { share_from: "app" });
    },

    wxLocationGet() {
      let json = {
        longitude: this.fun.getLat(),
        latitude: this.fun.getLng()
      };

      //获取城市信息
      $http
        .get("geocoding.get-address-component", json)
        .then(response => {
          console.log("TAG:", json);
          if (response.result == 1) {
            //通过获取的district获取zoneId
            //this.getZoneId(response.data.district);
            //window.localStorage.setItem("nowZone", response.data.district);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //组装分享设置
    share(data) {
      let that = this;
      data.config.openTagList = ["wx-open-launch-weapp"];
      console.log("打印home组件app分享", data.config);
      wx.config(data.config);
      wx.ready(function() {
        let _title = "";
        //let _link = location.protocol + '//' + location.host + location.pathname + '?i=' + that.fun.getKeyByI() + "&type=" + that.fun.getTyep() + "&mid=" + data.info.uid;
        //let _link = document.location.href + "&mid=" + data.info.uid;

        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);
        // console.log(_link,"link");

        // 分享优先级： 单页设置（例如商品，拓客活动）> 店铺装修页面设置（仅限装修页面或者设置为首页的装修页面）data.share.title > 全局设置data.shop.share.title > 商城名称data.shop.shop.name
        // 全局标题
        _title = data.shop.share && that.fun.isTextEmpty(data.shop.share.title) ? data.shop.shop.name : data.shop.share.title;
        let _imgUrl = that.fun.isTextEmpty(data.shop.share.icon) ? data.shop.icon : data.shop.share.icon;
        let _desc = that.fun.isTextEmpty(data.shop.share.desc) ? data.shop.shop.name : data.shop.share.desc;

        // _title = _title.trim();
        // _imgUrl = _imgUrl.trim();
        // _desc = _desc.trim();
        console.log("qiang," + _title + "," + _imgUrl + "," + _desc);

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
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
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },
    getNowPackageDeliver() {
      let deliverIDStorage = sessionStorage.getItem("deliverId") || null; //获取当前会话是否存储了自提点id
      if (window.location.href.indexOf("deliverId") > -1 && !deliverIDStorage) {
        //添加判断sessionStorage是否已存在的目的是防止在其他页面刷新，关联的自提点又变成了链接上的，导致之前手动切换的失效
        let list = ["/home", "/newDiy", "/selfPickupPoint/category", "/selfPickupPoint/search"];
        for (let i = 0; i < list.length; i++) {
          if (window.location.href.indexOf(list[i]) > -1) {
            return false;
          }
        }
        let _dyID = this.fun.getKey("deliverId"); //获取链接上的参数，自提点id
        $http.get("plugin.package-deliver.frontend.decorate-deliver.getNowPackageDeliver", { deliver_id: _dyID }).then(
          response => {
            if (response.result === 1) {
              window.sessionStorage.setItem("deliverId", response.data.id); //储存到sessionStorage
            } else {
              this.$toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
      }
    }
  },
  components: { U_foot, loading, qrCode, crmBind }
};
</script>
<style lang="scss" rel="stylesheet/scss">
@import "assets/css/font-awesome.min.css";
@import "assets/css/app.scss";
@import "layout";

// @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
//   #app {
//     box-sizing: border-box;
//     padding-bottom: 34px;
//     &:after {
//       content: "";
//       z-index: 9998;
//       position: fixed;
//       left: 0;
//       bottom: 0;
//       width: 100%;
//       height: 34px;
//       background: #fff;
//     }
//   }
// }
// ----- #appMain.pcStyle 用于pc端样式适配
#appMain.pcStyle {
  .mint-header {
    width: 375px;
    margin: 0 auto;
  }

  .mint-popup-4,
  .mint-navbar {
    width: 375px !important;
  }

  .mint-navbar {
    margin: 0 auto;
  }

  .yd-popup {
    width: 375px !important;
    right: 50%;
    margin-right: -187.5px;
  }

  .van-popup {
    width: 375px !important;
    right: 50%;
    margin-right: -187.5px;
  }

  .yd-popup-show,
  .van-popup,
  .yd-navbar,
  .yd-actionsheet {
    width: 375px !important;
  }

  .van-popup--bottom {
    left: 50%;
    transform: translateX(-50%);
  }

  .yd-navbar,
  .yd-actionsheet {
    left: auto;
  }

  .set-pc-styleLeft {
    width: 375px !important;
    left: 50% !important;
    transform: translateX(-50%);
    // margin-left: -187.5px;
  }

  .set-pc-style {
    width: 375px !important;
    left: auto !important;
  }
}

.g-fix-ios-prevent-scroll {
  position: static;
}

.el-cascader-menus .el-cascader-menu {
  // 供应商选择分类
  min-width: 115px;

  .el-cascader-menu__item {
    width: 115px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.mint-indicator-wrapper {
  z-index: 2000;
}

#returnLiveBtn {
  position: fixed;
  bottom: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 9;
  width: 4.5rem;
  height: 3rem;
  line-height: 3rem;
  background: #04be02;
  color: #fff;
  border-top-right-radius: 2rem;
  border-bottom-right-radius: 2rem;
  z-index: 999;

  i {
    font-size: 1rem;
  }

  .rlbtext {
    width: 2rem;
    line-height: 1rem;
    display: inline-block;
    margin: 0 0.5rem 0 0.25rem;
    font-size: 0.875rem;
    position: relative;

    .clone_btn_style {
      font-size: 1rem;
      padding: 0.5rem;
      color: #333;
      position: absolute;
      top: -1rem;
      right: -2.875rem;
    }
  }
}

#aggregate {
  .add_photo {
    overflow: hidden;

    input {
      height: 5rem !important;
      margin: 0;
    }
  }
}

// loading大小
img[lazy="loading"] {
  width: 40px !important;
  height: 40px !important;
  display: flex;
  justify-content: center;
  margin: 20% auto;
}
</style>
