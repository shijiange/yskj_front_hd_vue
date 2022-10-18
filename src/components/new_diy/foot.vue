<template>
  <div :class=className>

    <div v-html="css"></div>

    <div v-if="isChoose !== '/category' && isChoose !== '/cart' && isChoose !== '/member/extension'" :style="{height: fun.isIphoneX() ? 84 +'px' : 50 +'px'}"></div>

    <div v-if="show" class="advertising-preview" :style="{width: clientWidth+'px'}" :class="[fun.isIphoneX() ? 'iphoneXStyle' : '']">
      <ul class="weixin-menu" id="weixin-menu" :style="{width: clientWidth+'px'}">
        <li :key="i"
          v-for="(btn, i) in menu_button"
          class="menu-item" :style="{maxWidth: 100/menu_button.length+'%'}"
          :class="{ current: isChoose == urlParse(btn.link) || page_id == urlParse(btn.link)}"
          @click="selectedMenu(i, btn)"
        >
          <div class="menu-item-title" :style="{lineHeight:(tab_style.icon_set.icon_position=='top' && tab_style.text_set.text_show && btn.isIcon != '3'?'25px':'50px'),paddingTop: tab_style.icon_set.icon_position=='top' ? '2px' :''}">
            <i class="menu-icon iconfont" v-if="btn.isIcon == '1'&& tab_style.icon_set.icon_show" :class="[btn.isIcon == '1'?btn.icon||'icon-fenlei4':'']"></i>
            <img class="icon-img" v-if="btn.isIcon == '2'&& tab_style.icon_set.icon_show" :src="btn.image|| emptyImage" alt="">
            <div class="hide-box" v-if="tab_style.icon_set.icon_position=='top'&& btn.isIcon != '3'" style="height: 10px;"></div>
            <span class="menu-text" v-if="tab_style.text_set.text_show" :style="{display: (tab_style.icon_set.icon_position=='top'?'block':''), marginLeft: (tab_style.icon_set.icon_position=='top'?'':'2px')}">{{ btn.text}}</span>
          </div>
          <div class="minLink" v-if="btn.isMinApp == 2 && btn.sub_button && btn.sub_button.length <= 0" @click.stop v-html="btn.html"></div>
          <ul class="weixin-sub-menu" v-show="selectedMenuIndex === i && btn.sub_button && btn.sub_button.length > 0">
            <li :key="i2"
              v-for="(sub, i2) in btn.sub_button"
              class="menu-sub-item"
              :class="{current: isChoose == urlParse(sub.link) || page_id == urlParse(sub.link)}"
              @click.stop="selectedSubMenu(i2, sub)"
            >
              <div class="menu-item-title" :style="{lineHeight:(tab_style.icon_set.icon_position=='top' && tab_style.icon_set.icon_show && tab_style.text_set.text_show && sub.isIcon != '3'?'25px':'50px'),paddingTop: tab_style.icon_set.icon_position=='top' ? '2px' :''}">
                <i class="menu-icon iconfont" v-if="sub.isIcon == '1'&& tab_style.icon_set.icon_show" :class="[sub.isIcon == '1'?sub.icon||'icon-fenlei4':'']"></i>
                <img class="icon-img" v-if="sub.isIcon == '2' && tab_style.icon_set.icon_show" :src="sub.image|| emptyImage" alt="">
                <span class="menu-text" v-if="tab_style.text_set.text_show" :style="{display:(tab_style.icon_set.icon_position=='top'?'block':''), marginLeft: (tab_style.icon_set.icon_position=='top'?'':'2px')}">{{sub.text}}</span>
              </div>
              <div class="minLink" v-if="sub.isMinApp == 2" @click.stop v-html="sub.html"></div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import emptyImage from "../../assets/images/new_diy/image.png";

