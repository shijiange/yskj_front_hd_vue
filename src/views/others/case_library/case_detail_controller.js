import caseDetailMobile from './components/case_detail_mobile';
import caseDetailPC from './components/case_detail_pc';

export default {
  data() {
    return {
      
    };
  },
  mounted() {},
  activated() {
    window.scrollTo(0, 0);
    if (!this.$store.state.caseLibrary) {
      this.getDatas();
    } 
  },
  methods: {
    getDatas() {
      let that = this;
      $http.post('plugin.case-library.api.case.get-set', {}, '').then(
        response => {
          if (response.result === 1) {
            that.$store.commit('setCaseLibrary', response.data);
            that.showPC = that.$store.state.caseLibrary.set.pc_style;
          } else {
            that.$dialog.alert({message:response.msg});
            
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
        }
      );
    }
  },
  computed: {},
  components: {
    caseDetailMobile,
    caseDetailPC
  }
};
