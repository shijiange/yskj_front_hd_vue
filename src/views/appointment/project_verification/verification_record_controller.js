import DConnectCustomerService from "@/components/other/common/DConnectCustomerService";
import DList from "@/components/dlist";
import serviceCard from "./service_card";
import { Toast } from "vant";
export default {
  data() {
    return {
      projectName: "",
      date: "",
      show: false,
      total_count: "",
      today_count: "",
      project_name: "",
      start_date: "",
      start_date_show:"",
      end_date_show:"",
      end_date: "",
      num:0,
      verRecordedData: [],
      upgradeCodeLoading: false,
      upgradeCodeFinished: false,
      upgradeCodePage: 1,
      calendarEvents: [],
      // 判断是否搜索
      info:false,
      popupShow: false,
      currentDate: new Date(),
    };
  },
  activated() {
    this.btnGoback();
    this.getDataCount();
    this.projectName = this.fun.getCustomTextLang("store_projects.project", "项目");
    // this.getWriteOff();
  },
  computed: {},
  methods: {
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      }else if (type === 'day') {
        return `${val}日`;
      }
      return val;
    },
    btnCancel(){
      this.popupShow = false;
      this.show = false;
    },
    btnFinished(data){
      const transformTimestamp = (timestamp,type) => {
        const date = new Date(timestamp);
        const Y = date.getFullYear() + type;
        const M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + type;
        const D = date.getDate() + " ";
        const dateString = Y + M + D;
        return dateString;
      };
      if (this.num < 2) {
        if (this.num === 0) {
          this.start_date_show = transformTimestamp(data,'/');
          this.start_date = transformTimestamp(data,'-');
          this.end_date = "";
          this.end_date_show = "";
          this.num++;
        } else if (this.num === 1) {
          this.end_date_show = transformTimestamp(data,'/');
          this.end_date = transformTimestamp(data,'-');
          this.num = 0;
          this.popupShow = false;
          this.show = false;
        }
      }
      //时间类比较
      let start_date_compare= Date.parse(this.start_date);
      let end_date_compare= Date.parse( this.end_date);
      //进行比较
      if(end_date_compare < start_date_compare){
        let initDate = this.start_date;
        this.start_date = this.end_date;
        this.end_date  = initDate;
        let initDateshow = this.start_date_show;
        this.start_date_show = this.end_date_show;
        this.end_date_show = initDateshow;
      }
    },
    showPopup() {
      this.popupShow = true;
      this.show = true;
    },
    btnGoback(){
      this.start_date = "";
      this.end_date = "";
      this.start_date_show = "";
      this.end_date_show = "";
      this.project_name ="";
      this.btnSearch();
    },
    // 获取数据统计
    getDataCount() {
      $http
        .get("plugin.store-projects.frontend.project-service.get-worker-summary",{},'load')
        .then(response => {
          if (response.result === 1) {
            this.total_count = response.data.total_count;
            this.today_count = response.data.today_count;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取核销数据
    getWriteOff() {
      let start_time = '';
      let end_time = '';
      if(!this.info){
        start_time = '';
        end_time = '';
      }else{
        start_time = this.start_date;
        end_time = this.end_date;
      }
      $http
        .get("plugin.store-projects.frontend.project-service.get-list", {
          owner_type: 1,
          project_name: this.project_name,
          start_date: start_time,
          end_date: end_time,
          page: this.upgradeCodePage
        },'load')
        .then(response => {
          if (response.result === 1) {
            const { data: data, current_page, last_page } = response.data;
            if (data.length === 0 || current_page === last_page) {
              this.upgradeCodeFinished = true;
            }
            this.verRecordedData.push(...data);
            this.upgradeCodeLoading = false;
            this.upgradeCodePage++;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击搜索
    btnSearch() {
      this.info = true;
      this.verRecordedData = [];
      this.upgradeCodeLoading = false;
      this.upgradeCodeFinished = false;
      this.upgradeCodePage = 1;
      this.getWriteOff();
    },
    // 删除时间
    btnDelTime(){
      this.start_date = '';
      this.end_date = '';
      this.start_date_show = '';
      this.end_date_show = '';
    }
  },
  components: { DConnectCustomerService, DList , serviceCard}
};
