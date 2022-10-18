<!-- 门店列表 筛选器 -->
<template>
  <div id="o2o-option-menu">
    <template v-if="isshowO2oOptionMenu">
      <van-sticky>
        <div class="o2o-option-menu-list">
          <div
            class="o2o-option-menu-list-child"
            :class="{ 'active-ment-class': parentActive == item.value, 'active-text-color': isShowSubContent && activeType == item.value }"
            @click.stop="onOptionsItemClick(item, index)"
            v-for="(item, index) in option"
            :key="index"
          >
            {{ item.text }}
            <div :class="[isShowSubContent && activeType == item.value ? 'rotate-icon' : 'close-icon']" v-if="item.subs"><i class="iconfont icon-member-bottom"></i></div>
          </div>
          <transition name="folds">
            <div class="options-sub-content" v-if="isShowSubContent">
              <ul class="options-sub-content-list" @touchmove.stop>
                <template v-if="successLocation">
                  <li
                    class="options-sub-content-list-item"
                    :class="{ 'active-ment-class': subs_select == items.id }"
                    v-for="(items, i) in selectOption"
                    :key="i"
                    @click="onSubOptionsItemClick(items, i)"
                  >
                    {{ items.name }}
                  </li>
                </template>
                <template v-else
                  ><li class="options-sub-content-list-item">
                    定位中...
                  </li></template
                >
              </ul>
              <div class="options-select">
                <div class="options-select-btn" @click.stop="resetFilter">重置</div>
                <div class="options-select-btn " :class="{ 'active-text-color': !subs_select }" @click.stop="filterData">筛选</div>
              </div>
            </div>
          </transition>
        </div>
      </van-sticky>
      <van-overlay :show="isShowSubContent" @click.stop="cloneFilter" :custom-style="{ zIndex: '6' }" />
    </template>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      lat: 0,
      lng: 0,
      city: "",
      parentActive: null,
      ok_subs_select: null, //确定请求的二级选项参数
      subs_select: null,
      successLocation: false, //有定位信息
      activeType: "",
      isshowO2oOptionMenu: false, //是否开启组件
      option: [],
      selectOption: [], //二级筛选器选项
      isShowSubContent: false, //二级筛选器选项显隐，

      isOpenMoreChild: false //用于父组件获取，判断是否使用该子组件的加载更多
    };
  },

  // activated: {},
  components: {},
  computed: {},
  mounted() {
    this.getStoreSearchMenu();
    if (this.$route.params.city && this.$route.params.city !== "1") {
      this.city = this.$route.params.city;
      let p = this.fun.bd_encrypt(JSON.parse(this.$route.params.point).lng, JSON.parse(this.$route.params.point).lat);
      this.point = JSON.parse(this.$route.params.point);
      this.lat = p.lat;
      this.lng = p.lng;
      this.successLocation = true;
    } else {
      // let myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.lat = myLocation.point.lat;
      //   this.lng = myLocation.point.lng;
      //   this.city = myLocation.city;
      //   this.successLocation = true;
      //   //初始化数据
      // } else {
      //   this.getLocation();
      // }

      this.fun.getLocation()
        .then((res) => {
          this.lat = res.point.lat;
          this.lng = res.point.lng;
          this.city = res.city;
          this.successLocation = true;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  methods: {
    onOptionsItemClick(item, i) {
      if (!this.successLocation) {
        Toast("定位中，请稍等...");
        return;
      }
      if (!item.subs && this.parentActive == item.value) {
        //取消筛选
        this.resetFilter();
        return;
      }

      if (item.subs) {
        if (this.activeType == item.value && this.isShowSubContent) {
          this.isShowSubContent = false;
          return;
        }
        this.selectOption = item.child;
        this.isShowSubContent = true;
        this.subs_select = this.ok_subs_select;
        // if (this.activeType != item.value) {
        //   this.$nextTick(() => {
        //     setTimeout(() => {
        //       this.isShowSubContent = true;
        //     }, 80);
        //   });
        // }
      } else {
        this.isShowSubContent = false;
        this.subs_select = null;
      }
      this.activeType = item.value;
      if (!item.subs) {
        this.parentActive = this.activeType;
        this.getData();
      }
    },
    onSubOptionsItemClick(items) {
      // this.subs_select = this.subs_select == items.id ? null : items.id;
      this.subs_select = items.id;
    },
    cloneFilter() {
      this.isShowSubContent = false;
    },
    resetFilter() {
      //重置筛选条件
      this.subs_select = null;
      this.parentActive = null;
      this.isShowSubContent = false;
      this.$parent.gotoSearch();
    },
    filterData() {
      if (this.subs_select) {
        this.parentActive = this.activeType;
      }
      this.getData();
      this.isShowSubContent = false;
    },
    getStoreSearchMenu() {
      $http.get("plugin.store-cashier.frontend.store.goods.get-store-search-praise", {}).then(response => {
        if (response.result === 1) {
          if (response.data.is_category_ids == 1) {
            this.option.push({
              text: "门店分类",
              value: "classify",
              subs: true,
              child: response.data.categories
            });
          }
          if (response.data.is_distance == 1) {
            this.option.push({
              text: "离我最近",
              value: "distance",
              subs: true,
              child: [
                { name: "1km内", id: 1 },
                { name: "3km内", id: 3 },
                { name: "5km内", id: 5 },
                { name: "10km内", id: 10 }
              ]
            });
          }
          if (response.data.is_open_praise == 1) {
            this.option.push({ text: "好评优先", value: "is_open_praise", subs: false });
          }
          if (response.data.is_open_sales_volume == 1) {
            this.option.push({ text: "销量最高", value: "is_open_sales_volume", subs: false });
          }
          if (response.data.goods_show == 1) {
            this.option.push({ text: "优惠力度", value: "goods_show", subs: false });
          }
          this.isshowO2oOptionMenu = true;
        } else {
          this.isshowO2oOptionMenu = false;
        }
      });
    },
    getData() {
      let json = {
        lng: this.lng,
        lat: this.lat,
        city_name: this.city,
        is_type: this.activeType
      };
      if (this.activeType == "classify") {
        json.category_id = this.subs_select;
      }
      if (this.activeType == "distance") {
        json.is_distance = this.subs_select;
      }
      this.$parent.stores = [];
      let _url = "plugin.store-cashier.frontend.store.goods.get-store-search";
      $http.post(_url, json, ".", true).then(response => {
        if (response.result === 1) {
          this.isOpenMoreChild = true;
          this.ok_subs_select = this.subs_select;
          this.$parent.isLoadMore = true;
          this.$parent.total_page = response.data.last_page;
          if (!this.$parent.total_page) {
            this.$parent.total_page = 0;
          }
          this.$parent.page = 1;
          this.$parent.stores = response.data.data;
        } else {
          Toast(response.msg);
          this.$parent.stores = [];
        }
      });
    },
    //获取更多数据
    getChildrenMoreData() {
      let json = {
        lng: this.lng,
        lat: this.lat,
        city_name: this.city,
        is_type: this.activeType
      };
      if (this.activeType == "classify") {
        json.category_id = this.subs_select;
      }
      if (this.activeType == "distance") {
        json.is_distance = this.subs_select;
      }
      this.$parent.isLoadMore = false; // 防止多次请求分页数据
      if (this.$parent.page >= this.$parent.total_page) {
        return;
      } else {
        this.$parent.page = this.$parent.page + 1;
        json.page = this.$parent.page;
        $http.get("plugin.store-cashier.frontend.store.goods.get-store-search", json, "加载中").then(
          response => {
            this.$parent.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              this.$parent.stores = this.$parent.stores.concat(myData); //数组拼接
            } else {
              this.$parent.page = this.$parent.page - 1;
              this.$parent.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    getLocation() {
      var that = this;
      var mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function() {
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
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        that.lat = pos.point.lat;
        that.lng = pos.point.lng;
        that.successLocation = true;

        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
      }

      function onError(obj) {
        console.log(obj);
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#o2o-option-menu {
  .o2o-option-menu-list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 10px;
    background: #fff;
    z-index: 99;
    position: relative;

    .o2o-option-menu-list-child {
      display: flex;
      align-items: center;
    }
  }

  .active-ment-class {
    color: #ff2c29;
    font-weight: 700;
  }

  .active-text-color {
    color: #999 !important;
  }

  .rotate-icon {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transition: transform 0.5s;
  }

  .close-icon {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    transition: transform 0.5s;
  }
  // 子选项内容区
  .options-sub-content {
    // 脱离标准文档流
    position: absolute;
    width: 100%;
    height: 13.625rem;
    top: 2.425rem;
    left: 0;
    padding: 0 0.75rem;
    background-color: #fff;
    text-align: left;
    display: flex;
    flex-direction: column;

    .options-sub-content-list {
      flex: 1;
      overflow: hidden;
      overflow-y: auto;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
    }

    .options-sub-content-list::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    .options-sub-content-list-item {
      position: relative;
    }

    .options-sub-content-list-item::after {
      height: 1px;
      position: absolute;
      z-index: 0;
      bottom: 0;
      left: 0;
      content: "";
      width: 100%;
      background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
    }

    .options-select {
      height: 2.75rem;
      line-height: 2.75rem;
      display: flex;
      justify-content: space-between;

      .options-select-btn {
        width: 49%;
        text-align: center;
        color: #fe5e56;
        font-size: 16px;
      }

      .options-select-btn:nth-child(1) {
        border-right: 1px solid #ececec;
        color: #999;
      }
    }
  }

  .folds-enter-active {
    transition: all 0.3s ease;
  }

  .folds-leave-active {
    transition: all 0s ease;
  }

  .folds-enter,
  .folds-leave-to {
    // opacity: 0;
    height: 0;
  }
}
</style>
