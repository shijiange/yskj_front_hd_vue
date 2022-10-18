import DList from "@/components/dlist";

export default {
  data () {
    return {
      loading: false,
      finished: false,
      page: 1,
      pullLoading: false,
      starStoreData:[],
      memberInfo:{},
      accumulate_reward:""
    };
  },

  activated () {
    this.onLoad();
  },

  methods: {
    async getRewardList(){
      if (this.loading === true || this.finished === true) {
        return;
      }
      this.loading = true;
      let { data, result, msg } = await $http.post("plugin.star-store.frontend.reward-log.get-reward-list",{page: this.page});
      // console.log(data, result, msg);
      if (result === 0) {
        Toast(msg);
        return;
      }
      this.accumulate_reward = data.accumulate_reward;
      this.memberInfo = data.memberInfo;
      if (data.list.data.length === 0 || data.list.data.length < data.list.per_page || data.list.current_page === data.list.last_page) {
        this.finished = true;
      }
      this.page++;
      this.starStoreData.push(...data.list.data);
      this.loading = false;
    },
    async loadTop(){
      let { data, result, msg } = await $http.post("plugin.star-store.frontend.reward-log.get-reward-list",{page: 1});
      if (result === 0) {
        Toast(msg);
        return;
      }
      this.starStoreData = [];
      this.accumulate_reward = data.accumulate_reward;
      this.memberInfo = data.memberInfo;
      this.starStoreData.push(...data.list.data);
      this.pullLoading = false;
    },
    onLoad(){
      this.getRewardList();
    }
  },

  components: {
    DList
  },
};