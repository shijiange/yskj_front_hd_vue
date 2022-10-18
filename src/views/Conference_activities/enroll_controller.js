import cTitle from "components/title";
import { Toast } from 'vant';
import diyform from "./activity_form";
import diyfroms from "components/diyform";
export default {
  data() {
    return {
      showPage: false,

      orderId: "",
      payStatus: "",
      info: "",
      nochecked: false,
      order_deductions: [],
      pre_id: "",
      awardStatus: false,
      total_price: "",
      arr: [],
      city: "",
      type: "enroll",
      fileList2: [],
      num: 1,
      maxNum: 1,
      count: "",
      datas: {
        params: {},
        data: {
          form_id: ""
        }
      },
      form: {
        member_name: "",
        mobile: "",
        email: "",
        company: "",
        thumb: []
      },
      id: "",
      activity: {},

      default_deduction:0
    };
  },
  activated() {
    this.showPage = false;
    if (this.$route.params.id) {
      this.initData();
      this.now = String(Date.parse(new Date())).substr(0, 10);
      this.id = this.$route.params.id;
      console.log(this.payStatus,'aaaaaaaaaaaaaaaaaaaaaa');
      this.checkStatus();
    } else {
      this.$router.go(-1);
    }
  },
  mounted() {},
  computed: {},
  methods: {
    checkStatus() {
      let json = {
        activity_id: this.id
      };
      $http
        .post("plugin.activity-apply.api.Activity.getActivityEnrol", json)
        .then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.payStatus = response.data.enrol;
            this.applyStatus = response.data.status;
            this.getData();
          } else {
            this.payStatus = response.data.enrol;
            this.getData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initData() {
      this.payStatus = "";
      this.info = "";
      this.nochecked = false;
      this.pre_id = "";
      this.awardStatus = false;
      this.order_deductions = [];
      this.arr = [];
      this.fileList2 = [];
      this.num = 1;
      this.maxNum = 1;
      this.count = "";
      this.form = {
        member_name: "",
        mobile: "",
        email: "",
        company: "",
        thumb: []
      };
      this.activity = {};
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes()) + ":";
      let s = this.change(date.getSeconds());
      return Y + M + D + h + m + s;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    submit() {
      let that = this;
      that.$router.push(
        that.fun.getUrl("goodsorder",{}, {
          tag: "activity",
          goodsId: this.activity.goods_id,
          optionsId: "",
          total: 1
        })
      );
    },
    priceChange() {
      let that = this;
      let json = {
        address: JSON.stringify({}),
        dispatch_type_id: 0,
        goods_id: this.activity.goods_id,
        total: this.num,
        option_id: "",
        orders: JSON.stringify(this.arr),
        member_coupon_ids: ""
      };
      $http.get("order.goods-buy", json, "").then(
        function(response) {
          if (response.result == 1) {
            that.total_price = response.data.total_price;
            that.pre_id = response.data.orders[0].pre_id;
            that.order_deductions = response.data.orders[0].order_deductions;
            if (response.data.discount && response.data.discount.default_deduction && response.data.discount.default_deduction != 0) {
              // 获取第一次接口默认积分抵扣
              that.default_deduction = response.data.discount.default_deduction;
            }
            for (let val in that.order_deductions) {
              if (
                that.order_deductions[val].code == "point" &&
                that.order_deductions[val].checked == true
              ) {
                //that.nochecked = true;
                that.arr.push("point");
                that.info = {
                  orders: JSON.stringify([
                    {
                      deduction_ids: that.arr,
                      pre_id: that.pre_id
                    }
                  ]),
                  dispatch_type_id: 0,
                  activity_id: that.activity.id,
                  test_uid: window.localStorage.uid,
                  lecturer_id: that.activity.lecturer_id,
                  calssify_id: that.activity.calssify_id,
                  goods: JSON.stringify([
                    {
                      goods_id: that.activity.goods_id,
                      total: that.num,
                      option_id: 0
                    }
                  ]),
                  form_id: ""
                };
              } else {
                that.info = {
                  orders: JSON.stringify([
                    {
                      deduction_ids: that.arr,
                      pre_id: that.pre_id
                    }
                  ]),
                  dispatch_type_id: 0,
                  activity_id: that.activity.id,
                  test_uid: window.localStorage.uid,
                  lecturer_id: that.activity.lecturer_id,
                  calssify_id: that.activity.calssify_id,
                  goods: JSON.stringify([
                    {
                      goods_id: that.activity.goods_id,
                      total: that.num,
                      option_id: 0
                    }
                  ]),
                  form_id: ""
                };
              }
              console.log(that.info);
            }
          } else {
            that.$router.go(-1);
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    switchChange(Type, sta) {
      let that = this;
      if (Type == "point" && sta == true && this.nochecked == false) {
        if (this.arr.indexOf("point") <= -1) {
          this.arr.push("point");
        }
      }
      if (Type == "point" && sta == false && this.nochecked == false) {
        if (this.arr.indexOf("point") > -1) {
          this.arr.splice(this.arr.indexOf("point"), 1);
        }
      }
      if (Type == "love" && sta == true) {
        if (this.arr.indexOf("love") <= -1) {
          this.arr.push("love");
        }
      }
      if (Type == "love" && sta == false) {
        if (this.arr.indexOf("love") > -1) {
          this.arr.splice(this.arr.indexOf("love"), 1);
        }
      }
      console.log(this.arr,Type,sta,this.nochecked);
      let json = {
        address: JSON.stringify({}),
        dispatch_type_id: 0,
        goods_id: this.activity.goods_id,
        total: this.num,
        option_id: "",
        orders: JSON.stringify([
          {
            deduction_ids: this.arr,
            pre_id: this.pre_id
          }
        ]),
        member_coupon_ids: ""
      };

      if (this.default_deduction != 0) {
        // 默认积分抵扣
        json.no_deduction_ids = this.default_deduction;
      }
      console.log(json);
      $http.get("order.goods-buy", json, "计算中").then(
        function(response) {
          // console.log(response.data)
          if (response.result == 1) {
            that.total_price = response.data.total_price;
            that.pre_id = response.data.orders[0].pre_id;
            that.order_deductions = response.data.orders[0].order_deductions;
            that.info = {
              orders: JSON.stringify([
                {
                  deduction_ids: that.arr,
                  pre_id: that.pre_id
                }
              ]),
              dispatch_type_id: 0,
              activity_id: that.activity.id,
              test_uid: window.localStorage.uid,
              lecturer_id: that.activity.lecturer_id,
              calssify_id: that.activity.calssify_id,
              goods: JSON.stringify([
                {
                  goods_id: that.activity.goods_id,
                  total: that.num,
                  option_id: 0
                }
              ]),
              form_id: ""
            };
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getData() {
      let that = this;
      let json = {
        activity_id: this.id
      };
      $http
        .get("plugin.activity-apply.api.Activity.getActivity", json, "加载中")
        .then(response => {
          this.showPage = true;
          if (response.result === 1) {
            this.activity = response.data;
            console.log(this.activity);
            this.orderId =
              this.activity.has_many_pay_order.length > 0
                ? this.activity.has_many_pay_order[0].order_id
                : "";
            this.count =
              this.activity.has_many_pay_order.length > 0
                ? this.activity.has_many_pay_order[0].count
                : 0;
            this.city = this.activity.city_name||'';
            this.datas.data.form_id = this.activity.form_id;
            this.awardStatus = this.activity.love.award;
            this.total_price = this.activity.cash;
            if (that.activity.cash > 0) {
              that.priceChange();
            } else {
              that.info = {
                dispatch_type_id: 0,
                activity_id: that.activity.id,
                test_uid: window.localStorage.uid,
                lecturer_id: that.activity.lecturer_id,
                calssify_id: that.activity.calssify_id,
                goods: JSON.stringify([
                  {
                    goods_id: that.activity.goods_id,
                    total: that.num,
                    option_id: 0
                  }
                ]),
                form_id: ""
              };
            }
            let {share_title:title1,share_thumb:thumb1,share_desc:desc1} = response.data.has_one_share;
            let {share_title:title2,share_thumb:thumb2,share_desc:desc2} = response.data.set;
            this.fun.wxShare(
              "",
              {},
              {
                title: title1||title2,
                imgUrl: thumb1||thumb2,
                description: desc1||desc2
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    add() {
      if (this.num >= this.maxNum) {
        Toast(`每人限购${this.maxNum}张`);
        return;
      } else {
        ++this.num;
      }
    },
    down() {
      if (this.num <= 1) {
        Toast("数量必须大于1");
        return;
      } else {
        --this.num;
      }
    },
    multipleMethod_1(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_1(e[i], flag);
        }
      } else {
        this.onRead_1(e, flag);
      }
    },
    // vant 多图片上传
    onRead_1(e, flag) {
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      let fd = new FormData();
      if (flag) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      console.log(e);
      var That = this;
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (flag) {
              That.fileList2.push({
                url: URL.createObjectURL(e)
              });
            } else {
              That.fileList2.push({
                url: URL.createObjectURL(e.file)
              });
            }
            That.form.thumb.push(responseData.data.img_url);
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
    onphotosize(e) {
      this.imgPreview(e.file, 1);
    },
    onphotosize2(e) {
      this.imgPreview(e.file, 2);
    },
    imgPreview(file, callback) {
      let self = this;
      // 判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成base64格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function() {
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制
            var maxWidth = 400,
              maxHeight = 400;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过400x400的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(
                  maxWidth * (originHeight / originWidth)
                );
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(
                  maxHeight * (originWidth / originHeight)
                );
              }
            }

            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob并上传
            canvas.toBlob(function(blob) {
              // 图片ajax上传
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
                // self.onRead_1(blob, true)
                self.multipleMethod_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    removeImg: function(delIndex) {
      this.form.picture.splice(delIndex, 1);
    },
    isPoneAvailable(pone) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(pone)) {
        return false;
      } else {
        return true;
      }
    }
  },
  components: {
    cTitle,
    diyform,
    diyfroms
  }
};
