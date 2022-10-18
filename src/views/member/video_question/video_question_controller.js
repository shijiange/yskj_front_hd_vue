import cMent from "components/o2oment";
import { scrollMixin } from '../../../utils/mixin';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      category: [],
      message: false,
      info: [],
      show_video_viewing_progress: 0,
      show_answer_button: 0,
      unread_message_count: 0,
      tabind: 0,
      // 消息弹窗
      messageList: [],
      isLoadMore: true,
      page: 1,
      total_page: 0,
      loading: false,
      finished: false,
    };
  },
  activated() {
    window.scrollTo(0, 0);
    this.message = false;
    this.getData();
    this.page = 1;
  },
  methods: {
    getData() {
      var that = this;
      $http.get("plugin.agent-qa.api.index.index").then(
        response => {
          if (response.result === 1) {
            that.category = response.data.button_list;
            that.info = response.data;
            that.unread_message_count = response.data.unread_message_count;
            that.fun.setWXTitle(that.info.name);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    // toApply() {
    //   this.$router.push(this.fun.getUrl("mvideoAnswer"));
    // },
    onClick(name, title) {
      console.log(name, title);
    },
    toWatch(urli, kid, name) {
      this.$router.push(this.fun.getUrl("videoWhtch", { id: kid }));
    },
    goAnswer() {
      if (this.info.application_audit_status == 2) {
        this.$router.push(this.fun.getUrl("mvideoAnswer"));
      } else { 
        this.$router.push(this.fun.getUrl("videoApply")); 
      }
    },
    goRecord(){
      this.$router.push(this.fun.getUrl("videoRecord"));
    },
    tapSwiper(url) {
      if(!this.fun.isTextEmpty(url)){
        window.location.href = url;
      }
    },
    onClickRight() {
      this.message = true;
      var that = this;
      $http.get("plugin.agent-qa.api.message.get-list").then(
        response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.messageList = response.data.data;
            console.log(that.page, that.total_page);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    onLoad() {
      var that = this;
      let url = "plugin.agent-qa.api.message.get-list";
      that.page = that.page + 1;
      let json = {
        page: that.page
      };
      that.finished = false;
      console.log(that.page, that.total_page);
      $http.get(url, json, "加载中").then(
        function (response) {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            let arr = response.data.data;
            that.messageList = that.messageList.concat(arr);
            console.log(that.messageList);
            if (that.page >= that.total_page) {
              that.finished = true;
              that.loading = true;
              console.log('sasdasdasdasdas');
            } else {
              that.finished = false;
              that.onLoad();
            }
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        },
        function (response) {
          // error callback
        }
      );
    },
    getMoreData() {
      //   this.isLoadMore = false; // 防止多次请求分页数据
      //   let that = this;
      //   let url = "plugin.agent-qa.api.message.get-list";
      //   if (that.page === that.total_page) {
      //     return;
      //   }
      //   if (that.page >= that.total_page) {
      //     return;
      //   } else {
      //     that.page = that.page + 1;
      //     let json = {
      //       page: that.page
      //     };
      //     that.page = that.page + 1;
      //     $http.get(url, json, "加载中").then(
      //       function (response) {
      //         if (response.result === 1) {
      //           that.isLoadMore = true;
      //           that.total_page = response.data.data.last_page;
      //           let arr = response.data.data
      //           that.messageList = that.messageList.concat(arr);
      //         } else {
      //           that.page = that.page - 1;
      //           that.isLoadMore = false;
      //           return;
      //         }
      //       },
      //       function (response) {
      //         // error callback
      //       }
      //     );
      //   }
    },
    onClickLeft() {
      this.$router.go(-1);
    }
  },
  components: {
    cMent,
  }
};