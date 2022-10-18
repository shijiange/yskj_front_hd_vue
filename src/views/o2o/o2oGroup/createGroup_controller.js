import { Toast,Dialog } from "vant";

export default {
  data() {
    return {
      isLoadMore: true,
      page:1,
      total_page:0,
      disableds:false,
      titleText:'创建活动',
      kwd: "",
      show: false,
      showSearchGood: false,
      listOne: [],
      start_time: "",
      end_time: "",

      cat_level: 2, //分类等级 2级或者3级
      category1: 0,
      category2: 0,
      category1_disabled: false,
      category2_disabled: true,
      categoryOption1: [{ text: "不限分类", value: 0 }],
      categoryOption2: [{ text: "不限分类", value: 0, child: [] }],
      activeCategoryID: "",

      minDate: new Date(),
      showStartTime: false,
      currentStartTime: "",
      showEndTime: false,
      currentEndTime: "",

      goodradio: "",

      tab: "all",
      new_url: false, //新增活动弹出框
      step: 1, //下一步
      has_option: 0, //是否开启规格
      search_form: {},
      search_goods: {},
      category_list: [],
      goods_list: [],
      list: [],
      keywords: '',
      form: {},
      fight_groups_lottery_set: '',
      data: '',
      // has_many_options:has_many_options,//规格
      has_one_goods: '', //回显商品信息
      is_edit: '', //是否允许编辑
      //商品分页
      goods_total: 0,
      goods_per_size: 0,
      goods_current_page: 0,

      // 优惠券
      coupon_result: [],
      coupon_show: false,
      coupon_keyword: "",
      coupon_list: [],
      // choose_coupon_list:[],
      // 爱心值
      love_name: '',
      loves: '',
      is_open_integral: '',

      //门店
      store_show: false,
      store_list: [],
      store_keyword: "",
      store_obj: '',

      loading: false,
      table_loading: false,
      rules: {
        title: { required: true, message: "请输入活动标题" }
      }
    };
  },
  activated() {
    this.step = 1;
    if(this.$route.params.id){
      this.editData();
      this.disableds = true;
      this.titleText = '活动编辑';
      this.fun.setWXTitle('活动编辑');
    }else{
      this.initFun();
    }
  },
  deactivated(){
    // 重置data数据
    Object.assign(this.$data, this.$options.data());
  },
  methods: {
    showTextPopup(){
      Dialog.alert({
        message: '勾选此选项则手机端商品详情页底部仅展示“去参团”，不展示“一键开团”',
      }).then(() => {
        // on close
      });
    },
    showTextPopup1(){
      Dialog.alert({
        message: '参与过该活动一次的视为老用户，老用户只允许开团不允许参团。此场景适合设置特价商品，用于鼓励老用户开团，协助店铺拉新。',
      }).then(() => {
        // on close
      });
    },
    initFun(_editData){
      let _data = {
        fight_groups_lottery: false,
        keywords: {
          share_title: ["\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0", "\u5546\u54c1\u6700\u9ad8\u4ef7", "\u5546\u54c1\u6700\u4f4e\u4ef7"],
          share_content: ["\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0", "\u5546\u54c1\u6700\u9ad8\u4ef7", "\u5546\u54c1\u6700\u4f4e\u4ef7"],
          desc_title: [
            "\u56e2\u957f\u540d\u79f0",
            "\u62fc\u56e2\u65f6\u95f4\u5012\u8ba1\u65f6",
            "\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0",
            "\u5546\u54c1\u6700\u9ad8\u4ef7",
            "\u5546\u54c1\u6700\u4f4e\u4ef7",
            "\u62fc\u56e2\u4eba\u6570"
          ],
          desc_content: [
            "\u56e2\u957f\u540d\u79f0",
            "\u62fc\u56e2\u65f6\u95f4\u5012\u8ba1\u65f6",
            "\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0",
            "\u5546\u54c1\u6700\u9ad8\u4ef7",
            "\u5546\u54c1\u6700\u4f4e\u4ef7",
            "\u62fc\u56e2\u4eba\u6570"
          ]
        },
        loves: true,
        love_name: "\u7231\u5fc3\u503c",
        is_open_integral: false
      };
      let data = _editData?_editData: _data;
      let keywords = data.keywords;
      let love_name = data.love_name ? data.love_name : "";
      let loves = data.loves ? data.loves : false;
      let fight_groups_lottery_set = data.fight_groups_lottery_set ? data.fight_groups_lottery_set : false;
      let fight_groups_lottery_info = data.fight_groups_lottery_info ? data.fight_groups_lottery_info : {};
      let is_open_integral = data.is_open_integral ? data.is_open_integral : false;
      let store_obj = data.has_one_store_cashier ? data.has_one_store_cashier : {};

      if (fight_groups_lottery_set.open_type == 1 && fight_groups_lottery_info.is_open == undefined) {
        fight_groups_lottery_info.is_open = 1;
      }

      console.log(fight_groups_lottery_info.is_separate_rules);
      let form = {
        goods_id: "",
        goods_name: "",
        is_lead: 0,
        barrage: 0,
        hide_num: "1",
        setting: "",
        share_title: "原价￥<<商品最高价>>，现价￥<<商品最低价>>起，参加<<拼团活动名称>>即可享受",
        share_content: "活动商品数量有限，先到先得。",
        desc_title: "我已经参加了<<团长名称>>发起的拼团。",
        desc_content: "凑足<<拼团人数>>人即可享受拼团优惠，我已经参加，你也来吧。",
        has_many_level: [],
        has_many_options: [], //规格

        is_love: 0,
        love: "",
        is_balance: 0,
        balance: "",
        is_coupon: 0,
        fight_groups_lottery_info: fight_groups_lottery_info,

        coupon: [], //优惠券
        business_type: 1,
        store_id: this.$route.params.store_id,
        start_time:'',
        end_time:'',
        ...data
      };
      let has_one_goods = {};
      let is_edit = false;
      if (form.id) {
        if (form.start_time) {
          form.start_time = form.start_time * 1000;
        }
        if (form.end_time) {
          form.end_time = form.end_time * 1000;
        }
        has_one_goods = {
          ...form.has_one_goods
        };
        if (form.status == 1 || form.status == 0) {
          is_edit = true;
        }
      }

      this.keywords = keywords;
      this.form= form;
      this.fight_groups_lottery_set= fight_groups_lottery_set;
      this.data= data;
      this.has_one_goods= has_one_goods;
      this.is_edit= is_edit;
      this.love_name= love_name;
      this.loves= loves;
      this.is_open_integral= is_open_integral;
      this.store_obj= store_obj;
    },
    editData(){
      //获取活动数据
      $http
        .post("plugin.fight-groups.frontend.store.fight-groups-store.edit", { store_id: this.$route.params.store_id,id:this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            this.initFun(response.data);
            this.start_time = this.fun.timestampToTime(response.data.start_time);
            if(response.data.end_time){
              this.end_time = this.fun.timestampToTime(response.data.end_time);
            }
            //data = {"id":22,"uniacid":25,"goods_id":248,"title":"\u8fd9\u662f\u624b\u673a\u521b\u5efa\u7684\u95e8\u5e97\u62fc\u56e2","start_time":1614051690,"end_time":1614441600,"note":"","menu_show":0,"hide_num":1,"is_integral":0,"integral_num":0,"is_lead":0,"setting":5,"barrage":0,"share_title":"\u539f\u4ef7\uffe5<<\u5546\u54c1\u6700\u9ad8\u4ef7>>\uff0c\u73b0\u4ef7\uffe5<<\u5546\u54c1\u6700\u4f4e\u4ef7>>\u8d77\uff0c\u53c2\u52a0<<\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0>>\u5373\u53ef\u4eab\u53d7<<\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0>>","share_content":"\u6d3b\u52a8\u5546\u54c1\u6570\u91cf\u6709\u9650\uff0c\u5148\u5230\u5148\u5f97\u3002<<\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0>><<\u5546\u54c1\u6700\u4f4e\u4ef7>>","desc_title":"\u6211\u5df2\u7ecf\u53c2\u52a0\u4e86<<\u56e2\u957f\u540d\u79f0>>\u53d1\u8d77\u7684\u62fc\u56e2\u3002<<\u62fc\u56e2\u65f6\u95f4\u5012\u8ba1\u65f6>><<\u5546\u54c1\u6700\u4f4e\u4ef7>><<\u62fc\u56e2\u4eba\u6570>>","desc_content":"\u51d1\u8db3<<\u62fc\u56e2\u4eba\u6570>>\u4eba\u5373\u53ef\u4eab\u53d7\u62fc\u56e2\u4f18\u60e0\uff0c\u6211\u5df2\u7ecf\u53c2\u52a0\uff0c\u4f60\u4e5f\u6765\u5427\u3002<<\u62fc\u56e2\u65f6\u95f4\u5012\u8ba1\u65f6>><<\u5546\u54c1\u6700\u9ad8\u4ef7>><<\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0>>","status":1,"created_at":"2021-02-23 11:42:42","updated_at":"2021-02-23 11:43:02","deleted_at":null,"is_love":0,"love":0,"is_balance":0,"balance":0,"is_coupon":1,"coupon":[{"id":25,"name":"111","coupon_num":"1"}],"store_id":17,"plugin_id":0,"has_one_goods":{"id":248,"title":"\u95e8\u5e97\u5546\u54c1\u6d4b\u8bd5","thumb":"https:\/\/dev15.yunzmall.com\/static\/upload\/images\/25\/2020\/12\/i5L4hCACP9ZIoz4paP9o9pprfpE1o4.jpg","price":"100.00","stock":37,"sku":"\u4ef6","status_name":null},"has_many_options":[{"id":34,"group_id":22,"option_id":0,"option_price":"100.00","option_title":"\u5355\u89c4\u683c","stock":40,"buy_limit":0,"has_many_option_level":[{"id":49,"groups_option_id":34,"level_id":36,"group_price":"1.00","member_num":2},{"id":50,"groups_option_id":34,"level_id":37,"group_price":"2.00","member_num":3}]}],"has_many_level":[{"id":36,"group_id":22,"level_num":1,"member_num":2,"expire_in":48,"status":1},{"id":37,"group_id":22,"level_num":2,"member_num":3,"expire_in":72,"status":1}],"has_one_store_cashier":{"id":17,"thumb":"newimage\/a41cb0cf18515576c9e67bc02f12f2af.png","store_name":"\u5361\u5361-\u95e8\u5e97","full_address":" ","dispatch":null,"average_score":5,"order_total":133,"validity_status_name":"\u5165\u9a7b\u4e2d"},"business_type":2,"loves":true,"love_name":"\u7231\u5fc3\u503c","keywords":{"share_title":["\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0","\u5546\u54c1\u6700\u9ad8\u4ef7","\u5546\u54c1\u6700\u4f4e\u4ef7"],"share_content":["\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0","\u5546\u54c1\u6700\u9ad8\u4ef7","\u5546\u54c1\u6700\u4f4e\u4ef7"],"desc_title":["\u56e2\u957f\u540d\u79f0","\u62fc\u56e2\u65f6\u95f4\u5012\u8ba1\u65f6","\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0","\u5546\u54c1\u6700\u9ad8\u4ef7","\u5546\u54c1\u6700\u4f4e\u4ef7","\u62fc\u56e2\u4eba\u6570"],"desc_content":["\u56e2\u957f\u540d\u79f0","\u62fc\u56e2\u65f6\u95f4\u5012\u8ba1\u65f6","\u62fc\u56e2\u6d3b\u52a8\u540d\u79f0","\u5546\u54c1\u6700\u9ad8\u4ef7","\u5546\u54c1\u6700\u4f4e\u4ef7","\u62fc\u56e2\u4eba\u6570"]},"is_open_integral":false};
          } else {
            Toast(response.msg);
            this.$router.go(-1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    clickGoodRadio(data) {
      if(data.has_many_activity_goods_count >= 1){
        return;
      }
      this.goodradio = data;
      this.new_url = false;
      this.has_one_goods.title = data.title;
      this.has_one_goods.id = data.id;
      this.has_one_goods.thumb = data.thumb;
      this.has_one_goods.price = data.price;
      this.has_one_goods.stock = data.stock;
      this.has_one_goods.sku = data.sku;
      this.has_option = data.has_option; //是否开启规格
      if (this.has_option) {
        this.form.has_many_options = data.has_many_options; //规格
      } else {
        this.form.has_many_options = [];
      }
      // 规格价格数据处理

      // if(this.form.has_many_options.length>0) {
      if (this.has_option) {
        this.form.has_many_options.forEach((item, index) => {
          this.form.has_many_options[index].option_price = item.product_price;
          this.form.has_many_options[index].option_id = item.id;
          this.form.has_many_options[index].option_title = item.title;
          this.form.has_many_options[index].has_many_option_level = [];
          this.form.has_many_options[index].buy_limit = "0";
          this.form.has_many_options[index].stock = item.stock;
        });
      } else {
        this.form.has_many_options.push({ option_title: "单规格", option_price: data.price, stock: data.stock, buy_limit: "0", has_many_option_level: [] });
      }
      console.log(this.form.has_many_options);
      // 添加has_many_option_level
      // let arr =[];
      // this.form.has_many_options.map((item,index)=>{
      //     arr.push(Object.assign({},item,{has_many_option_level:[],buy_limit:"0",stock:item.stock}))
      // })
      // this.form.has_many_options=arr;

      this.form.goods_id = this.has_one_goods.id;
      this.form.goods_name = this.has_one_goods.title;

      this.showSearchGood = false;
    },
    confirmStartTime(value) {
      this.showStartTime = false;
      this.form.start_time = this.fun.getTimestamp(value);
      this.start_time = this.fun.timestampToTime(value / 1000);
    },
    confirmEndtTime(value) {
      this.showEndTime = false;
      this.form.end_time = this.fun.getTimestamp(value);
      this.end_time = this.fun.timestampToTime(value / 1000);
    },
    cancelEndtTime() {
      this.showEndTime = false;
      this.form.end_time = "";
      this.end_time = "";
    },
    initData() {
      this.kwd = "";
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;

      this.listOne = [];

      this.cat_level = 2; //分类等级 2级或者3级
      this.category1 = 0;
      this.category2 = 0;
      this.category1_disabled = false;
      this.category2_disabled = true;
      this.categoryOption2 = [{ text: "不限分类", value: 0, child: [] }];
    },
    showTime(tag){
      if(this.disableds){
        return;
      }
      if(tag == 1){
        this.showStartTime = true;
      }
      if(tag == 2){
        this.showEndTime = true;
      }
    },
    getCategoryOne() {
      if(this.disableds){
        return;
      }
      if (!this.fun.isTextEmpty(this.listOne)) {
        this.showSearchGood = true;
        return;
      }
      //获取一级分类列表
      $http
        .post("plugin.fight-groups.frontend.store.fight-groups-store.get-category", { store_id: this.$route.params.store_id }, "")
        .then(response => {
          if (response.result === 1) {
            this.showSearchGood = true;
            let category1_list = response.data;
            if (category1_list.length > 0) {
              category1_list.forEach((val, index) => {
                this.categoryOption1.push({
                  text: val.name,
                  value: val.id
                });
              });
              this.getChildCate(1, "", false);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCategorytwo(_cid, _open) {
      //获取一级分类的下级分类列表（二级三级）
      let that = this;
      this.categoryOption2 = [{ text: "不限分类", value: 0, child: [] }];
      this.category2 = 0;
      this.category2_disabled = true;
      if (_cid == 0) {
        return;
      }
      $http
        .post("plugin.fight-groups.frontend.store.fight-groups-store.get-category-json", { store_id: this.$route.params.store_id, parent_id: _cid, level: 2 }, "")
        .then(response => {
          if (response.result === 1) {
            let category2_list = response.data;
            if (category2_list.length > 0) {
              category2_list.forEach((val, index) => {
                that.categoryOption2.push({
                  text: val.name,
                  value: val.id
                });
              });
              if (_open) {
                this.category2_disabled = false;
                this.$refs.categoryShow2.toggle();
              }
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectCate1(value) {
      //一级分类发生变化触发
      this.kwd = "";
      if (value) {
        this.activeCategoryID = value;
        this.getCategorytwo(value, true);
        this.getChildCate();
      } else {
        console.log("不限一级分类");
        this.initData();
        this.activeCategoryID = "";
        this.getChildCate();
      }
    },
    selectCate2(value) {
      //二级分类发生变化触发
      if (value) {
        this.activeCategoryID = value;
        this.getChildCate();
      } else {
        console.log("不限二级分类");
        this.activeCategoryID = this.category1;
        this.getChildCate();
      }
    },
    getChildCate() {
      $http
        .post("plugin.fight-groups.frontend.store.fight-groups-store.search-goods", { store_id: this.$route.params.store_id, category: this.activeCategoryID, goods_name: this.kwd }, "")
        .then(response => {
          if (response.result === 1) {
            this.listOne = response.data.data;
            this.isLoadMore = response.data.last_page > 1?true:false;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMores(){
      this.page +=1;
      $http.get('plugin.fight-groups.frontend.store.fight-groups-store.search-goods', { store_id: this.$route.params.store_id, category: this.activeCategoryID, goods_name: this.kwd ,page:this.page}, "加载中").then((response) => {
        if (response.result === 1) {
          that.isLoadMore =  that.page >= response.data.total_page ?false:true;
          var myData = response.data.data;
          that.listOne = listOne.concat(myData); //数组拼接
        } else {
          this.page -=1;
          that.isLoadMore = true;
        }
      },
      function (response) {
        // error callback
      }
      );
    },
    // 新增层级
    addTier() {
      if(this.disableds){
        Toast("不可进行编辑修改");
        return;
      }
      if (this.form.has_many_level.length >= 3) {
        Toast("最多可设置3个阶梯");
        return;
      }
      this.form.has_many_level.push({
        level_num: this.form.has_many_level.length + 1,
        member_num: "",
        expire_in: ""
      });
    },
    delTier(index) {
      this.form.has_many_level.splice(index, 1);
      // 层级重新排序
      this.form.has_many_level.forEach((item, index1) => {
        item.level_num = index1 + 1;
      });
    },

    // 打开选择优惠券
    openCoupon() {
      this.searchCoupon(1);
      this.coupon_show = true;
    },
    // 搜索优惠券
    searchCoupon(tag) {
      var that = this;
      if (that.coupon_list.length > 0&&tag==1) {
        return;
      }
      $http
        .post("plugin.fight-groups.frontend.store.fight-groups-store.coupon", { store_id: this.$route.params.store_id, keyword: that.coupon_keyword }, "")
        .then(response => {
          if (response.result === 1) {
            that.coupon_list = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    chooseCoupon(item, index) {
      let is_true = true;
      this.form.coupon.some((item1, index1) => {
        if (item1.id == item.id) {
          is_true = false;
          this.form.coupon.splice(index1, 1);
          // console.log("删除sssssssssssssssssss", item.id, this.form.coupon)
          return true;
        }
      });
      if (is_true) {
        this.form.coupon.push({ id: item.id, name: item.name, coupon_num: "1" });
        // console.log("增加sssssssssssssssssss", item.id, this.form.coupon)
      }
      this.coupon_show = false;
    },
    // 删除优惠券
    delCoupon(index) {
      this.form.coupon.splice(index, 1);
      this.coupon_result.splice(index, 1);
    },
    onCloneCoupon() {
      this.coupon_show = false;
    },
    // 添加关键词
    addContent(name, index, x) {
      console.log(this.$refs[name]);
      // let ref = this.$refs[name];
      let words = "";
      if (x == 1) {
        words = "<<" + this.keywords.share_title[index] + ">>";
      }
      if (x == 2) {
        words = "<<" + this.keywords.share_content[index] + ">>";
      }
      if (x == 3) {
        words = "<<" + this.keywords.desc_title[index] + ">>";
      }
      if (x == 4) {
        words = "<<" + this.keywords.desc_content[index] + ">>";
      }
      console.log(words);
      this.insertInputTxt(name, words, x);
    },
    insertInputTxt(ref, words, x) {
      let name = "";
      // if(x==1||x==3){
      //     name = this.$refs[ref].$refs.input;
      // }
      // if(x==2||x==4){
      //     name = this.$refs[ref].$refs.textarea;
      // }
      name = this.$refs[ref].$refs.input;
      var startPos = name.selectionStart;
      console.log(startPos);
      var endPos = name.selectionEnd;
      if (startPos === undefined || endPos === undefined) return;
      var txt = name.value;
      var result = txt.substring(0, startPos) + words + txt.substring(endPos);
      name.value = result;
      name.focus();
      name.selectionStart = startPos + words.length;
      name.selectionEnd = startPos + words.length;
      console.log(name.value);
      this.form[ref] = name.value;
    },
    // 下一步
    next() {
      console.log(this.form);
      if (!this.form.title) {
        Toast("活动标题不能为空！");
        return false;
      }
      if (!this.has_one_goods.title) {
        Toast("请选择活动商品！");
        return false;
      }
      if (this.form.has_many_level.length == 0) {
        Toast("层级不能为空！");
        return false;
      }
      if (!this.form.start_time) {
        Toast("开始时间不能为空！");
        return false;
      }
      if (this.form.end_time && this.form.start_time >= this.form.end_time) {
        Toast("开始时间不能大于或者等于结束时间！");
        return false;
      }
      if (this.form.menu_show == 1) {
        if (this.form.hide_num < 1) {
          Toast("展示设置->可参的团数不能少于1");
          return false;
        }
      }

      this.form.has_many_level.some(item => {
        if (!item.member_num || !item.expire_in) {
          Toast("层级信息不完成！");
          return true;
        } else if (item.member_num == 1) {
          Toast("拼团人数不能为1");
          return true;
        } else {
          this.step = 2;
        }
        console.log(this.step);
      });
      // 添加层级价格
      if (!this.form.id) {
        if (this.has_option) {
          for (let i = 0; i < this.form.has_many_options.length; i++) {
            this.form.has_many_options[i].has_many_option_level = [];
          }
          for (let i = 0; i < this.form.has_many_options.length; i++) {
            for (let j = 0; j < this.form.has_many_level.length; j++) {
              this.form.has_many_options[i].has_many_option_level.push({ group_price: "", member_num: this.form.has_many_level[j].member_num });
            }
          }
          console.log(this.form);
        } else {
          this.form.has_many_options[0].has_many_option_level = [];
          for (let j = 0; j < this.form.has_many_level.length; j++) {
            this.form.has_many_options[0].has_many_option_level.push({ group_price: "0", member_num: this.form.has_many_level[j].member_num });
          }
        }
      }
    },
    last() {
      this.step = 1;
    },
    submitForm() {
      var that = this;
      that.loading = true;
      // if(this.form.start_time) {
      //     this.form.start_time = this.form.start_time/1000;
      // }
      // if(this.form.end_time) {
      //     this.form.end_time = this.form.end_time/1000;
      // }
      delete this.form.goods_name;
      delete this.form.loves;
      delete this.form.love_name;

      //手机端创建门店拼团活动暂时没有拼团奖励对接  start
      delete this.form.is_open_integral;
      delete this.form.fight_groups_lottery;
      delete this.form.fight_groups_lottery_info;
      //手机端创建门店拼团活动暂时没有拼团奖励对接  end

      // this.form.goods_id = this.form.has_one_goods.id;
      // this.form.goods_name = this.form.has_one_goods.title;
      // delete(this.form.has_one_goods);
      console.log(this.form);
      $http
        .post("plugin.fight-groups.frontend.store.fight-groups-store.save", { form_data: that.form }, "")
        .then(response => {
          if (response.result === 1) {
            Toast("保存成功！");
            that.$router.push(that.fun.getUrl("o2oGroupActivitylist", { store_id: that.$route.params.store_id }));
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {}
};
