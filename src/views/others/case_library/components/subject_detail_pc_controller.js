import navigation from './mycomponents/navigation';
import caseTemplate from './mycomponents/case';
import caseBottom from './mycomponents/case_bottom';
import secrvicePc from './mycomponents/service_pc';
import bottomAdv from './mycomponents/bottom_adv';
import emptyImage from '../../../../assets/images/new_diy/image.png';

export default {
  data() {
    return {
      emptyImage,
      id: '',
      view_show: false,
      posterShow:false,
      img_url:'',
      datas: {

      },
      case_data:[],
    };
  },
  activated() {
    this.initData();
    this.view_show = true;
    this.getDatas();
  },
  mounted() {
    if (!this.view_show) {
      this.initData();
      this.getDatas(1);
    }
  },
  methods: {
    initData() {
      this.id = this.$route.params.id;
      this.datas = {};
      this.posterShow =false;
      this.img_url = '';
      this.case_data=[];
    },
    getDatas() {
      let that = this;
      $http.post('plugin.case-library.api.pc.home.special-detail', { id: this.id }, '').then(
        response => {
          if (response.result === 1) {
            that.view_show = true;
            that.datas = response.data.special;
            that.case_data = that.datas.case_data;
            if (that.datas.desc) {
              that.datas.desc = that.datas.desc.replace(/\n/g, '<br>');
            }
            that.setTitle();
            // this.$forceUpdate()
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
      this.fun.setWXTitle(this.datas.special_name+"-"+this.$store.state.caseLibrary.set.name+"-"+this.$store.state.caseLibrary.shop_name);
    },
    gotoHome() {
      this.$router.push(this.fun.getUrl('caseLibraryHome', {}));
    },
    // 生成海报
    creatPoster() {
      let that = this;
      if(that.img_url) {
        that.posterShow = true;
        return;
      }
      let json = { id: this.id };
      $http.post('plugin.case-library.api.release.get-special-poster', json, '').then(
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
  },
  components: { secrvicePc,caseBottom, navigation, caseTemplate,bottomAdv }
};
