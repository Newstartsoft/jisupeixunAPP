function saveluxiang() {
    //保存教学记录_提交画线记录
    $.post("/Server/HttpRequest.ashx", { action: "saveluxiang", talkId: talkId, zbtiem: zbtiem, r: Math.random() }, function (data) {
        console.log("提交教学记录_画线记录:" + data); //保存画线记录                    
    });
}


var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            wp: u.indexOf('IEMobile') > -1, //是否wp
            symbianos: !!u.match(/SymbianOS.*/), //是否SymbianOS
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    } (),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}


function onbeforeunload_handler() {
    //清除cookie  
    //__CookieUtil.set('YUNBA_CUSTOMID_COOKIE_' + $("#talkId").val(), "", -1);
    eduCanvas.tijiaoedu();
    saveluxiang();
    var isIE = document.all ? true : false;
    if (isIE) {//IE浏览器  
        var n = window.event.screenX - window.screenLeft;
        var b = n > document.documentElement.scrollWidth - 20;
        var bb = window.event.clientX > document.body.clientWidth;
        if (b && window.event.clientY < 0 || window.event.altKey) {
            console.log("是关闭而非刷新");
        } else {
            console.log("是刷新而非关闭");
        }
    } else {//火狐浏览器
        if (document.documentElement.scrollWidth != 0) {
            console.log("是刷新而非关闭1");
        } else {
            console.log("是关闭而非刷新1");
        }
    }
    //关闭 1 麦克风   2 摄像头    
    if (isvideo == 1) { closelive(2); }
    if (isvoice == 1) { closelive(1); }
    var warning = "确认退出?";
    return warning;
}

function onunload_handler() {
    var warning = "谢谢光临";
    console.log(warning);
    alert(warning);
}

function onscroll_handler() {
    var wh = $(window).height(); //窗体高度
    var ww = $(window).width(); //窗体高度
    var sh = $(document).scrollTop();
    if (ww <= 1170 && sh > 100) {
        $(".ppt_groupbtn").hide();
    } else {
        $(".ppt_groupbtn").show();
    }
}

 function getlainfo() {
	$("#txt_Notice").hide();
    //广告和公告
    $.get("/Server/HttpRequest.ashx", { action: "get_lainfo", talkId: talkId, r: Math.random() }, function (date) {
		//console.log("广告和公告：" + date);
        if (date != null && date != "") {
			var lainfo = eval("(" + date + ")");
				if (lainfo.mes!= null && lainfo.mes != "") {
					$("#zhiyimain").html(lainfo.mes.La_Notice); //公告
		            $("#txt_Notice").val(lainfo.mes.La_Notice);
					if(lainfo.mes.La_AdverImg!=null&&lainfo.mes.La_AdverImg!=""){
						$(".lml_stu img").attr('src', lainfo.mes.La_AdverImg); //公告图片
					}
				        // La_AdverSrc             //公告地址
				}else{
					$("#zhiyimain").html("");
					$("#txt_Notice").html("");
				}
		}
	});
}

//放大、缩小
function Los(obj) {
	proportion = obj;
    $("#prop").val(proportion);
    eduCanvas.LargeOrSmall('Canvas_Tea', 'liveCenter', proportion);
}

//输出日志
function livelog(msg) {
	console.log(msg);
}

//清屏
function qingping1() { $(".chat-messages").html(""); $("#gongjuboxshezhi").hide(); }

///<summary>
///操作系统浏览器数据写入和读取
///</summary>
var sysResource = new function () {
    ///<summary>
    ///获得本地浏览器localStorage数据
    ///</summary>
    this.GetlocalStorage = function (name) {
        if (window.localStorage) {
            var value = localStorage.getItem(name);
            if (value != null && value != "" && value != undefined) {
                return JSON.parse(value);
            } else {
                return value;
            }
        } else {
            layer.alert('您需要升级浏览器才能够进行直播', { icon: 0, title: '系统提示' });
        }
    }

    ///<summary>
    ///重写本地浏览器localStorage数据
    ///</summary>
    this.SetlocalStorage = function (name, obj) {
        if (window.localStorage) {
            try {
                localStorage.setItem(name, JSON.stringify(obj));
            }
            catch (oException) {
                if (oException.name == 'QuotaExceededError') {
                    console.log('超出本地存储限额！');
                    //如果历史信息不重要了，可清空后再设置
                    localStorage.clear();
                    localStorage.setItem(name, JSON.stringify(obj));
                }
            }
        } else {
            layer.alert('您需要升级浏览器才能够进行直播', { icon: 0, title: '系统提示' });
        }
    }

    ///<summary>
    ///模糊删除本地localStorage数据
    ///</summary>
    this.DellocalStorage = function (name) {
        if (window.localStorage) {
            for (var i = 0; i < localStorage.length; i++) {
                //key(i)获得相应的键
                var keystr = localStorage.key(i);
                if (keystr.indexOf(name) >= 0) {
                    sysResource.SetlocalStorage(keystr, null);
                }
            }
        } else {
            layer.alert('您需要升级浏览器才能够进行直播', { icon: 0, title: '系统提示' });
        }
    }

    ///<summary>
    ///获得本地浏览器SessionStorage数据
    ///</summary>
    this.GetsessionStorage = function (name) {
        if (window.sessionStorage) {
            var value = sessionStorage.getItem(name);
            if (value != undefined && value != null && value != "undefined" && value != "") {
                return JSON.parse(value);
            } else {
                return value;
            }
        } else {
            layer.alert('您需要升级浏览器才能够进行直播', { icon: 0, title: '系统提示' });
        }
    }

    /// <summary>
    /// 重写本地浏览器SessionStorage数据
    /// </summary>
    this.SetsessionStorage = function (name, obj) {
        if (window.sessionStorage) {
            if (obj == "" || obj == undefined || obj == null) {
                sessionStorage.setItem(name, obj);
            } else {
                sessionStorage.setItem(name, JSON.stringify(obj));
            }
        } else {
            layer.alert('您需要升级浏览器才能够进行直播', { icon: 0, title: '系统提示' });
        }
    }
}

