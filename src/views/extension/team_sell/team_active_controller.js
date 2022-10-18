import cTitle from 'components/title';
import { scrollMixin } from '../../../utils/mixin'; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      activeName: '0',
      active: {},
      levels: [],
      active_explanation: '',
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas: [],
      level_name: ''
    };
  },

  activated() {
    this.getData();
  },
  mounted() {},

  methods: {
    toRecord() {
      this.$router.push(this.fun.getUrl('activeRecord'));
    },
    initData() {
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.datas = [];
      this.level_name = '';
    },
    handleClick() {
      this.initData();
      this.getData();
    },
    getData() {
      let url;
      let json;
      if (this.activeName == '0') {
        url = 'plugin.team-sales.api.active.index';
        json = {};
      } else {
        url = 'plugin.team-sales.api.active.level';
        json = {
          level_id: this.activeName,
          page: this.page
        };
      }
      let that = this;
      $http.get(url, json, '加载中...').then(
        function(response) {
          if (response.result == 1) {
            if (that.activeName == '0') {
              that.active = response.data.active;
              that.levels = response.data.levels;
              that.active_explanation = response.data.active_explanation;
            } else {
              that.total_page = response.data.member.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              response.data.levels.forEach((item, index, key) => {
                if (that.activeName == item.id) {
                  that.level_name = item.level_name;
                }
              });
              that.datas = response.data.member.data;
            }
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let url;
        let json;
        if (this.activeName == '0') {
          return; 
        } else {
          url = 'plugin.team-sales.api.active.level';
          json = {
            level_id: this.activeName,
            page: this.page
          };
        }
        $http
          .get(url, json, '加载中')
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.member.data;
                this.datas = this.datas.concat(myData); //数组拼接
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            response => {
              // error callback
            }
          )
          .catch(err => {
            console.error(err);
          });
      }
    }
  },
  components: { cTitle }
};
