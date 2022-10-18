/**
 *
 * 调用示例：
 * let formData = new FormData()
 *formData.append("id",1060)
 *
 *$http.post(url,formData,headers).then((json) => {
 * //处理 请求success
 *  	if(json.code === 0 ){
 *          //我们假设业务定义code为0时，数据正常
 *      }else{
 *           //处理自定义异常
 *          console.log(json.msg);
 *      }
 * },(json)=>{
 *   //处理请求fail
 *
 * })
 */
import Fun from "./index";
import base64_encode from "../utils/base64_encode";
import { Toast } from "vant";
// var heads = { 'Content-Type': 'application/json' };
// import store from "../store/index";
import storeOption from "../store";
const language = require("../utils/language.json"); //加载本地数据文件

axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
window.yzFirstlogin = 1; //判断是否第一个请求的接口  带上basic_info的数据
window.firstLogin = 0; //判断是否已经跳转了登录
window.yzValidate_page = 0; //判断是否需要跳转邀请页面  带上validate_page的数据

window.TencentGDT = window.TencentGDT || []; //优量汇广告
window.GDTArr = []; //存储广告

//以下是不需要登录的页面
// "#/diyform/", 自定义表单页注释删除原因：没登录获取不到会员id提交不了表单[44944]
const passList = ["#/login?", "#/register?", "#/findpwd?", "#/category?", "#/user_agreement?", "#/member/editmobile/", "#/registerAgreement?"];

// 创建一个 store 对象用于管理应用状态
const store = new Vuex.Store(storeOption);

function isPassUrl() {
  for (let i = 0; i < passList.length; i++) {
    // 编程式
    if (window.location.href.indexOf(passList[i]) > -1) {
      return true;
    }
  }

  return false;
}

