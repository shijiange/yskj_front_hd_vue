<template>
  <div>
    <!-- 添加或者编辑地址 s-->
    <van-popup v-model="popShow" round position="bottom" :style="{ Height: '80%' }" z-index="100" >
      <div class="m-dialog">
        <div>
          <div class="popHeader">
            <i class="iconfont icon-member-left" @click="setPopShow(false)"></i>
            <p>编辑地址</p>
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
            <van-cell :border="false" center is-link>
              <span slot="title">所在地区：</span>
              <input slot="default" type="text" @click.stop="openAddress" v-model="addressName" readonly placeholder="请选择收货地址" />
            </van-cell>

            <van-cell :border="false" center is-link v-if="strShow">
              <span slot="title">街道：</span>
              <input slot="default" type="text" @click.stop="streetChoose" v-model="form.street" readonly placeholder="请选择街道"/>
            </van-cell>
          </van-cell-group>

          <div class="text_adderss">
            <input placeholder="请输入详细地址" v-model="form.address" maxLength="100" />
          </div>

          <div class="adderss_btn">
            <button type="button" @click="send">编辑</button>
          </div>
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
        <van-cell :border="false" center is-link v-for="(item, i) in districtVal" :key="i" @click.native="streetConfirm(item)" title-style="text-align:left">
          <span slot="title">{{ item.areaname }}</span>
        </van-cell>
      </div>
    </van-popup>
    <!-- 街道选择器 end -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      popShow: false,

      addressShow: false,
      streetShow: false,
      district: district, // 地址本地数据

      addressName: "",

      form: {
        username: "",
        mobile: "",
        province: "",
        city: "",
        district: "",
        street: "",
        address: ""
      },
      districtVal: "",
      strShow:false,

      province_id:0,
      city_id:0,
      district_id:0,
      street_id:0
    };
  },
  methods: {
    setFormData(obj){
      this.form.street = "";
      this.districtVal = "";

      this.addressName = obj.province + " " + obj.city + " " + obj.district;

      this.form.province = obj.province;
      this.form.city = obj.city;
      this.form.district = obj.district;

      this.form.street = obj.street;
      this.form.address = obj.address;

      this.form.username = obj.realname;
      this.form.mobile = obj.mobile;

      this.province_id = obj.province_id;
      this.city_id = obj.city_id;
      this.district_id = obj.district_id;
      this.street_id = obj.street_id;

      this.callback();
      this.getStreet(obj.district_id);

    },
    setPopShow(flag){
      this.popShow = flag;
    },
    openAddress() {
      this.addressShow = true;
    },
    addressCallback(obj) {
      this.form.street = "";
      this.districtVal = "";
      this.addressName = obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.form.province = obj.itemName1;
      this.form.city = obj.itemName2;
      this.form.district = obj.itemName3;

      this.province_id = obj.itemValue1;
      this.city_id = obj.itemValue2;
      this.district_id = obj.itemValue3;

      this.getStreet(obj.itemValue3);
    },
    streetConfirm(item) {
      this.street_id = item.id;
      this.form.street = item.areaname;
      this.streetShow = false;
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
    send(){

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

      this.callback();
      this.setPopShow(false);
    },
    callback(){
      let obj = {
        pick_up_name : this.form.username,
        pick_up_tel : this.form.mobile,
        pick_up_province : this.province_id,
        pick_up_city : this.city_id,
        pick_up_district : this.district_id,
        pick_up_street : this.street_id,
        pick_up_address : this.form.address,
        street: this.form.street,
        addressName:this.addressName
      };
      this.$emit('confirm',obj);

    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
input {
  border: none;
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
  text-align: center;
  button {
    width: 18.75rem;
    height: 2.8125rem;
    border-radius: 0.3125rem;
    background: #f15353;
    color: #fff;
    padding: 0;
    border: none;

    i {
      font-size: 18px;
      margin-right: 0.375rem;
    }
  }
}
</style>
