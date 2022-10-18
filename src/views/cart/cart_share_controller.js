import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import { Toast } from 'vant';

export default {
  data() {
    return {
      share_id: "",
      set: {},
      member: {},
      cartList: [], //商品列表
      eachCheckList: [], //选中商品列表
      checkAll: false,
      selectBol: true,

      showCouponDetail: false, //优惠券弹窗
      good_clicktag: 0,
      all_get_coupon: false,
      share_coupons: [],  //分享优惠券
      coupons: [], //自己的优惠券
      old_coupons: [],
      coupons_temp: {}, //折叠优惠券显示数量
      checkCouponList: [], //选中的优惠券

      showWechatshar: false,
    };
  },
  activated() {
    this.share_id = this.fun.getKey('share_id');
    this.getData();
  },
  methods: {
    getData(){
      let url = "plugin.cart-sharing.frontend.cart.get-sharing-data"; // 从购物车过来  分享者
      let json = {};
      if(this.share_id) {
        url = "plugin.cart-sharing.frontend.cart.receive-page-data"; // 被分享
        json = {share_id: this.share_id};
      }
      $http.get(url, json, "loading").then(
        (response)=> {
          if (response.result == 1) {
            if(this.share_id) {
              this.cartList = response.data.goods;
              this.share_coupons = response.data.coupons || [];
              this.checkAllCoupon();
              this.fun.wxShare(
                "",
                {},
                {
                  imgUrl: this.cartList[0] ? this.cartList[0].thumb : '',
                  description: `${this.member.nickname}${this.set.title}` + (this.cartList.length > 0 ?`（共${this.cartList.length}款商品）`:'')
                }
              );
            }else {
              this.cartList = response.data.cart_list;
              this.coupons = response.data.coupons||[];
              this.initSelectCoupon(this.coupons);
            }
            this.set = response.data.set;
            this.member = response.data.member;
          } else {
            Toast(response.msg);
          }
        }
      );
    },
    shareGoods() {
      // 保存分享商品
      console.log("分享商品");
      if(this.eachCheckList.length==0 && this.share_coupons.length ==0) {
        return;
      }
      let goods = [];
      let imgUrl = "";
      let link = `${this.fun.getSiteRoot()}/addons/yun_shop/?menu#/cart_share?i=${this.fun.getKeyByI()}&share_id=`;
      this.cartList.map((good)=> {
        if(this.eachCheckList.includes(good.goods_id)) {
          if(!imgUrl) {
            imgUrl = good.goods.thumb;
          }
          goods.push({
            goods_id: good.goods_id,
            amount: good.total,
            option_id: good.goods_option ? good.goods_option.id : ''
          });
        }
      });

      $http.post("plugin.cart-sharing.frontend.cart.save-sharing-goods", {goods: goods}, "loading").then(
        (response)=> {
          if (response.result == 1) {
            link= link + response.data.share_id;
            console.log(link);
            this.fun.wxShare(
              "",
              {},
              {
                link: link,
                imgUrl: imgUrl,
                description: `${this.member.nickname}${this.set.title}`+ (this.eachCheckList.length > 0 ?`（共${this.eachCheckList.length}款商品）`:'')
              }
            );

            if(this.share_coupons.length > 0) {
              this.shareCoupon(response.data.share_id);
            }else {
              this.showWechatshar = true;
            }
          } else {
            Toast(response.msg);
          }
        }
      );
    },
    shareCoupon(share_id) {
      // 保存分享优惠券
      let coupon = [];
      this.share_coupons.map((item)=> {
        coupon.push({
          coupon_id: item.coupon_id,
          amount: item.num
        });
      });
      $http.post("plugin.cart-sharing.frontend.cart.save-sharing-coupon", {share_id: share_id,coupon: coupon}, "loading").then(
        (response)=> {
          if (response.result == 1) {
            this.showWechatshar = true;
          } else {
            Toast(response.msg);
          }
        }
      );
    },
    getCoupon(data) {
      // 领取优惠券
      let couponData = [];
      if(data == "all" && this.all_get_coupon) {
        // 领完就别领了
        return;
      }
      if(data == "all") {
        this.share_coupons.map((item)=> {
          couponData.push({
            coupon_id: item.id,
            type: item.share_type
          });
        });
      }else {
        couponData.push({
          coupon_id: data.id,
          type: data.share_type
        });
      }
      $http.post("plugin.cart-sharing.frontend.cart.receive-coupon", {share_id: this.share_id,couponData: couponData}, "loading").then(
        (response)=> {
          if (response.result == 1) {
            if(data == "all") {
              this.all_get_coupon = true;
            }else {
              this.checkAllCoupon();
              data.sharing_status = 1;
            }
            Toast("领取成功");
          } else {
            Toast(response.msg);
          }
        }
      );
    },
    checkAllCoupon() {
      let flag = true;
      this.share_coupons.map((item)=> {
        if(item.sharing_status == 0) {
          flag = false;
        }
      });
      this.all_get_coupon = flag;
    },
    addIntoCart() {
      // 加入购物车
      let goods_data = [];
      this.cartList.map((good)=> {
        if(this.eachCheckList.includes(good.goods_id)) {
          goods_data.push({
            goods_id: good.goods_id,
            total: good.total,
            option_id: good.option_id || ''
          });
        }
      });
      $http.post("member.member-cart.batch-store", {goods_data: goods_data}, "loading").then(
        (response)=> {
          if (response.result == 1) {
            if(response.data.error.length > 0) {
              let msg = "";
              this.cartList.map((good)=> {
                if(response.data.error.includes(good.goods_id)) {
                  msg = msg + good.title + '、';
                }
              });
              this.$dialog.alert({ message: msg.slice(0,-1)+ "加入购物车失败,请重新选择！" });
            }else {
              Toast("加入成功");
            }
          } else {
            Toast(response.msg);
          }
        }
      );
    },

    //初始化优惠券
    initSelectCoupon(coupon) {
      let coupon_data = coupon;
      let result = [];
      let temp = {};

      for (let i = 0; i < coupon_data.length; i++) {
        let num = 0; //优惠券数量
        coupon_data[i].valid = true;
        coupon_data[i].checked = false;
        let _data = coupon_data[i];
        result.push(_data);
        temp[coupon_data[i].coupon_id] = {};
        temp[coupon_data[i].coupon_id].num = num;
      }
      this.coupons_temp = temp;
      this.coupons = result;
      // console.log(this.coupons, this.coupons_temp,"coupons_temp");
    },
    // 选择优惠券
    selectCoupon(value, valObj, num) {
      // 处理选择
      // console.log(value,valObj,"valObj");
      let tarValue = valObj;
      if (value) {
        // 选中添加
        tarValue.num = num || 1;
        if (this.checkCouponList.length > 0) {
          for (let i = 0; i < this.checkCouponList.length; i++) {
            if (this.checkCouponList[i].coupon_id == tarValue.coupon_id) {
              this.checkCouponList.splice(i, 1);
            }
          }
          this.checkCouponList.push(tarValue);
        } else {
          this.checkCouponList.push(tarValue);
        }

        //开启折叠优惠券并且为点击复选框为选中状态
        this.coupons_temp[tarValue.coupon_id].num = num || 1;
      } else {
        // 取消选中
        if (this.checkCouponList.length > 0) {
          for (let i = 0; i < this.checkCouponList.length; i++) {
            if (this.checkCouponList[i].coupon_id == tarValue.coupon_id) {
              this.checkCouponList.splice(i, 1);
            }
          }
        }
        tarValue.num = 0;
        //开启折叠优惠券并且为点击复选框为选中状态
        this.coupons_temp[tarValue.coupon_id].num = 0;
      }
    },
    chooseCoupon(index, valid) {
      // console.log(index, this.coupons[index].checked)
      if (valid) {
        this.coupons[index].checked = !this.coupons[index].checked;
      }
      this.coupons.reverse().reverse();
    },
    // 改变优惠券数量
    changeCoupon(num, data) {
      // console.log(num, data)
      let valObj = data.name;
      // console.log('=================', num, data, valObj.count)
      if (num > valObj.count) {
        Toast(`数量已达上限`);
        this.good_clicktag = 1; //添加原因van-stepper的value只有第一次有
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // 注意此时修改 value 后会再次触发 change 事件
          this.coupons_temp[valObj.coupon_id].num = valObj.count;
          this.good_clicktag = 0;
        }, 200);

        // this.$set(this.coupons_temp[valObj.coupon_id], "num", valObj.count);
        return;
      } else if (num == "" || num == undefined || num == 0) {
        Toast("如暂不使用请取消勾选");
        return;
      } else {
        clearTimeout(this.timer);
        this.coupons_temp[valObj.coupon_id].num = num;
        // console.log(num,this.coupons_temp[valObj.coupon_id].num,this.coupons_temp,"this.coupons_temp");
      }

      let value = {
        target: { checked: true }
      };
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      }
      // clearTimeout方法，以便控制连续触发带来的无用调用
      this.timeoutId = setTimeout(() => {
        // 200毫秒以后执行方法
        this.selectCoupon(value, valObj, num);
      }, 200); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    openCoupon() {
      this.showCouponDetail=true;
      this.old_coupons = JSON.parse(JSON.stringify(this.coupons));
    },
    sureCoupon() {
      this.showCouponDetail = false;
      this.share_coupons = JSON.parse(JSON.stringify(this.checkCouponList));
    },
    cancelCoupon() {
      this.showCouponDetail = false;
      this.coupons = JSON.parse(JSON.stringify(this.old_coupons));
    },

    //点击全选
    allSelect(event) {
      if (this.selectBol) {
        // console.log(this.selectBol, event, "全选");
        if(event) {
          let all_carts_id = [];
          this.cartList.map((item)=>{
            all_carts_id.push(item.goods_id);
          });
          this.eachCheckList = JSON.parse(JSON.stringify(all_carts_id));
        }else {
          this.eachCheckList = [];
        }
        // this.countCartView();
      }
    },
    selectBolfun(num) {
      // 判断点击是否点击全选 '1', 防止多次触发this.eachCheckList变化allSelectHandle
      num === '1' ? this.selectBol = true : this.selectBol = false;
    },

    //选择商品监听 this.eachCheckList变化会触发
    allSelectHandle(value) {
      // console.log(this.selectBol,value, "value",this.cartList);
      if (!this.selectBol) {
        this.checkAll = value.length === this.cartList.length;
      }
      // console.log(this.eachCheckList,"this.eachCheckList");
    },

    numberLeft(index) {
      // console.log(this.cartList[index].total);
      if (this.cartList[index].total <= 1) {
        Toast("商品数量不能为负数或零");
        return;
      }
      this.cartList[index].total = Number(this.cartList[index].total) - 1;
      // this.changeCount(this.cartList[index].total, this.cartList[index].goods_id, index);
    },

    numberRight(index) {
      this.cartList[index].total = Number(this.cartList[index].total) + 1;
      if (this.cartList[index].stock && this.cartList[index].total > this.cartList[index].stock) {
        Toast(`该商品库存只剩${this.cartList[index].stock}件`);
        this.cartList[index].total = this.cartList[index].stock;
        // return;
      }
      // this.changeCount(this.cartList[index].total, this.cartList[index].goods_id, index);
    },

    //改变数量
    // changeCount(_num, goods_id, index) {
    //   if (_num < 0) {
    //     Toast("商品数量不能为负数");
    //     // 最少为1
    //     this.cartList[index].total = 1;
    //     return;
    //   }
    //
    //   let json = {
    //     id: goods_id,
    //     num: _num,
    //   };
    //   $http.get("cart.list.updateNumV2", json, "").then(
    //     (response)=> {
    //       if (response.result === 1) {
    //         // this.countCartView();
    //       } else {
    //         Toast(response.msg);
    //         this.cartList[index].total = 1;
    //       }
    //     },
    //     (response)=> {
    //       console.log(response);
    //     }
    //   );
    // },
    // // 计算总价格
    // countCartView() {
    //   let cart_ids = [];
    //   for(let i=0;i<this.eachCheckList.length;i++) {
    //     this.eachCheckList.map((item)=>{
    //       cart_ids.push(item);
    //     });
    //   }
    //   this.cart_ids = cart_ids;
    //   this.checkChooseAll();
    //   if(!this.cartDelete) {
    //     this.getData('count');
    //   }
    // },

    // // 判断是否全选
    // checkChooseAll() {
    //   if((this.cartList.length) === this.cart_ids.length) {
    //     //判断全选
    //     this.checkAll = true;
    //   }else {
    //     this.checkAll = false;
    //   }
    // },

    //跳转商品详情
    toGoodsInfo(goods) {
      this.$router.push(this.fun.getUrl("goods", {id: goods.goods_id})
      );
    },
    goCart() {
      this.$router.push(this.fun.getUrl("cart"));
    },
  },
  components: { yzWechatShareImg }
};