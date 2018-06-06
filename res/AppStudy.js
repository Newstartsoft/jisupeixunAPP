//全局变量
var javaserver = "http://180.76.156.234:9187";

//文件的辅助方法
//打开试卷
function openSj(data,arrangeId) {
  try{
    bPlayer.close();
  }catch(e){}
    sysUserInfo=getUserInfo();
    //历史试卷
    var gotoUrl = "";
    if(arrangeId==99||arrangeId=="99"){
        //随机卷
        if(data.exampaper.paper_Random == "0"){
            window.location.href =javafile+"/resources/exam/"+data.paperId+","+data.randomCount+"/"+((data.randomNum==undefined)?1:data.randomNum)+".html"+"?f=app&userid="+sysUserInfo.user_ID+"&id=99&scoreId="+data.scoreId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
            //gotoUrl = javafile+"/resources/exam/"+data.paperId+","+data.randomCount+"/"+((data.randomNum==undefined)?1:data.randomNum)+".html"+"?f=app&userid="+sysUserInfo.user_ID+"&id=99&scoreId="+data.scoreId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
       //固定卷
        }else{
            window.location.href =javafile+data.exampaper.url+"?userid="+sysUserInfo.user_ID+"&f=app&id=99&scoreId="+data.scoreId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
            //gotoUrl = javafile+data.exampaper.url+"?userid="+sysUserInfo.user_ID+"&f=app&id=99&scoreId="+data.scoreId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
        }
    //打开试卷
    }else{
        //随机卷
        if(data.paper_Random == "0"){
             data.url =  getPaperUrl(data.url,data.paperCount)
             window.location.href =javafile+data.url+"&f=app&userid="+sysUserInfo.user_ID+"&arrangeId="+arrangeId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
             //gotoUrl = javafile+data.url+"&f=app&userid="+sysUserInfo.user_ID+"&arrangeId="+arrangeId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
         }else{
            window.location.href =javafile+data.url+"?random=0&f=app&userid="+sysUserInfo.user_ID+"&arrangeId="+arrangeId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
            //gotoUrl = javafile+data.url+"?random=0&f=app&userid="+sysUserInfo.user_ID+"&arrangeId="+arrangeId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
        }
    }
    // if(gotoUrl != ""){
    //   api.openWin({
    //       name: 'kaoshi',
    //       animation:{
    //           type:"flip",                //动画类型（详见动画类型常量）
    //           subType:"from_right",       //动画子类型（详见动画子类型常量）
    //           duration:300                //动画过渡时间，默认300毫秒
    //       },
    //       url: gotoUrl,
    //       pageParam: {
    //           name: '考试'
    //       }
    //   });
    // }
}
//打开题库
function openTi(obj){
    //$.toast("暂未开放");
    try{
      bPlayer.close();
    }catch(e){}
    var arrangeId=QueryString("arrangeId");
    //window.location.href =domain+"/member/index.html#/home/stuquelist/"+obj.knowledge_Id+"/"+arrangeId+"&arrangeId="+arrangeId+"&passtype="+obj.know_select_que_type+"&pass="+obj.know_select_que_num+"&typeId=0&knowledgeName="+obj.knowledge_Name;
    //:xid/:knowledgeId/:passtype/:pass/:typeId/:knowledgeName/:arrangeId/:userId
    sysoUserInfo = getUserInfo();
    window.location.href =domain+"/member/index.html#/home/stuquelist/"+arrangeId+"/"+obj.knowledge_Id+"/"+obj.know_select_que_type+"/"+obj.know_select_que_num+"/0/"+obj.knowledge_Name+"/"+arrangeId+"/"+obj.knowledge_Id+"/"+obj.knowledge_Name+"/0/"+sysoUserInfo.user_ID+"/0/phone?a=" + sysoUserInfo.user_ID;
}
//获得随机卷的地址
function getPaperUrl(paperUrl,coun){
        var paperReadNum;
        var paperUrlList = paperUrl.split("/");
        var paperNum = paperUrlList[paperUrlList.length-1].split(".")[0];
        if(paperNum != undefined && paperNum != null && paperNum != "" ){
            paperNum;
            paperReadNum = parseInt(Math.random() * coun);
            paperUrlList[paperUrlList.length-1] = (paperReadNum == 0)? "1.html": paperReadNum+".html";
            paperUrl = paperUrlList.join("/");
        }
        return paperUrl+"?random="+((paperReadNum== 0)?1:paperReadNum);
    }
