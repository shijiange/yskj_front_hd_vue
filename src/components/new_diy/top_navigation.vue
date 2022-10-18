<template>
  <div :class=className>
    <!-- style -->
    <div v-html="css"></div>

    <div :style="{height: datas.show_search.value? datas.search_height.value + ( datas.title_list.value && datas.title_list.value.length > 0 ? datas.title_height.value - 1 : 0) +'px': datas.title_height.value +'px'}"></div>

    <div class="advertising-preview" :style="{width: clientWidth+'px',top: isfollow?'2.875rem':''}">

        <template v-if="datas.show_search.value">
          <div class="weixin-title" :class="[{ hidestyle: amout && datas.scroll_hide_search.value }]" v-if="datas.logo_style.value == 1">
            <div class="weixin-logo-one" v-if="datas.show_logo.value">
              <img :src="datas.logo.value || emptyImage" @click="gotoUrl">
            </div>
            <div class="weixin-sousuo" @click="tosearch"
                 :class="{ 'w': datas.choose_search_style.value==3,
                     'center': datas.choose_search_style.value==2,
                     'padding':datas.choose_search_style.value==3  }">
              <i class="iconfont icon-all_search_2"
                 v-if="datas.choose_search_style.value==1||datas.choose_search_style.value==2"></i>
              <div>{{datas.search_title.value}}</div>
            </div>
            <span v-if="datas.choose_search_style.value==3"  @click="tosearch"
                  :class="{ 'borderOne': datas.choose_search_style.value==3}"
                  class="block">搜索</span>
          </div>
          <div class="weixin-title" :class="[{ hidestyle: amout && datas.scroll_hide_search.value }]" v-else>
              <span v-if="datas.choose_search_style.value==3" @click="tosearch"
                    :class="{ 'borderTwo': datas.choose_search_style.value==3}"
                    class="block">搜索</span>
            <div class="weixin-sousuo" @click="tosearch"
                 :class="{ 'w': datas.choose_search_style.value==3,
                     'center': datas.choose_search_style.value==2,
                     'padding':datas.choose_search_style.value==3 }">
              <i class="iconfont icon-all_search_2"
                 v-if="datas.choose_search_style.value==1||datas.choose_search_style.value==2"></i>
              <div>{{datas.search_title.value}}</div>
            </div>
            <div class="weixin-logo-two" v-if="datas.show_logo.value">
              <img :src="datas.logo.value || emptyImage"  @click="gotoUrl">
            </div>
          </div>
        </template>

        <div class="weixin-bd" v-if="datas.title_list.value && datas.title_list.value.length > 0">
          <ul class="weixin-menu" :style="{fontWeight: datas.title_style.value.includes('1')?'bold':'', fontStyle: datas.title_style.value.includes('2')?'italic':''}" id="weixin-menu" :class="{ 'scroll': true, 'not-pc-style' : fun.getPhoneEnv() != 3 }">
            <li v-for="(btn, i) in datas.title_list.value" :key="i"
                class="menu-item"
                @click="selectedMenu(i, btn)">
              <div class="menu-item-title" v-if="btn.is_minApp == 1"
                   :class="{'current':  isChoose == urlParse(btn.h5_link) || page_id == urlParse(btn.h5_link)}">
                <img v-if="datas.choose_style.value == '2'" :src="btn.image || emptyImage">
                <span>{{ btn.text}}</span>
              </div>
              <div class="menu-item-title" v-if="btn.is_minApp == 2" @click.stop v-html="btn.html">
              </div>
            </li>
          </ul>
        </div>

    </div>

  </div>
</template>

<script>
import emptyImage from "../../assets/images/new_diy/image.png";

const css = function () {
  const {
    title_height,
    title_size,
    choose_title_color,
    title_bg_color,
    title_color,
    navigate_color,
    preview_color,
    search_color,
    font_color,
    search_height,
    border_style,
    border_color,
    search_border_radius,
    border_radius,
  } = this.datas;

  return `
		    .component-${this.id} .weixin-title{
            height: ${search_height.value}px;
            background-color: ${preview_color.value || '#ffffff'};
	      }

	      .component-${this.id} .weixin-sousuo {
	          background-color: ${search_color.value};
	          color: ${font_color.value};
	          border-radius: ${search_border_radius.value}px;
            border: solid  ${border_style.value}px ${border_color.value};
	      }
	      .component-${this.id} .weixin-logo-one img, .component-${this.id} .weixin-logo-two img{
	          border-radius: ${border_radius.value}px;
	      }

        .component-${this.id} .advertising-preview .weixin-menu{
            height: ${title_height.value}px;
            font-size: ${title_size.value}px;
            color: ${title_color.value || '#333333'};
            background-color: ${navigate_color.value || '#ffffff'};
        }
        .component-${this.id} .advertising-preview .weixin-menu .menu-item {
            height: ${title_height.value}px;
            line-height: ${title_height.value}px;
        }
        .component-${this.id} .advertising-preview .weixin-menu .current{
            color: ${choose_title_color.value || '#333333'};
            background-color: ${title_bg_color.value || '#ffffff'};
        }

    `;
};

