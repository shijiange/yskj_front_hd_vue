export default {
  data: function() {
    return {
      signature: ""
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  activated() {
    let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
    if (mailLanguage.micro) {
      this.fun.setWXTitle(`${mailLanguage.micro.title}说明`);
    } else {
      this.fun.setWXTitle("微店说明");
    }
    this.signature = window.localStorage.getItem("reg_info");
  },
  created() {
    let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
    if (mailLanguage.micro) {
      this.fun.setWXTitle(`${mailLanguage.micro.title}说明`);
    } else {
      this.fun.setWXTitle("微店说明");
    }
  }
};