// 编码
function jisuEncode(txt){
    return base64encode(encodeURI(txt));
}
// 解码
function jisuDecode(txt){
    return decodeURI(base64decode(txt));
}
//**********************************************************************
//打开课程播放界面
//基础功能
//目前还有细节未优化，包括：
//1、当一个课程学习完成后，自动系一个章节
//2、视频暂停，计时器自动停止
//**********************************************************************
var csm = {};//播放记忆存储容器
csm.list=[];
var Tstate = 1; // 计时器，0暂停，1正常
var pedding=false;
var goTime=10;//进度提交间隔（分钟）
var timer1=null;//计时器
var newStudyDetailsJson={timeStart:"",timeEnd:"",cousreid:"",csid:"",sectionName:"",courseType:"",dateLearn:""};
$(document).on("pageInit", "#renwu_detail", function(e, id, $page) {
    //单独的计时器，每隔10分钟，提交一次进度
    timer1=window.setInterval(function automatic(){
        tongbu("aaa");
    },1000*60*goTime);
    newStudyDetailsJson={timeStart:"",timeEnd:"",cousreid:"",csid:"",sectionName:"",courseType:"",dateLearn:""};
    newStudyDetailsJson.timeStart=new Date().format("yyyy-MM-dd hh:mm:ss");
    newStudyDetailsJson.dateLearn=newStudyDetailsJson.timeStart;
    playerHeight = $("#kecheng_play_mian_top_play").height();
    //浏览器刷新
    window.onbeforeunload =function(){
        tongbu("aaa",true);
        setTimeout(function() {
            return true;
        }, 2000);
    }
    //判断是否收藏  修改样式
    function collectionStatusJudge(id){
        if(id!=null&&id!=undefined&&id!=""){
            $("#collectionbutton").css("color","#39f");
            $("#collectionbutton span").html("已收藏");
        }else{
            $("#collectionbutton").css("color","#000");
            $("#collectionbutton span").html("收藏");
        }
    }
	//后腿事件
    $(window).on('popstate', function () {
          if(!pedding){
                pedding=true;
                tongbu("aaa");
          }
          if(CKobject&&CKobject.getObjectById('ckplayer_a1'))
          CKobject.getObjectById('ckplayer_a1').videoPause();
          try{
            bPlayer.close();
          }catch(e){}
     });
    csm = {};//播放记忆存储容器
    csm.list=[];
   // $.showPreloader();//显示Loading
    var PlayCourse = GetlocalStorage("PlayCourse"); //获得课程对象

    //如果从微信跳转，只有课程id
    //需要从新获取课程信息
    if((PlayCourse==""||PlayCourse==null||PlayCourse==undefined||PlayCourse.courseId!=QueryString("courseId"))&&QueryString("courseId")){
         openKe_collection(QueryString("courseId"),"微信学课");
         PlayCourse=sysUserInfo;
         SetlocalStorage("PlayCourse",JSON.stringify(PlayCourse));
    }
    //*****************************
    //1、绑定界面中显示的内容
    //*****************************
    csm.key = PlayCourse.courseId;
    var courseCollectionsId ="";
    //是否收藏课程
    getAjax(javaserver+"/course/findCourseProperties",{
			courseId : PlayCourse.courseId,
            arrangeId:QueryString("arrangeId"),
			userId : getUserInfo().user_ID
		},function(data) {
			var courseInfoJson = data.data;
			if(courseInfoJson != undefined){
				courseCollectionsId = courseInfoJson.collections_id;
				// 判断是否有收藏该课程
				collectionStatusJudge(courseCollectionsId);
			}
		},"","json");
    $("#collectionbutton").click(function() {
					getAjax(javaserver+"/course/modifyCollectionCourse",{
						userId : getUserInfo().user_ID,
                        arrangeId:QueryString("arrangeId"),
						collectionsId : courseCollectionsId,
						courseId : PlayCourse.courseId,
						courseName:PlayCourse.courseName
					},function(data){
						var collectionsJson = data;
						if(collectionsJson.data == undefined){  //取消收藏
							courseCollectionsId = undefined;
						}else
						{
							courseCollectionsId = collectionsJson.data.id;
						}
						collectionStatusJudge(courseCollectionsId);
					},"","json");
	})

    //课程名称
    var coursename=PlayCourse.courseName.replace(/<\/?[^>]*>/g,'');

     if(isWeiXin()){
            $("title").html(coursename);
     }
    $("#cname").text(coursename.length>15?coursename.substring(0,12)+"...":coursename)

    $("#lecturer").text(PlayCourse.lecturer);
    if(PlayCourse.style== 1){
        PlayCourse.detailedJSON = jisuDecode(PlayCourse.detailedJSON);
    }
    var detailedJSON = JSON.parse(PlayCourse.detailedJSON);//课程章节目录
    var zjhtml = "";//章节转HTML
    for (var i =0; i< detailedJSON.length ; i++) {
        zjhtml +="<div class=\"content-block-title\">"+detailedJSON[i].chapter+"</div>";
        var kelist = detailedJSON[i].content;//课程章节目录
        zjhtml += "<div class=\"list-block\"><ul>";
        if(kelist.length >0){
            for (var j = 0; j<kelist.length; j++) {
               var csobj = kelist[j];
               if(csobj.CSTYPE == 8){
                    csobj.fileTxt = jisuEncode(csobj.fileTxt);
                    csobj.CSTITLE = jisuEncode(csobj.CSTITLE);
               }
               //拼接下载按钮
               var xiazaihtml = "";
               if(csobj.stypename == "视频"){
                  var chapterobj = eval(csobj.chapterJson);
                  try {
                    if(chapterobj[0].fileType != "m3u8"){
                      xiazaihtml = "<div class='button ' style=\"margin-left: -0.5rem;\"><i class=\"iconfont icon-xiazai\" style=\"font-size:18px;\" onclick=\"downfile({url: '"+chapterobj[0].filepreview+"',savePath: 'fs://极速培训/"+csobj.CSFILEID + "/" + chapterobj[0].fileName +"',iconPath:'"+chapterobj[0].filecover+"',cache: true,allowResume: true,title: '"+csobj.CSNAME+"',networkTypes: 'all'})\"> </i></div>";
                    }
                  } catch (e) {

                  } finally {

                  }

               }
               zjhtml+= "<li class=\"item-content\" id='kecheng_"+csobj.CSID+"'><div class=\"item-inner\" onClick='bofang("+JSON.stringify(csobj)+")'><div class=\"item-title\" style=\"min-width:75%;\">"+csobj.CSNAME.replace(/<\/?[^>]*>/g,'')+"</div>";
               if(csobj.CSTYPE == "1" ||csobj.CSTYPE == 1 || csobj.CSTYPE == "2" || csobj.CSTYPE == 2)
               {
                 zjhtml += "<div style=\"font-size:0.5rem;\"><span id='kecheng_"+ csobj.CSID +"_learnTime'>0</span>/<span id='kecheng_"+ csobj.CSID +"_cstime'>"+  csobj.CSTIME+":00</span> </div>";
               }
               zjhtml += "<div class=\"item-after\"></div></div>"+xiazaihtml+"</li>";
            }
        }
        else{
            zjhtml +="暂未设置课程";
        }
        zjhtml += "</ul></div>";
    }
    $("#kechengmingxi").html(zjhtml);
    if(PlayCourse.courseDetailed ==""){
        PlayCourse.courseDetailed = "<center>暂未填写课程简介</center>";
    }
    $("#courseDetailed").html(PlayCourse.courseDetailed);

    if(!QueryString("courseId")){
        $("#gongsi").html(getUserInfo().organization_Name);
    }
    //*****************************
    //2、读取课程记忆
    //*****************************
    if(!QueryString("courseId")){
                        getAjax(javaserver+"/course/findCourseStudyRecord",
       {
          courseId : PlayCourse.courseId,
          userId : getUserInfo().user_ID,
          arrangeId:QueryString("arrangeId")
        },
            function(data) {
                var dataobj =  eval( '(' + data + ')' );

                if (dataobj.errorcode != "0") {
                    $.toast('播放记忆读取异常！');
                    return;
                }
                var studyDetailsJson = dataobj.data;//确定是否有学习记录
                if (studyDetailsJson == undefined) {
                   studyDetailsJson = {};
                }

                if(studyDetailsJson.hasOwnProperty("id")) //有ID，说明有记录，无ID创建一个ID，已被下次记录
                {
                    jiluid = studyDetailsJson.id;
                }
                else{
                    jiluid = (((1+Math.random())*0x10000)|0).toString(16) + (((1+Math.random())*0x10000)|0).toString(16);//随机产生个10位字符串
                }
                var studyJsonDetailsJson = eval( '(' + studyDetailsJson.json_details + ')' );//解析记忆内容
                //console.log(studyJsonDetailsJson);//这里才是真正有用的东西
                if (studyJsonDetailsJson != null) {
                    // 异步读取书签正常
                    if (studyDetailsJson != undefined && studyDetailsJson != null
                                        && studyDetailsJson.json_details != ""
                                        && studyDetailsJson.json_details != "null") {
                        //console.log("读取学习记录");
                        csm = studyJsonDetailsJson;
                        //进入，如果已学习提交进度（防止不同任务同一课程不提交进度）
                        //isConfirmTongbu("aaa");
                        //console.log("已同步学习时间");
                    }
                    for (var i = 0; i < studyJsonDetailsJson.list.length; i++) { //遍历记录修改状态图标
                        // 学过的小节编号
                        var sectionId = studyJsonDetailsJson.list[i].pid;
                        // 是否完成该小节
                        var sectionLearnState = studyJsonDetailsJson.list[i].pstate;
                        // 小节学习了多长时间
                        var sectionTime_m = parseInt(studyJsonDetailsJson.list[i].learnTime/60);
                        var sectionTime_s = studyJsonDetailsJson.list[i].learnTime%60 <10 ? "0"+studyJsonDetailsJson.list[i].learnTime%60 : studyJsonDetailsJson.list[i].learnTime%60;
                        $("#kecheng_"+ sectionId +"_learnTime").html(sectionTime_m+":"+sectionTime_s);
                        if (sectionLearnState == "1") { //状态为1代表学习完成
                           $("#kecheng_"+sectionId).find(".item-after").html("<i class=\"iconfont icon-shenhetongguo\" title=\"已学完\" style=\"color:#339966\"></i>");
                        }
                        else //有学习记录，但没完成，改为学习中
                        {
                            $("#kecheng_"+sectionId).find(".item-after").html("<i class=\"iconfont icon-icon27\" title=\"学习中\" style=\"color:#39f\"></i>");
                        }
                    }
                }

                 //$.hidePreloader();//隐藏Loading
                //*****************************
                //3、正是开始播放课程内容
                //*****************************
                var isPaper=false;
                if (csm.playpid) {
                  //下拉刷新处理(重新查询绑定)
                   for (var i = 0; i < csm.list.length; i++) {
                        //有播放的小节id有对应的学习记录，小节是试卷，已完成
                        if(csm.playpid==csm.list[i].pid&&csm.list[i].ptype==3&&csm.list[i].pstate==1){
                            isPaper=true;
                            break;

                        }
                   }
                   //当前小结是试卷，并且试卷已完成
                   if(!isPaper){
				        if($("#kecheng_" + csm.playpid)){
					        $("#kecheng_" + csm.playpid).click();
					        $("#kecheng_" + csm.playpid).click();
				        }else{
					        $("#kechengmingxi .item-content").eq(0).click();
                            $("#kechengmingxi .item-content").eq(0).click();
				        }
                   }
                } else { // 发现记忆的课程小节不存在的时候，跳到第一小节
                    // 找不到播放记忆，默认播放第一个
                    if ($("#kechengmingxi .item-content").length > 0) {
                        $("#kechengmingxi .item-content").eq(0).click();
                        $("#kechengmingxi .item-content").eq(0).click();

                    } else {
                        $.toast('课程还未增加内容哦！');
                    }
                }
        });
        }else{
             // 没有记忆，默认播放第一个
            if ($("#kechengmingxi .item-content").length > 0) {
                $("#kechengmingxi .item-content").eq(0).click();
                $("#kechengmingxi .item-content").eq(0).click();

            } else {
                $.toast('课程还未增加内容哦！');
            }
        }
    //底部弹出清晰度列表
    $(".qingxidu").on("click", function () {
      var btnArr = [];
      var btnUrlArr = [];
      $(".videotypelist li").each(function () {
        var classN = $(this).attr("class");
        //var qxdStr = "BQGQCQLG";
        if(classN == "BQ"){
          btnArr.push("标清");
          btnUrlArr.push($(this).attr("data"));
        }else if(classN == "GQ"){
          btnArr.push("高清");
          btnUrlArr.push($(this).attr("data"));
        }else if(classN == "CQ"){
          btnArr.push("超高清");
          btnUrlArr.push($(this).attr("data"));
        }else if(classN == "LG"){
          btnArr.push("蓝光");
          btnUrlArr.push($(this).attr("data"));
        }
      });
      if(btnArr.length > 0){
        api.actionSheet({
            title: '选择清晰度',
            cancelTitle: '取消',
            buttons: btnArr
          }, function(ret, err) {
            var index = ret.buttonIndex - 1;
            switchVideo(btnUrlArr[index], btnArr[index]);
          });
      }else {
        api.actionSheet({
            title: '选择清晰度',
            destructiveTitle:'无清晰度',
            cancelTitle: '取消'
          }, function(ret, err) {
            var index = ret.buttonIndex;
          });
      }

    });
});
//播放不同清晰度的视频
function switchVideo(okayUrl,title){
    //关闭层
    $.closeModal('.popover-qingxidu');
   //判断清晰度
   $(".qingxidu").text(title);//清晰度
   //视频播放
   $("#kecheng_play_mian_top_play").show();
   $("#playText").hide();
   $("#kechengContent").css("top","12rem");
   mainplayer("kecheng_play_mian_top_play", 634, okayUrl);
}
//开始播放记忆课程
function bofang(xiaojie) {
     //停止上一个课程的计时器
    //if(jisuJSQ != null){
     //       clearInterval(jisuJSQ);
    //        jisuJSQ = null;
   // }
  $(".qingxidu").hide();
    //更新播放记录（本地）
    csm.playpid = xiaojie.CSID;

   // console.log(xiaojie);
    var sectionUrl = "";//文件地址
    // 判断非ckt 的文件
    if(xiaojie.hasOwnProperty("CSFILEID")&&(xiaojie.CSTYPE==1||xiaojie.CSTYPE=='1')&&xiaojie.CSURLNAME.substr(xiaojie.CSURLNAME.lastIndexOf('.')).indexOf('.html')==-1){ //有多版本的情况下
       // console.log("xxxxxxxxxx");
        //获取清晰度
        getAjax(javaserver+"/course/findDefinition", {
               upid:xiaojie.CSFILEID
        }, function(data) {

          $(".qingxidu").show();
            var jsonlist = JSON.parse(data);
            if(jsonlist.errorcode == "0"){
                    //console.log(jsonlist.datas);
                    var BDvideoList = new Array();
                    var QNvideoList = new Array();
                    var ServerVideoList = new Array();
                    $.each(jsonlist.datas,function(i,item)
                    {
                        var videoType = item.Name.split('_')[0];  //获取视频的清晰度  LG 蓝关  GQ 高清 CQ 超清  BQ 标清
                        if(item.Name.indexOf('enc') > 0){  //名称中含有encryption，视频则为加密视频
                            console.log(item.Name+"因版权原因,本视频仅对APP或PC端进行播放！");
                            return true;
                        }
                        var videoYuan = item.Yuan;
                        var videodesc = 1;  //默认标清
                        var videoQXD = "标清(420P)";  //默认标清
                        if (videoType == "LG") {
                              videodesc = 4;
                              videoQXD = "蓝光";
                              videosite = "LG";
                          } else if (videoType == "GQ") {
                              videodesc = 2;
                              videoQXD = "高清(720P)";
                              videosite = "GQ";
                          } else if (videoType == "CQ") {
                              videodesc = 3;
                              videoQXD = "超高清(1080P)";
                              videosite = "CQ";
                          } else if(videoType == "BQ"){
                              videodesc = 1;
                              videoQXD = "标清";
                              videosite = "BQ";
                          } else{
                              videodesc = 5;
                              videoQXD = "原清";
                              videosite = "BQ";
                        }
                        if (videoYuan == "1") { //百度云
                              BDvideoList.push({
                                  file: item.filepreview,
                                  desc: videodesc,
                                  qxd: videoQXD,
                                  site: videosite
                              });
                          } else if (videoYuan == "2") { //七牛云
                              QNvideoList.push({
                                  file: item.filepreview,
                                  desc: videodesc,
                                  qxd: videoQXD,
                                  site: videosite
                              });
                          } else {  //本地服务器
                              ServerVideoList.push({
                                  file: item.filepreview,
                                  desc: videodesc,
                                  qxd: videoQXD,
                                  site: videosite
                              });
                          }
                    });
                    for (var i = 0; i < BDvideoList.length; i++)
                    {
                        for (var j = i; j < BDvideoList.length-1; j++)
                        {
                            if (BDvideoList[i].desc > BDvideoList[j].desc)
                            {
                                var temp = BDvideoList[i];
                                BDvideoList[i] = BDvideoList[j];
                                BDvideoList[j] = temp;
                            }
                        }
                    }
                    for (var i = 0; i < QNvideoList.length; i++)
                    {
                        for (var j = i; j < QNvideoList.length-1; j++)
                        {
                            if (QNvideoList[i].desc > QNvideoList[j].desc)
                            {
                                var temp = QNvideoList[i];
                                QNvideoList[i] = QNvideoList[j];
                                QNvideoList[j] = temp;
                            }
                        }
                    }
                    for (var i = 0; i < ServerVideoList.length; i++)
                    {
                        for (var j = i; j < ServerVideoList.length-1; j++)
                        {
                            if (ServerVideoList[i].desc > ServerVideoList[j].desc)
                            {
                                var temp = ServerVideoList[i];
                                ServerVideoList[i] = ServerVideoList[j];
                                ServerVideoList[j] = temp;
                            }
                        }
                    }
                    var videoHtml = "";
                    if(BDvideoList != null && BDvideoList.length>0){
                        videoHtml += "<li><a class='list-button item-link' style=\"border-bottom: 1px #ddd solid; cursor: default;color:#999\">百度云</a></li>";
                        $.each(BDvideoList, function(i, item){
                            videoHtml += "<li class=\"" + item.site + "\" data=\""+item.file+"\" ><a href='#' class='list-button item-link'  onclick='switchVideo(\""+item.file+"\",\""+item.qxd+"\")'>"+item.qxd+"</a></li>";
                        });
                    }
                    if(QNvideoList != null && QNvideoList.length>0){
                        videoHtml += "<li><a class='list-button item-link' style=\"border-bottom: 1px #ddd solid; cursor: default;color:#999\">七牛云</a></li>";
                        $.each(QNvideoList, function(i, item){
                            videoHtml += "<li class=\"" + item.site + "\" data=\""+item.file+"\" ><a class='list-button item-link' href='#' onclick='switchVideo(\""+item.file+"\",\""+item.qxd+"\")'>"+item.qxd+"</a></li>";
                        });
                    }

                    if(ServerVideoList != null && ServerVideoList.length>0){
                        videoHtml += "<li><a class='list-button item-link' style=\"border-bottom: 1px #ddd solid; cursor: default;color:#999\">本地</a></li>";
                        $.each(ServerVideoList, function(i, item){
                            videoHtml += "<li class=\"" + item.site + "\" data=\""+item.file+"\" ><a class='list-button item-link' href='#' onclick='switchVideo(\""+item.file+"\",\""+item.qxd+"\")'>"+item.qxd+"</a></li>";
                        });
                    }
                    if(videoHtml != ""){
                        $(".videotypelist").html(videoHtml);
                        var okayUrl ="";
                        var qxd ="";
                        //寻找多版本视频中，默认播放的地址（优先级与PC端有所区别）
                        if($(".videotypelist li[class='BQ']").eq(0).length > 0){
                              okayUrl = $(".videotypelist li[class='BQ']").eq(0).attr("data");
                              qxd =  $(".videotypelist li[class='BQ']").eq(0).text();
                        }else if($(".videotypelist li[class='GQ']").eq(0).length > 0){
                              okayUrl = $(".videotypelist li[class='GQ']").eq(0).attr("data");
                              if(qxd == ""){
                                qxd =  $(".videotypelist li[class='BQ']").eq(0).text();
                              }
                        }else if($(".videotypelist li[class='CQ']").eq(0).length > 0){
                              okayUrl = $(".videotypelist li[class='CQ']").eq(0).attr("data");
                              if(qxd == ""){
                                qxd =  $(".videotypelist li[class='BQ']").eq(0).text();
                              }
                        }else if($(".videotypelist li[class='LG']").eq(0).length > 0){
                              okayUrl = $(".videotypelist li[class='LG']").eq(0).attr("data");
                              if(qxd == ""){
                                qxd =  $(".videotypelist li[class='BQ']").eq(0).text();
                              }
                        }else if($(".videotypelist li[class='bendi']").eq(0).length > 0){
                              okayUrl = $(".videotypelist li[class='bendi']").eq(0).attr("data");
                              if(qxd == ""){
                                qxd =  $(".videotypelist li[class='BQ']").eq(0).text();
                              }
                        }
                        else
                        {
                            qxd ="临时";
                            //文件转化中或转化出错了！(先播放转化前的版本)
                            okayUrl = jsonlist.datas[0].URL;
                        }
                        switchVideo(okayUrl,qxd);
                    }else{
                        qxd ="临时";
                        okayUrl = jsonlist.datas[0].URL;
                        //$.toast('无法解析到课程播放视频！');
                        //$(".qingxidu").removeClass("qingxidu");
                    }
                }else{
                     $.toast('课程视频解析错误！');
                    $(".qingxidu").removeClass("qingxidu");
                }
        });
        // 清除计时器
        clearInterval(jisuJSQ);
        jisuJSQ = null;
        jsqkq = false;
        // 防止暂停时值被更新
        setTimeout(function() { Tstate = 1;},500);
        //判断是否需要播放计时，如果需要启动计时器
        learningJSQ(xiaojie);
        //修改播放课程图标显示
        $("#kechengmingxi .item-content").removeClass("active");
        $("#kecheng_"+xiaojie.CSID).addClass("active");
      return;
    }
    else{ //v1.0录入的数据
        sectionUrl = xiaojie.CSURL;//文件地址
    }

    var CSTIME = xiaojie.CSTIME;//要求学习时间

    // 根据小节判断接下来的动作
    switch (xiaojie.CSTYPE) {
    case '1':
    case 1:
        // 视频类型
        $("#kecheng_play_mian_top_play").show();
        $("#playText").hide();
        $("#kechengContent").css("top","12rem");
        mainplayer("kecheng_play_mian_top_play", 634, sectionUrl);
        break;
    case '2':
    case 2:
        // 文档类型
        $("#kechengContent").css("top", "1.7rem");
        $("#kecheng_play_mian_top_play").hide();
        $("#playText").show();
        if(CKobject&&CKobject.getObjectById('ckplayer_a1')){
    			CKobject.getObjectById('ckplayer_a1').videoPause();
    		}
        mainplayer("playText", 634, sectionUrl);
        break;
    case '3':
    case 3:
        // 考试类型
        $("#kecheng_play_mian_top_play").show();
        $("#playText").hide();
        $("#kechengContent").css("top","12rem");
        $("#kecheng_play_mian_top_play").html("<div class='shanguang'><img src='../../res/img/logo_fff.png' alt='加载中...'><div class='baiguang'></div></div>");
        playSectionalExamination(xiaojie);
        break;
    case '4':
    case 4:
        $("#kecheng_play_mian_top_play").hide();
        $("#playText").show();
        $("#kechengContent").css("top","1.7rem");
        if(CKobject.getObjectById('ckplayer_a1')){
			CKobject.getObjectById('ckplayer_a1').videoPause();
			//mainplayer("playText", 634, sectionUrl);
		}
        // 线下授课类型
        playTeachingOffline("playText", xiaojie);
        break;
    case '6':
    case 6:
        //直播类型
        var myDate = new Date();//获取系统当前时间
        var usersysdate=myDate.getFullYear()+"-"+myDate.getMonth()+1+"-"+myDate.getDate()+" "+myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds();
        console.log(xiaojie.CSSTIME+"||"+usersysdate);
        var livetimeout=GetDateDiff(xiaojie.CSSTIME,usersysdate,"hour");
        console.log(livetimeout);
    		if (parseInt(livetimeout)>=4) {
    			$.confirm("直播已经结束，点击确定立即前往观看回放？", function () {
            var huifangUrl = xiaojie.liveObj.luzhi_url+"?f=app&uname="+encodeURI(encodeURI(getUserInfo().user_Name))+"&uid="+getUserInfo().user_ID;
            console.log(huifangUrl);
            api.openWin({
                name: '直播回放',
                animation:{
                    type:"flip",                //动画类型（详见动画类型常量）
                    subType:"from_right",       //动画子类型（详见动画子类型常量）
                    duration:300                //动画过渡时间，默认300毫秒
                },
                url: huifangUrl,
                pageParam: {
                    name: '直播回放'
                }
            });
    			});
    		}else{
          $.confirm("本章节为直播课程，是否观看直播？", function () {
            SetlocalStorage("LiveBroadcast_Info", JSON.stringify(xiaojie));  //将信息存入缓存，以便直播界面直接获取使用
            $.router.loadPage("../../html/peixun/live.html?arrangeId="+QueryString("arrangeId"));
          });
    		}
        break;
    case '8':
    case 8:
        $("#kecheng_play_mian_top_play").hide();
        $("#playText").show();
        // 图文类型
        $("#kechengContent").css("top", "1.7rem");
        if(CKobject.getObjectById('ckplayer_a1')){
			CKobject.getObjectById('ckplayer_a1').videoPause();
			//mainplayer("playText", 634, sectionUrl);
		}
        xiaojie.fileTxt = jisuDecode(xiaojie.fileTxt);
        xiaojie.CSTITLE = jisuDecode(xiaojie.CSTITLE);
        playImageText("playText", xiaojie);
        break;
    default:
        $("#kecheng_play_mian_top_play").show();
        $("#playText").hide();
        $("#kechengContent").css("top","12rem");
        $("#kecheng_play_mian_top_play").html("<div class='shanguang'><img src='../res/img/logo_fff.png' alt='加载中...'><div class='baiguang'></div></div>");
       $.toast("此课程暂未开放");
        break;
    }

    // 清除计时器
    clearInterval(jisuJSQ);
    jisuJSQ = null;
    jsqkq = false;
    //CKobject.getObjectById('ckplayer_a1').videoPause();
    // 防止暂停时值被更新
    setTimeout(function() {	Tstate = 1;},500);
    //判断是否需要播放计时，如果需要启动计时器
    learningJSQ(xiaojie);


    //修改播放课程图标显示
    $("#kechengmingxi .item-content").removeClass("active");
    $("#kecheng_"+xiaojie.CSID).addClass("active");
}
//考试功能
var playSectionalExamination = function(courseDetailedJson) {
    if(!QueryString("courseId")){
    var userid=getUserInfo().user_ID;
    var playid=courseDetailedJson.CSID;
    $.confirm("本章节为在线考试，是否确认打开试卷？", function () {
         tongbu("aaa");
        if (courseDetailedJson.CRANDIM == 0) {
            var num = Math.floor(Math.random() * courseDetailedJson.CSPCOUNT + 1);
            window.location = javafile+"/resources/exam/" + courseDetailedJson.CSPID + "," + courseDetailedJson.CSPCOUNT + "/" + num + ".html?cid=" + csm.key + "&playid="+playid+"&userid="+userid+"&arrangeId=" + QueryString("arrangeId")+"&token="+strToJson(GetlocalStorage("userinfo_token"));
        } else {
            window.location = javafile+"/resources/exam/" + courseDetailedJson.CSPID
                    + "/" + courseDetailedJson.CSPID + ".html?cid="
                    + csm.key + "&playid="+playid+"&userid="+userid+"&arrangeId=" + QueryString("arrangeId")+"&token="+strToJson(GetlocalStorage("userinfo_token"));
        }
    });
    }else{
        goLogin();
    }
}
//跳转登录页
function goLogin(){
    $("#kecheng_play_mian_top_play").show();
    $("#playText").hide();
    $("#kechengContent").css("top","12rem");
    $("#kecheng_play_mian_top_play").html("<div class='shanguang'><img src='../../res/img/logo_fff.png' alt='加载中...'><div class='baiguang'></div></div>");
    $.confirm("查看该小节需要用户登录，是否前往登录？", function () {
        //需要记录当前地址
        $.router.back("/app/login.html");
    });
}
// 线下授课
this.playTeachingOffline = function(divid,courseDetailedJson) {
    //是否只拿到地址进入
    if(!QueryString("courseId")){
        //放入对象中
        var xxobj={pid:courseDetailedJson.CSID,ptype:4,pstate:1};
        var days = null;
        var nowDate = new Date();
        if (courseDetailedJson.CSSTIME == undefined || courseDetailedJson.CSSTIME =="")
            days = "999";
        else {
            var datereplace=startTime = courseDetailedJson.CSSTIME.replace(/\-/g, "/");
            console.log(datereplace);
            var startDate = new Date(datereplace);
            var nowDateTime = nowDate.getTime();
            var startDateTime = startDate.getTime();
            // 计算相差天数
            if (nowDateTime >= startDateTime)
                days = 0;
            else
                days = -(Math.floor((nowDateTime - startDateTime)
                        / (24 * 3600 * 1000)));
        }

        // 线下授课
        // html 内容
        var enrolHtml = "<div class='content-padded'>"
                + "         <h2>"+courseDetailedJson.CSNAME+"</h2>"
                + "                 <ul>"
                + "                     <li><i class='iconfont icon-dizhi'></i> 报名地址："
                + courseDetailedJson.CSURL
                + "</li>"
                + "                     <li><i class='iconfont icon-44'></i> 报名人数：<span class='enrol_prople_num' id=\"enrol_prople_num\">0</span> / "
                + (courseDetailedJson.CSPNUM == null ? "无限制"
                        : courseDetailedJson.CSPNUM)
                + "</li>"
                + "                     <li><i class='iconfont icon-riqi2'></i> 截止时间："
                + (courseDetailedJson.CSSTIME == undefined ? "无限制"
                        : courseDetailedJson.CSSTIME)
                + "</li>"
                + "                     <li><i class='iconfont icon-jilu'></i> 课程简介：</li>"
                + "                     <li class='enrol_content_li_indent'>"
                + "                         <span>"
                + (courseDetailedJson.hasOwnProperty("CSDESCRIBE") ? courseDetailedJson.CSDESCRIBE
                        : "该线下授课课程暂时没有课程简介")
                + "</span></li>"
                + "                 </ul>"
                + "             <div class='enrol_course_info_btn'>"
                + "                 <div class='enrol_course_info_btn_content'>"
                + "                     <div class='enrol_course_info_btn_content_header'>距离开始时间<span class='enrol_course_info_overplus_day'><span class='enrol_course_info_overplus_day_num'>"
                + days
                + "</span>"
                + (courseDetailedJson.CSSTIME == undefined ? "" : "天")
                + "</span></div>"
                + "                 <div class='enrol_course_info_btn_bottom'><button disabled='disabled' id='enrol_course_info_bottom_button' class='enrol_course_info_btn_bottom_closed' type='button'></button></div>"
                + "             </div>";


        $("#"+divid).html(enrolHtml);
        // 查看当前用户是否报名小节

            getAjax(javaserver+"/courseSectionEnrol/findSectionEnrolStatus", { //查询报名记录
                sectionId : courseDetailedJson.CSID,
                userId : getUserInfo().user_ID
            }, function(json) {
                //console.log(json)
                // 成功
                var enrolJson = JSON.parse(json);
                // 判断后台是否出现异常
                if (enrolJson.errorcode != "0") {
                    $.toast("获得报名信息")
                    return;
                }
                if (days <= 0) {
                    // 截止
                    return;
                }
                var enrolButtonTag = $(".enrol_course_info_btn_bottom_noenrol,.enrol_course_info_btn_bottom_closed");
                // 报名过了
                if (enrolJson.datas.length > 0) {
                    enrolButtonTag
                            .removeClass("enrol_course_info_btn_bottom_noenrol enrol_course_info_btn_bottom_closed")
                            .addClass("enrol_course_info_btn_bottom_info");
                    return;
                }
                enrolButtonTag.removeClass("enrol_course_info_btn_bottom_closed")
                        .addClass("enrol_course_info_btn_bottom_noenrol").removeAttr(
                                "disabled");
                // 监听按钮的 click 事件
                enrolButtonTag.click(
                      function() {
                        if(courseDetailedJson.CSSTIME != undefined){
                            var nowDateTime = nowDate.getTime();
                            // 防止用户在点击报名时
                            // 客户端时间(刚进页面时相同,但是在页面挂机挂了好几天，已经过了截止日期什么的)和本地时间不相同
                            if (nowDateTime >= startDateTime) {
                                $("#enrol_course_info_bottom_button").removeClass(
                                "enrol_course_info_btn_bottom_noenrol").addClass(
                                        "enrol_course_info_btn_bottom_closed");
                                showAlert("info", "alert", "课程播放提示", "已过报名时间!", 200);
                                return;
                            }
                        }

                        // 进行报名小节(section)
                        getAjax(javaserver+"/courseSectionEnrol/enrolSection", {
                            userInfoJson : JSON.stringify(getUserInfo()),
                            courseId : csm.key,
                            sectionId : courseDetailedJson.CSID,
						    //线下结束时间
						    //用于向消息提醒表添加数据
						    //展示于学员段未来七天结束的任务或线下
						    endDate:courseDetailedJson.CSSTIME,
						    address:courseDetailedJson.CSURL//线下报名地址
                        }, function(data) {
                            var json = JSON.parse(data);
                            // 报名完毕后
                            // alert(json.errorcode + ":" + json.errormsg);
                           // 小节 id
                            var svgTag = $("svg[class$='" + courseDetailedJson.pid
                                    + "']")
                            svgTag.parent().removeClass("svg-icon-jyx")
                                    .addClass("svg-icon-ywc");
                            svgTag.children("use").attr("xlink:href",
                                    "#icon-chenggong1");
                            $("#enrol_prople_num").html(
                                    parseInt($("#enrol_prople_num").html()) + 1);
                            $("#enrol_course_info_bottom_button").removeClass(
                            "enrol_course_info_btn_bottom_noenrol").addClass(
                            "enrol_course_info_btn_bottom_info");
                        })
                    })
            })

        // 获取报名人数
        getAjax(javaserver+"/courseSectionEnrol/findSectionEnrolPeopleNum", {
            sectionId : courseDetailedJson.CSID
        }, function(json) {
            var enrolJson = JSON.parse(json);
            // 判断后台是否出现异常
            if (enrolJson.errorcode != "0") {
                $.toast("获得报名信息");
                return;
            }
            $("#enrol_prople_num").html(enrolJson.data);
            //已达到最大人数
            if(courseDetailedJson.CSPNUM!=null&&courseDetailedJson.CSPNUM<=enrolJson.data){
                $("#enrol_course_info_bottom_button").attr("disabled","disabled");
                 $("#enrol_course_info_bottom_button").removeClass(
                            "enrol_course_info_btn_bottom_noenrol").addClass(
                            "enrol_course_info_btn_bottom_closed");
            }
        });

        //检查是否已存在
        var isHavexx=false;
         for (var i = csm.list.length - 1; i >= 0; i--) {
               if(courseDetailedJson.CSID==csm.list[i].pid){
                    isHavexx=true;
               }
         }
         //已存在就不需要再提交了
        if(!isHavexx){
             csm.list.push(xxobj);
             courseDetailedJson.pstate = 1; // 修改当前小节的完成状态
             //更新数据
             xuewan(courseDetailedJson);
        }
    }else{

        goLogin();
    }
}


