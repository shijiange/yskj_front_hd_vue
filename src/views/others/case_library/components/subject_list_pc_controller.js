import navigation from './mycomponents/navigation';
import caseBottom from './mycomponents/case_bottom';
import caseTemplate from './mycomponents/case';
import secrvicePc from './mycomponents/service_pc';
import bottomAdv from './mycomponents/bottom_adv';
import emptyImage from '../../../../assets/images/new_diy/image.png';
// import { Toast } from 'vant';

export default {
  data() {
    return {
      emptyImage,
      view_show: false,
      choosed_h5_img: '',
      choosed_mini_img: '',
      current_page: 1,
      total: 0,
      per_page: 0
    };
  },
  activated() {
    this.view_show = true;
    this.getDatas(1);
    this.setTitle();
  },
  mounted() {
    if (!this.view_show) {
      this.getDatas(1);
      this.setTitle();
    }
  },
  methods: {
    getDatas(page) {
      let that = this;
      $http.post('plugin.case-library.api.pc.home.special-list', { page: page }, '').then(
        response => {
          if (response.result === 1) {
            that.view_show = true;
            that.list = response.data.special.data;
            that.current_page = response.data.special.current_page;
            that.total = response.data.special.total;
            that.per_page = response.data.special.per_page;
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
      this.fun.setWXTitle("专题页-"+this.$store.state.caseLibrary.set.name+"-"+this.$store.state.caseLibrary.shop_name);
    },
    currentChange(val) {
      this.getDatas(val);
    },
    changeImg(item) {
      console.log(item);
      this.choosed_h5_img = item.img_h5_src;
      this.choosed_mini_img = item.img_mini_src;
      this.$forceUpdate();
    },
    gotoSubjectDetail(id) {
      this.$router.push(this.fun.getUrl('caseLibrarySubjectDetail', { id: id }));
    },
    gotoHome() {
      this.$router.push(this.fun.getUrl('caseLibraryHome', {}));
    }
  },
  components: { secrvicePc,navigation, caseTemplate, caseBottom,bottomAdv }
};
