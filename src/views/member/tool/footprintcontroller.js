import cTitle from 'components/title';
import { Toast } from 'vant';
import DList from "@/components/dlist";
export default {
  data() {
    return {
      integral: window.localStorage.integral || '积分',
      checkList: [],
      datas: [],
      checkAll: false,

      page: 1,
      loading: false,
      finisend: false,
    };
  },

  activated() {
    this.page = 1;
    this.finisend = false;
    this.loading = false;
    this.getData();
  },

  mounted() {
  },
  methods:{
    async getData() {
      if (this.finisend || this.loading) {
        return;
      }
      this.loading = true;
      let json = { "i": this.fun.getKeyByI(), "type": this.fun.getTyep(), page: this.page };
      let response = await $http.get('member.member-history.index', json, "加载中");
      this.loading = false;
      if (response.result !== 1) {
        Toast(response.msg);
        return;
      }
      if (this.page >= response.data.last_page || response.data.member_histories.length < response.data.per_page) {
        this.finisend = true;
      }
      if (this.page > 1) {
        this.datas = this.datas.concat(response.data.member_histories);
      } else {
        this.datas = response.data.member_histories;
      }
      this.page++;
    },

    delteteItem(item, i) {
      let that = this;
      let json = { id: item.id, "i": this.fun.getKeyByI(), "type": this.fun.getTyep() };

      $http.get('member.member-history.destroy', json, "处理中...").then(function (response) {
        console.log(response);
        if (response.result == 1) {
          that.datas.splice(i, 1);
          Toast("操作成功");
        } else {
          Toast(response.msg);
        }

      }, function (response) {
        console.log(response);
      });

    },

    toItem(item) {
      if(item.owner_id != 0){
        this.$router.push(this.fun.getUrl('goodsO2O',{id: item.goods.id,tag:"o2o",store_id:item.owner_id}));

      }else{
        this.$router.push(this.fun.getUrl('goods',{id: item.goods.id}));
      }
    }
  },
  components: {
    cTitle,
    DList
  }
};