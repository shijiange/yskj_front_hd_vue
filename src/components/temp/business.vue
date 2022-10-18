<template>
  <div id="business">
    <van-tabs color="#daac5e" v-model="panelIndex" v-if="titleName[0]" @change="chooseTab">
      <van-tab v-if="titleName[0].is_open" :name="titleName[0].id" :title="titleName[0].text">
        <c-storeList
          @changList="getMoreList" :listStyle="listStyle"
          :stores="shopList0" :noText="true"
          :isLoadMore="isLoadMore1" :loading="loading"
          :page="page1" :totalPage="total_page1"
        ></c-storeList>
      </van-tab>
      <van-tab v-if="titleName[1].is_open" :name="titleName[1].id" :title="titleName[1].text">
        <div class="rebate_box">
          <div class="content_b_a">
            <div class="tab_b">
              <ul class="tab_b_box">
                <li :class="{ current: index == pd_index }" v-for="(classfy, index) in pd_classfy_arr" @click="pdClassfySearch(index, classfy.id)" :key="index">
                  {{ classfy.name }}
                </li>
              </ul>
            </div>
            <div class="tab_c">
              <ul class="tab_c_box">
                <li :class="{ current: index == pd_date_index }" v-for="(date, index) in pd_date_arr" @click="pdDateSearch(index, date)" :key="index">
                  <span>{{ date.week }}</span>
                  <span>{{ date.ye }}</span>
                </li>
              </ul>
            </div>
            <div class="goods_list">
              <div class="goods" v-for="(item, i) in shopList1" @click="gotoShop(item.id)" :key="i">
                <div class="img">
                  <img :src="item.thumb" style="width: 100%; height: 100%;" />
                </div>
                <ul class="info">
                  <li class="info_a">
                    <span>{{ item.store_name }}</span>
                    <span>距离{{ item.distance }}km</span>
                  </li>
                  <li class="info_b">
                    <span>{{ item.has_many_privilege[0].title }}</span>
                  </li>
                  <li class="info_c">
                    <span>{{ item.has_many_privilege[0].discount_value }}折</span>
                    <button type="button" @click="gotoShop(item.id)">
                      立即使用
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div style="width: 100%; height: 50px; line-height: 50px;">
            <div v-if="loading" class="loading-box">
              数据加载中 <van-loading color="#1989fa" size="0.8rem"></van-loading>
            </div>
            <div v-else-if="shopList1.length <= 0" >{{ $i18n.t("没有更多了") }}~</div>
            <div v-if="isLoadMore1" @click="getMorePdData">
              {{ $i18n.t("加载更多") }}
            </div>
          </div>

        </div>
      </van-tab>
      <van-tab v-if="titleName[2].is_open" :name="titleName[2].id" :title="titleName[2].text">
        <div class="coupon_list">
          <div class="content_b_c">
            <div class="coupon_box">
              <div class="coupon" v-for="(item, i) in shopList2" :key="i">
                <div class="left">
                  <div class="img">
                    <img :src="item.store && item.store.thumb ? item.store.thumb : require('../../assets/images/photo-mr.jpg')" style="width: 100%; height: 100%;" />
                  </div>
                  <p>
                    {{ item.store && item.store.store_name ? item.store.store_name : " " }}
                  </p>
                </div>
                <div class="right">
                  <ul class="right_a">
                    <li>{{ item.name }}</li>
                    <li v-if="item.coupon_method == 1">满{{ item.enough }}立减{{ item.deduct }}元</li>
                    <li v-if="item.coupon_method == 0">{{ item.discount }}折优惠</li>
                  </ul>
                  <ul class="right_b">
                    <li v-if="item.coupon_method == 1">
                      {{ $i18n.t("money") }}<span>{{ item.deduct }}</span>
                    </li>
                    <li v-if="item.coupon_method == 0">
                      <span>{{ item.discount }}</span
                      >折
                    </li>
                    <li>
                      <button type="button" @click="getCoupon(item.id)">
                        立即领取
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div style="width: 100%; height: 50px; line-height: 50px;">
            <div v-if="loading" class="loading-box">
              数据加载中 <van-loading color="#1989fa" size="0.8rem"></van-loading>
            </div>
            <div v-else-if="shopList2.length <= 0">{{ $i18n.t("没有更多了") }}~</div>
            <div v-if="isLoadMore2" @click="getMoreList">
              {{ $i18n.t("加载更多") }}
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab v-if="titleName[3].is_open" :name="titleName[3].id" :title="titleName[3].text">
        <div class="gift_box">
          <div class="fe-mod-8-hp-line" v-for="(item, i) in shopList3" :key="i" @click="toGood(item)">
            <div class="fe-mod-8-hp-line-img">
              <div class="saleimg"></div>
              <img :src="item.thumb" />
            </div>
            <div class="fe-mod-8-hp-line-info">
              <div class="title">
                {{ item.title }}
              </div>
              <div class="price fe-mod-8-main-name">
                <div>
                  <div class="p1">{{ $i18n.t("money") }}{{ item.price }}</div>
                  <div class="p2">
                    <span v-show="parseInt(item.market_price)">{{ $i18n.t("money") }}{{ item.market_price }}</span>
                  </div>
                </div>
                <div class="fe-mod-8-main-name-buy  buy-1" style="margin-top: 0.375rem;"></div>
              </div>
            </div>
          </div>

          <div style="width: 100%; height: 50px; line-height: 50px;">
            <div v-if="loading" class="loading-box">
              数据加载中 <van-loading color="#1989fa" size="0.8rem"></van-loading>
            </div>
            <div v-else-if="shopList3.length <= 0" >{{ $i18n.t("没有更多了") }}~</div>
            <div v-if="isLoadMore3" @click="getMoreList">
              {{ $i18n.t("加载更多") }}
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// import cStar from "components/star";
import { Toast } from "vant";
import cStoreList from "components/storeList";

