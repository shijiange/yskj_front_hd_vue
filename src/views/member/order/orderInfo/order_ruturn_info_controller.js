import cTitle from '../../../../components/title';
export default {
  data() {
    return {
      list: {}, // 数据对象
    };
  },
  methods: {
    getData() {
      $http.get('plugin.lease-toy.api.retreat.return.return-detail', { order_id: this.$route.params.id }).then(res => {
        if (res.result == 1) {
          this.list = res.data;
          console.log('8754545454');
        } else {
          this.$dialog.alert({message:res.msg});
        }
      });
    }
  },
  activated() {
    this.getData();
  },
  components: { cTitle}
};
