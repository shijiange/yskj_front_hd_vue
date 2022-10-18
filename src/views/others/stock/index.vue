<template>
  <div v-if="agency">
    <c-title text="云库存"></c-title>
    <stock-header
      class="stock-header"
      :level="agency.level"
      :totalAward="agency.total_award"
      :user="user"
    />
    <div class="main">
      <income-list
        :transportAward="agency.transport_award"
        :transductiveAgencyAward="agency.transductive_agency_award"
        :transductiveAward="agency.transductive_award"
        :sidewaysAward="agency.sideways_award"
        v-if="agency"
      />
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import StockHeader from "@/components/member/stock/header.vue";
import IncomeList from "@/components/member/stock/income_list.vue";
import { Toast } from "vant";
export default {
  data() {
    return {
      agency: null,
      user: null
    };
  },
  activated() {
    this.getAgencyData();
  },
  methods: {
    getAgencyData() {
      $http
        .post("plugin.agency.api.agency.index")
        .then((data, result, msg) => {
          if (result === 0) {
            Toast.fail(msg);
            return;
          }
          this.user = {
            uid: data.data.uid,
            avatar: data.data.avatar,
            nickname: data.data.nickname
          };
          this.agency = data.data;
        })
        .catch(err => {
          if (err.status === 500) {
            Toast.fail("服务器错误");
            this.$router.push(this.fun.getUrl("member"));
          }
        });
    }
  },
  components: {
    StockHeader,
    IncomeList
  }
};
</script>

<style scoped>
.main {
  margin-top: 0.625rem;
}
</style>