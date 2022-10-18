import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      inputs: "",
      uids: [],
      memberInfo: {},
    };
  },
  activated() {
    this.initData();
    this.upToTop();
  },
  methods: {
    initData() {
      this.uids = [];
    },
    upToTop() {
      this.inputs = "";
      this.initData();
      this.gotoSearch();
    },
    goback() {
      if (this.uids.length > 0) {
        this.uids.pop();
        this.inputs = this.uids[this.uids.length - 1];
        if (!this.inputs) {
          this.inputs = "";
        }
        this.gotoSearch("no");
      }
    },
    toNext(id) {
      this.inputs = id;
      this.gotoSearch();
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.gotoSearch();
      }
    },
    gotoSearch(flag) {
      if (!flag && this.inputs && !this.uids.includes(this.inputs)) {
        this.uids.push(this.inputs);
      }
      $http
        .get("plugin.distribution-order.api.controller.get-member-children", {
          uid: this.inputs
        },' ')
        .then(
          response => {
            if (response.result === 1) {
              this.memberInfo = response.data;
              this.fun.setWXTitle(this.memberInfo.plugin_name);
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response.msg);
          }
        );
    }
  },
  components: { cTitle }
};
