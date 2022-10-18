// import { Toast } from 'vant';

export default {
  data() {
    return {
      show: false
    };
  },
  activated() {
    this.show = false;
  },
  methods: {
    goBack() {
      history.go(-1);
    },
    openMenu() {
      this.show = true;
    },
    gotoOther(type) {
      let name = "";
      if (type == "home") {
        name = "caseLibraryHome";
      } else if (type == "category") {
        name = "caseLibraryCategory";
      } else if (type == "ranking") {
        name = "caseLibraryRankingMobile";
      } else if (type == "subject") {
        name = "caseLibrarySubjectList";
      }
      this.$router.push(this.fun.getUrl(name, {}));
    }
  },
  props: {
    datas: {
      type: Array || Number, //指定传入的类型
      default: ()=>[] //这样可以指定默认的值
    },
    text: {
      type: String,
      default: ""
    },
    choosed: {
      type: String,
      default: ""
    }
  }
};
