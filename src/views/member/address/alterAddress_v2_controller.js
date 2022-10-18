import cTitle from "components/title";
// import { CitySelect } from "vue-ydui";
// import District from "src/gov_province_city_area_id";

export default {
  data() {
    return {
      form: {
        username: "",
        mobile: "",
        city: "",
        address: "",
        province: "",
        district: "",
        uid: 9,
        isDefault: false,
        streetName: ""
      },

      // 是否可不添加区域
      is_region: 0,

      addressShow: false,
      district: district,

      //省市区id值
      districtVal: [],
      streetShow: false,
      isShowStreet: false,
      address_id: 0,

      addressName: ""
    };
  },
  methods: {
    alterAddresshandle() {
      var that = this;

      if (this.fun.isTextEmpty(this.form.username)) {
        that.$dialog.alert({message:"请输入收件人"});

        return;
      }

      if (this.fun.isTextEmpty(this.form.mobile)) {
        that.$dialog.alert({message:"请输入联系电话"});

        return;
      }
      if(!/^[0-9]{1,}$/.test(this.form.mobile)) {
        that.$dialog.alert({message:"请输入正确的联系电话"});

        return;
      }


      if (this.is_region==1 && this.fun.isTextEmpty(this.addressName)) {
        this.$dialog.alert({message:"请输入所在地区"});
        return;
      }

      if (this.is_region==1 && this.isShowStreet && this.fun.isTextEmpty(this.form.streetName)) {
        this.$dialog.alert({message:"请输入所在街道"});

        return;
      }

      if (this.fun.isTextEmpty(this.form.address)) {
        this.$dialog.alert({message:"请输入详细地址"});
        return;
      }

      let json = {};
      if (this.isShowStreet) {
        json = {
          address_id: this.address_id,
          username: this.form.username,
          mobile: this.form.mobile,
          city: this.form.city,
          address: this.form.address,
          province: this.form.province == undefined ? '' : this.form.province,
          isdefault: this.form.isDefault ? 1 : 0,
          district: this.form.district,
          street: this.form.streetName
        };
      } else {
        json = {
          address_id: this.address_id,
          username: this.form.username,
          mobile: this.form.mobile,
          city: this.form.city,
          address: this.form.address,
          province: this.form.province== undefined ? '' : this.form.province,
          isdefault: this.form.isDefault ? 1 : 0,
          district: this.form.district
        };
      }

      $http.post("member.member-address.update", json, "").then(
        function(response) {
          if (response.result == 1) {
            that.$dialog.alert({message:response.msg}).then(()=>{
              that.$router.go(-1);
            });

          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          // error callback
        }
      );
    },
    //地址回调
    addressCallback(obj) {
      this.form.streetName = "";
      this.districtVal = "";
      this.form.province = obj.itemName1;
      this.form.city = obj.itemName2;
      this.form.district = obj.itemName3;

      this.addressName =
        obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.getStreet(obj.itemValue3);
    },
    //街道提示
    streetTip() {
      if (this.is_region==1 && this.fun.isTextEmpty(this.addressName)) {
        this.$dialog.alert({message:"请先选择所在地区"});
        return;
      }
      this.streetShow = true;
    },
    //街道选择
    streetConfirm(name) {
      this.form.streetName = name;
      this.streetShow = false;
    },
    //获取街道数据
    getStreet(param) {
      $http
        .get("member.memberAddress.street", { district_id: param })
        .then(response => {
          console.log(response);
          if (response.result == 1) {
            if (
              !this.fun.isTextEmpty(response.data) &&
              response.data.length > 0
            ) {
              this.districtVal = response.data;
              this.isShowStreet = true;
            } else {
              this.isShowStreet = false;
            }
          } else {
            this.this.isShowStreet = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
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
    }
  },
  activated() {
    this.isShowStreet = false;
    if(!this.$route.params.model) {
      this.$router.go(-1);
      return;
    }
    this.form.isDefault = this.$route.params.model.isdefault == 0 ? false : true;
    this.form.province = this.$route.params.model.province;
    this.address_id = this.$route.params.model.id;
    this.form.username = this.$route.params.model.username;
    this.form.mobile = this.$route.params.model.mobile;
    this.form.city = this.$route.params.model.city;
    this.form.district = this.$route.params.model.district;
    this.form.address = this.$route.params.model.address;
    this.form.streetName = this.$route.params.model.street;
    this.addressName =
      this.form.province + " " + this.form.city + " " + this.form.district;

    this.isShowStreet = !this.fun.isTextEmpty(this.form.streetName);
    if (this.isShowStreet) {
      this.getStreet(this.$route.params.model.district_id);
    }
  },
  mounted() {},
  components: { cTitle }
};
