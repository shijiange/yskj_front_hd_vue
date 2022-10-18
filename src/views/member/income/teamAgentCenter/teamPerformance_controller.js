import cTitle from 'components/title';
import { Toast } from 'vant';
import {scrollMixin} from 'utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      recordsList: [],
      activeName: 'team',
      api: 'plugin.team-dividend.api.results.getList',
      is_show: false,
      headTitle: '团队业绩',

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      this.recordsList = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    handleChange() {
      if(this.activeName === 'people') {
        this.headTitle = "个人业绩";
        this.api = 'plugin.team-dividend.api.results.getMyOrder';
      }else {
        this.headTitle = "团队业绩";
        this.api = 'plugin.team-dividend.api.results.getList';
      }
      this.initData();
      this.getData();
    },
    getData() {
      $http.get(this.api, {}, "...").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          if(this.activeName === 'people') {
            this.recordsList = response.data.data;
            this.total_page = response.data.last_page;
          }else {
            this.is_show = response.data.is_show;
            this.recordsList = response.data.data.data;
            this.total_page = response.data.data.last_page;
          }

        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get(this.api, {
          page: this.page
        }, '加载中...').then((response)=> {
          this.isLoadMore = true;
          if (response.result === 1) {
            let myData = response.data.data;
            if(this.activeName === 'people') {
              this.recordsList = this.recordsList.concat(myData);
            }else {
              this.recordsList = this.recordsList.concat(myData.data);
            }
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        }, (response)=> {
          // error callback
        });

      }
    },
  },
  components: {cTitle}
};