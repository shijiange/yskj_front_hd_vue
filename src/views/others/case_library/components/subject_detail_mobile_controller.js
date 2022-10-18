import caseTemplate from './mycomponents/case_mobile';
import headTemplate from './mycomponents/head';
import serviceTemplate from './mycomponents/service';
import shareTemplate from './mycomponents/share';
// import { Toast } from 'vant';

export default {
  data() {
    return {
      id:0,
      share_show: false,
      datas:{},
      case_data:[],
    };
  },
  activated() {
    this.initData();
    this.getList();
  },
  methods: {
    initData() {
      this.id = this.$route.params.id;
      this.datas = {};
      this.share_show = true;
    },
    getList() {
      let that = this;
      $http.post('plugin.case-library.api.mobile.home.special-detail', {id:this.id}, '').then(
        response => {
          if (response.result === 1) {
            that.datas = response.data.special;
            that.case_data = that.datas.case_data;
            if(that.datas.desc) {
              that.datas.desc = that.datas.desc.replace(/\n/g,'<br>');
            }
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
        }
      );
    },
    openShare() {
      this.share_show = true;
    },
    closeShare() {
      this.share_show = false;
    }
  },
  components: { caseTemplate, headTemplate, serviceTemplate,shareTemplate }
};
