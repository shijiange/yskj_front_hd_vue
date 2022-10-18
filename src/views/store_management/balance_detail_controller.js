import yzBlank from "components/ui_components/yz_blank";
export default {
  data () {
    return {
      balanceText: this.fun.getBalanceLang(),
      incomeType: '',
      memberId: '',
      queryUrl: '',
      list: [],
      keyword: '',
      page: 1,
      loading: false,
      finished: false,
    };
  },
  activated () {
    this.init();
    this.memberId = this.$route.params.id;
    this.getData();
  },
  methods: {
    getData () {
      if (this.loading && this.finished) return false;
      let json = {};
      json.page = this.page;
      json.search = {
        type: this.incomeType,
        member: this.keyword
      };
      if (this.memberId) json.member_id = this.memberId;
      $http.post("plugin.shop-assistant.frontend.member.balance-list", {...json}, "loading")
        .then((response) => {
          this.loading = false;
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          let data = response.data;
          this.list = data.current_page > 1 ? this.list.concat(data.data) : data.data;
          if (data.current_page >= data.last_page && data.data.length < data.per_page) this.finished = true;
          this.page++;
        }).catch ((err) => {
          this.loading = false;
        });
    },
    changeType () {
      this.list = [];
      this.page = 1;
      this.finished = false;
      this.keyword = '';
      this.getData();
    },
    onSearch () {
      this.list = [];
      this.page = 1;
      this.finished = false;
      this.getData();
    },
    init () {
      this.memberId = '';
      this.incomeType = '';
      this.list = [];
      this.page = 1;
      this.loading = false;
      this.finished = false;
    },
  },

  components: { yzBlank },
};