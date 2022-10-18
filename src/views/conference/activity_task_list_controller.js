import cTitle from '../../components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      checkbox1: true,
      id: "",
      dataInfo: {},
      activityName: "",
      activityDate: "",
      activityContent: "",
      activityThumb: "",

      activityTask: [],
      activeName: '1',
    };
  },

  mounted() {
  },
  methods: {
    //初始化分享设置
    initShare() {
      let that = this;
      let json = {
        url:
            this.fun.isIosOrAndroid() === "android"
              ? window.location.href
              : window.initUrl
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
          if (response.result === 1) {
            if(response.data.config){
              that.share(response.data);
            }
          } //else {
          //}
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {

        let _title = that.fun.isTextEmpty(that.dataInfo.share_title)
          ? data.shop.share.title
          : that.dataInfo.share_title;
        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);
        let _imgUrl = that.fun.isTextEmpty(that.dataInfo.share_pictures)
          ? data.shop.share.icon
          : that.dataInfo.share_pictures;
        let _desc = that.fun.isTextEmpty(that.dataInfo.share_content)
          ? data.shop.share.desc
          : that.dataInfo.share_content;

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
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
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },
    //获取设置
    initData(){
      var that = this;
      $http.get('plugin.task-reward.api.task-activity.get-task-reward-set', { activity_id: this.id }, "").then(function (response) {
        if (response.result == 1) {
          if(response.data.is_task_reward=="1")
          {
            that.getActivityTask();
          }else{
            that.$router.go(-1);
          }

        } else {
          that.$dialog.alert({message:response.msg});

        }
      }, function (response) {
        that.$dialog.alert({message:response.msg});

      });
    },

    //获取数据
    getActivityTask() {
      var that = this;
      $http.get('plugin.task-reward.api.task-activity.get-task-activity', { activity_id: this.id }, "加载中...").then( (response)=> {
        if (response.result == 1) {
          that.dataInfo = response.data;
          if(response.data.time_status==1)//活动正常
          {
            that.initActivityInfo(response.data);
            that.activityTask = response.data.hasManyTask;
          }else if(response.data.time_status==-1){//活动已结束
            that.initActivityInfo(response.data);
            that.$dialog.alert({message:"活动已结束"});

          }else if(response.data.time_status==0){//活动未开始
            that.initActivityInfo(response.data);
            that.$dialog.alert({message:"活动未开始"});

          }
          // that.initShare();
          this.fun.wxShare(
            "",
            {},
            {
              title: this.dataInfo.share_title,
              imgUrl: this.dataInfo.share_pictures,
              description: this.dataInfo.share_content
            }
          );
        } else {
          that.$dialog.alert({message:response.msg});

        }
      }, (response)=> {
        this.$dialog.alert({message:response.msg});

      });
    },

    initActivityInfo(data) {
      this.activityName = data.title;
      this.activityDate = data.starttime + "至" + data.endtime;
      this.activityContent = data.content;
      this.activityThumb = data.thumb;
    },

    //获取奖励操作
    getReceive(id) {
      var that = this;
      $http.get('plugin.task-reward.api.task-activity.get-receive-reward', { activity_id: this.id, task_id: id }, "领取中...").then(function (response) {
        if (response.result == 1) {
          if(response.data.status==1){
            that.getActivityTask();
          }else{
            that.$dialog.alert({message:response.msg});

          }

        } else {
          that.$dialog.alert({message:response.msg});

        }
      }, function (response) {
        that.$dialog.alert({message:response.msg});

      });
    }

  },
  activated() {
    this.id = this.$route.params.id;
    this.initData();

  },
  created() {

  },
  components: { cTitle },


};