const css = function () {

  if(this.datas) {
    const {tab_style} = this.datas;
    return  `
	      .component-${this.id} .menu-item .menu-item-title span{
	          color: ${tab_style.value.text_set.text_color || '#333333'};
	      }

	      .component-${this.id} .menu-item.current .menu-item-title span{
	          color: ${tab_style.value.text_set.text_choose_color || '#333333'};
	      }

	      .component-${this.id} .menu-item .menu-item-title .iconfont{
	          color: ${tab_style.value.icon_set.icon_color || '#333333'};
	          display: ${tab_style.value.icon_set.icon_show? '':'none'};
	      }

	      .component-${this.id} .menu-item.current .menu-item-title .iconfont{
	          color: ${tab_style.value.icon_set.icon_choose_color || '#333333'};
	          display: ${tab_style.value.icon_set.icon_show? '':'none'};
	      }

	      .component-${this.id} .menu-item .menu-item-title .hide-box {
	          display: ${tab_style.value.icon_set.icon_show? 'none':''};
	      }

	      .component-${this.id} .menu-item.current .menu-item-title  .hide-box {
	          display: ${tab_style.value.icon_set.icon_show? 'none':''};
	      }

	      .component-${this.id} .advertising-preview {
	          background-color: ${tab_style.value.bg_set.bg_color || '#ffffff'};
	      }

	      .component-${this.id} .advertising-preview .menu-item {
	          background-color: ${tab_style.value.bg_set.bg_color || '#ffffff'};
	          border: ${tab_style.value.border_set.border_show?'1':'0'}px solid ${tab_style.value.border_set.border_color || '#333333'};
	      }

	      .component-${this.id} .advertising-preview .menu-item.current {
	          background-color: ${tab_style.value.bg_set.bg_choose_color || '#ffffff'};
	          border: ${tab_style.value.border_set.border_show?'1':'0'}px solid ${tab_style.value.border_set.border_choose_color || '#333333'};
	      }

	      .component-${this.id} .advertising-preview .menu-sub-item {
	          border: ${tab_style.value.border_set.border_show?'1':'0'}px solid ${tab_style.value.border_set.border_color || '#333333'};
            border-bottom: ${tab_style.value.border_set.border_show?'2':'0'}px solid ${tab_style.value.border_set.border_color || '#333333'};

	      }
	      .component-${this.id} .advertising-preview .menu-sub-item.current {
	          border: ${tab_style.value.border_set.border_show?'1':'0'}px solid ${tab_style.value.border_set.border_choose_color || '#333333'};
            border-bottom: ${tab_style.value.border_set.border_show?'2':'0'}px solid ${tab_style.value.border_set.border_choose_color || '#333333'};
	      }

	      .component-${this.id} .advertising-preview .weixin-sub-menu .menu-sub-item .menu-item-title {
	        background-color: ${tab_style.value.children_set.children_bg_color || '#ffffff'};
	      }

	      .component-${this.id} .advertising-preview .weixin-sub-menu .menu-sub-item .menu-item-title span,
	      .component-${this.id} .advertising-preview .weixin-sub-menu .menu-sub-item .menu-item-title i{
	        color: ${tab_style.value.children_set.children_color || '#333333'};
	      }

	      .component-${this.id} .advertising-preview .weixin-sub-menu .menu-sub-item.current .menu-item-title span,
	      .component-${this.id} .advertising-preview .weixin-sub-menu .menu-sub-item.current .menu-item-title i{
	        color: ${tab_style.value.children_set.children_choose_color || '#333333'};
	      }
    `;
  }

};

