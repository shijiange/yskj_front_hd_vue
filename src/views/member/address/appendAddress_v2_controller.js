
import cTitle from "components/title";
// import { CitySelect } from "vue-ydui";
// import District from "src/gov_province_city_area_id";
// import areaList from "src/list_province_city_area"


export default {
  data() {
    return {
      form: {
        username: "",
        mobile: "",
        province: "",
        city: "",
        district: "",
        address: "",
        isDefault: false,
        street: ""
      },

      // 是否可不添加区域
      is_region: 0,

      addressShow: false,
      addressName: "",
      district: district,
      // areaList: {}, // vant需要接口配合修改json格式为area.js

      //省市区id值
      districtVal: [],
      streetShow: false,
      strShow: false,

      isResize: false
    };
  },
  methods: {
    isFocus() {
      this.isResize = true;
    },
    isBlur() {
      this.isResize = false;
    },

    appendAddress() {
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
        that.$dialog.alert({message:"请输入所在地区"});

        return;
      }

      if (this.is_region==1 && this.strShow && this.fun.isTextEmpty(this.form.street)) {
        that.$dialog.alert({message:"请输入所在街道"});

        return;
      }

      if (this.fun.isTextEmpty(this.form.address)) {
        that.$dialog.alert({message:"请输入详细地址"});

        return;
      }

      $http
        .get("member.member-address.store", {
          username: this.form.username,
          mobile: this.form.mobile,
          city: this.form.city,
          address: this.form.address,
          province: this.form.provice == undefined ? '' : this.form.provice,
          isdefault: this.form.isDefault ? 1 : 0,
          district: this.form.district,
          street: this.form.street
        })
        .then(
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
      console.log(obj);
      this.form.street = "";
      this.districtVal = "";
      // this.addressName =
      //   obj[0].name + " " + obj[1].name + " " + obj[2].name;
      // this.form.provice = obj[0].name;
      // this.form.city = obj[1].name;
      // this.form.district = obj[2].name;
      // this.getStreet(obj[2].code);
      // this.addressShow = false;
      // return
      this.form.street = "";
      this.districtVal = [];
      this.addressName =
        obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.form.provice = obj.itemName1;
      this.form.city = obj.itemName2;
      this.form.district = obj.itemName3;
      this.getStreet(obj.itemValue3);
    },

    streetChoose() {
      if (this.is_region==1 && this.fun.isTextEmpty(this.addressName)) {
        this.$dialog.alert({message:"请先选择所在地区"});

      } else {
        this.streetShow = true;
      }
    },

    streetConfirm(obj) {
      this.form.street = obj.areaname;
      this.streetShow = false;
      // return
      // this.form.street = name;
      // this.streetShow = false;
    },
    onCancel() {
      this.streetShow = false;
    },

    getStreet(param) {
      $http
        .get("member.memberAddress.street", { district_id: param })
        .then(response => {
          if (response.result == 1) {
            if (
              !this.fun.isTextEmpty(response.data) &&
              response.data.length > 0
            ) {
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
    this.form.username = "";
    this.form.mobile = "";
    this.form.province = "";
    this.form.city = "";
    this.form.district = "";
    this.form.street = "";
    this.form.address = "";
    this.form.isDefault = false;
    this.addressName = "";
    this.isResize = false;

    //  vant组件的
    // let province_list = {};
    // let city_list = {};
    // let county_list = {};
    //
    // for(let i=0;i<district.length;i++) {
    //   province_list[district[i].v] = district[i].n;
    //   for(let j=0;j<district[i].c.length;j++) {
    //     city_list[district[i].c[j].v] = district[i].c[j].n;
    //     for(let k=0;k<district[i].c[j].c.length;k++) {
    //       county_list[district[i].c[j].c[k].v] = district[i].c[j].c[k].n;
    //     }
    //   }
    // }
    // this.areaList = {
    //   province_list,
    //   city_list,
    //   county_list
    // }
    this.strShow = false;
    this.getIsOpenAddress();
  },
  mounted() {},
  components: { cTitle }
};
