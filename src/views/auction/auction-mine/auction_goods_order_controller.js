import cTitle from "components/title";
import { Toast } from 'vant';
// import cDyPopup from '../../goods/diyFormPopup';
import diyfrom from "components/diyform";
import yzAddressList from "components/ui_components/yz_addressList/index";

const TAG_ACTION_BUY = "-2"; // 直接购买
const TAG_ACTION_CART = "-1"; // 1购物车结算
var _root_tag = ""; // 0 直接购买 1购物车结算
var _goodsId = "";
var _optionsId = "";
var _total = 1;
var currentAddId = "";
var currentAddress = {};
var _cart_ids = [];
var _packagJson = {};

var clicktag = 0;

export default {
  data() {
    return {
      popCode:'',
      orderFirst: 0,
      show1: false,
      order_data: "",
      integral: window.localStorage.integral,
      onclast: false,
      goodsInfo: {},
      order: {},
      realname: "", // 收件人
      mobile: "",
      address: "",
      showAddress: false,
      yzAddressListOptions: {}, //地址组件配置信息（可选）
      goods: [],
      goods_price: 0,
      dispatch_price: 0,
      price: 0,
      discount_price: 0,
      popupSpecs: false,
      addressData: [],

      // 优惠券
      popupCouponSpecs: false,
      coupon_size: 0,
      checkCouponList: [],
      use_coupon_size: 0,

      // 积分抵扣 其他抵扣
      checkDeductionList: [],

      // 新增地址v2------------------------------------------------新增地址v2//
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
      district: district, // 地址本地数据
      popAddAddress: false,
      addressShow: false,
      addressName: "", // 地址区域
      strShow: false, // 街道显示
      streetShow: false, // 街道pop
      // 新增地址v2------------------------------------------------新增地址v2//

      // 跨境
      isTaxGoods: false,
      member_name: "",
      member_card: "",
      popupMemberSpecs: false,
      explain_title: "",
      explain_content: "",

      // O2O部分
      storeCarts: [],
      store_id: 0,
      selected: 0,
      store_info: {},
      linkinfo: {
        mobile: "",
        name: ""
      },
      dispatch: [],

      // 个人信息和修改
      myRealname: "",
      myIdcard: "",
      showMyinfo: false,

      // 租赁商品标识
      isRent: false,

      // 权益商品选择列表
      checkList: [],

      // 是否选择权益商品
      isRightChoose: false,

      // 是否开启会员权益开关
      isOpenRight: false,

      currentIndex: "999",

      // 同意租赁协议
      agreement: false,

      // 是否显示支付协议
      AgreementPay: "",
      // 同意支付协议
      agreementPay: false,
      // 支付协议
      agreementPayShow: false,

      // 免押件数
      rent_deposit_free: 0,

      // 免租件数

      rent_free: 0,

      // 优惠券标识

      cup_notice: true,
      submit_active: true,
      isResize: false,

      defaultAddress: {},
      create: true,

      // 留言
      note: [],

      // 发票
      isShowInvoice: true,
      // showInvoiceTitle: '',
      // invoicename: '',
      // companyname: '',
      invoice_status: true,
      papery_status: "",
      electron_status: "",
      person_status: true,
      unit_status: false,
      iscur: true,
      iscur_b: false,
      iscur_c: true,
      iscur_d: false,
      // invoiceType: "",
      invoice_list: {
        call: "",
        company_number: ""
      },
      show_address: true,
      recipient_name: "",
      recipient_mobile: "",

      // 续费商品
      goods_id: "",
      // 添加的name
      priceInfo: {},
      dispatchInfo: {},
      deductionInfo: {},
      total_items: [],
      discount_amount_items: [],
      popupDistribution: false, //配送站弹窗是否显示

      //判断是否已经请求了支付协议接口
      isGetAgreementPay: false,

      //服务费
      service: {},

      isShowDistributionStation: false, //是否显示配送站模块
      DistributionSelect: "6",
      DistributionInfo: [], //配送站列表
      DistributionModel: {
        delivery_name: "",
        has_one_member: {
          mobile: ""
        },
        full_address: "",
        address: "",
        method_name: [
          { name: "送货上门", code: "6" },
          { name: "到店自提", code: "5" }
        ]
      }, //配送站弹窗选中
      distributionUserName: "",
      distributionUserMobile: "",

      isReplensishment: false, //是否为配送站的补货订单

      isOpenTeam: false, //是否为一键开团
      isJoinTeam: false, //是否为去参团

      pdOrderType: [{ name: "自用", code: "1" }], //pending_order_type使用类型：0：零售 1：自用
      POChooseType: "1",

      isPhoto: false, //开启相册商品，true为相册商品
      fileList1: [], //相册路径链接
      fileList2: [],
      show: false, //图片预览组件为true显示
      imgIndex: 1, //相册图片预览起始位置
      checkedImg: true, //true为开启微信相册
      max_count: 9, //最大上传张数
      min_count: 1, //最小上传张数
      photosize: 1024 * 1024 * 30,
      storeNo_photo: false,

      is_open_package_deliver: false, //是否开启自提点（杨朗）
      selfCarrySelected: "",
      selfCarryType: [],
      defaultSelfCarry: "",
      isQuest_ing: true, //是否正在请求数据中
      isShowDiyForm: false, //是否开启自定义表单
      diyform_id: 0,
      form_data_id: "", //提交自定义表单后返回的表单id，
      diyTitle: "", //自定义表单名称
      deliverName:'',//自提点自定义名称

      dyFormPopup: false,
      dfData:{},
      goodDYDormID: null,
      activeDYGoodID:null,
      activeFormDataID: null,
      dyDescription: null,
      dyTiitle: '',
      dyThumb:null//表单图片
    };
  },

  activated() {
    this.initData();
    // 接收参数
    _root_tag = this.$route.params.tag;

    this.isReplensishment =
      this.$route.params.isReplensishment == "1" ? true : false; //配送站的补货订单

    if (
      JSON.parse(window.localStorage.getItem("globalParameter"))
        .is_open_photo_order == "1" &&
      _root_tag == TAG_ACTION_BUY
    ) {
      //需求：商城商品、供应商商品立即购买和门店商品下单才能使用相册上传模块，且一个下单的商品id（新需求去掉购物车，不能使用相册）
      console.log("开启相册上传模块");
      this.isPhoto = true; //开启相册上传模块
      this.setPhotoNum();
    }

    //获取配送站开关
    if (this.isReplensishment || this.isOpenTeam || this.isJoinTeam || this.is_open_package_deliver) {
      this.isShowDistributionStation = false; //配送站的补货订单时，配送站模块关闭
    } else if (JSON.parse(window.localStorage.getItem("globalParameter")).is_open_package_deliver == "1"&&this.$route.params.tag != "store") {
      this.is_open_package_deliver = true; //开启自提点（杨朗）注意选择自提时需要传自提id
      this.selfCarryType = [
        { name: "快递", id: "1" },
        { name: "上门自提", id: "8" }
      ];
      // this.selfCarrySelected = '1';
      let fromChange = this.$route.params.changeSelfCarry
        ? JSON.parse(this.$route.params.changeSelfCarry)
        : null;
      if (fromChange) {
        //从更换自提点列表页面选择后返回
        this.defaultSelfCarry = fromChange;
      } else {
        //第一次进入
        // this.getLocation();
      }

      // 默认导航两种选择方式：快递||上门自提（PS:和到店自提又不一样，害~）
      //请求自提点列表
    } else if (this.$route.params.tag != "fromExchange" && this.$route.params.tag != "store" && JSON.parse(window.localStorage.getItem("globalParameter")).is_open_delivery_station == "1" && JSON.parse(window.localStorage.getItem("globalParameter")).is_open_package_deliver == "0") {
      this.isShowDistributionStation = true; //开启配送站
    } else {
      this.isShowDistributionStation = false;
    }

    console.log("_root_tag", _root_tag);
    if (this.fun.isTextEmpty(_root_tag)) {
      // 为空跳回
      this.$router.push(this.fun.getUrl("home", {}));
    }

    if (_root_tag == TAG_ACTION_BUY ||  _root_tag == "appointment_goods" ||  _root_tag == "yun_sign_goods"||  _root_tag == "auction") {
      _goodsId = this.$route.params.goodsId;
      _optionsId = this.$route.params.optionsId;
      _total = this.$route.params.total;
      this.getDataActionBuy(); // 直接购买
    }

    //不是门店，可以判断是否开启配送站
    if (
      _root_tag != "fromExchange" &&
      _root_tag != "store" &&
      this.isShowDistributionStation
    ) {
      this.getLocation();
    }

    this.getParams();
    // this.getAgreementPay();
    // this.checkTaxGoods();
    // this.getIvoice();
    this.isTaxGoods = false;
    this.ImgBtnMethob();
  },

  mounted() {
    this.popupSpecs = false;
  },
  methods: {
    ImgBtnMethob() {
      // this.checkedImg = false;
      if (this.fun.isWeiXin() && this.fun.getPhoneEnv() == "2") {
      // if (this.fun.isWeiXin()) {
        //当前使用环境为安卓机的微信app下，即使用微信SDK提供的接口调用微信相册实现图片多选上传功能（注：微信官方一次最多只能9张）
        //因ios与h5自身通过设置input属性为multiple可实现多选，暂无调用微信接口上传
        this.checkedImg = true;
      } else {
        this.checkedImg = false;
      }
    },
    //弃用微信接口原因：当选择微信原图上传时微信还是会进行压缩(任务编号: 33970又改了回来。。。)
    // 相关问题链接：https://developers.weixin.qq.com/community/develop/doc/00088493fb47182c6e27b681b54c00
    chooseImage() {
      let that = this;
      let wxChooseNum = this.max_count - this.fileList1.length;
      wx.chooseImage({
        count: wxChooseNum, // 默认9
        sizeType: ["original"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(req) {
          var localIds = req.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          for (let j = 0; j < localIds.length; j++) {
            wx.getLocalImgData({
              localId: req.localIds[j].toString(),
              success: function(res) {
                const localData = res.localData;
                let imageBase64 = "";
                if (localData.indexOf("data:image") == 0) {
                  //苹果的直接赋值，默认生成'data:image/jpeg;base64,'的头部拼接
                  imageBase64 = localData;
                } else {
                  //此处是安卓中的唯一得坑！在拼接前需要对localData进行换行符的全局替换,M~M~P~~~
                  //此时一个正常的base64图片路径就完美生成赋值到img的src中了
                  imageBase64 =
                    "data:image/jpeg;base64," + localData.replace(/\n/g, "");
                }
                that.onRead_1(imageBase64);
              },
              fail(res) {
                console.log("getLocalImgData::error");
                alert("getLocalImgData::error", res);
              }
            });
          }
        },
        fail() {
          console.log("chooseImage::error");
          alert("chooseImage::error", res);
        }
      });
    },
    dataURItoBlob(dataURI) {
      // 图片转成Buffer---------------------------------
      let byteString = atob(dataURI.split(",")[1]);
      let mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    /*vant图片上传*/
    onRead(e, flag) {
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      let fd = new FormData();

      if (flag === true) {
        fd.append("file", e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (flag === true) {
              That.imageUrl = URL.createObjectURL(e);
            } else {
              That.imageUrl = URL.createObjectURL(e.file);
            }
            That.form.card_avatar = responseData.data.img_url;
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    // 判断多图上传，循环onRead_1方法
    multipleMethod_1(e, flag) {
      let isSlice = this.fileList1.length + e.length - this.max_count;
      console.log(isSlice);
      let _data = e;
      if (isSlice > 0) {
        _data.splice(-isSlice, isSlice);

        this.$dialog.alert({message:`(＞﹏＜)哎呦，您不小心选多了${isSlice}张`});
      }

      if (_data && _data.length) {
        for (let i = 0; i < _data.length; i++) {
          this.onRead_1(_data[i], flag);
        }
      } else {
        this.onRead_1(_data, flag);
      }
    },
    // vant 多图片上传
    onRead_1(e, flag) {
      var That = this;
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      let fd = new FormData();
      if (this.checkedImg) {
        fd.append("file", That.dataURItoBlob(e));
      } else {
        if (flag === true) {
          fd.append("file", e);
        } else {
          fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
        }
      }
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (!That.checkedImg) {
              if (flag === true) {
                That.fileList2.push({
                  url: URL.createObjectURL(e)
                });
              } else {
                That.fileList2.push({
                  url: URL.createObjectURL(e.file)
                });
              }
            }
            That.fileList1.push(responseData.data.img_url);
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    showimg(ind) {
      this.imgIndex = ind;
      this.show = true;
    },
    removeImg: function(delIndex) {
      this.fileList1.splice(delIndex, 1);
      console.log(this.fileList1.length);
      return this.fileList1;
    }, //================================相册上传 end===================================
    setPhotoNum() {
      //设置相册上传数量，当接口返回result==1时，即当前商品设置了独立的相册数量设置；返回result==0时，即采用插件设置的公共限制数量
      let that = this;
      $http
        .get(
          "plugin.photo-order.api.photo-goods.getPhotoGoods",
          { goods_id: that.$route.params.goodsId },
          ""
        )
        .then(function(response) {
          console.log(response.data);
          if (response.result == 1) {
            let _max = response.data.goods_max_photo;
            let _min = response.data.goods_min_photo;
            if (_max != 0 && _max >= _min) {
              that.max_count = _max;
            } else {
              that.max_count =
                Number(_min) >=
                Number(
                  JSON.parse(window.localStorage.getItem("globalParameter"))
                    .photo_order_max_pohot
                )
                  ? _min
                  : Number(
                    JSON.parse(window.localStorage.getItem("globalParameter"))
                      .photo_order_max_pohot
                  );
            }
            that.min_count = _min
              ? _min
              : Number(
                JSON.parse(window.localStorage.getItem("globalParameter"))
                  .photo_order_min_pohot
              );
            console.log("独立的相册数量设置", that.max_count, that.min_count);
          } else {
            that.max_count = Number(
              JSON.parse(window.localStorage.getItem("globalParameter"))
                .photo_order_max_pohot
            ); //最大上传张数
            that.min_count = Number(
              JSON.parse(window.localStorage.getItem("globalParameter"))
                .photo_order_min_pohot
            )
              ? Number(
                JSON.parse(window.localStorage.getItem("globalParameter"))
                  .photo_order_min_pohot
              )
              : 1; //最小上传张数
            console.log("公共限制数量", that.max_count, that.min_count);
          }
          if (!that.max_count) {
            that.isPhoto = false;
            console.log("没有设置相册最大上传张数，关闭相册上传");
          }
        });
    },
    //初始化数据
    initData() {
      if (this.$route.params.from != 'ziti'){
        this.orderFirst = 0;
      }

      this.submit_active = true;
      //地址清空
      this.realname = "";
      this.mobile = "";
      this.address = "";

      this.linkinfo = {
        mobile: "",
        name: ""
      };

      this.order_data = [];
      this.defaultAddress = {};

      this.store_info = {};
      this.storeCarts = [];
      this.store_id = 0;
      this.selected = 0;
      this.popupSpecs = false;
      this.goodsInfo = {};
      this.order = {};
      this.dispatch = [];
      this.addressData = [];
      this.isResize = false;

      this.isRent = false;
      this.AgreementPay = "";

      this.checkList = [];

      this.isRightChoose = false;

      this.isOpenRight = false;

      this.agreement = false;
      this.agreementPay = false;

      this.agreementShow = false;
      this.agreementPayShow = false;

      this.note = [];

      // 优惠券
      this.popupCouponSpecs = false;
      this.coupon_size = 0;
      this.use_coupon_size = 0;
      this.checkCouponList = [];
      this.coupons = [];

      // 抵扣
      this.checkDeductionList = [];

      // 新增地址v2------------------------------------------------新增地址v2//
      this.popAddAddress = false;
      this.addressShow = false;
      this.strShow = false;
      this.addressName = "";
      this.streetShow = false;
      // 新增地址v2------------------------------------------------新增地址v2//

      this.dispatch = [];
      this.dispatchName = {
        1: "快递",
        2: "上门自提",
        3: "送货上门"
      };

      // 续费商品
      this.goods_id = "";

      this.isGetAgreementPay = false;

      currentAddId = "";
      currentAddress = {};

      _cart_ids = [];

      this.isShowDistributionStation = false; //是否显示配送站模块
      this.DistributionSelect = "6";
      this.DistributionInfo = []; //配送站列表
      this.DistributionModel = {
        delivery_name: "",
        has_one_member: {
          mobile: ""
        },
        full_address: "",
        address: "",
        method_name: [
          { name: "送货上门", code: "6" },
          { name: "到店自提", code: "5" }
        ]
      }; //配送站弹窗选中
      this.distributionUserName = this.$route.params.distributionUserName
        ? this.$route.params.distributionUserName
        : "";
      this.distributionUserMobile = this.$route.params.distributionUserMobile
        ? this.$route.params.distributionUserMobile
        : "";

      this.isReplensishment = false;
      this.isOpenTeam = false;
      this.isJoinTeam = false;

      this.pdOrderType = [{ name: "自用", code: "1" }];
      this.POChooseType = "1";

      this.fileList1 = []; //相册
      this.fileList2 = []; //相册
      this.show = false;
      this.imgIndex = 1; //相册图片预览起始位置
      this.isPhoto = false;
      this.checkedImg = true; //true为开启微信相册

      this.is_open_package_deliver = false;
      this.isShowDiyForm = false;
      this.diyform_id = 0;
      this.form_data_id = "";
      this.diyTitle = "";
    },

    changeDistribution() {
      if (_root_tag == TAG_ACTION_BUY ||  _root_tag == "appointment_goods" ||  _root_tag == "yun_sign_goods"||  _root_tag == "auction" ) {
        this.getDataActionBuy(); // 直接购买
      }
    },

    // 整合了发票、是否显示个人信息接口
    getParams(cart_ids) {
      let json = {};
      if (_root_tag == "store" && !cart_ids) {
        return;
      } else if (_root_tag == "store" && cart_ids) {
        _cart_ids = cart_ids;
      }

      if (_root_tag == TAG_ACTION_BUY || _root_tag == "buyCar" ||  _root_tag == "appointment_goods" ||  _root_tag == "yun_sign_goods"||  _root_tag == "auction") {
        _goodsId = this.$route.params.goodsId;
        _cart_ids.push(_goodsId);
        // goods_id: _goodsId
      } else if (_root_tag == TAG_ACTION_CART) {
        _cart_ids = this.$route.params.cart_ids;
      } // 加入租赁商品
      else if (_root_tag == "rentCartBuy") {
        _cart_ids = this.$route.params.cart_ids;
      } // 加入租赁立即租
      else if (_root_tag == "rentBuy") {
        _goodsId = this.$route.params.goodsId;
        _cart_ids.push(_goodsId);
      } else if (_root_tag == "POrder") {
        _goodsId = this.$route.params.goodsId;
        _cart_ids.push(_goodsId);
      }

      json = {
        goods_ids: JSON.stringify(_cart_ids),
        mid: this.fun.getKeyByMid()
      };
      $http
        .get("from.div-from.get-params", json, " ")
        .then(
          response => {
            if (response.result === 1) {
              this.isGetAgreementPay = true;
              this.AgreementPay = response.data.getPayProtocol;
              this.checkTaxGoods(response.data.isDisplay);
              this.getMemberInfo(response.data.getMemberInfo);
              this.getExplain(response.data.explain);
              this.getIvoice(response.data.sinvoice);
            } else {
              this.isGetAgreementPay = false;
              console.log(response.msg);
            }
          },
          function(response) {
            this.isGetAgreementPay = false;
            console.log(response);
          }
        )
        .catch(err => {
          this.isGetAgreementPay = false;
          console.log(err);
        });
    },

    // 获取是否显示支付协议
    getAgreementPay() {
      $http.get("shop.index.getPayProtocol", {}, " ").then(
        response => {
          if (response.result === 1) {
            this.AgreementPay = response.data;
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    gotoDiyform() {
      let that = this;
      this.$router.push(
        this.fun.getUrl("GoodsOrderDiyForm", {
          tag: that.$route.params.tag,
          goodsId: that.$route.params.goodsId,
          optionsId: that.$route.params.optionsId,
          total: that.$route.params.total,
          id: that.diyform_id,
          form_data_id: that.form_data_id,
          changeSelfCarry: JSON.stringify(that.defaultSelfCarry),
          distributionUserName: that.distributionUserName,
          distributionUserMobile: that.distributionUserMobile
        })
      );
    },

    //是否海外商品
    checkTaxGoods(data) {
      // if (_root_tag == TAG_ACTION_BUY) {
      //   _goodsId = this.$route.params.goodsId;
      //   _cart_ids.push(_goodsId);
      // } else if (_root_tag == TAG_ACTION_CART) {
      //   _cart_ids = this.$route.params.cart_ids;
      // } // 加入租赁商品
      // else if (_root_tag == "rentCartBuy") {
      //   _cart_ids = this.$route.params.cart_ids;
      // } // 加入租赁立即租
      // else if (_root_tag == "rentBuy") {
      //   _goodsId = this.$route.params.goodsId;
      //   _cart_ids.push(_goodsId);
      // }
      //
      // let that = this;
      //
      // let json = {
      //   goods_ids: JSON.stringify(_cart_ids),
      //   mid: this.fun.getKeyByMid()
      // };
      //
      // $http.get("from.div-from.isDisplay", json, "添加中").then(
      //   function(response) {
      //     if (response.result === 1) {
      if (data.status) {
        this.isTaxGoods = true;
        // this.getMemberInfo();
        // 显示个人信息
        this.showMyinfo = data.status;
      } else {
        this.isTaxGoods = false;
        // 隐藏个人信息
        this.showMyinfo = false;
      }
      //     } else {
      //       console.error(response);
      //     }
      //   },
      //   function(response) {
      //     console.log(response);
      //   }
      // );
    },

    // 修改用户信息
    saveInfo() {
      let that = this;
      console.log("route", this.$route.params);
      var _goodsId = this.$route.params.goodsId;
      var _optionsId = this.$route.params.optionsId;
      var _total = this.$route.params.total;
      var submitActionTag = this.$route.params.tag;
      if (submitActionTag == "cart") {
        that.addCartReq(_goodsId, _optionsId, _total);
        return;
      }
      let json = {
        member_name: this.member_name,
        member_card: this.member_card
      };
      $http.get("from.div-from.updateMemberInfo", json, "添加中").then(
        function(response) {
          if (response.result === 1) {
            Toast("更新成功");
            that.popupMemberSpecs = false;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    open() {
      this.$dialog.alert({ message:this.explain_content});
    },

    // 配置用户信息
    getMemberInfo(data) {
      // let that = this;
      // $http.get("from.div-from.getMemberInfo", {}, "生成中").then(
      //   function(response) {
      //     if (response.result === 1) {
      this.member_name = data.realname;
      this.member_card = data.idcard;
      // this.getExplain();
      // 个人信息
      this.myRealname = data.realname;
      this.myIdcard = data.idcard;
      //     } else {
      //       Toast(response.msg);
      //     }
      //   },
      //   function(response) {
      //     console.log(response);
      //   }
      // );
    },

    getExplain(data) {
      // let that = this;
      // $http.get("from.div-from.explain", {}, "添加中").then(
      //   function(response) {
      //     if (response.result === 1) {
      this.explain_title = data.explain_title;
      this.explain_content = data.explain_content;
      //     } else {
      //       Toast(response.msg);
      //     }
      //   },
      //   function(response) {
      //     console.log(response);
      //   }
      // );
    },

    // 发票数据
    getIvoice(data) {
      // $http.get("from.div-from.isinvoice", { goods_id: _goodsId }).then(res => {
      //   if (res.result === 1) {
      this.papery_status = parseInt(data.invoice.papery);
      this.electron_status = parseInt(data.invoice.electron);
      if (!this.papery_status && !this.electron_status) {
        this.isShowInvoice = false;
      }
      //   }
      // });
    },

    invoice_type() {
      if (this.iscur_c) {
        this.iscur_c = false;
        this.iscur_d = true;
      } else {
        this.iscur_c = true;
        this.iscur_d = false;
      }
    },

    invoice_title() {
      // 清空填写
      this.invoice_list.call = "";
      this.invoice_list.company_number = "";
      if (this.iscur) {
        this.iscur = false;
        this.iscur_b = true;
        this.person_status = false;
        this.unit_status = true;
      } else {
        this.iscur = true;
        this.iscur_b = false;
        this.person_status = true;
        this.unit_status = false;
      }
    },

    Subinvoice() {
      if (this.fun.isTextEmpty(this.invoice_list.call)) {

        this.$dialog.alert({message:"请填写抬头"});
        return;
      }
      if (
        this.iscur_b &&
        this.fun.isTextEmpty(this.invoice_list.company_number)
      ) {
        this.$dialog.alert({message:"请添加纳税人识别号"});

        return;
      }
      // 页面回显
      this.invoicename = this.iscur_c ? "电子" : "纸质";
      this.companyname = this.iscur ? "个人" : "单位";
      this.showInvoiceTitle = this.invoice_list.call;

      this.show1 = false;
    },

    closePopup() {
      this.show1 = false;
    },

    // 直接购买
    getDataActionBuy() {
      let that = this;
      let json = {
        goods_id: _goodsId,
        total: _total,
        option_id: _optionsId,
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: JSON.stringify(currentAddress),
        dispatch_type_id: 1,
        mark: this.$route.params.mark ? this.$route.params.mark : 0,
        fixed_price:this.$route.params.fixed_price,
        auction_sn:this.$route.params.auction_sn
      };

      //自提点开启
      if (this.is_open_package_deliver && this.selfCarrySelected == "8"){
        json.dispatch_type_id = this.selfCarrySelected;
      }

      let _URL_DataActionBuy = "";
      if (this.isOpenTeam) {
        console.log("一键开团，leveid", this.isOpenTeam);
        json.option_level_id = this.$route.params.option_level_id; //规格层级id
        json.level_id = this.$route.params.level_id; //一键开团 拼团层级id
        _URL_DataActionBuy =
          "plugin.fight-groups.frontend.controllers.team.pre-open-team";
      } else if (this.isJoinTeam) {
        console.log("去参团", this.isJoinTeam);
        json.team_id = this.$route.params.team_id; //一键开团 拼团层级id
        json.option_level_id = this.$route.params.option_level_id; //规格层级id
        _URL_DataActionBuy =
          "plugin.fight-groups.frontend.controllers.team.pre-join-team";
      } else if (this.isShowDistributionStation) {
        //开启配送站
        json.delivery_id = that.DistributionModel.id || "0"; //配送站ID
        json.dispatch_type_id = that.DistributionSelect;
        _URL_DataActionBuy = "plugin.delivery-station.frontend.goods-buy.index";
      } else if (that.$route.params.tag == "POrder") {
        //挂单商品
        json.pending_order_type = that.POChooseType; //批发订单使用类型
        _URL_DataActionBuy = "plugin.pending-order.frontend.goods-buy.index";
      }
      else if (that.$route.params.tag == "auction") {
        //拍卖商品
        _URL_DataActionBuy = "plugin.auction.api.goods-buy";
      }
      else {
        _URL_DataActionBuy = "order.goods-buy";
      }

      $http.get(_URL_DataActionBuy, json, "生成中").then(
        function(response) {
          if (response.result === 1) {
            that.goodsInfo = response.data;
            that.cup_notice = true;
            // that.order = response.data.order
            // that.dispatch = response.data.dispatch
            that.setViewData(response.data); // 设置界面
            that.setAddressViewData(
              response.data.dispatch.default_member_address
            ); // 设置地址界面
            that.initCoupon(response.data.discount.member_coupons); // 设置优惠券信息

            if (that.is_open_package_deliver) {
              //ps::后续的插件都应该让后端返回这个的导航栏，前端循环渲染
              that.selfCarryType = response.data.dispatch.delivery_method;
            }
            if(that.selfCarryType.length > 0){
              for(let i = 0;i<that.selfCarryType.length;i++){
                that.selfCarryType[i].dispatch_type_id = that.selfCarryType[i].dispatch_type_id.toString();
              }
              if(that.orderFirst == 0) {
                that.selfCarrySelected = that.selfCarryType[0].dispatch_type_id;
                that.orderFirst = 1;
              }
            }
          } else {
            Toast(response.msg);
            that.$router.go(-1);
            that.cup_notice = true;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 设置界面
    setViewData(data) {
      // console.log(data, '参数data')
      this.service = data.fee_items;

      this.order_data = data.orders;
      this.show_address = data.orders[0].need_address;
      // var amount_items = data.amount_items;
      this.price = data.total_price; // 设置总价格（合计）
      this.total_items = data.amount_items;
      var discount_amount_items = data.discount_amount_items;
      this.discount_amount_items = data.discount_amount_items;

      discount_amount_items.forEach(items => {
        var totalPrice = 0;
        totalPrice += parseInt(items.amount);
        this.discount_price = totalPrice; // 设置总优惠价格
      });

      this.dispatch = data.dispatch.delivery_method;
      if (!this.fun.isTextEmpty(data.dispatch.delivery_method)) {
        //第一次请求接口获取配送方式后，需要取默认第一个的dispatch_type_id重新请求接口
        this.dispatch.forEach(items => {
          if (items.dispatch_type_id == 8) {
            console.log("有自提点配送方式，请求定位获取自提点列表");
            this.getLocation();
          }
        });
      }

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
        ? ""
        : model.username;
      this.mobile = this.fun.isTextEmpty(model.mobile) ? "" : model.mobile;
      this.address = this.fun.isTextEmpty(model.province)
        ? ""
        : model.province +
          " " +
          model.city +
          " " +
          model.district +
          " " +
          (this.fun.isTextEmpty(model.street) ? "" : model.street + " ") +
          model.address;
    },

    // 选择地址后重新计算数据
    requestByAddress() {
      // 重新计算
      if (_root_tag == TAG_ACTION_BUY ||  _root_tag == "appointment_goods" ||  _root_tag == "yun_sign_goods"||_root_tag == "auction") {
        this.order_data = "";
        this.getDataActionBuy(); // 直接购买
      }
    },

    //显示地址pop
    showDistribution() {
      //获取配送站信息
      this.popupDistribution = true;
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

    // 增加/修改地址
    confirmSelectAddress(item) {
      this.setAddressViewData(item);
      this.requestByAddress(); // 选择地址后重新计算
      this.showAddress = false;
    },

    // 获取收货地址
    getAddress() {
      this.addressData = [];
      let that = this;
      let json = {
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      $http.get("member.member-address.index", json, "获取中").then(
        function(response) {
          if (response.result === 1) {
            that.popupSpecs = true;
            that.addressData = response.data;
            that.defaultAddress = response.data.filter(function(item) {
              return item.isdefault === 1;
            });
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    // 选择地址
    selectAddress(item) {
      // console.log(item)
      this.setAddressViewData(item); // 更新界面 & ID
      this.requestByAddress(); // 选择地址后重新计算
      // 关闭 地址栏
      this.popupSpecs = false;
    },

    // 设置地址
    editAddress() {
      this.popupSpecs = false;
      this.create = false;
      this.popAddAddress = true;
      this.getStreet(this.defaultAddress[0].district_id);
      this.form.address_id = this.defaultAddress[0].id;
      this.form.username = this.defaultAddress[0].username;
      this.form.mobile = this.defaultAddress[0].mobile;
      this.form.province = this.defaultAddress[0].province;
      this.form.city = this.defaultAddress[0].city;
      this.form.district = this.defaultAddress[0].district;
      this.form.address = this.defaultAddress[0].address;
      this.form.street = this.defaultAddress[0].street;
      this.form.isDefault =
        this.defaultAddress[0].isDefault === 0 ? false : true;
      this.addressName =
        this.form.province + " " + this.form.city + " " + this.form.district;
    },

    // 跳转到新增地址
    addAddress() {
      // this.$router.push(this.fun.getUrl('appendAddress', {fromGood: 1}))

      // 关闭 地址栏
      this.popupSpecs = false;
      // this.$router.push({ name: "appendAddress", params: {}, query: { i: this.toi } })

      // 新增地址 本地处理
      this.showAddAddress();
    },

    // 门店商品提交
    submitStore() {
      if (
        this.store_info.delivery_information == null ||
        this.store_info.delivery_information == 0
      ) {
        if (this.isShowDistributionStation || this.is_open_package_deliver) {
          if (this.DistributionSelect == "5" || this.selfCarrySelected == "8") {
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
          } else if (this.DistributionSelect == "6" || this.selfCarrySelected == "1") {
            if (!this.order_data[0].need_address) {
              if (this.fun.isTextEmpty(currentAddId)) {
                Toast("请选择收货地址");
                this.submit_active = true;
                return;
              }
            }
          }
        }
        if(!this.isShowDistributionStation && !this.is_open_package_deliver) {
          if ((this.selected == "1" || this.selected == "3") && this.fun.isTextEmpty(currentAddId)) {
            if (!this.order_data[0].need_address) {
              Toast("请选择收货地址");
              this.submit_active = true;
              return;
            }
          }
        }



        let that = this;

        let json = {
          dispatch_type_id: this.selected,
          store_id: this.store_id,
          mobile: this.store_info.store_mobile,
          realname: this.store_info.store_name,
          address: JSON.stringify(currentAddress),
          goods: JSON.stringify(this.assembleGoods()),
          cart_ids: JSON.stringify(this.storeCarts),
          member_coupon_ids: JSON.stringify(this.assembleCoupons()),
          orders: JSON.stringify(this.assembleDeduction()),
          // 发票
          invoice_type: this.iscur_c ? 0 : 1,
          rise_type: this.iscur ? 1 : 0,
          call: this.invoice_list.call,
          company_number: this.invoice_list.company_number
        };

        if(this.$store.state.liveRoomID){
          json.room_id = this.$store.state.liveRoomID;
        }

        if (clicktag === 0) {
          clicktag = 1;
          $http
            .post("plugin.store-cashier.frontend.store.create", json, "提交中")
            .then(
              function(response) {
                if (response.result === 1) {
                  that.$router.push(
                    that.fun.getUrl("orderpay", {
                      status: "2",
                      order_ids: response.data.order_ids
                    })
                  );
                } else {
                  Toast(response.msg);
                }
                setTimeout(function() {
                  clicktag = 0;
                }, 1000);
              },
              function(response) {
                console.log(response);
              }
            )
            .catch(err => {
              console.log(err);
            });
        }
      } else if (this.store_info.delivery_information == 1) {
        if (this.isShowDistributionStation || this.is_open_package_deliver) {
          if (this.DistributionSelect == "5" || this.selfCarrySelected == "8") {
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
          } else if (this.DistributionSelect == "6" || this.selfCarrySelected == "1") {
            if (!this.order_data[0].need_address) {
              if (this.fun.isTextEmpty(currentAddId)) {
                Toast("请选择收货地址");
                this.submit_active = true;
                return;
              }
            }
          }
        }
        if(!this.isShowDistributionStation && !this.is_open_package_deliver) {

          if (this.selected == "2" && (this.fun.isTextEmpty(this.linkinfo.name) || this.fun.isTextEmpty(this.linkinfo.mobile))) {
            Toast("请输入提货人信息");
            return;
          }

          if ((this.selected == "1" || this.selected == "3") && this.fun.isTextEmpty(currentAddId)) {
            if (!this.order_data[0].need_address) {
              Toast("请选择收货地址");
              this.submit_active = true;
              return;
            }
          }

          if (this.selected == "2" && this.fun.isMoblie(this.linkinfo.mobile)) {

            this.$dialog.alert({message:"请输入正确的手机号"});
            return;
          }
        }

        let that = this;
        let json = this.assembleJson();
        if (clicktag === 0) {
          clicktag = 1;
          $http
            .post("plugin.store-cashier.frontend.store.create", json, "提交中")
            .then(
              function(response) {
                if (response.result === 1) {
                  that.$router.push(
                    that.fun.getUrl("orderpay", {
                      status: "2",
                      order_ids: response.data.order_ids
                    })
                  );
                } else {
                  Toast(response.msg);
                }
                setTimeout(function() {
                  clicktag = 0;
                }, 1000);
              },
              function(response) {
                console.log(response);
              }
            )
            .catch(err => {
              console.log(err);
            });
        }
      }
    },

    // 普通商品提交订单
    submit() {
      console.log("state===res", this.submit_active);
      if (this.isPhoto) {
        //相册模块开启下单时判断 是否符合条件
        if (this.fileList1.length < this.min_count) {

          this.$dialog.alert({message:`上传图片张数不应少于${this.min_count}张`});
          return;
        }
      }

      if (this.submit_active == true) {
        this.submit_active = false;
        if(this.isAllDFOk()){
          Toast("请填写表单！");
          this.submit_active = true;
          return;
        }
        if (this.AgreementPay && !this.isRent) {
          if (!this.agreementPay) {
            Toast("请勾选支付协议");
            this.submit_active = true;
            return;
          }
        }

        if (this.isRent) {
          if (this.store_id) {
            this.submitStore();
            this.submit_active = true;
            return;
          }
          if (!this.isShowDistributionStation) {
            if (!this.order_data[0].need_address && this.POChooseType != "0") {
              if (this.fun.isTextEmpty(currentAddId)) {
                Toast("请选择收货地址");
                this.submit_active = true;
                return;
              }
            }
          }

          if (!this.agreement) {
            Toast("请勾选租赁协议");
            this.submit_active = true;
            return;
          }

          if (this.isShowDistributionStation || this.is_open_package_deliver) {
            if (this.DistributionSelect == "5" || this.selfCarrySelected == "8") {
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
            } else if (this.DistributionSelect == "6" || this.selfCarrySelected == "1") {
              if (!this.order_data[0].need_address) {
                if (this.fun.isTextEmpty(currentAddId)) {
                  Toast("请选择收货地址");
                  this.submit_active = true;
                  return;
                }
              }
            }
          }

          let that = this;
          let json = this.assembleJson();
          if (clicktag === 0) {
            clicktag = 1;
            let orderCreate = "";
            if (this.isPhoto) {
              orderCreate = "plugin.photo-order.api.create";
            } else if (this.isShowDistributionStation) {
              orderCreate = "plugin.delivery-station.frontend.create.index";
            } else if (_root_tag == "POrder") {
              orderCreate = "plugin.pending-order.frontend.create.index";
            } else if (_root_tag == "appointment_goods") {
              orderCreate = "plugin.appointment.frontend.order.create";
            }else if (_root_tag == "auction") {
              orderCreate = "plugin.auction.api.order-create";
            }
            else {
              orderCreate = "plugin.lease-toy.api.order.create";
            }

            $http
              .post(orderCreate, json, "提交中")
              .then(
                function(response) {
                  if (response.result === 1) {
                    that.clearStorage();
                    that.$router.push(
                      that.fun.getUrl("orderpay", {
                        status: "2",
                        order_ids: response.data.order_ids
                      })
                    );
                  } else {
                    Toast(response.msg);
                  }
                  that.submit_active = true;
                  setTimeout(function() {
                    clicktag = 0;
                  }, 1000);
                },
                function(response) {
                  that.submit_active = true;
                  console.log(response);
                }
              )
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          if (this.store_id) {
            this.submitStore();
            this.submit_active = true;
            return;
          }

          if (this.isShowDistributionStation || this.is_open_package_deliver) {
            if (this.DistributionSelect == "5" || this.selfCarrySelected == "8") {
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
            } else if (this.DistributionSelect == "6" || this.selfCarrySelected == "1") {
              if (!this.order_data[0].need_address) {
                if (this.fun.isTextEmpty(currentAddId)) {
                  Toast("请选择收货地址");
                  this.submit_active = true;
                  return;
                }
              }
            }
          } else {
            if (!this.order_data[0].need_address && this.POChooseType != "0") {
              if (this.fun.isTextEmpty(currentAddId)) {
                Toast("请选择收货地址");
                this.submit_active = true;
                return;
              }
            }
          }
          let that = this;
          let json = this.assembleJson();
          if (clicktag === 0) {
            clicktag = 1;

            let orderCreates = "";
            if (this.isPhoto) {
              orderCreates = "plugin.photo-order.api.create";
            } else if (this.isReplensishment) {
              orderCreates = "plugin.service-station.frontend.create.index";
            } else if (this.isOpenTeam || this.isJoinTeam) {
              orderCreates =
                "plugin.fight-groups.frontend.controllers.create.index";
            } else if (this.isShowDistributionStation) {
              orderCreates = "plugin.delivery-station.frontend.create.index";
            } else if (_root_tag == "POrder") {
              orderCreates = "plugin.pending-order.frontend.create.index";
            } else if (_root_tag == "buyCar") {
              orderCreates = "plugin.staging-buy-car.frontend.create.index";
            }else if (_root_tag == "appointment_goods") {
              orderCreates = "plugin.appointment.frontend.order.create";
            }else if (_root_tag == "auction") {
              orderCreates = "plugin.auction.api.order-create";
            }
            else {
              orderCreates = "plugin.overseas.frontend.order.create";
            }

            $http
              .post(orderCreates, json, "提交中")
              .then(
                function(response) {
                  if (response.result === 1) {
                    //that.$router.push({ name: "orderlist", params: { status: "1" }, query: { i: that.toi } });
                    //status:"2" 合并支付
                    //that.$router.push({ name: "orderpay", params: { status: "2", order_ids: response.data.order_ids }, query: { i: that.toi } });
                    that.deleteAddressData();
                    that.$router.push(
                      that.fun.getUrl("orderpay", {
                        status: "2",
                        order_ids: response.data.order_ids
                      })
                    );
                  } else {
                    Toast(response.msg);
                  }
                  that.submit_active = true;
                  setTimeout(function() {
                    clicktag = 0;
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
      }
    },
    //删除那个区域代理的地址id
    deleteAddressData() {
      window.localStorage.removeItem("level");
      window.localStorage.removeItem("province_id");
      window.localStorage.removeItem("city_id");
      window.localStorage.removeItem("district_id");
      window.localStorage.removeItem("street_id");
    },
    // 组装json数据
    assembleJson() {
      let json = {
        //公共数据
        address: JSON.stringify(currentAddress),
        goods: JSON.stringify(this.assembleGoods()),
        member_coupon_ids: JSON.stringify(this.assembleCoupons()),
        orders: JSON.stringify(this.assembleDeduction()),
        // 发票
        invoice_type: this.iscur_c ? 0 : 1,
        rise_type: this.iscur ? 1 : 0,
        call: this.invoice_list.call,
        company_number: this.invoice_list.company_number,
        auction_sn:this.$route.params.auction_sn,
        fixed_price:this.$route.params.fixed_price
      };

      if(this.hasGoodOpenDF()){
        //有商品开启自定义表单
        console.log("有商品开启自定义表单");
        json.order_goods = JSON.stringify(this.assembleGoodsDFData());
      }

      if (_root_tag == TAG_ACTION_BUY || _root_tag == "buyCar" ||  _root_tag == "appointment_goods" ||  _root_tag == "yun_sign_goods"||  _root_tag == "auction") {
        json.dispatch_type_id = 1;
        json.mark = this.$route.params.mark;
        //isOpenTeam 一键开团
        if (this.isOpenTeam) {
          json.level_id = this.$route.params.level_id;
          json.option_level_id = this.$route.params.option_level_id;
        } else if (this.isJoinTeam) {
          json.team_id = this.$route.params.team_id;
          json.option_level_id = this.$route.params.option_level_id;
        }
      } else if (_root_tag == TAG_ACTION_CART) {
        json.dispatch_type_id = 1;
        json.cart_ids = JSON.stringify(_cart_ids);
      } else if (_root_tag == "store") {
        json.dispatch_type_id = this.selected;
        json.store_id = this.store_id;
        json.mobile = this.linkinfo.mobile;
        json.realname = this.linkinfo.name;
        json.cart_ids = JSON.stringify(this.storeCarts);
      } else if (_root_tag == "rentCartBuy" || _root_tag == "rentBuy") {
        let right = window.localStorage.getItem("rentTimeRight");

        let choose = window.localStorage.getItem("rentTimeChoose");

        let self = window.localStorage.getItem("rentTimeSelf");

        let r = this.fun.isTextEmpty(right) == null ? [] : right;

        let assem = {};

        if (!this.fun.isTextEmpty(choose)) {
          assem = choose;
        } else if (!this.fun.isTextEmpty(self)) {
          assem = self;
        } else {
          assem = {};
        }

        json.lease_rights = r;
        json.lease_term = assem;
        json.dispatch_type_id = 1;
        json.cart_ids = JSON.stringify(_cart_ids);
        json.mark = this.$route.params.mark;
      } else if (_root_tag == "packagBuy") {
        // 套餐购买
        json.package_id = _packagJson.package_id;
        json.dispatch_type_id = 1;
      } else if (_root_tag == "POrder") {
        json.dispatch_type_id = 1;
        json.mark = this.$route.params.mark;
        json.pending_order_type = this.POChooseType;
      } else if (_root_tag == "fromExchange") {
        // 兑换中心
        json.dispatch_type_id = 1;
        json.mark = this.$route.params.mark;
      }

      if (this.isPhoto) {
        //相册参数
        json.thumbs = this.fileList1;
        json.is_open_photo_order = 1;
      }

      if (this.isShowDiyForm) {
        json.diyform_id = this.form_data_id; //自定义表单
      }

      if (this.is_open_package_deliver && this.selfCarrySelected == "8") {
        json.dispatch_type_id = 8;
        json.package_deliver_id = this.defaultSelfCarry.id;
        json.realname = this.distributionUserName;
        json.mobile = this.distributionUserMobile;
        delete json.address;
      }
      if (this.isReplensishment) {
        json.service_id = this.$route.params.service_id;
      } else if (this.isShowDistributionStation) {
        json.delivery_id = this.DistributionModel.id;
        json.dispatch_type_id = this.DistributionSelect;
        if (this.DistributionSelect == "5") {
          json.realname = this.distributionUserName;
          json.mobile = this.distributionUserMobile;
          delete json.address;
        }
      }

      if(this.$store.state.liveRoomID){
        json.room_id = this.$store.state.liveRoomID;
      }

      return json;
    },

    // 组装商品信息
    assembleGoods() {
      let newGoods = [];

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
      return newGoods;
    },
    assembleGoodsDFData(){
      //组装商品自定义表单信息
      let that = this;
      let newGoodsDF = [];
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
          if(that.goodsInfo.orders[j].order_goods[i].diy_form){
            let modelDF = {};
            modelDF.pre_id = this.goodsInfo.orders[j].order_goods[i].pre_id;
            modelDF.diyform_data_id = this.goodsInfo.orders[j].order_goods[i].diy_form.diyform_data_id;
            newGoodsDF.push(modelDF);
          }
        }
      }
      return newGoodsDF;
    },

    // 组装优惠券json信息
    assembleCoupons() {
      let coupons = [];

      for (let i = 0; i < this.checkCouponList.length; i++) {
        coupons.push(this.checkCouponList[i].id);
      }

      return coupons;
    },
    // 组装优惠抵扣信息
    assembleDeduction() {
      let deductions = [];

      // this.checkDeductionList[i].note = this.note[this.checkDeductionList[i].pre_id]

      for (let i = 0; i < this.checkDeductionList.length; i++) {
        // this.checkDeductionList[i].deduction_ids = this.checkDeductionList[i].deduction_ids.join(',')
        deductions.push(this.checkDeductionList[i]);
      }
      return deductions;
    },

    // 初始化优惠券
    initCoupon(coupon) {
      this.coupon_size = coupon.length;
      this.coupons = coupon;
    },

    //初始化带有默认选中优惠券
    DefaultSelectCoupon(coupon) {
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

    // 优惠券
    showCoupon() {
      if (this.coupon_size == 0) {
        Toast("暂无优惠券使用");
        return;
      }
      this.popupCouponSpecs = true;
    },

    // 选择优惠券
    selectCoupon(value, valObj) {
      // 处理选择
      // this.screenCoupon(value)
      // 因为换了组件改调用方法
      this.screenCoupon(value, valObj);
      // 设置已经使用多少优惠券
      this.use_coupon_size = this.checkCouponList.length;

      // 重新计算
      if (_root_tag == TAG_ACTION_BUY ||  _root_tag == "appointment_goods" ||  _root_tag == "yun_sign_goods"||  _root_tag == "auction") {
        this.getDataActionBuy(); // 直接购买
      }
    },
    chooseCoupon(index) {
      this.coupons[index].checked = true;
    },

    // 筛选数据优惠券状态
    screenCoupon(value, valObj) {
      var tarValue = valObj;
      console.log("选中优惠券", value, valObj);
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

    // 抵扣选择响应
    discountHandle(item, value) {
      this.screenDiscount(item, value);
      this.discount_price = 0;
      // 重新计算
      if (_root_tag == TAG_ACTION_BUY || _root_tag == "appointment_goods" ||  _root_tag == "yun_sign_goods"||  _root_tag == "auction") {
        this.getDataActionBuy(); // 直接购买
      }

    },

    // 发票触发抵扣事件
    noteHandle(event, item) {
      if (!item.order_deductions[0]) {
        // 临时数据
        let _deductionItem = {};
        let tempDeduction_ids = [];
        if (this.checkDeductionList.length > 0) {
          for (let i = 0; i < this.checkDeductionList.length; i++) {
            if (this.checkDeductionList[i].pre_id == item.pre_id) {
              // 先获取回来
              if (
                this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)
              ) {
                tempDeduction_ids = [];
              } else {
                tempDeduction_ids = this.checkDeductionList[i].deduction_ids;
              }
              this.checkDeductionList.splice(i, 1);
              break;
            }
          }

          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }
        } else {
          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }
        }
      } else {
        this.screenDiscount(item, item.order_deductions[0]);
      }

      console.log("this.checkDeductionList::::", this.checkDeductionList);
    },

    // 筛选抵扣
    screenDiscount(item, value) {
      // console.log("value::::", value)

      // 临时数据
      let _deductionItem = {};
      let tempDeduction_ids = [];

      if (value.checked) {
        // 选中添加

        if (this.checkDeductionList.length > 0) {
          for (let i = 0; i < this.checkDeductionList.length; i++) {
            if (this.checkDeductionList[i].pre_id == item.pre_id) {
              // 先获取回来
              if (
                this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)
              ) {
                tempDeduction_ids = [];
              } else {
                tempDeduction_ids = this.checkDeductionList[i].deduction_ids;
              }

              this.checkDeductionList.splice(i, 1);
              break;
            }
          }

          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }

          // if (tempDeduction_ids.indexOf(value.code) <= 0) {
          //     tempDeduction_ids.push(value.code)
          //     _deductionItem.deduction_ids = tempDeduction_ids
          //     _deductionItem.pre_id = item.order.pre_id
          //     this.checkDeductionList.push(_deductionItem)
          //     console.log("LengthPush:",_deductionItem)
          // }
        } else {
          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }

          // if (tempDeduction_ids.indexOf(value.code) <= 0) {
          //     tempDeduction_ids.push(value.code)
          //     _deductionItem.deduction_ids = tempDeduction_ids
          //     _deductionItem.pre_id = item.order.pre_id
          //     this.checkDeductionList.push(_deductionItem)
          //     console.log("LengthPush:", _deductionItem)
          // }
        }
      } else {
        // 取消选中
        if (this.checkDeductionList.length > 0) {
          for (let i = 0; i < this.checkDeductionList.length; i++) {
            if (this.checkDeductionList[i].pre_id == item.pre_id) {
              // 先获取回来
              if (
                this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)
              ) {
                tempDeduction_ids = [];
              } else {
                tempDeduction_ids = this.checkDeductionList[i].deduction_ids;
              }
              this.checkDeductionList.splice(i, 1);
              break;
            }
          }

          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }

          // if (tempDeduction_ids.indexOf(value.code) > -1) {
          //     tempDeduction_ids.removeByValue(value.code)
          //     _deductionItem.deduction_ids = tempDeduction_ids
          //     _deductionItem.pre_id = item.order.pre_id
          //     this.checkDeductionList.push(_deductionItem)
          //     console.log("LengthPush:", _deductionItem)
          // }
        } else {
          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }
          // if (tempDeduction_ids.indexOf(value.code) > -1) {
          //     tempDeduction_ids.removeByValue(value.code)
          //     _deductionItem.deduction_ids = tempDeduction_ids
          //     _deductionItem.pre_id = item.order.pre_id
          //     this.checkDeductionList.push(_deductionItem)
          //     console.log("LengthPush:", _deductionItem)
          // }
        }
      }

      // console.log('checkList:', this.checkDeductionList)
    },

    // 新增地址v2----------------------------------------------新增地址v2//
    // 显示增加地址
    showAddAddress() {
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
    },

    // 关闭增加地址
    popAddressClose() {
      this.popAddAddress = false;
    },

    // 地址回调
    addressCallback(obj) {
      this.form.street = "";
      this.districtVal = "";
      this.addressName =
        obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.form.province = obj.itemName1;
      this.form.city = obj.itemName2;
      this.form.district = obj.itemName3;
      this.getStreet(obj.itemValue3);
    },

    // 获取街道
    getStreet(param) {
      $http
        .get("member.memberAddress.street", {
          district_id: param
        })
        .then(response => {
          if (response.result === 1 && !this.fun.isTextEmpty(response.data)) {
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
          this.strShow = false;
          console.log(error);
        });
    },

    streetChoose() {
      if (this.fun.isTextEmpty(this.addressName)) {

        this.$dialog.alert({message:"请先选择所在地区"});
      } else {
        this.streetShow = true;
      }
    },

    streetConfirm(name) {
      this.form.street = name;
      this.streetShow = false;
    },

    // 增加/修改地址
    appendAddress(str) {
      var that = this;

      if (this.fun.isTextEmpty(this.form.username)) {

        this.$dialog.alert({message:"请输入收货人姓名"});
        return;
      }

      if (this.fun.isTextEmpty(this.form.mobile)) {

        this.$dialog.alert({message:"请输入联系电话"});
        return;
      }
      if (!/^[0-9]{1,}$/.test(this.form.mobile)) {
        this.$dialog.alert({message:"请输入正确的联系电话"});

        return;
      }

      // if (this.fun.isMoblie(this.form.mobile)) {

      //   return;
      // }

      if (this.fun.isTextEmpty(this.addressName)) {
        this.$dialog.alert({message:"请选择所在区域"});

        return;
      }

      if (this.strShow && this.fun.isTextEmpty(this.form.street)) {

        this.$dialog.alert({message:"请选择所在街道"});
        return;
      }

      if (this.fun.isTextEmpty(this.form.address)) {

        this.$dialog.alert({message:"请输入详细地址"});
        return;
      }

      let json = {};
      if (this.strShow) {
        json = {
          username: this.form.username,
          mobile: this.form.mobile,
          province: this.form.province,
          city: this.form.city,
          district: this.form.district,
          street: this.form.street,
          address: this.form.address,
          isdefault: this.form.isDefault ? 1 : 0,
          address_id: this.form.address_id
        };
      } else {
        json = {
          username: this.form.username,
          mobile: this.form.mobile,
          province: this.form.province,
          city: this.form.city,
          district: this.form.district,
          address: this.form.address,
          isdefault: this.form.isDefault ? 1 : 0,
          address_id: this.form.address_id
        };
      }

      let api = "";
      if (str === "update") {
        api = "member.member-address.update";
      } else {
        api = "member.member-address.store";
      }

      $http.post(api, json, "").then(
        function(response) {
          if (response.result == 1) {

            that.$dialog.alert({message:response.msg});
            that.popAddressClose();
            that.setAddressViewData(response.data);
            that.requestByAddress(); // 选择地址后重新计算
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
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          // error callback
        }
      );
    },
    // 新增地址v2----------------------------------------------新增地址v2//

    alertMyInfo() {
      this.$router.push(
        this.fun.getUrl("myinfo", {
          tag: this.$route.params.tag,
          goodsId: this.$route.params.goodsId,
          optionsId: this.$route.params.optionsId,
          total: this.$route.params.total
        })
      );
    },
    //更换自提点 （杨朗）
    replaceZT() {
      let that = this;
      this.$router.push(
        that.fun.getUrl("SelfCarry_info", {
          tag: that.$route.params.tag,
          goodsId: that.$route.params.goodsId,
          optionsId: that.$route.params.optionsId,
          total: that.$route.params.total,
          id: that.diyform_id, //跳转到其他页面的参数传递逻辑太重复了，后期必须优化统一跳转参数。。。。看看上面的跳转返回alertMyInfo
          form_data_id: that.form_data_id,
          cart_ids: that.$route.params.cart_ids,
          store_id:that.$route.params.store_id
        })
      );
    },

    // 清除localstorage
    clearStorage() {
      window.localStorage.removeItem("rentTimeSelf");
      window.localStorage.removeItem("rentTimeChoose");
      window.localStorage.removeItem("rentTimeRight");
    },

    showAgreement() {
      this.agreementShow = true;
    },

    showPay() {
      this.agreementPayShow = true;
    },

    getLocation() {
      var that = this;
      var myLocation = this.$store.state.o2oLocation;

      if (!myLocation.point) {
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
          } else if (that.isShowDistributionStation) {
            that.getDeliveryStationList(pos);
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
        } else if (that.isShowDistributionStation) {
          that.getDeliveryStationList(myLocation);
        }
      }
    },
    //获取自提点列表（杨朗）
    getList(_data) {
      let that = this;
      let json = {
        city_name: _data.city,
        lat: _data.point.lat,
        lng: _data.point.lng,
        goods: JSON.stringify(this.assembleGoods()),
        kwd: ""
      };
      this.isQuest_ing = true;
      $http.get("plugin.package-deliver.frontend.deliver.getList", json).then(
        function(response) {
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
        function(response) {
          that.isQuest_ing = false;
          console.log(response);
        }
      );
    },
    //获取配送站列表
    getDeliveryStationList(posData) {
      let that = this;
      let json = {
        lng: posData.point.lng,
        lat: posData.point.lat,
        city_name: posData.city
      };
      $http
        .get(
          "plugin.delivery-station.frontend.delivery-station.get-list",
          json,
          "获取配送站信息"
        )
        .then(response => {
          // console.log(response)
          if (response.result == 1) {
            that.DistributionInfo = response.data.data;
            that.DistributionModel = that.DistributionInfo[0];
          } else {
            Toast(response.msg);
            that.isShowDistributionStation = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    isFocus() {
      this.isResize = true;
    },
    isBlur() {
      this.isResize = false;
    },
    hasGoodOpenDF(){
      let that  = this;
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < that.goodsInfo.orders[j].order_goods.length; i++) {
          if(that.goodsInfo.orders[j].order_goods[i].diy_form){
            console.log("有商品开启自定义表单！！！");
            return true;
          }
        }
      }
    },
    isAllDFOk(){
      //判断是否有商品开启自定义表单但是没有提交的，没提交过的diyform_data_id为0
      let that = this;
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < that.goodsInfo.orders[j].order_goods.length; i++) {
          if(that.goodsInfo.orders[j].order_goods[i].diy_form&&that.goodsInfo.orders[j].order_goods[i].diy_form.diyform_data_id == 0){
            console.log("有未填写的表单！！！");
            return true;
          }
        }
      }
    },
    dfsave(_dyData){
      console.log("diyFormPopup组件它点击提交了,这是它的数据",_dyData);
      let that = this;
      console.log('safsfsafdsafa',that.activeDYGoodID);
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < that.goodsInfo.orders[j].order_goods.length; i++) {
          if(that.goodsInfo.orders[j].order_goods[i].goods_id == that.activeDYGoodID){
            that.goodsInfo.orders[j].order_goods[i].diy_form.diyform_data_id = _dyData;
            console.log("设置that.goodsInfo",that.goodsInfo);
            this.dyFormPopup =false;
            return;
          }
        }
      }
    },
    getGoodDFData(_gID,_dyID,_fDataID){
      console.log("表单id;;;;;",_gID,_dyID,_fDataID);
      this.goodDYDormID = _dyID;
      this.activeDYGoodID = _gID;
      this.activeFormDataID = _fDataID;
      let that = this;
      let _json = {
        form_id: _dyID
      };
      if(_fDataID){
        _json.form_data_id = _fDataID;
      }
      $http.get("plugin.diyform.api.diy-form.getSingleFormData", _json).then(function(response) {
        if (response.result === 1) {
          that.dfData = response.data;
          that.dyFormPopup=true;
          that.dyThumb = response.data.thumb?response.data.thumb:null;
          that.dyDescription = response.data.description?response.data.description:null;
          that.dyTiitle = response.data.title?response.data.title:'表单信息';
        } else {
          that.$dialog.alert({message:response.msg});

        }
      },
      function(response) {
        console.log(response);
      });
    }
  },
  components: {
    cTitle, diyfrom, yzAddressList
  },
  watch: {
    DistributionModel(val) {
      this.DistributionModel = val;
      this.DistributionSelect = this.DistributionModel.method_name[0].code;
      if (_root_tag == TAG_ACTION_BUY ||  _root_tag == "appointment_goods" ||  _root_tag == "yun_sign_goods"||  _root_tag == "auction") {
        this.getDataActionBuy(); // 直接购买
      }
    }
  }
};
