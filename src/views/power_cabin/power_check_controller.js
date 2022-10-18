//window.localStorage.isWeiXin
import cTitle from 'components/title';
export default {
  data() {
    return {};
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    toResult() {
      this.$router.push(this.fun.getUrl('powerResult'));
    }
  },
  activated() {}
};
