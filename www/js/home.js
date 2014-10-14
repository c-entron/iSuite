//tested on javascriptlint.com on 19 Jul 2014

function time_out() {
    console.log('Time out at Server');
    $('#appSettings, #stopwatch').addClass('user_not_loggedin');
    window.localStorage.setItem('Ticket', '');
    window.localStorage.setItem('SERVICE_URL', '');
    window.localStorage.setItem('Username', '');
    window.localStorage.setItem('UserLoginDate', '');
    window.localStorage.setItem('UserLoginTime', '');

    window.localStorage.setItem('CurrentAppUserI3D', '');

    $('.user_btn a').html(_('User'));
    $('.date_btn a, .time_btn a').html('&nbsp;');
}

function getSelectedValue(id) {
    var value = $("#" + id).find("dt a span span").html();
    return value;
}

$.mobile.document.on("pageshow", "#home_page", function () {
    textAreaAttributes();                 
    var user_lang = window.localStorage.getItem('user_lang');
    if(!user_lang) {
        user_lang = 'en';
    }

    $('#language_select option').prop( 'selected', false );
    $('#language_select option[value="'+user_lang+'"]').prop( 'selected', true );
    $('#language_select').selectmenu( "refresh" );
    $('#language_select').change();
                     
    window.sessionStorage.setItem("HDCurrentPage", "1");
    var CustomerName = window.sessionStorage.getItem('CustomerName');

    $('#wheel_selected_customer_name').html(CustomerName);
    if(CustomerName){
      $('#span_selected_customer').show();
      $('#span_no_selected_customer').hide();
      $('#remove_selected_customer').show();
    }else{
      $('#span_selected_customer').hide();
      $('#span_no_selected_customer').show();
      $('#remove_selected_customer').hide();
    }
                     
    var customerI3D = window.sessionStorage.getItem('CustomerSelected');
    if(customerI3D) {
        $('#remove_selected_customer').addClass('active');
    }
    else {
        $('#remove_selected_customer').removeClass('active');
    }

    var ticket = window.localStorage.getItem('Ticket');

    if ( !ticket ) {
        $('#home_page .btnsContainer button').addClass('user_not_loggedin');
        $('.user_btn a').html(_('User'));
        $('.date_btn a').html('&nbsp;');
        $('.time_btn a').html('&nbsp;');
    }
    else {
        $('#home_page .btnsContainer button').removeClass('user_not_loggedin');
                     
        var user_name = window.localStorage.getItem('Username');
        $('.user_btn a').html(_('User')+'&nbsp;' + user_name);

        var date_string = window.localStorage.getItem('UserLoginDate');
        var time_string = window.localStorage.getItem('UserLoginTime');

        $('.date_btn a').html(date_string);
        $('.time_btn a').html(time_string);
    }
});
                      
