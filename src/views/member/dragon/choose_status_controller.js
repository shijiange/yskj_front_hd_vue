import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      isActive: 1
    };
  },

  activated() {
    this.initData();
    this.$refs.choose_status.style.height = document.body.clientHeight + "px";
  },

  methods: {
    initData() {
      this.isActive = 1;
    },
    toShop() {
      this.isActive = 1;
      this.$router.push(this.fun.getUrl("companyLogon", { id: this.isActive }));
    },
    // toBuyer() {
    //   this.isActive = 2;
    //   this.$router.push(this.fun.getUrl("companyLogon", { id: this.isActive }));
    // },
    toperson() {
      this.isActive = 3;
      this.$router.push(this.fun.getUrl("companyLogon", { id: this.isActive }));
    },
    topeople() {
      this.isActive = 4;
      this.$router.push(this.fun.getUrl("personLogon", { id: this.isActive }));
    }
  },
  components: { cTitle }
};
