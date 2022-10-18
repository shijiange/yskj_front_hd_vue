import cTitle from "components/title";
import { Image, Toast } from "vant";
import Tabbar from "@/components/circleCommunity/tabbar";
import CircleItem from "@/components/circleCommunity/circleItem";
import DList from "@/components/dlist";
export default {
  data() {
    return {
      arr: [],
      bonus_data: {},
      paymentRecords: [],
      recordPagination: {
        page: 1,
        finished: false,
        loading: false
      }
    };
  },
  activated() {
    this.loadPaymentRecord();
  },
  methods: {
    loadPaymentRecord() {
      if (this.recordPagination.loading || this.recordPagination.finished) {
        return;
      }
      this.recordPagination.loading = true;
      $http.get("plugin.circle.frontend.circle-member.my-cicel-pay-log", {}, "").then(({ data: response, result, msg }) => {
        this.recordPagination.loading = false;
        if (result === 0) {
          Toast(msg);
          return;
        }
        if (response.last_page === response.current_page || response.data.length < response.per_page) {
          this.recordPagination.finished = true;
        }
        this.recordPagination.page++;
        this.paymentRecords.push(...response.data);
      });
    }
  },
  components: {
    cTitle,
    Tabbar,
    DList,
    CircleItem,
    VanImage: Image
  }
};
