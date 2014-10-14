//tested on javascriptlint.com on 19 Jul 2014

function enable_offline_mode() {
    $('#offline_mode_slider').val('off');
    $('#offline_mode_slider').slider('refresh');

    window.localStorage.setItem('offline_mode', 'off');

    $(".loginbtn_h").click();
}

$.mobile.document.on( "pagecreate", "#login_page", function() {

    $('#login_page .enable_offline_no').click(function(){
        console.log('No! Do not enable offline Mode!');
    });

    $('#login_page .enable_offline_yes').click(function(){
        console.log('Yes! Enable offline Mode!');
        $('#popupEnableOfflineDialog').popup( "close" );
        enable_offline_mode();
    });

    $( "#login_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#login_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    $('#login_page').click(function(e){
        if('A' != e.target.tagName && 'SPAN' != e.target.tagName) {
            $("#ul_ws_dropdown").hide();
        }
    });

    $("#ws_dropdown dt a span").click(function () {
        $("#ul_ws_dropdown").toggle();
    });

    $("#ul_ws_dropdown").on('click', 'a', function () {

        var text = $(this).html();
        $("#ws_dropdown dt a span").html(text);
        $("#ws_dropdown dd ul").hide();

        $("#result").html(getSelectedValue("ws_dropdown"));

        var name = $("#result").text();
        get_stored_user_credentials(name);
        
        db.transaction(getServiceURl, errorCB);
    });

    $("#back, #close").click(function () {

        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });

    $("#username, #password").click(function () {
        var obj = $(this);

        if (obj.hasClass('invalid_input')) {
            obj.removeClass('invalid_input');
        }
    });

    $("#loginForm").on("keypress", "input[type=text], input[type=password]", function(e) {
        //Enter key
        if(e.which === 13) {
            $(this).blur();
            $(".loginbtn_h").click();
        }
    });

    $(".loginbtn_h").click(function (e) {
        //window.localStorage.setItem('offline_mode', $('#offline_mode_slider').val());

        if ($("#result").html() == 'Select Server') {
            $( "#login_page .centron-alert" ).find('p').html(_('Select Webservice, please!')).end().popup('open');
            return;
        }

        if (!($("#username").val().trim())) {
            $( "#login_page .centron-alert" ).find('p').html(_('Enter User Name, please.')).end().popup('open');
            return;
        }

        if (!($("#password").val().trim())) {
            $( "#login_page .centron-alert" ).find('p').html(_('Enter password, please.')).end().popup('open');
            return;
        }

        var userName = $("#username").val().trim();
        if(userName) {
            userName = strip_tags(userName);
        }
        var password = $("#password").val().trim();
        if(password) {
            password = strip_tags(password);
        }

        var SERVICE_URL = window.localStorage.getItem("SERVICE_URL");
        if (SERVICE_URL) {
            //connectionStatus = navigator.onLine ? 'online' : 'offline';

            var offline_mode = $('#offline_mode_slider').val();

            if (!navigator.onLine && offline_mode === 'off') {
                $( "#login_page .centron-alert" ).find('p').html(_('No Network found!')).end().popup('open');
                return;
            }

            var application_id = window.localStorage.getItem('application_id');
            
            var login_param = {
                Data:{
                    Application: application_id,
                    AppVersion: $('#build_version').html(),
                    Password: password,
                    Username: userName
                }
            };
            //console.log('Login: ' + JSON.stringify(login_param));
            window.localStorage.setItem('offline_mode', $('#offline_mode_slider').val());

            service_request('Login', login_param).done(function (response) {

                if (response.Status === 0 && response.Result && response.Result[0]) {

                    window.localStorage.setItem('Ticket', response.Result[0]);

                    $('#appSettings, #stopwatch').removeClass('user_not_loggedin');
               
                    var serverName = $("#result").text();
                    if(serverName) {
                        serverName = strip_tags(serverName);
                    }
                    var userName = $("#username").val().trim();
                    if(userName) {
                        userName = strip_tags(userName);
                    }
                    window.localStorage.setItem('Username', userName);

                    var password = $("#password").val().trim();
                    if(password) {
                        password = strip_tags(password);
                    }
                    if(serverName && userName && password) {
                        var credentials = {
                            userName: userName,
                            password: password
                        };
                        if ('on' == $('#save_password_slider').val()) {
                            saveUserCredentials(credentials);
                        } else if ('off' == $('#save_password_slider').val()) {
                            removeUserCredentials(credentials);
                        }
                    }

                    window.localStorage.setItem('save_password', $('#save_password_slider').val());
                    
                    var offline_mode = $('#offline_mode_slider').val();
                    window.localStorage.setItem('offline_mode', offline_mode);
                    if('on' === offline_mode){
                        $('body, div[data-role="page"]').addClass('offline-mode');
                    } else {
                        $('body, div[data-role="page"]').removeClass('offline-mode');
                    }

                    var now = moment();
                    var dateString = now.format('DD/MM/YYYY');
                    var timeString = now.format('HH:mm');

                    $('.date_btn a').html(dateString);
                    $('.time_btn a').html(timeString);

                    window.localStorage.setItem('UserLoginDate', dateString);
                    window.localStorage.setItem('UserLoginTime', timeString);
               
                    console.log('Removing Customer Selection...');
                    window.sessionStorage.removeItem('CustomerSelected');
                    window.sessionStorage.removeItem('CustomerI3D');
                    window.sessionStorage.removeItem('CustomerName');

                    var login_ticket = window.localStorage.getItem('Ticket');
                    if(login_ticket) {
                        var user_param = { Ticket: login_ticket };
                        service_request('GetCurrentAppUser', user_param).done(function(response){
                                                 
                            if(0 === response.Status && response.Result && response.Result[0]) {

                                var result = response.Result[0];
                                if(result && result.I3D) {
                                    var employee_i3d = result.I3D;
                                    window.localStorage.setItem("CurrentAppUserI3D", employee_i3d);
                                                     
                                    var userName = window.localStorage.getItem('Username');
                                    var service_url = window.localStorage.getItem('SERVICE_URL');
                                    //console.log('**************************');
                                    console.log('employee_i3d: ' + employee_i3d + ' userName: ' + userName + ' service_url: ' + service_url);
                                    if(userName && service_url) {
                                        db.transaction(function(tx){
                                            tx.executeSql('UPDATE user_credentials SET EmployeeI3D=? WHERE user_name=? AND service_url=?', [employee_i3d, userName, service_url]);
                                        });
                                    }
                                    var display_text = '';
                                    var first_name, last_name, short_sign;

                                    last_name = result.LastName;
                                    if(!last_name) {
                                        last_name = '';
                                    }
                                    display_text = last_name;
                                    window.localStorage.setItem("CurrentAppUserLastName", last_name);

                                    first_name = result.FirstName;
                                    if(!first_name) {
                                        first_name = '';
                                    }
                                    display_text += ', ' + first_name;
                                    window.localStorage.setItem("CurrentAppUserFirstName", first_name);

                                    short_sign = result.ShortSign;
                                    if(!short_sign) {
                                        short_sign = '';
                                    }
                                    display_text += ' (' + short_sign + ')';
                                    window.localStorage.setItem("CurrentAppUserDisplayText", display_text);

                                    $.mobile.changePage('#home_page', {
                                        transition: "flip",
                                        changeHash: false
                                    });

                                    $('.overlay_when_uploading').show();
                                                                              
                                    load_static_parameters().done(function(){
                                        $('.overlay_when_uploading').hide();
                                    }).always(function(){
                                        if('off' === window.localStorage.getItem('offline_mode')) {
                                            check_pending_upload();
                                        }
                                    });
                                }
                            }
                        }).fail(function(error_msg){
                            console.log(error_msg);
                            $('#popupEnableOfflineDialog').popup( "open" );
                        });
                    }
                }
                else if (response.Status === 2) {

                    $('#username').addClass('invalid_input');
                    $('#password').addClass('invalid_input');

                    $('#popupEnableOfflineDialog').popup( "open" );
                }
            });
        }
    });

    $("#edit").click(function () {

        var check = window.localStorage.getItem("hasDataInTable");

        if (check == "true") {
            db.transaction(get_web_service_entries, errorCB);
            $('.optionBox').hide();
            $('#shadow').hide();
        }
        else {
            $('.optionBox').show();
            $('#shadow').show();
        }

        $.mobile.changePage('#webservice_page', {
            transition: "flip",
            changeHash: false
        });
    });
    /*
    $( "#offline_mode_slider" ).on( "slidestop", function( event, ui ) {
        if('on' === $(this).val()){
            $('div[data-role="page"]').addClass('offline-mode');
        } else {
            $('div[data-role="page"]').removeClass('offline-mode');
        }
    });
    */
    $('#username').focusout(function(){
        var username = $(this).val();
        console.log('User: ' + username);
        find_password_from_username(username);
    });
});

