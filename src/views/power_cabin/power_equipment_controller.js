//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      page: 1,
      isLoadMore: true, //判断是否能够加载更多
      last_page: 0, //总页数,
      datas: [],
      total:1,
      show:false,
      qr_code:'',
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    initData(){
      this.show=false;
      this.qr_code='';
    },
    toRecord(id) {
      this.$router.push(this.fun.getUrl('powerNotes', { id: id }));
    },
    Delete(id){
      const that = this;
      let json={
        id:id
      };
      $http.get('plugin.energy-cabin.frontend.dealer-terminal.del-equipment', json, '加载中...').then(
        function(response) {
          if (response.result === 1) {

            Toast(response.msg);
            that.getData();
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    expand(item){
      let that=this;
      item.checked=!item.checked;
      that.$forceUpdate();
      if(item.checked){
        let json={
          id:item.id
        };
        $http.get('plugin.energy-cabin.frontend.dealer-terminal.get-device-data', json, '加载中...').then(
          function(response) {
            if (response.result === 1) {
              item.info=response.data;
              that.$forceUpdate();
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
      }
    },
    scan(item){
      this.show=true;
      this.qr_code=item.qr_code_url;
    },
    getMoreData() {
      let json = {
        page:this.page
      };
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.last_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http
          .get('plugin.energy-cabin.frontend.dealer-terminal.get-equipment-list', json, "加载中")
          .then(response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              response.data.data.forEach((item,index,key) => {
                item.checked=false;
                item.info={};
              });
              this.datas = this.datas.concat(response.data.data);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              return;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    getData() {
      const that = this;
      let json={
        page:this.page
      };
      $http.get('plugin.energy-cabin.frontend.dealer-terminal.get-equipment-list', json, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.last_page = response.data.last_page;
            that.total=response.data.total;
            if (!that.last_page) {
              that.last_page = 0;
            }  
            that.datas = response.data.data;
            that.datas.forEach((item,index,key) => {
              item.checked=false;
              item.info={};
            });
          
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    toBind() {
      this.$router.push(this.fun.getUrl('bindEquipment'));
    }
  },
  activated() {
    this.initData();
    this.getData();
  }
};
