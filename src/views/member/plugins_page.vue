<template>
  <div id="member-all">
    <c-title :hide="false" :text="'我的工具'"></c-title>
    <van-tabs v-model="active" scrollspy sticky color="#ffc11e" title-active-color="#ffc11e" v-if="plugin.length > 0">
      <van-tab :title="item.name" v-for="(item, index) in plugin" :key="index">
        <div class="plugins-box">
          <p class="plugins-title">{{item.name}}</p>
          <div class="plugin-items-box">
            <template  v-for="(icon,index) in item.plugin">
              <div class="plugin-items-icon" v-if="icon.url&& notShow.indexOf(icon.url) < 0" :key="icon.name + index" @click="pluginGoto(icon)">
                <i class="iconfont" :class="icon.class"></i>
                <span>{{icon.title}}</span>
              </div>
            </template>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <!--海报部分-->
    <yz-goodsposter v-model="posterShow" :posterData="poster_Data" :defaultImg="poster" :width="`18.875rem`" v-on:finish="uploadImageM"></yz-goodsposter>
    <!--海报部分end-->
  </div>
</template>

<script>
// import { Toast } from "vant";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import { posterMixin } from "../../utils/poster"; //海报
export default {
  mixins: [posterMixin], //加载更多
  data() {
    return {
      active: '1',
      //H5端没有做的入口
      notShow: ["coupons_qrcode"],
      plugin: [],
    };
  },
  activated() {
    if(this.plugin.length <= 0) {
      this.getPlugins();
    }
  },
  components: {
    yzGoodsposter
  },
  methods: {
    getPlugins() {
      $http.get('member.member.more-plugins',{}, 'loading').then((response)=>{
        this.plugin = response.data.plugin;
      });
    },
    pluginGoto(item) {
      if(!item.name) {
        this.$router.push(this.fun.getUrl(item.url, { fromHome: 1 }));
        return;
      }
      if (item.name == "article") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            id: "0"
          })
        );
      } else if (item.url == "liveList") {
        this.$router.push(this.fun.getUrl(item.url, { from: 1 }));
      } else if (item.name == "courier") {
        window.localStorage.setItem("couriername", item.title);
        this.$router.push(this.fun.getUrl(item.url));
      }else if(item.name == "m-erweima") {
        // 海报
        this.openQrCode('block');
      } else if (item.name == "supplier") { 
        this.$router.push(
          this.fun.getUrl(item.url, {
            uid: this.supplier_id
          })
        );
      } else if (item.name == 'order-inventory'){
        this.$router.push(this.fun.getUrl('stockorderList', { stock: "stock" }));
      }else {
        this.$router.push(this.fun.getUrl(item.url, { fromHome: 1 }));
      }
    },
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/icon.scss";

  .plugins-box {
    background-color: #fff;
    border-radius: 5px;
    margin: 10px;
    padding: 10px;

    .plugins-title {
      padding-bottom: 10px;
      margin-bottom: 10px;
      color: #333;
      font-weight: bold;
      font-size: 16px;
      text-align: left;
      border-bottom: 1px solid #f3f3f3;
    }
  }

  .plugin-items-box {
    display: flex;
    flex-wrap: wrap;
  }

  .plugin-items-icon {
    display: flex;
    flex-direction: column;
    width: 20%;
    margin-bottom: 10px;
    font-size: 12px;

    .iconfont {
      display: inline-block;
      margin: 0 auto 5px auto;
      font-size: 1.53rem;
      color: rgb(241, 83, 83);
    }
  }
</style>