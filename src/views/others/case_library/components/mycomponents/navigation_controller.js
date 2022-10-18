// import { Toast } from 'vant';
import emptyImage from '../../../../../assets/images/new_diy/image.png';

export default {
  data() {
    return {
      emptyImage,
      nav_top:[],
      logo_src:"",
      is_login:'',
    };
  },
  mounted() {
    this.setData();
    // if (!this.$store.state.caseLibrary) {
    //   this.getDatas()
    // } else {
    //   this.setData()
    // }
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

      console.log(that.$store.state.caseLibrary.set.nav_top);
      that.nav_top = that.$store.state.caseLibrary.set.nav_top;
      that.logo_src = that.$store.state.caseLibrary.set.logo_src;
      that.is_login = that.$store.state.caseLibrary.is_login;
      console.log(1232333);
    },
    gotoRelease() {
      $http.get('plugin.case-library.api.release.checkout-auth').then(
        response => {
          if (response.result === 1) {
            this.$router.push(this.fun.getUrl('caseLibrary', { }));
          } else {
            this.$dialog.alert({message: "您暂时没有权限发布案例！"});
          }
        },
        (response)=> {
          this.$dialog.alert({message:response.msg});
        }
      );
    },
    gotoLogin() {
      this.$router.push(this.fun.getUrl('login', { }));
    }
  }
};
