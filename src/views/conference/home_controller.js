// import {
//   mapState,
//   mapMutations
// } from 'vuex';
import cTitle from '../../components/title';
// import { Toast } from 'vant';
// var haveShop = false;

export default {
  data() {
    return {
      conference: [],
    };
  },

  mounted() {

  },
  methods: {
    goback() {
      this.$router.go(-1);
    },

    //获取活动列表数据
    getConference() {
      var that = this;
      $http.get('plugin.conference.api.conference-activity.get-activity', {}, "加载中...").then(function (response) {
        if (response.result == 1) {
          that.conference = response.data;
          console.log('conference1', response);

        } else {
          that.$dialog.alert({message:response.msg});
        }
      }, function (response) {
        that.$dialog.alert({message:response.msg});
        
      });
    },

    //查看报名信息
    onActivityInfo(id) {
      this.$router.push(this.fun.getUrl('myActivityInfo', {
        id: id
      }));
    },


    //初始化分享设置


  },
  activated() {
    this.conference = []; //初始化
    this.getConference();

  },
  created() {

  },
  components: {
    cTitle,    
  }

};
