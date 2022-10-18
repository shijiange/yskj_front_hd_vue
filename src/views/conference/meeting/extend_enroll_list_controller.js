// import { Toast } from 'vant';
import cTitle from "components/title";

const LIST_URL = "plugin.conference.api.conference-enrol.get-child";

export default {
  data() {
    return {
      list: []
    };
  },

  activated() {
    this.list = [];
    this.getData();
  },

  mounted() {},
  methods: {
    routerGo(name, cid, mid) {
      this.$router.push(this.fun.getUrl(name, { id: cid, member_id: mid }));
    },

    goExtendList(cid, mid) {
      this.$router.push(
        this.fun.getUrl("MeetingExtendList", { id: cid, member_id: mid })
      );
    },

    getData() {
      $http
        .get(
          LIST_URL,
          {
            conference_id: this.$route.params.id,
            member_id: this.$route.params.member_id
          },
          "加载中..."
        )
        .then(res => {
          if (res.result == 1) {
            console.log(res);
            this.list = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
