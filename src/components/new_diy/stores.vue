<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <!--门店静态-->
    <div>
      <div id="store" v-if="datas.get_number">
        <div class="tab_box" v-if="datas.tab_list && datas.tab_list.length > 0 && !tabcontrol">
          <ul class="tab_list">
            <van-tabs
              v-model="active"
              :sticky="sticky"
              @change="onClick"
              :background="datas.tab_bg_color"
              :title-active-color="datas.tab_active_color"
              :color="datas.tab_active_color"
              :title-inactive-color="datas.tab_color"
              id="tab"
            >
              <van-tab title="商家" name="business_merchant" v-if="datas.tab_list.indexOf('1') > -1">
                <div class="store-box">
                  <storeItem02 :storeList="shopList0" :datas="datas" v-if="datas.sort_style && datas.sort_style == '2'"></storeItem02>
                  <storeItem :storeList="shopList0" :datas="datas" v-else></storeItem>
                  <div v-if="(shopList0.length <= 0 || !isLoadMore0) && lastIndex == index" class="loading-box">{{ $i18n.t("没有更多了") }}~</div>
                  <div class="loading-box" v-if="isLoadMore0" @click="getMoreList">
                    {{ $i18n.t("加载更多") }}
                  </div>
                </div>
              </van-tab>
              <van-tab title="折扣" name="business_discount" v-if="datas.tab_list.indexOf('2') > -1">
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
                  <div v-if="shopList1.length <= 0" class="loading-box">
                    暂无数据
                  </div>
                  <div class="loading-box" v-if="isLoadMore1" @click="getMorePdData">
                    {{ $i18n.t("加载更多") }}
                  </div>
                </div>
              </van-tab>
              <van-tab title="优惠券" name="business_coupon" v-if="datas.tab_list.indexOf('3') > -1">
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
                  <div v-if="shopList2.length <= 0" class="loading-box">
                    暂无数据
                  </div>
                  <div class="loading-box" v-if="isLoadMore2" @click="getMoreList">
                    {{ $i18n.t("加载更多") }}
                  </div>
                </div>
              </van-tab>
              <van-tab title="礼包" name="business_goods_gift" v-if="datas.tab_list.indexOf('4') > -1">
                <div class="gift_box">
                  <storeGift :datas="datas" :list="shopList3"></storeGift>
                  <div v-if="shopList3.length <= 0" class="loading-box">
                    暂无数据
                  </div>
                  <div class="loading-box" v-if="isLoadMore3" @click="getMoreList">
                    {{ $i18n.t("加载更多") }}
                  </div>
                </div>
              </van-tab>
            </van-tabs>
          </ul>
        </div>

        <template v-if="tabcontrol">
          <div class="store-box">
            <storeItem02 :storeList="shopList0" :plugin_active="plugin_active" :datas="datas" v-if="(datas.sort_style && datas.sort_style == '2') || openTemplate == 1"></storeItem02>
            <storeItem :storeList="shopList0" :plugin_active="plugin_active" :datas="datas" v-else></storeItem>

            <div v-if="(shopList0.length <= 0 || !isLoadMore0) && lastIndex == index" class="loading-box">{{ $i18n.t("没有更多了") }}~</div>
            <div class="loading-box" v-if="isLoadMore0" @click="getMoreList">
              {{ $i18n.t("加载更多") }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import emptyImage from "../../assets/images/new_diy/banner.png";
import storeItem from "./component/store_item";
import storeItem02 from "./component/store_item02";
import storeGift from "./component/store_gift";

// import { Toast } from 'vant';

const documentElement = document.documentElement;
const body = document.body;
// 自定义样式
const css = function() {
  if (this.datas.preview_color) {
    // 确保数据已传入
    let datas = this.plugin_active && this.openTemplate == 1 ? this.datas_style02 : this.datas;
    const {
      preview_color,
      font_size,
      font_color,
      border_radius,
      class_font_size,
      class_font_color,
      class_bg_color,
      class_border_radius,
      location_font_size,
      location_font_color,
      discount_font_size,
      discount_title_color,
      discount_font_color,
      tag_font_size,
      tag_font_color,
      tag_bg_color,
      tag_border_color,
      tag_border_radius
    } = datas;

    return `
        .component-${this.id} .store-list {
            background-color: ${preview_color};
        }

        .component-${this.id} .store-list .right .title{
            font-size: ${font_size}px;
            color: ${font_color};
        }

        .component-${this.id} .store-list .left .image img{
            border-radius: ${border_radius}px;
        }

        .component-${this.id} .store-list .right .distance{
            font-size: ${location_font_size}px;
            color: ${location_font_color};
        }

        .component-${this.id} .store-list .category{
            background-color: ${class_bg_color};
            border-radius: ${class_border_radius}px;
            font-size: ${class_font_size}px;
            color: ${class_font_color};
        }

        .component-${this.id} .store-list .discounts .discounts-list{
            font-size: ${discount_font_size}px;
        }

        .component-${this.id} .store-list .discounts .discounts-list .con{
            color: ${discount_font_color};
        }

        .component-${this.id} .store-list .discounts-list .type{
            color: ${discount_title_color};
        }

        .component-${this.id} .store-list .label-list .label-title{
            background-color: ${tag_bg_color};
            border-radius: ${tag_border_radius}px;
            border: solid  1px ${tag_border_color};
            font-size: ${tag_font_size}px;
            color: ${tag_font_color};
        }

    `;
  }
};

export default {
  data() {
    return {
      emptyImage,
      active: "business_merchant",
      sticky: false,

      tab: 0,
      titleName: [
        {
          id: "business_merchant",
          text: "商家",
          url: "plugin.store-cashier.frontend.store.store.get-store-list-to-page"
        },
        {
          id: "business_discount",
          text: "折扣",
          url: "plugin.universal-card.frontend.store-discount.store-data"
        },
        {
          id: "business_coupon",
          text: "优惠券",
          url: "plugin.store-cashier.frontend.store.aggregate-page.coupon"
        },
        {
          id: "business_goods_gift",
          text: "礼包",
          url: "plugin.store-cashier.frontend.store.aggregate-page.goods-gift"
        }
      ],
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

      openTemplate: 0, //门店列表样式
      datas_style02: {
        get_number: 999,
        preview_color: "#f5f5f5",
        font_size: 14,
        font_color: "#666666",
        border_radius: 5,
        class_font_size: 12,
        class_font_color: "#f08316",
        class_bg_color: "#fff",
        class_border_radius: 5,
        location_font_size: 14,
        location_font_color: "#666666",
        discount_font_size: 10,
        discount_title_color: "#ffffff",
        discount_font_color: "#666666",
        discount_list: ["1", "2", "3", "4"],
        tag_font_size: 10,
        tag_font_color: "#fff",
        tag_bg_color: "#f08316",
        tag_border_color: "#f08316",
        tag_border_radius: 5,
        show_goods: true,
        tab_list: [],
        tab_bg_color: "#ffffff",
        tab_color: "#333333",
        tab_active_color: "#ff8400"
      } //门店列表样式
    };
  },
  props: ["id", "datas", "tabcontrol", "lastIndex", "index", "plugin_active"],
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  components: {
    storeItem,
    storeItem02,
    storeGift
  },
  mounted() {
    if (this.tabcontrol) {
      // let myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   this.chooseTab(" ", "business_merchant");
      //   //初始化数据
      // } else {
      this.fun
        .getLocation()
        .then(res => {
          this.point = res.point;
          this.city = res.city;
          this.address = res.title;
          this.chooseTab(" ", "business_merchant");
        })
        .catch(err => {
          this.chooseTab(" ", "business_merchant");
          console.log(err);
        });
      // this.getLocation();
      // }
    } else {
      // let myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   if (this.datas.tab_list.indexOf("1") > -1) {
      //     this.chooseTab(" ", "business_merchant");
      //   } else if (this.datas.tab_list.indexOf("2") > -1) {
      //     this.chooseTab(" ", "business_discount");
      //   } else if (this.datas.tab_list.indexOf("3") > -1) {
      //     this.chooseTab(" ", "business_coupon");
      //   } else if (this.datas.tab_list.indexOf("4") > -1) {
      //     this.chooseTab(" ", "business_goods_gift");
      //   }
      //初始化数据
      // } else {
      // console.log("location不存在");
      this.fun
        .getLocation()
        .then(res => {
          this.point = res.point;
          this.city = res.city;
          this.address = res.title;
          if (this.datas.tab_list.indexOf("1") > -1) {
            this.chooseTab(" ", "business_merchant");
          } else if (this.datas.tab_list.indexOf("2") > -1) {
            this.chooseTab(" ", "business_discount");
          } else if (this.datas.tab_list.indexOf("3") > -1) {
            this.chooseTab(" ", "business_coupon");
          } else if (this.datas.tab_list.indexOf("4") > -1) {
            this.chooseTab(" ", "business_goods_gift");
          }
        })
        .catch(err => {
          this.chooseTab(" ", "business_merchant");
          console.log(err);
        });
      // this.getLocation();
      // }
    }
    setTimeout(() => {
      this.sticky = true;
    }, 500);
  },
  activated() {
    if (this.tabcontrol) {
      // let myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   this.chooseTab(" ", "business_merchant");
      //   //初始化数据
      // } else {
      this.fun
        .getLocation()
        .then(res => {
          this.point = res.point;
          this.city = res.city;
          this.address = res.title;
          this.chooseTab(" ", "business_merchant");
        })
        .catch(err => {
          this.chooseTab(" ", "business_merchant");
          console.log(err);
        });
      // this.getLocation();
      // }
    } else {
      // let myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   if (this.datas.tab_list.indexOf("1") > -1) {
      //     this.chooseTab(" ", "business_merchant");
      //   } else if (this.datas.tab_list.indexOf("2") > -1) {
      //     this.chooseTab(" ", "business_discount");
      //   } else if (this.datas.tab_list.indexOf("3") > -1) {
      //     this.chooseTab(" ", "business_coupon");
      //   } else if (this.datas.tab_list.indexOf("4") > -1) {
      //     this.chooseTab(" ", "business_goods_gift");
      //   }
      //   //初始化数据
      // } else {
      this.fun
        .getLocation()
        .then(res => {
          this.point = res.point;
          this.city = res.city;
          this.address = res.title;
          if (this.datas.tab_list.indexOf("1") > -1) {
            this.chooseTab(" ", "business_merchant");
          } else if (this.datas.tab_list.indexOf("2") > -1) {
            this.chooseTab(" ", "business_discount");
          } else if (this.datas.tab_list.indexOf("3") > -1) {
            this.chooseTab(" ", "business_coupon");
          } else if (this.datas.tab_list.indexOf("4") > -1) {
            this.chooseTab(" ", "business_goods_gift");
          }
        })
        .catch(err => {
          this.chooseTab(" ", "business_merchant");
          console.log(err);
        });
      // this.getLocation();
      // }
    }
  },
  methods: {
    onClick(index, title) {
      // console.log(index,title)
      this.chooseTab("", index);
    },
    chooseTab(key, index) {
      // 找到对应的索引
      function pFn(p) {
        return p.id == index;
      }
      this.tab = this.titleName.findIndex(pFn);
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
      this.getList();
    },
    getList() {
      $http
        .get(this.api, this.dataJson, " ")
        .then(
          response => {
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

              if (this.tab == 0) {
                if (this[`shopList${this.tab}`].length > this.datas.get_number) {
                  this[`shopList${this.tab}`].splice(this.datas.get_number, this[`shopList${this.tab}`].length - this.datas.get_number);
                  this[`isLoadMore${this.tab}`] = false;
                }
              }
              if (response.data.hasOwnProperty("store_list_style")) {
                this.openTemplate = response.data.store_list_style || 0;
              }
            } else {
              console.log(response.msg);
            }
          },
          response => {
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
        $http
          .get(this.api, this.dataJson, " ")
          .then(
            response => {
              this[`isLoadMore${this.tab}`] = true;
              if (response.result === 1) {
                if (this.tab !== 1) {
                  this[`shopList${this.tab}`] = this[`shopList${this.tab}`].concat(response.data.data);
                  this[`total_page${this.tab}`] = response.data.last_page;
                }

                this[`page${this.tab}`] >= this[`total_page${this.tab}`] ? (this[`isLoadMore${this.tab}`] = false) : (this[`isLoadMore${this.tab}`] = true);

                if (this.tab == 0) {
                  if (this[`shopList${this.tab}`].length > this.datas.get_number) {
                    this[`shopList${this.tab}`].splice(this.datas.get_number, this[`shopList${this.tab}`].length - this.datas.get_number);
                    this[`isLoadMore${this.tab}`] = false;
                  }
                }

                this.$emit("setLoadMore", this[`isLoadMore${this.tab}`]);
              } else {
                this[`page${this.tab}`] = this[`page${this.tab}`] - 1;
                this[`isLoadMore${this.tab}`] = false;
              }
            },
            function(response) {
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
    //跳转至门店首页
    gotoShop(id) {
      this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: id }));
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
        if (obj.addressComponent) {
          that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;
        } else {
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
        if (that.tabcontrol) {
          that.chooseTab(" ", "business_merchant");
        } else {
          if (that.datas.tab_list.indexOf("1") > -1) {
            that.chooseTab(" ", "business_merchant");
          } else if (that.datas.tab_list.indexOf("2") > -1) {
            that.chooseTab(" ", "business_discount");
          } else if (that.datas.tab_list.indexOf("3") > -1) {
            that.chooseTab(" ", "business_coupon");
          } else if (that.datas.tab_list.indexOf("4") > -1) {
            that.chooseTab(" ", "business_goods_gift");
          }
        }
      }

      function onError(obj) {
        if (that.tabcontrol) {
          that.chooseTab(" ", "business_merchant");
        } else {
          if (that.datas.tab_list.indexOf("1") > -1) {
            that.chooseTab(" ", "business_merchant");
          }
        }
        console.log(obj);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// 默认
* {
  list-style-type: none;
}

.component-wrapper {
  width: 100%;
  text-align: left;
}

#store {
  background: #f5f5f5;

  .rebate_box {
    /* background: #fff; */
    text-align: center;

    /* margin-top: 0.625rem; */
    .content_b_a {
      .tab_b {
        /* background: #fff; */
        overflow-x: scroll;
        white-space: nowrap;
        border-bottom: solid 0.0625rem #ebebeb;

        .tab_b_box {
          display: flex;
          font-size: 15px;

          li {
            flex: 1;
            min-width: 18%;
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
        /* background: #fafafa; */
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
    /* background: #fff; */

    /* margin-top: 0.625rem; */
    padding: 0.625rem 0;

    .coupon {
      /* background: #fff; */
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
          text-align: center;
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

  .scroll {
    overflow-x: scroll;
  }

  .loading-box {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
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
    margin-left: 0.25rem;
  }
}
</style>
