//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      show: false,
      datas: [],
      result: [],
      member_data: [],
      member: '',
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      family_user_id: '',
      card_id: '',
      arr: {}
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.Search();
      }
    },
    Search() {
      this.$nextTick(() => {
        document.getElementById('listWrap').scrollTop = '0px';
      });
      this.page = 1;
      let that = this;
      let json = {
        member: this.member,
        page: this.page
      };
      $http.get('plugin.energy-cabin.frontend.user-terminal.search-member', json, ' ').then(
        response => {
          if (response.result === 1) {
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    SearchMore() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          member: this.member,
          page: this.page
        };
        $http.get('plugin.energy-cabin.frontend.user-terminal.search-member', json, '加载中').then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              this.datas = this.datas.concat(myData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    closePop() {
      this.show = false;
      document.getElementById('listWrap').removeEventListener('scroll', function() {});
    },
    confirm() {
      const that = this;
      let json = {
        card_id: this.arr.id,
        family_user_id: this.family_user_id
      };
      $http.get('plugin.energy-cabin.frontend.user-terminal.add-family-member', json, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            Toast(response.msg);
            that.show = false;
            document.getElementById('listWrap').removeEventListener('scroll', function() {});
            that.getData();
          } else {
            that.show = false;
            document.getElementById('listWrap').removeEventListener('scroll', function() {});
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    delMember(id) {
      const that = this;
      let json = {
        card_id: this.arr.id,
        family_user_id: id
      };
      $http.get('plugin.energy-cabin.frontend.user-terminal.del-family-member', json, '加载中...').then(
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
    addMember() {
      this.show = true;
      let that = this;
      this.$nextTick(() => {
        let listWrap = document.getElementById('listWrap');
        listWrap.addEventListener('scroll', function() {
          if (listWrap.scrollHeight - listWrap.scrollTop === listWrap.clientHeight) {
            if (that.isLoadMore) {
              that.SearchMore();
            }
          }
        });
      });
      this.Search();
    },
    getData() {
      const that = this;
      $http.get('plugin.energy-cabin.frontend.user-terminal.get-family-member', {}, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            that.arr = response.data;
            that.member_data = that.arr.family_member;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    initData() {
      this.datas = [];
      this.loading = false;
      this.allLoaded = false;
      this.goload = true;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.show = false;
      this.member = '';
      this.radio = '';
      this.card_id = '';
      this.arr = {};
    }
  },
  activated() {
    window.scrollTo(0, 0);
    this.initData();
    this.card_id = this.$route.params.id;
    this.getData();
  }
};
