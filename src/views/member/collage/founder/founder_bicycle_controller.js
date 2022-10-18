import { scrollMixin } from "../../../../utils/mixin";
import { Toast } from "vant";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      listData: [],
      selectAll: false,
      alertShow: false,

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      disabled: false,

      price: 0,
      reward_amount: 0,

      lastItemKey: 0,
      errorPrice: 0,
      errorState: 0,

      currentTime: 0
    };
  },
  computed: {
    subscribe() {
      return (item) => {
        let str = "没有预约项目";
        let has_many_project_category = item.has_many_project_category;
        if (has_many_project_category.length != 0) {
          for (let i = 0; i < has_many_project_category.length; i++) {
            if (has_many_project_category[i].project_type == 1) {
              if (has_many_project_category[i].has_one_category && has_many_project_category[i].has_one_category.name) {
                str = has_many_project_category[i].has_one_category.name;
              }

            }
          }
        }
        return str;
      };
    }
  },
  created() {
    let date = new Date();
    this.currentTime = parseInt(date.getTime());
    this.getData();
  },
  methods: {
    handClickCheckbox(event) {
      console.log(event);
      let flag = true;
      let num = 0;
      this.listData.forEach(element => {
        if (element.checkbox == false) {
          flag = false;
        } else num++;
      });
      this.selectAll = flag;

      if (num >= 2) {
        this.disabled = true;
      } else this.disabled = false;

      this.estimateReward();

    },
    handSelectAll() {
      console.log(this.selectAll);
      this.listData.forEach(element => {
        element.checkbox = this.selectAll;
      });
    },
    sendBicycle() {
      this.alertShow = true;
    },
    setLastItemKey(key) {
      this.lastItemKey = key;

    },
    //获取预计佣金
    async estimateReward() {
      Toast.loading({
        message: "正在计算佣金",
        forbidClick: true
      });
      let data = [];
      for (let item of this.listData) {
        if (item.checkbox === true) {
          let obj = {};
          obj.project_shell_type = item.project_shell_type;
          obj.price = item.actual_amount;
          obj.use_member_id = item.use_member_id;
          obj.maker_parent_id = item.maker_parent_id;
          obj.participant_parent_id = item.participant_parent_id;
          data.push(obj);
        }
      }
      let res = await $http
        .post("plugin.collage.api.index.InformationData", {
          estimateReward: "estimateReward",
          data
        });
      Toast.clear();
      if (res.result != 1) {
        this.$set(this.listData[this.lastItemKey], "checkbox", false);
        Toast(res.msg);
        return;
      }
      this.price = res.data.estimateReward.price;
      this.reward_amount = res.data.estimateReward.reward_amount;
    },
    async getData() {
      Toast.loading({
        message: "请稍等",
        forbidClick: true
      });
      let res = await $http
        .post("plugin.collage.api.index.InformationData", {
          bikeRacing: "bikeRacing"
        });
      Toast.clear();
      if (res.result != 1) {
        Toast(res.msg);
        return;
      }

      let listData = res.data.bikeRacing.list.data;
      for (let item of listData) {
        item.checkbox = false;
      }
      this.listData = listData;
      this.isLoadMore = true;
      this.total_page = res.data.bikeRacing.list.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }

    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .post("plugin.collage.api.index.InformationData", {
            page: this.page,
            bikeRacing: "bikeRacing"
          })
          .then(res => {

            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.bikeRacing.list.data;
              for (let item of nextPageData) {
                item.checkbox = false;
              }
              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },
    async confirmCollage() {
      let project = [];
      let collageNum = 0;
      for (let item of this.listData) {
        if (item.checkbox == true) {
          console.log(item);
          collageNum++;
          let obj = {};
          obj.price = item.actual_amount;
          obj.maker_parent_id = item.maker_parent_id;
          obj.use_member_id = item.use_member_id;
          obj.project_id = item.id;
          obj.participant_parent_id = item.participant_parent_id;
          project.push(obj);
        }
      }
      if (collageNum < 2) {
        return Toast("必须选择两个才能拼单");
      }
      Toast.loading({
        message: "请稍等",
        forbidClick: true
      });
      let res = await $http
        .post("plugin.collage.api.index.InformationData", {
          collage: "collage",
          price: this.price,
          project
        });
      Toast.clear();
      if (res.result != 1) {
        Toast(res.msg);
        return;
      }
      console.log(res.data.collage);
      this.errorState = res.data.collage.state;
      this.errorPrice = res.data.collage.price;
      if (res.data.collage.state != 1) {
        this.alertShow = true;
      } else if (res.data.collage.state == 1) {
        Toast(res.data.collage.msg);
        setTimeout(() => {
          this.$router.go(-1);
        }, 500);

      }

    }
  }
};