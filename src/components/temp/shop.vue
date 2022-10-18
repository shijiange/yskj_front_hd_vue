<template>
  <div id="shop">
    <!-- 样式1 -->
    <div class="fe-mod fe-mod-9" v-show="datas.params.style == 1">
      <img :src="datas.params.bgimg"/>
      <div class="amodmenu" aaaa="datas.params.menu == 1" style="display: none;">
        <ul>
          <li class="fe-mod-9-nav-on"><a :href="datas.data[0]" :style="{'color':datas.params.navcolor}"><i
            class="fa fa-home"></i><br>首页</a></li>
          <li><a :href="datas.data[1]" :style="{'color':datas.params.navcolor}"><i
            class="fa fa-suitcase"></i><br>全部商品</a></li>
          <li><a :href="datas.data[2]" :style="{'color':datas.params.navcolor}"><i class="fa fa-tags"></i><br>促销商品</a>
          </li>
          <li><a :href="datas.data[3]" :style="{'color':datas.params.navcolor}"><i class="fa fa-volume-up"></i><br>店铺公告</a>
          </li>
        </ul>
      </div>
      <div class="fe-mod-9-shopname" v-show="datas.params.name == 1">
        <div class="fe-mod-9-name">{{$store.state.temp.mailInfo.name|| "XX商城"}}</div>
      </div>
      <div class="fe-mod-9-shoplogo" v-show="datas.params.logo == 1">
        <div class="fe-mod-9-shoplogo-img">
          <img :src="$store.state.temp.mailInfo.logo || require('../../assets/images/component-shop.png')"/>
        </div>
      </div>
    </div>
    <!-- 样式2 -->
    <div class="fe-mod fe-mod-10" v-show="datas.params.style == 2">
      <img :src="datas.params.bgimg"/>
      <div class="fe-mod-10-shoplogo" v-show="datas.params.logo == 1">
        <img :src="$store.state.temp.mailInfo.logo || require('../../assets/images/component-shop.png')"/>
      </div>
      <div class="fe-mod-10-shopname" v-show="datas.params.name == 1">{{$store.state.temp.mailInfo.name || "XX商城"}}
      </div>
      <div class="fe-mod-10-menu" aaaa="datas.params.menu == 1" style="display: none;">
        <a :href="datas.data[0]">
          <div class="fe-mod-10-nav">
            <span><i class="fa fa-home" :style="{'color':datas.params.navcolor}"></i></span>
            <nav>首页</nav>
          </div>
        </a>
        <a :href="datas.data[1]">
          <div class="fe-mod-10-nav">
            <span><i class="fa fa-suitcase" :style="{'color':datas.params.navcolor}"></i></span>
            <nav>全部商品</nav>
          </div>
        </a>
        <a :href="datas.data[2]">
          <div class="fe-mod-10-nav">
            <span><i class="fa fa-tags" :style="{'color':datas.params.navcolor}"></i></span>
            <nav>促销商品</nav>
          </div>
        </a>
        <a :href="datas.data[3]">
          <div class="fe-mod-10-nav">
            <span><i class="fa fa-volume-up" :style="{'color':datas.params.navcolor}"></i></span>
            <nav>店铺公告</nav>
          </div>
        </a>
      </div>
    </div>

  </div>
