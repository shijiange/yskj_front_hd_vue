<!-- 自提点 列表 -->
<template>
  <div id="selfCarry_info">
    <div class="top-nav" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div class="location" @click="showAddress">
        <i class="iconfont icon-icon_location"></i>
        <span class="cityClass">{{ city || "选择定位" }}</span>
        <i class="iconfont icon-member-bottom"></i>
      </div>
      <div class="search">
        <form @submit.prevent action="#">
          <input type="search" v-model="address_detail" @focus="checkCity" id="suggestId" name="address_detail" placeholder="请输入详细的地点" />
        </form>
      </div>
    </div>
    <div class="search">
      <i class="iconfont icon-sousuo"></i>
      <form @submit.prevent action="#">
        <input type="search" v-model="keyword" title="搜索" :placeholder="`搜索${deliverName}名称`" @keypress="search" />
      </form>
    </div>
    <ul>
      <li class="radio_main" v-for="item in info" :key="item.id" @click.stop="gotoDetail(item.id)">
        <div class="title">
          <span class="text">{{ item.deliver_name }}</span>
          <span class="btn1">查看</span>
        </div>
        <div class="address">{{ item.distance }}{{ item.unit }} | {{ item.full_address }}</div>
        <div>
          营业时间：{{ item.business_hours_start }} -
          {{ item.business_hours_end }}
        </div>
      </li>
    </ul>
    <p v-if="positongIng" style="padding: 1rem 0;">正在定位中，请稍等</p>
    <!--<div v-if="LocationError"-->
    <!--style="padding:1rem 0;">-->
    <!--定位失败,请手动<span style="color:#f15353"-->
    <!--@click.stop="toGeolocation">切换位置</span>-->
    <!--</div>-->
    <div v-if="fun.isTextEmpty(info) && !positongIng && !LocationError">
      <img src="../../../assets/images/blank.png" alt="" style="margin-top: 2rem; width: 5rem;" />
      <p style="color: #999;">抱歉，该地区暂无{{ deliverName }}~</p>
    </div>
    <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="district"></yd-cityselect>
    <van-popup v-model="show" position="bottom">
      <div id="selfCarry_detail">
        <van-nav-bar :title="`${deliverName}详情`" right-text="取消" @click-right="show = false" />
        <div class="top_main">
          <div class="title">{{ detailInfo.deliver_name }}</div>
          <div class="other">营业时间：{{ detailInfo.business_hours_start }}-{{ detailInfo.business_hours_end }}</div>
          <div class="tel">
            <span>联系电话：{{ detailInfo.deliver_mobile }}</span
            ><a @click.stop :href="'tel:' + detailInfo.deliver_mobile" style="">
              <van-icon slot="icon" name="phone-o" size="1.2rem" color="#00c25e"></van-icon>
            </a>
          </div>
          <div class="other">详细地址：{{ detailInfo.full_address }}</div>
        </div>
        <div class="bottom_box">
          <div>图片</div>
          <div class="img_box">
            <img :src="item" alt="" v-for="(item, index) in detailInfo.thumb" :key="index" />
          </div>
        </div>
        <div class="btn" @click.stop="gotoOrder">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import AMap from "AMap";
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
import { Toast } from "vant";

