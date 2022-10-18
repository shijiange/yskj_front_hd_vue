import { scrollMixin } from "../../../utils/mixin";
import { Toast } from "vant";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      member: {}
    };
  },
  mounted() {

  },
  activated() {
    this.getData();
  },
  methods: {
    init() {

    },
    getData() {
      $http.get("plugin.star-spell.frontend.index.mySelf", {}, "").then(res => {
        if (res.result != 1) {
          Toast(res.msg);
        }
        this.member = res.data.member;
      });
    },
    gotoStarMusicRewardsRecord() {
      this.$router.push(this.fun.getUrl("starMusicRewardsRecord", {}));
    },
    // gotoStarMusicEspNumber(){
    //   this.$router.push(this.fun.getUrl("starMusicEspNumber", {}));	
    // },
    starMusicPersonalGroup(type){
      if(!this.member || !this.member.uid){
        return Toast("请等待页面加载完成");
      }
      this.$router.push(this.fun.getUrl("starMusicPersonalGroup", {}, { pages: type, member_id: this.member.uid }));
    }
  }
};