const documentElement = document.documentElement;
const body = document.body;

export default {
  // components: { cStar },
  props: ["datas", "isStore", "shopPoint", "shopCity", "storesData", "listStyle"],
  data() {
    return {
      tab: 0,
      panelIndex: 0,
      titleName: [],
      api: "",
      dataJson: {},

      // 定位
      point: {},
      city: "",

      pd_classfy_arr: [],
      pd_date_arr: [],

      //折扣的index
      pd_index: 0,
      pd_date_index: 0,

      //商家数组和分页数据
      shopList0: [],
      isLoadMore0: false,
      page0: 1,
      total_page0: 0,
      //折扣数组和分页数据
      shopList1: [],
      isLoadMore1: false,
      page1: 1,
      total_page1: 0,
      //优惠券数组和分页数据
      shopList2: [],
      isLoadMore2: false,
      page2: 1,
      total_page2: 0,
      //礼包数组和分页数据
      shopList3: [],
      isLoadMore3: false,
      page3: 1,
      total_page3: 0,

      loading: false,
    };
  },
  mounted() {
    if (this.isStore) {
      this.titleName = this.datas;
      this.point = this.shopPoint;
      this.city = this.shopCity;
      if (this.city) {
        if (this.titleName[0].is_open) {
          this.chooseTab("business_merchant");
        } else if (this.titleName[1].is_open) {
          this.chooseTab("business_discount");
        } else if (this.titleName[2].is_open) {
          this.chooseTab("business_coupon");
        } else if (this.titleName[3].is_open) {
          this.chooseTab("business_goods_gift");
        }
      } else {
        // console.log("location不存在 business");
        // this.getLocation();
        if (this.titleName[0].is_open && this.storesData.data && this.storesData.data.length > 0) {
          this.chooseTab("business_merchant", this.storesData);
          return;
        }
        this.fun
          .getLocation()
          .then(res => {
            this.address = res.title;
            this.city = res.city;
            this.point = res.point;
            if (this.titleName[0].is_open) {
              this.chooseTab("business_merchant");
            } else if (this.titleName[1].is_open) {
              this.chooseTab("business_discount");
            } else if (this.titleName[2].is_open) {
              this.chooseTab("business_coupon");
            } else if (this.titleName[3].is_open) {
              this.chooseTab("business_goods_gift");
            }
          })
          .catch(err => {
            if (this.titleName[0].is_open) {
              this.chooseTab("business_merchant");
            } else if (this.titleName[1].is_open) {
              this.chooseTab("business_discount");
            } else if (this.titleName[2].is_open) {
              this.chooseTab("business_coupon");
            } else if (this.titleName[3].is_open) {
              this.chooseTab("business_goods_gift");
            }
            console.log(err);
          });
      }

      window.addEventListener("scroll", this.handleScroll);
    } else {
      this.titleName = this.datas.data;
      this.fun
        .getLocation()
        .then(res => {
          this.address = res.title;
          this.city = res.city;
          this.point = res.point;
          if (this.titleName[0].is_open) {
            this.chooseTab("business_merchant");
          } else if (this.titleName[1].is_open) {
            this.chooseTab("business_discount");
          } else if (this.titleName[2].is_open) {
            this.chooseTab("business_coupon");
          } else if (this.titleName[3].is_open) {
            this.chooseTab("business_goods_gift");
          }
        })
        .catch(err => {
          if (this.titleName[0].is_open) {
            this.chooseTab("business_merchant");
          } else if (this.titleName[1].is_open) {
            this.chooseTab("business_discount");
          } else if (this.titleName[2].is_open) {
            this.chooseTab("business_coupon");
          } else if (this.titleName[3].is_open) {
            this.chooseTab("business_goods_gift");
          }
          console.log(err);
        });
      //测试请求(要删)
      // this.chooseTab('business_merchant');
    }
  },
  components: {
    cStoreList
  },
  activated() {
    this.panelIndex = 0;
    if (this.isStore) {
      this.titleName = this.datas;
      window.addEventListener("scroll", this.handleScroll);
    } else {
      this.titleName = this.datas.data;
    }

    this.fun
      .getLocation()
      .then(res => {
        this.address = res.title;
        this.city = res.city;
        this.point = res.point;
        if (this.titleName[0].is_open) {
          this.chooseTab("business_merchant");
        } else if (this.titleName[1].is_open) {
          this.chooseTab("business_discount");
        } else if (this.titleName[2].is_open) {
          this.chooseTab("business_coupon");
        } else if (this.titleName[3].is_open) {
          this.chooseTab("business_goods_gift");
        }
      })
      .catch(err => {
        if (this.titleName[0].is_open) {
          this.chooseTab("business_merchant");
        } else if (this.titleName[1].is_open) {
          this.chooseTab("business_discount");
        } else if (this.titleName[2].is_open) {
          this.chooseTab("business_coupon");
        } else if (this.titleName[3].is_open) {
          this.chooseTab("business_goods_gift");
        }
        console.log(err);
      });
  },
  deactivated() {
    if (this.isStore) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  },
  methods: {
    toClassify(id) {
      this.$router.push(this.fun.getUrl("o2oCategory", { id: id }));
    },
    chooseTab(key) {
      // 找到对应的索引
      function pFn(p) {
        return p.id == key;
      }
      this.tab = this.titleName.findIndex(pFn);
      console.log(key, this.tab, this.titleName, "tab");
      this.api = this.titleName[this.tab].url;
      let type = this.titleName[this.tab].id;
      this[`isLoadMore${this.tab}`] = false;
      this[`total_page${this.tab}`] = 0;
      this[`page${this.tab}`] = 1;
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      if (type === "business_merchant") {
        this.dataJson = {
          lng: p.lng,
          lat: p.lat,
          city_name: this.city,
          // lng: 113.307605,
          // lat: 23.389929,
          // city_name: "广州市",
          page: this.page0,
          is_aggregation: 1
        };
        if (!p.lng) {
          this.dataJson.lng = "";
          this.dataJson.lat = "";
        }
      } else {
        switch (type) {
        case "business_discount":
          this.dataJson = {
            page: this.page1
          };
          break;
        case "business_coupon":
          this.dataJson = {
            lng: p.lng,
            lat: p.lat,
            city_name: this.city,
            page: this.page2
          };
          if (!p.lng) {
            this.dataJson.lng = "";
            this.dataJson.lat = "";
          }
          break;
        case "business_goods_gift":
          this.dataJson = {
            page: this.page3
          };
          break;
        }
      }

      if (type === "business_merchant" && this.storesData.data && this.storesData.data.length > 0) {
        this[`shopList0`] = this.storesData.data;
        this[`total_page0`] = this.storesData.last_page;
        this[`total_page0`] <= 1 ? (this[`isLoadMore0`] = false) : (this[`isLoadMore0`] = true);
      } else {
        this.getList();
      }
    },
    getList() {
      this.loading = true;
      $http
        .get(this.api, this.dataJson)
        .then(
          response => {
            this.loading = false;
            if (response.result === 1) {
              if (this.tab === 1) {
                this.pd_classfy_arr = response.data.store_category;
                this.pd_date_arr = response.data.date_time;

                //赋初值日期和门店分类id
                this.pd_category_id = this.pd_classfy_arr[0].id;
                this.pd_date = this.pd_date_arr[0];
                this.getPdData();
              } else {
                this[`shopList${this.tab}`] = response.data.data;
                this[`total_page${this.tab}`] = response.data.last_page;
              }

              this[`total_page${this.tab}`] <= 1 ? (this[`isLoadMore${this.tab}`] = false) : (this[`isLoadMore${this.tab}`] = true);
            } else {
              Toast(response.msg);
            }
          },
          response => {
            this.loading = false;
            console.log(response.msg);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(body.clientHeight, documentElement.clientHeight);
      } else {
        clientHeight = Math.max(body.clientHeight, documentElement.clientHeight);
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      //滚动事件触发
      if (Number(this.getScrollTop() + this.getClientHeight() + 105) >= this.getScrollHeight()) {
        //此处发起请求
        if (this[`isLoadMore${this.tab}`]) {
          this.getMoreList();
        } else {
          console.log("没有数据了");
        }
      }
    },
    getMoreList() {
      //获取更多数据
      this[`isLoadMore${this.tab}`] = false; // 防止多次请求分页数据
      if (this[`page${this.tab}`] >= this[`total_page${this.tab}`]) {
        return;
      } else {
        this[`page${this.tab}`] = this[`page${this.tab}`] + 1;
        let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
        switch (this.tab) {
        case 0:
          this.dataJson = {
            lng: p.lng,
            lat: p.lat,
            city_name: this.city,
            // lng: 113.307605,
            // lat: 23.389929,
            // city_name: "广州市",
            page: this.page0,
            is_aggregation: 1
          };
          if (!p.lng) {
            this.dataJson.lng = "";
            this.dataJson.lat = "";
          }
          break;
        case 2:
          this.dataJson = {
            lng: p.lng,
            lat: p.lat,
            city_name: this.city,
            page: this.page2
          };
          if (!p.lng) {
            this.dataJson.lng = "";
            this.dataJson.lat = "";
          }
          break;
        case 3:
          this.dataJson = {
            page: this.page3
          };
          break;
        }
        this.loading = true;
        $http
          .get(this.api, this.dataJson)
          .then(
            response => {
              this.loading = false;
              this[`isLoadMore${this.tab}`] = true;
              if (response.result === 1) {
                if (this.tab !== 1) {
                  this[`shopList${this.tab}`] = this[`shopList${this.tab}`].concat(response.data.data);
                  this[`total_page${this.tab}`] = response.data.last_page;
                }

                this[`page${this.tab}`] >= this[`total_page${this.tab}`] ? (this[`isLoadMore${this.tab}`] = false) : (this[`isLoadMore${this.tab}`] = true);
              } else {
                this[`page${this.tab}`] = this[`page${this.tab}`] - 1;
                this[`isLoadMore${this.tab}`] = false;
              }
            },
            function(response) {
              this.loading = false;
              console.log(response.msg);
            }
          )
          .catch(err => {
            console.log(err);
          });
      }
    },
    getPdData() {
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      let json = {
        lng: p.lng,
        lat: p.lat,
        city_name: this.city,
        // lng: 113.307605,
        // lat: 23.389929,
        // city_name: "广州市",
        page: this.page1,
        week: this.pd_date.week_num,
        category_id: this.pd_category_id,
        day: this.pd_date.day
      };
      $http
        .get("plugin.universal-card.frontend.store-discount.privilege", json, " ")
        .then(response => {
          if (response.result === 1) {
            this.total_page1 = response.data.last_page;
            this.shopList1 = response.data.data;
            this.total_page1 <= 1 ? (this.isLoadMore1 = false) : (this.isLoadMore1 = true);
          } else {
            this.isLoadMore1 = false;
          }
        })
        .catch(error => {
          console.log(error);
          this.isLoadMore1 = false;
        });
    },
    getMorePdData() {
      this.isLoadMore1 = false; // 防止多次请求分页数据
      if (this.page1 >= this.total_page1) {
        return;
      } else {
        this.page1 = this.page1 + 1;
        let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
        let json = {
          lng: p.lng,
          lat: p.lat,
          city_name: this.city,
          // lng: 113.307605,
          // lat: 23.389929,
          // city_name: "广州市",
          page: this.page1,
          week: this.pd_date.week_num,
          category_id: this.pd_category_id,
          day: this.pd_date.day
        };
        $http
          .get("plugin.universal-card.frontend.store-discount.privilege", json, " ")
          .then(response => {
            this.isLoadMore1 = true;
            if (response.result === 1) {
              var myData = response.data.data;
              this.shopList1 = this.shopList1.concat(myData); //数组拼接
            } else {
              this.page1 = this.page1 - 1;
              this.isLoadMore1 = false;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //特权折扣--分页
    pdInitData() {
      this.isLoadMore1 = false;
      this.page1 = 1;
      this.total_page1 = 0;
      this.shopList1 = [];
    },
    //特权折扣--搜索--门店分类
    pdClassfySearch(index, id) {
      //1.改变选中状态
      this.pd_index = index;
      //2.修改搜索参数--门店分类
      this.pd_category_id = id;
      //3.初始化分页数据
      this.pdInitData();
      //4.执行搜索返回数据（带上日期的搜索值）
      this.getPdData();
    },
    //特权折扣--搜索--日期
    pdDateSearch(index, date) {
      //1.改变选中状态
      this.pd_date_index = index;
      //2.修改搜索参数--日期
      this.pd_date = date;
      //3.初始化分页数据
      this.pdInitData();
      //4.执行搜索返回数据（带上门店分类的搜索值）
      this.getPdData();
    },
    //领取优惠券
    getCoupon(value) {
      $http
        .get("plugin.store-cashier.frontend.store.coupon-get", { coupon_id: value }, "领取中")
        .then(res => {
          if (res.result === 1) {
            this.$dialog.alert({ message: "领取成功" });
          } else {
            this.$dialog.alert({ message: res.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 跳转到店铺
    toRouter(item) {
      if (item.specify_show == 1) {
        this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: item.id, fromHome: 1 }));
      } else {
        this.$router.push(this.fun.getUrl("HomeSeller", { store_id: item.id, fromHome: 1 }));
      }
    },
    //跳转至门店首页
    gotoShop(id) {
      this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: id }));
    },
    toGood(item) {
      if (item.id) {
        this.$router.push(this.fun.getUrl("goods", { id: item.id }));
      } else {
        this.$router.push(this.fun.getUrl("goods", { id: item }));
      }
    },
    //跳转地址
    goToAdress(items) {
      let point = this.fun.bd_decrypt(items.longitude, items.latitude);
      this.fun.goToWXAdress(point, items.store_name, items.address.detailed_address);
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
        // var res =
        //   '经纬度：' +
        //   obj.position +
        //   '\n精度范围：' +
        //   obj.accuracy +
        //   '米\n定位结果的来源：' +
        //   obj.location_type +
        //   '\n状态信息：' +
        //   obj.info +
        //   '\n地址：' +
        //   obj.formattedAddress +
        //   '\n地址信息：' +
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
        console.log("test pos business", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
        if (that.titleName[0].is_open) {
          that.chooseTab("business_merchant");
        } else if (that.titleName[1].is_open) {
          that.chooseTab("business_discount");
        } else if (that.titleName[2].is_open) {
          that.chooseTab("business_coupon");
        } else if (that.titleName[3].is_open) {
          that.chooseTab("business_goods_gift");
        }
      }

      function onError(obj) {
        if (that.titleName[0].is_open) {
          that.chooseTab("business_merchant");
        } else if (that.titleName[1].is_open) {
          that.chooseTab("business_discount");
        } else if (that.titleName[2].is_open) {
          that.chooseTab("business_coupon");
        } else if (that.titleName[3].is_open) {
          that.chooseTab("business_goods_gift");
        }
        console.log(obj);
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#business {
  padding-top: 10px;

  .rebate_box {
    background: #fff;

    /* margin-top: 0.625rem; */
    .content_b_a {
      .tab_b {
        background: #fff;
        overflow-x: scroll;
        white-space: nowrap;
        border-bottom: solid 0.0625rem #ebebeb;

        .tab_b_box {
          display: flex;
          font-size: 15px;

          li {
            margin: 0 0.75rem;
            height: 2.625rem;
            line-height: 2.625rem;
            color: #666;
          }

          .current {
            font-weight: bold;
            color: #daac5e;
            border-bottom: solid 0.1875rem #daac5e;
          }

          li:last-child {
            padding-right: 0.75rem;
          }
        }
      }

      .tab_c {
        background: #fafafa;

        .tab_c_box {
          display: flex;

          li {
            flex: 1;
            padding: 0.625rem 0;
            color: #666;

            span {
              display: block;
              line-height: 1.25rem;
              font-size: 13px;
            }
          }

          .current {
            background: rgba(218, 172, 94, 0.6);
            color: #fff;
          }
        }
      }

      .goods_list {
        padding: 0 0.75rem;

        .goods {
          display: flex;
          padding: 1rem 0;
          border-bottom: solid 0.0625rem #ebebeb;

          .img {
            width: 4rem;
            height: 4rem;
            border: solid 0.0625rem #e8e8e8;
            overflow: hidden;
            margin-right: 0.75rem;

            img {
              width: 100%;
            }
          }
        }

        .info {
          width: 17.1875rem;

          li {
            display: flex;
            justify-content: space-between;
          }

          .info_a {
            margin-bottom: 0.25rem;
            font-size: 15px;

            span:first-child {
              max-width: 11.25rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            span:last-child {
              color: #8c8c8c;
              font-size: 14px;
            }
          }

          .info_b {
            span {
              background: #f5f5f5;
              font-size: 12px;
              color: #18bdad;
              padding: 0 0.25rem;
            }
          }

          .info_c {
            color: #daac5e;

            span {
              font-size: 16px;
            }

            button {
              border: solid 0.0625rem #daac5e;
              padding: 0.125rem 0.5rem;
              font-size: 0.8125rem;
              border-radius: 0.1875rem;
              color: #daac5e;
            }
          }
        }
      }
    }
  }

  .coupon_list {
    background: #fff;

    /* margin-top: 0.625rem; */
    padding: 0.625rem 0;

    .coupon {
      background: #fff;
      border: none;
      margin: 0.625rem auto;
      width: 21.5625rem;
      height: 6.25rem;
      background-image: url(../../assets/images/coupon_b.png);
      background-size: 21.5625rem 6.25rem;
      background-repeat: no-repeat;
      display: flex;

      .left {
        width: 7.75rem;
        height: 5.625rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .img {
          margin: 0 auto;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 1.875rem;
          overflow: hidden;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
          }
        }

        p {
          width: 7.75rem;
          padding: 0 0.625rem;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
        }
      }

      .right {
        width: 13.8125rem;
        height: 5.625rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.625rem;
        position: relative;

        .right_a {
          li {
            width: 8rem;
            line-height: 1.125rem;
            color: #daac5e;
            text-align: left;
            font-size: 13px;
          }
        }

        .right_b {
          margin-right: 5px;

          li:first-child {
            color: #daac5e;
            font-size: 14px;

            span {
              font-size: 20px;
            }
          }

          li:last-child {
            button {
              border: none;
              background: #daac5e;
              color: #fff;
              font-size: 12px;
              border-radius: 1rem;
              padding: 0.25rem 0.5rem;
            }
          }
        }

        .received_b {
          position: absolute;
          top: 0;
          left: 40%;

          i {
            font-size: 3.75rem;
            color: #daac5e;
            opacity: 0.3;
          }
        }
      }
    }
  }

  .gift_box {
    padding: 0.25rem;
    background: #fff;

    /* margin-top: 0.625rem; */
    .fe-mod-8-main-name-buy {
      height: 1.25rem;
      width: 1.875rem;
      float: right;
      background-repeat: no-repeat;
    }

    .buy-1 {
      background: url(./img/ico_buy_3.png);
      background-size: 1.875rem 1.25rem;
    }

    .fe-mod-8-hp-line {
      border: 0.0625rem solid #e5e5e5;
      display: block;
      background: #fff;
      margin: 0.3125rem 0;
      height: 5.625rem;
      padding: 0.3125rem;

      .fe-mod-8-hp-line-img {
        height: 5rem;
        width: 5rem;
        background: #f2f2f2;
        float: left;
        position: relative;

        .saleimg {
          height: 3.125rem;
          width: 3.125rem;
          position: absolute;
          top: -0.1875rem;
          left: -0.1875rem;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }

      .fe-mod-8-hp-line-info {
        height: 5rem;
        background: #fff;
        padding-left: 5.625rem;

        .title {
          text-align: left;
          height: 2.5rem;
          font-size: 14px;
          color: #333;
          line-height: 1.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .price {
          height: 1.875rem;
          width: 100%;
          margin-top: 0.625rem;
          font-size: 14px;
          color: #bbb;
          line-height: 1.875rem;
          float: left;
          overflow: hidden;

          .p1 {
            float: left;
            color: #f60;
          }

          .p2 {
            font-size: 12px;
            padding-left: 0.3125rem;
            text-decoration: line-through;
            float: left;
            line-height: 2rem;
          }

          .p3 {
            color: #999;
            padding-left: 0.625rem;
            float: left;
            font-size: 12px;
          }

          .p4 {
            color: #999;
            padding-left: 0.625rem;
            float: left;
            font-size: 12px;
            width: 5rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: bold;
          }
        }
      }
    }
  }

  .store_deduction_style {
    background: #ff2c29;
    color: #fff;
    padding: 0 5px;
    font-size: 10px;
  }

  .store_cash_back_style {
    border: 1px solid #ff2c29;
    color: #ff2c29;
    padding: 0 5px;
    font-size: 10px;
  }

  .loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