// 图文类型
this.playImageText = function(divid,courseDetailedJson) {
    var enrolHtml = "<div class='content-padded'>"
            + "<h2>"
            + courseDetailedJson.CSNAME + "</h2>"
            + courseDetailedJson.fileTxt + "</div>";

    $("#"+divid).html(enrolHtml);
    //检查是否已存在
    var isHavetw=false;
     for (var i = csm.list.length - 1; i >= 0; i--) {
           if(courseDetailedJson.CSID==csm.list[i].pid){
                isHavetw=true;
           }
     }
     //已存在就不需要再提交了
    if(!isHavetw){
          var twobj={pid:courseDetailedJson.CSID,ptype:8,pstate:1};
          csm.list.push(twobj);
           xuewan(courseDetailedJson);//点完就学完
   }
}
//小节学完，更新数据
this.xuewan = function(courseDetailedJson){
//     //更新本地数据
//    for (var i = csm.list.length - 1; i >= 0; i--) {
//         if(csm.list[i].pid == courseDetailedJson.CSID)//找到这个记录
//         {
//            csm.list.splice(i,1);//清除原有记录

//            csm.list[i].push(courseDetailedJson);//更新新数据

//            break;//找到合适的了，就要跳出循环，性能！
//          }
//    }
    //更新服务器信息
     isConfirmTongbu();
    //更新界面样式
     $("#kecheng_"+courseDetailedJson.CSID).find(".item-after").html("<i class=\"iconfont icon-shenhetongguo\" title=\"已学完\" style=\"color:#339966\"></i>");
}
//计时器，分析课程是否需要计时，如果需要进行统计
function learningJSQ(xiaojie){
    //只有在指定要求学习时间不为0，并且学习时间未满时启动计时器
    //console.log(xiaojie);
    if(xiaojie.hasOwnProperty("CSTIME"))//需要计时才有这个属性
    {

        //获得课程记录，判断是否已经学完
        var newjilu = 0;
        if(csm.hasOwnProperty("list")){
            for (var i = csm.list.length - 1; i >= 0; i--) {
                if(csm.list[i].pid == xiaojie.CSID)//找到这个记录
                {

                    //csm.list[i].learnTime 学习时间
                    //csm.list[i].pstate 1为完成
                    if(csm.list[i].pstate != 1){
                        csm.list[i].cstime = xiaojie.CSTIME;//为了解决如果课程要求学习变化这种情况
                        //启动计时器开始计时
                        jishiqi(csm.list[i]);
                    }
                    else{
                        console.log("本课程已经达到指定学时，不进行计时业务");
                    }
                    newjilu = 1;//找到了
                    break;//找到合适的了，就要跳出循环，性能！
                }
            }
        }
        else{
            csm.list=[];
        }

        //如果没有找到学习记录，则创建新纪录
        if(newjilu == 0)
        {
            var newcms = {};
            newcms.pid = xiaojie.CSID; //记录小节DI
            newcms.ptype = xiaojie.CSTYPE;//课程类型
            newcms.cstime = xiaojie.CSTIME;//要求学习时间
            newcms.playTime = 0; //视频播放时长
            newcms.learnTime = 0; //已经学习时长
            newcms.pstate = 0; //完成状态
            csm.list.push(newcms);
            jishiqi(newcms);
        }


    }
    //学够制定的学时后，更新学习记录，同步记录到服务器
    //tongbu();
}
var jisuJSQ = null,//声明个计时器容器
jsqkq = false;//是否开启计时
function jishiqi(jilu){
    var jsdw = 1;//计时器执行间隔时间，单位（秒）
    //console.log("计时器走秒："+jilu.learnTime);
    //console.log(new Date().getSeconds());//测试执行情况
    jilu.learnTime = jilu.learnTime+jsdw;//叠加学时
    var m = parseInt(jilu.learnTime/60); // 分钟
    var s = jilu.learnTime%60 <10 ? "0"+jilu.learnTime%60 : jilu.learnTime%60;
    if(parseInt(jilu.learnTime) >= parseInt(jilu.cstime)*60)//已经达标，更新完成状态
    {
        jilu.pstate = 1;
        $("#kecheng_"+ jilu.pid +"_learnTime").html(jilu.cstime); // 更新页面时间
        $("#kecheng_"+jilu.pid).find(".item-after").html("<i class=\"iconfont icon-shenhetongguo\" title=\"已学完\" style=\"color:#339966\"></i>");
    }else{
        $("#kecheng_"+ jilu.pid +"_learnTime").html(m+":"+s); // 更新页面时间
    }
    //更新总体学习记录
    for (var i = csm.list.length - 1; i >= 0; i--) {
            if(csm.list[i].pid == jilu.pid)//找到这个记录
            {
                csm.list.splice(i,1);//清除原有记录

                csm.list.push(jilu);//更新新数据
                //找到记录更新本地缓存
                SetlocalStorage("C_"+ csm.key,JSON.stringify(csm));
                break;//找到合适的了，就要跳出循环，性能！
            }
    }

    if(parseInt(jilu.learnTime) >= parseInt(jilu.cstime)*60)//已经达标，学完了
    {
        console.log("课程已完成");
        if(jsqkq == true){
            clearInterval(jisuJSQ);
            jisuJSQ = null;
            jsqkq = false;
        }
         isConfirmTongbu("aaa");//学完了同步下数据
    }
    else{
        if(jsqkq == false){
            //alert("axc");
            jsqkq = true;
            jisuJSQ = setInterval(function () { if(Tstate == 1)jishiqi(jilu)},jsdw*1000);
        }
    }
}
//将学习记录与服务器同步
var jiluid = "";
function tongbu(msg,istongbu){
   // console.log("xxx");
   //从微信过来会有courseId
       //将数据同步到服务器
      // {timeStart:"",timeEnd:"",cousreid:"",csid:"",sectionName:"",courseType:"",dateLearn:""};
      var newjson="";
      if(newStudyDetailsJson!=null&&newStudyDetailsJson!=""){
           newStudyDetailsJson.timeEnd=new Date().format("yyyy-MM-dd hh:mm:ss");//结束时间
            newStudyDetailsJson.cousreid=csm.key;//课程id
            newStudyDetailsJson.csid=csm.playpid;//播放的小节id
            newStudyDetailsJson.sectionName=$("#kecheng_"+csm.playpid+" .item-title").html();//播放小节的名称
            for(var i=0;i<csm.list.length;i++){
                if(csm.list[i].pid==csm.playpid){
                    newStudyDetailsJson.courseType=csm.list[i].ptype;//播放小节的类型
                    if(csm.list[i].ptype!=1&&csm.list[i].ptype!="1"&&csm.list[i].ptype!="2"&&csm.list[i].ptype!=2){
                        newStudyDetailsJson=null;
                    }
                    break;
                }
            }
            if(newStudyDetailsJson!=null&&(newStudyDetailsJson.courseType==1||newStudyDetailsJson.courseType=="1"||newStudyDetailsJson.courseType==2||newStudyDetailsJson.courseType=="2")){
                newjson="["+JSON.stringify(newStudyDetailsJson)+"]"
            }
       }
       var canshu ={
            jsonDetails : JSON.stringify(csm),//课程学习记录
            studyDetailsId : jiluid,//存档ID
            courseId : csm.key,//课程ID
            dateTime:"[]",//暂无用处
            arrangeId : QueryString("arrangeId"),//培训任务ID
            orgId : getUserInfo().organization_ID,//组织架构ID
            newStudyDetailsJson :newjson ,//学习时段
            userId :  getUserInfo().user_ID //学习人员ID
        };
       getAjax(javaserver+
        "/coursedetailed/Uploadprogress",
        canshu,
        function(data){
            if (data != "") {
              //  jiluid = data;//返回值为记录ID
            }
            if(msg==undefined)
             $.toast("学习记录同步成功！");
        },'','','',istongbu);


}
function isConfirmTongbu(msg){
     if(!QueryString("courseId")){
            if(msg==undefined){
                 tongbu();
            }else{
                tongbu(msg);
            }

     }
}
// 内容加载器
var mainplayer = function(Cantent, Height, mima) {
  // / <summary>
  // / 总内容加载器，可装载各类内容
  // / </summary>
  // 设置外框架
  $("#" + Cantent).height("10rem");
  // 设置课程列表
  $("#kechengContent").css("top","12rem");
  window.AddHtml = function(Cantent, Height, mima) {
      // / <summary>
      // / 静态类内容
      // / </summary>
      $("#" + Cantent).html("");
      $("#" + Cantent).append(
              "<iframe class=\"embed-responsive-item\" style=\"height:16rem\" src='" + mima
                      + "'></iframe>");
      // 设置外框架
      $("#" + Cantent).height("16rem");
      // 设置课程列表
      $("#kechengContent").css("top","18.2rem");
      try{
        bPlayer.close();
      }catch(e){}
  }
  window.AddVideo = function(Cantent, Height, mima) {
      // / <summary>
      // / 增加视频组件
      // / </summary>
      //videoplayer.play(Cantent, Height, mima);
      BaiDuPlayer.play(Cantent, Height, mima);
  }
  window.ADDflash = function(Cantent, Height, mima) {
      // / <summary>
      // / 增加FLASH组件
      // / </summary>
      $("#" + Cantent).html("<div id='a1'></div>");
      var params = {
          bgcolor : '#000',
          allowFullScreen : true,
          allowScriptAccess : 'always',
          wmode : 'opaque'
      };
      var flashvars = {};
      var attributes = {
          id : 'game_ring',
          name : 'game_ring'
      };
      swfobject.embedSWF(mima, "a1", "100%", Height, "10.2.0",
              "expressInstall.swf", flashvars, params, attributes);//这个swf是flash安装包
              try{
                bPlayer.close();
              }catch(e){}
  }
  window.AddSanFang = function(Cantent, Height, mima) {
      // / <summary>
      // / 暂时不支持的后缀名格式，提供下载
      // / </summary>
       $("#" + Cantent)
       .html(
       "<div class=\"jumbotron\"><center><a class=\"btn btn-info btn-lg\" href=\""
       + mima + "\" target=\"_blank\" role=\"button\"><i class=\"glyphicon glyphicon-download\"></i> 点击下载</a></center></div>");
       try{
         bPlayer.close();
       }catch(e){}
  }
  window.AddOffice = function(Cantent, Height, mima) {
     // 设置外框架
      $("#" + Cantent).height("auto");
      // 设置课程列表
      $("#kechengContent").css("top","2.2rem");
      // / <summary>
      // / 增加文档播放组件
      // / </summary>
       $("#" + Cantent).html("<iframe class=\"embed-responsive-item\" src='" +  "http://file.jisupeixun.com/resources/pdf2/officeshow/web/viewer.html?file=" +
        base64encode(encodeURI(mima)) + "'></iframe>");
        try{
          bPlayer.close();
        }catch(e){}
  }
  if(mima == undefined || mima.length == 0 || mima == null){
      $.toast('该小节缺少播放地址');
      return false;
  }
  var houzhui = mima.substring(mima.lastIndexOf(".") + 1).toLowerCase(); // 获得主视频后缀名(转小写)
  if (houzhui.indexOf("?") >= 0) {
      houzhui = mima.substring(mima.lastIndexOf(".") + 1, mima
              .lastIndexOf("?"));
  }
  if (houzhui == "htm" || houzhui == "html" || houzhui == "shtml") {
      // 静态类内容
      AddHtml(Cantent, Height, mima);
  } else if (houzhui == "flv" || houzhui == "mp4" || houzhui == "f4v"
          || houzhui == "m3u8" || houzhui == "webm" || houzhui == "ogg") {
      // 网络视频类内容
      AddVideo(Cantent, Height, mima);
  } else if (houzhui == "pdf") {
      AddOffice(Cantent, Height, mima);
  } else if (houzhui == "doc" || houzhui == "docx" || houzhui == "xls"
          || houzhui == "xlsx" || houzhui == "ppt" || houzhui == "pptx") {
      $.toast("文档格式需要转成PDF格式");

      return false;
  } else if (houzhui == "swf") {
      // flash动画或播放器格式
      ADDflash(Cantent, Height, mima);
  } else if (houzhui == "jpg" || houzhui == "png" || houzhui == "gif") {
      $("#" + Cantent)
              .append(
                      "<img src=\""
                              + mima
                              + "\" class=\"img-responsive\" alt=\"Responsive image\">");
  } else {
      // 其他乱七八糟视频格式
      AddSanFang(Cantent, Height, mima);
      return false;
  }
}