const defaultData = {
  page_info: {"group_title":{"title":"首页","type":"text","value":"默认"},"button_item":{"title":"","type":"bottomItem","choose":"2","menu_button":[{"id":0,"text":"首页","image":"","icon":"icon-fontclass-shouye","isIcon":"1","link":"/addons/yun_shop/?menu#/home?i=","isMinApp":"1","gh_id":"","minApp_link":"","sub_button":[], "isDefault": true, "url": 'home'},{"id":1,"text":"分类","image":"","icon":"icon-fontclass-fenlei","isIcon":"1","link":"/addons/yun_shop/?menu#/category?i=","isMinApp":"1","gh_id":"","minApp_link":"","sub_button":[], "isDefault": true, "url": 'category'},{"id":2,"text":"推广","image":"","icon":"icon-fontclass-tuiguang1","isIcon":"1","link":"/addons/yun_shop/?menu#/member/extension?i=","isMinApp":"1","gh_id":"","minApp_link":"","sub_button":[], "isDefault": true, "url": 'extension'},{"id":3,"text":"购物车","image":"","icon":"icon-fontclass-gouwuche1","isIcon":"1","link":"/addons/yun_shop/?menu#/cart?i=","isMinApp":"1","gh_id":"","minApp_link":"","sub_button":[], "isDefault": true, "url": 'cart'},{"id":4,"text":"会员中心","image":"","icon":"icon-fontclass-huiyuanzhongxin","isIcon":"1","link":"/addons/yun_shop/?menu#/member?i=","isMinApp":"1","gh_id":"","minApp_link":"","sub_button":[], "isDefault": true, "url": 'member'}],"value":{}},"tab_style":{"title":"","type":"tab","value":{"text_set":{"text_show":true,"text_color":"#333333","text_choose_color":"#ff4949"},"icon_set":{"icon_show":true,"icon_position":"top","icon_color":"#333333","icon_choose_color":"#ff4949"},"border_set":{"border_show":false,"border_color":"#e7e7eb","border_choose_color":"#29ba9c"},"bg_set":{"bg_color":"#ffffff","bg_choose_color":"#ffffff"},"children_set":{"children_color":"#333333","children_choose_color":"#29ba9c","children_bg_color":"#ffffff"}}}}
};

const companyData = {
  // page_info: {"group_title":{"title":"企业微信侧边栏","type":"text","value":"默认"},"button_item":{"title":"","type":"bottomItem","choose":"2","menu_button":[{"id":0,"text":"首页","image":"","icon":"icon-fontclass-shouye2","isIcon":"1","link":"/addons/yun_shop/?menu#/workWechatSidebar/index?i=","isMinApp":"1","gh_id":"","minApp_link":"","sub_button":[], "isDefault": true, "url": 'sidebarIndex'},{"id":1,"text":"客户","image":"","icon":"icon-massage_client","isIcon":"1","link":"/addons/yun_shop/?menu#/workWechatSidebar?i=","isMinApp":"1","gh_id":"","minApp_link":"","sub_button":[], "isDefault": true, "url": 'workWechatSidebar'},{"id":3,"text":"我的","image":"","icon":"icon-fontclass-huiyuanzhongixn","isIcon":"1","link":"/addons/yun_shop/?menu#/member?i=","isMinApp":"1","gh_id":"","minApp_link":"","sub_button":[], "isDefault": true, "url": 'member'}],"value":{}},"tab_style":{"title":"","type":"tab","value":{"text_set":{"text_show":true,"text_color":"#333333","text_choose_color":"#ff4949"},"icon_set":{"icon_show":true,"icon_position":"top","icon_color":"#333333","icon_choose_color":"#ff4949"},"border_set":{"border_show":false,"border_color":"#e7e7eb","border_choose_color":"#29ba9c"},"bg_set":{"bg_color":"#ffffff","bg_choose_color":"#ffffff"},"children_set":{"children_color":"#333333","children_choose_color":"#29ba9c","children_bg_color":"#ffffff"}}}}
  page_info: {"group_title":{"title":"企业微信侧边栏","type":"text","value":"默认"},"button_item":{"title":"","type":"bottomItem","choose":"2","menu_button":[{"id":0,"text":"首页","image":"","icon":"icon-fontclass-shouye2","isIcon":"1","link":"/addons/yun_shop/?menu#/workWechatSidebar/index?i=","isMinApp":"1","gh_id":"","minApp_link":"","sub_button":[], "isDefault": true, "url": 'sidebarIndex'},{"id":1,"text":"客户","image":"","icon":"icon-massage_client","isIcon":"1","link":"/addons/yun_shop/?menu#/workWechatSidebar?i=","isMinApp":"1","gh_id":"","minApp_link":"","sub_button":[], "isDefault": true, "url": 'workWechatSidebar'}],"value":{}},"tab_style":{"title":"","type":"tab","value":{"text_set":{"text_show":true,"text_color":"#333333","text_choose_color":"#ff4949"},"icon_set":{"icon_show":true,"icon_position":"top","icon_color":"#333333","icon_choose_color":"#ff4949"},"border_set":{"border_show":false,"border_color":"#e7e7eb","border_choose_color":"#29ba9c"},"bg_set":{"bg_color":"#ffffff","bg_choose_color":"#ffffff"},"children_set":{"children_color":"#333333","children_choose_color":"#29ba9c","children_bg_color":"#ffffff"}}}}
};

