///<summary>
///消息通道
///</summary>
var Messaging = new function () {
    //验证消息通道
    //var msg_sdk = new Yunba({ appkey: '55cc0d389477ebf52469582a' });
    this.socket = io.connect('ws://123.57.255.51:3000');
    this.mancount = 0;
    var userList = [], numUsers = 1, username = ''; //用户列表、直播间当前在线人数、用户信息、用户总数
    var flashvars = {};
    var roleId = ""; // 1、学生 0、老师
    var CHATROOM_TOPIC = "";
    var tempHtml="";
    ///<summary>
    ///初始化
    ///</summary>
    this.initMsg = function (flashvarsObj) {
      flashvars = flashvarsObj;
      roleId = flashvars.type; // 1、学生 0、老师
      CHATROOM_TOPIC = flashvars.rid;
		    $("#loading").hide();
        Messaging.setAlias();
        Messaging.getOnlineUsers();

                    //liveRecord.GetLiveRecord();
                    /*获取在线的直播视频*/
                    //getplay();
    }
    ///<summary>
    ///设置通讯中使用的别名
    ///</summary>
    this.setAlias = function () {
        var alias = flashvars.name + "|" + flashvars.id + "|" + flashvars.type;
        this.socket.emit('login', { userid: flashvars.id, username: flashvars.name, userimg: flashvars.user_img, userRoom: flashvars.rid, usertype: flashvars.type, alias: alias });
        Messaging.removeOnlineUserElement();
        this.socket.on('message', function (data) {
            Messaging.dataController(data.msg);
        });
        //监听新用户登录
        this.socket.on('login', function (o) {
            Messaging.addOnlineUserElement(o.onlineUsers);
        });
    }

    ///<summary>
    ///在线用户列表中添加一个元素
    ///</summary>
    this.addOnlineUserElement = function (o) {
        username = o;
        var user = username.split("|");
        console.log("上线：" + username);
        if (-1 === userList.indexOf(user[1])) {
            Messaging.mancount++;
            userList.push(user[1]);
            numUsers = userList.length;
            var $chatOnlineList = $('#list_u');
            var $userListItem = null;
            var strs = username.split("|"); //字符分割
            try {
                // 0 老师 1 学员
                if (strs[1] == flashvars.id) {  //判断是自己
                    $userListItem = $('<li class="item-content"></li>').html('<div class="item-media"><img src="../../res/img/avatar.png" style="width: 2.2rem;border-radius:50%"></div><div class="item-inner"><div class="item-title">' + strs[0] + '</div><div class="item-after">【我】</div></div>');
                } else {
                    if (strs[2] == 0) { //其他用户
                        $userListItem = $('<li class="item-content"></li>').html('<div class="item-media"><img src="../../res/img/avatar.png" style="width: 2.2rem;border-radius:50%"></div><div class="item-inner"><div class="item-title">' + strs[0] + '</div><div class="item-after">【讲师】</div></div>');
                    } else if (strs[2] == 1) {
                        if (flashvars.type == 0) {  //老师
                            if (sysResource.GetlocalStorage("state_" + user[1]) == "1") {
                                //$userListItem = $('<li class="list-group-item" ></li>').html("<div class=\"chat-online-listimg\"><img src=\"/images/User_Image.jpg\"></div><div class=\"online-list-right\"><div class=\"online-list-userrole\">[学员]</div><div class=\"online-list_username\">" + strs[0] + "</div></div><span style=\"float:right;\"><i class=\"ico icojcjy\" title=\"禁言\" onclick=\"jinyan_user(this,'" + user[1] + "',0)\" ></i><i class=\"ico icotc\" title=\"踢出\" onclick=\"tichu_user(this,'" + user[1] + "')\"></i>");
                            } else {
                                //$userListItem = $('<li class="list-group-item" ></li>').html("<div class=\"chat-online-listimg\"><img src=\"/images/User_Image.jpg\"></div><div class=\"online-list-right\"><div class=\"online-list-userrole\">[学员]</div><div class=\"online-list_username\">" + strs[0] + "</div></div><span style=\"float:right;\"><i class=\"ico icojinyan\" title=\"禁言\" onclick=\"jinyan_user(this,'" + user[1] + "',1)\" ></i><i class=\"ico icotc\" title=\"踢出\" onclick=\"tichu_user(this,'" + user[1] + "')\"></i>");
                            }
                        } else if (flashvars.type == 1) {   //学生
                            //$userListItem = $('<li class="list-group-item" ></li>').html("<div class=\"chat-online-listimg\"><img src=\"/images/User_Image.jpg\"></div><div class=\"online-list-right\"><div class=\"online-list-userrole\">[学员]</div><div class=\"online-list_username\">" + strs[0] + "</div>" + "</div>");
                            $userListItem = $('<li class="item-content"></li>').html('<div class="item-media"><img src="../../res/img/avatar.png" style="width: 2.2rem;border-radius:50%"></div><div class="item-inner"><div class="item-title">' + strs[0] + '</div><div class="item-after">【学员】</div></div>');
                        }
                    } else {
                        $userListItem = $('<li class="item-content"></li>').html('<img src="http://live.edu-paas.com/images/user-yellow.png" />' + strs[0]);
                    }
                }
                $userListItem.attr('id', strs[1]);
                $chatOnlineList.append($userListItem);
            } catch (e) {
                console.error("用户上线异常：" + username);
            }
        }
        //        $("#talkp").text("(" + Messaging.mancount + ")");
        $(".talkp").text("(" + Messaging.mancount + ")");

    }

    ///<summary>
    ///在线用户列表中移除一个元素
    ///</summary>
    this.removeOnlineUserElement = function () {
        //监听用户退出
        this.socket.on('logout', function (o) {
            var user = username.split("|");
            console.log("离线：" + username);
            var indexOf = userList.indexOf(user[1]);
            if (-1 != indexOf) {
                try {
                    Messaging.mancount--;
                    userList.splice(indexOf, 1);
                    numUsers = userList.length;
                    $('li[id="' + user[1] + '"]').remove();
                } catch (e) {
                    console.error("用户离线异常：" + username);
                }
            }
            $(".talkp").text("(" + Messaging.mancount + ")");
        });
    }


    ///<summary>
    ///取得在线用户
    ///</summary>
    this.getOnlineUsers = function () {
        this.socket.emit('getOnlineUsers', { userRoom: flashvars.rid });
        this.socket.on('getOnlineUsers', function (data) {
            for (var index = 0; index < data.onlineUsers.length; index++) {
                Messaging.addOnlineUserElement(data.onlineUsers[index].alias);
            }
        });
    }


    ///<summary>
    ///输出提示信息
    ///</summary>
    this.logMessage = function (data) {
        Messaging.addMessageElement({ log: data }, true);
    }


    ///<summary>
    ///在聊天框中输出一条信息
    ///</summary>
    this.addMessageElement = function (data, isLog) {

        var $chatMessages = $('#chat-messages');
        if (data.hasOwnProperty("dataContent")) {
            if (isLog) {
                $chatMessages.append($('<li></li>').addClass('chat-log').text(data.log));
                console.log("聊天框", data.log);
                return;
            }
            if (data.dataContent.indexOf("cmd:") >= 0) {
            } else {
                var decodeMsg = Messaging.replace_em(data.dataContent); //解析表情
                //var $messageBodySpan = $('<span class="chat-message-body"></span>').html(decodeMsg);
                if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.symbianos || browser.versions.wp) {
                    if (window.orientation == 180 || window.orientation == 0) { } //竖屏
                    if (window.orientation == 90 || window.orientation == -90) {//横屏
                        if ($(".btn_tanping").length >= 0) {
                            if ($(".btn_tanping").is(".checked")) {
                                danmu_txt(decodeMsg);
                            }
                        }
                    }
                }


                if (data.usertype == 0) {
                    var $messageLi = $('<li class="chat-message_item talk_teacher"></li>').append("<div class=\"chat-message_itemmain\"><div class=\"chat-message_itembody\"><div class=\"chat-message_itemimg\"><img src=\"/images/User_Image.jpg\" alt=\"user_image\"></div><div class=\"nametime\"><span class=\"chat-username\">" + data.username + "</span><span class=\"chat-time\">" + sysConfig.CurentTime() + "</span><div class=\"clear\"></div></div><div class=\"send\"><span class=\"chat-message-body\">" + decodeMsg + "</span><div class=\"arrow\"></div></div></div></div>");
                    $chatMessages.append($messageLi);
                } else {
                    var $messageLi = $('<li></li>').append("<div class=\"content-block-title\"><img src=\"../../res/img/avatar.png\" style=\"width: 2.2rem;border-radius:50%\">"+data.username+"<span class=\"pull-right\">" + sysConfig.CurentTime() + "</span></div><div class=\"card\"><div class=\"card-content\"><div class=\"card-content-inner\">" + decodeMsg + "</div></div></div>");
                    $chatMessages.append($messageLi);
                }
            }
        }
    }

    ///<summary>
    ///解析表情
    ///</summary>
    this.replace_em = function (str) {
        str = str.replace(/\</g, '&lt;');
        str = str.replace(/\>/g, '&gt;');
        str = str.replace(/\n/g, '<br/>');
        str = str.replace(/\[em_([0-9]*)\]/g, '<img src="/images/arclist/$1.png" border="0" />');
        return str;
    }

    ///<summary>
    ///组合发送消息的内容
    ///</summary>
    this.sendMessage = function () {
		var txt_input= "";
		if (window.orientation == 180 || window.orientation == 0) {txt_input=$("#chatroom-input3").val();}//竖屏
		else if (window.orientation == 90 || window.orientation == -90) {txt_input=$("#chatroom-input3").val();}//横屏
		else{txt_input=$("#chatroom-input").val();}//PC

        if ($(".appvideoliaotianhp").css("display") == "block") {
			if ('' === txt_input) {
                return;
            }

        } else {
            if ('' ===txt_input) {
                return;
            }
        }
        var messageStr = "";
        if (messageStr.indexOf("cmd:") >= 0) {
            //命令忽略
        } else {
            messageStr = "msg:" + txt_input;
        }
        var data = JSON.stringify({
            dataType: 'MESSAGE',
            dataContent: messageStr,
            username: flashvars.name,
            userid: flashvars.id,
            userimg: flashvars.user_img,
            livetiem: zbtiem,
            usertype: flashvars.type
        });
        Messaging.publish(CHATROOM_TOPIC, data);
        $('#chatroom-input').val('');
        $('.chatroom-input').val('');
    }

    ///<summary>
    ///执行发送消息事件
    ///</summary>
    this.publish = function (topic, message) {
        this.socket.emit('message', { 'userRoom': topic, 'msg': message });
    }

    // 接收到消息后处理消息内容
    this.dataController = function (data) {
        console.log("用户接收消息：" + data); //+ data
        data = JSON.parse(data);
        try {
          //MESSAGE  直接  == 0
            if ('MESSAGE' === data.dataType) {
                if (data != undefined && data.hasOwnProperty("dataContent")) {
                    if (data.dataContent.indexOf("msg:") >= 0) {//接收消息
                        //alert("消息");
                        data.dataContent = data.dataContent.substring(data.dataContent.indexOf("msg:") + 4, data.dataContent.length - data.dataContent.indexOf("msg:")); //截取消息
                    }
                    if (data.dataContent.indexOf("cmd:") >= 0) {//接收命令
                        // alert("命令");
                        var cmdstr = data.dataContent.substring(data.dataContent.indexOf("cmd:") + 4, data.dataContent.length - data.dataContent.indexOf("cmd:")); //截取命令
                        var logStr = "";

                        if (cmdstr == "overlive") {
                            if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.symbianos || browser.versions.wp) {
                                window.eduVideo.playVideo(); //  这个是开启和关闭的方法
                            }
                            sysResource.SetlocalStorage("overlive_" + $("#talkId").val(), "1");
                            $("#Main").hide();
                            $(".liveHead").hide();
                            loginwindow.showerr("直播已结束");
                        } else if (cmdstr == "start") {
                            istext = 0;
                            logStr = "<div class=\"chat-time_1\">" + sysConfig.CurentTime() + "</div><span class=\"Open\">解开禁言</span>"; //SpeakingStatus(0);
                            if (roleId == 1) {
                                $('.chatroom-input').attr('disabled', true);
                                $('.btn-send-msg').attr('disabled', true);
                            }
                        } else if (cmdstr == "stop") {
                            logStr = "<div class=\"chat-time_1\">" + sysConfig.CurentTime() + "</div><span class=\"Stop\">禁止发言</span>"; //SpeakingStatus(1);
                            istext = 1;
                        }
                        if (data.usertype == 0 && flashvars.id != data.userid) {
                            if (cmdstr == "startlive") {
                                if (flashvars.id != data.userid) {
                                    $("#livestate").val("直播中");
                                    if (zbtiem == 0) {
                                        $(".edu-paas-zbswks").hide();
                                        sysConfig.zhibotime();
                                        sysResource.SetlocalStorage("zhibo_teach_" + talkId, "zhibo_" + talkId + "_" + fileguid + "_" + pagenum + "," + zbtiem);
                                    }
                                }
                            } else if (cmdstr == "user_hf") {//恢复指定用户
                                if (data.user_id == flashvars.id) { //判断教师操作的指定学员
                                    istext = 0;
                                    logStr = "<span class=\"Open\">我被解开禁言</span>";
                                    $(".btn-send-msg").removeAttr("disabled");
                                    $(".chatroom-input").removeAttr("disabled");
                                }
                            } else if (cmdstr == "user_jy") {//禁言指定用户
                                if (data.user_id == flashvars.id) { //判断教师操作的指定学员
                                    istext = 1;
                                    logStr = "<span class=\"Stop\">我被禁言</span>";
                                    $(".btn-send-msg").attr("disabled", "disabled");
                                    $(".chatroom-input").attr("disabled", "disabled");
                                }
                            } else if (cmdstr == "startobs") {
                                //开启OBS播放地址
                                if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.symbianos || browser.versions.wp) {
                                    //手机访问
                                    if (data.usertype == 0) {
                                        window.eduVideo.playVideo(); //  这个是开启和关闭的方法
                                    }
                                } else {
                                    $.post("/Server/Manager.ashx", { param: "getpushurl", roomid: $("#talkId").val(), litype: 2, r: Math.random() }, function (data) {
                                        if (data != undefined && data != null) {
                                            var liveinfo = eval("(" + data + ")");
                                            if (liveinfo.mes != null && liveinfo.mes.length > 0) {
                                                var i = 0;
                                                var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'opaque' };
                                                liveVideo.playVideo("obsplay", liveinfo.mes[i].RtmpUrl, liveinfo.mes[i].Hlsurl, "100%", "100%");
                                                $(".Desktop_sharing").show();
                                            }
                                        }
                                    });
                                }
                            } else if (cmdstr == "coloseobs") {
                                if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.symbianos || browser.versions.wp) {
                                    window.eduVideo.playVideo(); //  这个是开启和关闭的方法
                                } else {
                                    $(".Desktop_sharing").hide();
                                    $("#obslive").html("<div id=\"obsplay\"></div>");
                                }
                            } else if (cmdstr == "updnotice") {
                                //修改公告时接收的消息
                                getlainfo();
                            }else if(cmdstr == "colse_video"){
        								        close_video();
              							}
                        }

                        //学员 开启摄像头
                        if (data.usertype == 1 && flashvars.id != data.userid) {
                            //获取学员播放地址
                            $.post("/Server/Manager.ashx", { param: "getpushurl", roomid: $("#talkId").val(), litype: 0, r: Math.random() }, function (data) {
                                if (data != undefined && data != null) {
                                    var liveinfo = eval("(" + data + ")");
                                    if (liveinfo.mes != null && liveinfo.mes.length > 0) {
                                        $("#stuName").html("(" + liveinfo.mes[0].Username + ")");
                                        var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'opaque' };
                                        if (roleId == 1) {
                                            $(".rmtpBTN").hide();
                                            liveVideo.playVideo("flashbox_play", liveinfo.mes[0].RtmpUrl, liveinfo.mes[0].Hlsurl);
                                        } else {
                                            liveVideo.playVideo("playercontainer_play", liveinfo.mes[0].RtmpUrl, liveinfo.mes[0].Hlsurl);
                                        }
                                        $("#stuRefresh").show();
                                    }
                                }
                            });
                        }

                        if (data.usertype == 0 && flashvars.id == data.userid) {
                            if (cmdstr == "user_tichu") {//剔除指定用户
                                if (data.userid == flashvars.id) {
                                    $("body").html("");
                                    loginwindow.showerr("您已被管理员踢出此直播间！");
                                }
                            }
                        }

                        //接收投票命令，展示对应的投票选项
                        if (cmdstr == "user_toupiao") {
                            var que_id = data.qid;
                            $.get("/Server/HttpRequest.ashx", { action: "getque", qid: que_id, qroomid: talkId }, function (date_que) {
                                //                                console.log(date_que);
                                var retStr = eval("(" + date_que + ")");
                                $("#chat-messages").append("<li class=\"chat-message_item talk_wenjuan\"><div class=\"chat-message_itembody\"><div class=\"chat-message_itemimg\"><img src=\"/images/User_Image.jpg\" alt=\"user_image\"></div><div class=\"nametime\"><span class=\"chat-username\">123</span><span class=\"chat-time\"> 09:42:41</span><div class=\"clear\"></div></div><div class=\"send\"><div class=\"chat-message-body\"><div class=\"chat-message-body_wenjuan\"><div class=\"chat-message-body_wenjuanico\"><i class=\"ico chat-message_icowenjuan\"></i></div><div class=\"chat-message-wenjuan_main\" onclick=\"sel_toupiao('" + retStr.mes[0].Qid + "')\">" + retStr.mes[0].Qtitle + "</div></div></div><div class=\"arrow\"></div></div></li>");
                                if (flashvars.id != data.userid) { sel_toupiao("" + retStr.mes[0].Qid + ""); }
                            });
                            $("#chat-messages").append("<li class=\"chat-log\"><div class=\"wenjuan_tpxb\"><span>投票</span></div></div></li>");
                        } else if (cmdstr == "user_choice") {
                            if ($("#que_tptitle").length > 0) {
                                var roomid = data.roomid + "_" + data.qid;
                                $.get("/Server/HttpRequest.ashx", { action: "getredis", talkId2: roomid }, function (date) {
                                    var tp_sum = 0;
                                    console.log(date);
                                    if (date != undefined && date != null && date != "" && date != "-1") {
                                        date = decodeURI(date);
                                        var z_retStr1 = date.split("|");
                                        tp_sum = z_retStr1[z_retStr1.length - 2].split("*")[1];
                                        var que_id1 = z_retStr1[z_retStr1.length - 1];
                                        for (var i = 0; i < z_retStr1.length; i++) {
                                            if (z_retStr1[i].indexOf("*") >= 0) {
                                                var z_option1 = z_retStr1[i].split("*");
                                                if (z_option1[0] != "sum") {
                                                    $("#piaonum_" + que_id1 + "_" + i + "").html(z_option1[1]);
                                                    $("#wenjuantpbj_" + que_id1 + "_" + i + "").width(parseFloat(parseInt(z_option1[1]) / parseInt(tp_sum)).toFixed(2) * 100 + "%");
                                                }
                                            }
                                        }
                                    }
                                    $("#wjgltpnum_" + que_id1).html("投票总数：" + tp_sum + "票");
                                });
                            }
                            //dataContent: "cmd:user_choice"dataType: "MESSAGE"livetiem: 31263options: "0*3|1*2|2*2|3*1|"qid: "1a3b2041-a618-4693-9a83-e50b11095f87"roomid: "8f83e449-08ee-490a-a3d4-d6a7fade2555"usertype: 1
                            //                            wjgltpnum_1a3b2041-a618-4693-9a83-e50b11095f87
                            //                            wenjuantpbj_3
                            //                            console.log(data);
                        } else {
                            $("#chat-messages").append("<li class=\"chat-log\">" + logStr + "</li>");
                        }
                        if (roleId == 1) {//学生接收命令  教师忽略命令(1、学生 0、老师)
                            if (cmdstr == "start") {
                                $(".btn-send-msg").removeAttr("disabled");
                                $(".chatroom-input").removeAttr("disabled");
                                $("#SpeakingStatus").html("自由发言");
                                $("#SpeakingStatus").removeClass("StopSpeakingStatus");
                                $("#SpeakingStatus").addClass("OpenSpeakingStatus");

                                $.post("/Server/HttpRequest.ashx", { action: "user_state_save_get", talkId: talkId, user_id: flashvars.id }, function (data_jy) {
                                    if (data_jy == "1") {
                                        layer.msg("我被禁言了！", { skin: 'demo-class' });
                                        $(".btn-send-msg").attr("disabled", "disabled");
                                        $(".chatroom-input").attr("disabled", "disabled");
                                    }
                                });

                            } //"发送"启用
                            if (cmdstr == "stop") {
                                $(".btn-send-msg").attr("disabled", "disabled");
                                $(".chatroom-input").attr("disabled", "disabled");
                                $("#SpeakingStatus").html("禁止发言");
                                $("#SpeakingStatus").removeClass("OpenSpeakingStatus");
                                $("#SpeakingStatus").addClass("StopSpeakingStatus");
                            } //"发送"禁止
                        } else if (roleId == 0) {
                            if (cmdstr == "useronline") {
                                $.post("/Server/Manager.ashx", { param: "getpushurl", roomid: $("#talkId").val(), litype: flashvars.type, userid: data.username }, function (data) {
                                    if (data != undefined && data != null) {
                                        var liveinfo = eval("(" + data + ")");
                                        if (liveinfo.mes != null && liveinfo.mes.length > 0) {
                                            $("#stuName").html("(" + liveinfo.mes[0].Username + ")");
                                            for (var i = 0; i < liveinfo.mes.length; i++) {
                                                var swfhtml = $("#swf_" + liveinfo.mes[i].Userid + "").html();
                                                if (swfhtml == undefined || swfhtml == null || swfhtml == "") {
                                                    var flashvars2 = {
                                                        f: liveinfo.mes[i].RtmpUrl, //'rtmp://play.bcelive.com/live/lss-gfwi7tqry90sgzx9', //学员端地址
                                                        c: 0,
                                                        p: 1,
                                                        b: 1,
                                                        rid: '487ea418-6957-41fb-9d31-ce5326f21cef',
                                                        rtmpVideo: '',
                                                        name: '学员2',
                                                        id: '48f3889c-af8d-401f-ada2-c383031af922',
                                                        type: 1,
                                                        record: 'false',
                                                        bookname: "教育直播演示",
                                                        data: "2016-5-31 18:36:33",
                                                        createuserName: "",
                                                        teacherid: "f8b1ceea-f526-4639-95c5-31627b323e52",
                                                        ms: v    //v 声音 s 视频
                                                    };
                                                    //                        style = "margin-top: 30px;"
                                                    //$("#stulist").append('<div class="edu-paas-zhibo-right-bt" id="stutitle_' + liveinfo.mes[i].Userid + '">学生-' + liveinfo.mes[i].Username + '</div><div class="edu-paas-zhibo-xueyuan-window" id="swf_' + liveinfo.mes[i].Userid + '"><div id="playercontainer_' + liveinfo.mes[i].Userid + '"></div></div>');
                                                    $("#stulist").append('<div style="height:280px;" ><div class="edu-paas-zhibo-right-bt" id="stutitle_' + liveinfo.mes[i].Userid + '" >学生-' + liveinfo.mes[i].Username + '</div><div class="edu-paas-zhibo-xueyuan-window" id="swf_' + liveinfo.mes[i].Userid + '"><div id="playercontainer_' + liveinfo.mes[i].Userid + '"></div></div></div>');

                                                    var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'opaque' };
                                                    //                                                CKobject.embedSWF('/js/ckplayer/ckplayer.swf', 'swf_' + liveinfo.mes[i].Userid + '', 'ckplayer_a' + liveinfo.mes[i].Userid + '', '100%', '100%', flashvars2, params);
                                                    liveVideo.playVideo("playercontainer_" + liveinfo.mes[i].Userid + "", flashvars2.f, liveinfo.mes[i].Hlsurl);
                                                    //                                                    var div = document.getElementById('stulist');
                                                    //alert();
                                                    //                                                    div.scrollTop = div.scrollHeight;
                                                } else {
                                                    $("#swf_" + liveinfo.mes[i].Userid + "").show();
                                                    $("#stutitle_" + liveinfo.mes[i].Userid + "").show();
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }

                    if (roleId == 1) { zbtiem = data.livetiem; } //同步时间
                    if (data.mestype == 3) {
                        if (data.clear == "clear") {//执行清除操作
                            eduCanvas.clearArea();
                        } else {//重绘
                            xy = new Array();
                            eduCanvas.drowDTX(eval(data.data_xy), 0, init);
                        }
                    } else if (data.mestype == 4) {//执行加载图片操作
                        //$("#boardBox").css("backgroundImage", "url(" + data.data + ")");
                        //$("#boardBox").css("background-color", "#fff");
                        //                    sysConfig.GetImgSize(data.data);
                        //sysConfig.GetImgSize("boardBox", data.data);
                    } else if (data.mestype == 5) {
                        //$("#chat-messages").append("<li class=\"chat-message\"><span class=\"chat-username\">" + decodeURI(data.username) + "</span><div class=\"chat-message-down\">分享文件　" + decodeURI(data.docname) + "　<a href=\"" + data.fxpath + "\">下载</a></div></li>");
                    }
                } else {
                    if (data != undefined && data.hasOwnProperty("mestype")) {
                        if (data.mestype == 5) {
                            //接收分享的文件
                            var imghtml = "<li class=\"chat-message_item talk_wenjian\"><div class=\"nametime\"><span class=\"chat-username\">" + decodeURI(data.username) + "</span><span class=\"chat-time\">" + sysConfig.CurentTime() + "</span><div class=\"clear\"></div></div><span class=\"chat-message-body\"><div class=\"chat-message-down\"><div class=\"chat-message-wenjianname\">";
                            //office显示对应的图标
                            if (data.docname.indexOf(".doc") >= 0 || data.docname.indexOf(".docx") >= 0) {
                                imghtml += "<div class=\"ico icoword\"></div>";
                            } else if (data.docname.indexOf(".ppt") >= 0 || data.docname.indexOf(".pptx") >= 0) {
                                imghtml += "<div class=\"ico icoppt\"></div>";
                            } else if (data.docname.indexOf(".pdf") >= 0) {
                                imghtml += "<div class=\"ico icopdf\"></div>";
                            } else if (data.docname.indexOf(".jpg") >= 0 || data.docname.indexOf(".png") >= 0 || data.docname.indexOf(".gif") >= 0 || data.docname.indexOf(".jpeg") >= 0) {
                                imghtml += "<div class=\"ico icoimg\"></div>";
                            } else if (data.docname.indexOf(".xls") >= 0 || data.docname.indexOf(".xlsx") >= 0) {
                                imghtml += "<div class=\"ico icoexcel\"></div>";
                            } else {
                                imghtml += "<div class=\"ico iconull\"></div>";
                            }
                            imghtml += "<div class=\"chat-messages-fenxiangname\" title='" + decodeURI(data.docname) + "'>" + decodeURI(data.docname) + "　</div><div class=\"chat-messages-caozuo\"><a   href=\"" + data.fxpath + "\" download=\"" + decodeURI(data.docname) + "\" >下载</a></div></div></div></span><div class=\"clear\"></div></li>";
                            $("#chat-messages").append(imghtml);
                        }
                        if (flashvars.id != data.userid) {
                            if (roleId == 1) { zbtiem = data.livetiem; } //同步时间
                            if (data.mestype == 4) {//执行加载图片操作（翻页、打开文件）
                                newLive = new eduCanvas.Liveue();
                                fileguid = data.fileguid;
                                fileNames = eval(data.filenames);
                                //                            newLive = eduCanvas.Liveue();
                                //                            LiveArray = new Array();
                                //                            if (data.flid != flashvars.id) {
                                var imgsrc = data.fxpath;
                                //$("#boardBox").css("backgroundImage", "url(" + imgsrc + ")");
                                //sysConfig.GetImgSize("boardBox", imgsrc);

								if (imgsrc.indexOf(".mp3") >= 0 || imgsrc.indexOf(".flv") >= 0 || imgsrc.indexOf(".mp4") >= 0){
                  	liveVideo.playVideo("playercontainer_play", imgsrc, "",$("#Canvas_Tea").width() + "px",$("#Canvas_Tea").height() + "px");
                  	var objlive = $('#liveCenter');
                  	var top = objlive.offset().top + "px";
                  	var left = objlive.offset().left + "px";
                  	$("#playercontainer").css({ "position": "fixed", "width": $("#Canvas_Tea").width() + "px", "height":$("#Canvas_Tea").height() + "px", "top": top, "left": left, "z-index": 14 });
                    $(".countPages").html("1");
                    $(".numPages").html("1");
                }else{

                                liveRecord.loadImg(data); //加载所有图片div
                                //跳转到当前图片
                                swiper.slideTo(data.pagenum, 200, true);
                                pagenum = data.pagenum;
                                fxpathMax = imgsrc.substring(0, imgsrc.lastIndexOf('/') + 1);

                                //清除本地画板
                                //                            eduCanvas.clearArea();

                                $.post("/Server/HttpRequest.ashx", { action: "getlive", talkId: talkId, fileguid: fileguid, pagenum: pagenum }, function (data) {
                                    //清除本地画板
                                    eduCanvas.clearArea();

                                    if (data != null && data != "" && data != "[]" && eval(data)[0] != undefined) {
                                        sysResource.SetlocalStorage("zhibo_" + talkId + "_" + fileguid + "_" + pagenum, data);
                                        xy = new Array();
                                        var abc = eval(data); //视频规矩还原
                                        //                                var fxpathMax = abc[0].id.fxpathMax == null ? "" : abc[0].id.fxpathMax;
                                        //                                SetsessionStorage("zhibo_stu_num" + $("#talkId").val(), fxpathMax);
                                        var newLive1 = new Array();
                                        for (var ii = 0; ii < abc.length; ii++) {
                                            if (abc[ii].id != null) {
                                                var jsoninfo = abc[ii].id.option;
                                                if (jsoninfo != undefined && jsoninfo.length > 0) {
                                                    Array.prototype.push.apply(newLive1, eval(jsoninfo));
                                                }
                                            }
                                        }
                                        if (newLive1.length > 0) { eduCanvas.drowDTX(newLive1, 0, init); }
                                        //                            SetsessionStorage("zhibo_stu_num" + $("#talkId").val(), data); //保存画线记录
                                    } else {

                                    }
                                });
                                if (fxpathMax + fileNames == data.fxpath) {
                                    pagecount = 1;
                                    //                                    pageNumList.add(new Option(1, 1));
                                } else {
                                    pagecount = fileNames.length;
                                }

                                $(".countPages").html(pagecount);
                                $(".numPages").html(parseInt(pagenum) + 1);
                                //                                $("#pageList").find("option[value=" + (parseInt(pagenum) + 1) + "]").attr("selected", true);
                                //                            }
								}
                            } else if (data.mestype == 3) {
                                var option1 = new Array(); //画笔描点集合
                                LiveArray = new Array();
                                //                        newLive = new Array();

                                fileguid = data.fileguid;
                                fxpathMax = data.fxpathMax;
                                if (pagenum != data.pagenum) {
                                    pagenum = data.pagenum;
                                    $(".numPages").html(parseInt(pagenum) + 1);
                                    eduCanvas.clearArea();
                                    //$("#boardBox").css("backgroundImage", "url(" + fxpathMax + fileNames[data.pagenum] + ")");
                                    var ztfp = sysResource.GetlocalStorage("zhibo_" + talkId + "_" + fileguid + "_" + parseInt(data.pagenum));
                                    if (ztfp != null && ztfp != "") {
                                        var newLive_1 = eval(ztfp);
                                        for (var ii = 0; ii < newLive_1.length; ii++) {
                                            if (newLive_1[ii].id != null) {
                                                var jsoninfo = newLive_1[ii].id.option;
                                                if (jsoninfo != undefined && jsoninfo.length > 0) {
                                                    //console.log("测试-----",jsoninfo);
                                                    Array.prototype.push.apply(option1, eval(jsoninfo));
                                                }
                                            }
                                        }
                                        LiveArray = newLive_1;
                                    }
                                } else {
                                    pagenum = data.pagenum;
                                }
                                //                SetlocalStorage("zhibo_" + talkId + "_" + fileguid + "_" + pagenum, data); //保存画线记录
                                //                            if (data.flid != flashvars.id) {
                                if (data.clear == "clear") {//执行清除操作
                                    eduCanvas.clearArea();
                                    if (data.fileguid != null) {
                                        fileguid = data.fileguid; //保存画线记录
                                        pagenum = data.pagenum;
                                        sysResource.SetlocalStorage("zhibo_" + talkId + "_" + fileguid + "_" + parseInt(pagenum), null); //保存画线记录
                                    }
                                } else if (data.clear == "delfile") {//删除文件
                                    eduCanvas.clearArea();
                                    if (data.fileguid != null) {
                                        fileguid = data.fileguid;
                                        pagenum = 0;
                                        pagecount = 0;
                                        $(".countPages").html(pagecount);
                                        $(".numPages").html(pagenum);
                                        sysResource.DellocalStorage("zhibo_" + talkId + "_" + fileguid + "_"); //删除画线记录
                                        //还原画板比例，背景图片
                                        Los(1);
                                        $("#liveCenter").css("backgroundImage", "url(/Images/baiban.png)");
                                        $("#boardBox").removeAttr("style");
                                        $("#boardBox").css({ width: 800, height: 600 });
                                    }
                                } else {//重绘
                                    //var newLive = new Liveue();
                                    //                                var LiveArray = new Array();
                                    var timestamp = new Date().getTime();
                                    zbtiem = data.livetiem;
                                    var objstr = {
                                        id: timestamp,
                                        type: "1",
                                        title: zbtiem,
                                        dis: "画线",
                                        fileNames: fileNames,
                                        pagenum: pagenum,
                                        fxpathMax: fxpathMax,
                                        option: data.data_xy
                                    };

                                    newLive.add(new eduCanvas.LiveObj(objstr));
                                    if (LiveArray.length > 0) {
                                        Array.prototype.push.apply(LiveArray, newLive.toArray());
                                    } else {
                                        LiveArray = newLive.toArray();
                                    }
                                    sysResource.SetlocalStorage("zhibo_" + talkId + "_" + fileguid + "_" + pagenum, LiveArray); //保存画线记录
                                    xy = new Array();
                                    //                                    console.log("重回数组", data.data_xy);
                                    Array.prototype.push.apply(option1, eval(data.data_xy));
                                    eduCanvas.drowDTX(option1, 0, init);
                                }
                                //                            }
                            }
                        }

                        if (data.hasOwnProperty("dataContent")) {
                            if (roleId == 1) { if (zbtiem == 0) { sysConfig.zhibotime(); } zbtiem = data.livetiem; } //同步时间
                            if (data.dataContent.indexOf("msg:") >= 0) {//接收消息
                                //alert("消息");
                                data.dataContent = data.dataContent.substring(data.dataContent.indexOf("msg:") + 4, data.dataContent.length - data.dataContent.indexOf("msg:")); //截取消息
                            }
                        }
                    }
                }
            }
            Messaging.addMessageElement(data);
        } catch (e) {
            console.error('用户接收失败' + e);
        }
    }

    this.updateSysMsg = function (o, action) {
        console.log(action);
        //debugger;
    }
}
