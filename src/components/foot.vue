<template>
  <div
    id="foot"
    v-if="$store.state.temp.item.menustyle"
    :class="[ fun.getPhoneEnv() == 3 ? 'pcStyle' : '', fun.isIphoneX() ? 'iphoneXStyle' : '']"
  >
    <div
      id="allli"
      v-if="1"
      :class="{
        showicon2: $store.state.temp.item.menustyle.showicon == 2,
        showicon1: $store.state.temp.item.menustyle.showicon == 1
      }"
      :style="{
            backgroundColor: $store.state.temp.item.menustyle.bgcolor ? $store.state.temp.item.menustyle.bgcolor: 'white'
          }"
    >
      <div
        class="footli"
        v-for="(item, index) in $store.state.temp.item.menus"
        :key="index"
        :class="{
          'is-selected': isShow == item.id,
          agent: item.classt == agent
        }"
        @click.stop="selectTabBatItem2($event, index, item)"
      >
        <div
          class="layers"
          v-if="item && item.subMenus && item.subMenus.length != 0"
          :class="{ laye: isShow == item.id }"
          :style="{ display: isShow == item.id ? 'block' : 'none' }"
        >
        <!-- left: layersLeft[$store.state.temp.item.menus.length - 1] -->
          <ul
            v-if="showTie"
            :style="{
              borderColor: $store.state.temp.item.menustyle.bordercolor2

            }"
          >
            <li
              v-for="(child, i) in item.subMenus"
              :key="i"
              :style="{ background: $store.state.temp.item.menustyle.bgcolor2 }"
            >
              <a
                :href="child.url | href_filters"
                :style="{
                  color: $store.state.temp.item.menustyle.textcolor2,
                  borderColor: $store.state.temp.item.menustyle.bordercolor2
                }"
              >{{ child.title }}</a
              >
            </li>
            <div
              class="corner"
              :style="{
                'border-top-color':
                  $store.state.temp.item.menustyle.bordercolor2
              }"
            ></div>
            <div
              class="corner2"
              :style="{
                'border-top-color': $store.state.temp.item.menustyle.bgcolor2
              }"
            ></div>
          </ul>
        </div>
        <div
          class="menust mycolumn"
          :class="{
            ificon: item.icon,
            mycolumn: $store.state.temp.item.menustyle.showicon == 2
          }"
          :style="{
            borderColor:
              isele == ulrgl(item.url)
                ? $store.state.temp.item.menustyle.bordercolorhigh
                : $store.state.temp.item.menustyle.bordercolor,
            borderStyle:
              $store.state.temp.item.menustyle.showborder == 1
                ? 'solid'
                : 'none',
            backgroundColor:
              isele == urlParse(item.url, isele) ||
              page_id == urlParse(item.url, isele)
                ? $store.state.temp.item.menustyle.bgcolorhigh
                : $store.state.temp.item.menustyle.bgcolor
          }"
        >
          <!--<div class="bgcolors"-->
          <!--:style="{background:(isele==ulrgl(item.url) ?$store.state.temp.item.menustyle.bgcolorhigh:$store.state.temp.item.menustyle.bgcolor),'opacity':$store.state.temp.item.menustyle.bgalpha}"></div>-->
          <template v-if="item.icon">
            <i
              class="fa"
              :class="item.icon"
              :style="{
                color:
                  isele == urlParse(item.url, isele) ||
                  page_id == urlParse(item.url, isele)
                    ? $store.state.temp.item.menustyle.iconcolorhigh
                    : $store.state.temp.item.menustyle.iconcolor,
                padding: '0 0.5rem'
              }"
              v-if="$store.state.temp.item.menustyle.showicon != 0"
            >
            </i>
          </template>
          <span
            v-show="$store.state.temp.item.menustyle.showtext == 1"
            :style="{
              color:
                isele == urlParse(item.url, isele) ||
                page_id == urlParse(item.url, isele)
                  ? $store.state.temp.item.menustyle.textcolorhigh
                  : $store.state.temp.item.menustyle.textcolor,
              textAlign: item.icon ? 'left' : 'center'
            }"
          >{{ item.title }}</span
          >
        </div>
      </div>
    </div>
    <div id="diycode" v-html="$store.state.temp.mailInfo.diycode"></div>
  </div>