$.mobile.document.on( "pagebeforeshow", "#login_page", function() {
    loadServerData();
    textAreaAttributes();

    $('#popupEnableOfflineDialog').on('popupbeforeposition', function( event, ui ) {
        console.log('beforeposition on popup');
        $('#popupEnableOfflineDialog h1').html(_('There are no off-line data available!'));
        $('#popupEnableOfflineDialog h3').html(_('Enable online Mode?'));
        $('#popupEnableOfflineDialog .enable_offline_no .ui-btn-text').html(_('No'));
        $('#popupEnableOfflineDialog .enable_offline_yes .ui-btn-text').html(_('Yes'));
    });

    $('.save_password .ui-slider-label-a').text(_('Off'));
    $('.save_password .ui-slider-label-b').text(_('On'));
    $('#save_password_slider').slider("refresh");

    $('.offline_mode .ui-slider-label-a').text(_('Off'));
    $('.offline_mode .ui-slider-label-b').text(_('On'));
    $('#offline_mode_slider').slider("refresh");

    var save_password = window.localStorage.getItem('save_password');

    if(save_password) {
        $('#save_password_slider').val(save_password);
        $('#save_password_slider').slider('refresh');
    }

    var offline_mode = window.localStorage.getItem('offline_mode');

    if(!offline_mode) {
        offline_mode = 'off';
    }
    $('#offline_mode_slider').val(offline_mode);
    $('#offline_mode_slider').slider('refresh');

    $('#username').attr('placeholder', _('User'));
    $('#password').attr('placeholder', _('Password'));

    var select_server_text = 'Select Server';
    $("#login_page .dropdown dt a span").html(_(select_server_text));
    $("#result").html(select_server_text);
    $("#ul_ws_dropdown").hide();
});

$.mobile.document.on( "pageshow", "#login_page", function() {
    $('#username, #password').removeClass('invalid_input').val('');
});
