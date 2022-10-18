// import { mapState, mapMutations } from 'vuex';
import cTitle from '../../components/title';

// var haveShop = false;

export default {
  data() {
    return {
      id: "",

    };
  },

  mounted() {
  },
  methods: {
    //获取数据
    postSignatureInfo() {
      this.datas=[];
      var that = this;
      $http.get('plugin.conference.api.conference-activity.save-sign', { conference_id: this.id }, "签到中...").then(function (response) {
        if (response.result == 1) {
          that.$dialog.alert({message:response.msg});
                    
          that.$router.push(that.fun.getUrl('home'));
        } else {
                    
          that.$dialog.alert({message:response.msg});
          that.$router.push(that.fun.getUrl('home'));
        }
      }, function (response) {
                
        that.$dialog.alert({message:response.msg});
        that.$router.push(that.fun.getUrl('home'));
      });
    },
  },
  activated() {
    this.id = this.$route.params.id;
    this.postSignatureInfo();
  },
  created() {

  },
  components: { cTitle },


};