</template>

<script>
import Fun from "../fun";

var params = {
  previewbg: "#ef372e",
  height: "3.0625rem",
  textcolor: "#70c10b",
  textcolorhigh: "#ff4949",
  iconcolor: "#666666",
  iconcolorhigh: "#ff4949",
  bgcolor: "#FFF",
  bgcolorhigh: "#FFF",
  bordercolor: "#010101",
  bordercolorhigh: "#bfbfbf",
  showtext: 1,
  showborder: "0",
  showicon: 2,
  textcolor2: "#666666",
  bgcolor2: "#fafafa",
  bordercolor2: "#1856f8",
  showborder2: 1,
  bgalpha: ".5"
};
let i = Fun.getKeyByI();
let mid = Fun.getKeyByMid();
let type = Fun.getTyep();
var menus = [
  {
    id: 1,
    title: "首页",
    icon: "fa fa-home",
    url: "/addons/yun_shop/#/home?i=" + i + "&type=" + type,
    name: "home",
    subMenus: [],
    textcolor: "#70c10b",
    bgcolor: "#24d7e6",
    bordercolor: "#bfbfbf",
    iconcolor: "#666666"
  },
  {
    id: "menu_1489731310493",
    title: "分类",
    icon: "fa fa-th-large",
    url: "/addons/yun_shop/#/category?i=" + i + "&type=" + type,
    name: "category",
    subMenus: [],
    textcolor: "#70c10b",
    bgcolor: "#24d7e6",
    iconcolor: "#666666",
    bordercolor: "#bfbfbf"
  },
  {
    id: "menu_1489731319695",
    classt: "no",
    title: "推广",
    icon: "fa fa-send",
    url: "/addons/yun_shop/#/member/extension?i=" + i + "&type=" + type,
    name: "extension",
    subMenus: [],
    textcolor: "#666666",
    bgcolor: "#837aef",
    iconcolor: "#666666",
    bordercolor: "#bfbfbf"
  },
  {
    id: "menu_1489735163419",
    title: "购物车",
    icon: "fa fa-cart-plus",
    url: "/addons/yun_shop/#/cart?i=" + i + "&type=" + type,
    name: "cart",
    subMenus: [],
    textcolor: "#70c10b",
    bgcolor: "#24d7e6",
    iconcolor: "#666666",
    bordercolor: "#bfbfbf"
  },
  {
    id: "menu_1491619644306",
    title: "会员中心",
    icon: "fa fa-user",
    url: "/addons/yun_shop/#/member?i=" + i + "&mid=" + mid + "&type=" + type,
    name: "member",
    subMenus: [],
    textcolor: "#70c10b",
    bgcolor: "#24d7e6",
    iconcolor: "#666666",
    bordercolor: "#bfbfbf"
  }
];
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      thisurl: window.location.href,
      selected: "",
      popupVisible1: false,
      isele: "",
      menus: menus,
      params: params,
      page_id: "",
      oftemp: false,
      diycode: "",
      agent: "",
      layersLeft: ["9rem", "3rem", "1rem", "0.1rem", "0"],
      showTie: false
    };
  },
  computed: mapState(["isShow"]),
  props: ["hide"],
  watch: {
    $route(to, from) {
      this.isele = to.path;
      this.page_id = Fun.getKey("page_id");
    }
  },
  activated() {
    this.page_id = Fun.getKey("page_id");
  },
  mounted() {
    this.isele = this.$route.path;
    this.page_id = Fun.getKey("page_id");
    //this.getMailInfo();
  },
  methods: {
    ...mapMutations(["toIsShow"]),
    selectTabBatItem2(e, n, item) {
      if (e.currentTarget.className == "footli is-selected") {
        e.currentTarget.className = "footli";
        this.showTie = false;
      } else {
        this.showTie = true;
        e.currentTarget.className = "footli is-selected";
      }
      this.$store.commit("toIsShow", item.id);
      if (item.subMenus.length == 0) {
        if (item.url) {
          //自定义菜单 mid处理
          console.log("start.....", item);
          let mid = window.localStorage.getItem("uid");
          //window.location.href = this.fun.changeURLArg(item.url,"mid",mid);
          //改为route方式，试试是否还刷新页面
          if (item.name == undefined) {
            if(mid) {
              window.location.href = this.fun.changeURLArg(item.url, "mid", mid);
            } else {
              window.location.href = item.url;
            }
            // if (item.is_shop == 1) {
            //   window.location.href = item.url;
            // } else if (item.is_shop == 0) {
            //   window.location.href = this.fun.changeURLArg(
            //     item.url,
            //     "mid",
            //     mid
            //   );
            // }
          } else {
            this.$router.push(this.fun.getUrl(item.name));
          }
        }
      }
    },
    ulrgl(urls) {
      if (urls != undefined) {
        let aurls = urls.split("#");
        if (aurls instanceof Array && aurls[1] != undefined) {
          //console.log(aurls[1]);
          return aurls[1];
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    urlParse(urls, isele) {
      if (urls != undefined) {
        //http://umeiga.com/addons/yun_shop/?menu#/cart?i=8
        //   url= >   /cart?
        var url = urls.match(/#\/(\S*)\?i=/);
        if (url instanceof Array && url[1] != undefined) {
          let newUrl = "/" + url[1];
          if (url != undefined) {
            if (newUrl == isele) {
              return newUrl;
            } else {
              return "-1";
            }
          } else {
            return "-1";
          }
        } else {
          // 装修页面高亮
          if (this.page_id) {
            return (new RegExp("[?|&]page_id=" + "([^&;]+?)(&|#|;|$)").exec(urls) || [,""])[1].replace(/\+/g, "%20"); //定义正则表达式
          } else {
            return "-1";
          }
        }
      } else {
        return "";
      }
    },
    //菜单是否启用自定义
    tempMenu() {
      $http.get("plugin.designer.home.index.page").then(
        response => {
          if (response.result == 1) {
            if (response.data.footertype == 2) {
              this.upMenu(response.data.footermenu);
            } else {
              this.oftemp = true;
              this.menus = menus;
            }
          } else {
            this.upMenu();
            console.log(response.msg);
          }
        },
        response => {
          this.oftemp = true;
          this.menus = menus;
          // error callback
          console.log(response);
        }
      );
    },
    //获取导航菜单内容
    upMenu(menu_id) {
      let json = {
        menu_id
      };
      $http.get("plugin.designer.home.index.menu", json).then(
        response => {
          if (response.result == 1) {
            this.menus = response.data.menus;
            this.params = response.data.params;
            this.oftemp = true;
          } else {
            this.oftemp = true;
            this.menus = menus;
          }
        },
        response => {
          this.oftemp = true;
          this.menus = menus;
          // error callback
          console.log(response);
        }
      );
    },
    //获取插件开关
    ofTempD() {
      if (this.$store.state.temp.menus) {
        this.tempMenu();
      } else {
        this.oftemp = true;
        this.menus = menus;
      }
      $http.get("plugins.get-plugin-data").then(
        response => {
          if (response.result == 1) {
            if (response.data.designer) {
              //this.upMenu(2);
              this.tempMenu();
            }
            //this.oftemp = response.data.designer;
          } else {
            this.oftemp = true;
            this.menus = menus;
            console.log(response.msg);
          }
        },
        response => {
          this.oftemp = true;
          this.menus = menus;
          // error callback
          console.log(response);
        }
      );
    },
    //获取商城信息
    getMailInfo() {
      // let that = this;
      $http.get("setting.get").then(response => {
        if (response.result == 1) {
          //console.log('统计代码：',response.diycode);
          if (response.data.cservice) {
            this.$store.commit("setCservice", response.data.cservice);
          } else {
            this.$store.commit("setCservice", "");
          }
          this.diycode = response.data.diycode;
          if (!response.data.agent) {
            this.agent = "no";
          } else {
            this.agent = "";
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .agent {
    display: none;
  }

  /* @media only screen and (device-width: 375px) and (min-height: 690px) and */

  /* (-webkit-device-pixel-ratio: 3) { */

  /* !*增加底部适配层*! */

  /* #allli{ */

  /* padding-bottom: 34px; */

  /* } */

  /* } */

  #foot {
    color: #8f9295;

    #diycode {
      display: none;
    }

    .showicon2 {
      .menust {
        line-height: 2.375rem;
      }

      .menust.ificon {
        line-height: 1rem;
      }
    }

    .showicon1 {
      .menust {
        line-height: 1.375rem;
        flex-direction: row !important;

        i {
          font-size: 1.125rem !important;
        }
      }

      .menust.ificon {
        line-height: 1.375rem;
      }
    }

    .bgcolors {
      position: absolute;
      width: 100%;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: -5;
    }

    #allli {
      display: flex;
      background-color: rgba(255, 255, 255, 1);

      /* height: 3.0625rem; */

      /* line-height: 3.0625rem; */
      position: fixed;
      bottom: 0;
      width: 100%;
      align-items: center;
      box-shadow: 0 -0.0625rem 0.25rem rgba(0, 0, 0, 0.1); // z-index: 9999;
      z-index: 2000;

      .is-selected.footli {
        .layers ul {
          width: 5.5rem;
          bottom: 3.7625rem;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 0.1875rem;
        }
      }

      .footli {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        position: relative;

        .menust {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          border: #fff solid 0.0625rem;
          box-sizing: border-box;
          border-right: 0;
          border-bottom: 0;
          width: 100%;
          height: 3.0625rem;
        }

        .mycolumn {
          flex-direction: column;
        }

        .layers {
          position: absolute;
          width: 100%;
          height: 100%;

          ul {
            width: 5.5rem;
            position: absolute;
            bottom: -10rem;
            left: 0;
            border: #fff solid 0.0625rem;
            box-sizing: border-box;
            background: #fafafa;

            li a {
              display: block;
              border-bottom: #b1a6a6 solid 0.0625rem;
              line-height: 1.875rem;
              color: #008000;
              font-size: 14px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              padding: 0 0.375rem;
            }

            li:last-of-type a {
              border-bottom: #b1a6a6 solid 0;
            }
          }
        }
      }

      .footli:last-child .layers ul {
        // left: -1.25rem !important;
        .corner {
          // left: 68%;
        }

        .corner2 {
          // left: 68%;
        }
      }

      .footli:nth-child(1) .menust {
        border-left: 0;
      }
    }

    .corner {
      position: absolute;
      bottom: -1.25rem;
      left: 50%;
      z-index: 998;
      width: 0;
      height: 0;
      border-width: 0.625rem;
      border-style: solid dashed dashed;
      border-left-color: transparent;
      border-right-color: transparent;
      border-bottom-color: transparent;
      font-size: 0;
      line-height: 0;
      margin-left: -0.625rem;
    }

    .corner2 {
      position: absolute;
      bottom: -1rem;
      left: 50%;
      z-index: 999;
      margin-left: -0.5rem;
      width: 0;
      height: 0;
      border-width: 0.5rem;
      border-style: solid dashed dashed;
      border-left-color: transparent;
      border-right-color: transparent;
      border-bottom-color: transparent;
      font-size: 0;
      line-height: 0;
    }

    .mint-tab-item-label {
      font-size: 16px;
      color: #8f9295;
    }

    .is-selected,
    .is-selected .fa,
    .index,
    .index .fa {
      color: #f15353;
    }

    .fa:nth-child(1) {
      font-size: 1.5rem;
    }

    .fa {
      font-size: 1.375rem;
      padding-bottom: 0.1875rem;
      color: #8f9295;
    }
  }

  .pcStyle #allli {
    width: 375px !important;
    left: 50%;
    margin-left: -187.5px;
  }

  .iphoneXStyle #allli {
    padding-bottom: 24px;
  }

  .laye {
    display: block;
  }
</style>