//封装百度播放器
var bPlayer = {};
var BaiDuPlayer = new function(){
try{
  //播放
  this.play = function (Cantent, Height, mima){
    try{
      bPlayer.close();
    }catch(e){}
    bPlayer = api.require('bPlayer');  //实例化百度播放器
    var systemType = api.systemType;
    if(systemType == 'ios'){
      bPlayer.open({
            rect: {
                x: 0,
                y: 38,
                w: winapi.winWidth,
                h: playerHeight,
            },
            path: mima.replace('\\', '/'),
            autoPlay: true
        }, function(ret, err) {
            if (ret) {

            }
      });
      BDPlayerLoader();
    }else {
    bPlayer.open({
          rect: {
              x: 0,
              y: 38,
              w: 0,
              h: 0,
          },
          path: '',//mima.replace('\\', '/'),
          autoPlay: true
      }, function(ret, err) {
          if (ret) {
            //引入成功之后又重新对播放器的位置进行重定位，因为不知道为啥上面那个定位不起作用，所以没办法。。。
            bPlayer.setRect({
                      rect:{
                      x: 0,
                      y: 38,
                      w: winapi.winWidth,
                      h: playerHeight,
                            },
                });
                BDPlayerLoader();
          }
    });
    bPlayer.stop();
    bPlayer.reset();
    setTimeout(function () {
      bPlayer.replay({
                 path : mima.replace("\\", "/"),
                 autoPlay : true,
        },function(ret) {
            if (ret) {
            }
      });
    }, 3000);
    }
    /*****添加播放器的监听事件********/
    function BDPlayerLoader(){
      try {
        bPlayer.addEventListener({name : ['all','click','playbackState']}, function(ret) {
          var EventType = eval(ret);
          if(EventType.eventType == "click"){
            if(Tstate == 1){ //当前正在播放
               bPlayer.pause();
               Tstate = 0;
               $.toast('已暂停播放，点击播放');
             }else {
               bPlayer.play();
               Tstate = 1;
             }
           }
           //快进
           if(EventType.eventType ==  "swipeRight"){
            BaiDuPlayer.BDforward();
           }
           //快退
           if(EventType.eventType ==  "swipeLeft"){
            BaiDuPlayer.BDrewind();
           }
           //减小音量
           if(EventType.eventType ==  "rightDown"){

           }
           // 增加音量
           if(EventType.eventType ==  "rightUp"){

           }
           // 增加亮度
           if(EventType.eventType ==  "leftUp"){
             var brightness = api.require('brightness2016');
             brightness.getBrightness(function(ret) {
               brightness.setBrightness({ brightness: eval(ret).brightness + 20 });
            });

           }
           // 降低亮度
           if(EventType.eventType ==  "leftDown"){
             var brightness = api.require('brightness2016');
             brightness.getBrightness(function(ret) {
                brightness.setBrightness({ brightness: eval(ret).brightness - 20 });
            });
           }
           //播放完成
           if(EventType.eventType == "complete"){
             console.log(EventType.eventType);
              //BaiDuPlayer.BDPlayEnded();
              //mainplayerStop();
           }
          });
      } catch (e) {

      } finally {

      }
    }
}
  this.BDPlayEnded() = function(){
    //mainplayerStop();
  }
  //用于暂停后的播放或者是非自动播放，点击播放事件
  this.BDplay = function  () {
    bPlayer.play();
    Tstate = 1;
  }
  //暂停
  this.BDpause = function(){
    bPlayer.pause();
    Tstate = 0;
  }
  //关闭播放器
  this.BDremove = function(){
    try {
      bPlayer.pause();
      bPlayer.close();
    } catch (e) {

    } finally {
      console.log("移除播放器");
    }
  }
  //快速定位播放位置
  window.BDtimego = function(times) {
    bPlayer.seek({
         currentPlaybackTime : times
    });
  }
  //设置播放器的播放速率：取值范围：[0.0, 4.0]，默认：1.0
  window.BDsetplayRate = function (typeRate) {
    bPlayer.playbackRate({
         playbackRate : typeRate
    });
  }
  //快进  默认：2秒
  window.BDforward = function () {
    bPlayer.forward({
       seconds : 6.0
    });
  }
  //快退  默认：2秒
  window.BDrewind = function () {
    bPlayer.rewind({
      seconds : 6.0
   });
  }
  //设置水印
  window.BDsetWatermark = function () {
    bPlayer.setWatermark({
         origin : {
               x : 10,
              y : 10
           },
         path : 'widget://res/tab-01.png'
    });
  }
}catch(e){}
}


