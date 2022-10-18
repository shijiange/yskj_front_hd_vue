import cTitle from "components/title";
import { Toast } from 'vant';
import yzAddressList from "components/ui_components/yz_addressList/index";

const TAG_ACTION_BUY = "-2"; // 直接购买
var _root_tag = ""; // 0 直接购买 1购物车结算
var _goodsId = "";
var _optionsId = "";
var _total = 1;
var currentAddId = "";
var currentAddress = {};

export default {
  data() {
    return {
      clicktag: 0,
      good_clicktag: 0,
      orderFirst: 0,
      order_data: "",
      integral: window.localStorage.integral,
      goodsInfo: {},
      submit_active: true,
      realname: "", // 收件人
      mobile: "",
      address: "",
      showAddress: false,
      yzAddressListOptions: {}, //地址组件配置信息（可选）
      // 其他抵扣
      checkDeductionList: [],
      selected: 1,

      // 留言
      note: [],
      show_address: true,

      is_open_package_deliver: false, //是否开启自提点（杨朗）
      selfCarrySelected: "",
      selfCarryType: [],
      defaultSelfCarry: "",
      isQuest_ing: true, //是否正在请求数据中
      deliverName: "", //自提点自定义名称

    };
  },

  activated() {
    this.initData();
    // 接收参数
    _root_tag = this.$route.params.tag;

    if (JSON.parse(window.localStorage.getItem("globalParameter")).is_open_package_deliver == "1") {
      this.is_open_package_deliver = true; //开启自提点（杨朗）注意选择自提时需要传自提id
      this.selfCarryType = [
        { name: "快递", dispatch_type_id: "1" },
        { name: "上门自提", dispatch_type_id: "8" }
      ];
      // this.selfCarrySelected = '1';
      let fromChange = this.$route.params.changeSelfCarry
        ? JSON.parse(this.$route.params.changeSelfCarry)
        : null;
      if (fromChange) {
        //从更换自提点列表页面选择后返回
        this.defaultSelfCarry = fromChange;
        this.selfCarrySelected = 8;
      } else {
        //第一次进入
        this.getLocation();
      }
    }

    console.log("_root_tag", _root_tag);
    if (this.fun.isTextEmpty(_root_tag)) {
      // 为空跳回
      this.$router.push(this.fun.getUrl("home", {}));
    }

    if (_root_tag == TAG_ACTION_BUY) {
      _goodsId = this.$route.params.goodsId;
      _optionsId = this.$route.params.optionsId;
      _total = this.$route.params.total;
      this.getDataActionBuy(); // 直接购买
    }
  },

  methods: {
    //初始化数据 distributionUserName
    initData() {
      this.clicktag = 0;
      this.good_clicktag = 0;
      if (this.$route.params.is_selected != "8") {
        this.orderFirst = 0;
      }
      this.order_data = [];
      this.goodsInfo = {};
      this.submit_active = true;
      //地址清空
      this.realname = "";
      this.mobile = "";
      this.address = "";
      this.showAddress = false;
      this.yzAddressListOptions = {};
      // 抵扣
      this.checkDeductionList = [];
      this.selected = this.$route.params.is_selected;

      this.note = [];
      this.show_address = true;

      currentAddId = "";
      currentAddress = {};

      //是否保存过自提点提货人和手机号信息，有的话自动填写【任务编号: 35632】
      let _ztdInfo = JSON.parse(window.localStorage.getItem("selfCarryInfo")) || {};
      this.distributionUserName = this.$route.params.distributionUserName
        ? this.$route.params.distributionUserName
        : (!this.fun.isTextEmpty(_ztdInfo.distributionUserName) ? _ztdInfo.distributionUserName : "");
      this.distributionUserMobile = this.$route.params.distributionUserMobile
        ? this.$route.params.distributionUserMobile
        : (!this.fun.isTextEmpty(_ztdInfo.distributionUserMobile) ? _ztdInfo.distributionUserMobile : "");

      this.is_open_package_deliver = false;
      this.selfCarrySelected = "";
      this.selfCarryType = [];
      this.defaultSelfCarry = "";
      this.isQuest_ing = true;
      this.deliverName = "";
    },

    // 直接购买
    getDataActionBuy() {
      let that = this;
      let json = {
        goods_id: _goodsId,
        total: _total,
        option_id: _optionsId,
        member_coupon_ids: [],
        orders: JSON.stringify(this.assembleDeduction()),
        address: encodeURIComponent(JSON.stringify(currentAddress)),
        dispatch_type_id: this.selected,//that.$route.params.is_selected == '8'?'8':'1'
        mark: this.$route.params.mark ? this.$route.params.mark : 0
      };

      //自提点开启
      if (this.is_open_package_deliver && this.selfCarrySelected == "8") {
        json.package_deliver_id = this.defaultSelfCarry.id;
        json.dispatch_type_id = this.selfCarrySelected;
      }

      if (this.good_clicktag === 0) {
        this.good_clicktag = 1;
        $http.get("plugin.cloud-warehouse.frontend.goods-buy.index", json, "生成中").then(
          function (response) {
            if (response.result === 1) {
              that.goodsInfo = response.data;
              let fromChange = that.$route.params.changeSelfCarry
                ? JSON.parse(that.$route.params.changeSelfCarry)
                : null;
              if (that.selected == 8 && !fromChange) {
                that.getLocation();
              }
              that.cup_notice = true;
              that.setViewData(response.data); // 设置界面
              that.setAddressViewData(
                response.data.dispatch.default_member_address
              ); // 设置地址界面
              that.setCarryType(response.data);//设置自提点信息
              if (that.$route.params.orderType == "groupBuy_open" || that.$route.params.orderType == "groupBuy_join") {
                //拼购支付协议
                that.isGetAgreementPay = true;
                that.AgreementPay = that.goodsInfo.together_purchase_agreement;
              }
            } else {
              Toast(response.msg);
              that.$router.go(-1);
              that.cup_notice = true;
            }
            setTimeout(function () {
              that.good_clicktag = 0;
            }, 1000);
          },
          function (response) {
            console.log(response);
          }
        );
      }
    },

    // 设置界面
    setViewData(data) {
      // console.log(data, '参数data')
      this.order_data = data.orders;
      this.show_address = this.isOrderAddress_M(data.orders);
    },

    isOrderAddress_M(_data) {
      //判断是否有订单需要填写地址，有一单需要填写地址则需要填写地址才可以下单
      //return false 提交订单需要填写地址
      for (let j = 0; j < _data.length; j++) {
        if (!_data[j].need_address) {
          console.log("有订单需要填写地址");
          return false;
        }
      }
      return true;
    },

    // 设置地址界面
    setAddressViewData(model) {
      if (model == undefined || model == "" || model == []) {
        return;
      }

      // 设置地址id
      currentAddId = model.id;
      currentAddress = model;

      this.realname = this.fun.isTextEmpty(model.username)
        ? "" : model.username;
      this.mobile = this.fun.isTextEmpty(model.mobile) ? "" : model.mobile;
      this.address = this.fun.isTextEmpty(model.province)
        ? "" : model.province +
        " " + model.city + " " + model.district + " " +
        (this.fun.isTextEmpty(model.street) ? "" : model.street + " ") +
        model.address;
    },

    // 选择地址后重新计算数据
    requestByAddress(key) {
      // 重新计算
      if (_root_tag == TAG_ACTION_BUY) {
        this.order_data = "";
        this.selected = key;
        this.getDataActionBuy(); // 直接购买
      }
    },
    setCarryType(data) {
      let that = this;
      //开启自提点，设置信息
      // if (that.is_open_package_deliver) {
      //   that.selfCarryType = data.dispatch.delivery_method;
      // }
      // if (that.selfCarryType.length > 0) {
      //   for (let i = 0; i < that.selfCarryType.length; i++) {
      //     that.selfCarryType[i].dispatch_type_id = that.selfCarryType[
      //       i
      //     ].dispatch_type_id.toString();
      //   }
      if (that.orderFirst == 0) {
        that.selfCarrySelected =
          that.selfCarryType[0].dispatch_type_id;
        that.orderFirst = 1;
      } else {
        that.selfCarrySelected =
          that.selfCarryType[1].dispatch_type_id;
        that.orderFirst = 0;
      }
      // }
    },

    //显示地址pop
    showAddressFun() {
      // 获取收货地址
      this.yzAddressListOptions = {
        is_open_store_delivery: this.is_open_store_delivery,
        selected: this.selected
      };
      this.showAddress = true;
    },

    confirmSelectAddress(item) {
      this.setAddressViewData(item);
      this.requestByAddress(); // 选择地址后重新计算
      this.showAddress = false;
    },

    // 普通商品提交订单
    submit() {
      if (!this.goodsInfo.orders) {
        return;
      }
      console.log("state===res", this.submit_active);
      if (this.submit_active == true) {
        this.submit_active = false;

        if (this.isShowDistributionStation || this.is_open_package_deliver) {
          if (this.selfCarrySelected == "8") {
            if (this.is_open_package_deliver && !this.defaultSelfCarry.id) {
              Toast("请选择自提点");
              this.submit_active = true;
              return;
            }
            if (this.fun.isTextEmpty(this.distributionUserName)) {
              Toast("请填写提货人姓名");
              this.submit_active = true;
              return;
            }
            if (this.fun.isTextEmpty(this.distributionUserMobile)) {
              Toast("请输入提货人手机");
              this.submit_active = true;
              return;
            }
            this.save_ztd_LocalStorage(this.distributionUserName, this.distributionUserMobile);
          } else if (this.selfCarrySelected == "1") {
            if (!this.show_address) {
              if (this.fun.isTextEmpty(currentAddId)) {
                Toast("请选择收货地址");
                this.submit_active = true;
                return;
              }
            }
          }
        } else {
          if (!this.show_address && this.POChooseType != "0") {
            if (this.fun.isTextEmpty(currentAddId)) {
              Toast("请选择收货地址");
              this.submit_active = true;
              return;
            }
          }
        }
        let that = this;
        let json = this.assembleJson();
        if (this.clicktag === 0) {
          this.clicktag = 1;

          $http
            .post("plugin.cloud-warehouse.frontend.create.index", json, "提交中")
            .then(
              function(response) {
                if (response.result === 1) {
                  that.$router.go(-2);
                  Toast("下单成功");
                } else {
                  Toast(response.msg);
                }
                that.submit_active = true;
                setTimeout(function() {
                  that.clicktag = 0;
                }, 1000);
              },
              function(response) {
                that.submit_active = true;
                console.log(response);
              }
            )
            .catch(err => {
              that.submit_active = true;
              console.log(err);
            });
        }
      }
    },
    // 组装json数据
    assembleJson() {
      let json = {
        //公共数据
        address: encodeURIComponent(JSON.stringify(currentAddress)),
        goods: JSON.stringify(this.assembleGoods()),
        member_coupon_ids: JSON.stringify([]),
        orders: JSON.stringify(this.assembleDeduction()),
        // 发票
        invoice_type: 0,
        rise_type: 1,
        call: '',
        email: '',
        company_number: ''
      };

      if (_root_tag == TAG_ACTION_BUY) {
        json.dispatch_type_id = 1;
      }

      if (this.is_open_package_deliver && this.selfCarrySelected == "8") {
        json.dispatch_type_id = 8;
        json.package_deliver_id = this.defaultSelfCarry.id;
        json.realname = this.distributionUserName;
        json.mobile = this.distributionUserMobile;
        delete json.address;
      }

      if (this.$store.state.liveRoomID) {
        json.room_id = this.$store.state.liveRoomID;
      }
      return json;
    },

    // 组装商品信息
    assembleGoods() {
      let newGoods = [];
      if (this.goodsInfo.orders) {
        for (let j = 0; j < this.goodsInfo.orders.length; j++) {
          for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
            let model = {};
            model.goods_id = this.goodsInfo.orders[j].order_goods[i].goods_id;
            model.total = this.goodsInfo.orders[j].order_goods[i].total;
            model.option_id = this.goodsInfo.orders[j].order_goods[
              i
            ].goods_option_id;
            newGoods.push(model);
          }
        }
      }
      return newGoods;
    },

    // 组装优惠抵扣信息
    assembleDeduction() {
      let deductions = [];

      for (let i = 0; i < this.checkDeductionList.length; i++) {
        deductions.push(this.checkDeductionList[i]);
      }
      return deductions;
    },

    // 留言触发抵扣事件
    noteHandle(event, item) {
      if (!item.order_deductions[0]) {
        // 没有抵扣数据时
        let isHasNote = false;
        if (this.checkDeductionList.length > 0) {
          this.checkDeductionList.map((deduction, index)=>{
            if(deduction.pre_id == item.pre_id) {
              isHasNote = true;
              deduction.note = this.note[item.pre_id];
            }
          });
        }
        if (!isHasNote) {
          this.checkDeductionList.push({
            deduction_ids: [],
            pre_id: item.pre_id,
            note: this.note[item.pre_id]
          });
        }
        this.checkDeductionList.reverse(); // 更新数组
      } else {
        this.screenDiscount(item, item.order_deductions[0]);
      }

      // console.log("this.checkDeductionList::::", this.checkDeductionList);
    },
    // 筛选抵扣
    screenDiscount(item, value) {
      // console.log("value::::", value);
      if (this.checkDeductionList.length > 0) {
        this.checkDeductionList.map((deduction, index)=>{
          if(deduction.pre_id == item.pre_id) {
            if (value.checked) {
              // 选中的时候检查是否有对应的code
              if(deduction.deduction_ids && deduction.deduction_ids.indexOf(value.code) == -1) {
                deduction.deduction_ids.push(value.code);
              }
            }else {
              // 取消选中的时候检查去掉对应的code
              if(deduction.deduction_ids && deduction.deduction_ids.indexOf(value.code) > -1) {
                deduction.deduction_ids.splice(deduction.deduction_ids.indexOf(value.code), 1);
              }
            }

            // 留言和安装选项重新赋值
            deduction.note = this.note[item.pre_id];
            deduction.service_fee = this.service_fee[item.pre_id];
          }
        });
        this.checkDeductionList.reverse(); // 更新数组
      } else {
        this.checkDeductionList.push({
          deduction_ids: [value.code],
          pre_id: item.pre_id,
          note: this.note[item.pre_id],
          service_fee: this.service_fee[item.pre_id]
        });
      }

      // console.log('checkList:', this.checkDeductionList)
    },

    //更换自提点 （杨朗）
    replaceZT() {
      this.save_ztd_LocalStorage(this.distributionUserName, this.distributionUserMobile);
      this.$router.push(
        this.fun.getUrl("SelfCarry_info", {
          tag: this.$route.params.tag,
          goodsId: this.$route.params.goodsId,
          optionsId: this.$route.params.optionsId,
          total: this.$route.params.total,
          is_selected: this.selected,
          iscloud: 'cloud'
        })
      );
    },


    getLocation() {
      var that = this;
      var myLocation = this.$store.state.o2oLocation;

      if (!myLocation.point) {
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
          that.city = !that.fun.isTextEmpty(obj.addressComponent.city)
            ? obj.addressComponent.city
            : obj.addressComponent.province;

          var pos = {
            address: obj.formattedAddress,
            city: that.city,
            title: obj.formattedAddress,
            point: that.point
          };
          console.log("test pos", pos);
          if (that.is_open_package_deliver) {
            that.getList(pos);
          }
          that.$store.commit("updateLocation", pos);
          that.$store.commit("setLocation", pos);
        }

        function onError(obj) {
          Toast("定位失败,请手动切换位置");
          that.isQuest_ing = false;
        }
      } else {
        if (that.is_open_package_deliver) {
          that.getList(myLocation);
        }
      }
    },
    //获取自提点列表（杨朗）
    getList(_data) {
      let that = this;
      let p = this.fun.bd_encrypt(_data.point.lng, _data.point.lat);
      let json = {
        city_name: _data.city,
        lat: p.lat,
        lng: p.lng,
        kwd: "",
        goods: JSON.stringify(this.assembleGoods())
      };
      this.isQuest_ing = true;
      $http.get("plugin.package-deliver.frontend.deliver.getList", json).then(
        function (response) {
          that.isQuest_ing = false;
          if (response.result === 1) {
            that.deliverName = response.data.name;
            that.defaultSelfCarry = response.data.list.data[0]
              ? response.data.list.data[0]
              : ""; //取第一个为默认自提点。。。
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          that.isQuest_ing = false;
          console.log(response);
        }
      );
    },
    //下单页优化提货人姓名和电话自动填上上次填写的信息【任务编号: 35632】
    save_ztd_LocalStorage(_name, _mobile) {
      let _memberInfoes = {
        distributionUserName: _name,
        distributionUserMobile: _mobile
      };
      localStorage.setItem('selfCarryInfo', JSON.stringify(_memberInfoes));
    }
  },
  components: {
    cTitle, yzAddressList
  },
};
