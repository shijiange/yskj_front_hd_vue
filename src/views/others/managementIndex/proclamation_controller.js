import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      tapStart:false,
      show:false,
      showCard:false,
      producer:[],
      goods_list:[]
    };
  },
  deactivated(){
    
  },
  activated() {
    this.id = this.$route.params.id;
    this.getData();
  },
  methods: {
    onClickLeft() {
      this.showCard = false;
    },
    getData() {
      $http
        .get(
          "plugin.producer.frontend.producer.getProducerCenterById",
          { producer_id: this.id },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.producer = response.data.producer;
            this.goods_list = response.data.goods_list.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  components: { cTitle }
};