///<summary>
///操作系统浏览器相关配置
///</summary>
var sysConfig = new function () {
    ///<summary>
    ///判断浏览器是否支持H5
    ///</summary>
    this.checkhHtml5 = function () {
        //        if (typeof (Worker) !== "undefined") {  return true; } else { return false; }
        if (document.getElementById("Canvas_Tea").getContext && typeof (Worker) !== "undefined") { return true; } else { return false; }
    }

    ///<summary>
    ///获取背景图片大小在白板显示
    ///</summary>
    this.GetImgSize = function (imgid, filePath) {
        /*
        var img = document.createElement("img"); //添加 img
        img.setAttribute("id", "newImg"); //设置 img 属性，如 id
        img.src = filePath; //设置 img 图片地址
        w = img.width;
        h = img.height;
        if (w != 0 && h != 0 && w >= h) {
        $("#" + imgid + "").css("background-size", "100% auto");
        } else {
        $("#" + imgid + "").css("background-size", "auto 100%");
        }*/
        var realWidth; //真实的宽度
        var realHeight; //真实的高度
        //这里做下说明，$("<img/>")这里是创建一个临时的img标签，类似js创建一个new Image()对象！
        $("<img/>").attr("src", filePath).load(function () {
            /*
            如果要获取图片的真实的宽度和高度有三点必须注意
            1、需要创建一个image对象：如这里的$("<img/>")
            2、指定图片的src路径
            3、一定要在图片加载完成后执行如.load()函数里执行
            */
            realWidth = this.width;
            realHeight = this.height;
            //如果真实的宽度大于浏览器的宽度就按照100%显示
            if (realWidth > realHeight) {
                //$(img).css("width", "100%").css("height", "auto");
                if (parseFloat(realHeight / realWidth).toFixed(2) > 0.75) {
                    $("#" + imgid + "").css("background-size", "auto 100%");
                } else {
                    $("#" + imgid + "").css("background-size", "100% auto");
                }
            } else {//如果小于浏览器的宽度按照原尺寸显示
                //$(img).css("width", realWidth + 'px').css("height", realHeight + 'px');
                $("#" + imgid + "").css("background-size", "auto 100%");
            }
        });
    }

    ///<summary>
    ///日期计算
    ///</summary>
    this.dateAdd = function (strInterval, Number, dtTmp) {
        if (dtTmp == null || dtTmp == "") {
            dtTmp = new Date();
        }
        switch (strInterval) {
            case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
            case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
            case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
            case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
            case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
            case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        }
    }

    ///<summary>
    ///获取URL传参数
    ///</summary>
    this.QueryString = function (fieldName) {
        var reg = new RegExp("(^|&)" + fieldName.toLowerCase() + "=([^&]*)(&|$)", "i");
        var r = window.location.search.toLowerCase().substr(1).match(reg);
        if (r != null) return unescape(r[2]); return "";
    }

    ///<summary>
    ///随机产生用户ID
    ///</summary>
    this.GetUserId = function () {
        var data = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        var result = "";
        for (var i = 0; i < 6; i++) { //产生20位就使i<20
            r = Math.floor(Math.random() * 36); //16为数组里面数据的数量，目的是以此当下标取数组data里的值！
            result += data[r]; //输出20次随机数的同时，让rrr加20次，就是20位的随机字符串了。
        }
        return result;
    }

    this.StartCanvasLive = function () {
        var messageStr1 = "cmd:";
        messageStr1 += "startlive";
        var data1 = JSON.stringify({
            dataType: 'MESSAGE',
            dataContent: messageStr1,
            username: flashvars.name,
            livetiem: zbtiem,
            usertype: flashvars.type,
            userid: flashvars.id
        });

        if (txt != undefined) {
            //保存教学记录_提交画线记录
            $.post("/Server/HttpRequest.ashx", { action: "saveredis_savelive", talkId2: "zhibo_jiaoxue_" + talkId, jsonstr2: "zhibo_" + talkId + "_" + fileguid + "_" + pagenum + "," + zbtiem, fileguid: fileguid, talkId: talkId, pagenum: pagenum, jsonstr: "" }, function (data) {
                console.log("提交教学记录_画线记录:" + data); //保存画线记录            
                sysResource.SetlocalStorage("zhibo_" + talkId + "_" + fileguid + "_" + pagenum, txt); //保存画线记录
            });
        }
        Messaging.publish(CHATROOM_TOPIC, data1);
    }


    ///<summary>
    ///结束直播
    ///</summary>
    this.OverLive = function () {
		
		liveVideo.saveliveconfig();
		eduCanvas.tijiaoedu();
		saveluxiang();

        layer.confirm('确定要结束直播吗？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            zbflag = false;
            var objstr = {
                id: timestamp,
                type: "1",
                title: zbtiem,
                dis: "结束",
                fileNames: "",
                pagenum: "",
                fxpathMax: "",
                option: null
            };

            var livestate = "";
            var messageStr1 = "cmd:";
            istext = 0;
            isvideo = 0;
            isvoice = 0;
            livestate = "1_0";
            messageStr1 += "overlive";
            $(".video-jiaohuan").show();

			 $.post("/Server/Manager.ashx?r=" + Math.random() + "", { param: "savelivestate", roomid: talkId, state: "2", resurl: decodeURI(sysConfig.QueryString("resurl")) }, function (data) {
                    if (data != undefined && data != null) {
                    }
                });

            //修改学员直播流的地址（关闭推流）
            //            $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: userid, delmark: 0, r: Math.random() }, function (data_upd) {
            //                console.log(data_upd);
            //                //layer.alert(data_upd);
            //            });

            var data1 = JSON.stringify({
                dataType: 'MESSAGE',
                dataContent: messageStr1,
                username: flashvars.name,
                livetiem: zbtiem,
                usertype: flashvars.type,
                userid: flashvars.id
            });

            var objstr = {
                id: timestamp,
                type: "1",
                title: zbtiem,
                dis: livestate
            };

            
            Messaging.publish(CHATROOM_TOPIC, data1);
            eduCanvas.saveluzhi(objstr);
            sysResource.SetlocalStorage("overlive_" + $("#talkId").val(), "1");
            loginwindow.showerr("直播已结束");

            layer.msg('', { time: 1 });
        }, function () {
            //layer.msg('取消');
        });
    }

	 ///<summary>
    ///结束直播 (手机直播)
    ///</summary>
    this.OverLive2 = function () {
            zbflag = false;
            var objstr = {
                id: timestamp,
                type: "1",
                title: zbtiem,
                dis: "结束",
                fileNames: "",
                pagenum: "",
                fxpathMax: "",
                option: null
            };

            var livestate = "";
            var messageStr1 = "cmd:";
            istext = 0;
            isvideo = 0;
            isvoice = 0;
            livestate = "1_0";
            messageStr1 += "overlive";
            $(".video-jiaohuan").show();

			 $.post("/Server/Manager.ashx?r=" + Math.random() + "", { param: "savelivestate", roomid: talkId, state: "2" }, function (data) {
                    if (data != undefined && data != null) {
                    }
                });

            //修改学员直播流的地址（关闭推流）
            //            $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: userid, delmark: 0, r: Math.random() }, function (data_upd) {
            //                console.log(data_upd);
            //                //layer.alert(data_upd);
            //            });

            var data1 = JSON.stringify({
                dataType: 'MESSAGE',
                dataContent: messageStr1,
                username: flashvars.name,
                livetiem: zbtiem,
                usertype: flashvars.type,
                userid: flashvars.id
            });

            var objstr = {
                id: timestamp,
                type: "1",
                title: zbtiem,
                dis: livestate
            };

            liveVideo.saveliveconfig();
            Messaging.publish(CHATROOM_TOPIC, data1);
            eduCanvas.saveluzhi(objstr);
            sysResource.SetlocalStorage("overlive_" + $("#talkId").val(), "1");

    }

    ///<summary>
    ///关闭选项卡
    ///</summary>
    this.CloseWebPage = function () {
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        }
        else if (navigator.userAgent.indexOf("Firefox") > 0) {
            window.location.href = 'about:blank ';
        } else {
            window.opener = null;
            window.open('', '_self', '');
            window.close();
        }
    }

    ///<summary>
    ///直播计时器
    ///</summary>
    this.zhibotime = function () {
        zbtiem++;
        //超过4小时的部分重新计费
        if (zbtiem >= livetime) {
            //        jifeiNum++;
            livetime = livetime + (60 * 60);
            //扣费
            $.post("/server/httprequest.ashx", { action: "livedebit", username: flashvars.id, roomid: $("#talkId").val() }, function (data) {
                console.log("扣费记录:" + data);
            });
        }
        var hht = 0, mmt = 0, sst = 0;
        var hh = "00", mm = "00", ss = "00";
        if (zbtiem < 60) {
            if ((zbtiem + "").length == 1) { ss = "0" + zbtiem; } else { ss = zbtiem; }
        } else if (zbtiem >= 60 && zbtiem < 3600) {
            mmt = parseInt(zbtiem / 60);
            if ((mmt + "").length == 1) { mm = "0" + mmt; } else { mm = mmt; }
            sst = zbtiem - (mmt * 60);
            if ((sst + "").length == 1) { ss = "0" + sst; } else { ss = sst; }

        } else if (zbtiem >= 3600) {
            hht = parseInt(zbtiem / 3600);
            if ((hht + "").length == 1) { hh = "0" + hht; } else { hh = hht; }
            mmt = parseInt((zbtiem - (hht * 3600)) / 60);
            if ((mmt + "").length == 1) { mm = "0" + mmt; } else { mm = mmt; }
            sst = (zbtiem - (hht * 3600) - (mmt * 60));
            if ((sst + "").length == 1) { ss = "0" + sst; } else { ss = sst; }
        }
        $("#zbtiem").html(hh + ":" + mm + ":" + ss);

        //直播倒计时4小时 最后15分钟提示
        if (zbtiem <= 4 * 60 * 60 && zbtiem >= 3 * 60 * 60 + 45 * 60) {
            $("#livetishi").show();
            $("#livetime").show();
            //900

            var mmt_1 = 0, sst_1 = 0, zongt = 900;
            var mm_1 = "00", ss_1 = "00";
            if (zongt > 0) {
                mmt_1 = parseInt(zongt / 60);
                if ((mmt_1 + "").length == 1) { mm_1 = "0" + mmt_1; } else { mm_1 = mmt_1; }
                sst_1 = zongt - mmt_1 * 60;
                if ((sst_1 + "").length == 1) { ss_1 = "0" + sst_1; } else { ss_1 = sst_1; }
                $("#livetishi").html(mm_1 + ":" + ss_1);
            }
        } else {
            $("#livetishi").hide();
            $("#livetime").hide();
        }
        if (zbflag) { setTimeout(sysConfig.zhibotime, 1000); }
    }


    this.CurentTime = function () {
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var se = now.getSeconds();
        var clock = "     ";
        //    var clock = year + "-";
        //    if (month < 10)
        //        clock += "0";
        //    clock += month + "-";
        //    if (day < 10)
        //        clock += "0";
        //    clock += day + " ";
        if (hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10)
            clock += '0';
        clock += mm + ":";
        if (se < 10)
            clock += '0';
        clock += se;
        return (clock);
    }

    //画笔颜色
    this.GetColor = function (e) {
        $("#divyanse").hide();
        color = e;
    }

    this.RightMenu = function (element) {
        context.init({ preventDoubleContext: false });
        context.attach(element, [
        //{ header: 'Compressed Menu' }, //菜单中的标题
		    {text: '清屏', action: function (e) {
		        e.preventDefault();
		        $("#chat-messages").html("");
		    }
		},
        //{ text: 'View Page Info', href: '#' }, //普通选项
        //{ divider: true }, //横线
	    ]);
    }
}
/*
///<summary>
///消息通道
///</summary>
var Messaging = new function () {

    //验证消息通道
    var msg_sdk = new Yunba({ appkey: '55cc0d389477ebf52469582a' });
	this.mancount = 0;
    var userList = [], numUsers = 1, username = ''; //用户列表、直播间当前在线人数、用户信息、用户总数

    ///<summary>
    ///初始化
    ///</summary>
    this.initMsg = function () {
        $("#divfile").html("");
        $("#divfile").append("<li class=\"chat-log\">正在初始化...</li>");
        msg_sdk.init(function (success) {
            if (success) {
                $("#divfile").append("<li class=\"chat-log\">初始化成功...");
                Messaging.connect();
            } else {
                $("#divfile").append("<li class=\"chat-log\">初始化失败或服务断线，若长时间无响应请尝试<a href=\"javascript:location.reload();\">刷新</a>页面");
                Messaging.connect();
            }
        }, function () {
            $("#divfile").append("<li class=\"chat-log\">服务断线，正在尝试重新连接...");
            Messaging.connect();
        });
    }

    ///<summary>
    ///连接服务器
    ///</summary> 
    this.connect = function () {
		//广告
		getlainfo();
        $("#divfile").append("<li class=\"chat-log\">正在尝试连接...");
        msg_sdk.connect(function (success, msg) {
            if (success) {
                $("#divfile").append("<li class=\"chat-log\">连接成功...");
                console.log("连接通讯服务器成功！");
                $("#Main").show();
                loginwindow.loadinghide();
                Messaging.setMessageCallback();
                Messaging.setAlias(function () {
                    Messaging.subscribe(CHATROOM_TOPIC);
                });
            } else {
                $("#divfile").append("<li class=\"chat-log\">连接失败或服务断线，若长时间无响应请尝试<a href=\"javascript:location.reload();\">刷新</a>页面");
                $("#Main").hide();
                $("#loading").show();
                console.error("连接通讯服务器失败！");
                Messaging.logMessage(msg);
            }
        });
    }

    ///<summary>
    ///服务器断开
    ///</summary> 
    this.disconnect = function () {
        $("#divfile").html("");
        $("#divfile").append("<li class=\"chat-log\">通讯服务器断开连接，请检查网络..");
        $("#divfile").show();
        $("#loading").show();
    }

    ///<summary>
    ///设置通讯中使用的别名
    ///</summary>  
    this.setAlias = function (callback) {
        var alias = flashvars.name + "|" + flashvars.id + "|" + flashvars.type;
        msg_sdk.get_alias(function (data) {
            if (!data.alias) {
                msg_sdk.set_alias({ 'alias': alias }, function (data) {
                    if (!data.success) {
                        console.error("设置通讯昵称失败！");
                    } else {
                        username = flashvars.name;
                        console.log("设置通讯昵称成功" + data.msg);
                    }
                    callback && callback();
                });
            } else {
                username = data.alias.split("|")[0];
                callback && callback();
            }
        });
    }

    ///<summary>
    ///订阅消息（只接收固定房间标号的消息）
    ///</summary> 
    this.subscribe = function (topic) {
        $("#divfile").html("");
        $("#divfile").append("<li class=\"chat-log\">正在尝试加入房间...");
        msg_sdk.subscribe({ 'topic': topic }, function (success, msg) {
            if (success) {
                msg_sdk.subscribe_presence({ 'topic': topic }, function (success, msg) {
                    if (success) {
                        $("#divfile").append("<li class=\"chat-log\">加入房间成功...");
                        $("#divfile").hide();
                        console.log("加入房间成功！");
                        Messaging.getOnlineUsers();
                    } else {
                        $("#divfile").append("<li class=\"chat-log\">加入房间失败或服务断线，若长时间无响应请尝试<a href=\"javascript:location.reload();\">刷新</a>页面");
                        $("#Init").css("display", "none");
                        $("#Main").css("display", "none");
                        console.error("加入房间失败或服务断线！");
                        Messaging.logMessage(msg);
                    }
                });
            } else {
                $("#Init").css("display", "none");
                $("#Main").css("display", "none");
                $("#divfile").append("<li class=\"chat-log\">加入房间失败或服务断线，若长时间无响应请尝试<a href=\"javascript:location.reload();\">刷新</a>页面");
                console.error("加入房间失败或服务断线！");
                Messaging.logMessage(msg);
            }
        });
    }

    ///<summary>
    ///取得在线用户
    ///</summary>
    this.getOnlineUsers = function () {
        msg_sdk.get_alias_list(CHATROOM_TOPIC, function (success, data) {
            if (success) {
                var index = 0,
            length = data.alias.length,
            alias = {};
                var j = 0;
                for (var index = 0; index < length; index++) {
                    msg_sdk.get_state(data.alias[index], function (data) {
                        if (data.success && data.data == 'online') {
                            j = j + 1;
                            Messaging.addOnlineUserElement(data.alias);
                        }
                    });
                }
                console.log("获取用户列表成功！");
            } else {
                console.error("获取用户列表失败！");
            }
        });
    }

    ///<summary>
    ///设置接收到 message 的回调处理方法
    ///</summary>
    this.setMessageCallback = function () {
        try {
            msg_sdk.set_message_cb(function (data) {
                if (data.presence && data.topic == (CHATROOM_TOPIC + '/p')) {
                    var presence = data.presence,
                alias = presence.alias;
                    if (presence.action == 'online' || presence.action == 'join') {
                        Messaging.addOnlineUserElement(alias);
                    } else if (presence.action == 'offline') {
                        Messaging.removeOnlineUserElement(alias);
                    }
                } else if (data.topic == CHATROOM_TOPIC) {
                    Messaging.dataController(data.msg);
                }
            });
        } catch (e) {
            var acc = e;
            console.error("接收失败：" + acc);
        }
    }

    ///<summary>
    ///在线用户列表中添加一个元素
    ///</summary>
    this.addOnlineUserElement = function (username) {
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
                if (strs[1] == flashvars.id) {
                    $userListItem = $('<li class="list-group-item" ></li>').html('<div class="chat-online-listimg"><img src="/images/User_Image.jpg"></div><div class="online-list-right"><div class="online-list-userrole">[我]</div><div class="online-list_username">' + strs[0] + '</div></div>');
                } else {
                    if (strs[2] == 0) {
                    $userListItem = $('<li class="list-group-item" ></li>').html('<div class="chat-online-listimg"><img src="/images/User_Image.jpg"></div><div class="online-list-right"><div class="online-list-userrole">[老师]</div><div class="online-list_username">' + strs[0] + '</div></div>');
                    } else if (strs[2] == 1) {
                        if (flashvars.type == 0) {
                            if (sysResource.GetlocalStorage("state_" + user[1]) == "1") {
                                $userListItem = $('<li class="list-group-item" ></li>').html("<div class=\"chat-online-listimg\"><img src=\"/images/User_Image.jpg\"></div><div class=\"online-list-right\"><div class=\"online-list-userrole\">[学员]</div><div class=\"online-list_username\">" + strs[0] + "</div></div><span style=\"float:right;\"><i class=\"ico icojcjy\" title=\"禁言\" onclick=\"jinyan_user(this,'" + user[1] + "',0)\" ></i><i class=\"ico icotc\" title=\"踢出\" onclick=\"tichu_user(this,'" + user[1] + "')\"></i>");
                            } else {
                                $userListItem = $('<li class="list-group-item" ></li>').html("<div class=\"chat-online-listimg\"><img src=\"/images/User_Image.jpg\"></div><div class=\"online-list-right\"><div class=\"online-list-userrole\">[学员]</div><div class=\"online-list_username\">" + strs[0] + "</div></div><span style=\"float:right;\"><i class=\"ico icojinyan\" title=\"禁言\" onclick=\"jinyan_user(this,'" + user[1] + "',1)\" ></i><i class=\"ico icotc\" title=\"踢出\" onclick=\"tichu_user(this,'" + user[1] + "')\"></i>");
                            }
                        } else if (flashvars.type == 1) {
                            $userListItem = $('<li class="list-group-item" ></li>').html("<div class=\"chat-online-listimg\"><img src=\"/images/User_Image.jpg\"></div><div class=\"online-list-right\"><div class=\"online-list-userrole\">[学员]</div><div class=\"online-list_username\">" + strs[0] + "</div>"+ "</div>");
                        }

                    } else {
                        $userListItem = $('<li class="list-group-item" ></li>').html('<img src="/images/user-yellow.png" />' + strs[0]);
                    }
                }
                $userListItem.attr('id', strs[1]);
                $chatOnlineList.append($userListItem);
            } catch (e) {
                console.error("用户上线异常：" + username);
            }
        }
//        $("#talkp").text("(" + Messaging.mancount + ")");
        $(".talkp").text("" + Messaging.mancount + "");
    }

    ///<summary>
    ///在线用户列表中移除一个元素
    ///</summary>
    this.removeOnlineUserElement = function (username) {
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
//        $("#talkp").text("(" + Messaging.mancount + ")");
		        $(".talkp").text("" + Messaging.mancount + "");
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
//if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.symbianos || browser.versions.wp) {
	if (window.orientation == 180 || window.orientation == 0) {}//竖屏
	if (window.orientation == 90 || window.orientation == -90) {//横屏
		if($(".btn_tanping").length>=0){
			if($(".btn_tanping").is(".checked")){
				danmu_txt(decodeMsg);
			}
		}
	}
//}


                if (data.usertype == 0) {
                    //var $messageLi = $('<li class="chat-message_item talk_teacher"></li>').append("<div class=\"nametime\"><span class=\"chat-username\">" + data.username + "</span><span class=\"chat-time\">" + sysConfig.CurentTime() + "</span><div class=\"clear\"></div></div>", $messageBodySpan);

                    var $messageLi = $('<li class="chat-message_item talk_teacher"></li>').append("<div class=\"chat-message_itemmain\"><div class=\"chat-message_itembody\"><div class=\"chat-message_itemimg\"><img src=\"/images/User_Image.jpg\" alt=\"user_image\"></div><div class=\"nametime\"><span class=\"chat-username\">" + data.username + "</span><span class=\"chat-time\">" + sysConfig.CurentTime() + "</span><div class=\"clear\"></div></div><div class=\"send\"><span class=\"chat-message-body\">" + decodeMsg + "</span><div class=\"arrow\"></div></div></div></div>");
                    $chatMessages.append($messageLi);
                } else {
                    // var $messageLi = $('<li class="chat-message_item "></li>').append("<div class=\"nametime\"><span class=\"chat-username\">" + data.username + "</span><span class=\"chat-time\">" + sysConfig.CurentTime() + "</span><div class=\"clear\"></div></div>", $messageBodySpan);
                    var $messageLi = $('<li class="chat-message_item "></li>').append("<div class=\"chat-message_itemmain\"><div class=\"chat-message_itembody\"><div class=\"chat-message_itemimg\"><img src=\"/images/User_Image.jpg\" alt=\"user_image\"></div><div class=\"nametime\"><span class=\"chat-username\">" + data.username + "</span><span class=\"chat-time\">" + sysConfig.CurentTime() + "</span><div class=\"clear\"></div></div><div class=\"send\"><span class=\"chat-message-body\">" + decodeMsg + "</span><div class=\"arrow\"></div></div></div></div>");
                    $chatMessages.append($messageLi);
                }
                //                $chatMessages.scrollTop($chatMessages[0].scrollHeight);




            }
        }
        $chatMessages.scrollTop($chatMessages[0].scrollHeight);
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

		if ($(".appvideoliaotianhp").css("display") == "block"){
			if ('' === $('.chatroom-input').val()) {
				$('.chatroom-input').focus();
				return;
			}
		}else{		
			if ('' === $('#chatroom-input').val()) {
				$('#chatroom-input').focus();
				return;
			}
		}
        var messageStr = $('#chatroom-input').val();
		if(messageStr==""){messageStr = $('.chatroom-input').val();}
        if (messageStr.indexOf("cmd:") >= 0) {
            //命令忽略
        } else {
            messageStr = "msg:" + messageStr;
        }
        var data = JSON.stringify({
            dataType: 'MESSAGE',
            dataContent: messageStr,
            username: flashvars.name,
            userid: flashvars.id,
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
        msg_sdk.publish({ 'topic': topic, 'msg': message }, function (success, msg) {
            if (success) {
                console.log('消息发布成功');
            } else {
                console.error('消息发布失败：' + msg);
                Messaging.logMessage(msg);
            }
        });
    }

    // 接收到消息后处理消息内容
    this.dataController = function (data) {
        console.log("用户接收消息："); //+ data
        data = JSON.parse(data);

        try {
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
                                //window.eduVideo.playVideo(); //  这个是开启和关闭的方法 
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
                            logStr = "<div class=\"chat-time_1\">" + sysConfig.CurentTime() + "</div><span class=\"Stop\">全部禁言</span>"; //SpeakingStatus(1); 
                            istext = 1;
                        } else if (cmdstr == "colsemkf") {//关闭麦克风
                            isvoice = 0;
                            //logStr = "<div class=\"chat-time_1\">" + sysConfig.CurentTime() + "</div><span class=\"Stop\">关闭麦克风</span>";
                            if (flashvars.id != data.userid) {
                                if (data.usertype == 0 && roleId == 0) { $("#video_teacher").hide(); $(".venlarge").show(); }
                                if (data.usertype == 1 && roleId == 0) { $("#video_student").hide(); }
                                if (data.usertype == 0 && roleId == 1) { $("#video_teacher").hide(); $(".venlarge").show(); }
                                if (data.usertype == 1 && roleId == 1) { $("#video_student").hide(); }
                            }
                        } else if (cmdstr == "colsesxt") {//关闭摄像头
                            isvideo = 0;
                            //logStr = "<div class=\"chat-time_1\">" + sysConfig.CurentTime() + "</div><span class=\"Stop\">关闭摄像头</span>";
                            if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.symbianos || browser.versions.wp) {//手机访问
                                if (data.usertype == 0) {
                                    //alert("colsesxt");
                                    //window.eduVideo.playVideo(); //  这个是开启和关闭的方法 
                                }
                            }
                            //                            $("#playercontainer").html("<div id=\"playercontainer\"><img src=\"/images/voidenot.png\" style=\"width:100%;\" ></div>");
                        } else if (cmdstr == "startmkf") { //开启麦克风            
                            isvoice = 1;
                            //logStr = "<div class=\"chat-time_1\">" + sysConfig.CurentTime() + "</div><span class=\"Open\">开启麦克风</span>";
                            if (flashvars.id != data.userid) {
                                if (data.usertype == 0 && roleId == 0) { $("#video_teacher").show(); }
                                if (data.usertype == 1 && roleId == 0) { $("#video_student").show(); }
                                if (data.usertype == 0 && roleId == 1) { $("#video_teacher").show(); }
                                if (data.usertype == 1 && roleId == 1) { $("#video_student").show(); }
                            }							
                        } else if (cmdstr == "startsxt") {//开启摄像头
                            isvideo = 1;
                            //logStr = "<div class=\"chat-time_1\">" + sysConfig.CurentTime() + "</div><span class=\"Open\">开启摄像头</span>";
                            if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.symbianos || browser.versions.wp) {//手机访问
                                if (data.usertype == 0) {
                                    //                                    alert("playVideo");
                                    //window.eduVideo.playVideo(); //  这个是开启和关闭的方法 
                                }
                            }
                        }

                        if (data.usertype == 0 && flashvars.id != data.userid) {
                            if (cmdstr == "startlive") {
                                if (flashvars.id != data.userid) {
                                    $("#livestate").val("直播中");
                                    if (zbtiem == 0) {
										dao_ji_shi = false;
										$(".edu-paas-zbswks").hide();
                                        sysConfig.zhibotime();
                                        sysResource.SetlocalStorage("zhibo_teach_" + talkId, "zhibo_" + talkId + "_" + fileguid + "_" + pagenum + "," + zbtiem);
                                    }
                                }
                            } else if (cmdstr == "startsxt" || cmdstr == "startmkf") {//开启摄像头
                                //教师 开启摄像头
                                $.post("/Server/Manager.ashx?r="+Math.random(), { param: "getpushurl_new", roomid: $("#talkId").val(), litype: 1 }, function (data) {
                                    if (data != undefined && data != null) {
                                        var liveinfo = eval("(" + data + ")");
                                        if (liveinfo.mes != null && liveinfo.mes.length > 0) {
                                            var i = 0;
                                            $("#teachName").html("(" + liveinfo.mes[i].Lm_teacode + ")");
                                            var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'opaque' };
                                            //CKobject.embedSWF('/js/ckplayer/ckplayer.swf', 'swf_1', 'ckplayer_1', '100%', '100%', flashvars2, params);
                                            if (liveinfo.mes[i].Lm_roomype == "1") {
												                            if (liveinfo.mes[i].Lm_livestate=="1"){
                                                if (roleId == 1) {
													if(livetype == 2){
							                            liveVideo.playVideo("obsplay",liveinfo.mes[i].Lm_newpush, "", "100%", "100%");
						                                $(".Desktop_sharing").show();
													}else{
														liveVideo.playVideo("playercontainer_play", liveinfo.mes[i].Lm_newpush, "");
													}
                                                } else {
                                                    $(".rmtpBTN").hide();
                                                    if (cmdstr == "startmkf") {
                                                        $("#video_teacher").show();
                                                        $(".venlarge").hide();
                                                    }
                                                    liveVideo.playVideo("flashbox_play", liveinfo.mes[i].Lm_newpush, "");
                                                }
                                                $("#teachRefresh").show();
																			}
                                            } else {
                                                //获取教师播放地址

                                                $.post("/Server/Manager.ashx?r="+Math.random(), { param: "getpushurl", roomid: $("#talkId").val(), litype: 1}, function (data) {
                                                    if (data != undefined && data != null) {
                                                        var liveinfo = eval("(" + data + ")");
                                                        if (liveinfo.mes != null && liveinfo.mes.length > 0) {
                                                            var i = 0;
                                                            $("#teachName").html("(" + liveinfo.mes[i].Username + ")");
                                                            var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'opaque' };
                                                            //CKobject.embedSWF('/js/ckplayer/ckplayer.swf', 'swf_1', 'ckplayer_1', '100%', '100%', flashvars2, params);
                                                            if (roleId == 1) {
                                                                liveVideo.playVideo("playercontainer_play", liveinfo.mes[i].RtmpUrl, liveinfo.mes[i].Hlsurl);
                                                            } else {
                                                                $(".rmtpBTN").hide();
                                                                if (cmdstr == "startmkf") {
                                                                    $("#video_teacher").show();
                                                                    $(".venlarge").hide();

                                                                }
                                                                liveVideo.playVideo("flashbox_play", liveinfo.mes[i].RtmpUrl, liveinfo.mes[i].Hlsurl);
                                                            }
                                                            $("#teachRefresh").show();
                                                        }
                                                    }
                                                });

                                            }
                                        }
                                    } else {
                                        //获取教师播放地址

                                        $.post("/Server/Manager.ashx?r="+Math.random(), { param: "getpushurl", roomid: $("#talkId").val(), litype: 1 }, function (data) {
                                            if (data != undefined && data != null) {
                                                var liveinfo = eval("(" + data + ")");
                                                if (liveinfo.mes != null && liveinfo.mes.length > 0) {
                                                    var i = 0;
                                                    $("#teachName").html("(" + liveinfo.mes[i].Username + ")");
                                                    var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'opaque' };
                                                    //CKobject.embedSWF('/js/ckplayer/ckplayer.swf', 'swf_1', 'ckplayer_1', '100%', '100%', flashvars2, params);
                                                    if (roleId == 1) {
                                                        liveVideo.playVideo("playercontainer_play", liveinfo.mes[i].RtmpUrl, liveinfo.mes[i].Hlsurl);
                                                    } else {
                                                        $(".rmtpBTN").hide();
                                                        if (cmdstr == "startmkf") {
                                                            $("#video_teacher").show();
                                                            $(".venlarge").hide();

                                                        }
                                                        liveVideo.playVideo("flashbox_play", liveinfo.mes[i].RtmpUrl, liveinfo.mes[i].Hlsurl);
                                                    }
                                                    $("#teachRefresh").show();
                                                }
                                            }
                                        });

                                    }
                                });




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
                                        //alert("startsxt");
                                        //window.eduVideo.playVideo(); //  这个是开启和关闭的方法 

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
                                    //window.eduVideo.playVideo(); //  这个是开启和关闭的方法 
                                } else {
                                    $(".Desktop_sharing").hide();
                                    $("#obslive").html("<div id=\"obsplay\"></div>");
                                }
                            } else if (cmdstr == "updnotice") {
                                //修改公告时接收的消息
                                console.log(data);
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

                        //关闭摄像头
                        if ((cmdstr == "colsesxt" || cmdstr == "colsemkf") && flashvars.id != data.userid) {
								 $(".appvideostop").hide();
                            var colse_userid = data.userid;
                            if ((roleId == 1 && data.usertype == 0) || (roleId == 0 && data.usertype == 1)) {
                                if (roleId == 1 && data.usertype == 0) { $("#teachName").html(""); $("#teachRefresh").hide(); }
                                if (roleId == 0 && data.usertype == 1) { $("#stuName").html(""); $("#stuRefresh").hide(); }
                                $("#playercontainer_play").html("<img src=\"/images/voidenot.png\"  style=\"height:100%;width:100%;\" />");
                                $("#playercontainer_play").removeAttr("style");
                                $("#playercontainer_play").removeAttr("class");
                            } else if (roleId == 0 && data.usertype == 0) {
                                $("#teachName").html("");
                                $("#flashbox_play").html("");
                                $("#flashbox_play").removeAttr("style");
                                $("#flashbox_play").removeAttr("class");
                                $(".rmtpBTN").show();
                                $("#teachRefresh").hide();
                            } else if (roleId == 1 && data.usertype == 1) {
                                $("#stuName").html("");
                                $("#flashbox_play").html("");
                                $("#flashbox_play").removeAttr("style");
                                $("#flashbox_play").removeAttr("class");
                                $(".rmtpBTN").show();
                                $("#stuRefresh").hide();
                            }

                            //修改学员直播流的地址
                            $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: colse_userid, delmark: 0, r: Math.random() }, function (data_upd) {
                                console.log(data_upd);
                            });
                        }

                        //接收投票命令，展示对应的投票选项
                        if (cmdstr == "user_toupiao") {
                            var que_id = data.qid;
                            $.get("/Server/HttpRequest.ashx", { action: "getque", qid: que_id, qroomid: talkId }, function (date_que) {
                                //                                console.log(date_que);
                                var retStr = eval("(" + date_que + ")");
                                $("#chat-messages").append("<li class=\"chat-message_item talk_wenjuan\"><div class=\"chat-message_itembody\"><div class=\"chat-message_itemimg\"><img src=\"/images/User_Image.jpg\" alt=\"user_image\"></div><div class=\"nametime\"><span class=\"chat-username\">123</span><span class=\"chat-time\"> 09:42:41</span><div class=\"clear\"></div></div><div class=\"send\"><div class=\"chat-message-body\"><div class=\"chat-message-body_wenjuan\"><div class=\"chat-message-body_wenjuanico\"><i class=\"ico chat-message_icowenjuan\"></i></div><div class=\"chat-message-wenjuan_main\" onclick=\"sel_toupiao('" + retStr.mes[0].Qid + "')\">" + retStr.mes[0].Qtitle + "</div></div></div><div class=\"arrow\"></div></div></li>");
								if(flashvars.id != data.userid){sel_toupiao("" + retStr.mes[0].Qid + "");}
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
                        }else {
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
                                $("#SpeakingStatus").html("全部禁言");
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
                                imghtml += "<div class=\"ico ico_img\"></div>";
                            } else if (data.docname.indexOf(".xls") >= 0 || data.docname.indexOf(".xlsx") >= 0) {
                                imghtml += "<div class=\"ico icoexcel\"></div>";
                            } else if (data.docname.indexOf(".mp3") >= 0 ) {
                                imghtml += "<div class=\"ico icomp3\"></div>";
                            } else if (data.docname.indexOf(".mp4") >= 0 ) {
                                imghtml += "<div class=\"ico icovideo\"></div>";
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
								if (imgsrc.indexOf(".jpg") >= 0 || imgsrc.indexOf(".png") >= 0 || imgsrc.indexOf(".jpge") >= 0){	
                                //$("#boardBox").css("backgroundImage", "url(" + imgsrc + ")");
                                //sysConfig.GetImgSize("boardBox", imgsrc);
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

}else if (imgsrc.indexOf(".flv") >= 0||imgsrc.indexOf(".mp4") >= 0 || imgsrc.indexOf(".mp3") >= 0){
$("#divfilelist").hide();
$(".ncsp_vido").show();
$(".rmtpBTN").hide();
liveVideo.playVideo("playercontainer_play", imgsrc, "",$("#Canvas_Tea").width() + "px",$("#Canvas_Tea").height() + "px");
var objlive = $('#liveCenter');
var top = objlive.offset().top + "px";
var left = objlive.offset().left + "px";
$("#playercontainer").css({ "position": "fixed", "width": $("#Canvas_Tea").width() + "px", "height": $("#Canvas_Tea").height() + "px", "top": top, "left": left, "z-index": 14 });
}
                                //                                $("#pageList").find("option[value=" + (parseInt(pagenum) + 1) + "]").attr("selected", true);
                                //                            }
                            } else if (data.mestype == 3) {
                                var option1 = new Array(); //画笔描点集合
                                LiveArray = new Array();
                                //                        newLive = new Array();

                                fileguid = data.fileguid;
                                fxpathMax = data.fxpathMax;
                                if (pagenum != data.pagenum) {
                                    pagenum = data.pagenum;
                                    $(".numPages").html(parseInt(pagenum) + 1);
									swiper.slideTo(parseInt(pagenum), 200, true);
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
}
*/
///<summary>
///视频相关 推流 和 拉流
///</summary>
var liveVideo = new function () {

    ///<summary>
    ///视频播放拉流
    ///</summary>
    this.playVideo = function (userid, fileUrl, hlsurl, w, h) {
        console.log("rtmpurl:" + fileUrl + "hlsurl:" + hlsurl);
        try {

// if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.symbianos || browser.versions.wp) {//手机访问
//	if (window.orientation == 180 || window.orientation == 0) {}//竖屏

	 	if ((window.orientation == 180 || window.orientation == 0 || window.orientation == 90 || window.orientation == -90)&&(livetype==1 || livetype==3)) {//横屏
//if(livetype==1 || livetype==3){
            if (!w) { w = "100%"; }
            if (!h) { h = "100%"; }
			fileUrl = hlsurl;
//			alert(fileUrl);
			//}
			if (sysConfig.QueryString("uid") != "" && sysConfig.QueryString("uid") != null){


			}else{
				$(".appvideostop").show();
				$("#"+userid+"").html("<audio src=\""+fileUrl+"\" id=\"audio1\" controls=\"controls\"></audio>");
			}
//alert($("#"+userid+"").html());
 }else{
	 $(".appvideostop").hide();
            if (!w) { w = "220"; }
            if (!h) { h = "160"; }
 

            var player = cyberplayer(userid).setup({
                width: w,
                height: h,
                stretching: "uniform",
                file: fileUrl,
                autostart: true,
                repeat: false,
                volume: 100,
        controls: true,
        isLive: true,
                rtmp: {
                    reconnecttime: 10,
                    bufferlength: 1
                },
                //                minBufferLength: 1,
                fallbackfile: hlsurl,
                ak: "46f1d86bc6564883bc805c3c6d2c03e7" // 公有云平台注册即可获得accessKey
            });
			}
        } catch (e) {
            console.error('视频播放异常：' + e);
        }
    }

    ///<summary>
    ///视频播放推流
    ///</summary>
    this.pushVideo = function (flashvars, videid) {
        try {
            var params = { wmode: 'transparent' };
            //        bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', 
            //        var video = [flashvars.f + '->video/mp4'];        
            //        CKobject.embed('/js/Live/video.swf', videid, new_vid, '100%', "100%", false, flashvars, video, params);
            var attributes = {};
            swfobject.embedSWF("/js/Live/video.swf", videid, "100%", "100%", "9.0.0", "/js/Live/expressInstall.swf", flashvars, params, attributes);
        } catch (e) {
            console.error('直播推流异常：' + e);
        }
    }

    ///<summary>
    ///关闭 1 麦克风   2 摄像头
    ///</summary>
    this.closelive = function (str) {
        console.log('关闭麦克风或摄像头：' + str);
        var livestate = "";
        var messageStr1 = "cmd:";
        if (str == 1) {
            isvoice = 0;
			isvideo = 0;
            livestate = "1_0";
            messageStr1 += "colsemkf";
            $(".video-jiaohuan").show();
            if (roleId == 0) {
                teach_video = "1_1_0";
            } else {
                stu_video = "0_1_0";
            }
        } else if (str == 2) {
            isvoice = 0;
			            isvideo = 0;
            livestate = "2_0";
            messageStr1 += "colsesxt";
            if (roleId == 0) {
                teach_video = "1_2_0";
            } else {
                stu_video = "0_2_0";
            }
        }

        var data1 = JSON.stringify({
            dataType: 'MESSAGE',
            dataContent: messageStr1,
            username: flashvars.name,
            livetiem: zbtiem,
            usertype: flashvars.type,
            userid: flashvars.id
        });

        var objstr = {
            id: timestamp,
            type: "1",
            title: zbtiem,
            dis: livestate
        };
        eduCanvas.saveluzhi(objstr);
        liveVideo.saveliveconfig();

        //修改学员直播流的地址
        $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: flashvars.id, delmark: 0, r: Math.random() }, function (data_upd) {
            console.log(data_upd);
            Messaging.publish(CHATROOM_TOPIC, data1);
        });

    }

    ///<summary>
    ///启动  1 麦克风   2 摄像头
    ///</summary>
    this.startlive = function (str) {
        console.log('启动麦克风或摄像头：' + str);
        var livestate = "";
        var messageStr2 = "cmd:";
        if (str == 1) {
            isvideo = 1;
            livestate = "1_1";
            messageStr2 += "startmkf";
            if (roleId == 0) {
                teach_video = "1_1_1";
            } else {
                stu_video = "0_1_1";
            }
        } else if (str == 2) {
            isvoice = 1;
            livestate = "2_1";
            messageStr2 += "startsxt";
            if (roleId == 0) {
                teach_video = "1_2_1";
            } else {
                stu_video = "0_2_1";
            }
        }
        var data2 = JSON.stringify({
            dataType: 'MESSAGE',
            dataContent: messageStr2,
            username: flashvars.name,
            userid: flashvars.id,
            usertype: flashvars.type,
            livetiem: zbtiem
        });

        var objstr = {
            id: timestamp,
            type: "1",
            title: zbtiem,
            dis: livestate
        };
        eduCanvas.saveluzhi(objstr);

        liveVideo.saveliveconfig();
        /*
        //获取教师播放地址
        $.post("/Server/Manager.ashx", { param: "getpushurl", roomid: $("#talkId").val(), litype: 1 }, function (data_1) {
        if (data_1 != undefined && data_1 != null) {
        var liveinfo_1 = eval("(" + data_1 + ")");
        var upd_userid = "";
        if (liveinfo_1.mes != null && liveinfo_1.mes.length > 0) { upd_userid = liveinfo_1.mes[0].Userid; } else { upd_userid = userid; }
        if (upd_userid != userid) {
        //修改教师直播信息
        $.post("/Server/Manager.ashx", { param: "updpushurl2", roomid: $("#talkId").val(), uid: userid, delmark: 1, uname: flashvars.name, r: Math.random() }, function (data_upd) {
        console.log(data_upd);
        publish(CHATROOM_TOPIC, data2);
        //layer.alert(data_upd);
        });
        } else {
        //修改学员直播流的地址
        $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: upd_userid, delmark: 1, r: Math.random() }, function (data_upd) {
        console.log(data_upd);
        publish(CHATROOM_TOPIC, data2);
        //layer.alert(data_upd);
        });
        }
        }
        });*/
        if (flashvars.type == 0) {
            //修改教师直播信息
            $.post("/Server/Manager.ashx", { param: "updpushurl2", roomid: $("#talkId").val(), uid: flashvars.id, delmark: 1, uname: flashvars.name, r: Math.random() }, function (data_upd) {
                console.log(data_upd);
                Messaging.publish(CHATROOM_TOPIC, data2);
            });
        } else {
            $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: flashvars.id, delmark: 1, r: Math.random() }, function (data_upd) {
                console.log(data_upd);
                Messaging.publish(CHATROOM_TOPIC, data2);
                //layer.alert(data_upd);
            });
        }
        //        publish(CHATROOM_TOPIC, data2);
        //此处需要修改falsh，开始直播时候捕获当天的推流地址
    }

    ///<summary>
    ///视频直播警告
    ///</summary>
    this.runloglive = function (logtext) {
        console.log("视频直播警告：" + logtext);
    }

    //保存直播相关配置【禁言、视频、语音】
    this.saveliveconfig = function () {

        $.post("/Server/HttpRequest.ashx", { action: "getconfig", talkId: talkId, r: Math.random() }, function (data_config) {
            if (data_config != null && data_config != "" && data_config != "-1") {
                var abc = eval("(" + data_config + ")");
                /*istext = abc.istext;
                isvideo = abc.isvideo;
                isvoice = abc.isvoice;*/
                if (roleId == 0) {
                    stu_video = abc.stuvideo;
                } else {
                    teach_video = abc.teachvideo;
                }
                var config = JSON.stringify({ istext: istext, isvideo: isvideo, isvoice: isvoice, stuvideo: stu_video, teachvideo: teach_video }); // 关闭/开启 【禁言、视频、语音】  0关闭 1开启	      
				console.log(config);
                //提交画线记录
                $.post("/Server/HttpRequest.ashx", { action: "saveconfig", talkId: talkId, jsonstr: config }, function (data) {
                    sysResource.SetlocalStorage("liveconfig_" + talkId, config); //保存直播相关配置
                    console.log("保存直播相关配置1:" + data);
                });
            } else {
                var config = JSON.stringify({ istext: istext, isvideo: isvideo, isvoice: isvoice, stuvideo: stu_video, teachvideo: teach_video }); // 关闭/开启 【禁言、视频、语音】  0关闭 1开启	      
				console.log(config);
                //提交画线记录
                $.post("/Server/HttpRequest.ashx", { action: "saveconfig", talkId: talkId, jsonstr: config }, function (data) {
                    sysResource.SetlocalStorage("liveconfig_" + talkId, config); //保存直播相关配置
                    console.log("保存直播相关配置2:" + data);
                });
            }
        });
    }
}



