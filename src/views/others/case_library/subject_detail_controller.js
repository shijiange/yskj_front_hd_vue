// import { Toast } from 'vant';
import caseSubjectDetailMobile from "./components/subject_detail_mobile";
import caseSubjectDetailPC from "./components/subject_detail_pc";

export default {
  data() {
    return {
      showPC: false
    };
  },
  mounted() {
  },
  activated() {
    let self = this;
    self.showPC = false;
    window.scrollTo(0, 0);
    if (!this.$store.state.caseLibrary) {
      this.getDatas();
    } else {
      self.showPC = this.$store.state.caseLibrary.set.pc_style;
    }

  },
  methods: {
    getDatas() {
      let that = this;
      $http.post("plugin.case-library.api.case.get-set", {}, "").then(
        response => {
          if (response.result === 1) {
            that.$store.commit("setCaseLibrary", response.data);
            that.showPC = that.$store.state.caseLibrary.set.pc_style;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          this.$dialog.alert({ message: response.msg });
        }
      );
    }
  },
  computed: {},
  components: {
    caseSubjectDetailMobile,
    caseSubjectDetailPC
  }
};
