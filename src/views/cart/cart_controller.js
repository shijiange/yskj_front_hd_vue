// import { mapState } from "vuex";
import cTitle from "components/title";
import yzSpecs from "components/ui_components/yz_specs";
import gift from "components/goods/gift.vue";
import labels from "components/goods/labels.vue";
import selectGift from "components/goods/selectGift.vue";
import cartOverseas from './cart_overseas';
import { Toast } from 'vant';

const SUBMIT_ACTION_CART = "-1"; //添加到购物车
export default {
  data() {
    return {
      integral: window.localStorage.integral || '积分',
      showSelectGift: false, //选择赠品
      renderSelectGift: false, //选择赠品
      cartDelete: false, //切换编辑状态
      cartList: [], //购物车数据
      failureCartList: [], //失效商品数据
      total_goods_price: 0, //商品总价是优惠前的价格
      total_amount: 0, //合计总价
      total_discount_amount: 0, //优惠
      discount_amount_items: [], //选中购物车优惠项

      // goodData: {}, //单个商品数据=>规格弹窗
      // goods_option_id: '', //单个商品规格id
      // popupSpecs: false, //规格弹窗显示
      // showCouponList: false, //优惠券弹窗显示
      showCouponDetail: false, //优惠明细弹窗显示
      isShowList: false, //购物车商品显示
      checkAll: false, //全选
      rentIndex: -1, // 判断购物车是否有租赁商品

      //结算标识
      submitFlag: "",

      //配送方式
      showChoose: false,
      radioChoose: '',
      dispatch_types: [],
      chooseType: '', // 判断是否选中了租赁商品

      showMore: false,
      sharin_is_open: false, // 购物车分享
      vip_show:JSON.parse(window.localStorage.getItem("globalParameter")).vip_show?JSON.parse(window.localStorage.getItem("globalParameter")).vip_show:false,

      // 海外数据
      hasOverseasCard: false, // 是否有海外商品
      gift_goods_list: {
        'shop_id':[]
      }, //赠品商品列表
      gift_goods_num: [],  //赠品可选商品数量
      select_goods_title: '',  //选择赠品标题
      gift_goods_selected: [],  //赠品已选商品数量
      current_shop_id : 'shop_id', //当前商铺id
      current_marketing_id : 0, //当前活动id
      custom_gift: false, //自定义选择赠品，可以少选或不选
    };
  },
  activated() {
    this.initView(); //初始化数据
    this.getData(null, true);
    zhuge.track('进入购物车页面');
  },

  methods: {
    //初始化view
    initView() {
      this.cartDelete = false;

      this.cartList = [];
      this.failureCartList = [];
      this.total_goods_price = 0;
      this.total_amount = 0;
      this.total_discount_amount = 0;

      // this.goodData = {};
      // this.popupSpecs = false;
      // this.showCouponList = false;
      this.showCouponDetail = false;
      this.isShowList = false;
      this.checkAll = false;
      this.rentIndex = -1;

      this.submitFlag = '';
      this.showChoose = false;
      this.radioChoose = '';
      this.dispatch_types = [];
      this.chooseType= '';

      this.hasOverseasCard = false;
    },

    //获取失效购物车数据
    getFailureCart() {
      $http.get("cart.list.failure-cart").then((response) => {
        if (response.result === 1) {
          this.failureCartList = response.data || [];
        }
      },
      (response) => {
        console.log(response);
      });
    },

    //清空失效购物车数据
    clearFailureCart() {
      this.$dialog.confirm({ message: "确定清空失效商品吗？" })
        .then(() => {
          $http.get("cart.list.del-failure-cart").then((response) => {
            if (response.result === 1) {
              this.failureCartList = [];
              Toast("清空成功");
            }
          },
          (response) => {
            console.log(response);
          });
        }).catch(() => {
        });
    },

    _getCheckedCardIds(isArr){
      let cart_ids = [];
      _.each(this.cartList, function(item){
        _.each(item.carts,(it)=>{
          if(it.checked){
            cart_ids.push(it.cart_id);
          }
        });
        _.each(item.gift_carts,(it)=>{
          if(it.checked){
            cart_ids.push(it.cart_id);
          }
        });
      });
      if(isArr){
        return cart_ids;
      }
      return cart_ids.join(',');
    },
    _getPostData(){
      let data = [];
      _.each(this.cartList, function(item){
        _.each(item.carts,(it)=>{
          data.push({
            'id' : it.cart_id,
            'checked': it.checked
          });
        });
      });
      return data;
    },

    //获取购物车数据
    getData(flag, init) {
      let json = {
        carts: this._getPostData(),
        custom_gift: this.custom_gift
      };
      if(flag === 'delete') {
        // 获取购物车数量
        json.basic_info = 1;
      }
      $http.post("plugin.overseas.frontend.cart.index", json, "loading").then((response) => {
        if (response.result === 1) {
          this.sharin_is_open = response.data.sharin_is_open;
          this.total_discount_amount = response.data.total_discount_amount;
          this.discount_amount_items = response.data.discount_amount_items;
          this.total_amount = response.data.total_amount;
          this.total_goods_price = response.data.total_goods_price;
          this.cartList = response.data.list;
          this.checkChooseAll();
          this._initGiftGoodsList();
          if(!flag) {
            this.getFailureCart();
            this.allCheckListInit(this.cartList);
          }else if(flag === 'delete') {
            this.allCheckListInit(this.cartList,flag);
          }
          // flag === 'count' do nothing
        }else {
          Toast(response.msg);
          // this.isShowList = false;
        }
      },
      (response) => {
        console.log(response);
      });
    },

    //初始化全部数据
    allCheckListInit(data,flag) {
      if (flag == "delete" && data.length <= 0) {
        this.isShowList = false;
        this.cartDelete = !this.cartDelete;
        this.checkAll = false;
      }

      if (data.length) {
        for(let i=0;i<data.length;i++) {
          if(data[i].code === 'lease-toy') {
            this.rentIndex = i;
          }
        }
        //取得购物车全部数据
        this.isShowList = true;
      }
    },

    //点击全选
    allSelect(event) {
      console.log(this.cartDelete, event, "全选");
      if(event) {
        this.cartList = _.each(this.cartList, function(item){
          item.checked = true;
          if(_.isUndefined(item.carts)){
            return;
          }
          _.each(item.carts,(it)=>{
            it.checked = true;
          });
        });
        if(this.cartDelete){
          // 删除操作的时候
        }else {
          // 租赁和平台混合
          this.chooseType = 'buy';
        }
      }else {
        this.chooseType = '';
        this.cartList = _.each(this.cartList, function(item){
          item.checked = false;
          if(_.isUndefined(item.carts)){
            return;
          }
          _.each(item.carts,(it)=>{
            it.checked = false;
          });
        });
      }
      console.log(this.checkAll);
    },

    //选择单个店铺商品购买监听 变化会触发
    checkCart() {
      this.countCartView();
    },

    checkShopAll(val, c_index, shop) {
      console.log('checkShopAll', val, c_index, shop);
      if(this.cartList[c_index].disable) {
        return;
      }
      if(val) {
        _.each(shop.carts, cart=>{
          cart.checked = true;
        });
      }else {
        _.each(shop.carts, cart=>{
          cart.checked = false;
        });
      }
      console.log(val, c_index);
    },
    debouncedCheckCart: _.debounce(function () {
      this.checkCart();
    }, 200),
    //删除界面操作
    onCartDelete() {
      this.cartDelete = !this.cartDelete;
      this.chooseType = '';
      //清空数据
      this.checkAll = false;
      this.total_amount = 0;
      this.total_goods_price = 0;
      this.total_discount_amount = 0;
      _.each(this.cartList, shop=>{
        shop.checked = false;
        shop.disable = false;
        _.each(shop.carts, cart=>{
          cart.checked = false;
        });
      });
    },

    //删除商品
    deleteGoods() {
      if (this._getCheckedCardIds(true).length == 0) {
        Toast("请选择删除商品");
        return;
      }
      let json = {
        ids: this._getCheckedCardIds(),
      };
      $http.get("cart.list.destroy", json, "操作中").then(
        (response)=> {
          if (response.result == 1) {
            this.getData('delete');
          } else {
            Toast(response.msg);
          }
        },
        (response)=> {
          console.log(response);
        }
      );
    },

    // 检查配送方式是否冲突
    checkGoods() { 
      let cart_ids = this._getCheckedCardIds(true);
      zhuge.track('购物车点击国内产品结算',{
        '商品数量':cart_ids.length,
        '合计金额':this.total_amount
      });
      if (cart_ids.length == 0) {
        Toast("请选择结算商品");
        return;
      }

      if (cart_ids.length > 50) {
        Toast("最多一次性只能下单50个商品");
        return;
      }

      let url = "plugin.overseas.frontend.memberCart.checkout";
      $http.get(url, {cart_ids: cart_ids.join(',')}, "操作中").then(
        (response)=> {
          if (response.result == 1) {
            if(response.data.need_choose == 1) {
              this.dispatch_types = response.data.dispatch_types;
              this.showChoose = true;
            }else {
              this.submitGoods();
            }
          } else {
            Toast(response.msg);
          }
        },
        (response)=> {
          console.log(response);
        }
      );
    },
    toBuy() {
      this.submitGoods();
    },

    //提交订单
    submitGoods() {
      let _cart_ids = [];
      if (this.showChoose && !this.radioChoose) {
        Toast("请先选择配送方式");
        return;
      }

      if(this.showChoose) {
        // 配送方式有冲突
        for (let i = 0; i < this.dispatch_types[this.radioChoose].member_carts.length; i++) {
          _cart_ids.push(this.dispatch_types[this.radioChoose].member_carts[i].id);
        }
      }else {
        _cart_ids = this._getCheckedCardIds(true);
      }
      this.$router.push(
        this.fun.getUrl("goodsorder",{}, {
          tag: SUBMIT_ACTION_CART,
          cart_ids: _cart_ids.join(','),
          overseas: 0,
        })
      );
    },

    //跳转商品详情
    toGoodsInfo(goods) {
      if(goods.goods_option_id){
        this.$router.push(this.fun.getUrl("goods", { id: goods.goods_id,coid:goods.goods_option_id }));
      }else{
        this.$router.push(this.fun.getUrl("goods", { id: goods.goods_id }));
      }

    },

    // 供应商
    toShop(item) {
      if(item.merchant_id) {
        this.$router.push(this.fun.getUrl("SupplierShop",{id: item.merchant_id}));
      }
    },
    _initGiftGoodsList(){
      _.each(this.cartList, shop=>{
        // let gift_goods_id_list = _.chain(shop.carts).filter( cart => {
        //   return cart.is_gift;
        // }).map(cart=>{
        //   return cart.goods_id;
        // }).value();
        let gift_goods_id_list = _.map(shop.gift_carts, cart=>{
          return cart.goods_id;
        });
        if (_.isEmpty(shop.marketing)) {
          return;
        }
        if(_.isUndefined(shop.marketing.cart_detail.rule.goods_list)){
          return;
        }
        this.gift_goods_list[shop.shop_id] = _.map(shop.marketing.cart_detail.rule.goods_list, goods=>{
          if(gift_goods_id_list.includes(goods.id)){
            goods.checked = true;
          }else{
            goods.checked = false;
          }
          return goods;
        });
      });
      console.log(this.gift_goods_list);
    },
    _updateGiftGoodsList(item) {
      // let gift_goods_id_list = _.chain(item.carts).filter( cart => {
      //   return cart.is_gift;
      // }).map(cart=>{
      //   return cart.goods_id;
      // }).value();
      let gift_goods_id_list = _.map(item.gift_carts, cart=>{
        return cart.goods_id;
      });
      this.gift_goods_list[item.shop_id] = _.map(item.marketing.cart_detail.rule.goods_list, goods=>{
        if(gift_goods_id_list.includes(goods.id)){
          goods.checked = true;
        }else{
          goods.checked = false;
        }
        return goods;
      });
      console.log(this.gift_goods_list[item.shop_id], gift_goods_id_list);
      this.current_shop_id = item.shop_id;
      this.current_marketing_id = item.marketing.act_id;
    },

    // 凑单
    toSearch(item,btn) {
      if(btn.indexOf('选赠品') >= 0){
        this.gift_goods_num = !_.isUndefined(item.marketing.cart_detail.rule.goods_num) ? item.marketing.cart_detail.rule.goods_num : 0;
        this.showSelectGift = true;
        this.select_goods_title = '请选择赠品';
        this._updateGiftGoodsList(item);
        this.renderSelectGift = true;
        return ;
      }else if(btn.indexOf('元换购') >= 0){
        this.gift_goods_num = !_.isUndefined(item.marketing.cart_detail.rule.goods_num) ? item.marketing.cart_detail.rule.goods_num : 0;
        this.showSelectGift = true;
        this.select_goods_title = btn;
        this._updateGiftGoodsList(item);
        this.renderSelectGift = true;
        return ;
      }else if(['取消换购','取消赠品'].includes(btn)){
        this._removeGiftFromCart(item);
        return;
      }
      if(btn === ''){
        if (item.link) {
          this.$router.push(item.link);
        }else{
          this.$router.push(this.fun.getUrl("search", {}, {plugin_id: 1}));
        }
      }else{
        this.$router.push(item.marketing.cart_detail.link);
      }
    },

    closeSelectGift() {
      console.log('closeSelectGift');
      this.renderSelectGift = false;
    },

    //改变数量
    changeCount(goods) {
      if (goods.total < 0) {
        Toast("商品数量不能为负数");
        // 最少为1
        goods.total = 1;
        return;
      }

      let json = {
        id: goods.cart_id,
        num: goods.total,
      };
      $http.get("cart.list.updateNumV2", json, "").then(
        (response)=> {
          if (response.result === 1) {
            this.custom_gift = false;
            this.countCartView();
          } else {
            Toast(response.msg);
          }
        },
        (response)=> {
          console.log(response);
        }
      );
    },
    numberLeft(goods) {
      // console.log(this.cartList[c_index].carts[index].total);
      if (goods.total <= 1) {
        Toast("商品数量不能为负数或零");
        return;
      }
      goods.total = goods.total - 1;
      this.changeCount(goods);
    },

    numberRight(goods) {
      // this.cartList[c_index].carts[index].total = Number(this.cartList[c_index].carts[index].total) + 1;
      // if (this.cartList[c_index].carts[index].total >= 51) {
      //   Toast("该商品每周最多可购买50件");
      //   this.cartList[c_index].carts[index].total = 1;
      //   return;
      // }
      console.log(goods);
      goods.total += 1;
      this.changeCount(goods);
    },

    //计算总价格
    countCartView() {
      this.checkRent();
      // this.checkChooseAll();
      if(!this.cartDelete) {
        this.getData('count');
      }
    },
    _getAllCartLength(){
      let sum = 0;
      _.each(this.cartList, function(item) {
        sum += item.carts.length + item.gift_carts.length;
      });
      return sum;
    },
    // 判断是否全选
    checkChooseAll() {
      if(this.cartDelete) {
        // 删除操作的时候
        if(this._getAllCartLength() === this._getCheckedCardIds(true).length) {
          //判断全选
          this.checkAll = true;
        }else {
          this.checkAll = false;
        }
      }else {
        let alone_num = 0;
        _.each(this.cartList,item=>{
          if(item.is_alone){
            alone_num = alone_num + item.carts.length;
          }
        });
        console.log('checkall', this._getAllCartLength(), this._getCheckedCardIds(true).length);
        if (_.isNaN(this._getAllCartLength())) {
          console.log(this.cartList);
        }
        if((this._getAllCartLength() - alone_num) === this._getCheckedCardIds(true).length) {
          //判断全选
          this.checkAll = true;
        }else {
          this.checkAll = false;
        }
      }
    },

    // 判断是否选中了租赁商品
    checkRent() {
      if(this._getCheckedCardIds(true).length > 0) {
        if(this.rentIndex > -1) {
          this.chooseType = 'rent';
        }else {
          this.chooseType = 'buy';
        }
      }else {
        // 全部清空
        this.chooseType = '';
      }
    },
    toShowMore() {
      this.showMore = !this.showMore;
    },
    shareCartGood() {
      this.$router.push(this.fun.getUrl("CartShare"));
    },
    // 子组件透传给父级数据
    postMsg([key, value]) {
      this[key] = value;
    },
    _getGiftSelectedNum(){
      return _.sumBy(this.gift_goods_list[this.current_shop_id],goods => {
        return goods.checked ? 1 : 0;
      });
    },
    _addGiftSelected(gift_goods_id){
      _.each(this.gift_goods_list[this.current_shop_id], goods=>{
        if (_.eq(gift_goods_id , goods.id)) {
          goods.checked = true;
        }
      });
      console.log(this.gift_goods_list);
    },
    _removeGiftSelected(gift_goods_id){
      _.each(this.gift_goods_list[this.current_shop_id], goods=>{
        if (_.eq(gift_goods_id , goods.id)) {
          goods.checked = false;
        }
      });
    },
    _setGiftSelected(values){
      _.each(this.gift_goods_list[this.current_shop_id], goods=>{
        if(_.includes(values , goods.id)) {
          goods.checked = true;
        }else{
          goods.checked = false;
        }
      });
    },
    giftSelectChange(values){
      console.log(values, this.gift_goods_list[this.current_shop_id], this._getGiftSelectedNum());
      this._setGiftSelected(values);
    },
    giftSelectOk(){
      if(this._getGiftSelectedNum() <= 0){
        // Toast('请选择赠品');
        // return;
        this.custom_gift = true;
      }
      console.log(this._getGiftSelectedNum(), this.gift_goods_num);
      if(this._getGiftSelectedNum() < this.gift_goods_num){
        // Toast(this.gift_goods_list[this.current_shop_id].length+'个赠品任选'+this.gift_goods_num+'个');
        // return;
        this.custom_gift = true;
      }
      this._addGiftToCart();
    },
    _addGiftToCart(){
      //将赠品加入购物车
      let json = _.chain(this.gift_goods_list[this.current_shop_id]).filter(goods=>{
        return goods.checked;
      }).map(goods => {
        // console.log(goods);
        return {goods_id:goods.id, total:goods.num, option_id:goods.option_id, is_gift:1, marketing_id:this.current_marketing_id};
      }).value();
      $http.post("member.member-cart.gift-store", {marketing_id:this.current_marketing_id, data:json}, true).then(
        (response)=> {
          if (response.result === 1) {
            this.showSelectGift = false;
            this.countCartView();
          } else {
            Toast(response.msg);
          }
        },
        (response)=> {
          console.log(response);
        }
      );
    },
    _removeGiftFromCart(item){
      let ids = _.map(item.gift_carts, cart=>{
        return cart.cart_id;
      }).join(',');
      $http.get('member.member-cart.destroy', { ids }, true).then(response => {
        if (response.result == 1) {
          this.custom_gift = true;
          this.countCartView();
        } else {
          Toast(response.msg);
        }
      });
    }
    // openSpecs(item) {
    //   if(item.goods_option_title) {
    //     this.goods_option_id = item.goods_option_id;
    //     this.getGood(item.goods_id);
    //   }
    // },
    // close_yz_specs_popup(_optionsId, goodsCount, clicktype) {
    //   this.optionsId = _optionsId;
    //   this.goodsCount = goodsCount;
    //   this.popupSpecs = false;
    //   if (clicktype == 1) {
    //     //点击确认按钮
    //   }
    // },
    // //获取商品数据
    // getGood(id) {
    //   $http.post("plugin.overseas.frontend.goods.get-goods-page", {
    //     id: id,
    //   }, " ").then(
    //     (res)=> {
    //       if (res.result === 1) {
    //         this.goodData = res.data.get_goods;
    //         this.popupSpecs = true;
    //       }
    //     }, (res)=> {
    //       console.log(res);
    //     }
    //   );
    // },
  },
  components: { cTitle,yzSpecs, cartOverseas ,gift, selectGift, labels},
  computed: {
    cart_ids(){
      return this._getCheckedCardIds(true);
    },
  },
};