///<summary>
///页面加载
///</summary>
var sysHtml = new function () {

    ///<summary>
    ///标签初始化Click事件
    ///</summary>
    this.initClick = function () {
        // 发送消息
        $('.btn-send-msg').click(function () {			 
			if($('.chatroom-input').attr('disabled')=="disabled"){			
			}else{
	            Messaging.sendMessage();
			}
        });

        //课程交流
        $("#ketang").click(function () {
            $("#zaixian").removeClass("a_home");
            $("#ketang").addClass("a_home");
            $("#talkContent").css("display", "block");
            $("#guanli").css("display", "none");
        })

        //在线人员
        $("#zaixian").click(function () {
            $("#ketang").removeClass("a_home");
            $("#zaixian").addClass("a_home");
            $("#talkContent").css("display", "none");
            $("#guanli").css("display", "block");
        });

        //        //下一页
        //        $(".ppt_next").click(function () {
        //            sysHtml.downpage();
        //        });
        //        $("#nextpag").click(function () {
        //            sysHtml.downpage();
        //        });



        //        //上一页
        //        $(".ppt_perv").click(function () {
        //            sysHtml.uppage();
        //        });
        //        $("#downpag").click(function () {
        //            sysHtml.uppage();
        //        });




    }

    this.uppage = function () {
        if (pagenum > 0) {
            pagenum--;
            fanye(pagenum);
        } else {
            layer.msg("没有上一页了！", { skin: 'demo-class' });
        }
    }
    this.downpage = function () {
        if (pagenum < pagecount - 1) {
            pagenum++;
            fanye(pagenum);
        } else {
            layer.msg("最后一页了！", { skin: 'demo-class' });
        }
    }

}

