
import cTitle from "components/title";



export default {
  data() {
    return {
      type:0,
      banner_url:'',
      app_url:'',
      app_type:'',
    };
  },

  mounted() {

  },

  methods: {
    init() {
      this.type = 0;
      this.banner_url = '';
      this.app_url = '';
    },

    jumpDown() {
      window.location.href = this.app_url;
    },
    getData() {
      var that = this;
      let url = "";
      console.log(this.app_type);
      if(this.app_type==7) {
        url = "plugin.app-set.frontend.app-poster.getAppShareOther";
      }else if(this.app_type==15) {
        url = "plugin.aggregation-cps.api.poster.getAppShare";
      }
      $http.get(url, {}).then((response) => {
        if (response.result == 1) {
          let set =  response.data.set;
          that.banner_url = set.banner_url;
          that.app_url = set.app_url;
        } else {
          that.$dialog.alert({message:response.msg});
        }
      }, (response) => {
        console.log(response.msg);
        that.agreementStatus = false;
      });
    },

  },
  activated() {
    if(this.$route.params.type) {
      this.type = this.$route.params.type;
    }
    if(this.$route.query.app_type) {
      this.app_type = this.$route.query.app_type;
    }else {
      this.app_type = 7;
    }
    this.getData();
  },

  components: { cTitle }
};
