// import { Toast } from 'vant';

export default {
  data() {
    return {
      nav_top:[],
      logo_src:"",
      is_login:'',
    };
  },
  mounted() {
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
      that.nav_top = that.$store.state.caseLibrary.set.nav_top;
      that.logo_src = that.$store.state.caseLibrary.set.logo_src;
      that.is_login = that.$store.state.caseLibrary.is_login;
    },

  }
};
