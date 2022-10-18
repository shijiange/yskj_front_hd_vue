import cTitle from "components/title";
export default {
  data() {
    return {
      is_boss:"",
      is_worker:"",
      member_avatar_image:"",
      member_nickname: "",
      member_uid: "",
      projectName: "",
    };
  },
  activated() {
    this.getHomeData();
    this.projectName = this.fun.getCustomTextLang("store_projects.project", "项目");
  },
  methods: {
    // 项目大全
    btnProjectAll(){
      this.$router.push(this.fun.getUrl("VerificationProjectList"));
    },
    // 我的项目
    btnMyProject(){
      this.$router.push(this.fun.getUrl("MyProject"));
    },
    // 核销记录
    btnWriteOff(){
      this.$router.push(this.fun.getUrl("WriteOffRecord"));
    },
    // 商户记录
    btnStoreRecord(){
      this.$router.push(this.fun.getUrl("StoreRecords"));
    },
    // 核销员记录
    btnVerificationRecord(){
      this.$router.push(this.fun.getUrl("VerificationRecord"));
    },
    getHomeData() {
      $http
        .get("plugin.store-projects.frontend.index.get-base-info", {}, " loading")
        .then(response => {
          if (response.result === 1) {
            this.is_boss = response.data.is_boss;
            this.is_worker = response.data.is_worker;
            this.member_avatar_image =  response.data.member_avatar_image;
            this.member_nickname =  response.data.member_nickname;
            this.member_uid =  response.data.member_uid;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
  components: { cTitle}
};