</template>
<script>
var system = [{
  "shop": {
    "style": "default",
    "style_pc": "default",
    "theme": "style",
    "hmenu_name": ["\u9996\u9875", "\u5168\u90e8\u5546\u54c1", "\u5e97\u94fa\u516c\u544a", "\u6210\u4e3a\u5206\u9500\u5546", "\u4f1a\u5458\u4e2d\u5fc3"],
    "hmenu_url": ["http:\/\/hlb.yunzshop.com\/app\/index.php?i=6&c=entry&p=index&do=shop&m=sz_yi", "http:\/\/hlb.yunzshop.com\/app\/index.php?i=6&c=entry&p=list&order=sales&by=desc&do=shop&m=sz_yi", "http:\/\/hlb.yunzshop.com\/app\/index.php?i=6&c=entry&p=notice&do=shop&m=sz_yi", "http:\/\/hlb.yunzshop.com\/app\/index.php?i=6&c=entry&p=commission&m=sz_yi&do=plugin", "http:\/\/hlb.yunzshop.com\/app\/index.php?i=6&c=entry&p=info&do=member&m=sz_yi"],
    "hmenu_id": ["yz01", "yz02", "yz03", "yz04", "yz05"],
    "ispc": "0",
    "pctitle": "",
    "pckeywords": "",
    "pcdesc": "",
    "pccopyright": "",
    "pcadv": "",
    "footercontent": "",
    "index": null,
    "pclogo": "",
    "reglogo": "",
    "fmenu_name": null,
    "fmenu_url": null,
    "fmenu_id": null,
    "reccredit": "",
    "recmoney": "",
    "subcredit": "",
    "submoney": "",
    "paytype": "0",
    "isreferral": "0",
    "templateid": "",
    "subtext": "",
    "entrytext": "",
    "subpaycontent": "",
    "recpaycontent": "",
    "referrallogo": "",
    "catlevel": "3",
    "catshow": 0,
    "catadvimg": "",
    "catadvurl": "",
    "category2": 1,
    "category2name": "\u54c1\u724c",
    "qq": "",
    "address": "\u5e7f\u5dde\u5e02\u5927\u5c71\u65ee\u65ef",
    "phone": "13568992414",
    "description": "\u9632\u5b88\u6253\u6cd5\u516c\u53f8\u52a8\u6001\u4e2a\u4f53\u4e2a\u4eba\u7684\u6587\u6863",
    "levelname": "\u666e\u901a\u4f1a\u5458",
    "levelurl": "",
    "leveltype": "0",
    "term": "1",
    "term_time": "1000",
    "term_unit": "1",
    "isbindmobile": 0,
    "isreferrer": 1,
    "headimg": "",
    "ban_browse": "\u5f53\u524d\u5546\u54c1\u7981\u6b62\u8bbf\u95ee\uff0c\u8bf7\u8054\u7cfb\u5ba2\u670d\u2026\u2026",
    "name": "",
    "cservice": "",
    "img": "",
    "logo": "",
    "signimg": "",
    "diycode": "",
    "copyright": "\u82b8\u4f17",
    "credit": "",
    "credit1": ""
  }, "share": []
}];
export default {
  props: ["datas"],
  data() {
    return {
      system
    };
  },
  mounted() {

  },
  methods: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  #shop {
    img {
      width: 100%;
      vertical-align: middle;
      border: 0;
    }

    .fe-mod {
      height: auto;
      position: relative;
    }

    .amodmenu {
      height: 2.8125rem;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;

      ul {
        display: flex;
        height: 2.8125rem;
        align-items: center;

        li {
          flex: 1;
        }
      }
    }

    .fe-mod-9-nav {
      height: 2.5rem;
      width: 25%;
      padding-top: 0.3125rem;
      float: left;
      text-align: center;
      font-size: 12px;
    }

    .fe-mod-9-nav i {
      font-size: 18px;
    }

    .fe-mod-9-nav-on {
      border-bottom: 0.1875rem solid #dd2322;
      padding-bottom: 0.125rem;
      padding-top: 0.3125rem;
    }

    .fe-mod-9-shopname {
      height: 1.5rem;
      width: 100%;
      position: absolute;
      bottom: 3.4375rem;
      left: 0;
    }

    .fe-mod-9-name {
      height: 1.5rem;
      width: auto;
      background: rgba(0, 0, 0, 0.2);
      line-height: 1.5rem;
      margin: auto;
      display: table;
      border-radius: 1.5rem;
      font-size: 14px;
      color: #fff;
      padding: 0 0.9375rem;
    }

    .fe-mod-9-shoplogo {
      height: 5rem;
      width: 5rem;
      padding: 0.25rem;
      border: 0.0625rem solid #fff;
      border-radius: 2.8125rem;
      margin-left: -2.5rem;
      position: absolute;
      bottom: 5.5rem;
      left: 50%;
    }

    .fe-mod-9-shoplogo-img {
      height: 4.375rem;
      width: 4.375rem;
      border-radius: 4.375rem;
      margin: auto;
      overflow: hidden;
      border: solid 0.0625rem #fff;
    }

    .fe-mod-9-shoplogo-img img {
      border-radius: 50%;
      width: 4.375rem;
      height: 4.375rem;
    }

    .fe-mod-10 {
      min-height: 6.25rem;

      img {
        width: 100%;
      }
    }

    .fe-mod-10-menu {
      height: 2.8125rem;
      padding: 0.3125rem 0 0 5.625rem;
      text-align: center;
      background: #fff;

      a {
        color: inherit;
      }
    }

    .fe-mod-10-nav {
      height: 2.5rem;
      width: 25%;
      float: left;

      span {
        font-size: 18px;
        color: #000;
        line-height: 1.125rem;
      }

      nav {
        font-size: 12px;
      }
    }

    .fe-mod-10-shoplogo {
      height: 4.125rem;
      width: 66px;
      background: #ccc;
      position: absolute;
      left: 0.875rem;
      bottom: 1.375rem;
      border: 0.0625rem solid #fff;
      box-shadow: 0 0 0.125rem rgba(0, 0, 0, 0.1);

      img {
        height: 4rem;
        width: 4rem;
      }
    }

    .fe-mod-10-shopname {
      height: 2.5rem;
      width: auto;
      position: absolute;
      left: 5.625rem;
      bottom: 3.125rem;
      line-height: 2.5rem;
      font-size: 18px;
      color: #fff;
      text-shadow: 0.125rem 0.125rem 0.125rem rgba(0, 0, 0, 0.2);
    }
  }
</style>