// 封装一个flash+HTML5播放器
var videoplayer = new function() {

    // / <summary>
    // / 播放器操作类（FLASH+HTML5）
    // / </summary>
    this.play = function(Cantent, Height, mima) {
        // / <summary>
        // / 播放方法
        // / </summary>
        // / <param>
        // / Cantent容器ID，Height显示高度，mima密文
        // / </param>
        $("#" + Cantent).html("<div id='a1'></div>");
        var params = {
            bgcolor : '#fff',
            allowFullScreen : true,
            allowScriptAccess : 'always',
            wmode : 'opaque'
        };
        var video = [ mima + '->video/mp4' ];
        var flashvars = {
            f : mima.replace('\\', '/'),
            c : 0,
            p : 1,
            b : 0,
            h : 3,
            my_url : encodeURIComponent(window.location.href),
            loaded : 'loadedHandler'
        }; // 还要增加其他参数
        // 本处预留课程脚本加载
        // 为flashvars补充k参数，n参数
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var host = curWwwPath.substring(0, pos);
        var support=['iPad','iPhone','ios','android+false','msie10+false'];
        CKobject.embed('/resources/ckplayer/ckplayer.swf', 'a1', 'ckplayer_a1','100%', '100%', false, flashvars, video, params);

   }
    window.zantingdian = -1; // 上一次暂停点记录（防止重复暂停）
    window.loadedHandler = function() {

    CKobject.getObjectById('ckplayer_a1').videoPlay();
        // / <summary>
        // / 播放器加载完成监听
        // / </summary>
        Tstate = 1;
        if(CKobject.getObjectById('ckplayer_a1').getType()){    // html5
            // 播放与暂停监听
            CKobject.getObjectById('ckplayer_a1').addListener('play', Ckplay);
            CKobject.getObjectById('ckplayer_a1').addListener('pause', Ckpause);

            // 增加播放时间监听
            CKobject.getObjectById('ckplayer_a1').addListener('time', timego);

            // 增加播放完成的监听,延时是因为需要等播放器加载完成
            CKobject.getObjectById('ckplayer_a1').addListener('ended',
                    VideoPlayEndedHandler);
        }else{
                  // 播放与暂停监听
            CKobject.getObjectById('ckplayer_a1').addListener('play', 'Ckplay');
            CKobject.getObjectById('ckplayer_a1').addListener('pause', 'Ckpause');

            // 增加播放时间监听
            CKobject.getObjectById('ckplayer_a1').addListener('time', 'timego');

            // 增加播放完成的监听,延时是因为需要等播放器加载完成
            CKobject.getObjectById('ckplayer_a1').addListener('ended',
                    'VideoPlayEndedHandler');
        }

    }
    window.Ckplay = function() {
        // / <summary>
        // / 播放器开始播放触发
        // / </summary>
        Tstate = 1;
        // CKobject.getObjectById('ckplayer_a1').videoPlay();
    }
    window.Ckpause = function() {
        // / <summary>
        // / 播放器暂停时触发
        // / </summary>
        Tstate = 0;
        // CKobject.getObjectById('ckplayer_a1').videoPause();
    }
    window.timego = function(times) {
        // / <summary>
        // / 监听视频播放时间
        // / </summary>
        courseMemoryObj.playTime = times;

        // 时间脚本事件在这里运行
    }
    window.CkSeek = function(jytime) {
        try {
        } catch (e) {
        }

    }
    window.VideoPlayEndedHandler = function() {
        mainplayerStop();
    }
}
//播放时间监控
function ckplayer_status(str){
    //console.log(str);
}
//课程播放完成后触发
function mainplayerStop() {
    // body...
    $.alert("课程播放完成！");
}

