import cTitle from "components/title";
import datePicker from "components/hotel/date_picker";

import { Toast } from 'vant';

export default {
  data() {
    return {
      active: 0,
      navigation: {}, //导航信息
      list: [], //兑换列表
      num: 0,
      platform_id: 0, //默认为0（商城）||1：||2：
      mallModel: [],
      NumModel: [],
      parame_id: null,
      isNoData: false,

      start: "",
      end: "",
      night_day: 1,
      show1: false, //入店时间弹窗
      show2: false //离店时间弹窗
    };
  },
  activated() {
    this.navigation = {};
    this.into();
    this.getData();
  },
  methods: {
    into() {
      this.mallModel = [];
      this.NumModel = [];
      this.list = [];
      this.num = 0;
      this.parame_id = null;
      this.isNoData = false;
    },
    getData() {
      // 获取兑换列表，@parameter： platform_id 默认是0，返回的data.navigation中id的值
      this.into();
      let that = this;
      if (this.active == 0) {
        that.platform_id = 0;
      } else if (this.active == 1) {
        that.platform_id = that.navigation[1].id;
      } else if (this.active == 2) {
        that.platform_id = that.navigation[2].id;
        that.getTime();
      }
      $http
        .get(
          "coupon.exchange-center.index",
          { platform_id: that.platform_id },
          ""
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that.navigation = response.data.navigation;
              that.list = response.data.list;
              if (that.fun.isTextEmpty(that.list)) {
                that.isNoData = true;
              }
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
            Toast(response);
          }
        );
    },
    gotoExchange() {
      let that = this;
      if (this.num == 0) {
        Toast("请选择兑换券");
        return;
      }
      let goods_id = [];

      this.mallModel.forEach(item => {
        goods_id.push(item.goods_id);
      });
      console.log("sssssssssss", this.mallModel, goods_id.join(","));
      console.log(this.active,this.mallModel);
      if (this.active == 0) {

        //普通商品
        that.$router.push(
          that.fun.getUrl("goodsorder",{}, {
            tag: "fromExchange",
            exchangeData: that.mallModel,
            goodsId: goods_id.join(",")
          })
        );
      } else if (this.active == 1) {
        this.$router.push(
          this.fun.getUrl("goodsorder",{
            exchangeData: that.mallModel,
          }, {
            store_id: that.parame_id,
            tag: "fromExchange",
            goodsId: goods_id.join(",")
          })
        );
      } else if (this.active == 2) {
        this.$router.push(
          this.fun.getUrl("HotelGoodsOrder",{
            exchangeData: that.mallModel,
          }, {
            end: that.end,
            start: that.start,
            id: that.parame_id,
            goodsId: goods_id.join(","),
            total: this.num
          })
        );
      }
    },
    // 加
    numberRight(index, coupon_id, goods_ids, _parameId, last) {
      let that = this;
      if (this.fun.isTextEmpty(goods_ids)) {
        this.$dialog.alert({message:"该券未设置指定商品,请联系客服"});
        return;
      }
      if (!this.fun.isTextEmpty(this.parame_id)) {
        if (this.parame_id != _parameId && this.active == 1) {
          // 判断是否为同一门店(接口要求每次兑换只能兑换同一id的。。。)
          Toast(`一次只能兑换同一${that.navigation[1].name}`);
          return;
        } else if (
          this.active == 2 &&
          this.mallModel[0].coupon_id != coupon_id
        ) {
          Toast(`不可同时兑换多张不同${that.navigation[2].name}兑换券`);
          return;
        }
      }
      if (this.NumModel[index]) {
        console.log(this.NumModel[index], last);
        if (this.NumModel[index] == last) {
          Toast({
            message: "该券数量不足",
            duration: 800
          });
          return;
        }
        this.NumModel[index] = parseInt(this.NumModel[index]) + 1;
        this.$set(this.NumModel, index, this.NumModel[index]);
        this.mallModel.forEach((item, ind) => {
          if (item.coupon_id == coupon_id) {
            return (this.mallModel[ind].total =
              parseInt(this.mallModel[ind].total) + 1);
          }
        });
      } else {
        this.parame_id = _parameId;
        this.NumModel[index] = 1;
        let total = this.NumModel[index];
        this.$set(this.NumModel, index, total);
        let json = {
          coupon_id: coupon_id,
          goods_id: goods_ids[0].has_many_options&&goods_ids[0].has_many_options.length>0?goods_ids[0].id:goods_ids[0],
          option_id:goods_ids[0].has_many_options&&goods_ids[0].has_many_options.length>0?goods_ids[0].has_many_options[0].id:'',
          total: total
        };
        this.mallModel.push(json);
      }
      this.num = this.num + 1;
      return this.NumModel[index];
    },
    // 减
    numberLeft(index, coupon_id, goods_ids, _parameId) {
      this.NumModel[index] = parseInt(this.NumModel[index]) - 1;
      if (this.NumModel[index] > 0) {
        this.$set(this.NumModel, index, this.NumModel[index]);
        this.mallModel.forEach((item, ind) => {
          if (item.coupon_id == coupon_id) {
            return (this.mallModel[ind].total =
              parseInt(this.mallModel[ind].total) - 1);
          }
        });
      } else {
        this.NumModel[index] = 0;
        this.$set(this.NumModel, index, this.NumModel[index]);
        this.mallModel.forEach((item, ind) => {
          if (item.coupon_id == coupon_id) {
            this.mallModel.splice(ind, 1);
          }
        });
      }
      this.num = this.num - 1;
      if (this.num == 0) {
        this.parame_id = null;
      }
      return this.NumModel[index];
    },
    getTime() {
      let now = new Date();
      let next = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      this.start = `${now.getFullYear()}-${
        now.getMonth() + 1 < 10
          ? `0${now.getMonth() + 1}`
          : `${now.getMonth() + 1}`
      }-${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}`;
      this.end = `${next.getFullYear()}-${
        next.getMonth() + 1 < 10
          ? `0${next.getMonth() + 1}`
          : `${next.getMonth() + 1}`
      }-${next.getDate() < 10 ? `0${next.getDate()}` : `${next.getDate()}`}`;
    },
    acceptTime(type, date) {
      if (type == "离店") {
        this.end = date;
      } else if (type == "入住") {
        this.start = date;
      }
      this.checkDate(type);
    },
    checkDate(type) {
      //入住日期不能为空
      //离店日期不能小于住店日期
      //离店日期不能和住店日期同一天
      let start = new Date(this.start).getTime();
      let end = new Date(this.end).getTime();
      if (this.fun.isTextEmpty(this.start)) {
        this.$notify({
          message: "请先选择入住日期",
          duration: 1000,
          background: "#1989fa"
        });
        this.end = "";
        return;
      } else {
        if (start == end) {
          this.$notify({
            message: "入住和离店日期不能为同一天",
            duration: 1000,
            background: "#1989fa"
          });
          this.end = "";
          return;
        }
        if (start > end) {
          this.$notify({
            message: "离店日期需要大于入店日期",
            duration: 1000,
            background: "#1989fa"
          });
          this.end = "";
          return;
        }

        //关闭弹窗
        if (type == "离店") {
          //计算多少晚
          this.getDays(this.start, this.end);
          this.show2 = false;
          //执行搜索
        } else if (type == "入住") {
          this.getDays(this.start, this.end);
          this.show1 = false;
        }
      }
    },
    //时间日期
    getDays(strDateStart, strDateEnd) {
      console.log(strDateStart, strDateEnd);
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
    close(type) {
      if (type == "离店") {
        this.show2 = false;
      } else if (type == "入住") {
        this.show1 = false;
      }
    },
    setGoodsId() {
      this.mallModel.forEach((item, ind) => {
        return item.goods_id;
      });
    }
  },
  computed: {
    // setGoodsId() {
    //   this.mallModel.forEach((item, ind) => {
    //     return item.goods_id;
    //   });
    // }
  },
  components: { cTitle, datePicker }
};
