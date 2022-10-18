import cTitle from 'components/title';
import { scrollMixin } from "utils/mixin";
import { Toast } from 'vant';
import Modal from "components/modal";


var currentTabIndex = "0";

//标记 防止重复加载
var is_first_content = false;
var is_second_content = false;
var is_third_content = false;
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      name:'',
      agent:{},
      isShowClient:false,
      title1:'',
      title2:'',
      title3:'',
      WeChat:'',
      phone:'',
      realname:'',
      //客户数据统计
      customer_num: '',
      total_customer: '',
      customer_order: '',
      total_order: '',
      //我的推荐人
      myReferral: "",
      //我推荐的人
      // 推荐人微信、手机号是否显示
      is_recommend_wechat:0,
      // 推荐人的上级
      my_referral_parents:{},
      show_parents:0,//是否显示推荐人的上级
      // 我的信息
      self_info:'',

      total: 0,
      level1: '',
      level2: '',
      level3: '',

      activeName: "first",
      first_content: [],
      second_content: [],
      third_content: [],

      keyword: "",
      level: "",
      relationLevel: "",
      last_page:'',
      iswechat:'',
      isphone:'',
      sort: 10000,


      show2: false,

      filterData: [], //筛选数据
      filterSort: -1,
      filterLevelData: [],
      filterLeveSort: -1,
      level1_page: 0,
      level2_page: 0,
      level3_page: 0,

      btnShow1: true,
      btnShow2: true,
      btnShow3: true,
      keyword1:'',
      keyword2:'',
      keyword3:'',

      //微信弹窗
      showModal: false, // 控制弹窗显示
      mdTitle: '', // 弹窗标题
      mdTips: " " , // 弹窗底部提示
      mdValue: "", // 弹窗内容，电话或者微信号
      mdType: "Wechat",        // 目前只有微信, 可暂时不传

      new_content:[],

      is_link: false,//是否能跳转至客户数量页面

      my_achievement:false,
      //加载更多
      isLoadMore: false,
      total_page: 0,
      page: 1
    };
  },
  methods: {

    // 控制弹窗显示的方法
    handleToggle: function(item){
      this.showModal = !this.showModal;

      // 判断是微信，修改data值
      if(item){
        this.mdTitle = item.nickname+"的微信号";
        this.mdTips = "点击复制客户微信,通过微信添加朋友可加客户好友!";
        this.mdValue = item.wechat.toString();
      }
    },
    toggle(event, n) {
      if (n == this.sort) {
        this.sort = 9999;
        return;
      } else {
        this.sort = n;
      }

    },

    initData() {
      currentTabIndex = "0";

      is_first_content = false;
      is_second_content = false;
      is_third_content = false;

      this.myReferral = "";
      this.is_recommend_wechat = 0;
      this.my_referral_parents = {};
      this.self_info = '';
      this.total = 0;
      this.level1 ={ level: "一级", total: 0 };
      this.level2 = { level: "二级", total: 0 };
      this.level3 = { level: "三级", total: 0 };

      this.activeName = "first";
      this.first_content = [];
      this.second_content = [];
      this.third_content = [];

      this.keyword = "";
      this.level = "";
      this.relationLevel = "";

      this.sort = 10000;

      this.show2 = false;
      this.filterData = [];
      this.filterLevelData = [];

      this.filterSort = -1;
      this.filterLeveSort = -1;

      this.isShowClient=false;

      this.show_parents = 0;

      // this.level1_page=0;
      // this.level2_page=0;
      // this.level3_page=0;

    },

    pageInit() {
      this.level1_page = 0;
      this.level2_page = 0;
      this.level3_page = 0;
      this.first_content = [];
      this.second_content = [];
      this.third_content = [];
      this.btnShow1 = true;
      this.btnShow2 = true;
      this.btnShow3 = true;

      this.keyword1 = '';
      this.keyword2 = '';
      this.keyword3 = '';
            
    },

    //我的推荐人
    getMyRelation() {
      var that = this;
      $http.get('member.member.get-member-list', {}, "").then(function (response) {
        if (response.result == 1) {
          that.my_achievement = response.data.my_achievement;
          that.myReferral = response.data.my_referral;
          that.my_referral_parents = response.data.my_referral_parents;
          that.is_recommend_wechat = that.myReferral.is_recommend_wechat;
          that.self_info = that.myReferral.self?that.myReferral.self:{};
          that.title1= that.myReferral.name1;
          that.title2= that.myReferral.name2;
          that.title3= that.myReferral.name3;
          that.WeChat=parseInt( that.myReferral.wechat);
          that.phone=parseInt( that.myReferral.phone);
          that.realname=parseInt(that.myReferral.realname);
          that.isShowClient= that.myReferral.is_show == "1"?true:false;
          // that.customer_num=response.data.child_total
          that.getMyAgentBaseInfo(response.data.my_agent);
          that.isLoadMore= true;
          that.total_page= 0;
          that.page= 1;

          that.new_content = [];
          that.is_link = response.data.is_link || false;
          that.getData(response.data.agent_data);
        } else {
          Toast(response.msg);
        }
      }, function (response) {

      });
    },
		
    goMarket(id){
      //会员概况优先于我的市场
      if(this.is_link) {
        this.$router.push(this.fun.getUrl('MyRelationshipDetail',{uid:id}));
      }
      if(!this.my_achievement) return;
      this.$router.push(this.fun.getUrl('myMarket',{},{marketId:id}));
    },
    gotoMemberDetail(id){
      if(this.is_link) {
        this.$router.push(this.fun.getUrl('MyRelationshipDetail',{uid:id}));
      }
    },

    // //我推荐的人基本信息
    getMyAgentBaseInfo(data) {
      var that = this;
      // $http.get('member.member.getMyAgent_v2', {}, "").then(function (response) {
      //     console.log(response,'打印response')
      //     if (response.result == 1) {
      that.total = data.total;
      that.level1 = data.level1;
      that.level2 = data.level2;
      that.level3 = data.level3;
      if (!that.fun.isTextEmpty(that.level1) && that.level1.is_show) {
        that.activeName = "first";
        currentTabIndex = "0";
        that.setDataByTabIndex();//获取数据
        return;
      }

      if (!that.fun.isTextEmpty(that.level2) && that.level2.is_show) {
        that.activeName = "second";
        currentTabIndex = "1";
        that.setDataByTabIndex();//获取数据
        return;
      }

      if (!that.fun.isTextEmpty(that.level3) && that.level3.is_show) {
        that.activeName = "third";
        currentTabIndex = "2";
        that.setDataByTabIndex();//获取数据
        return;
      }

      //     }
      // }, function (response) {
      //
      // });
    },

    openPop() {
      if (this.filterData.length == 0) {
        this.getFilterData();
      }
      this.show2 = true;
    },
    closePop() {
      this.show2 = false;
    },

    //获取筛选数据
    getFilterData() {
      var that = this;
      let json = {};
      $http.get('member.member.memberRelationFilter', json, "").then(function (response) {
        if (response.result == 1) {
          that.filterData = response.data;
          if (that.filterData.length > 0) {
            that.filterLevelData = that.filterData[0].level;
          }
        }
      }, function (response) {
        // error callback
      });
    },
    // 搜索
    search() {
      let that = this;
      var page = 1;
      let keyword = '';
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      switch (currentTabIndex) {
      case "0":
        that.relationLevel = "1";
        page = 1;
        that.level1_page = page;
        that.btnShow1 = true;
        keyword = that.keyword1;
        break;
      case "1":
        that.relationLevel = "2";
        page = 1;
        that.level2_page = page;
        that.btnShow2 = true;
        keyword = that.keyword2;
        break;
      case "2":
        that.relationLevel = "3";
        page = 1;
        that.level3_page = page;
        that.btnShow3 = true;
        keyword = that.keyword3;
        break;

      default:


        break;
      }
      console.log(that.level,'打印that.level');
      let json = {
        "relationLevel": this.relationLevel,
        "page": page,
        "keyword": keyword,
        "level": that.level,
        "current_page":page,
        "last_page":this.last_page,
      };
      $http.get('member.member.getMyAgentData_v2&relationLevel=1', json, "").then(function (response) {
        if (response.result === 1) {
          that.new_content = [];
          that.new_content = response.data.data;
          that.total_page = response.data.last_page;
          that.page = response.data.current_page;
          switch (currentTabIndex) {
          case "0":
            that.level1.total = response.data.total;
            break;
          case "1":
            that.level2.total = response.data.total;
            break;
          case "2":
            that.third_content = response.data.data; 
            break;
          default:
            break;
          }

        } else {
          console.log(response.msg);
        }
      }, function (response) {
        // error callback
      });
    },
        
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },

    //设置选择后的数据
    setDataByTabIndex(flag) {
      if (currentTabIndex == "0" && !is_first_content) {
        is_first_content = true;
        this.relationLevel = "1";

        if (flag) {
          this.getData();
        }
      } else if (currentTabIndex == "1" && !is_second_content) {
        is_second_content = true;
        this.relationLevel = "2";
        if (flag) {
          this.getData();
        }
      } else if (currentTabIndex == "2" && !is_third_content) {
        is_third_content = true;
        this.relationLevel = "3";
        if (flag) {
          this.getData();
        }
      }
    },

    //tab 点击
    handleClick(tab, event) {
      // let name = tab.name;
      /*因修改组建改方法*/
      let name = this.activeName;
      let index = '';
      switch (name) {
      case "first":
        index = "0";
        break;
      case "second":
        index = "1";
        break;
      case "third":
        index = "2";
        break;

      default:
        break;
      }
      //点击同tab 不刷新界面
      if (currentTabIndex == index) {
        return;
      } else {
        currentTabIndex = index;
      }

      this.search();
      // this.setDataByTabIndex(true);
    },

    //筛选切换子数据
    filterDataHandle(item, index) {
      if (index == this.filterSort) {
        return;
      }
      this.filterLevelData = item.level;
      this.filterSort = index;
      this.keyword = item.role; //赋值选则

      this.filterLeveSort = -1; //清空子选择
      this.level = ''; //清空子数据 等级
    },

    //子数据选择
    filterLevelDataHandle(item, index) {
      if (index == this.filterLeveSort) {
        return;
      }
      this.filterLeveSort = index;
      this.level = item.id;
    },

    //根据筛选获取数据
    filterGetData() {

      this.closePop();
      this.pageInit();
      this.getData();
    },
    //加载数据
    // getData(data) {
    //     var that = this;
    //     var content = "";
    //     var page = 0;
    //     var level_content = [];
    //     //var appendto
    //     switch (currentTabIndex) {
    //         case "0":
    //             that.relationLevel = "1";
    //             page = that.level1_page + 1;
    //             that.level1_page = page;
    //             break;
    //         case "1":
    //             that.relationLevel = "2";
    //             page = that.level2_page + 1;
    //             that.level2_page = page;
    //             break;
    //         case "2":
    //             that.relationLevel = "3";
    //             page = that.level3_page + 1;
    //             that.level3_page = page;
    //             break;

    //         default:


    //             break;
    //     }
    //     console.log(that.level,'打印that.level');
    //     let json = {
    //         "relationLevel": this.relationLevel,
    //         "page": page,
    //         "keyword": this.keyword,
    //         "level": that.level,
    //         "current_page":page,
    //         "last_page":this.last_page,
    //     };

    //     if (data && data.data) {
    //       if (page >= data.last_page) {
    //         that.hidebutton();
    //       }

    //       if (that.fun.isTextEmpty(data)) {
    //         that.hidebutton();

    //       }

    //       if (data.data.length == 0) {
    //         that.hidebutton();
    //       }
    //       switch (currentTabIndex) {
    //         case "0":
    //           that.first_content = that.first_content.concat(data.data); //数组拼接
    //           break;
    //         case "1":
    //           that.second_content = that.second_content.concat(data.data); //数组拼接
    //           break;
    //         case "2":
    //           that.third_content = that.third_content.concat(data.data); //数组拼接
    //           break;
    //         default:
    //           break;
    //       }
    //     } else {
    //       $http.get('member.member.getMyAgentData_v2&relationLevel=1', json, "").then(function (response) {
    //         if (response.result === 1) {
    //           // var dataArr=response.data.data
    //           // dataArr=dataArr.map(value=>{
    //           //     value.createtime=moment(value.createtime).format('YYYY-MM-DD hh:mm');
    //           //     return value;
    //           //     console.log(value.createtime)
    //           // })
    //           //this.btnShow[level]=false;
    //           if (page >= response.data.last_page) {
    //             that.hidebutton();
    //           }

    //           if (that.fun.isTextEmpty(response.data)) {
    //             that.hidebutton();

    //           }

    //           if (response.data.data.length == 0) {
    //             that.hidebutton();
    //           }
    //           switch (currentTabIndex) {
    //             case "0":
    //               that.first_content = that.first_content.concat(response.data.data); //数组拼接
    //               break;
    //             case "1":
    //               that.second_content = that.second_content.concat(response.data.data); //数组拼接
    //               break;
    //             case "2":
    //               that.third_content = that.third_content.concat(response.data.data); //数组拼接
    //               break;
    //             default:
    //               break;
    //           }

    //         } else {
    //           console.log(response.msg);
    //         }
    //       }, function (response) {
    //         // error callback
    //       });
    //     }

    // },
    getData(data) {
      var that = this;
      // var content = "";
      var page = 0;
      // var level_content = [];
      //var appendto
      switch (currentTabIndex) {
      case "0":
        that.relationLevel = "1";
        page = that.level1_page + 1;
        that.level1_page = page;
        break;
      case "1":
        that.relationLevel = "2";
        page = that.level2_page + 1;
        that.level2_page = page;
        break;
      case "2":
        that.relationLevel = "3";
        page = that.level3_page + 1;
        that.level3_page = page;
        break;

      default:


        break;
      }
      // console.log(that.level,'打印that.level');
      let json = {
        "relationLevel": this.relationLevel,
        "page": page,
        "keyword": this.keyword,
        "level": that.level,
        "current_page":page,
        "last_page":this.last_page,
      };

      if (data && data.data) {
        if (page >= data.last_page) {
          that.hidebutton();
        }

        if (that.fun.isTextEmpty(data)) {
          that.hidebutton();

        }

        if (data.data.length == 0) {
          that.hidebutton();
        }
        that.page = data.current_page;
        that.total_page = data.last_page;
        that.new_content = data.data;
      } else {
        $http.get('member.member.getMyAgentData_v2&relationLevel=1', json, "").then(function (response) {
          if (response.result === 1) {
            that.new_content = response.data.data;
            that.page = response.data.current_page;
            that.total_page = response.data.last_page;
          } else {
            console.log(response.msg);
          }
        }, function (response) {
          // error callback
        });
      }

    },
    goBtn(x) {
      this.show_parents = x;
    },
    hidebutton() {
      switch (currentTabIndex) {
      case "0":
        this.btnShow1 = false;
        break;
      case "1":
        this.btnShow2 = false;
        break;
      case "2":
        this.btnShow3 = false;
        break;
      default:

        break;
      }
    },
    // 加载更多
    getMoreData() {
      const that = this;
      var page = 1;
      let keyword = '';
      switch (currentTabIndex) {
      case "0":
        that.relationLevel = "1";
        page = 1;
        that.level1_page = page;
        that.btnShow1 = true;
        keyword = that.keyword1;
        break;
      case "1":
        that.relationLevel = "2";
        page = 1;
        that.level2_page = page;
        that.btnShow2 = true;
        keyword = that.keyword2;
        break;
      case "2":
        that.relationLevel = "3";
        page = 1;
        that.level3_page = page;
        that.btnShow3 = true;
        keyword = that.keyword3;
        break;

      default:


        break;
      }
      let json = {
        "relationLevel": this.relationLevel,
        "page": page,
        "keyword": keyword,
        "level": that.level,
        "current_page":page,
        "last_page":this.last_page,
      };
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get('member.member.getMyAgentData_v2&relationLevel=1', json, "").then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            that.new_content = that.new_content.concat(response.data.data);
          } else {
            console.log(response.msg);
            // that.isLoadMore = false;
            this.page--;
          }
        }, function (response) {
          // error callback
          this.page--;
        });
    
      }
    },
    gotoList(type) {
      if(this.is_link) {
        this.$router.push(this.fun.getUrl('MyRelationshipAmount',{type:type}));
      }
    },
  },
  computed:{
    labelValue1(){
      return `${this.title1 || this.level1.level}(${this.level1.total}人)`;
    },
    labelValue2(){
      return `${this.title2 || this.level2.level}(${this.level2.total}人)`;
    },
    labelValue3(){
      return `${this.title3 || this.level3.level}(${this.level3.total}人)`;
    }
  },
  activated() {
    setTimeout(() => {
      this.agent=JSON.parse(window.localStorage.getItem('mailLanguage')).agent?JSON.parse(window.localStorage.getItem('mailLanguage')).agent:{};      
      this.name=JSON.parse(window.localStorage.getItem('mailLanguage')).agent&&JSON.parse(window.localStorage.getItem('mailLanguage')).agent.agent?JSON.parse(window.localStorage.getItem('mailLanguage')).agent.agent:'客户';
      this.$forceUpdate();
      this.fun.setWXTitle(this.name);
    }, 2000);
    this.initData(); //初始化参数
    this.pageInit();
    this.getMyRelation();
    // this.getMyAgentBaseInfo();
    // this.getData()
  },
  components: {
    cTitle,
    modal:Modal,
  }
};