///<summary>
///加载教学记录
///</summary>
var liveRecord = new function () {

    //教学记录
    this.initload = function (zttiStr) {
        try {
            var zbtiem1 = zttiStr.split(",");
            if (zbtiem1[1] != null) {
				if (zbtiem == 0) {
					zbtiem = zbtiem1[1];
					start_live();
					sysConfig.zhibotime();
				 }
				 			  daojishi();
			 }else{
			  daojishi();
			 }
			 
			 //续接上次直播的时间

            var zttiJson = sysResource.GetlocalStorage(zbtiem1[0]);
            if (zttiJson != null) {
                var abc = eval(zttiJson);
                if (abc.length > 0) {
                    pagenum = abc[0].id.pagenum;
                    fxpathMax = abc[0].id.fxpathMax;
                    try {
                        fileNames = eval(abc[0].id.fileNames);
                        fxpathMax2 = "";
						pagecount=fileNames.length;
                    } catch (e) {
                        fileNames = abc[0].id.fileNames;
                        fxpathMax2 = fxpathMax + fileNames;
						pagecount=1;
                    }
                    var arrayztti_1 = zttiStr.split(',')[0].split('_');
                    pagenum = arrayztti_1[3];
                    fileguid = arrayztti_1[2];

                    liveRecord.loadCanvas(abc);
                    $(".countPages").html(pagecount);
                    $(".numPages").html(parseInt(pagenum) + 1);
                }
            } else {
                var arrayztti = zttiStr.split(',')[0].split('_');
                pagenum = arrayztti[3];
                fileguid = arrayztti[2];
                $.post("/Server/HttpRequest.ashx", { action: "getlive", fileguid: fileguid, talkId: talkId, pagenum: pagenum }, function (data) {
                    if (data != null && data != "" && data != "[]" && eval(data)[0] != undefined) {
                        $("#divfilelist").hide();
                        xy = new Array();
                        var abc = eval(data); //视频规矩还原
                        if (abc.length > 0) {
                            fxpathMax = abc[0].id.fxpathMax;
                            try {
                                fileNames = eval(abc[0].id.fileNames);
                                fxpathMax2 = "";
						pagecount=1;
                            } catch (e) {
                                fileNames = abc[0].id.fileNames;
                                fxpathMax2 = fxpathMax + fileNames;
														pagecount=1;
                            }
                            liveRecord.loadCanvas(abc);
                            sysResource.SetlocalStorage("zhibo_" + talkId + "_" + fileguid + "_" + pagenum, data); //保存画线记录                                          
                            $(".countPages").html(pagecount);
                            $(".numPages").html(parseInt(pagenum) + 1);
                        }
                    }
                });
            }
        } catch (e) {
            console.error("教学记录加载异常：" + e);
        }
    }



	this.loadImg = function (data) {

        $(".swiper-wrapper").html("");
        var html = "";
        filename = eval(data.filenames.replace('""', '"'));
        try {
            if (filename[0].length > 1) {
                for (var i = 0; i < filename.length; i++) {
                    if (i == data.pagenum) {
                        html += "<div class=\"swiper-slide swiper-slide-active\" style=\"width: 100%; height: 100%;\">" +
                                    "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                        "<img src=\"" + data.fxpathMax + filename[i] + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                    "</div><canvas id=\"Canvas_Tea\"></canvas>" +
                                "</div>";
                    } else {
                        html += "<div class=\"swiper-slide\" style=\"width: 100%; height: 100%;\">" +
                                    "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                        "<img src=\"" + data.fxpathMax + filename[i] + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                    "</div>" +
                                "</div>";
                    }
                }
                pagecount = filename.length;
            } else {
                html += "<div class=\"swiper-slide swiper-slide-active\" style=\"width: 100%; height: 100%;\">" +
                                    "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                        "<img src=\"" + data.fxpath + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                    "</div><canvas id=\"Canvas_Tea\"></canvas>" +
                                "</div>";
                pagecount = 1;
            }
        } catch (e) {
            html += "<div class=\"swiper-slide swiper-slide-active\" style=\"width: 100%; height: 100%;\">" +
                                    "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                        "<img src=\"" + data.fxpath + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                    "</div><canvas id=\"Canvas_Tea\"></canvas>" +
                                "</div>";
            pagecount = 1;
        }
        $(".swiper-wrapper").html(html);
		tea = document.getElementById("Canvas_Tea"); //画板
			ctx = document.getElementById("Canvas_Tea").getContext("2d");
            if (bodyWidth - 10 >= 1900) {
                tea.width = 1040;
                tea.height = 780;
                init = 1.3;
            } else {
                //                console.log("页面加载时 boardBox的宽" + $("#boardBox").width() + "高" + $("#boardBox").height());
                tea.width = 800;
                tea.height = 600;
                init = 1;
            }
    }

    //加载白板信息（线条、背景图片）
    this.loadCanvas = function (abc) {
        try {
            //-----------------------------更新---------------------------

            var htmlTemp = $(".swiper-wrapper").html(); // 页面初始化时 外层div的内容
            $(".swiper-wrapper").html(""); //清空div内容
            var html = "";
            try {
                fileNames = eval(abc[0].id.fileNames);
                for (var i = 0; i < abc[0].id.fileNames.length; i++) {//读取记录
                    if (i == 0) {
                        html += "<div class=\"swiper-slide\" style=\"width: 100%; height: 100%;\">" +
                                                               "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                                               "<img src=\"" + fxpathMax + fileNames[i] + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                                               "</div><canvas id=\"Canvas_Tea\"></canvas>" +
                                                               "</div>";
                    } else {
                        html += "<div class=\"swiper-slide\" style=\"width: 100%; height: 100%;\">" +
                                                                "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                                                "<img src=\"" + fxpathMax + fileNames[i] + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                                                "</div>" +
                                                                "</div>";
                    }

                }
                pagecount = abc[0].id.fileNames.length;
            } catch (e) {
                fileNames = abc[0].id.fileNames;
                fxpathMax2 = fxpathMax + fileNames;
                html += "<div class=\"swiper-slide\" style=\"width: 100%; height: 100%;\">" +
                                                               "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                                               "<img src=\"" + fxpathMax2 + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                                               "</div><canvas id=\"Canvas_Tea\"></canvas>" +
                                                               "</div>";
                pagecount = 1;
            }

            if (html == "") {//如果记录为空，把之前的内容还赋值给原来的div
                html = htmlTemp;
                $(".swiper-wrapper").html(html);
                Zs();
            } else {
                $(".swiper-wrapper").html(html);
            }
            tea = document.getElementById("Canvas_Tea"); //画板
			ctx = document.getElementById("Canvas_Tea").getContext("2d");
            if (bodyWidth - 10 >= 1900) {
                tea.width = 1040;
                tea.height = 780;
                init = 1.3;
            } else {
                //                console.log("页面加载时 boardBox的宽" + $("#boardBox").width() + "高" + $("#boardBox").height());
                tea.width = 800;
                tea.height = 600;
                init = 1;
            }
            //-------------------------------------------------------------

            //            if (abc[0].id.fxpathMax != null) {
            //                            console.log("图片路径", abc[0].id.fxpathMax);
            //                if (fxpathMax2.indexOf(".jpg") >= 0 || fxpathMax2.indexOf(".png") >= 0 || fxpathMax2.indexOf(".jpge") >= 0) {
            //                    pagecount = 1;
            //                    var imgpath = fxpathMax2;
            //                    $("#boardBox").css("backgroundImage", "url(" + imgpath + ")");
            //                    $("#boardBox").css("background-color", "#fff");
            //                    sysConfig.GetImgSize("boardBox", imgpath);
            //                } else {
            //                    pagecount = fileNames.length;
            //                    var imgpath = abc[0].id.fxpathMax + fileNames[abc[0].id.pagenum];
            //                    $("#boardBox").css("backgroundImage", "url(" + imgpath + ")");
            //                    $("#boardBox").css("background-color", "#fff");
            //                    sysConfig.GetImgSize("boardBox", imgpath);
            //                }
            //            }


            var option1 = new Array(); //画笔描点集合
            for (var ii = 0; ii < abc.length; ii++) {
                if (abc[ii].id != null) {
                    var jsoninfo = abc[ii].id.option;
                    if (jsoninfo != undefined && jsoninfo.length > 0) {
                        //console.log("测试-----",jsoninfo);
                        Array.prototype.push.apply(option1, eval(jsoninfo));
                    }
                }
            }
            if (option1.length > 0) {
                eduCanvas.drowDTX(option1, 0, init);
            } //开始还原描点记录
        } catch (e) {
            console.error("加载白板信息异常：" + e);
        }
    }

    //教学记录
    this.GetLiveRecord = function () {
        var RecordStr = sysResource.GetlocalStorage("zhibo_teach_" + talkId);
        $.post("/Server/HttpRequest.ashx", { action: "getredis", talkId2: "zhibo_jiaoxue_" + talkId, r: Math.random() }, function (data) {

            if (RecordStr != undefined && RecordStr != null && RecordStr != "" && RecordStr != "undefined" && (data == "" || RecordStr == data)) {
                RecordStr = RecordStr.replace("%2c", ",");
                var zttiStr_1 = RecordStr.split(",")[0];
                fileguid = zttiStr_1[0].split('_')[2];
                pagenum = zttiStr_1[0].split('_')[3];
                liveRecord.initload(RecordStr);
                if (flashvars.type == 1) { $("#livestate").val("直播中");  }
            } else {
                RecordStr = data; //获取教学记录
                if (data.length!=undefined &&data.length>0&& RecordStr != null && RecordStr != "") {
		            data = data.replace("%2c", ",");
                    RecordStr = RecordStr.replace("%2c", ",");
                    if (flashvars.type == 0) {
                        sysResource.SetlocalStorage("zhibo_teach_" + talkId, RecordStr);
                    }
                    var zttiStr_1 = RecordStr.split(",")[0];
                    fileguid = zttiStr_1.split('_')[2];
                    pagenum = zttiStr_1.split('_')[3];
                    liveRecord.initload(RecordStr);
                    if (flashvars.type == 1) { $("#livestate").val("直播中");  }
                  } else {
                    daojishi();
                }
            }
        });
    }
}

$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        var initdis = $("#Init").css("display");
        var maindis = $("#Main").css("display");
        if (initdis == "none" && maindis == "block") {            
                if (istext == 0) {
                    Messaging.sendMessage();
                }            
        }
        if (initdis == "block" && maindis == "none") { loginClick(); }
    }
});