import cTitle from "components/title";
import { Search, Toast } from "vant";
import DList from "@/components/dlist";
import CircleItem from "@/components/circleCommunity/circleItem";
export default {
  data() {
    return {
      name: "",
      timer: null,
      circles: [],
      circlesPagination: {
        page: 1,
        loading: false,
        finished: false
      }
    };
  },
  activated() {
    this.getCircles();
  },
  methods: {
    searchMember() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.circles = [];
        this.circlesPagination = {
          page: 1,
          loading: false,
          finished: false
        };
        this.getCircles();
      }, 500);
    },
    getCircles() {
      if (this.circlesPagination.loading || this.circlesPagination.finished) {
        return;
      }
      this.circlesPagination.loading = true;
      $http
        .get("plugin.circle.frontend.circle.get-circle-list", {
          name: this.name,
          is_recommend: this.name ? 0 : 1,
          page: this.circlesPagination.page
        })
        .then(
          ({ data: response, result, msg }) => {
            if (result == 0) {
              Toast(msg);
              return;
            }
            if (response.current_page == response.last_page || response.data.length < response.per_page) {
              this.circlesPagination.finished = true;
            }
            this.circlesPagination.page++;
            this.circles.push(...response.data);
            this.circlesPagination.loading = false;
            return;
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    viewCircle(circleId) {
      this.$router.push(
        this.fun.getUrl(
          "circleDetails",
          {},
          {
            id: circleId
          }
        )
      );
    },
  },
  components: {
    cTitle,
    DList,
    CircleItem,
    VanSearch: Search
  }
};
