import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      applyModel: {
        password: "",
        realname: "",
        mobile: "",
        provinceId: "",
        cityId: "",
        districtId: "",
        streetId: "",
        address: "",
        is_filter: ""
      },
      addressShow: false,
      streetShow: false,
      addressName: "",
      area: district,
      province: "",
      city: "",
      street: "",
      strShow: false,
      district: "",
      goods_id: "", // 商品id
      price: "",
      introductionShow: false,
      instroductionSelect: false,

      introduction: {},

      pluginOptions: {
        plugin_name: "旅游激活卡",
        password_name: "激活密码",
        city_name: "出发城市",
        address_name: "出发地址"
      },
      plugin: "picking-card"
    };
  },
  activated() {
    this.init();
    this.getConfig();
  },
  watch: {},
  methods: {
    init() {
      if (this.$route.params && this.$route.params.plugin && this.$route.params.plugin == "one") {
        //#78882，提货卡一期独立的新插件picking-card-one
        this.plugin = "picking-card-one";
        this.pluginOptions = {
          plugin_name: "提货卡",
          password_name: "提货密码",
          city_name: "所在城市",
          address_name: "收货地址"
        };
      }
      this.goods_id = "";
      this.price = "";
      this.addressShow = false;
      this.streetShow = false;
      this.strShow = false;
      this.introductionShow = false;
      this.addressName = "";
      this.province = "";
      this.city = "";
      this.street = "";
      this.district = "";
      this.applyModel = {
        password: "",
        realname: "",
        mobile: "",
        provinceId: "",
        cityId: "",
        districtId: "",
        streetId: "",
        address: "",
        is_filter: ""
      };
      this.fun.setWXTitle(this.pluginOptions.plugin_name);
    },
    onSubmit(values) {
      console.log("submit", values);
    },

    addressCallback(obj) {
      this.addressName = obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.province = obj.itemName1;
      this.city = obj.itemName2;
      this.district = obj.itemName3;

      console.log(obj.itemValue1, obj.itemValue2, obj.itemValue3);

      this.applyModel.provinceId = obj.itemValue1;

      this.applyModel.cityId = obj.itemValue2;

      this.applyModel.districtId = obj.itemValue3;

      this.getStreet(obj.itemValue3);
    },

    streetConfirm(item) {
      this.street = item.areaname;
      this.applyModel.streetId = item.id;
      this.streetShow = false;
    },

    getStreet(param) {
      $http
        .get("member.memberAddress.street", { district_id: param })
        .then(response => {
          if (response.result === 1) {
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
          console.log(error);
        });
    },

    showIntroduction() {
      this.introductionShow = true;
    },

    getConfig() {
      let _api = "plugin.picking-card.frontend.pickingCard.getConfig";
      if (this.plugin == "picking-card-one") _api = "plugin.picking-card-one.frontend.pickingCard.getConfig";
      $http.get(_api, {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.introduction = response.data;
        } else {
          console.log(response.msg);
        }
      });
    },

    getPrice() {
      if (this.applyModel.password.length < 4) {
        return;
      }
      let _api = "plugin.picking-card.frontend.pickingCard.getPrice";
      if (this.plugin == "picking-card-one") _api = "plugin.picking-card-one.frontend.pickingCard.getPrice";
      $http.get(_api, { password: this.applyModel.password }, "...").then(response => {
        if (response.result === 1) {
          this.goods_id = response.data.goods_id;
          this.price = response.data.margin;
        } else {
          this.goods_id = "";
          this.price = "";
          this.$toast(response.msg);
        }
      });
    },

    setApplyData() {
      if (this.fun.isTextEmpty(this.applyModel.password)) {
        Toast("请填写提货密码");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.realname)) {
        Toast("请填写真实姓名");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.mobile)) {
        Toast("请填写手机号码");
        return;
      }

      if (this.fun.isMoblie(this.applyModel.mobile)) {
        Toast("请输入正确的手机号");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.provinceId) || this.fun.isTextEmpty(this.applyModel.cityId) || this.fun.isTextEmpty(this.applyModel.districtId)) {
        Toast("请选择省市区");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.streetId) || this.applyModel.streetId === 0) {
        Toast("请选择街道地址");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.address)) {
        Toast("请填写详细地址");
        return;
      }

      if (this.plugin == "picking-card-one" && !this.applyModel.is_filter) {
        Toast(`请勾选是否使用${this.introduction.commitment}兑换滤芯`);
        return;
      }

      if (this.plugin == "picking-card-one" && !this.instroductionSelect) {
        Toast("请勾选提货说明");
        return;
      }

      if (this.fun.isTextEmpty(this.goods_id)) {
        Toast("提货密码错误");
        return;
      }

      let address = {
        username: this.applyModel.realname,
        mobile: this.applyModel.mobile,
        province: this.province,
        city: this.city,
        district: this.district,
        street: this.street,
        address: this.applyModel.address
      };

      let json = {
        dispatch_type_id: 1,
        address: JSON.stringify(address),
        goods: `[{"goods_id": ${this.goods_id},"total": 1, "option_id": 0}]`,
        price: this.price,
        is_filter: Number(this.applyModel.is_filter) - 1,
        password: this.applyModel.password
      };
      let _api = "plugin.picking-card.frontend.create.index";
      if (this.plugin == "picking-card-one") _api = "plugin.picking-card-one.frontend.create.index";
      $http.post(_api, json, "提交中").then(
        response => {
          if (response.result === 1) {
            this.$router.push(this.fun.getUrl("orderpay", { status: 2, order_ids: response.data.order_ids }));
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    }
  },
  components: {
    cTitle
  }
};
