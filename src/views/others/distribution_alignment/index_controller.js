import cMyswipe from "components/myswipe";
import cTitle from "components/title";
import { Toast } from 'vant';
import Vue from "vue";
import { Overlay } from "vant";
import { scrollMixin } from "utils/mixin";
Vue.use(Overlay);

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      rotation: [], //轮播图
      activity_list: [],
      advert_one: {},
      advert_two: {},
      advert_three: {},
      advert_four: {},
      is_rotation:0,

      name:'',
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      this.isLoadMore = false;
      $http
        .post("plugin.commission-activity.api.index.index", {}, "")
        .then(
          response => {
            if (response.result === 1) {
              this.isLoadMore = true;
              this.rotation = response.data.rotation;
              let activity = response.data.activity;
              this.activity_list = activity.data;
              this.page = activity.current_page;
              this.total_page = activity.last_page;
              let adv = response.data.adv;
              this.advert_one = adv.advert_one;
              this.advert_two = adv.advert_two;
              this.advert_three = adv.advert_three;
              this.advert_four = adv.advert_four;

              this.is_rotation = response.data.is_rotation;

              this.name = response.data.name;
              if(this.name) {
                this.fun.setWXTitle(this.name);
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    goBanner(i) {
      window.location.href = this.rotation[i].url;
    },
    gotoDetail(i) {
      this.$router.push(
        this.fun.getUrl("DistributionActivityDetail", {
          id: this.activity_list[i].id
        })
      );
    },
    tosearch() {
      this.$router.push(
        this.fun.getUrl("DistributionSearch", {
          fromHome: 1
        })
      );
    },
    gotoDiy(link) {
      if(!link) {
        return;
      }
      else{
        window.location.href = link;
      }
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .post("plugin.commission-activity.api.index.index", {
            page: this.page
          })
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.activity.data;
                this.activity_list = this.datas.concat(myData); //数组拼接
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
  components: { cTitle, cMyswipe }
};
