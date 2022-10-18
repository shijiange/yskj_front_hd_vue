import cTitle from 'components/title';
import { scrollMixin } from '../../../utils/mixin'; //引入加载更多
import { Toast } from 'vant';

export default {
  mixins: [scrollMixin],
  data() {
    return {
      show: false,
      result: [],
      keyword: '',
      levels: [],
      activeName: '0',
      upgrade_level: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas: [],
      level_name: '',
      radio: '',
      obj: {}
    };
  },

  activated() {
    this.getData();
    Toast('asdasdas');
  },
  mounted() {},

  methods: {
    confirm() {
      let that = this;
      let json = {
        member_id: this.activeName == '0' ? this.obj.uid : this.obj.has_one_member.uid,
        level_id: this.radio
      };
      $http.get('plugin.team-sales.api.team.upgrade', json, '加载中...').then(
        function(response) {
          if (response.result == 1) {
            Toast(response.msg);
            that.show=false;
            that.initData();
            that.getData();
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    update(item) {
      this.show = true;
      this.obj = item;
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.initData();
        this.getData();
      }
    },
    search() {
      this.initData();
      this.getData();
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
      let json = {
        member: this.keyword,
        level_id: this.activeName,
        page: this.page
      };
      let that = this;
      $http.get('plugin.team-sales.api.team.index', json, '加载中...').then(
        function(response) {
          if (response.result == 1) {
            that.levels = response.data.levels;
            that.upgrade_level = response.data.upgrade_level;
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
        let json = {
          member: this.keyword,
          level_id: this.activeName,
          page: this.page
        };
        $http
          .get('plugin.team-sales.api.team.index', json, '加载中')
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
