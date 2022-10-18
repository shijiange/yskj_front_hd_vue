<!-- 地址选择、编辑、新增组件 -->
<template>
  <div id="yz_addressList">
    <!-- 当前账号地址记录 s-->
    <van-popup v-model="showAddress" class="award-list1" closeable @closed="closedAddress" :close-on-click-overlay="false" round position="bottom" :style="{ maxHeight: '80%' }">
      <div class="address-lists" v-if="!fun.isTextEmpty(addressData)">
        <div class="address-list-child" v-for="item in addressData" :key="item.id">
          <div class="address-list-child-left" @click.stop="selectAddress(item)">
            <div class="address-namenick"><span>{{ item.username + " " + item.mobile }}</span> <em class="isdefault" v-if="item.isdefault === 1">默认</em></div>
            <div class="address-shipping">{{ item.province }} {{ item.city }} {{ item.district }} {{ item.street || "" }} {{ item.address }}</div>
          </div>
          <div class="address-list-child-right" @click.stop="editAddress(item)">编辑</div>
        </div>
      </div>
      <div class="blank-text" v-else-if="!this.$store.state.isloadding && this.fun.isTextEmpty(addressData)">当前暂无地址记录！</div>
      <div v-else class="blank-text">正在加载数据...</div>
      <div style="height: 5rem;"></div>
      <div class="confirm-address-btn" @click.stop="addAddress">新增地址</div>
    </van-popup>
    <!-- 当前账号地址记录 end-->

    <!-- 添加或者编辑地址 s-->
    <van-popup v-model="popAddAddress" round position="bottom" :style="{ Height: '80%' }">
      <div class="m-dialog">
        <div>
          <div class="popHeader">
            <i class="iconfont icon-member-left" @click="popAddressClose"></i>
            <p>{{ create ? "添加地址" : "编辑地址" }}</p>
          </div>
          <div class="address_a">
            <ul>
              <li>
                <span style="white-space: nowrap;">收件人：</span>
                <input type="text" v-model="form.username" maxlength="20" placeholder="请输入收件人" />
              </li>
              <li>
                <span style="white-space: nowrap;">联系电话：</span>
                <input type="tel" v-model="form.mobile" placeholder="请输入联系电话" />
              </li>
            </ul>
          </div>

          <van-cell-group :border="false" class="set-address">
            <van-cell :border="false" center>
              <span slot="title">设置默认地址：</span>
              <van-switch slot="default" v-model="form.isDefault" active-color="#f15353" inactive-color="#fff" size="25px" />
            </van-cell>
          </van-cell-group>

          <van-cell-group :border="false" class="set-address">
            <van-cell :border="false" center is-link>
              <span slot="title">所在地区：</span>
              <input slot="default" type="text" @click.stop="openAddress" v-model="addressName" readonly placeholder="请选择收货地址" onfocus="blur();" />
            </van-cell>

            <van-cell :border="false" center is-link v-if="strShow">
              <span slot="title">街道：</span>
              <input slot="default" type="text" @click.stop="streetChoose" v-model="form.street" readonly placeholder="请选择街道" onfocus="blur();" />
            </van-cell>
          </van-cell-group>

          <div class="text_adderss">
            <input @focus="isFocus()" @blur="isBlur" placeholder="请输入详细地址" v-model="form.address" maxLength="100" />
          </div>
          <div class="text_adderss" style="text-align: left; border-top: 1px dashed #ddd; padding-top:10px;">
            <span slot="title" style="padding-left:12px;">智能识别：</span>
            <van-cell-group :border="false">
              <van-field
                :border="false"
                v-model="clipboard_address"
                rows="2"
                autosize
                type="textarea"
                placeholder="可粘贴或输入地址，可自动识别收件人、手机号和地址。"
              >
              </van-field>
              <van-cell :border="false">
                <van-button round size="mini" @click="onClip" type="info" style="width:50px;"  class="pull-right">识别</van-button>
              </van-cell>
            </van-cell-group>
          </div>
          <van-cell
            :border="false"
            center
            is-link
            v-if="Object.keys(options).length != 0 && options.is_open_store_delivery && form.city && (options.selected == 3 || options.selected == 11)"
            style="background: #fff; margin-top: 10px;"
            class="longitude"
            @click.native="toGeolocation"
            title-style="text-align:left;color:#555;"
          >
            <span slot="title">
              <i class="iconfont icon-icon_location"></i>
            </span>
            <span slot="title">{{ locationName ? locationName : "获取位置" }}
              <span v-if="locationName" style="font-size: 10px; color: #f15353;" @click.stop="showLocation = true">修改</span>
            </span>
          </van-cell>
          <van-cell-group >
            <van-cell v-if="create"  :border="false">
              <van-button type="danger" block @click="appendAddress" color="#f15353"><i class="fa fa-plus-circle"></i> 保存</van-button>
            </van-cell>
            <van-cell v-if="!create"  :border="false">
              <van-button type="danger" block @click="appendAddress('update')" color="#f15353">编辑</van-button>
            </van-cell>
          </van-cell-group>
