<template>
  <div class="U0000024-template1"  :class="className">
    <!-- style -->
    <!--<div v-html="css"></div>-->

    <!--微社区静态-->
    <van-tabs v-model="active" style="width: 100%;"
              swipeable  v-if="!tabcontrol && datas.get_style == 1"
              @change="getClassificationBtn"
              :background="datas.tab_bg"
              :title-active-color="datas.title_active_color"
              :color="datas.title_active_color"
              :title-inactive-color="datas.title_color"
              >
      <van-tab title="最新">
        <div class="video_list">
          <c-flow :id="id"
            :showLoading="showLoading" :isDiy="true" :isLoadMore="isLoadMore"
            @loadMore="loadMore" @getMore="getMoreData" :datas="datas"
            :list="newClassification"
            v-if="active == '0'"
          ></c-flow>
        </div>
      </van-tab>
      <van-tab title="附近">
        <div class="video_list">
          <c-flow :id="id"
            :showLoading="showLoading" :isDiy="true" :isLoadMore="isLoadMore"
            @loadMore="loadMore" @getMore="getMoreData" :datas="datas"
            :list="nearbyClassification"
            v-if="active == '1'"
          ></c-flow>
        </div>
      </van-tab>
      <template v-for="(item, index) in cate">
        <van-tab :title="item.name" :key="index">
          <template v-if="cateList[index]">
            <div class="video_list">
              <c-flow :id="id"
                :showLoading="showLoading" :isDiy="true" :isLoadMore="isLoadMore"
                @loadMore="loadMore" @getMore="getMoreData" :datas="datas"
                :list="cateList[index]"
                v-if="active == index + 2"
              ></c-flow>
            </div>
          </template>
        </van-tab>
      </template>
    </van-tabs>

    <template v-if="tabcontrol && (datas.get_style == 1 || !datas.get_style)">
      <div class="video_list">
        <c-flow :id="id"
                :showLoading="showLoading" :isDiy="true" :isLoadMore="isLoadMore"
                @loadMore="loadMore" @getMore="getMoreData" :datas="datas"
                :list="newClassification"
        ></c-flow>
      </div>
    </template>

    <template v-if="datas.get_style == 2">
      <div class="video_list">
        <c-flow :id="id"
                :showLoading="showLoading" :isLoadMore="isLoadMore" :datas="datas"
                :list="newClassification"
        ></c-flow>
      </div>
    </template>

  </div>
</template>

