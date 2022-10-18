import cTitle from 'components/title';
export default {
  data() {
    return {
      activeName:'first'
    };
  },
  methods: {
    
    

  },
  activated() {
    this.toi = this.fun.getKeyByI();
    this.getIntegralInfo();
  },
  components: { cTitle }
};