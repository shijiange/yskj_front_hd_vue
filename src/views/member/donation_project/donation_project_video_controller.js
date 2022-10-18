import DList from "@/components/dlist";
export default {
  data() {
    return {
      loading: false,
      listData: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      neworkloading: false,

      video_list: [],
      title: "捐赠项目视频详情"
    };
  },
  created() {
    this.getListData();
    if (this.$route.query.id && this.$route.query.id > 0) {
      this.title = "个人捐赠项目视频详情";
      this.fun.setWXTitle(this.title);
    }
  },
  components: { DList },
  methods: {
    initPage() {
      this.loading = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.neworkloading = false;
    },

    getListData() {
      this.initPage();
      let url = "plugin.present-project.frontend.project.getProjectAll";
      let json = {};
      if (this.$route.query.id && this.$route.query.id != 0) {
        url = "plugin.present-project.frontend.project.getPersonAll";
        json.id = this.$route.query.id;
      }
      if (this.$route.query.time && this.$route.query.time != "") {
        json.time = this.$route.query.time;
      }
      $http.post(url, json, "loading").then(res => {
        if (res.result != 1) {
          return this.$toast(res.msg);
        }

        this.neworkloading = true;
        let video_list = [];
        if (res.data.list.data) {
          res.data.list.data.forEach(element => {
            if (element.change_video) {
              element.change_video.forEach(item => {
                let o = { name: element.title, url: item, id: element.id };
                video_list.push(o);
              });
            }
          });
        }

        this.video_list = video_list;

        this.total_page = res.data.list.last_page;
        if (this.total_page <= 0) {
          this.total_page = 1;
        }
        if (this.total_page <= this.page) {
          this.loading = true;
          this.isLoadMore = false;
        }
      });
    },
    getMoreData() {
      if (this.loading === true || this.isLoadMore === false) {
        return;
      }

      // console.log('加载更多启动');
      this.loading = true; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.isLoadMore = false;
        //console.log('没了');
      } else {
        this.page += 1;
        let json = {
          page: this.page
        };
        let url = "plugin.present-project.frontend.project.getProjectAll";
        if (this.$route.query.id && this.$route.query.id != 0) {
          url = "plugin.present-project.frontend.project.getPersonAll";
          json.id = this.$route.query.id;
        }
        if (this.$route.query.time && this.$route.query.time != "") {
          json.time = this.$route.query.time;
        }
        $http
          .post(url, json, "...")
          .then(res => {
            this.loading = false;
            if (res.result == 1) {
              let nextPageData = res.data.list.data;
              //this.listData = this.listData.concat(nextPageData); //进行数组拼接
              let video_list = [];
              if (nextPageData) {
                nextPageData.forEach(element => {
                  if (element.change_video) {
                    element.change_video.forEach(item => {
                      let o = { name: element.title, url: item, id: element.id };
                      video_list.push(o);
                    });
                  }
                });
              }

              this.video_list.push(...video_list);
            } else {
              this.page = this.page - 1;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