<script>
// import { Toast } from 'vant';
import cFlow from "components/Waterfalls_flow";
export default {
  props: ['id', 'datas', 'tabcontrol','store_id'],
  data() {
    return{
      active: 0,
      cate: [],
      cateList: [],
      newClassification: [],
      nearbyClassification: [],
      address: "",
      city: "",
      point: "",

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      getMoreDataType: "newClassification",
      cateMoreData: {},
      showLoading: false,
    };
  },
  mounted() {
    if(this.tabcontrol) {
      if(Number(this.datas.get_number) > 0) {
        this.getFirstData(this.datas.list);
      }
    }else {
      if(this.datas.cate) {
        this.getHomePageData(this.datas.cate);
      }
      if(this.datas.get_style == 2) {
        // 手动选择
        this.showLoading = true;
        this.isLoadMore = false;
        this.newClassification = this.datas.list;
      }else {
        if(Number(this.datas.get_number) > 0 && this.datas.list) {
          this.getFirstData(this.datas.list);
        }
      }

      // let myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //初始化数据
      // } else {
      this.fun.getLocation()
        .then((res) => {
          this.point = res.point;
          this.title = res.title;
          this.city = res.city;
        })
        .catch((err) => {
          console.log(err);
        });
      // this.getLocation();
      // }
    }
  },
  computed: {
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },
  components: {
    cFlow
  },
  watch: {},
  methods: {
    getHomePageData(data) {
      if(data) {
        this.cate = data;
        for (let i = 0; i < this.cate.length; i++) {
          this.cateList.push([]);
        }
      }
    },
    getFirstData(data) {
      this.showLoading = false;
      this.isLoadMore = false;
      this.total_page = data.last_page;
      this.newClassification = data.data;
      if(this.newClassification.length > this.datas.get_number) {
        this.newClassification.splice(this.datas.get_number,this.newClassification.length-this.datas.get_number);
        this.isLoadMore = false;
      }
    },
    loadMore() {
      this.showLoading = true;
      if((this.total_page <=1 || this.page >= this.total_page)) {
        this.isLoadMore = false;
      }else {
        if(this.active == 0) {
          this.newClassification.length >= this.datas.get_number ? this.isLoadMore = false : this.isLoadMore = true;
        }else if(this.active == 1) {
          this.nearbyClassification.length >= this.datas.get_number ? this.isLoadMore = false : this.isLoadMore = true;
        }else {
          // 分类
          this.isLoadMore = true;
        }
      }
      this.$emit('setLoadMore', this.isLoadMore);
    },
    getClassificationBtn(index, title) {
      if (title == "最新") {
        this.getClassification("newClassification");
        this.getMoreDataType = "newClassification";
      } else if (title == "附近") {
        this.getClassification("nearbyClassification");
        this.getMoreDataType = "nearbyClassification";
      } else {
        let indexData = index - 2;
        this.getClassification("", this.cate[indexData].id, indexData);
        this.getMoreDataType = "cate";
        this.cateMoreData = {
          type: "",
          id: this.cate[indexData].id,
          index: indexData
        };
      }
    },
    getClassification(type, id, index) {
      let that = this;
      let dataJson = {};
      this.showLoading = false;
      this.isLoadMore = false;
      that.pageInit();
      if (id) {
        dataJson.cat_id = id;
      } else {
        if (type == "newClassification") {
          dataJson.trick_new = 1;
        } else if (type == "nearbyClassification") {
          let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
          dataJson.lng = p.lng;
          dataJson.lat = p.lat;
          dataJson.city_name = this.city;
          dataJson.address = this.city;
        }
      }

      if(this.store_id) {
        dataJson.store_id = this.store_id;
      }
      $http
        .post("plugin.micro-communities.api.index.getStick", dataJson, "")
        .then(response => {
          this.showLoading = true;
          if (response.result == 1) {
            that.total_page = response.data.last_page;
            if (id) {
              that.cateList.splice(index, 1, response.data.data);
            } else {
              if (type == "newClassification") {
                that.newClassification = response.data.data;

                if(this.newClassification.length > this.datas.get_number) {
                  this.newClassification.splice(this.datas.get_number, this.newClassification.length-this.datas.get_number);
                  this.isLoadMore = false;
                }
              } else if (type == "nearbyClassification") {
                that.nearbyClassification = response.data.data;

                if(this.nearbyClassification.length > this.datas.get_number) {
                  this.nearbyClassification.splice(this.datas.get_number, this.nearbyClassification.length-this.datas.get_number);
                  this.isLoadMore = false;
                }
              }
            }
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
          }
        },function (response) {
          that.showLoading = true;
          that.isLoadMore = false;
        });
    },
    pageInit() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      let json = {};
      if (this.getMoreDataType == "newClassification") {
        json.trick_new = 1;
        if(this.newClassification.length >= this.datas.get_number) {
          return;
        }
      } else if (this.getMoreDataType == "nearbyClassification") {
        let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
        json.lng = p.lng;
        json.lat = p.lat;
        json.city_name = this.city;
        json.address = this.city;
        if(this.nearbyClassification.length >= this.datas.get_number) {
          return;
        }
      } else {
        json.cat_id = that.cateMoreData.id;
      }

      if(this.store_id) {
        json.store_id = this.store_id;
      }

      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        this.showLoading = false;
        $http
          .post(
            "plugin.micro-communities.api.index.getStick",
            json,
            "加载中..."
          )
          .then((response)=> {
            if (response.result === 1) {
              var myData = response.data.data;
              if (that.getMoreDataType == "newClassification") {
                that.newClassification = that.newClassification.concat(myData);

                if(this.newClassification.length > this.datas.get_number) {
                  this.newClassification.splice(this.datas.get_number, this.newClassification.length-this.datas.get_number);
                  this.isLoadMore = false;
                }
              } else if (that.getMoreDataType == "nearbyClassification") {
                that.nearbyClassification = that.nearbyClassification.concat(myData);

                if(this.nearbyClassification.length > this.datas.get_number) {
                  this.nearbyClassification.splice(this.datas.get_number, this.nearbyClassification.length-this.datas.get_number);
                  this.isLoadMore = false;
                }
              } else {
                that.cateList[that.cateMoreData.index] = that.cateList[that.cateMoreData.index].concat(myData);
              }
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
            that.showLoading = true;
          },
          function (response) {
            that.showLoading = true;
            that.isLoadMore = false;
          }
          );
      }
    },
    getLocation() {
      var that = this;
      var mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function () {
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
        // var res =
        //     "经纬度：" +
        //     obj.position +
        //     "\n精度范围：" +
        //     obj.accuracy +
        //     "米\n定位结果的来源：" +
        //     obj.location_type +
        //     "\n状态信息：" +
        //     obj.info +
        //     "\n地址：" +
        //     obj.formattedAddress +
        //     "\n地址信息：" +
        //     JSON.stringify(obj.addressComponent, null, 4);
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        if(obj.addressComponent) {
          that.city = !that.fun.isTextEmpty(obj.addressComponent.city)
            ? obj.addressComponent.city
            : obj.addressComponent.province;
        }else {
          that.city = "";
        }

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
      }

      function onError(obj) {
        console.log(obj);
      }
    },
  },

};
</script>

<style lang="scss" scoped>
  // 默认
  .component-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .video_list {
    width: 100%;
  }
</style>
