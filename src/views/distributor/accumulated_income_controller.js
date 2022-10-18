import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: 0,
      dataList: [],
      titleArr: [],
      isLoadMore: true,
      dividend_text: null,//分红资格

      fh_dialog: false,

      shareholder_award_conditions_display:0
    };
  },
  created() {
    this.init();
    this.getSetName();
  },
  activated() {
  },
  methods: {
    init() {
      this.dividend_text = null;
      this.dataList = [];
      this.titleArr = [{
        name: '出货收入',
        url: 'plugin.channel.frontend.award.getShipmentList'
      }];
      this.isLoadMore = true;
    },
    getSetName() {
      let that = this;
      $http
        .post('plugin.channel.frontend.setting.index', {}, "").then(response => {
          if (response.result === 1) {
            let isOpenOption = response.data.open;
            this.shareholder_award_conditions_display = isOpenOption.shareholder_award_conditions_display;
            if (isOpenOption.is_open_recommend_award == 1) {
              //直推奖
              that.titleArr.push({
                name: response.data.recommend_award_name,
                url: 'plugin.channel.frontend.award.getRecommendList'
              });
            }

            if (isOpenOption.is_open_contribute_award == 1) {
              //贡献奖
              that.titleArr.push({
                name: response.data.contribute_award_name,
                url: 'plugin.channel.frontend.award.getContributeList'
              });
            }

            if (isOpenOption.is_open_service_award == 1) {
              //平级服务奖
              that.titleArr.push({
                name: response.data.service_award_name,
                url: 'plugin.channel.frontend.award.getServiceList'
              });
            }

            if (isOpenOption.is_open_equal_award == 1) {
              //平级奖
              that.titleArr.push({
                name: response.data.equal_award_name,
                url: 'plugin.channel.frontend.award.getEqualList'
              });
            }

            if (isOpenOption.is_open_surpass_award == 1) {
              //超越奖
              that.titleArr.push({
                name: response.data.surpass_award_name,
                url: 'plugin.channel.frontend.award.getSurpassList'
              });
            }

            if (isOpenOption.is_open_manage_award == 1) {
              //管理奖
              that.titleArr.push({
                name: response.data.manage_award_name,
                url: 'plugin.channel.frontend.award.getManageList'
              });
            }

            if (isOpenOption.is_open_shareholder_award == 1) {
              //管理奖
              that.titleArr.push({
                name: response.data.shareholder_award_name,
                url: 'plugin.channel.frontend.award.getShareholderList'
              });
            }

            if (isOpenOption.is_open_alike_level == 1) {
              //同级直推奖
              that.titleArr.push({
                name: response.data.alike_level_award_name,
                url: 'plugin.channel.frontend.award.getAlikeLevelList'
              });
            }

            if (isOpenOption.is_open_equal_alike_level == 1) {
              //同级直推平级奖
              that.titleArr.push({
                name: response.data.equal_alike_level_award_name,
                url: 'plugin.channel.frontend.award.getEqualAlikeLevelList'
              });
            }

            if (isOpenOption.is_open_direct_recommend == 1) {
              //直推推荐奖
              that.titleArr.push({
                name: response.data.direct_recommend_award_name,
                url: 'plugin.channel.frontend.award.getDirectRecommendList'
              });
            }
            console.log("titleArr:::", this.titleArr);
            this.setNewArr();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setNewArr() {
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: [],
          url: val.url
        });
      });
      console.log("dataList:::", this.dataList);
      this.handleClick();
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }

      $http
        .post(that.dataList[that.activeName].url, { page: 1 }, "").then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.list.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.list.data);
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
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false;// 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {};
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get(that.dataList[that.activeName].url, _json, "加载中").then((response) => {
          that.isLoadMore = true;
          that.dataList[that.activeName].isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.list.data;
            that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接
          } else {
            that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
            that.dataList[that.activeName].isLoadMore = false;
            that.isLoadMore = false;
          }
        },
        function (response) {
          // error callback
        }
        );
      }
    },
    getQualification() {
      //获取分红资格信息
      if (!this.fun.isTextEmpty(this.dividend_text)) {
        this.fh_dialog = true;
        return;
      }
      $http
        .get('plugin.channel.frontend.qualification.index', {}, "").then(response => {
          if (response.result === 1) {
            this.dividend_text = response.data;
            this.fh_dialog = true;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