var myLocation = {};
export default {
  mixins: [scrollMixin],
  data() {
    return {
      address_detail: "",
      selectId: null, //点前选中的自提点id
      show: false,
      city: "",
      addressShow: false,
      positongIng: false, //当前是否正在定位中
      district: district, // 地址本地数据
      info: [], //自提点列表
      detailInfo: {},
      LocationError: false, //是否定位失败
      keyword: "",
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      deliverName: "", //自提点自定义名称
      iscloud: false
    };
  },

  activated() {
    myLocation = this.$store.state.o2oLocation || {};
    this.init();
    if (this.$route.params.noLocation == 1) {
      this.city = "";
      this.ready();
      this.getList("", "", "", "");
    } else {
      // this.getLocation();
      this.fun
        .getLocation()
        .then(res => {
          this.city = res.city;
          this.ready();
          this.getList(res.city, res.point.lat, res.point.lng, "");
        })
        .catch(err => {
          this.positongIng = false;
          this.LocationError = true;
          this.city = "";
          this.ready();
          this.getList("", "", "", "");
          console.log(err);
        });
    }

    try {
      if (this.$route.params.iscloud == "cloud") {
        this.iscloud = true;
      }
    } catch (error) {
      console.log(error);
    }
  },
  components: {},
  methods: {
    init() {
      this.address_detail = "";
      this.keyword = "";
      this.selectId = null;
      this.positongIng = false;
      this.addressShow = false;
      this.LocationError = false;
      this.info = [];
      this.detailInfo = {};
      this.city = "";
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
      this.deliverName = "";
      this.show = false;
    },
    showAddress() {
      if (this.$route.params.noLocation == 1) {
        this.addressShow = true;
      } else {
        if (this.positongIng) {
          Toast("正在定位中，请稍等");
        } else if (this.LocationError) {
          Toast("定位失败,请手动切换位置");
        } else {
          this.addressShow = true;
        }
      }
    },
    checkCity() {
      if (!this.city) {
        Toast("请先选择左边定位到具体城市，再输入详细地点");
      }
    },
    ready() {
      var that = this;
      //输入提示
      var auto = new AMap.Autocomplete({
        input: "suggestId",
        city: that.city
      });

      AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
      function select(e) {
        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: that.city
          });

          //var lnglat = [116.396574, 39.992706]
          geocoder.getAddress(e.poi.location, function(status, result) {
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              var point = {
                lat: e.poi.location.lat,
                lng: e.poi.location.lng
              };
              var pos;
              if (result.regeocode.addressComponent.city == "") {
                pos = {
                  address: e.poi.address,
                  // city:result.regeocode.addressComponent.district,
                  city: result.regeocode.addressComponent.province,
                  province: result.regeocode.addressComponent.province,
                  title: e.poi.name,
                  point: point
                };
              } else {
                pos = {
                  address: e.poi.address,
                  city: result.regeocode.addressComponent.city,
                  province: result.regeocode.addressComponent.province,
                  title: e.poi.name,
                  point: point
                };
              }

              that.$store.commit("updateLocation", pos);
              that.$store.commit("setLocation", pos);
              myLocation = pos || {};

              that.getList(pos.city, point.lat, point.lng, "");
            } else {
              Toast("请输入更详细的地址");
            }
          });
        });
      }
    },
    // 地址回调
    addressCallback(obj) {
      this.city = obj.itemName2;
      this.ready();
      if (myLocation && myLocation.point && myLocation.point.lat) {
        this.getList(this.city, myLocation.point.lat, myLocation.point.lng, "");
      } else {
        this.getList(this.city, "", "", "");
      }
    },
    getLocation() {
      var that = this;
      if (!myLocation.point) {
        that.positongIng = true;
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
          console.log("objjjjj", obj);
          // var res =
          //   "经纬度：" +
          //   obj.position +
          //   "\n精度范围：" +
          //   obj.accuracy +
          //   "米\n定位结果的来源：" +
          //   obj.location_type +
          //   "\n状态信息：" +
          //   obj.info +
          //   "\n地址：" +
          //   obj.formattedAddress +
          //   "\n地址信息：" +
          //   JSON.stringify(obj.addressComponent, null, 4);
          //alert(JSON.stringify(obj.addressComponent, null, 4));
          var position = obj.position.toString().split(",");
          that.point = {
            lat: position[1],
            lng: position[0]
          };
          that.address = obj.formattedAddress;
          that.title = obj.formattedAddress;
          that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;

          var pos = {
            address: obj.formattedAddress,
            city: that.city,
            title: obj.formattedAddress,
            point: that.point
          };
          console.log("test pos", pos);
          that.positongIng = false;
          that.$store.commit("updateLocation", pos);
          that.$store.commit("setLocation", pos);
          that.city = pos.city;
          myLocation = pos || {};
          that.ready();
          that.getList(pos.city, that.point.lat, that.point.lng, "");
        }

        function onError(obj) {
          Toast("定位失败,请手动切换位置");
          that.positongIng = false;
          that.LocationError = true;
          that.city = "";
          that.ready();
          that.getList("", "", "", "");
        }
      } else {
        console.log("有地址信息，直接请求列表");
        that.city = myLocation.city;
        that.ready();
        that.getList(myLocation.city, myLocation.point.lat, myLocation.point.lng, "");
      }
    },
    getList(city, lat, lng, kwd) {
      let that = this;
      let p = {};
      if (lng) {
        p = this.fun.bd_encrypt(lng, lat);
      }

      if (this.$route.params.tag == undefined) {
        this.$router.go(-1);
        return;
      }

      let json = {
        city_name: city,
        lat: p.lat || "",
        lng: p.lng || "",
        goods: that.$route.params.goods || [],
        kwd: kwd
      };
      let _url = "plugin.package-deliver.frontend.deliver.getList";
      console.log("this.$route.params.selected:::", this.$route.params.dispatch_id);
      if (this.$route.params.dispatch_id == 12 && this.$route.params.store_id) {
        // 门店自提点，只返回该门店创建的自提点
        json.store_id = this.$route.params.store_id;
        _url = "plugin.package-deliver.frontend.store.deliver.getList";
      }
      $http.get(_url, json, ".").then(
        function(response) {
          if (response.result === 1) {
            that.fun.setWXTitle(response.data.name);
            that.isLoadMore = true;
            that.total_page = response.data.list.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.deliverName = response.data.name;
            that.info = response.data.list.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        let p = {};
        if (myLocation.point) {
          p = this.fun.bd_encrypt(myLocation.point.lng, myLocation.point.lat);
        }

        let json = {
          city_name: that.city,
          lat: p.lat || "",
          lng: p.lng || "",
          kwd: that.keyword,
          goods: that.$route.params.goods || [],
          page: that.page
        };
        let _url = "plugin.package-deliver.frontend.deliver.getList";
        if (this.$route.params.dispatch_id == 12 && this.$route.params.store_id) {
          json.store_id = this.$route.params.store_id;
          _url = "plugin.package-deliver.frontend.store.deliver.getList";
        }
        $http
          .get(_url, json, ".")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.list.data;
              that.info = that.info.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    search(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键  event.target.value
        event.preventDefault();
        if (myLocation.point) {
          this.getList(this.city, myLocation.point.lat, myLocation.point.lng, this.keyword);
        } else {
          this.getList(this.city, "", "", this.keyword);
        }
      }
    },
    toGeolocation() {
      let that = this;
      if (this.$route.params.tag == "goodsDetail") {
        this.$router.push(
          this.fun.getUrl(
            "o2oLocation_loc",
            {
              tag: that.$route.params.tag,
              goodsId: that.$route.params.goodsId
            },
            { tag: "goodsDetail" }
          )
        );
      } else {
        this.$router.replace(
          this.fun.getUrl(
            "o2oLocation_loc",
            {
              tag: that.$route.params.tag,
              goodsId: that.$route.params.goodsId,
              optionsId: that.$route.params.optionsId,
              total: that.$route.params.total,
              store_id: that.$route.params.store_id,
              cart_ids: that.$route.params.cart_ids
            },
            { tag: "selfCarry" }
          )
        );
      }
    },
    gotoDetail(_id) {
      let that = this;
      if (this.selectId == _id) {
        that.show = true;
      } else {
        that.selectId = _id;
        that.detailInfo = {};
        let json = {
          deliver_id: _id
        };
        let _url = "plugin.package-deliver.frontend.deliver.getDeliver";
        if (this.$route.params.dispatch_id == 12 && this.$route.params.store_id) {
          // 门店自提点，只返回该门店创建的自提点
          json.store_id = this.$route.params.store_id;
          _url = "plugin.package-deliver.frontend.store.deliver.getDeliver";
        }
        $http.get(_url, json, ".").then(
          function(response) {
            if (response.result === 1) {
              that.detailInfo = response.data.deliver;
              that.show = true;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
      }
      // this.$router.push(this.fun.getUrl("selfCarry_detail", { id: _id }));
    },
    gotoOrder() {
      let that = this;
      console.log("route", this.$route.params);
      this.getNowPackageDeliver(this.selectId);
      if (this.$route.params.tag == "goodsDetail") {
        that.$router.push(
          that.fun.getUrl("goods", {
            id: that.$route.params.goodsId
          })
        );
      } else {
        var _goodsId = that.$route.params.goodsId;
        var _optionsId = that.$route.params.optionsId;
        var _total = that.$route.params.total;
        var submitActionTag = that.$route.params.tag;
        let changeSelfCarry = {
          deliver_name: that.detailInfo.deliver_name,
          deliver_mobile: that.detailInfo.deliver_mobile,
          full_address: that.detailInfo.full_address,
          id: that.selectId
        };

        if (this.iscloud) {
          that.$router.replace(
            that.fun.getUrl("cloudOrder", {
              changeSelfCarry: JSON.stringify(changeSelfCarry),
              from: "ziti",
              tag: submitActionTag,
              goodsId: _goodsId,
              optionsId: _optionsId,
              total: _total,
              is_selected: that.$route.params.is_selected
            })
          );
        } else {
          that.$router.replace(
            that.fun.getUrl(
              "goodsorder",
              {
                changeSelfCarry: JSON.stringify(changeSelfCarry)
              },
              {
                from: "ziti",
                tag: submitActionTag,
                goodsId: _goodsId,
                optionsId: _optionsId,
                total: _total,
                id: that.$route.params.id,
                form_data_id: that.$route.params.form_data_id,
                store_id: that.$route.params.store_id,
                cart_ids: that.$route.params.cart_ids,
                level_id: that.$route.params.level_id,
                team_id: that.$route.params.team_id,
                option_level_id: that.$route.params.option_level_id,
                goods: that.$route.query.goods,
                dispatch_id: that.$route.params.dispatch_id
              }
            )
          );
        }
      }
      that.addressShow = false;
    },
    getNowPackageDeliver(_id) {
      //更新自提点供应商的关联id
      if (!_id) {
        console.log("自提点id不能为空！");
        return;
      }
      $http.get("plugin.package-deliver.frontend.decorate-deliver.getNowPackageDeliver", { deliver_id: _id }, ".").then(
        response => {
          if (response.result === 1) {
            let deliverIDStorage = sessionStorage.getItem("deliverId") || null; //获取当前会话是否存储了自提点id
            if (deliverIDStorage) {
              //有记录才去更新sessionStorage（说明一开始进入的），不然影响到分享链接上参数
              window.sessionStorage.setItem("deliverId", response.data.id); //储存到sessionStorage
            }
          } else {
            this.$toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#selfCarry_info {
  background: #fff;
  padding-top: 3rem;

  .top-nav {
    position: fixed;
    top: 0;
    left: 0;
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
    box-shadow: 0 0 1rem 0 rgba(92, 92, 92, 0.1);
    border-radius: 1rem;
    height: 2rem;
    line-height: 2rem;
    display: flex;
    flex: 1;
    margin-left: 0.625rem;

    i {
      padding-left: 0.5rem;
    }

    input {
      padding: 0 0.5rem;
      border: none;
      width: 15rem;
    }
  }

  .radio_main {
    width: 100%;
    padding: 1rem;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #666;
    font-size: 12px;
    border-bottom: 0.026667rem solid e;

    .title {
      display: flex;
      justify-content: space-between;
      font-size: 1rem;
      flex: 1;
      height: 1rem;
      line-height: 1rem;
      margin-bottom: 0.5rem;

      .text {
        color: #333;
        flex: 1;
      }

      .btn1 {
        color: #f15353;
      }
    }

    .address {
      margin-bottom: 0.25rem;
      line-height: 1rem;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
    }
  }

  #selfCarry_detail {
    .top_main {
      display: flex;
      flex-direction: column;
      text-align: left;
      padding: 1rem;
      overflow: hidden;
      justify-content: space-between;
      background: #fff;
      color: #999;
      font-size: 0.75rem;

      .title {
        font-size: 1rem;
        color: #333;
        margin-bottom: 0.625rem;
      }

      .other {
        margin-bottom: 0.5rem;
      }

      .tel {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
    }

    .bottom_box {
      margin-top: 0.625rem;
      padding: 0.8rem 1.4rem;
      background: #fff;
      text-align: left;

      .img_box {
        display: flex;
        flex-wrap: wrap;
        margin-top: 0.625rem;

        img {
          width: 6.25rem;
          height: 6.25rem;
          margin: 0 0.625rem 0.8rem 0;
        }
      }
    }

    .btn {
      width: 100%;
      height: 2.5rem;
      line-height: 2.5rem;
      font-size: 1.13rem;
      text-align: center;
      color: #fff;
      background: #f15353;
    }
  }
}
</style>