export default {
  props: ['id', 'diydatas', 'foot_type'],
  data() {
    return {
      seletedId: '',  //当前选中菜单id
      selectedMenuIndex: "", //当前选中菜单索引
      selectedSubMenuIndex: "", //当前选中子菜单索引
      clientWidth: '375',
      show: true,
      emptyImage,
      defaultData,
      companyData
    };
  },
  watch: {
    menu_button: {
      handler(newValue, oldValue) {
        this.$nextTick(()=>{
          if(this.menu_button.length> 0 && !this.menu_button[0].html) {
            this.initMenuButton();
          }
        });
      },
      deep: true
    },
    isChoose(val) {
      this.selectedMenuIndex = "";
    },
    datas: {
      handler(newValue, oldValue) {
        this.show = true;
        if(this.isChoose === '/home') {
          // 首页有三种情况
          if(this.$store.state.temp.item.foot_type == -1) {
            // 不显示
            this.show = false;
          }else if(this.$store.state.temp.item.foot_type == 2) {
            // 显示自定义的底部导航
            if(this.$store.state.temp.item.foot instanceof Array) {
              this.show = false;
            }
          }
        }
      },
      deep: true
    }
  },
  computed: {
    isChoose() {
      return this.$route.path;
    },
    page_id() {
      return this.fun.getKey("page_id");
    },
    datas() {
      // JSON.parse(this.$store.state.temp.item.foot.page_info)  首页的导航
      // JSON.parse(this.$store.state.temp.item.menus.page_info)  列表默认的导航
      // defaultData  系统默认导航  写死的

      if(this.diydatas) {
        if(this.diydatas.defaultData) {
          return this.defaultData.page_info;
        }else {
          // console.log(this.diydatas,this.fun.isCPS(),'isCPS');   // 装修的导航
          return this.diydatas;
        }
      }else {
        if(this.isChoose === '/home') {
          // 首页有三种情况
          if(this.$store.state.temp.item.foot_type == -1) {
            // 不显示
            return [];
          }else if(this.$store.state.temp.item.foot_type == 1) {
            // 显示默认
            if(!this.$store.state.temp.item.menus) {
              // 显示系统默认
              return this.defaultData.page_info;
            }else {
              // 显示列表设置的默认
              return JSON.parse(this.$store.state.temp.item.menus.page_info);
            }
          }else if(this.$store.state.temp.item.foot_type == 2) {
            // 显示自定义的底部导航
            if(this.$store.state.temp.item.foot instanceof Array) {
              return [];
            }else {
              return this.$store.state.temp.item.foot && this.$store.state.temp.item.foot.page_info
                ? JSON.parse(this.$store.state.temp.item.foot.page_info): this.defaultData.page_info;
            }
          }else {
            // 什么都没开启的情况下显示新的默认
            if(!this.$store.state.temp.item.menus || this.$store.state.temp.item.menus.length <= 0) {
              // 显示系统默认
              return this.defaultData.page_info;
            }else {
              // 显示列表设置的默认
              return JSON.parse(this.$store.state.temp.item.menus.page_info);
            }
          }
        }else {
          // 非首页的有两种情况

          // 之前的判断 this.fun.getKey("client") === "work" || window.localStorage.getItem("client")
          let showCompanyBarPage = ["workWechatSidebar", "sidebarIndex", "sideOrderdetail"];
          if(showCompanyBarPage.includes(this.$route.name)) {
            // 显示企业微信默认
            return this.companyData.page_info;
          }else  if(!this.$store.state.temp.item.menus) {
            // 显示系统默认
            return this.defaultData.page_info;
          }else {
            // console.log(this.$store.state.temp.item.menus.page_info)
            // 显示列表设置的默认
            return JSON.parse(this.$store.state.temp.item.menus.page_info);
          }
        }
      }

    },
    menu_button() {
      if(this.datas) {
        return this.datas.button_item.menu_button || {};
      }else {
        return {};
      }

    },
    tab_style() {
      if(this.datas) {
        return this.datas.tab_style.value;
      }else {
        return {};
      }
    },
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },
  activated() {
    if(this.fun.getPhoneEnv() == 3) {
      this.clientWidth = 375;
    }else {
      this.clientWidth = document.body.clientWidth;
    }
  },
  mounted() {
    if(this.fun.getPhoneEnv() == 3) {
      this.clientWidth = 375;
    }else {
      this.clientWidth = document.body.clientWidth;
    }
    this.$nextTick(()=>{
      if(this.datas) {
        this.initMenuButton();
      }
    });
  },
  methods: {
    initMenuButton() {
      this.show = false;

      for(let i = 0;i<this.menu_button.length; i++) {
        let script = document.createElement('script');
        script.type = 'text/wxtag-template';
        script.text = `<div style="width: ${this.clientWidth/this.menu_button.length}px;height: 50px;"></div>`;
        this.menu_button[i].html = `<wx-open-launch-weapp username="${this.menu_button[i].gh_id}" path="${this.menu_button[i].minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;

        for(let j=0; j<this.menu_button[i].sub_button.length; j++) {
          let script = document.createElement('script');
          script.type = 'text/wxtag-template';
          script.text = `<div style="width: ${this.clientWidth/this.menu_button.length}px;height: 50px;"></div>`;
          this.menu_button[i].sub_button[j].html = `<wx-open-launch-weapp username="${this.menu_button[i].sub_button[j].gh_id}" path="${this.menu_button[i].sub_button[j].minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;
        }
      }
      this.menu_button.reverse().reverse(); //改变原始数组从而更新数组
      this.show = true;
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
      zhuge.track('点击底部导航栏',{
        '选项名称':item.text
      });
      console.log(i);
      console.log(item);
      this.selectedSubMenuIndex = "";

      if(this.selectedMenuIndex === i) {
        this.selectedMenuIndex = '';
        return;
      }

      this.selectedMenuIndex = i;
      let selectedMenu = this.menu_button[this.selectedMenuIndex];
      if(selectedMenu) {
        this.seletedId = selectedMenu.id;
      }

      if (item.sub_button.length <= 0) {
        if(this.fun.isCPS() && this.fun.isCPSAPPI() && item.isMinApp == '6') {
          let json = item.app_link;
          // console.log(json)
          if (this.fun.isIosOrAndroid() === "ios") {
            toAPPUrlIOS({ body: "toAPPUrlIOS", json: JSON.stringify(json) });
          } else {
            toAPPUrlAndroid(JSON.stringify(json));
          }
        }else if(item.link && item.link !== window.location.href) {
          if(item.isDefault) {
            this.$router.push(this.fun.getUrl(item.url));
          }else {
            if(this.fun.getKeyByMid()){
              window.location.href = this.fun.changeURLArg(item.link, "mid", this.fun.getKeyByMid());
              return;
            }
            window.location.href = item.link;
          }
        }
      }
    },
    //选中子菜单
    selectedSubMenu(i, item) {
      this.selectedSubMenuIndex = i;
      let selectedSubMenu = this.menu_button[this.selectedMenuIndex].sub_button[this.selectedSubMenuIndex];
      this.seletedId = selectedSubMenu.id;

      if(this.fun.isCPS() && this.fun.isCPSAPPI() && item.isMinApp == '6') {
        let json = item.app_link;
        // console.log(json)
        if (this.fun.isIosOrAndroid() === "ios") {
          toAPPUrlIOS({ body: "toAPPUrlIOS", json: JSON.stringify(json) });
        } else {
          toAPPUrlAndroid(JSON.stringify(json));
        }
      }else if (item.link && item.link !== window.location.href) {
        if(this.fun.getKeyByMid()){
          window.location.href = this.fun.changeURLArg(item.link, "mid", this.fun.getKeyByMid());
          return;
        }
        window.location.href = item.link;
      }
    },
    //选中菜单级别
    selectedMenuLevel() {
      if (this.selectedMenuIndex !== "" && this.selectedSubMenuIndex === "") {
        //主菜单
        return 1;
      } else if ( this.selectedMenuIndex !== "" && this.selectedSubMenuIndex !== "" ) {
        //子菜单
        return 2;
      } else {
        //未选中任何菜单
        return 0;
      }
    },
    urlParse(urls, isChoose) {
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
  },
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
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    width: 100%;
  }

  .advertising-preview.iphoneXStyle {
    padding-bottom: 34px;
  }

  .advertising-preview .weixin-menu {
    /* border-top: 1px solid #e7e7e7; */
    // background: transparent url({{ plugin_assets('wechat', 'assets/images/menu_foot.png') }}) no-repeat 0 0;

    /* background-position: 0 0; */

    /* background-repeat: no-repeat; */
    // padding-left: 43px;
    margin-bottom: 0;
    display: flex;
  }

  /* 一级 */
  .advertising-preview .weixin-menu .menu-item {
    max-width: 100%;
    position: relative;
    // float: left;
    line-height: 50px;
    height: 50px;
    text-align: center;
    // width: 20%;
    flex: 1;

    /* border-left: 1px solid #e7e7e7; */

    /* border-right: 1px solid #e7e7e7; */
    cursor: pointer;
    color: #616161;
  }

  /* 二级 */
  .advertising-preview .weixin-sub-menu {
    position: absolute;
    bottom: 51px;
    left: -1px;
    width: 100%;

    /* border-top: 1px solid #d0d0d0; */
    background: #fafafa;
    display: block;
    padding: 0;
    z-index: -1;
  }

  .advertising-preview .weixin-sub-menu .menu-sub-item {
    line-height: 50px;
    height: 50px;
    text-align: center;
    width: 100%;

    /* border: 1px solid #d0d0d0; */
    cursor: pointer;
    position: relative;
    color: #616161;
    box-sizing: content-box;
  }

  .advertising-preview .menu-arrow {
    position: absolute;
    left: 50%;
    margin-left: -6px;
  }

  .advertising-preview .arrow_in {
    bottom: -4px;
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 6px 6px 0;
    border-style: solid dashed dashed;
    border-color: #fafafa transparent transparent;
  }

  .advertising-preview .arrow_out {
    bottom: -5px;
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 6px 6px 0;
    border-style: solid dashed dashed;
    border-color: #d0d0d0 transparent transparent;
  }

  .advertising-preview .menu-item .menu-item-title,
  .advertising-preview .menu-sub-item .menu-item-title {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
    padding-top: 1px;
  }

  .advertising-preview .menu-item .menu-item-title span,
  .advertising-preview .menu-sub-item .menu-item-title span {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }

  .advertising-preview .weixin-sub-menu.show {
    display: block;
  }

  .advertising-preview .icon_menu_dot {
    // background: url({{ plugin_assets('wechat', 'assets/images/plus.png') }}) 0px -36px no-repeat;
    width: 7px;
    height: 7px;
    vertical-align: middle;
    display: inline-block;
    margin-right: 2px;
    margin-top: -2px;
  }

  .advertising-preview .icon14_menu_add {
    // background: url({{ plugin_assets('wechat', 'assets/images/plus.png') }}) 0px 0px no-repeat;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    display: inline-block;
    margin-top: -2px;
  }

  .icon-img {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -2px;
  }

  .menu-icon {
    font-size: 20px;
    vertical-align: sub;
  }

  .minLink {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .menu-text {
    font-size: 15px;
  }
</style>
