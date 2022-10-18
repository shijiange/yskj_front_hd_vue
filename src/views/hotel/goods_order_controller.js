import { Toast } from "vant";
import cDyPopup from "../goods/diyFormPopup";
import diyfrom from "components/diyform";

const SUBMIT_URL = "plugin.hotel.frontend.hotel.create";

export default {
  data() {
    return {
      start: "",
      end: "",
      total: 1,
      order_info: {},

      start_time: "",
      end_time: "",
      night_day: "",

      name: "",
      mobil: "",

      isInvoice: false,
      invoice_type: "1",

      el_invoice: "1",
      fp_tt: "",
      company_name: "",
      sbxd: "",
      // bz: "",
      title: "",
      // 优惠券
      popupCouponSpecs: false,
      coupon_size: 0,
      checkCouponList: [],
      use_coupon_size: 0,
      // 优惠券标识
      cup_notice: true,
      isShowCoupon: true, //是否显示优惠券

      good_clicktag: 0,
      checkDeductionList: [],

      // 自定义表单
      hasGoodOpenDF: false,
      dyFormPopup: false,
      dfData: {},
      goodDYDormID: null,
      activeDYGoodID: null,
      activeFormDataID: null,
      dyDescription: null,
      dyTiitle: "",
      dyThumb: null, //表单图片
      oldOrder_data: [], //用于保存保存商品自定义表单后的数据
    };
  },

  activated() {
    this.initData();

    if (this.fun.isTextEmpty(this.$route.query.id)) {
      this.$router.push(this.fun.getUrl("home", {}));
    }

    this.end = this.$route.query.end || "";
    this.start = this.$route.query.start || "";

    if (!this.fun.isTextEmpty(this.$route.params.exchangeData)) {
      this.getExchangeData();
    } else {
      this.getOrerData();
    }

    this.getCustomizeHotelHead();
  },

  methods: {
    // 循环订单判断是否开启话费慢充和自定义表单
    findGoodOpen() {
      for (let j = 0; j < this.order_info.orders.length; j++) {
        for (let i = 0; i < this.order_info.orders[j].order_goods.length; i++) {
          if (this.order_info.orders[j].order_goods[i].diy_form) {
            this.goodDYDormID = this.order_info.orders[j].order_goods[i].diy_form.form_id;
            console.log("有商品开启自定义表单！！！");
            this.hasGoodOpenDF = true;
          }
        }
      }
    },
    isAllDFOk() {
      //判断是否有商品开启自定义表单但是没有提交的，没提交过的diyform_data_id为0
      let that = this;
      if (this.order_info.orders) {
        for (let j = 0; j < this.order_info.orders.length; j++) {
          for (let i = 0; i < that.order_info.orders[j].order_goods.length; i++) {
            if (that.order_info.orders[j].order_goods[i].diy_form && that.order_info.orders[j].order_goods[i].diy_form.diyform_data_id == 0) {
              console.log("有未填写的表单！！！");
              return true;
            }
          }
        }
      }
    },
    diyFormSave(_dyData) {
      console.log("diyFormPopup组件它点击提交了,这是它的数据", _dyData);
      let that = this;
      for (let j = 0; j < this.order_info.orders.length; j++) {
        for (let i = 0; i < that.order_info.orders[j].order_goods.length; i++) {
          if (that.order_info.orders[j].order_goods[i].goods_id == that.activeDYGoodID) {
            that.order_info.orders[j].order_goods[i].diy_form.diyform_data_id = _dyData;
            that.activeFormDataID = _dyData;
            console.log("设置that.order_info", that.order_info, that.activeFormDataID);
            that.oldOrder_data = that.order_info;
            that.dyFormPopup = false;
            return;
          }
        }
      }
    },
    getGoodDFData() {
      this.activeDYGoodID = this.$route.query.goods_id;
      let that = this;
      let _json = {
        form_id: this.goodDYDormID
      };
      if (this.activeFormDataID) {
        _json.form_data_id = this.activeFormDataID;
      }
      $http.get("plugin.diyform.api.diy-form.getSingleFormData", _json).then(
        (response)=> {
          if (response.result === 1) {
            that.dfData = response.data;
            that.dyThumb = response.data.thumb ? response.data.thumb : null;
            that.dyDescription = response.data.description ? response.data.description : null;
            that.dyTiitle = response.data.title ? response.data.title : "表单信息";
            that.dyFormPopup = true;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        (response)=> {
          console.log(response);
        }
      );
    },
    assembleGoodsDFData() {
      //组装商品自定义表单信息
      let newGoodsDF = [];
      for (let j = 0; j < this.order_info.orders.length; j++) {
        for (let i = 0; i < this.order_info.orders[j].order_goods.length; i++) {
          if (this.order_info.orders[j].order_goods[i].diy_form) {
            let modelDF = {};
            modelDF.pre_id = this.order_info.orders[j].order_goods[i].pre_id;
            modelDF.diyform_data_id = this.order_info.orders[j].order_goods[i].diy_form.diyform_data_id;
            newGoodsDF.push(modelDF);
          }
        }
      }
      return newGoodsDF;
    },
    assembleCoupons() {
      let coupons = [];
      for (let i = 0; i < this.checkCouponList.length; i++) {
        coupons.push(this.checkCouponList[i].id);
      }
      return coupons;
    },
    // 初始化优惠券
    initCoupon(coupon) {
      this.isShowCoupon = coupon.whether_show_coupon == "1" ? true : false;
      this.coupon_size = coupon.member_coupons.length;
      this.coupons = coupon.member_coupons;
    },

    //初始化带有默认选中优惠券
    defaultSelectCoupon(coupon) {
      this.coupon_size = coupon.length;
      this.coupons = coupon;
      this.checkCouponList = [];
      coupon.forEach((item, ind) => {
        if (item.checked == true) {
          this.checkCouponList.push(item);
        }
      });
      this.use_coupon_size = this.checkCouponList.length;
    },
    // 选择优惠券
    selectCoupon(value, valObj) {
      // 处理选择
      this.screenCoupon(value, valObj);
      // 设置已经使用多少优惠券
      this.use_coupon_size = this.checkCouponList.length;
      // 重新计算
      this.getOrerData();
    },
    // 筛选数据优惠券状态
    screenCoupon(value, valObj) {
      var tarValue = valObj;
      if (value) {
        // 选中添加
        this.cup_notice = false;
        if (this.checkCouponList.length > 0) {
          for (let i = 0; i < this.checkCouponList.length; i++) {
            if (this.checkCouponList[i].id == tarValue.id) {
              this.checkCouponList.splice(i, 1);
            }
          }
          this.checkCouponList.push(tarValue);
        } else {
          this.checkCouponList.push(tarValue);
        }
      } else {
        // 取消选中
        this.cup_notice = true;
        if (this.checkCouponList.length > 0) {
          for (let i = 0; i < this.checkCouponList.length; i++) {
            if (this.checkCouponList[i].id == tarValue.id) {
              this.checkCouponList.splice(i, 1);
            }
          }
        }
      }
    },
    chooseCoupon(index) {
      this.coupons[index].checked = true;
    },
    // 优惠券
    showCoupon() {
      if (this.coupon_size == 0) {
        Toast("暂无优惠券使用");
        return;
      }
      this.popupCouponSpecs = true;
    },
    //获取酒店自定义字段
    getCustomizeHotelHead() {
      var isQuestHotel = localStorage.getItem("customizeHotelHead");
      if (!this.fun.isTextEmpty(isQuestHotel)) {
        this.fun.setWXTitle(JSON.parse(localStorage.getItem("customizeHotelHead")).hotels);
      } else {
        $http
          .get("plugin.hotel.frontend.hotel.get-hotel-info.get-custom-name", {}, "加载中...")
          .then(response => {
            if (response.result === 1) {
              this.fun.setWXTitle(response.data.hotels);
              localStorage.setItem("customizeHotelHead", JSON.stringify(response.data));
            } else {
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getOrerData() {
      if (this.good_clicktag == 1) {
        return;
      }
      this.good_clicktag = 1;
      let ORDER_URL = "plugin.hotel.frontend.hotel.goods-buy";
      let json = {
        enter_at: this.start,
        leave_at: this.end,
        hotel_id: this.$route.query.id,
        goods_id: this.$route.query.goods_id,
        goods_option_id: "",
        total: this.total,
        dispatch_type_id: 4,
        orders: JSON.stringify(this.assembleDeduction()),
        member_coupon_ids: this.assembleCoupons()
      };
      $http
        .post(ORDER_URL, json, "加载中")
        .then(res => {
          if (res.result === 1) {
            this.order_info = res.data;
            this.title = res.data.orders[0].order_goods[0].title;
            this.findGoodOpen(); // 循环订单列表是否开启表单
            this.getTime(res.data.orders[0].hotel_order);
            this.initCoupon(res.data.discount); // 设置优惠券信息
            this.cup_notice = true;
            this.good_clicktag = 0;
          } else {
            this.cup_notice = true;
            Toast(res.msg);
            this.good_clicktag = 0;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getExchangeData() {
      this.total = this.$route.query.total;
      let ORDER_URL = "plugin.hotel.frontend.hotel.exchange-center";
      let json = {
        enter_at: this.start,
        leave_at: this.end,
        hotel_id: this.$route.query.id,
        goods_id: this.$route.query.goodsId,
        goods_option_id: "",
        total: this.total,
        dispatch_type_id: 4,
        member_coupon_ids: this.assembleCoupons(),
        data: this.$route.params.exchangeData
      };

      $http
        .post(ORDER_URL, json, "加载中")
        .then(res => {
          if (res.result === 1) {
            this.order_info = res.data;
            this.title = res.data.orders[0].order_goods[0].title;
            this.findGoodOpen(); // 循环订单列表是否开启表单
            this.getTime(res.data.orders[0].hotel_order);
            this.defaultSelectCoupon(res.data.discount.member_coupons); // 设置优惠券信息
            this.cup_notice = true;
          } else {
            this.cup_notice = true;
            Toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getTime(obj) {
      let start = obj.enter_at.split(" ");
      let end = obj.leave_at.split(" ");
      let s = start[0].split("-");
      let e = end[0].split("-");

      this.start_time = `${s[1]}月${s[2]}日`;
      this.end_time = `${e[1]}月${e[2]}日`;
      this.getDays(start[0], end[0]);
    },

    getDays(strDateStart, strDateEnd) {
      let strSeparator = "-"; //日期分隔符
      let oDate1, oDate2, iDays;
      oDate1 = strDateStart.split(strSeparator);
      oDate2 = strDateEnd.split(strSeparator);
      let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
      let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
      iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      console.log(iDays);
      this.night_day = iDays;
    },

    addTotal() {
      if (this.total < 1) {
        this.total = 1;
      }
      this.getOrerData();
    },

    invoiceChange(value) {
      this.isInvoice = value;
    },

    eInvoiceChange(value) {
      this.el_invoice = value;
    },

    typeChange(value) {
      this.invoice_type = value;
    },

    submit() {
      if (this.fun.isTextEmpty(this.name)) {
        Toast("请填写入住人");
        return;
      }

      if (this.fun.isTextEmpty(this.mobil)) {
        Toast("请填写电话号码");
        return;
      }

      if (this.isInvoice) {
        if (this.invoice_type == "1") {
          if (this.fun.isTextEmpty(this.fp_tt)) {
            Toast("请输入发票抬头");
            return;
          }
        }

        if (this.invoice_type == "2") {
          if (this.fun.isTextEmpty(this.company_name)) {
            Toast("请填写单位名称");
            return;
          }

          if (this.fun.isTextEmpty(this.sbxd)) {
            Toast("请填写纳税人识别向导");
            return;
          }
        }
      }

      if (this.isAllDFOk()) {
        Toast("请填写表单！");
        return;
      }


      let json = {
        enter_at: this.start,
        leave_at: this.end,
        hotel_id: this.$route.query.id,
        dispatch_type_id: 4,
        member_coupon_ids: JSON.stringify(this.assembleCoupons()),
        goods: JSON.stringify([
          {
            goods_id: this.$route.query.goods_id,
            goods_option_id: "",
            total: this.total
          }
        ]),
        address: JSON.stringify({}),
        orders: JSON.stringify(this.assembleDeduction()),
        mobile: this.mobil,
        realname: this.name,
        invoice_type: this.el_invoice == 1?'0':'1',
        rise_type: this.invoice_type  == 1?'1':'0',
        call: this.invoice_type == "1" ? this.fp_tt : this.company_name,
        company_number: this.sbxd
      };
      if (this.$route.params.exchangeData) {
        json.hotel_id = this.$route.query.hotel_id;
      }
      if (this.hasGoodOpenDF) {
        //有商品开启自定义表单
        json.order_goods = JSON.stringify(this.assembleGoodsDFData());
      }
      $http
        .get(SUBMIT_URL, json, "提交中...")
        .then(res => {
          if (res.result == 1) {
            console.log(res);
            this.$router.push(
              this.fun.getUrl("orderpay", {
                status: "2",
                order_ids: res.data.order_ids
              })
            );
          } else {
            this.$dialog.alert({ message: res.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    initData() {
      this.start = "";
      this.end = "";
      this.total = 1;
      this.order_info = {};

      this.start_time = "";
      this.end_time = "";
      this.night_day = "";

      this.name = "";
      this.mobil = "";

      this.isInvoice = false;
      this.invoice_type = "1";

      this.el_invoice = "1";

      this.fp_tt = "";

      this.company_name = "";
      this.sbxd = "";
      // this.bz = "";

      this.title = "";

      // 优惠券
      this.popupCouponSpecs = false;
      this.coupon_size = 0;
      this.use_coupon_size = 0;
      this.checkCouponList = [];
      this.coupons = [];
      this.isShowCoupon = true;

      this.good_clicktag = 0;
      this.checkDeductionList = [];
    },
    // 抵扣选择响应,运费选择
    discountHandle(item, value, tag) {
      if (this.good_clicktag === 0) {
        if (tag == "discount") {
          this.screenDiscount(item, value);
        }
        this.getOrerData();
      }
    },
    // 筛选抵扣
    screenDiscount(item, value) {
      this.deductionListHandle(item, value);
    },
    // 处理checkDeductionList响应
    deductionListHandle(item, value) {
      let isHasPreId = false;
      if (this.checkDeductionList.length > 0) {
        this.checkDeductionList.forEach((deduction, index) => {
          if (deduction && deduction.pre_id == item.pre_id) {
            isHasPreId = true;
            if (value && value.checked) {
              // 选中的时候检查是否有对应的code
              if(deduction.deduction_ids && deduction.deduction_ids.indexOf(value.code) == -1) {
                deduction.deduction_ids.push(value.code);
              }
            }else if (value && !value.checked) {
              // 取消选中的时候检查去掉对应的code
              if(deduction.deduction_ids && deduction.deduction_ids.indexOf(value.code) > -1) {
                deduction.deduction_ids.splice(deduction.deduction_ids.indexOf(value.code), 1);
              }
            }

            // 留言重新赋值
            // deduction.note = bz;
          }
        });
      }
      if (!isHasPreId) {
        this.checkDeductionList.push({
          deduction_ids: value && value.code ? [value.code] : [],
          pre_id: item.pre_id,
          // note: bz,
        });
      }
      this.checkDeductionList.reverse(); // 更新数组
      // console.log('checkDeductionList:', this.checkDeductionList)
    },
    // 组装优惠抵扣信息
    assembleDeduction() {
      let deductions = [];
      for (let i = 0; i < this.checkDeductionList.length; i++) {
        deductions.push(this.checkDeductionList[i]);
      }
      return deductions;
    }
  },
  components: {
    cDyPopup,
    diyfrom
  }
};