function jumpH5() {
  // 跳转PC端路由
  const PCNotrouter = [
    { h5: "/member", pc: "/order" },
    { h5: "/member/orderList/0", pc: "/order" },
    { h5: "/member/orderdetail/", pc: "/order" },
    { h5: "/knowledge/knowledge_list", pc: "/knowledge/knowledge_detail/-1" }
  ];

  const PCrouter = [
    "/login",
    "/register",
    "/findpwd",
    "/home",
    "/category",
    "/category_child/",
    "/search",
    "/goods/",
    "/cart",
    "/goodsorder",
    "/supplier_shop2/",
    "/coupon/coupon_index",
    "/coupon/coupon_store",
    "/member/integral_v2",
    "/member/balance",
    "/member/address",
    "/member/extension",
    "/member/workerApply",
    "/member/workerOrderlist",
    "/member/workerOrderDetail/",
    "member/userOrderlist",
    "/member/userOrderDetail/",
    "/catelist/",
    "/application_market",
    "/member/collection",
    "/notice",
    "/articleContent/",
    "/member/coursedetail/",
    "/goodsGroup/",
    "/authorizationQuery",
    "/knowledge/home",
    "/knowledge/knowledge_whole",
    "/knowledge/knowledge_search",
    "/knowledge/knowledge_detail/",
    "/microHome/microIndex",
    "/microhomepage",
    "/microRelease",
    "/microcommentdetails",
    "/member/sign",
    "/videoList",
    "/videoDetail",
    "/releaseVideo",
  ];

  // 不需要跳转但是匹配的H5路由
  const notMatch = ["/o2o/home", "/entry_orders/home", "/microShop/home", "/o2o/category/", "/cart_share"];

  let path = "/" + window.location.href.match(/#\/(\S*)\?/)[1];
  let fullPath = window.location.href.match(/#\/(\S*)?/)[1];
  let isPCrouter = false;

  PCrouter.map(item => {
    if (path.indexOf(item) > -1 && notMatch.filter((route)=>{
      return path.indexOf(route) > -1;
    }).length <= 0) {
      isPCrouter = true;
    }
  });

  // 移动端跳转PC端
  if (isPCrouter) {
    Fun.browserRedirect(`${Fun.getSiteRoot()}/plugins/shop_server/${fullPath}`);
  } else {
    let notFlag = "";
    PCNotrouter.map(item => {
      // 只能这样匹配  否则包含/member的都会跳转
      if (item.h5.indexOf(path) > -1) {
        notFlag = item.pc;
      }
    });

    if (notFlag) {
      // http://localhost:82
      if (notFlag === "/knowledge/knowledge_detail/-1") {
        Fun.browserRedirect(`${Fun.getSiteRoot()}/plugins/shop_server${notFlag}?i=${Fun.getKeyByI()}&mid=${Fun.getKeyByMid()}&base_id=${Fun.getKey("base_id")}`);
      } else {
        Fun.browserRedirect(`${Fun.getSiteRoot()}/plugins/shop_server${notFlag}?i=${Fun.getKeyByI()}&mid=${Fun.getKeyByMid()}`);
      }
    }
  }
}

function tempInfo(data) {
  // let isLocation = false;
  if (!data) return;

  if (data.memberinfo) {
    //可用爱心值
    window.localStorage.setItem("usable", data.memberinfo.usable);
    window.localStorage.setItem("uid", data.memberinfo.uid);
  }

  if (!data.default) {
    // 新装修
    if (data.item.is_decorate === 1) {
      window.isDecorate = true;
      // store.commit("setNewDiyData", data.item);
      // if (data.item.page_info && data.item.page_info.page_title) {
      //   data.item.janst = data.item.page_info.page_title;
      // }else {
      //   data.item.janst = "";
      // }
    } else {
      window.isDecorate = false;
      // for (let j of data.item.data) {
      //   j.temp = "show" + j.temp;
      //   if (
      //     j.temp == "showlocation" ||
      //     j.temp == "showstore" ||
      //     j.temp == "showbusiness"
      //   ) {
      //     isLocation = true;
      //   }
      // }
      // 设置的标题（装修）
      // if (data.item.pageinfo) {
      //   data.item.janst = data.item.pageinfo.params.title;
      // }
    }
  }

  if (data.item.is_decorate !== 1) {
    // 底部导航设置
    data.item.menus = "";
  }
  data.item.janst = data.mailInfo.name;

  window.localStorage.setItem("integral", "积分");
  if (data.mailInfo && data.mailInfo.credit1) {
    //积分值
    window.localStorage.setItem("integral", data.mailInfo.credit1);
  }

  if (data.plugin && data.plugin.new_member_prize && data.plugin.new_member_prize.prize) {
    //满足新人奖，显示弹窗
    // store.commit("setNewcomerAward", true);
    window.localStorage.setItem("new_member_prize", JSON.stringify(data.plugin.new_member_prize));
  }

  store.commit("tempIndex", data);
  // if (data.item.pageinfo) {
  //   store.commit("setWatchDiypage", data.item.pageinfo.params.allowauth);
  // }
  // window.localStorage.setItem("tempIndex", JSON.stringify(data));  存vuex里不存localStorage
}

function getInvite(data) {
  // if (this.is_Inviter !== 1 || this.invite_mobile !== 1) {
  //   $http.get("member.member.isValidatePage").then(res => {
  //     if (res.result === 1) {
  if (data.is_invite === 1 || data.invite_mobile === 1 || (data.real_name_auth_is_open === 1 && data.is_auth === 1)) {
    window.yzValidate_page = 1;
  }

  if (data.real_name_auth_is_open === 1) {
    // 判断实名插件是否开启
    if (data.is_auth !== 1 && data.real_name_auth_scene && data.real_name_auth_scene.length > 0) {
      // 是否已经实名过
      bind_real_name(data.real_name_auth_scene);
      return;
    }
  }

  if (data.is_bind_mobile !== 0) {
    bindMobile(data.is_bind_mobile);
  } else {
    if (data.is_login === 1) {
      //登录
      if (data.is_invite !== 1) {
        //没有填写过邀请人
        if (data.invite_page === 1) {
          //开启了邀请页面
          if (store.state.is_Inviter) {
            //不是第一次进入商城  点击了确认邀请人
          } else {
            if (window.location.href.indexOf("input_visit") > 0 || window.location.href.indexOf("member/editmobile") > 0) {
              //是在这两个页面do nothing
            } else if (window.location.href.indexOf("input_visit") < 0 || window.location.href.indexOf("member/editmobile") < 0) {
              window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/Inviter?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
            }
          }
        }
      } else {
        //已经填写过邀请人
        if (data.invite_mobile !== 1 && data.invite_page === 1) {
          //没有绑定手机而且开启了邀请页面
          if (window.location.href.indexOf("input_visit") > 0 || window.location.href.indexOf("member/editmobile") > 0) {
            console.log("nothing");
          } else if (window.location.href.indexOf("input_visit") < 0 || window.location.href.indexOf("member/editmobile") < 0) {
            window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/Inviter?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
          }
        }
      }
    }
  }
  // }
  // });
  // }
}

function bindMobile(e) {
  if (e == 1) {
    //跳转绑定手机页面
    //判断是否是app分享扫码进入商城
    if (window.location.href.indexOf("/member/scaneditmobile") >= 0) {
      window.localStorage.setItem("is_force_mobile", 999);
      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/editmobile?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
    } else {
      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/editmobile?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
    }
  } else if (e == 2) {
    // 会员中心
    if (window.location.href.indexOf("/member?") > -1) {
      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/editmobile?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
    }
  } else if (e == 3) {
    // 商品详情
    if (window.location.href.indexOf("/goods/") > -1 || window.location.href.indexOf("/groups/") > -1) {
      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/editmobile?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
    }
  } else if (e == 4) {
    // 推广中心
    if (window.location.href.indexOf("/member/extension?") > -1) {
      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/editmobile?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
    }
  } else {
    // 电子合同
    if (window.location.href.indexOf("/signPage/") >= 0) {
      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/editmobile?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid() + "&from=signPage";
    }
  }
}

function bind_real_name(scene) {
  // 全局1 提现申请2  发布短视频3   发布微贴4  推广中心5
  if (window.location.href.indexOf("/personBank") < 0) {
    store.commit("setCallback", window.location.href);
  } else {
    store.commit("setCallback", Fun.getSiteRoot() + "/addons/yun_shop/?menu#/home?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid());
  }
  if (scene.indexOf("1") > -1 && window.location.href.indexOf("/personBank") < 0) {
    window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/?menu#/personBank?from=bindRealName&i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
    return;
  }
  if (scene.indexOf("5") > -1) {
    // 推广中心
    if (window.location.href.indexOf("/member/extension?") > -1) {
      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/?menu#/personBank?from=bindRealName&i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
    }
  }
  if (scene.indexOf("2") > -1) {
    // 提现申请
    if (window.location.href.indexOf("/member/withdrawal?") > -1) {
      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/?menu#/personBank?from=bindRealName&i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
    }
  }
  if (scene.indexOf("3") > -1) {
    // 发布短视频
    if (window.location.href.indexOf("/videoAgreement?") > -1 || window.location.href.indexOf("/releaseVideo?") > -1) {
      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/?menu#/personBank?from=bindRealName&i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
    }
  }
  if (scene.indexOf("4") > -1) {
    // 发布微贴
    if (window.location.href.indexOf("/microRelease?") > -1) {
      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/?menu#/personBank?from=bindRealName&i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
    }
  }
}

function getGDTDatas(options) {
  if (window.TencentGDT && window.TencentGDT.length != 0) {
    console.log(" ======== 已经请求过getGDTDatas ======= ");
    return;
  }
  let _options = options;
  let ua = window.navigator.userAgent.toLowerCase();
  // 开发者基于浏览器UA进行识别判定，给到我们的QQ浏览器、手机QQ，微信浏览器的流量，三者UA标记分别为mqqbrowser、qq、micromessenger，将这部分UA的流量调用我们的广告JS将返回广告。
  let _TBS =
    ua.match(/mqqbrowser/i) == "mqqbrowser" || ua.match(/qqbrowser/i) == "qqbrowser" || ua.match(/micromessenger/i) == "micromessenger" || ua.match(/qq/i) == "qq" || ua.match(/tbs/i) == "tbs";
  if (Fun.getPhoneEnv() == "1" || !_TBS) {
    // ios 也不支持
    console.log("当前环境不支持 广告填充！");
    return;
  }
  if (!_options || !_options.app_id || !_options.placement_id) {
    console.log("gdt error::: 缺失必要参数！");
    return;
  }
  // 优量汇 插屏广告
  // H5 SDK 在线文档地址：http://developers.adnet.qq.com/doc/web/js_develop
  // 全局命名空间申明TencentGDT对象
  // 广告初始化
  let path = "/" + window.location.href.match(/#\/(\S*)\?/)[1];
  let GDTLoadNum = 0; //已使用loadAd再次拉取广告的次数
  window.TencentGDT.push({
    app_id: _options.app_id, // {String} - appid - 必填
    placement_id: _options.placement_id, // {String} - 广告位id - 必填
    type: "native", // {String} - 原生广告类型 - 必填
    display_type: "interstitial", // 播放类型：插屏
    count: 10,
    onComplete: function(res) {
      console.log("TencentGDT onComplete:::", res);
      if (res && res.ret === 0) {
        if (path.indexOf("/home") > -1) {
          TencentGDT.NATIVE.renderAd(res.data[0]);
          let _arr = res.data.slice(1);
          if (_arr) window.GDTArr.push(..._arr);
          $http.get("plugin.qq-advertise.frontend.advertise.look", {}, "").then(response => {
            if (response.result == 0) {
              console.log(response);
            }
          });
        } else {
          window.GDTArr.push(...res.data); //当前页面非首页，先暂存起来，等返回首页再调用renderAd渲染
        }
      } else {
        // 加载广告API，如广告回调无广告，可使用loadAd再次拉取广告
        // 注意：拉取广告频率每分钟不要超过20次，否则会被广告接口过滤，影响广告位填充率
        // 限制拉取次数为15(非必需限制)
        if (GDTLoadNum >= 15) {
          console.log("已手动配置限制拉取次数为15！！！");
          return;
        }
        setTimeout(function() {
          GDTLoadNum += 1;
          window.TencentGDT.NATIVE.loadAd(_options.placement_id);
        }, 3000);
      }
    }
  });
  let doc = document,
    h = doc.getElementsByTagName("head")[0],
    s = doc.createElement("script");
  s.async = true;
  s.src = `//qzs.qq.com/qzone/biz/res/i.js?v=${Date.now()}`; //添加时间戳的目的,解决重新进入没有重新执行js加载导致没有显示广告
  h && h.insertBefore(s, h.firstChild);
}

function getLanguage(data) {
  $i18n.mergeLocaleMessage("en", data && data.en ? data.en : language.en);
}

getLanguage(language); // 先调用一次初始化

let abortSignalControllers = [];
export default {
  // 封装axios的post请求
  fetchUrl(url, params, message) {
    if (message == null || message == undefined) {
      storeOption.state.isloadding = false;
    } else {
      storeOption.state.isloadding = true;
    }

    return new Promise((resolve, reject) => {
      axios
        .get(url, { params: params.params, headers: params.headers })
        .then(response => {
          storeOption.state.isloadding = false;
          resolve(response.data);
        })
        .catch(error => {
          storeOption.state.isloadding = false;
          reject(error);
        });
    });
  },
  // 封装的 GET请求
  get(url, params, message) {
    if (!url) {
      console.log("输入url为空");
      return;
    }
    let i = Fun.getKeyByI();
    let mid = Fun.getKeyByMid();
    let type = Fun.getTyep();
    let shop_id = Fun.getKeyByMicroShopId();
    let v_id = window.localStorage.getItem("vid");
    let cicleInvitationId = window.localStorage.getItem("circle_invitation_id");
    let sessionid = Fun.getSession();
    let token = Fun.getToken();
    let webToken = localStorage.getItem("token");
    let uid = localStorage.getItem("loginUid");
    let uuid = window.localStorage.uuid;
    if (!uuid) {
      uuid = 0;
    }

    let baseUrl = "/addons/yun_shop/api.php?i=" + i + "&uuid=" + uuid + "&type=" + type;
    if (mid) {
      baseUrl += "&mid=" + mid;
    }
    if (shop_id) {
      baseUrl += "&shop_id=" + shop_id;
    }

    // console.log("Fun.isWXWork()", Fun.isWXWork()); 只根据链接的client参数来判断企业侧边栏环境  不用isWXWork crop_id是企业id
    if (Fun.getKey("client") === "work" || window.localStorage.getItem("client")) {
      // 判断是否从企业微信侧边栏进入
      window.localStorage.setItem("client", "work");
      baseUrl += "&client=work";
      // baseUrl += "&crop_id="+ Fun.getKey("crop_id");
    }

    baseUrl += "&version=v1.1.136";

    if (Fun.isCPS() && Fun.isCPSAPPI()) {
      baseUrl += "&cps_h5=1";
    }

    if (
      window.yzFirstlogin === 0 &&
      window.yzValidate_page === 0 &&
      url.indexOf("shop.FrontendError.do-log") < 0 &&
      url.indexOf("member.login.index") < 0 &&
      url.indexOf("member.member.wxJsSdkConfig") < 0 &&
      url.indexOf("member.login.login-mode") < 0 &&
      url.indexOf("home-page.getCaptcha") < 0 &&
      url.indexOf("member.register.sendCodeV2") < 0 &&
      url.indexOf("member.member.prepBind") < 0 &&
      url.indexOf("member.member.bindMobile") < 0
    ) {
      baseUrl = baseUrl + "&validate_page=1";
    }

    if (
      (window.yzFirstlogin === 1 &&
        url.indexOf("shop.FrontendError.do-log") < 0 &&
        url.indexOf("member.login.index") < 0 &&
        url.indexOf("member.member.wxJsSdkConfig") < 0 &&
        url.indexOf("member.login.login-mode") < 0 &&
        url.indexOf("home-page.getCaptcha") < 0 &&
        url.indexOf("member.register.sendCodeV2") < 0 &&
        url.indexOf("member.member.prepBind") < 0 &&
        url.indexOf("member.member.bindMobile") < 0) ||
      url.indexOf("finance.income-page.index") >= 0
    ) {
      window.yzFirstlogin = 0;
      baseUrl = baseUrl + "&basic_info=1&validate_page=1";
    } else if (!store.state.temp.mailInfo) {
      baseUrl = baseUrl + "&basic_info=1";
    }

    if (v_id) {
      baseUrl = baseUrl + "&vid=" + v_id;
    }
    if (cicleInvitationId) {
      baseUrl += "&circle_invitation_id=" + cicleInvitationId;
    }

    let app_token = "";
    if (Fun.isCPS()) {
      let ua = window.navigator.userAgent.toLowerCase();
      if (ua.indexOf("yz_cps02") > -1) {
        if (Fun.isIosOrAndroid() === "ios") {
          app_token = getKeyIIOS().token;
        } else {
          if (getKeyIAndroid()) {
            app_token = getKeyIAndroid().token;
          }
        }
      }
    }

    if (message == null || message == undefined) {
      storeOption.state.isloadding = false;
    } else {
      storeOption.state.isloadding = true;
    }

    if (
      window.location.href.indexOf("scope") > -1 &&
      window.location.href.indexOf("appid") > -1 &&
      window.location.href.indexOf("mob_user") > -1 &&
      window.location.href.indexOf("timestamp") > -1 &&
      window.location.href.indexOf("sign") > -1
    ) {
      if (Fun.isCPS() && !Fun.isCPSAPPI()) {
        baseUrl += "&route=";
        console.log("cps 不同域名或i");
      } else {
        if (app_token) {
          baseUrl += "&app_token=" + app_token;
        }
        baseUrl +=
          "&scope=" +
          Fun.getKey("scope") +
          "&appid=" +
          Fun.getKey("appid") +
          "&mob_user=" +
          Fun.getKey("mob_user") +
          "&timestamp=" +
          Fun.getKey("timestamp") +
          "&sign=" +
          Fun.getKey("sign") +
          "&route=";
        if (!window.localStorage.getItem("mob_user") && Fun.getKey("mob_user") != 0) {
          setTimeout(() => {
            window.localStorage.setItem("scope", Fun.getKey("scope"));
            window.localStorage.setItem("appid", Fun.getKey("appid"));
            window.localStorage.setItem("mob_user", Fun.getKey("mob_user"));
            window.localStorage.setItem("timestamp", Fun.getKey("timestamp"));
            window.localStorage.setItem("sign", Fun.getKey("sign"));
          }, 200);
        }
        console.log("freeLogin cps");
      }
    } else if (
      window.localStorage.getItem("scope") &&
      window.localStorage.getItem("appid") &&
      window.localStorage.getItem("mob_user") &&
      window.localStorage.getItem("timestamp") &&
      window.localStorage.getItem("sign")
    ) {
      if (app_token) {
        baseUrl += "&app_token=" + app_token;
      }

      baseUrl +=
        "&scope=" +
        window.localStorage.getItem("scope") +
        "&appid=" +
        window.localStorage.getItem("appid") +
        "&mob_user=" +
        window.localStorage.getItem("mob_user") +
        "&timestamp=" +
        window.localStorage.getItem("timestamp") +
        "&sign=" +
        window.localStorage.getItem("sign") +
        "&route=";
      console.log("freeLogin2");
    } else if (
      window.location.href.indexOf("scope") > -1 &&
      window.location.href.indexOf("appid") > -1 &&
      window.location.href.indexOf("mob_parent") > -1 &&
      window.location.href.indexOf("mob_user") > -1 &&
      window.location.href.indexOf("timetamp") > -1 &&
      window.location.href.indexOf("sign") > -1
    ) {
      baseUrl +=
        "&scope=" +
        Fun.getKey("scope") +
        "&appid=" +
        Fun.getKey("appid") +
        "&mob_parent=" +
        Fun.getKey("mob_parent") +
        "&mob_user=" +
        Fun.getKey("mob_user") +
        "&timetamp=" +
        Fun.getKey("timetamp") +
        "&sign=" +
        Fun.getKey("sign") +
        "&route=";
      if (!window.localStorage.getItem("mob_user") && Fun.getKey("mob_user") != 0) {
        window.localStorage.setItem("scope", Fun.getKey("scope"));
        window.localStorage.setItem("appid", Fun.getKey("appid"));
        window.localStorage.setItem("mob_parent", Fun.getKey("mob_parent"));
        window.localStorage.setItem("mob_user", Fun.getKey("mob_user"));
        window.localStorage.setItem("timetamp", Fun.getKey("timetamp"));
        window.localStorage.setItem("sign", Fun.getKey("sign"));
      }
      console.log("haifen");
    } else if (
      window.localStorage.getItem("scope") &&
      window.localStorage.getItem("appid") &&
      window.localStorage.getItem("mob_parent") &&
      window.localStorage.getItem("mob_user") &&
      window.localStorage.getItem("timetamp") &&
      window.localStorage.getItem("sign")
    ) {
      baseUrl +=
        "&scope=" +
        window.localStorage.getItem("scope") +
        "&appid=" +
        window.localStorage.getItem("appid") +
        "&mob_parent=" +
        window.localStorage.getItem("mob_parent") +
        "&mob_user=" +
        window.localStorage.getItem("mob_user") +
        "&timetamp=" +
        window.localStorage.getItem("timetamp") +
        "&sign=" +
        window.localStorage.getItem("sign") +
        "&route=";
      console.log("haifen2");
    } else if (window.location.href.indexOf("#/cashier_pay/") > -1 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=base&route=";
    } else if (window.location.href.indexOf("#/home?") > -1 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=home&route=";
    } else if (window.location.href.indexOf("#/newDiy?") > -1 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=home&route=";
    } else if ((isPassUrl() == true && url.indexOf("member.login.check-login") < 0 && url.indexOf("member.member-cart.store") < 0) || url.indexOf("shop.FrontendError.do-log") > 0) {
      baseUrl += "&scope=pass&route=";
    } else {
      baseUrl += "&route=";
    }

    if (params) {
      let paramsArray = [];
      Object.keys(params).forEach(key => paramsArray.push(key + "=" + params[key]));
      url += "&" + paramsArray.join("&");
      url = baseUrl + url;
    } else {
      url = baseUrl + url;
    }

    if (token) {
      url = url + "&client_type=2&app_type=wechat" + "&3rd_session=" + sessionid + "&session_id=" + token;
    }

    console.log("===test url====", url);

    // Authorization要删
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Basic " + base64_encode(uid + ":" + webToken)
    };

    if (window.new_page_comeIn != 2) {
      // 浏览足迹  new_page_comeIn == 2为页面第一个请求接口
      headers["local-url"] = `/${window.location.href.match(/\#\/(\S*)\?/)[1]}`;
      headers["full-url"] = `${window.location.href}`;
      window.new_page_comeIn = 2;
    }

    return new Promise(function(resolve, reject) {
      fetch(url, {
        method: "GET",
        headers: headers,
        credentials: "include"
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            reject({ status: response.status });
          }
          storeOption.state.isloadding = false;
        })
        .then(response => {
          storeOption.state.isloadding = false;

          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.status == "number") {
            window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
            Toast(response.msg);
            return;
          }
          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.status == -3) {
            window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/mandate";
            return;
          }
          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.status == -2) {
            window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404";
            return;
          }
          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.login_status != undefined && response.data.login_status == 0) {
            window.yzFirstlogin = 1;
            window.localStorage.setItem("isWxLogin", 1);
            if (!window.firstLogin) {
              window.firstLogin = 1;
              console.log("微信登录");
              let login_jump_url = response.data.login_url + "&yz_redirect=" + base64_encode(document.location.href);
              if (Fun.getKey("client") === "work" || window.localStorage.getItem("client")) {
                // 是否从企业微信侧边栏进入
                login_jump_url = response.data.login_url + "&crop_id="+ Fun.getKey("crop_id") + "&client=work&yz_redirect=" + base64_encode(document.location.href);
              }
              window.location.href = login_jump_url;
            }
            reject({ msg: "请登录" }); //直接报错
            return response;
          } else if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.login_status != undefined && response.data.login_status == 1) {
            window.yzFirstlogin = 1;
            window.localStorage.setItem("isWxLogin", -1);
            if (document.location.href.indexOf("/login?") == -1) {
              sessionStorage.setItem("yz_redirect", base64_encode(document.location.href));
            }

            if (!window.firstLogin) {
              console.log("跳入登录入口");
              if (response.data && response.data.extra && response.data.extra.hflive && response.data.extra.hflive.status == 1) {
                window.firstLogin = 1;
                window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/haifen_register?i=" + response.data.i + "&type=" + Fun.getTyep() + "&mid=" + response.data.mid;
                window.localStorage.setItem("appid", response.data.extra.hflive.appid);
              } else if (Fun.isCPS() && Fun.isCPSAPPI()) {
                window.firstLogin = 1;
                if (Fun.isIosOrAndroid() === "ios") {
                  callIOS({ body: "callIOS" });
                } else {
                  callAndroid();
                }
                setTimeout(() => {
                  // 防止聚合APP切换不同公众号没有再次登录
                  window.firstLogin = 0;
                }, 3000);
              } else {
                window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/login?i=" + response.data.i + "&type=" + Fun.getTyep() + "&mid=" + response.data.mid;
              }
            }

            reject({ msg: "请登录" }); //直接报错
            return response;
          } else {
            if (response.basic_info) {
              localStorage.setItem("yz_basic_info", JSON.stringify(response.basic_info));
              if (response.basic_info.consolidated_payment) {
                localStorage.setItem("consolidated_payment", response.basic_info.consolidated_payment == "1" ? true : false);
              }
              if (response.basic_info.plugin_setting) {
                localStorage.setItem("plugin_setting", JSON.stringify(response.basic_info.plugin_setting));
                if (response.basic_info.plugin_setting.qq_advertise && response.basic_info.plugin_setting.qq_advertise.open == 1) {
                  //腾讯广告 优量汇 插屏广告
                  getGDTDatas(response.basic_info.plugin_setting.qq_advertise);
                }
              }
              // 跳转PC端代码
              if (!Fun.isWXWork() && response.basic_info.plugin_setting && response.basic_info.plugin_setting.pc_terminal && response.basic_info.plugin_setting.pc_terminal.enable == 1) {
                jumpH5();
              }
              // 跳转PC端代码end

              if (response.basic_info.globalParameter && response.basic_info.globalParameter.crm_account_bind == -1) {
                // 益生crm会员绑定
                store.commit("setCrmBind", true);
              }

              tempInfo(response.basic_info.home);
              if (response.basic_info.lang) {
                localStorage.setItem("mailLanguage", JSON.stringify(response.basic_info.lang));
                localStorage.setItem("balanceLang", JSON.stringify(response.basic_info.balance));
                localStorage.setItem("integralLang", JSON.stringify(response.basic_info.point));
                store.commit("setShopLanguage", response.basic_info.lang);
                getLanguage(response.basic_info.lang.plugin_language);
              }
              if (response.basic_info.home && response.basic_info.home != null && response.basic_info.home.memberinfo && response.basic_info.home.memberinfo != null) {
                window.localStorage.uid = response.basic_info.home.memberinfo.uid;
              }
              localStorage.setItem("globalParameter", JSON.stringify(response.basic_info.globalParameter));
              store.commit("setCartNum", response.basic_info.globalParameter.cart_num);

              window.popularizeYZ = response.basic_info.popularize_page;
              window.yz_bd = window.popularizeYZ.baidu;

              if (window.popularizeYZ) {
                if (Fun.getTyep() == "5") {
                  if (window.popularizeYZ.wap.vue_route.indexOf(window.__lendApp__.$route.name) >= 0) {
                    if (Fun.isTextEmpty(window.popularizeYZ.wap.url)) {
                      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.wap.url;
                    }
                  }
                } else if (Fun.getTyep() == "1") {
                  if (window.popularizeYZ.wechat.vue_route.indexOf(window.__lendApp__.$route.name) >= 0) {
                    if (Fun.isTextEmpty(window.popularizeYZ.wechat.url)) {
                      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.wechat.url;
                    }
                  }
                } else if (Fun.getTyep() == "2") {
                  if (window.popularizeYZ.mini.vue_route.indexOf(window.__lendApp__.$route.name) >= 0) {
                    if (Fun.isTextEmpty(window.popularizeYZ.mini.url)) {
                      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
                    } else {
                      wx.miniProgram.navigateTo({
                        url: window.popularizeYZ.mini.url
                      });
                    }
                  }
                } else if (Fun.getTyep() == "7") {
                  if (window.popularizeYZ.app.vue_route.indexOf(window.__lendApp__.$route.name) >= 0) {
                    if (Fun.isTextEmpty(window.popularizeYZ.app.url)) {
                      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.app.url;
                    }
                  }
                } else if (Fun.getTyep() == "8") {
                  if (window.popularizeYZ.alipay.vue_route.indexOf(window.__lendApp__.$route.name) >= 0) {
                    if (Fun.isTextEmpty(window.popularizeYZ.alipay.url)) {
                      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.alipay.url;
                    }
                  }
                }
              }
            }

            if (response.validate_page) {
              getInvite(response.validate_page);
            }
            return JSON.parse(JSON.stringify(response));
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          storeOption.state.isloadding = false;
          console.log(err, "网络请求，无响应！");
          //   reject({ status: "网络请求，无响应" });
        });
    });
  },
  // POST请求  FormData 表单数据

  post(url, formData, message, flag, pc_type) {
    if (!url) {
      console.log("输入url为空");
      return;
    }
    try {
      const controller = new AbortController();
      var { signal } = controller;
      if (abortSignalControllers.length > 0 && flag) {
        const oldcontroller = abortSignalControllers[abortSignalControllers.length - 1];
        oldcontroller.abort();
      }
      abortSignalControllers.push(controller);
    } catch (error) {
      console.log("该浏览器暂不支持 AbortController ！");
    }

    let level = window.localStorage.getItem("level");
    let i = Fun.getKeyByI();
    let mid = Fun.getKeyByMid();
    let type = pc_type || Fun.getTyep();
    let shop_id = Fun.getKeyByMicroShopId();
    let v_id = window.localStorage.getItem("vid");
    let cicleInvitationId = window.localStorage.getItem("circle_invitation_id");
    let sessionid = Fun.getSession();
    let token = Fun.getToken();
    let webToken = localStorage.getItem("token");
    let uid = localStorage.getItem("loginUid");
    let uuid = window.localStorage.uuid;
    if (!uuid) {
      uuid = 0;
    }

    let baseUrl = "/addons/yun_shop/api.php?i=" + i + "&uuid=" + uuid + "&type=" + type;
    if (mid) {
      baseUrl += "&mid=" + mid;
    }
    if (shop_id) {
      baseUrl += "&shop_id=" + shop_id;
    }
    if (Fun.getKey("client") === "work" || window.localStorage.getItem("client")) {
      // 判断是否从企业微信侧边栏进入
      window.localStorage.setItem("client", "work");
      baseUrl += "&client=work";
      // baseUrl += "&crop_id="+ Fun.getKey("crop_id");
    }

    baseUrl += "&version=v1.1.136";

    if (Fun.isCPS() && Fun.isCPSAPPI()) {
      baseUrl += "&cps_h5=1";
    }

    if (
      window.yzFirstlogin === 0 &&
      window.yzValidate_page === 0 &&
      url.indexOf("shop.FrontendError.do-log") < 0 &&
      url.indexOf("member.login.index") < 0 &&
      url.indexOf("member.member.wxJsSdkConfig") < 0 &&
      url.indexOf("member.login.login-mode") < 0 &&
      url.indexOf("home-page.getCaptcha") < 0 &&
      url.indexOf("member.register.sendCodeV2") < 0 &&
      url.indexOf("member.member.prepBind") < 0 &&
      url.indexOf("member.member.bindMobile") < 0
    ) {
      baseUrl = baseUrl + "&validate_page=1";
    }

    if (
      (window.yzFirstlogin === 1 &&
        url.indexOf("shop.FrontendError.do-log") < 0 &&
        url.indexOf("member.login.index") < 0 &&
        url.indexOf("member.member.wxJsSdkConfig") < 0 &&
        url.indexOf("member.login.login-mode") < 0 &&
        url.indexOf("home-page.getCaptcha") < 0 &&
        url.indexOf("member.register.sendCodeV2") < 0 &&
        url.indexOf("member.member.prepBind") < 0 &&
        url.indexOf("member.member.bindMobile") < 0) ||
      url.indexOf("finance.income-page.index") >= 0
    ) {
      window.yzFirstlogin = 0;
      baseUrl = baseUrl + "&basic_info=1&validate_page=1";
    } else if (!store.state.temp.mailInfo) {
      baseUrl = baseUrl + "&basic_info=1";
    }

    if(url.indexOf("plugin.overseas.frontend.order.create") >= 0){
      baseUrl = baseUrl + "&basic_info=1";
    }

    if (v_id) {
      baseUrl = baseUrl + "&vid=" + v_id;
    }
    if (cicleInvitationId) {
      baseUrl += "&circle_invitation_id=" + cicleInvitationId;
    }

    if (level) {
      baseUrl += "&level=" + level;
      let province_id = window.localStorage.getItem("province_id");
      let city_id = window.localStorage.getItem("city_id");
      let district_id = window.localStorage.getItem("district_id");
      let street_id = window.localStorage.getItem("street_id");
      if (province_id) {
        baseUrl += "&province_id=" + province_id;
      }
      if (city_id) {
        baseUrl += "&city_id=" + city_id;
      }
      if (district_id) {
        baseUrl += "&district_id=" + district_id;
      }
      if (street_id) {
        baseUrl += "&street_id=" + street_id;
      }
    }

    let app_token = "";
    if (Fun.isCPS()) {
      let ua = window.navigator.userAgent.toLowerCase();
      if (ua.indexOf("yz_cps02") > -1) {
        if (Fun.isIosOrAndroid() === "ios") {
          app_token = getKeyIIOS().token;
        } else {
          if (getKeyIAndroid()) {
            app_token = getKeyIAndroid().token;
          }
        }
      }
    }

    if (message == null || message == undefined) {
      store.state.isloadding = false;
    } else {
      storeOption.state.isloadding = true;
    }

    if (
      window.location.href.indexOf("scope") > -1 &&
      window.location.href.indexOf("appid") > -1 &&
      window.location.href.indexOf("mob_user") > -1 &&
      window.location.href.indexOf("timestamp") > -1 &&
      window.location.href.indexOf("sign") > -1
    ) {
      if (Fun.isCPS() && !Fun.isCPSAPPI()) {
        baseUrl += "&route=";
        console.log("cps 不同域名或i");
      } else {
        if (app_token) {
          baseUrl += "&app_token=" + app_token;
        }
        baseUrl +=
          "&scope=" +
          Fun.getKey("scope") +
          "&appid=" +
          Fun.getKey("appid") +
          "&mob_user=" +
          Fun.getKey("mob_user") +
          "&timestamp=" +
          Fun.getKey("timestamp") +
          "&sign=" +
          Fun.getKey("sign") +
          "&route=";
        if (!window.localStorage.getItem("mob_user") && Fun.getKey("mob_user") != 0) {
          setTimeout(() => {
            window.localStorage.setItem("scope", Fun.getKey("scope"));
            window.localStorage.setItem("appid", Fun.getKey("appid"));
            window.localStorage.setItem("mob_user", Fun.getKey("mob_user"));
            window.localStorage.setItem("timestamp", Fun.getKey("timestamp"));
            window.localStorage.setItem("sign", Fun.getKey("sign"));
          }, 200);
        }
        console.log("freeLogin cps");
      }
    } else if (
      window.localStorage.getItem("scope") &&
      window.localStorage.getItem("appid") &&
      window.localStorage.getItem("mob_user") &&
      window.localStorage.getItem("timestamp") &&
      window.localStorage.getItem("sign")
    ) {
      if (app_token) {
        baseUrl += "&app_token=" + app_token;
      }

      baseUrl +=
        "&scope=" +
        window.localStorage.getItem("scope") +
        "&appid=" +
        window.localStorage.getItem("appid") +
        "&mob_user=" +
        window.localStorage.getItem("mob_user") +
        "&timestamp=" +
        window.localStorage.getItem("timestamp") +
        "&sign=" +
        window.localStorage.getItem("sign") +
        "&route=";
      console.log("freeLogin2");
    } else if (
      window.location.href.indexOf("scope") > -1 &&
      window.location.href.indexOf("appid") > -1 &&
      window.location.href.indexOf("mob_parent") > -1 &&
      window.location.href.indexOf("mob_user") > -1 &&
      window.location.href.indexOf("timetamp") > -1 &&
      window.location.href.indexOf("sign") > -1
    ) {
      baseUrl +=
        "&scope=" +
        Fun.getKey("scope") +
        "&appid=" +
        Fun.getKey("appid") +
        "&mob_parent=" +
        Fun.getKey("mob_parent") +
        "&mob_user=" +
        Fun.getKey("mob_user") +
        "&timetamp=" +
        Fun.getKey("timetamp") +
        "&sign=" +
        Fun.getKey("sign") +
        "&route=";
      if (!window.localStorage.getItem("mob_user") && Fun.getKey("mob_user") != 0) {
        window.localStorage.setItem("scope", Fun.getKey("scope"));
        window.localStorage.setItem("appid", Fun.getKey("appid"));
        window.localStorage.setItem("mob_parent", Fun.getKey("mob_parent"));
        window.localStorage.setItem("mob_user", Fun.getKey("mob_user"));
        window.localStorage.setItem("timetamp", Fun.getKey("timetamp"));
        window.localStorage.setItem("sign", Fun.getKey("sign"));
      }
      console.log("haifen");
    } else if (
      window.localStorage.getItem("scope") &&
      window.localStorage.getItem("appid") &&
      window.localStorage.getItem("mob_parent") &&
      window.localStorage.getItem("mob_user") &&
      window.localStorage.getItem("timetamp") &&
      window.localStorage.getItem("sign")
    ) {
      baseUrl +=
        "&scope=" +
        window.localStorage.getItem("scope") +
        "&appid=" +
        window.localStorage.getItem("appid") +
        "&mob_parent=" +
        window.localStorage.getItem("mob_parent") +
        "&mob_user=" +
        window.localStorage.getItem("mob_user") +
        "&timetamp=" +
        window.localStorage.getItem("timetamp") +
        "&sign=" +
        window.localStorage.getItem("sign") +
        "&route=";
      console.log("haifen2");
    } else if (window.location.href.indexOf("#/cashier_pay/") > -1 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=base&route=";
    } else if (window.location.href.indexOf("#/home?") > 0 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=home&route=";
    } else if (window.location.href.indexOf("#/newDiy?") > 0 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=home&route=";
    } else if ((isPassUrl() == true && url.indexOf("member.login.check-login") < 0 && url.indexOf("member.member-cart.store") < 0) || url.indexOf("shop.FrontendError.do-log") > 0) {
      baseUrl += "&scope=pass&route=";
    } else {
      baseUrl += "&route=";
    }

    return new Promise(function(resolve, reject) {
      url = baseUrl + url;

      if (token) {
        url = url + "&app_type=wechat" + "&3rd_session=" + sessionid + "&session_id=" + token;
      }

      // Authorization要删
      let headers = {
        "Content-Type": "application/json",
        Authorization: "Basic " + base64_encode(uid + ":" + webToken)
      };

      if (window.new_page_comeIn != 2) {
        // 浏览足迹  new_page_comeIn == 2为页面第一个请求接口
        headers["local-url"] = `/${window.location.href.match(/\#\/(\S*)\?/)[1]}`;
        headers["full-url"] = `${window.location.href}`;
        window.new_page_comeIn = 2;
      }

      fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData),
        credentials: "include",
        signal: signal && !signal.aborted ? signal : null
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            reject({ status: response.status });
          }

          storeOption.state.isloadding = false;
        })
        .then(response => {
          storeOption.state.isloadding = false;
          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.status == "number") {
            window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
            Toast(response.msg);
            return;
          }
          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.login_status == -1) {
            window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/blacklist?i=" + Fun.getKeyByI();
            return;
          }
          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.status == -3) {
            window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/mandate?i=" + Fun.getKeyByI();
            return;
          }

          if (response.result == 0 && response.data == -1) {
            window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/CloseSite?i=" + Fun.getKeyByI();
            return;
          }
          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.status == -2) {
            window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI();
            return;
          }
          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.login_status != undefined && response.data.login_status == 0) {
            window.yzFirstlogin = 1;
            window.localStorage.setItem("isWxLogin", 1);
            if (!window.firstLogin) {
              window.firstLogin = 1;
              console.log("微信登录");
              let login_jump_url = response.data.login_url + "&yz_redirect=" + base64_encode(document.location.href);
              if (Fun.getKey("client") === "work" || window.localStorage.getItem("client")) {
                // 判断是否从企业微信侧边栏进入
                login_jump_url = response.data.login_url + "&crop_id="+ Fun.getKey("crop_id") + "&client=work&yz_redirect=" + base64_encode(document.location.href);
              }
              window.location.href = login_jump_url;
            }
            reject({ msg: "请登录" }); //直接报错
            return response;
          } else if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.login_status != undefined && response.data.login_status == 1) {
            window.yzFirstlogin = 1;
            window.localStorage.setItem("isWxLogin", -1);
            if (document.location.href.indexOf("/login?") == -1) {
              sessionStorage.setItem("yz_redirect", base64_encode(document.location.href));
            }

            if (!window.firstLogin) {
              console.log("登录");
              if (response.data && response.data.extra && response.data.extra.hflive && response.data.extra.hflive.status == 1) {
                window.firstLogin = 1;
                window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/haifen_register?i=" + response.data.i + "&type=" + Fun.getTyep() + "&mid=" + response.data.mid;
                window.localStorage.setItem("appid", response.data.extra.hflive.appid);
              } else if (Fun.isCPS() && Fun.isCPSAPPI()) {
                window.firstLogin = 1;
                if (Fun.isIosOrAndroid() === "ios") {
                  callIOS({ body: "callIOS" });
                } else {
                  callAndroid();
                }

                setTimeout(() => {
                  // 防止聚合APP切换不同公众号没有再次登录
                  window.firstLogin = 0;
                }, 3000);
              } else {
                window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/login?i=" + response.data.i + "&type=" + Fun.getTyep() + "&mid=" + response.data.mid;
              }
            }

            reject({ msg: "请登录" }); //直接报错
            return response;
          } else {
            if (response.basic_info) {
              localStorage.setItem("yz_basic_info", JSON.stringify(response.basic_info));
              if (response.basic_info.consolidated_payment) {
                localStorage.setItem("consolidated_payment", response.basic_info.consolidated_payment == "1" ? true : false);
              }
              if (response.basic_info.plugin_setting) {
                localStorage.setItem("plugin_setting", JSON.stringify(response.basic_info.plugin_setting));
                if (response.basic_info.plugin_setting.qq_advertise && response.basic_info.plugin_setting.qq_advertise.open == 1) {
                  //腾讯广告 优量汇 插屏广告
                  getGDTDatas(response.basic_info.plugin_setting.qq_advertise);
                }
              }
              // 跳转PC端代码
              if (!Fun.isWXWork() && response.basic_info.plugin_setting && response.basic_info.plugin_setting.pc_terminal && response.basic_info.plugin_setting.pc_terminal.enable == 1) {
                jumpH5();
              }
              // 跳转PC端代码end

              if (response.basic_info.globalParameter && response.basic_info.globalParameter.crm_account_bind == -1) {
                // 益生crm会员绑定
                store.commit("setCrmBind", true);
              }

              tempInfo(response.basic_info.home);
              if (response.basic_info.lang) {
                localStorage.setItem("mailLanguage", JSON.stringify(response.basic_info.lang));
                localStorage.setItem("balanceLang", JSON.stringify(response.basic_info.balance));
                localStorage.setItem("integralLang", JSON.stringify(response.basic_info.point));
                store.commit("setShopLanguage", response.basic_info.lang);
                getLanguage(response.basic_info.lang.plugin_language);
              }
              if (response.basic_info.home && response.basic_info.home != null && response.basic_info.home.memberinfo && response.basic_info.home.memberinfo != null) {
                window.localStorage.uid = response.basic_info.home.memberinfo.uid;
              }
              localStorage.setItem("globalParameter", JSON.stringify(response.basic_info.globalParameter));
              store.commit("setCartNum", response.basic_info.globalParameter ? response.basic_info.globalParameter.cart_num : "");

              window.popularizeYZ = response.basic_info.popularize_page;
              window.yz_bd = window.popularizeYZ.baidu;

              if (window.popularizeYZ) {
                if (Fun.getTyep() == "5") {
                  if (window.popularizeYZ.wap.vue_route.indexOf(window.__lendApp__.$route.name) >= 0) {
                    if (Fun.isTextEmpty(window.popularizeYZ.wap.url)) {
                      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.wap.url;
                    }
                  }
                } else if (Fun.getTyep() == "1") {
                  if (window.popularizeYZ.wechat.vue_route.indexOf(window.__lendApp__.$route.name) >= 0) {
                    if (Fun.isTextEmpty(window.popularizeYZ.wechat.url)) {
                      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.wechat.url;
                    }
                  }
                } else if (Fun.getTyep() == "2") {
                  if (window.popularizeYZ.mini.vue_route.indexOf(window.__lendApp__.$route.name) >= 0) {
                    if (Fun.isTextEmpty(window.popularizeYZ.mini.url)) {
                      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
                    } else {
                      wx.miniProgram.navigateTo({
                        url: window.popularizeYZ.mini.url
                      });
                    }
                  }
                } else if (Fun.getTyep() == "7") {
                  if (window.popularizeYZ.app.vue_route.indexOf(window.__lendApp__.$route.name) >= 0) {
                    if (Fun.isTextEmpty(window.popularizeYZ.app.url)) {
                      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.app.url;
                    }
                  }
                } else if (Fun.getTyep() == "8") {
                  if (window.popularizeYZ.alipay.vue_route.indexOf(window.__lendApp__.$route.name) >= 0) {
                    if (Fun.isTextEmpty(window.popularizeYZ.alipay.url)) {
                      window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI() + "&type=" + Fun.getTyep() + "&mid=" + Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.alipay.url;
                    }
                  }
                }
              }
            }
            if (response.validate_page) {
              getInvite(response.validate_page);
            }

            return response;
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          storeOption.state.isloadding = false;
          if (err.name === "AbortError") {
            console.log("手动中止请求接口");
          } else {
            console.log("网络请求，无响应！", err);
            reject({ status: "网络请求，无响应！" });
          }
        });
    });
  }
};