$(document).on("pagecreate", '#home_page', function (event) {
    console.log('pagecreate on home_page');
    var offline_mode = window.localStorage.getItem('offline_mode');
    if('on' === offline_mode){
        $('div[data-role="page"]').addClass('offline-mode');
    } else {
        $('div[data-role="page"]').removeClass('offline-mode');
    }

    init_stopwatch();

    $( "#home_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#home_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    //i18n: internationalization
    $('#language_select').change(function () {

        var user_selected_lang = $(this).val();

        if (user_selected_lang) {
            String.locale = user_selected_lang;
            window.localStorage.setItem('user_lang', user_selected_lang);
        }

        translate();
        $('#email_to_editor, #email_to_customer, #inform_via_notify').checkboxradio("refresh");
                                 
        var user_name = window.localStorage.getItem('Username');
        if(user_name) {
            user_name = _('User') + '&nbsp;' + user_name;
        }
        else {
            user_name = _('User');
        }
        $('.user_btn a').html(user_name);
    });

    $('.ws_error_close, #back').click(function () {
        $('.ws_error_content').html('');
        $('.ws_error_message').hide();
    });

    $('#remove_selected_customer').click(function(){
        window.sessionStorage.removeItem('CustomerSelected');
        window.sessionStorage.removeItem('CustomerName');

        $('#wheel_selected_customer_name').html('');
        $('#span_selected_customer').hide();
        $('#span_no_selected_customer').show();
        $('#remove_selected_customer').hide();
        $(this).removeClass('active');
    });

    $('#home_page .upload_changes_no').click(function(){
        console.log('No! Do not upload changes!');
        resume_last_activity();
    });

    $('#home_page .upload_changes_yes').click(function(){
        console.log('Yes! Upload changes!');
        upload_pending_changes();
    });

    $("#home").click(function () {
        $.mobile.changePage('#login_page', {
            transition: 'flip',
            changeHash: false
        });
    });

    $("#appSettings").click(function () {

        if ( !window.localStorage.getItem("Ticket") ) {
            $( "#home_page .centron-alert" ).find('p').html(_('First login, please.')).end().popup('open');
            time_out();
            return;
        }

        $.mobile.changePage('#settings_page', {
            transition: 'flip',
            changeHash: false
        });
    });

    $("#stopwatch").click(function () {
        load_all_stopwatch();
    });

    $("#home_logout").click(function () {
        if ( !window.localStorage.getItem("Ticket") ) {
            $( "#home_page .centron-alert" ).find('p').html(_('First login, please.')).end().popup('open');
            time_out();
            return;
        }

        var login_ticket = window.localStorage.getItem('Ticket');
        service_request('Logout', { Ticket: login_ticket }).always(function(response){
            time_out();
        });
    });

    $('#home_page').on('click', '.green_arrow_button_area, #tap_receiver', function () {

        if (!window.localStorage.getItem("Ticket")) {

            $( '#home_page .centron-alert p').html(_('First login, please.'));
            $( '#home_page .centron-alert' ).popup('open');
            //console.log('green_arrow_button_area: '+$( "#home_page .centron-alert" ).find('p').length);
            time_out();
        }
        else {

            switch ($('#infobox').data('i18n')) {
                //labels are from homepagewheel.js
                case 'Helpdesk':
                    $.mobile.changePage('#helpdesk_page', {
                        transition: 'flip',
                        changeHash: false,
                        reloadPage: false
                    });
                    break;

                case 'Customer search':
                    $.mobile.changePage('#customer_page', {
                        transition: 'flip',
                        changeHash: false
                    });
                    break;

                case 'Serial Number':
                    if( window.localStorage.getItem('offline_mode') === 'off' ) {
                        $.mobile.changePage('#serial_number_page',{transition: 'flip', changeHash: false});
                    } else {
                       $( "#home_page .centron-alert" ).find('p').html(_('Offline not available!')).end().popup('open');
                    }
                    break;

                case 'Article Search':
                    if( window.localStorage.getItem('offline_mode') === 'off' ) {
                        $.mobile.changePage('#article_page',{transition: 'flip', changeHash: false});
                    } else {
                       $( "#home_page .centron-alert" ).find('p').html(_('Offline not available!')).end().popup('open');
                    }
                    break;

                case 'Favourites':
                    $.mobile.changePage('#favorites_page', {
                        transition: 'flip',
                        changeHash: false
                    });
                    break;

                case 'Hotline':
                    if(window.sessionStorage.getItem('CustomerSelected')) {
                        $.mobile.changePage('#hotline_page',{transition: 'flip', changeHash: false});
                        
                    }
                    else {
                        $( "#home_page .centron-alert" ).find('p').html(_('Select customer, please.')).end().popup('open');
                    }
                    break;

                case 'ToDo List':
                    if( window.localStorage.getItem('offline_mode') === 'off' ) {
                        $.mobile.changePage('#todo_list_page',{transition: 'flip', changeHash: false});
                    } else {
                       $( "#home_page .centron-alert" ).find('p').html(_('Offline not available!')).end().popup('open');
                    }
                    break;

                case 'C R M':
                    $.mobile.changePage('#crm_page',{transition: 'flip', changeHash: false});
                    break;

                default:
                    break;
            }
        }
    });
});

jQuery(document).ready(function ($) {

    //loading service urls and gps location
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('touchstart', function () {}, false);

    /* hide all dropdown on body element click*/
    $('body').on('click', function (e) {
        if ($(e.target).hasClass('ddelement') || $(e.target).hasClass('ui-menu-icon') || ($(e.target).attr('role') == 'menuitem')) {
            return true;
        }
        $('.ddlist').hide();
    });
});