<!--          <div class="adderss_btn" v-if="create" @click="appendAddress">-->
<!--            <button type="button"><i class="fa fa-plus-circle"></i>保存</button>-->
<!--          </div>-->
<!--          <div class="adderss_btn" v-if="!create" @click="appendAddress('update')">-->
<!--            <button type="button">编辑</button>-->
<!--          </div>-->
        </div>
      </div>
    </van-popup>
    <!-- 添加或者编辑地址 end-->

    <!-- 省市区地址选择器 s -->
    <yd-cityselect style="height: 80%;" v-model="addressShow" :callback="addressCallback" :items="district"></yd-cityselect>
    <!-- 省市区地址选择器 end -->

    <!-- 街道选择器 s -->
    <van-popup v-model="streetShow" round position="bottom" :style="{ height: '80%' }">
      <div class="m-dialog1">
        <van-nav-bar title="选择街道" class="pcStyle_ydT">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333" />
            </span>
          </template>
        </van-nav-bar>
        <van-cell :border="false" center is-link v-for="(item, i) in districtVal" :key="i" @click.native="streetConfirm(item.areaname)" title-style="text-align:left">
          <span slot="title">{{ item.areaname }}</span>
        </van-cell>
      </div>
    </van-popup>
    <!-- 街道选择器 end -->

    <!-- 地图 s -->
    <location v-model="showLocation" :center_path="center_path" :path_list="path_list" :local_city="local_city" v-on:confirm="confirmLocation"></location>
    <!-- 地图 end -->
  </div>
</template>

