import { scrollMixin } from "../../../utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
import loading from "components/loading";
export default {
  mixins: [scrollMixin], //加载更多
  components: { yzBlank, loading },
  data() {
    return {
      tabIndex: 0,
      tabArray: [{ name: "全部" }, { name: "已结算" }, { name: "未结算" }, { name: "无效" }],

      //查询开始日期
      startTimeShow: false,
      startTimeModel: new Date(),
      startTimeText: null,

      endTimeShow: false,
      endTimeModel: new Date(),
      endTimeText: null,

      isLoadMore: true,
      page: 1,
      total_page: 0,
      networkLoading: false,
      listData: [],

      details: {},

      sid: 0, //记录点击哪条记录

      shop_type:0
    };
  },
  activated() {
    window.scrollTo(0, 0);
    this.getListData();
  },
  methods: {
    setShopType(index){
      if (index == this.shop_type) return;
      this.shop_type = index;
      this.getListData();
    },
    setTabIndex(index) {
      if (index == this.tabIndex) return;
      this.tabIndex = index;
      this.getListData();
    },
    handRecord(id) {
      if (this.sid == id) {
        this.sid = 0;
        return;
      }
      this.sid = id;
    },
    confirmTime(timeModel, type) {
      console.log(this.startTimeModel == timeModel);
      if (type == "start") {
        this.startTimeShow = false;
        this.startTimeModel = timeModel;
        this.startTimeText = this.fun.dateFormat("YYYY-mm-dd", timeModel);
      } else if (type == "end") {
        this.endTimeShow = false;
        this.endTimeModel = timeModel;
        this.endTimeText = this.fun.dateFormat("YYYY-mm-dd", timeModel);
      }

      if (this.startTimeText != null && this.endTimeText != null) {
        //请求
        this.getListData();
      }
    },
    initPage() {
      this.listData = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.networkLoading = false;
    },
    getListData() {
      this.initPage();

      let json = {};
      if (this.startTimeText != null && this.endTimeText != null) {
        json.start = parseInt(new Date(this.startTimeText.replace(/-/g, "/")).getTime() / 1000);
        json.end = parseInt(new Date(this.endTimeText.replace(/-/g, "/")).getTime() / 1000);
      }

      if (this.tabIndex == 1) json.status = 2;
      if (this.tabIndex == 2) json.status = 1;
      if (this.tabIndex == 3) json.status = -1;

      json.shop_type = this.shop_type;

      $http.get("plugin.owner-order-import.frontend.controllers.page.index", json).then(res => {
        this.networkLoading = true;
        if (res.result === 1) {
          this.isLoadMore = true;
          this.total_page = res.data.page_list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          if(res.data.info.need_perfect==true){
            this.$dialog.alert({message:'请完善店主信息'}).then(()=>{
              this.$router.push(this.fun.getUrl('orderImportApply',{},{shopkeeper:1}));
            });
          }
          this.details = res.data.info;
          this.listData = res.data.page_list.data;
        }
      });
    },
    //获取更多数据
    getMoreData() {
      let json = {};
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        if (this.startTimeText != null && this.endTimeText != null) {
          json.start = parseInt(new Date(this.startTimeText.replace(/-/g, "/")).getTime() / 1000);
          json.end = parseInt(new Date(this.endTimeText.replace(/-/g, "/")).getTime() / 1000);
        }

        if (this.tabIndex == 1) json.status = 2;
        if (this.tabIndex == 2) json.status = 1;
        if (this.tabIndex == 3) json.status = -1;
        json.shop_type = this.shop_type;
        this.page = this.page + 1;
        json.page = this.page;
        $http.get("plugin.owner-order-import.frontend.controllers.page.index",json ,"加载中").then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              let myData = response.data.page_list.data;
              this.listData = this.listData.concat(myData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          response => {
            // error callback
          }
        );
      }
    }
  }
};
