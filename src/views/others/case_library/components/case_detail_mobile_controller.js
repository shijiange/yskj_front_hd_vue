import headTemplate from './mycomponents/head';
import caseTemplate from './mycomponents/case_mobile';
import serviceTemplate from './mycomponents/service';
import shareTemplate from './mycomponents/share';
import { Toast } from 'vant';
import emptyImage from '../../../../assets/images/new_diy/image.png';

export default {
  data() {
    return {
      emptyImage,
      view_show: false,
      showBigImg:false,
      activeSkuIndex:-1,
      id: '',
      uid: '', //会员ID
      LoginStatus: '', //会员信息
      reply_id: '', //回复ID
      reply_type: '', //回复类型
      message_show: false,
      reply_show: false,
      datas: {},
      screen_shot_src: [], //截图
      label: [],
      hotCase: [],
      second_category: [],
      comment: [], //评论
      ad3: {},
      star_value: 4,
      reply_text: '',
      commit_text: ''
    };
  },
  activated() {
    this.id = this.$route.params.id;
    this.showBigImg = false;
    this.activeSkuIndex = -1;
    this.getDatas();
  },

  methods: {
    getDatas() {
      let that = this;
      $http.post('plugin.case-library.api.case.get-case-detail', { id: that.id }, '').then(
        response => {
          if (response.result === 1) {
            that.view_show = true;
            that.datas = response.data.case;
            that.screen_shot_src = that.datas.screen_shot_src || [];
            that.label = that.datas.label || [];
            that.hotCase = response.data.hotCase;
            that.second_category = that.datas.second_category;
            that.comment = that.datas.comment;
            // 加入是否展开更多回复状态
            that.comment.forEach((item, index) => {
              that.comment[index].is_show = false;
            });
            that.ad3 =
              response.data.advert.ad3.length && response.data.advert.ad3.length == 0 ? {} : response.data.advert.ad3;
            that.uid = window.localStorage.uid;
            console.log(this.$store.state);
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
        }
      );
    },
    gotoOther(id) {
      this.$router.push(this.fun.getUrl('caseLibraryDetail', { id: id }));
    },
    changeReplyLength(index) {
      this.comment[index].is_show = this.comment[index].is_show ? false : true;
      this.$forceUpdate();
    },
    openMeaage() {
      this.reply_show = false;
      this.reply_id = "";
      this.reply_text = "";
      this.message_show = true;

      this.$nextTick(() => {
        this.$refs.commit_text.focus();
      });
    },
    openReply(id, reply_type) {
      this.message_show = false;
      this.commit_text = "";
      this.reply_show = true;
      this.reply_id = id;
      this.reply_type = reply_type;
      this.$nextTick(() => {
        this.$refs.reply_text.focus();
      });
    },
    blurReply() {
      let that = this;
      that.reply_id = '';
      console.log(that.reply_id);
    },
    sendMessage(type) {
      let that = this;
      let json = {};
      let url = '';
      // 回复
      if (type == 1) {
        json = {
          reply_id: that.reply_id,
          reply_type: that.reply_type,
          contents: that.reply_text
        };
        url = 'plugin.case-library.api.release.reply-comment';
      }
      // 评论
      else {
        json = {
          case_id: that.id,
          level: that.star_value,
          contents: that.commit_text
        };
        url = 'plugin.case-library.api.release.release-comment';
      }

      $http.post(url, json, '').then(
        response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.star_value = 4;
            this.commit_text = '';
            this.reply_text = "";
            this.message_show = false;
            this.reply_id = "";
            this.reply_show = false;
            this.getDatas();
          } else {
            this.$dialog.alert({message:response.msg});
          }
        },
        function(response) {
          this.$dialog.alert({message:response.msg});
        }
      );
    },
    delComment(id,type) {
      let that = this;
      let axiosUrl = null;
      if(that.$store.state.caseLibrary.is_delete_comment){
        // 管理者可以删除所有评论接口  is_delete_comment ： 1
        axiosUrl = 'plugin.case-library.api.case.del-comment'
      }else{
        // 只可以删除用户本身评论接口 is_delete_comment ： 0
        axiosUrl = 'plugin.case-library.api.release.del-comment'
      }
      that.$dialog.confirm({ message: "确定删除此留言?"})
        .then(() => {
          $http.post(axiosUrl, { id: id,comment_type:type }, '').then(
            response => {
              if (response.result === 1) {
                Toast(response.msg);
                that.getDatas();
              } else {
                that.$dialog.alert({message:response.msg});
              }
            },
            function(response) {
              that.$dialog.alert({message:response.msg});
            }
          );
        }).catch(() => {});
    },
    showImage(index) {
      this.activeSkuIndex = index;
      this.showBigImg = true;
    },
  },
  components: { headTemplate, caseTemplate, serviceTemplate, shareTemplate }
};
