import cTitle from "components/title";
import DList from "@/components/dlist";
import CircleItem from "@/components/circleCommunity/circleItem";
import CircleButton from "@/components/circleCommunity/circleButton";
import { Image, Toast } from "vant";
import Controller from "./libs/_funtions";
export default {
  data() {
    return {
      currentShowTabType: "created",
      currentShowCreatedType: null,
      myJoined: [],
      joinedPagination: {
        page: 1,
        finished: false,
        loading: false
      },
      myCreated: [],
      createdPagination: {
        page: 1,
        finished: false,
        loading: false
      }
    };
  },
  activated() {
    this.loadMyCreated();
  },
  methods: {
    switchTab({ target: { dataset } }) {
      this.currentShowTabType = dataset.type;
      switch (dataset.type) {
      case "created":
        if (this.myCreated.length == 0) {
          this.loadMyCreated();
        }
        break;
      case "joined":
        if(this.myJoined.length==0){
          this.loadMyJoined();
        }
        break;
      }
    },
    switchCreatedType({ target: { dataset } }) {
      if (!dataset.status) {
        return;
      }
      if (this.currentShowCreatedType == dataset.status) {
        this.currentShowCreatedType = null;
      } else {
        this.currentShowCreatedType = dataset.status;
      }

      this.createdPagination = {
        page: 1,
        finished: false,
        loading: false
      };
      this.myCreated = [];
      this.loadMyCreated();
    },
    loadMyCreated() {
      if (this.createdPagination.finished || this.createdPagination.loading) {
        return;
      }
      const Loading = Toast.loading();
      this.createdPagination.loading = true;
      let requestParmas = {
        page: this.createdPagination.page
      };
      if (this.currentShowCreatedType !== null) {
        requestParmas["is_review"] = Number(this.currentShowCreatedType);
      }
      $http.post("plugin.circle.frontend.circle.get-my-creation-circle-list", requestParmas).then(({ data: response, result, msg }) => {
        this.createdPagination.loading = false;
        Loading.close();
        if (result === 0) {
          Toast(msg);
          return;
        }
        if (response.last_page == response.current_page || response.data.length < response.per_page) {
          this.createdPagination.finished = true;
        }
        this.createdPagination.page++;
        this.myCreated.push(...response.data);
      });
    },
    loadMyJoined() {
      if (this.joinedPagination.finished || this.joinedPagination.loading) {
        return;
      }
      const Loading = Toast.loading();
      this.joinedPagination.loading = true;
      $http
        .post("plugin.circle.frontend.circle.get-my-add-circle-list", {
          page: this.joinedPagination.page
        })
        .then(({ data: response, result, msg }) => {
          this.joinedPagination.loading = false;
          Loading.close();
          if (result === 0) {
            Toast(msg);
            return;
          }
          if (response.last_page == response.current_page || response.data.length < response.per_page) {
            this.joinedPagination.finished = true;
          }
          this.joinedPagination.page++;
          this.myJoined.push(...response.data);
        });
    },
    quitCircle(itemIndex) {
      let circle = this.myJoined[itemIndex];
      Controller.quitCircle(circle.id).then(() => {
        this.myJoined.splice(itemIndex, 1);
      });
    },
    goToCircle(circleId) {
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
    goToMyCreatedCircle(circleId,reviewState){
      if(reviewState==1){
        this.goToCircle(circleId);
      }
    }
  },
  components: {
    cTitle,
    DList,
    CircleItem,
    CircleButton,
    VanImage: Image
  }
};
