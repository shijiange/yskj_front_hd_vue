<!-- 门店拼团列表页 -->
<template>
  <div id="o2o_grouplist">
    <c-title :hide="false" text="拼团列表"></c-title>
    <van-notify v-model="showLocation" type="success">
      <span>定位中，请稍等...</span>
    </van-notify>
    <van-tabs v-model="activeName" @change="handleClick" sticky :ellipsis="false" swipeable>
      <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
        <van-pull-refresh v-model="isLoading" @refresh="refreshDatas">
          <div class="content" v-if="dataList[ind]">
            <div v-for="(item, index) in dataList[ind].list" :key="index" class="list">
              <div class="list-top" @click.stop="gotoO2oHome(item.store_id)">
                <img :src="item.thumb" class="o2o-img" alt="" />
                <div class="o2o-name">{{ item.store_name || "---" }}</div>
                <div class="distance">{{ item.distance }}{{ item.unit }}</div>
              </div>
              <div class="goods-info" v-if="item.has_one_goods">
                <img :src="item.has_one_goods.thumb" class="goods-img" alt="" />
                <div class="goods-right">
                  <div class="goods-title">{{ item.title }}</div>
                  <div class="goods-price">
                    {{ $i18n.t("money") }} {{ item.has_many_option_levels[0].group_price }}
                    <div class="small-price">{{ $i18n.t("money") }} {{ item.has_one_goods.price }}</div>
                  </div>
                  <div class="goods-other">
                    <div class="goods-num"><i class="iconfont icon-fontclass-renshu1"></i>{{ item.has_many_option_levels[0].member_num }}人</div>
                    <div class="goods-btn" @click="goGroup(item.id, item.store_id)">去开团</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <yz-blank v-if="!showLocation && dataList[ind]" :datas="dataList[ind].list" text="该分类暂无活动信息" :isBtn="false"></yz-blank>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      showLocation: false,
      activeName: 0,
      isLoading: false,
      dataList: [],
      isLoadMore: true,
      titleArr: ["离我最近", "好评优先"],

      lat: 0,
      lng: 0
    };
  },

  activated() {
    this.setNewArr();
    // let myLocation = this.$store.state.o2oLocation;
    // if (myLocation.point) {
    //   this.showLocation = false;
    //   console.log("已有定位信息");
    //   this.lat = myLocation.point.lat;
    //   this.lng = myLocation.point.lng;
    //   this.handleClick();
    //   //初始化数据
    // } else {
    //   this.showLocation = true;
    //   this.getLocation();
    // }

    this.fun.getLocation()
      .then((res) => {
        this.showLocation = false;
        this.lat = res.point.lat;
        this.lng = res.point.lng;

        this.handleClick();
      })
      .catch((err)=> {
        console.log(err);
      });
  },
  components: { yzBlank },
  computed: {},
  methods: {
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
        that.showLocation = false;

        if (that.activeName == 0) {
          console.log("1111111111111111111111111111111");
          that.dataList[that.activeName].list = [];
          that.handleClick();
        }

        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
      }

      function onError(obj) {
        console.log(obj);
      }
    },
    setNewArr() {
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      console.log("dataList:::", this.dataList);
    },
    refreshDatas() {
      this.dataList[this.activeName].list = [];
      this.handleClick();
    },
    handleClick() {
      let that = this;
      if (this.showLocation || !this.lng) {
        Toast("正在定位中");
        return;
      }
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }

      $http
        .post("plugin.fight-groups.frontend.store.store-fight-arrondi.get-fight-groups", { page: 1, type_id: this.activeName + 1, lng: this.lng, lat: this.lat }, "", true)
        .then(response => {
          if (response.result === 1) {
            that.isLoading = false;
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.data);
          } else {
            that.isLoading = false;
            that.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          that.isLoading = false;
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {
          type_id: this.activeName + 1,
          lng: this.lng,
          lat: this.lat
        };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get("plugin.fight-groups.frontend.store.store-fight-arrondi.get-fight-groups", _json, "加载中").then(
          response => {
            that.isLoading = false;
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接
            } else {
              that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
              that.dataList[that.activeName].isLoadMore = false;
              that.isLoadMore = false;
            }
          },
          function(response) {
            that.isLoading = false;
            // error callback
          }
        );
      }
    },
    goGroup(id, store_id) {
      this.$router.push(this.fun.getUrl("GroupGoods", { id: id, store_id: store_id }));
    },
    gotoO2oHome(store_id) {
      this.$router.push(this.fun.getUrl("HomeSeller", { store_id: store_id }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#o2o_grouplist {
  text-align: left;

  .content {
    padding: 0.5rem 0.875rem;

    .list {
      background: #fff;
      display: flex;
      flex-direction: column;
      padding: 0.75rem;
      border-radius: 0.625rem;
      margin-bottom: 0.75rem;

      .list-top {
        widows: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .o2o-img {
          width: 1.875rem;
          height: 1.875rem;
          background-color: #fe5e56;
          border-radius: 50%;
        }

        .o2o-name {
          flex: 1;
          padding: 0.5rem;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }

        .distance {
          color: #666;
          font-size: 10px;
        }
      }

      .goods-info {
        display: flex;
        padding-top: 0.75rem;

        .goods-img {
          width: 4.75rem;
          height: 4.75rem;
          background-color: #fac337;
          border-radius: 0.375rem;
          margin: 0 0.5rem 0 0;
          flex-shrink: 0;
        }

        .goods-right {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .goods-title {
            width: 100%;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }

          .goods-price {
            display: flex;
            align-items: center;
            color: #f14e4e;

            .small-price {
              margin-left: 0.75rem;
              color: #999;
              font-size: 10px;
            }
          }

          .goods-other {
            display: flex;
            font-size: 12px;
            justify-content: space-between;

            .goods-num {
              color: #fb8615;

              i {
                font-size: 10px;
              }
            }

            .goods-btn {
              width: 3.75rem;
              height: 1.5rem;
              line-height: 1.5rem;
              text-align: center;
              color: #fff;
              background-color: #fe5e56;
              border-radius: 0.125rem;
            }
          }
        }
      }
    }
  }
}
</style>
