import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      address: {
        city: [],
        province: [],
        district: [],
        street: []
      },
      regionallevel: "",
      Provinces: "",
      Provinceid: "",
      city: "",
      cityid: "",
      district: "",
      districtid: "",
      street: "",
      streetid: "",
      regionallevelshow: false,
      Provincesshow: false,
      cityshow: false,
      districtshow: false,
      streetshow: false,
      regionallevelcolumns: [],
      Provincesshowcolumns: [],
      Provincesshow_1: false,
      cityshow_1: false,
      citycolumns: [],
      districtshow_1: false,
      districtcolumns: [],
      streetshow_1: false,
      streetcolumns: [],
      disabledbtn: true,
      goods_id: "",
      tipsmsg: "该地区不可选",
      noticePurchaseData: ""
    };
  },
  activated() {
    this.initialization();
    this.getregionallevel();
    this.getNoticePurchase();
  },
  methods: {
    getNoticePurchase() {
      let that = this;
      let json = {};
      $http.get("plugin.team-manage.frontend.getAgreement.index", json).then(
        function(response) {
          if (response.result == 1) {
            that.noticePurchaseData = response.data.agreement;
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    seleRegional: function() {
      this.regionallevelshow = true;
    },
    seleRegionalConfirmbtn: function(valData) {
      let val = valData;
      this.regionallevel = val.text;
      this.seleRegionallevel = val.level;
      this.addressinit();
      if (val.level == 1) {
        this.Provincesshow = true;
        this.cityshow = false;
        this.districtshow = false;
        this.streetshow = false;
      } else if (val.level == 2) {
        this.Provincesshow = true;
        this.cityshow = true;
        this.districtshow = false;
        this.streetshow = false;
      } else if (val.level == 3) {
        this.Provincesshow = true;
        this.cityshow = true;
        this.districtshow = true;
        this.streetshow = false;
      } else if (val.level == 4) {
        this.Provincesshow = true;
        this.cityshow = true;
        this.districtshow = true;
        this.streetshow = true;
      }
      this.regionallevelshow = false;
      this.checkbutton();
    },
    addressinit() {
      this.Provinces = "";
      this.Provinceid = "";
      this.city = "";
      this.cityid = "";
      this.district = "";
      this.districtid = "";
      this.street = "";
      this.streetid = "";
    },
    getregionallevel() {
      let that = this;
      this.regionallevelcolumns = [];
      $http.get("plugin.team-manage.frontend.getAreaLevel.index").then(
        function(response) {
          if (response.result == 1) {
            let tregionallevelData = response.data.area_level;
            for (let i = 0; i < tregionallevelData.length; i++) {
              let level = tregionallevelData[i].level;
              let name = tregionallevelData[i].name;
              that.regionallevelcolumns.push({
                text: name,
                level: level
              });
            }
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    initialization() {
      let that = this;
      that.Provincesshowcolumns = [];
      $http.get("member.member-address.address").then(
        function(response) {
          if (response.result == 1) {
            that.address.city = response.data.city;
            that.address.province = response.data.province;
            that.address.district = response.data.district;
            for (let i = 0; i < that.address.province.length; i++) {
              let areaname = that.address.province[i].areaname;
              let id = that.address.province[i].id;
              that.Provincesshowcolumns.push({
                text: areaname,
                id: id
              });
            }
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    ProvincesConfirmbtn: function(valData) {
      let val = valData;
      let id = val.id;
      this.Provinceid = id;
      this.Provinces = val.text;
      this.cityinit();
      this.city = "";
      this.cityid = "";
      this.district = "";
      this.districtid = "";
      this.street = "";
      this.streetid = "";
      this.Provincesshow_1 = false;
      this.checkbutton();
    },
    Provincesbtn() {
      if (!this.regionallevel) {
        Toast("请选择区域等级");
        return;
      }
      if (!(this.Provincesshowcolumns.length > 0)) {
        Toast("省份数据正在获取中....");
        return;
      }
      this.Provincesshow_1 = true;
    },
    cityinit() {
      this.citycolumns = [];
      for (let i = 0; i < this.address.city.length; i++) {
        if (this.Provinceid == this.address.city[i].parentid) {
          let areaname = this.address.city[i].areaname;
          let id = this.address.city[i].id;
          this.citycolumns.push({
            text: areaname,
            id: id
          });
        }
      }
    },
    cityConfirmbtn: function(valdata) {
      let val = valdata;
      let id = val.id;
      this.cityid = id;
      this.city = val.text;
      this.district = "";
      this.districtid = "";
      this.street = "";
      this.streetid = "";
      this.districtint();
      this.cityshow_1 = false;
      this.checkbutton();
    },
    citybtn() {
      if (!this.Provinces) {
        Toast("请选择省份");
        return;
      }
      if (!(this.citycolumns.length > 0)) {
        Toast("城市数据正在获取中....");
      }
      this.cityshow_1 = true;
    },
    districtint() {
      this.districtcolumns = [];
      for (let i = 0; i < this.address.district.length; i++) {
        if (this.cityid == this.address.district[i].parentid) {
          let areaname = this.address.district[i].areaname;
          let id = this.address.district[i].id;
          this.districtcolumns.push({
            text: areaname,
            id: id
          });
        }
      }
    },
    districtConfirmbtn: function(valdata) {
      let val = valdata;
      let id = val.id;
      this.districtid = id;
      this.district = val.text;
      this.street = "";
      this.streetid = "";
      this.getStreet();
      this.districtshow_1 = false;
      this.checkbutton();
    },
    districtbtn() {
      if (!this.city) {
        Toast("请选择城市");
        return;
      }
      if (!(this.districtcolumns.length > 0)) {
        Toast("区/县数据正在获取中....");
        return;
      }
      this.districtshow_1 = true;
    },
    getStreet() {
      this.streetcolumns = [];
      let that = this;
      $http.get("member.memberAddress.street", { district_id: this.districtid }).then(
        function(response) {
          if (response.result == 1) {
            that.address.street = response.data;
            for (let i = 0; i < that.address.street.length; i++) {
              let areaname = that.address.street[i].areaname;
              let id = that.address.street[i].id;
              that.streetcolumns.push({
                text: areaname,
                id: id
              });
            }
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    streetConfirmbtn: function(valData) {
      let val = valData;
      let id = val.id;
      this.streetid = id;
      this.street = val.text;
      this.streetshow_1 = false;
      this.checkbutton();
    },
    streetbtn() {
      if (!this.district) {
        Toast("请选择区/县");
        return;
      }
      if (!(this.streetcolumns.length > 0)) {
        Toast("街道数据正在获取中....");
        return;
      }
      this.streetshow_1 = true;
    },
    checkbutton() {
      if (this.seleRegionallevel == 1) {
        if (this.Provinceid) {
          this.validationOptional();
        } else {
          this.disabledbtn = true;
        }
      } else if (this.seleRegionallevel == 2) {
        if (this.Provinceid && this.cityid) {
          this.validationOptional();
        } else {
          this.disabledbtn = true;
        }
      } else if (this.seleRegionallevel == 3) {
        if (this.Provinceid && this.cityid && this.districtid) {
          this.validationOptional();
        } else {
          this.disabledbtn = true;
        }
      } else if (this.seleRegionallevel == 4) {
        if (this.Provinceid && this.cityid && this.districtid && this.streetid) {
          this.validationOptional();
        } else {
          this.disabledbtn = true;
        }
      }
    },
    validationOptional() {
      let that = this;
      let Json = {};
      if (this.seleRegionallevel == 1) {
        Json = {
          level: this.seleRegionallevel,
          province_id: this.Provinceid
        };
      } else if (this.seleRegionallevel == 2) {
        Json = {
          level: this.seleRegionallevel,
          province_id: this.Provinceid,
          city_id: this.cityid
        };
      } else if (this.seleRegionallevel == 3) {
        Json = {
          level: this.seleRegionallevel,
          province_id: this.Provinceid,
          city_id: this.cityid,
          district_id: this.districtid
        };
      } else if (this.seleRegionallevel == 4) {
        Json = {
          level: this.seleRegionallevel,
          province_id: this.Provinceid,
          city_id: this.cityid,
          district_id: this.districtid,
          street_id: this.streetid
        };
      }
      $http.get("plugin.team-manage.frontend.subArea.index", Json).then(
        function(response) {
          if (response.result == 1) {
            let goods_id = response.data.goods_id;
            that.goods_id = goods_id;
            that.disabledbtn = false;
          } else {
            that.tipsmsg = response.msg;
            that.disabledbtn = true;
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    goaddressgoodsbtn() {
      if (this.disabledbtn) {
        if (!this.regionallevel) {
          Toast("请选择区域等级");
          return false;
        }
        if (this.seleRegionallevel == 1) {
          if (!this.Provinceid) {
            Toast("请选择省份");
            return false;
          }
        } else if (this.seleRegionallevel == 2) {
          if (!(this.Provinceid && this.cityid)) {
            Toast("请选择省份、城市");
            return false;
          }
        } else if (this.seleRegionallevel == 3) {
          if (!(this.Provinceid && this.cityid && this.districtid)) {
            Toast("请选择省份、城市、区/县");
            return false;
          }
        } else if (this.seleRegionallevel == 4) {
          if (!(this.Provinceid && this.cityid && this.districtid && this.streetid)) {
            Toast("请选择省份、城市、区/县、街道");
            return false;
          }
        }
        Toast(this.tipsmsg);
      } else {
        if (this.seleRegionallevel == 1) {
          window.localStorage.setItem("level", this.seleRegionallevel);
          window.localStorage.setItem("province_id", this.Provinceid);
        } else if (this.seleRegionallevel == 2) {
          window.localStorage.setItem("level", this.seleRegionallevel);
          window.localStorage.setItem("province_id", this.Provinceid);
          window.localStorage.setItem("city_id", this.cityid);
        } else if (this.seleRegionallevel == 3) {
          window.localStorage.setItem("level", this.seleRegionallevel);
          window.localStorage.setItem("province_id", this.Provinceid);
          window.localStorage.setItem("city_id", this.cityid);
          window.localStorage.setItem("district_id", this.districtid);
        } else if (this.seleRegionallevel == 4) {
          window.localStorage.setItem("level", this.seleRegionallevel);
          window.localStorage.setItem("province_id", this.Provinceid);
          window.localStorage.setItem("city_id", this.cityid);
          window.localStorage.setItem("district_id", this.districtid);
          window.localStorage.setItem("street_id", this.streetid);
        }
        this.$router.push(this.fun.getUrl("goods", { id: this.goods_id }, { nocart: "true" }));
      }
    }
  },
  components: { cTitle }
};