<script>
import { Toast } from "vant";
import location from "./location";
export default {
  model: {
    prop: "showAddress",
    event: "onEmit"
  },
  props: {
    //弹窗是否显示，默认不显示
    showAddress: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object, //可接收配置项（对象类型！！！），增加可扩展性
      default: () => ({})
    },
    path_list: {
      type: Array
    },
    center_path: {
      type: Array
    }
  },
  data() {
    return {
      showLocation: false,
      popAddAddress: false,
      addressShow: false,
      streetShow: false,

      create: true, //新增与编辑标记
      form: {
        username: "",
        mobile: "",
        province: "",
        city: "",
        district: "",
        street: "",
        address: "",
        isDefault: false
      },
      is_region: 0,
      district: district, // 地址本地数据
      addressName: "", // 地址区域
      strShow: false, // 街道显示

      clipboard_address:'',
      districtVal: "",
      addressData: [], //地址列表
      defaultAddress: {} //默认地址
    };
  },
  watch: {
    // 如果 `showAddress` 发生改变，这个函数就会运行
    showAddress: function(newV, oldV) {
      console.log(newV)
      if (newV) {
        this.getAddress();
      }
    }
  },
  computed: {
    local_city() {
      return this.form.city;
    },
  },
  components: { location },

  mounted() {},

  methods: {
    closedAddress() {
      this.$emit("onEmit", false);
    },
    openAddress() {
      this.addressShow = true;
    },
    // 获取收货地址
    getAddress() {
      this.addressData = [];
      let that = this;
      $http.get("member.member-address.index", {}, "获取中").then(
        function(response) {
          if (response.result === 1) {
            that.addressData = response.data;
            that.defaultAddress = response.data.filter(function(item) {
              return item.isdefault === 1;
            });
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    onClip(){
      // let res = smartAddress.addrMatch(this.clipboard_address);
      // let res2 = addrParse(this.clipboard_address);
      // let res3 = smart(this.clipboard_address)
      $http.post("member.memberAddress.parseAddress", {address_info: this.clipboard_address}, '识别中').then((res)=>{
        if(res.result == 1){
          this.form.username = res.data.name;
          this.form.mobile = res.data.mobile;
          this.form.province = !_.isNull(res.data.province) ? res.data.province : "";
          this.form.city = !_.isNull(res.data.city) ? res.data.city : "";
          this.form.district = !_.isNull(res.data.region) ? res.data.region : "";
          this.form.address = !_.isNull(res.data.street) ? res.data.street : "";
          this.addressName = this.form.province + " " + this.form.city + " " + this.form.district;
          this.form.province_id = item.province_id;
          this.form.city_id = item.city_id;
          this.form.district_id = item.district_id;
        }else{
          Toast('智能识别失败，请手动填写地址');
        }
      });
    },
    selectAddress(item) {
      //选择了地址列表
      this.$emit("onEmit", false);
      this.$emit("confirm", item);
    },
    // 设置地址
    editAddress(item) {
      this.getStreet(item.district_id);
      this.form.address_id = item.id;
      this.form.username = item.username;
      this.form.mobile = item.mobile;
      this.form.province = item.province;
      this.form.province_id = item.province_id;
      this.form.city = item.city;
      this.form.city_id = item.city_id;
      this.form.district = item.district;
      this.form.district_id = item.district_id;
      this.form.address = item.address;
      this.form.street = item.street;
      this.form.isDefault = item.isdefault === 0 ? false : true;
      this.addressName = this.form.province + " " + this.form.city + " " + this.form.district;
      this.locationName = "";
      if (Object.keys(this.options).length != 0 && this.options.is_open_store_delivery == true  && (this.options.selected == 3 || this.options.selected == 11)) {
        this.form.longitude = item.longitude || "";
        this.form.latitude = item.latitude || "";

        if (this.form.longitude) {
          this.locationName = "经度：" + this.form.longitude + "  纬度：" + this.form.latitude;
        }
      }
      this.$forceUpdate();
      this.create = false;
      this.popAddAddress = true;
    },
    // 获取街道
    getStreet(param) {
      this.district_id = param;
      $http
        .get("member.memberAddress.street", {
          district_id: param
        })
        .then(response => {
          if (response.result === 1 && !this.fun.isTextEmpty(response.data)) {
            if (!this.fun.isTextEmpty(response.data) && response.data.length > 0) {
              this.districtVal = response.data;
              this.strShow = true;
            } else {
              this.strShow = false;
            }
          } else {
            this.strShow = false;
          }
        })
        .catch(error => {
          this.strShow = false;
          console.log(error);
        });
    },
    streetChoose() {
      if (this.is_region == 1 && this.fun.isTextEmpty(this.addressName)) {
        this.$dialog.alert({ message: "请先选择所在地区" });
      } else {
        this.streetShow = true;
      }
    },
    // 关闭增加地址
    popAddressClose() {
      this.popAddAddress = false;
      this.$emit("onEmit", false);
    },
    toGeolocation() {
      this.getGeocoder();
    },
    getGeocoder() {
      let geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: self.local_city
      });
      geocoder.getLocation(this.addressName+this.form.address, (status, result)=> {
        if (status === 'complete'&&result.geocodes.length) {
          let lnglat = result.geocodes[0].location;
          let point = this.fun.bd_encrypt(lnglat.lng, lnglat.lat);
          this.form.longitude = point.lng;
          this.form.latitude = point.lat;
          this.locationName = "经度：" + this.form.longitude + "  纬度：" + this.form.latitude;
          this.$forceUpdate();
        }else{
          Toast('根据地址查询位置失败,请手动设置经纬度');
          this.showLocation = true;
        }
      });
    },
    confirmLocation(e) {
      if (e.point) {
        let point = this.fun.bd_decrypt(e.point.lng, e.point.lat);
        this.form.longitude = point.lng;
        this.form.latitude = point.lat;
        this.locationName = "经度：" + this.form.longitude + "  纬度：" + this.form.latitude;
      }
    },
    // 增加/修改地址
    appendAddress(str) {
      var that = this;

      if (this.fun.isTextEmpty(this.form.username)) {
        this.$dialog.alert({ message: "请输入收货人姓名" });
        return;
      }

      if (this.fun.isTextEmpty(this.form.mobile)) {
        this.$dialog.alert({ message: "请输入联系电话" });
        return;
      }
      if (!/^[0-9]{1,}$/.test(this.form.mobile)) {
        this.$dialog.alert({ message: "请输入正确的联系电话" });
        return;
      }

      if (this.is_region == 1 && this.fun.isTextEmpty(this.addressName)) {
        this.$dialog.alert({ message: "请选择所在区域" });
        return;
      }

      if (this.is_region == 1 && this.strShow && this.fun.isTextEmpty(this.form.street)) {
        this.$dialog.alert({ message: "请选择所在街道" });
        return;
      }

      if (this.fun.isTextEmpty(this.form.address)) {
        this.$dialog.alert({ message: "请输入详细地址" });
        return;
      }
      // 门店配送
      if (Object.keys(this.options).length != 0 && this.options.is_open_store_delivery == true && (this.options.selected == 3 || this.options.selected == 11)) {
        if (this.fun.isTextEmpty(this.form.longitude)) {
          this.$dialog.alert({ message: "请选择经纬度" });
          return;
        }
      }

      let json = {
        username: this.form.username,
        mobile: this.form.mobile,
        province: this.form.province == undefined ? "" : this.form.province,
        city: this.form.city,
        district: this.form.district,
        address: this.form.address,
        isdefault: this.form.isDefault ? 1 : 0,
        address_id: this.form.address_id
      };
      if (this.strShow) {
        json.street = this.form.street;
      }
      if (Object.keys(this.options).length != 0 && this.options.is_open_store_delivery == true && (this.options.selected == 3 || this.options.selected == 11)) {
        json.longitude = this.form.longitude;
        json.latitude = this.form.latitude;
      }

      let api = "";
      if (str === "update") {
        api = "member.member-address.update";
        that.form.action = 'update';
      } else {
        api = "member.member-address.store";
        that.form.action = 'store';
      }

      $http.post(api, json, "").then(
        function(response) {
          if (response.result == 1) {
            that.$dialog.alert({ message: response.msg });
            that.popAddressClose();
            that.form.id = response.data.id;
            that.$emit("confirm", that.form); //触发父组件方法
            that.form = {
              username: "",
              mobile: "",
              province: "",
              city: "",
              district: "",
              street: "",
              address: "",
              isDefault: false
            };
            that.addressName = "";
            that.clipboard_address = '';
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    // 地址回调
    addressCallback(obj) {
      this.form.street = "";
      this.districtVal = "";
      this.addressName = obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.form.province = obj.itemName1;
      this.form.city = obj.itemName2;
      this.form.district = obj.itemName3;
      this.form.province_id = obj.itemValue1;
      this.form.city_id = obj.itemValue2;
      this.form.district_id = obj.itemValue3;
      this.getStreet(obj.itemValue3);
    },
    streetConfirm(name) {
      this.form.street = name;
      this.streetShow = false;
    },
    isFocus() {
      this.isResize = true;
    },
    isBlur() {
      this.isResize = false;
    },
    // 跳转到新增地址
    addAddress() {
      // 关闭 地址栏
      this.getIsOpenAddress();
      // 新增地址 本地处理
      this.showAddAddress();
    },
    getIsOpenAddress() {
      $http
        .get("member.member-address.is-region")
        .then(response => {
          if (response.result == 1) {
            this.is_region = response.data.is_region;
          } else {
            console.log(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 显示增加地址
    showAddAddress() {
      let that = this;
      this.form = {
        username: "",
        mobile: "",
        province: "",
        city: "",
        district: "",
        street: "",
        address: "",
        isDefault: false
      };
      this.addressName = "";
      this.popAddAddress = true;
      this.create = true;
      this.locationName = "";
      if (this.is_open_store_delivery == true && (this.selected == 3 || this.selected== 11)) {
        that.form.longitude = "";
        that.form.latitude = "";
        that.locationName = "";
        if (that.$store.state.o2oLocation.point) {
          that.form.longitude = that.$store.state.o2oLocation.point ? that.$store.state.o2oLocation.point.lng : "";
          that.form.latitude = that.$store.state.o2oLocation.point ? that.$store.state.o2oLocation.point.lat : "";
          that.locationName = "经度：" + that.form.longitude + "  纬度：" + that.form.latitude;
        }
      }
    }
  }
};
</script>
<style>
.amap-sug-result {
  z-index: 9999;
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
#yz_addressList {
  input {
    border: none;
  }

  .blank-text {
    padding: 2rem 0;
    text-align: center;
    font-size: 16px;
    color: #666;
  }

  /deep/.yd-cityselect-active {
    z-index: 9999;
  }

  .award-list1 {
    .address-lists {
      max-height: 18rem;
      overflow: scroll;
      padding: 2.5rem 0.875rem 0;
      position: relative;

      .address-list-child {
        display: flex;
        align-items: center;
        padding: 0.875rem 0 0;

        .address-list-child-left {
          flex: 1;
          text-align: left;
          padding-right: 0.5rem;

          .address-namenick {
            display: flex;
            font-weight: 700;
          }

          .isdefault {
            margin-left: 5px;
            flex: 0 0 30px;
            color: #f14e4e;
          }
        }

        .address-list-child-right {
          width: 3.75rem;
          height: 1.75rem;
          line-height: 1.75rem;

          /* background-color: #f14e4e; */

          /* border-radius: 0.375rem; */
          color: #f14e4e;
        }
      }
    }

    .confirm-address-btn {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      width: 21.625rem;
      height: 2.75rem;
      background-color: #f14e4e;
      border-radius: 1.375rem;
      font-weight: 700;
      font-size: 16px;
      color: #fff;
      line-height: 2.75rem;
    }
  }

  .m-dialog {
    width: 100%;
    z-index: 100;
  }

  .popHeader,
  .DYFpopHeader {
    width: 100%;
    height: 2.5rem;
    background: white;
    display: flex;
    font-size: 16px;
    text-align: center;

    p {
      font-weight: bold;
      flex: 1;
      align-self: center;
    }

    i {
      padding: 0.5rem;
      align-self: center;
      flex: 0 0 1.5rem;
    }
  }

  .DYFpopHeader {
    position: fixed;
    top: 0;
    z-index: 9;
  }
  // 新css
  .address_a,
  .address_b {
    background-color: #fff;
    padding-left: 14px;

    li {
      height: 3.125rem;
      line-height: 3.125rem;
      padding-right: 14px;

      /* border-bottom:solid 0.0625rem #ebebeb; */
      display: flex;
      align-items: center;
      font-size: 16px;
    }

    li:last-child {
      border: none;
    }
  }

  .set-address {
    .van-cell {
      padding: 10px 12px;

      .van-cell__title {
        flex: none;
        color: #555;
        text-align: left;
      }

      .van-cell__value {
        input {
          color: #555;
          width: 100%;
        }
      }
    }

    /deep/.van-cell:active {
      background-color: #fff !important;
    }
  }

  .address_a span {
    white-space: nowrap;
  }

  .address_b {
    margin-bottom: 0.625rem;

    li {
      justify-content: space-between;
    }
  }

  .text_adderss {
    background-color: #fff;

    input {
      text-wrap: unset;
      padding: 0.625rem 0.875rem;
      font-size: 14px;
      line-height: 1.5rem;
      width: 100%;
      min-height: 3.25rem;
    }
  }

  .adderss_btn {
    margin: 1.25rem auto;

    button {
      width: 18.75rem;
      height: 2.8125rem;
      border-radius: 0.3125rem;
      background: #f15353;
      color: #fff;
      padding: 0;
      border: none;

      i {
        font-size: 1.125rem;
        margin-right: 0.375rem;
      }
    }
  }

  .address_addnav {
    z-index: 10;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0 3% 0 6% !important;
    left: 0;
    background: #f15353 !important;
    color: #fff !important;
    text-align: center;
    height: 2.8125rem !important;
    line-height: 2.8125rem !important;
  }
}
</style>
