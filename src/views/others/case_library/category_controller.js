import caseCategoryMobile from './components/case_category_mobile';
import caseCategoryPC from './components/case_category_pc';

export default {
  data() {
    return {
      showPC: false
    };
  },
  mounted() {},
  activated() {
    let self = this;
    self.showPC = 0;
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
    caseCategoryMobile,
    caseCategoryPC
  }
};
