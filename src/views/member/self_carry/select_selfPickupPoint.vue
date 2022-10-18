<!-- 选择自提点  应用于装修组件‘社区团购’跳转-->
<template>
  <div id="select_selfPickupPoint" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title :hide="false" :text="`选择${plugin_name}`"></c-title>
    <van-tabs v-model="active" sticky swipeable @change="onChange">
      <van-tab :title="`当前${plugin_name}`">
        <selfPickupPointChild v-if="activeDeliver.id" :selected="true" :datas="activeDeliver" :pluginName="plugin_name"></selfPickupPointChild>
        <yz-blank v-else :text="positongStatus == -1 ? '获取失败！请选择其他' : '正在获取中，请稍后...'"></yz-blank>
      </van-tab>
      <van-tab :title="`选择其他${plugin_name}`">
        <div class="top-nav">
          <div class="location" @click="showAddress">
            <i class="iconfont icon-icon_location"></i>
            <span class="cityClass">{{ positongStatus == 0 ? "定位中" : positongStatus == -1 ? "手动选择" : city }}</span>
            <i class="iconfont icon-member-bottom"></i>
          </div>
          <div class="search">
            <van-popover v-model="showPopover" trigger="click" :actions="actions" @select="onSelect">
              <template #reference>
                <div class="popver-action">{{ activeActions }} <i class="iconfont icon-member-bottom"></i></div>
              </template>
            </van-popover>
            <form @submit.prevent action="#">
              <input
                type="search"
                @keyup.enter="getList"
                v-show="activeActionsVaule == 1"
                v-model="search_address"
                autocomplete="off"
                @focus="checkCity"
                id="suggestId"
                name="address_detail"
                :placeholder="`请输入地址`"
              />
              <input
                type="search"
                @keyup.enter="getList"
                v-show="activeActionsVaule == 2"
                v-model="kwd"
                autocomplete="off"
                id="suggestId"
                name="address_detail"
                :placeholder="`请输入${plugin_name}名称`"
              />
            </form>
          </div>
        </div>
        <selfPickupPointChild v-if="activeDeliver.id" :selected="true" :datas="activeDeliver" :pluginName="plugin_name"></selfPickupPointChild>
        <selfPickupPointChild v-for="item in list" :key="item.id" :datas="item" v-on:chooseDeliver="chooseDeliver" :pluginName="plugin_name"></selfPickupPointChild>
        <yz-blank :datas="list" :text="positongStatus == -1 ? '获取失败！请重新刷新' : '暂无其他数据'"></yz-blank>
      </van-tab>
    </van-tabs>
    <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="district"></yd-cityselect>
  </div>
</template>

<script>
import selfPickupPointChild from "./component/selfPickupPointChild";
import yzBlank from "components/ui_components/yz_blank";
import { Popover as VanPopover } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      plugin_name: "",
      activeID: 0, //当前选择的自提点id
      activeDeliver: {},
      list: [],
      kwd: "",
      search_address: "",

      active: 0,
      positongStatus: 0, //是否正在定位状态0、定位成功1、定位失败-1
      addressShow: false,
      district: district, // 地址本地数据

      showPopover: false,
      activeActions: "地址",
      activeActionsVaule: 1,
      // 通过 actions 属性来定义菜单选项
      actions: [
        { text: "地址", value: 1 },
        { text: "自提点", value: 2 }
      ],
      city: "",
      point: {},

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },

  activated() {
    //通过定位获取当前自提点,因为需要获取到距离
    this.fun
      .getLocation()
      .then(res => {
        this.point = res.point;
        this.city = res.city;
        this.positongStatus = 1;
        this.getNowPackageDeliver();
        this.getList();
      })
      .catch(err => {
        this.positongStatus = -1;
        console.log(err);
      });
  },

  components: { selfPickupPointChild, VanPopover, yzBlank },

  computed: {},

  mounted() {},

  methods: {
    getNowPackageDeliver() {
      //通过定位信息获取自提点信息
      let _json = {
        lng: this.point.lng || "",
        lat: this.point.lat || ""
      };
      if (this.$route.params.deliverId) {
        _json.deliver_id = this.$route.params.deliverId;
      }
      $http.get("plugin.package-deliver.frontend.decorate-deliver.getNowPackageDeliver", _json, ".").then(
        response => {
          if (response.result === 1) {
            this.activeDeliver = response.data;
            this.activeID = response.data.id;
          } else {
            this.$toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getList() {
      let _json = {
        lng: this.point.lng || "",
        lat: this.point.lat || "",
        city_name: this.city,
        kwd: this.kwd,
        search_address: this.search_address
      };
      $http.get("plugin.package-deliver.frontend.decorate-deliver.getList", _json).then(
        response => {
          if (response.result === 1) {
            this.list = response.data.list.data;
            this.plugin_name = response.data.plugin_name;
            this.actions[1].text = response.data.plugin_name;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.fun.setWXTitle(this.plugin_name);
          } else {
            this.$toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        let _json = {
          lng: this.point.lng,
          lat: this.point.lat,
          city_name: this.city,
          kwd: this.kwd,
          search_address: this.search_address
        };
        this.page = this.page + 1;
        _json.page = this.page;
        $http.post("plugin.package-deliver.frontend.decorate-deliver.getList", _json, "加载中").then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              let myData = response.data.list.data;
              this.list = this.list.concat(myData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          function(response) {
            console.log("response", response);
            // error callback
          }
        );
      }
    },
    chooseDeliver(e) {
      //切换自提点
      window.sessionStorage.setItem("deliverId", e); //储存到sessionStorage
      $http.get("plugin.package-deliver.frontend.decorate-deliver.choosePackageDeliver", { deliver_id: e }, ".").then(
        response => {
          if (response.result === 1) {
            this.$dialog.alert({ message: response.msg }).then(() => {
              if (window.history.length <= 1) {
                this.$router.push(this.fun.getUrl("home", {}));
              } else {
                this.$router.go(-1);
              }
            });
          } else {
            this.$toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    onSelect(action) {
      this.activeActions = action.text;
      this.activeActionsVaule = action.value;
      this.kwd = "";
      this.search_address = "";
      this.getList();
    },
    // 地址回调
    addressCallback(obj) {
      this.positongStatus = 1;
      this.city = obj.itemName2;
      this.getList();
    },
    showAddress() {
      if (this.positongIng) {
        this.$toast("正在定位中，请稍等");
      } else if (this.LocationError) {
        this.$toast("定位失败,请手动切换位置");
      } else {
        this.addressShow = true;
      }
    },
    checkCity() {
      if (!this.city) {
        this.$toast("请先选择左边定位到具体城市，再输入详细地点");
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#select_selfPickupPoint {
  padding-bottom: 6rem;

  .top-nav {
    width: 100%;
    display: flex;
    height: 3rem;
    line-height: 3rem;
    align-items: center;
    justify-content: space-around;
    padding: 0 0.625rem;
    background: #fff;

    .location {
      .cityClass {
        display: inline-block;
        max-width: 3.5rem;
        height: 1.85rem;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }

    &.pcStyle {
      width: 375px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .search {
    background-color: #eff0f1;
    border-radius: 0.938rem;
    height: 2rem;
    line-height: 2rem;
    display: flex;
    flex: 1;
    margin-left: 0.625rem;

    form {
      flex: 1;
    }

    input {
      flex: 1;
      padding: 0 0.5rem;
      border: none;
      width: 100%;
    }

    .popver-action {
      display: flex;
      align-items: center;
      padding: 0 0.25rem 0 0.875rem;
    }
  }
}
</style>