export default {
  props: ['id', 'datas', 'isfollow'],
  data() {
    return {
      amout: false,
      selectedMenuIndex: 0,
      clientWidth: '375',
      emptyImage,
      isChoose: "",
      page_id: "",
    };
  },

  computed: {
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },
  watch: {
    $route(to, from) {
      this.isChoose = to.path;
      this.page_id = this.fun.getKey("page_id");
    }
  },
  mounted() {
    this.isChoose = this.$route.path;
    this.page_id = this.fun.getKey("page_id");
    if(this.fun.getPhoneEnv() == 3) {
      this.clientWidth = 375;
    }else {
      this.clientWidth = document.body.clientWidth;
    }
    this.slider();
    this.$nextTick(()=>{
      this.initButtons();
    });
  },
  activated() {
    this.isChoose = this.$route.path;
    this.page_id = this.fun.getKey("page_id");
    if(this.fun.getPhoneEnv() == 3) {
      this.clientWidth = 375;
    }else {
      this.clientWidth = document.body.clientWidth;
    }
    this.slider();
    this.$nextTick(()=>{
      this.initButtons();
    });
  },
  methods: {
    initButtons() {
      for(let j=0; j<this.datas.title_list.value.length; j++) {
        let script = document.createElement('script');
        script.type = 'text/wxtag-template';
        script.text = `<img style="display: ${this.datas.choose_style.value == '2'?'inline-block':'none'};margin: 0 auto;width: 20px; height: 20px; align-self: center; vertical-align: middle; line-height: ${this.datas.title_height.value}px;"  src="${this.datas.title_list.value[j].image || emptyImage}" alt="图标"/><span style="font-size: 14px;margin-left: 5px; display: inline-block; vertical-align: middle;line-height: ${this.datas.title_height.value}px;">${ this.datas.title_list.value[j].text }</span>`;

        this.datas.title_list.value[j].html = `<wx-open-launch-weapp username="${this.datas.title_list.value[j].gh_id}" path="${this.datas.title_list.value[j].minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;
      }
      this.datas.title_list.value.reverse().reverse(); //改变原始数组从而更新数组
    },
    slider() {
      let that = this;
      window.onscroll = function() {
        let top = document.documentElement.scrollTop || document.body.scrollTop;
        top < 90 ? (that.amout = false) : (that.amout = true);
      };
    },
    tosearch() {      
      this.$router.push(
        this.fun.getUrl("search", {
          fromHome: 1
        })
      );
    },
    gotoUrl(){
      let _data = this.datas.notice_link && this.datas.notice_link.value || {};
      if(Number(_data.is_h5) == 2 && this.fun.isApp()) {
        YDB.MiniWX(_data.gh_id, _data.minApp_link);
        return;
      }
      // if(item.is_minApp == 2 &&  this.fun.isCPS()) {
      //   let json = {
      //     mini_route: item.minApp_link,
      //     mini_id: item.gh_id,
      //   };
      //   if (this.fun.isIosOrAndroid() === "ios") {
      //     miniWXIOS({ body: "miniWXIOS", json: JSON.stringify(json) });
      //   } else {
      //     miniWXAndroid(JSON.stringify(json));
      //   }
      //   return;
      // }
      if(Number(_data.is_h5) == 1 && _data.link) {
        window.location.href = _data.link;
      }
    },
    /**
       * 处理数据
       * @param {String} datas
       * **/
    handle_data(datas) {
      let handleDatas = {};
      Object.keys(datas).map(key => {
        handleDatas[key] = datas[key].value;
      });
      return handleDatas;
    },
    //选中主菜单
    selectedMenu(i, item) {
      this.selectedMenuIndex = i;

      if (item.h5_link && item.h5_link !== window.location.href) {
        window.location.href = this.fun.changeURLArg(item.h5_link, "mid", this.fun.getKeyByMid());
      }
    },
    urlParse(urls) {
      if (urls != undefined) {
        //http://umeiga.com/addons/yun_shop/?menu#/cart?i=8
        //   url= >   /cart?
        var url = urls.match(/#\/(\S*)\?i=/);
        if (url instanceof Array && url[1] != undefined) {
          let newUrl = "/" + url[1];
          if (this.isChoose == '/newDiy') {
            // 装修页面高亮
            if (this.page_id) {
              return (new RegExp("[?|&]page_id=" + "([^&;]+?)(&|#|;|$)").exec(urls) || [,""])[1].replace(/\+/g, "%20"); //定义正则表达式
            } else {
              return "-1";
            }
          }else if (url != undefined) {
            // 匹配路由
            if (newUrl == this.isChoose) {
              return newUrl;
            } else {
              return "-1";
            }
          }else {
            return "-1";
          }
        } else {
          // 装修页面高亮
          if (this.isChoose == '/newDiy' && this.page_id) {
            return (new RegExp("[?|&]page_id=" + "([^&;]+?)(&|#|;|$)").exec(urls) || [,""])[1].replace(/\+/g, "%20"); //定义正则表达式
          } else {
            return "-1";
          }
        }
      } else {
        return "";
      }
    },
  }
};
</script>

<style lang="scss" scoped>
  * {
    box-sizing: border-box;
  }

  ul {
    padding: 0;
  }

  li {
    list-style: none;
  }

  .component-wrapper {
    position: relative;
  }

  .advertising-preview {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 170;
    width: 100%;
  }

  .advertising-preview .weixin-bd {
    margin-top: -1px;
  }

  .advertising-preview .weixin-menu {
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
  }

  /* 修改滚动条样式 */
  .advertising-preview .weixin-menu::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .advertising-preview .weixin-menu::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
  }

  .advertising-preview .weixin-menu::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
  }

  .advertising-preview .weixin-menu::-webkit-scrollbar-thumb:hover {
    background: #29ba9c;
  }

  .advertising-preview .weixin-menu::-webkit-scrollbar-corner {
    background: rgb(239, 239, 239);
  }

  .advertising-preview .weixin-menu.not-pc-style::-webkit-scrollbar { display: none; }

  /* 一级 */
  .advertising-preview .weixin-menu .menu-item {
    flex: 1;
    position: relative;
    line-height: 36px;
    height: 36px;
    text-align: center;

    /* min-width: 25%; */
    cursor: pointer;
    display: inline-block;
    box-sizing: border-box;

    .menu-item-title {
      padding: 0 12px;

      /* white-space: nowrap; */

      /* text-overflow: ellipsis; */

      /* overflow: hidden; */

      /* word-break: break-all; */
      text-align: center;

      img {
        width: 20px;
        height: 20px;
        align-self: center;
        display: inline-block;
        vertical-align: middle;
      }

      span {
        margin-left: 5px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }

  .menu-item-delete {
    position: absolute;
    top: 0;
    right: 3px;
    font-size: 12px;
  }

  .weixin-title {
    height: 50px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;

    .weixin-logo-one {
      margin-right: 10px;
      box-sizing: border-box;

      /* border: solid 1px #ccc; */
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 30px;
      }
    }

    .weixin-logo-two {
      margin-left: 10px;
      box-sizing: border-box;

      /* border: solid 1px #ccc; */
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 30px;
      }
    }

    .weixin-sousuo {
      width: 80%;
      height: 30px;

      /* background-color: #f3f2f2; */
      position: relative;
      display: flex;
      align-items: center;

      i {
        font-size: 14px;
        display: inline-block;
        margin-right: 10px;
        margin-left: 10px;
      }
    }

    &.hidestyle {
      margin-top: -50px;
    }
  }

  .block {
    width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f2f2;
  }

  .padding {
    padding-left: 10px;
  }

  .center {
    justify-content: center;
  }

  .borderOne {
    border-left: solid 1px #ccc;
  }

  .borderTwo {
    border-right: solid 1px #ccc;
  }

  .w {
    width: 65% !important;
  }

  .scroll {
    overflow-x: scroll;
    overflow-y: hidden;
  }

  .fix-class {
    position: fixed;
    top: 95px;
    right: 385px;
    width: 80px;
  }
</style>
