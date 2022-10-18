// import { Toast } from 'vant';
import emptyImage from '../../../../../assets/images/new_diy/image.png';

export default {
  data() {
    return {
      emptyImage,
      show: false,
      service_phone: '',
      service_qr_code_src: ''
    };
  },
  activated() {

  },
  mounted() {
    this.show = false;
    if (!this.$store.state.caseLibrary) {
      this.getDatas();
    } else {
      this.setData();
    }
  },

  methods: {
    getDatas() {
      let that = this;
      $http.post('plugin.case-library.api.case.get-set', {}, '').then(
        response => {
          if (response.result === 1) {
            that.$store.commit('setCaseLibrary', response.data);
            that.setData();
            console.log(that.$store.state);
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});

        }
      );
    },
    setData() {
      let that = this;
      that.service_phone = that.$store.state.caseLibrary.set.service_phone;
      that.service_qr_code_src = that.$store.state.caseLibrary.set.service_qr_code_src;
    },
    openWin() {
      this.show = true;
    },
    closeWin() {
      this.show = false;
    }
  },
  props: {
    datas: {
      type: Array || Number, //指定传入的类型
      default: [] //这样可以指定默认的值
    }
  }
};
