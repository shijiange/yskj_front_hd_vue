//window.localStorage.isWeiXin
import cTitle from 'components/title';
export default {
  data() {
    return {
      info:{},
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {},
  activated() {
    this.info=this.$route.params.info;
  }
};
