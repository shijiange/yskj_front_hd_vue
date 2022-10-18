import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      selected: "1",
      display: 1,
      pagesize: 1,
      //待使用
      wait_used: [],
      //已过期
      overdue: [],
      used: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isPresenter: false,
      showPresenter: false,
      presenter_data: {},
      recharge_search: '',
      timeoutId: null,
      nickname: null,
      // srcOne:require('../../assets/images/couponsbg_1@3x.png'),
      // srcTwo:require('../../assets/images/couponsbg_2@3x.png'),
      // srcThr:require('../../assets/images/couponsbg_3@2x.png'),
      // srcDue:require('../../assets/images/couponsbg_7@3x.png'),
      types: [],
      // types:['全部','平台','门店','酒店','指定商品','分类商品','兑换卷','满减卷','折扣卷','快过期'],
      typesIndex: 0,
      pjh: 1,
      share_coupon: false,
      write_off_coupon: false,
      verification: false
    };
  },
  methods: {
    initData() {
      this.page = 1;
      this.goload = true;
      this.total_page = 0;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.typesIndex = 0;
      this.isPresenter = false;
    },
    //更新
    loadTop() {
      this.initData();
      this.getNetData(this.selected, this.typesIndex);
      this.$refs.coupon_loadmore.onTopLoaded();
    },
    // 加载更多
    loadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件

      if (this.isLoadMore) {
        this.getMoreData(this.page, this.selected);
        this.$refs.coupon_loadmore.onBottomLoaded();
      } else {
        console.log("没有更多数据");
      }
    },
    close_verification() {
      this.verification = false;
    },
    goDetail(data){
      let that = this;
      let info = {
        item : data,
        combine_show:that.combine_show?that.combine_show:false,
        share_coupon:that.share_coupon,
        write_off_coupon:that.write_off_coupon,
        isPresenter:that.isPresenter
      };
      console.log(info);
      this.$router.push(this.fun.getUrl("coupon_v2_detail", { item:info }));
    },
    toStore() {
      this.$router.push(this.fun.getUrl("couponStore", { myparent: this }));
    },
    goHome() {
      this.$router.push(this.fun.getUrl("home"));
    },
    //切换优惠券状态列表
    switchItem() {
      this.initData();
      this.getNetData(this.selected, this.typesIndex);
    },
    toggle(event, n) {
      if (
        event.target.className == "fa coupon_voucher_more_arr fa-angle-down"
      ) {
        this.display = 99999;
      } else {
        this.display = n;
      }
    },
    tapShow(id) {
      // var that = this;
      $http
        .get(
          "plugin.write-off-coupons.Frontend.controllers.code.index",
          { record_id: id },
          "正在获取"
        )
        .then(
          response => {
            if (response.result == 1) {
              console.log(response);
              this.verification = true;
              this.verificationImg = response.data;
            } else {
              this.$dialog.alert({message:response.msg});
              //Toast(response.msg);
            }
          },
          function (response) {
            // error callback
          }
        );
    },
    setTypesIndex(ind) {
      if (this.typesIndex == ind) {
        return;
      }
      this.typesIndex = ind;
      this.getNetData(this.selected, this.typesIndex);
    },
    //发起http请求
    getNetData(type, typesIndex) {
      var that = this;
      $http
        .get(
          "coupon.member-coupon.coupons-of-member-by-status-v2",
          { status_request: type, page: 1, coupon_type: typesIndex },
          "正在获取"
        )
        .then(
          response => {
            if (response.result == 1) {
              var myData = response.data;
              console.log(myData);
              that.total_page = response.data.total;
              that.isPresenter = response.data.set.transfer;
              that.types = response.data.search_array;
              for (let i = 0; i < myData.data.length; i++) {
                if (myData.data[i].belongs_to_coupon.coupon_type_name == '平台商品') {
                  myData.data[i].type = 1;
                } else if (myData.data[i].belongs_to_coupon.coupon_type_name == '兑换券') {
                  myData.data[i].type = 2;
                } else if (myData.data[i].belongs_to_coupon.coupon_type_name == '分类商品') {
                  myData.data[i].type = 3;
                } else if (myData.data[i].belongs_to_coupon.coupon_type_name == '指定商品') {
                  myData.data[i].type = 4;
                } else if (myData.data[i].belongs_to_coupon.coupon_type_name == '酒店商品') {
                  myData.data[i].type = 5;
                } else if (myData.data[i].belongs_to_coupon.coupon_type_name == '门店商品') {
                  myData.data[i].type = 6;
                } else if (myData.data[i].belongs_to_coupon.coupon_type_name == '商品和门店') {
                  myData.data[i].type = 8;
                }
              }
              if (!this.fun.isTextEmpty(myData.write_off_coupon)) {
                this.write_off_coupon = myData.write_off_coupon;
              } else { this.write_off_coupon = false; }
              if (!this.fun.isTextEmpty(myData.share_coupon)) {
                this.share_coupon = myData.share_coupon;
              } else { this.share_coupon = false; }
              if(!this.fun.isTextEmpty(myData.combine_show)){
                this.combine_show = myData.combine_show;
              }else{ this.combine_show = false;}
              if (type == 1) {
                that.wait_used = myData.data;
                console.log(that.wait_used);
              } else if (type == 2) {
                that.overdue = myData.data;
              } else {
                that.used = myData.data;
              }
              // TODO
              // 测试改变颜色
              // this.$nextTick(() => {
              //   this.$el.querySelectorAll(
              //     ".coupon_voucher_left"
              //   )[0].style.background = "red";
              // });
            } else {
              that.$dialog.alert({message:response.msg});

              //Toast(response.msg);
            }
          },
          function (response) {
            // error callback
          }
        );
    },
    getMoreData(page, type) {
      var that = this;
      if (this.page == this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "coupon.member-coupon.coupons-of-member-by-status-v2",
            {
              status_request: type,
              page: this.page,
              coupon_type: typesIndex,
              i: this.fun.getKeyByI(),
              type: this.fun.getTyep()
            },
            "正在获取更多"
          )
          .then(
            function (response) {
              that.isPresenter = response.data.set.transfer;
              if (response.result == 1) {
                var myData = response.data;

                that.loading = false;
                that.allLoaded = false;
                if (index == 1) {
                  that.wait_used = that.wait_used.concat(myData.data); //数组拼接
                } else if (index == 2) {
                  tthat.overdue = that.overdue.concat(myData.data);
                } else {
                  that.used = that.used.concat(myData.data);
                }
              } else {
                that.page = that.page - 1;
                that.loading = true;
                that.allLoaded = true;
                that.isLoadMore = false;
                return;
              }
            },
            function (response) {
              // error callback
            }
          );
      }
    },

    //通过类型去查询可用商品
    goBuy(item) {
      console.log(item.belongs_to_coupon.use_type);
      if (item.belongs_to_coupon.use_type == 0) {
        //0商城通用
        this.goHome();
      } else if (item.belongs_to_coupon.use_type == 1) {
        //1指定分类
        if (item.belongs_to_coupon.plugin_id == 32) {
          //门店商品优惠券
          this.$router.push(
            this.fun.getUrl(
              "StoreSearch",
              {
                store_id: item.belongs_to_coupon.storeids,
                fromHome: 3
              },
              { cid: item.belongs_to_coupon.category_ids }
            )
          );
        } else {
          this.$router.push(
            this.fun.getUrl("catelist", {
              id: JSON.stringify(item.belongs_to_coupon.category_ids),
              fromHome: 1
            })
          );
        }
      } else if (
        item.belongs_to_coupon.use_type == 2 ||
        item.belongs_to_coupon.use_type == 8
      ) {
        //2指定商品
        if (item.belongs_to_coupon.plugin_id == 32) {
          //门店商品优惠券
          this.$router.push(
            this.fun.getUrl(
              "StoreSearch",
              {
                store_id: item.belongs_to_coupon.storeids,
                fromHome: 2
              },
              { gid: item.belongs_to_coupon.goods_ids }
            )
          );
        } else {
          this.$router.push(
            this.fun.getUrl("search", {
              coupon: item.belongs_to_coupon.id,
              fromHome: 1
            })
          );
        }
      } else if (
        item.belongs_to_coupon.use_type === 4 &&
        Array.isArray(item.belongs_to_coupon.storeids)
      ) {
        //4门店列表
        this.$router.push(this.fun.getUrl("o2oHome"));
      } else if (
        item.belongs_to_coupon.use_type === 5 &&
        typeof item.belongs_to_coupon.storeids === "number"
      ) {
        //5单门店
        this.$router.push(
          this.fun.getUrl("o2oStore_v2", {
            store_id: item.belongs_to_coupon.storeids,
            fromHome: 1
          })
        );
      } else if (
        item.belongs_to_coupon.use_type === 7 &&
        Array.isArray(item.belongs_to_coupon.hotel_ids)
      ) {
        this.$router.push(this.fun.getUrl("HotelIndex"));
      } else if (
        item.belongs_to_coupon.use_type === 6 &&
        typeof item.belongs_to_coupon.hotel_ids === "number"
      ) {
        this.$router.push(
          this.fun.getUrl("HotelHome", {
            id: item.belongs_to_coupon.hotel_ids,
            fromHome: 1
          })
        );
      } else {
        this.goHome();
      }
    },
    delteteItem(item, i) {
      let that = this;
      let json = {
        id: item.id,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };

      $http.get("coupon.member-coupon.delete", json, "处理中...").then(
        function (response) {
          if (response.result == 1) {
            if (that.selected == 1) {
              that.wait_used.splice(i, 1);
            } else if (that.selected == 2) {
              that.overdue.splice(i, 1);
            } else {
              that.used.splice(i, 1);
            }
            that.$dialog.alert({message:"操作成功"});
          } else {
            that.$dialog.alert({message:response.msg});
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    throttleFn(event) {
      // clearTimeout方法，以便控制连续触发带来的无用调用
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      }
      let that = this;
      this.timeoutId = setTimeout(function () {
        // 100毫秒以后执行方法
        that.searchTransfer(event);
      }, 300); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    searchTransfer(event) {
      var reSearch = event.target.value;
      if (reSearch) {
        $http
          .get(
            "member.member.memberInfo",
            { uid: reSearch }, ""
          )
          .then(response => {
            if (response.result === 1) {
              this.nickname = response.data ? response.data.nickname : '查无此用户';
            } else {
              this.nickname = null;
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.showSearch = false;
        this.search_list = [];
      }
    },

    //赠送优惠券
    presenter(item, index) {
      // let that = this;
      this.showPresenter = true;
      this.presenter_data.item = item;
      this.presenter_data.index = index;


    },

    //赠送post
    presenterPost() {
      let that = this;
      if (that.fun.isTextEmpty(this.recharge_search)) {
        Toast("用户ID不能为空");
        return;
      }
      if (this.nickname == '查无此用户') {
        Toast("查询不到该用户ID，请确认无误！");
        that.recharge_search = null;
        that.nickname = null;
        return;
      }
      let json = { recipient: this.recharge_search, record_id: this.presenter_data.item.id };

      $http.get("coupon.coupon-transfer.index", json, "处理中...").then(
        function (response) {
          that.showPresenter = false;
          that.recharge_search = null;
          that.nickname = null;
          if (response.result == 1) {
            if (that.wait_used.length > 0) {
              that.wait_used.splice(that.presenter_data.index, 1);
            }
            Toast("操作成功");
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    cancelP() {
      this.showPresenter = false;
      this.recharge_search = null;
      this.nickname = null;
    }
  },
  activated() {
    this.initData();
    this.toi = this.fun.getKeyByI();
    this.used = [];
    this.wait_used = [];
    this.overdue = [];
    this.selected = '1';

    this.getNetData(1, this.typesIndex);
  },
  mounted() { },
  components: { cTitle }
};