//打开课程播放界面，将课程数据保存，已被下个界面使用
function openKe(stringjson,renwuid) {
    SetlocalStorage("PlayCourse", JSON.stringify(stringjson));
    var dangqianUrl = window.location.href;
    var lastH = dangqianUrl.substring(dangqianUrl.lastIndexOf('/') + 1, dangqianUrl.lastIndexOf('.'));
    if(lastH != "home"){
      $.router.loadPage("../../html/peixun/detail.html?arrangeId="+renwuid);
    }else {
      $.router.loadPage("../html/peixun/detail.html?arrangeId="+renwuid);
    }
}
//从收藏  打开课程播放界面
//需要获取  课程阶段 信息
function openKe_collection(courseId,type,renwuid) {
     //请求获取对象
        getAjax(javaserver + "/stage/findCourseInfoByCourseId", { courseId: courseId}, function (data) {
            data = strToJson(data);
            if (data.errorcode == 0 && data.data!=null) {
                if(type==undefined||type==null||type==""){
                    //打开课程
                     openKe(data.data,renwuid?renwuid:1);
                 }else{
                    sysUserInfo=data.data;
                 }
            } else {
                 $.toast("获取章节信息失败");
            }
        });
}
/*************************************/
//chapterList  单击事件
//展开章节列表
//为解决文档过长切换其他小节时操作不便
/*************************************/
function chapterZK() {
	var dqqh = $("#chapterList").offset().top; // 当前题目高度
    var winHeight=$(document.body).outerHeight(true);
    console.log("章节 距离 content 高度："+dqqh);
     console.log("浏览器总高度："+winHeight);
     console.log("允许最大高度："+winHeight*0.6);
    if(dqqh>=(winHeight*0.6)){
         $('#kechengContent').scrollTop(dqqh);
    }
}
//预览页面，文件缓存
function huancunxiazai() {
  var data = {data:GetlocalStorage("fileobj")};
  if (data.data != null) {
   var jsonObj = {
     "url": data.data.filepreview,
     "savePath": "fs://极速培训/"+data.data.upId + "/" + data.data.fileName,
     "iconPath":data.data.filecover,
     "cache": true,
     "allowResume": true,
     "title": data.data.fileName,
     "networkTypes": 'all'
   };
   downfile(jsonObj);
 }else{
   $.toast("文件下载为空！");
 }
}
//对比时间
function GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime);      //开始时间
    var eTime = new Date(endTime);  //结束时间
    //作为除数的数字
    var divNum = 1;
    switch (diffType) {
    	case "second":
    	divNum = 1000;
    	break;
    	case "minute":
    	divNum = 1000 * 60;
    	break;
    	case "hour":
    	divNum = 1000 * 3600;
    	break;
    	case "day":
    	divNum = 1000 * 3600 * 24;
    	break;
    	default:
    	break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}
