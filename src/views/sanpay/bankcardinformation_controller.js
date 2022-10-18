import cTitle from 'components/title';
import { scrollMixin } from 'utils/mixin';
export default {
  mixins: [scrollMixin], // 加载更多
  data() {
    return {
      radio: '1',
      list:[]
    };
  },
  methods: {
    goToAdd() {
      console.log('添加');
      this.$router.push(this.fun.getUrl('bankcardinadd',{}));
    },
    goToEdit(id) {
      console.log('编辑');
      this.$router.push(this.fun.getUrl('bankcardinedit', {id:id}));
    },
    getData() {
      $http.get('plugin.converge_pay.frontend.controllers.converge-pay-bank-card.get-bank-card-list',).then( (res) =>{
        if (res.result === 1) {
          this.list = res.data;
          console.log(this.list,'666565465446554');
          
        } else {
          this.$dialog.alert({message:res.msg});
        }
      }, function (response) {
        // error callback
      });
    }

  },
  activated() {
    this.getData();
  },
  components: {cTitle}
};
