import { Toast } from 'vant';
import cTitle from 'components/title';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      showPopup1: false,
      showPoster: false,
      poster_thumb_sy: '',//收益提醒二维码
      poster_text_sy: '',//收益提醒文字
      image_url: '',//分享的海报
      activeName: Number(this.$route.query.index) || 0,
      active: '',
      dataList: [],
      titleArr: [],
      merchanrTitle: [],//招商标签页
      showDetail: true,
      countNum_name: '我的客户',
      countOrder_name: '分销订单',
      wxJsSdkConfig: null,
      isLoadMore: true
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  mounted() { },
  methods: {
    init() {
      this.titleArr = [];
      this.dataList = [];
      this.merchanrTitle = [];
      this.wxJsSdkConfig = null;
      this.isLoadMore = true;
    },
    gotoMember() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("member"));
      } else {
        this.$router.go(-1);
      }
    },
    getData() {
      $http
        .post('plugin.ranking.api.index.index', {}, "").then(response => {
          if (response.result === 1) {
            let _data = response.data.getSet;
            this.poster_thumb_sy = _data.thumb || '';
            this.poster_text_sy = _data.title || '';
            if (_data.area_dividend == '1') {
              this.setNewArr(_data.area_dividend_title, 'areaDividend');
            }
            if (_data.commission == '1') {
              this.setNewArr(_data.commission_title, 'commission', _data.commission_order);
            }
            if (_data.micro == '1') {
              this.setNewArr(_data.micro_title, 'micro');
            }
            if (_data.room == '1') {
              this.setNewArr(_data.room_title, 'room');
            }
            if (_data.team_dividend == '1') {
              this.setNewArr(_data.team_dividend_title, 'teamDividend');
            }
            if (_data.staffLevel == '1' || _data.merchantLevel == '1') {
              this.setNewArr("招商", 'Merchants');
            }
            // 招商 ----start-----
            if (_data.staffLevel == '1') {
              this.merchanrTitle.push({ name: '招商员', type: 'staffLevel' });
            }
            if (_data.merchantLevel == '1') {
              this.merchanrTitle.push({ name: '招商中心', type: 'merchantLevel' });
            }
            // 招商 ----end-----
            // console.log(this.titleArr)
            // console.log(this.dataList)
            this.handleClick(false);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setNewArr(_title, _type, _orderName) {
      //设置标题数组和生成当前每一个标签页的初始化数据
      this.titleArr.push(_title);
      this.dataList.push({
        isLoadMore: true,
        page: 1,
        total_page: 0,
        plugin_type: _type,
        list: [],
        member_amount: {},
        info: {},
        variable: '',
        orderName: _orderName
      });
    },
    setDetail_info() {
      let that = this;
      let _isShowDetailArr = ['commission', 'teamDividend', 'Merchants'];//数组，显示查看详情模块标识
      this.showDetail = _isShowDetailArr.indexOf(this.dataList[this.activeName].plugin_type) > -1 ? true : false;//当前标识包含在_isShowDetailArr数组时显示详情模块

      switch (this.dataList[this.activeName].plugin_type) {
      case 'commission':
        that.countNum_name = '我的客户';
        that.countOrder_name = this.dataList[this.activeName].orderName ? this.dataList[this.activeName].orderName : '分销订单';
        break;
      case 'teamDividend':
        that.countNum_name = '我的客户';
        that.countOrder_name = '团队业绩';
        break;
      case 'Merchants':
        that.countNum_name = '我的供应商';
        that.countOrder_name = '我的门店';
        break;
      default:
        that.countNum_name = '我的';
        that.countOrder_name = '订单';
        break;
      }
    },
    handleClick(_isQuest) {
      this.setDetail_info();
      let that = this;
      if (!this.fun.isTextEmpty(this.wxJsSdkConfig)) {
        this.share(this.wxJsSdkConfig);
      }
      if (!_isQuest && !this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }
      let _type = null;
      if (that.dataList[that.activeName].plugin_type != 'Merchants') {
        //非招商
        _type = that.dataList[that.activeName].plugin_type;
      } else {
        // 招商
        console.log("active:::", that.active);
        _type = that.active;
      }
      $http
        .post('plugin.ranking.api.index.index', { getSwitch: 'getSwitch', plugin_type: _type }, "").then(response => {
          if (response.result === 1) {
            let _info = response.data.getSwitch;
            that.isLoadMore = true;
            that.$set(that.dataList[that.activeName], "isLoadMore", true);
            that.$set(that.dataList[that.activeName], "total_page", response.data.getSwitch.rankingCommission.last_page);
            if (!that.dataList[that.activeName].total_page) {
              that.$set(that.dataList[that.activeName], "total_page", 0);
              that.dataList[that.activeName].total_page = 0;
            }
            that.$set(that.dataList[that.activeName], "list", response.data.getSwitch.rankingCommission.data);
            delete _info.rankingCommission;
            if (!_info.hasOwnProperty('status')) {
              // 已经申请过才返回
              that.$set(that.dataList[that.activeName], "member_amount", response.data.getSwitch.information);
              delete _info.information;
            } else {
              //还没申请
              that.$set(that.dataList[that.activeName], "variable", response.data.getSwitch.text);
            }
            that.$set(that.dataList[that.activeName], "info", _info);
            // that.initShare();
            that.fun.wxShare(
              "",
              { },
              {
                title: '排行榜邀请',
                link:document.location.href + '&index=' + that.activeName,
                description: `邀请您进入排行榜`
              }
            );
          } else {
            that.$dialog.alert({message:response.msg});

          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      if(!that.dataList[that.activeName]) {
        return;
      }
      that.dataList[that.activeName].isLoadMore = false; // 防止多次请求分页数据
      that.isLoadMore = false;// 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        that.dataList[that.activeName].isLoadMore = false;
      } else {
        let _json = {
          getSwitch: 'getSwitch',
        };
        if (that.dataList[that.activeName].plugin_type != 'Merchants') {
          //非招商
          _json.plugin_type = that.dataList[that.activeName].plugin_type;
        } else {
          // 招商
          console.log("active:::", that.active);
          _json.plugin_type = that.active;
        }
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;

        _json.page = that.dataList[that.activeName].page;
        $http.get('plugin.ranking.api.index.index', _json, "加载中").then((response) => {
          that.isLoadMore = true;
          that.dataList[that.activeName].isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.getSwitch.rankingCommission.data;
            that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接
          } else {
            that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
            that.dataList[that.activeName].isLoadMore = false;
            that.isLoadMore = false;
          }
        });
      }
    },
    gotoApply(_type) {
      // 去申请
      // 经销商没有申请
      let _URLName = null;
      switch (_type) {
      case 'commission':
        _URLName = 'ExtensionApply';//推广申请
        break;
      case 'teamDividend':
        _URLName = 'ExtensionApply';
        break;
      case 'Merchants':
        _URLName = 'enterprise_apply';
        break;
      case 'micro':
        _URLName = 'microShop_apply';
        break;
      case 'room':
        _URLName = 'anchorApply';
        break;
      case 'areaDividend':
        _URLName = 'applyRegionalAgency';
        break;
      default:
        console.log("error::没有获取到_type");
        break;
      }
      if (_URLName) {
        this.$router.push(this.fun.getUrl(_URLName, {}));
      }
    },
    gotoDetail(_type) {
      let _URLName = null;
      switch (_type) {
      case 'commission':
        _URLName = 'distribution';
        break;
      case 'teamDividend':
        _URLName = 'teamAgentCenter';
        break;
      case 'Merchants':
        _URLName = 'enterprise_index';
        break;
      case 'micro':
        _URLName = 'microShop_ShopKeeperCenter';
        break;
      case 'room':
        _URLName = 'liveDividend';
        break;
      case 'areaDividend':
        _URLName = 'regionalAgencyCenter';
        break;
      default:
        console.log("error::没有获取到_type");
        break;
      }
      if (_URLName) {
        this.$router.push(this.fun.getUrl(_URLName, {}));
      }
    },
    getPoster() {
      //获取海报
      this.image_url = null;
      let _plugin_type = null;
      if (this.dataList[this.activeName].plugin_type != 'Merchants') {
        //非招商
        _plugin_type = this.dataList[this.activeName].plugin_type;
      } else {
        // 招商
        _plugin_type = this.active;
      }
      $http
        .post('plugin.ranking.api.poster.generateGoodsPoster', { getSwitch: 'getSwitch', plugin_type: _plugin_type, id: this.activeName }, "").then(response => {
          if (response.result === 1) {
            this.image_url = response.data.image_url;
            this.showPoster = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //初始化分享设置
    initShare() {
      let json = { url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            this.wxJsSdkConfig = response.data;
            this.share(this.wxJsSdkConfig);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        let _title = '排行榜邀请';
        let _link = document.location.href + '&index=' + that.activeName;
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = data.share.icon;
        let _desc = `邀请您进入排行榜`;
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast('分享成功');
          },
          cancel: function () {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            Toast('分享成功');
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
      });
    },
  },
  components: { cTitle }
};