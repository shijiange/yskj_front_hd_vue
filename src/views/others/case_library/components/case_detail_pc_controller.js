import navigation from './mycomponents/navigation';
import caseTemplate from './mycomponents/case';
import secrvicePc from './mycomponents/service_pc';
import caseBottom from './mycomponents/case_bottom';
import bottomAdv from './mycomponents/bottom_adv';
import emptyImage from '../../../../assets/images/new_diy/image.png';

import { Toast } from 'vant';

export default {
  data() {
    return {
      emptyImage,
      next_index:-1,
      next_arr:[],
      showBigImg:false,
      activeSkuIndex:-1,
      posterShow:false,
      img_url:'',
      view_show: false,
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
      comment: [], //评论
      ad3: {},
      star_value: 4,
      reply_text: '',
      commit_text: '',
      text_show_index:-1,
      case_data:[],
      last_page:1,
      current_page:0,
      category_name:'',

      first_category:[],
      second_category:[],
    };
  },
  activated() {
    this.initData();
    this.id = this.$route.params.id;
    this.view_show = true;
    this.getDatas();
    this.getCategory();
  },
  mounted() {
    if (!this.view_show) {
      this.initData();
      this.id = this.$route.params.id;
      this.getDatas();
      this.getCategory();
    }
  },
  methods: {
    initData() {
      this.uid = '';
      this.next_index = -1;
      this.next_arr = [];
      this. showBigImg = false;
      this.activeSkuIndex = -1;
      this.LoginStatus = '';
      this.reply_id = '';
      this.reply_type = '';
      this.screen_shot_src = '';
      this.datas = {};
      this.label = [];
      this.hotCase = [];
      this.second_category = [];
      this.comment = [];
      this.ad3 = {};
      this.star_value = 4;
      this.reply_text = '';
      this.commit_text = '';
      this.text_show_index = -1;
      // this.case_data = []
      this.last_page = 1;
      this.current_page = 0;
      // this.category_name = ''
      this.first_category = [];
      this.second_category = [];

    },
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
            // 加入是否展开更多回复状态、是否显示回复框
            that.comment.forEach((item, index) => {
              that.comment[index].is_show = false;
              that.comment[index].text_show = false;
            });
            that.ad3 =
              response.data.advert.ad3.length && response.data.advert.ad3.length == 0 ? {} : response.data.advert.ad3;
            that.uid = window.localStorage.uid;
            that.first_category = that.datas.first_category || [];
            that.second_category = that.datas.second_category || [];
            that.setTitle();
            // this.foodScroll = new BScroll(this.$refs.image, {
            //   click: true
            // })
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        function(response) {

          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    },
    getCategory() {
      let that = this;
      that.current_page++;
      if(that.current_page>that.last_page) {
        that.current_page = 1;
      }
      $http.post('plugin.case-library.api.pc.home.category-case-detail', { id: that.id,page:that.current_page }, '').then(
        response => {
          if (response.result === 1) {
            that.case_data = response.data.data[0].case_data;
            that.last_page = response.data.last_page;
            that.current_page = response.data.current_page;
            that.category_name = response.data.data[0].category_name || '';
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        function(response) {

          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    },
    setTitle() {
      this.fun.setWXTitle(this.datas.case_name+"-"+this.$store.state.caseLibrary.set.name+"-"+this.$store.state.caseLibrary.shop_name);
    },
    gotoOther(id) {
      this.$router.push(this.fun.getUrl('caseLibraryDetail', { id: id }));
    },
    gotoCaseDetail(id) {
      this.$router.push(this.fun.getUrl('caseLibraryDetail', { id: id }));
    },
    gotoCategory(pid, cid, level) {
      if (!cid) {
        this.$router.push(this.fun.getUrl('caseLibraryCategory', {}));
      }
      else {
        this.$router.push(this.fun.getUrl('caseLibraryCategory', {},{pid:pid,cid:cid,level:level}));
      }
    },
    changeReplyLength(index) {
      this.comment[index].is_show = this.comment[index].is_show ? false : true;
      this.$forceUpdate();
    },

    openReply(id, reply_type,index) {
      let that = this;
      if(this.reply_id==id) {
        return;
      }
      if(that.text_show_index!=-1) {
        this.comment[that.text_show_index].text_show = false;
      }
      this.text_show_index = index;

      this.comment[index].text_show = true;

      this.reply_id = id;
      this.reply_type = reply_type;
      this.commit_text = "";
      this.$forceUpdate();
      console.log(this.$refs);
      this.$nextTick(() => {
        this.$refs['reply_text'+index][0].focus();
      });
    },

    sendMessage() {
      let that = this;
      let json = {
        case_id: that.id,
        level: that.star_value,
        contents: that.commit_text
      };
      $http.post('plugin.case-library.api.release.release-comment', json, '').then(
        response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.initData();
            this.getDatas();
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        function(response) {

          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    },
    replyMessage() {
      let that = this;
      let json = {
        reply_id: that.reply_id,
        reply_type: that.reply_type,
        contents: that.reply_text
      };
      $http.post('plugin.case-library.api.release.reply-comment', json, '').then(
        response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.initData();
            this.getDatas();
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        function(response) {

          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    },
    delComment(id, type) {
      let that = this;
      let axiosUrl = null;
      if(that.$store.state.caseLibrary.is_delete_comment){
        // 管理者可以删除所有评论接口  is_delete_comment ： 1
        axiosUrl = 'plugin.case-library.api.case.del-comment'
      }else{
        // 只可以删除用户本身评论接口 is_delete_comment ： 0
        axiosUrl = 'plugin.case-library.api.release.del-comment'
      }
      this.$dialog.confirm({
        title: '提示',
        message: '确定删除此留言?',
      }).then(action => {
        if (action == 'confirm') {
          $http.post(axiosUrl, { id: id, comment_type: type }, '').then(
            response => {
              if (response.result === 1) {
                Toast(response.msg);
                that.getDatas();
              } else {

                this.$dialog.alert({
                  title: '提示',
                  message: response.msg,
                });
              }
            },
            function(response) {

              this.$dialog.alert({
                title: '提示',
                message: response,
              });
            }
          );
        }
      });
    },
    // 生成海报
    creatPoster() {
      let that = this;
      if(that.img_url) {
        that.posterShow = true;
        return;
      }
      let json = { id: this.id };
      $http.post('plugin.case-library.api.release.get-case-poster', json, '').then(
        response => {
          if (response.result === 1) {
            that.posterShow = true;
            that.img_url = response.data.url;
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        function(response) {

          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    },
    showImage(index) {
      this.activeSkuIndex = index;
      this.showBigImg = true;
    },

    gotoLabel(id) {
      this.$router.push(this.fun.getUrl('caseLibraryLabel', { id: id }));
    },

    gotoHome() {
      this.$router.push(this.fun.getUrl('caseLibraryHome', {}));
    },
    goNext() {
      let right = this.$refs.image.style.right;
      if(right) {
        right = Number(right.split('p')[0]);
      }
      else {
        right = 0;
      }
      if(this.$refs.image.scrollWidth<=(right+798)) {
        return;
      }
      this.next_index += 1;
      let width = this.$refs['image'+this.next_index][0]?this.$refs['image'+this.next_index][0].scrollWidth:'';
      console.log(this.$refs['image'+this.next_index][0].scrollWidth);
      this.next_arr.push(width+10);
      this.$refs.image.style.right=right+width+10+'px';
    },
    goLast() {
      let right = this.$refs.image.style.right;
      if(right) {
        right = Number(right.split('p')[0]);
      }
      else {
        right = 0;
      }
      if(right==0) {
        return;
      }
      if(this.next_arr.length<=0) {
        return;
      }
      this.next_index -= 1;
      this.$refs.image.style.right =right-this.next_arr[this.next_arr.length-1]+'px';
      this.next_arr.splice(this.next_arr.length-1,1);
    }
  },
  components: { caseBottom, secrvicePc, navigation, caseTemplate,bottomAdv }
};
