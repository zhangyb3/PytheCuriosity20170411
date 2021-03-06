var netUtil=require("../utils/netUtil.js");
var config=require("../utils/config.js");
var user=require("../utils/user.js");

var actions = netUtil.action;



/*
{
 getListFromNetData:function(netData){
 return netData;
 },
 handleItemInfo:function(item){

 }
 }
 */
/**
 * data里的数据结构:tabDatas:[],里面都是bean
 * @param page
 * @param urlDetail
 * @param params
 * @param tabIndex  这个listview属于哪个tab,一旦确定,不会更改
 * @param emptyMsg
 * @param setNetparams
 *  setNetparams: function (params) {
        params.userId =getApp().globalData.uid;
    },

 // 如果list数据是netData里一个字段,则更改此处
 getListFromNetData:function(netData){
        return netData;
    },

 // 数据的一些处理并刷新数据
 handldItemInfo:function(item){

        if(info.type==1){
            info.typeText='微课';
            info.classname='detail';
        }else  if(info.type==2){
            info.typeText='课单';
            info.classname='album';
        }

    },
 *
 */

/**
 * 加载滑动列表
 */
function loadList(page,list_type,basic_url,urlDetail,page_size,setNetparams,getListFromNetData,handldItemInfo,emptyMsg,requestMethod)
{

    console.log('load ' + list_type + " list ");

    page.data.currentPageIndex = 1;
    page.data.currentAction = netUtil.action.request_none;
    page.data.basic_url = basic_url;
    page.data.urlDetail = urlDetail;
    page.data.defaultPageSize = page_size;

    page.data.netStateBean = new netUtil.netStateBean();
    if(requestMethod != undefined){
        page.data.requestMethod = requestMethod;
    }else {
        page.data.requestMethod = "POST";
    }



    if(emptyMsg != undefined && emptyMsg !=null && emptyMsg.length>0){
        page.data.netStateBean.emptyMsg = emptyMsg;
    }

    if(list_type == 'index'){
        page.data.infos=[];//知列表
    }
    if(list_type == 'teacher'){
        page.data.ask_teacher_list = [];//老师列表
    }
    if(list_type == 'question'){
        page.data.questionsForAnswer = [];//问题列表
    }
    
    if(list_type == 'my_question'){
        page.data.personal_ask_list = [];//personal问题列表
    }
    if(list_type == 'my_question_answer'){
        page.data.personal_question_answer_list = [];//personal问题列表答案集
    }
    if(list_type == 'my_answered'){
        page.data.personal_answer_list = [];//personal已答列表
    }
    if(list_type == 'my_unanswer'){
        page.data.personal_not_answer_list = [];//personal未答列表
    }
    if(list_type == 'my_like_answer'){
        page.data.personal_like_answer_list = [];//like answer列表
    }
    if(list_type == 'my_like_teacher'){
        page.data.personal_like_teacher_list = [];//like teacher列表
    }

    page.onPullDownRefresh = function(){
        if(list_type == 'index'){
            page.data.infos=[];//知列表

            /**
             * 下拉时更新不同模式的知列表，requestSimpleList是异步加载，所以要有信号量判断是否已加载完成，否则无法使用另一种模式
             */
            if(wx.getStorageSync('index_load_type') == 'one' && wx.getStorageSync('end_load') == 'yes')
            {
                // page.data.urlDetail = page.data.urlDetail + '/two';
                page.setNetparams.q = null;
                page.setNetparams.gradeId = wx.getStorageSync(user.GradeID);
                page.getListFromNetData = getListFromNetData;
                page.data.basic_url = config.PytheRestfulServerURL;
                page.data.urlDetail = '/index/defaultList/two';
                wx.setStorageSync('end_load', 'no');
                netUtil.requestSimpleList(page,list_type,1,netUtil.action.request_refresh);
                wx.setStorageSync('index_load_type', 'two');
            }
            if(wx.getStorageSync('index_load_type') == 'two' && wx.getStorageSync('end_load') == 'yes')
            {
                // var urlstr = page.data.urlDetail;
                // urlstr = urlstr.slice(0,urlstr.length-4);
                // page.data.urlDetail = urlstr;
                page.setNetparams.q = null;
                page.setNetparams.gradeId = wx.getStorageSync(user.GradeID);
                page.getListFromNetData = getListFromNetData;
                page.data.basic_url = config.PytheRestfulServerURL;
                page.data.urlDetail = '/index/defaultList';
                wx.setStorageSync('end_load', 'no');
                netUtil.requestSimpleList(page,list_type,1,netUtil.action.request_refresh);
                wx.setStorageSync('index_load_type', 'one');
            }

        }
        if(list_type == 'teacher'){
            page.data.ask_teacher_list = [];//老师列表
        }
        if(list_type == 'question'){
            page.data.questionsForAnswer = [];//问题列表
        }

        if(list_type == 'my_question'){
            page.data.personal_ask_list = [];//personal问题列表
        }
        if(list_type == 'my_question_answer'){
            page.data.personal_question_answer_list = [];//personal问题列表答案集
        }
        if(list_type == 'my_answered'){
            page.data.personal_answer_list = [];//personal已答列表
        }
        if(list_type == 'my_unanswer'){
            page.data.personal_not_answer_list = [];//personal未答列表
        }
        if(list_type == 'my_like_answer'){
            page.data.personal_like_answer_list = [];//like answer列表
        }
        if(list_type == 'my_like_teacher'){
            page.data.personal_like_teacher_list = [];//like teacher列表
        }
        if(list_type != 'index')
        {
            netUtil.requestSimpleList(page,list_type,1,netUtil.action.request_refresh);
        }
        
    };

    page.onReachBottom = function(){
        netUtil.requestSimpleList(page,list_type,page.data.currentPageIndex +1,netUtil.action.request_loadmore);
    };

    page.onLoadMore = page.onReachBottom;
    // page.onRefresh = page.onPullDownRefresh;
    page.onRetry = function(){
        netUtil.requestSimpleList(page,list_type,1,netUtil.action.request_refresh);
    };

    page.setNetparams = setNetparams;
    page.getListFromNetData = getListFromNetData;
    page.handldItemInfo = handldItemInfo;
    netUtil.requestSimpleList(page,list_type,1,netUtil.action.request_refresh);

}




module.exports = {
    
    loadList : loadList,
}