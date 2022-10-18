import cTitle from 'components/title';


export default {
  data() {
    return {
      protocol:"",
      protocol_title: "",
    };
  },


  mounted() {

  },

  methods: {
    //协议信息
    getProtocolInfo() {
      let that = this;
      $http.get('setting.get-member-protocol', {}).then((response) => {
        if (response.result == 1) {
          that.protocol = response.data.content;
          that.protocol_title = response.data.title;
        }
      }, (response) => {
        console.log(response.msg);
      });

    },
  },
  activated() {
    this.getProtocolInfo();
  },

  components: { cTitle }


};