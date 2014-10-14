//tested on javascriptlint.com on 24 Jul 2014
var default_article_i3d = '';

function restore_helpdesk_timer_snapshot() {
    console.log('Recovering Helpdesk_Timer State...');
    var details = window.sessionStorage.getItem('AppSnapshot');
    window.sessionStorage.removeItem('AppSnapshot');
    if(details) {
        var param = JSON.parse(details);

        var state_data = param.Data;
        if(Object.keys(state_data).length) {
            var calculable = state_data.Timer.Calculable;
            if(calculable) {
                $('#HDTimer_popup #calculable').val('on');
            }
            else {
                $('#HDTimer_popup #calculable').val('off');
            }
            $('#calculable').slider( "refresh" );

            var planned = state_data.Timer.IsPlanned;
            if(planned) {
                $('#HDTimer_popup #planned').val('on');
            }
            else {
                $('#HDTimer_popup #planned').val('off');
            }
            $('#planned').slider( "refresh" );

            var article_i3d = state_data.Timer.ArticleI3D;
            $( '#HDTimer_emp_article').val(article_i3d).change();

            $('#HDTimer_description').val(state_data.Timer.ExternalNote);

            var signature = state_data.HasSigned;
            
            if (signature) {
                $('#HDTimer_signature').hide();
                $('#signature_exists').show();
                //Make a button aside to clear signature – only new mode!!
                $('#HDTimer_signature .clearSignature').closest('.ui-btn').hide();
            }
            else {
                $('#HDTimer_signature').show();
                $('#signature_exists').hide();
                //Make a button aside to clear signature – only new mode!!
                $('#HDTimer_signature .clearSignature').closest('.ui-btn').show();
            }

            var type_i3d = state_data.Timer.Type.I3D;
            $( '#HDTimer_type' ).val(type_i3d).change();

            var start_timestamp = moment( state_data.Timer.Start );
            start_timestamp = start_timestamp.valueOf();
            $('#date_start').mobiscroll('setDate', new Date(start_timestamp), true, 1000);

            var stop_timestamp = moment( state_data.Timer.Stop );
            stop_timestamp = stop_timestamp.valueOf();
            $('#date_end').mobiscroll('setDate', new Date(stop_timestamp), true, 1000);

           var duration = state_data.Timer.Timer / 60; //in minutes
           var duration_hh = parseInt(duration / 60, 10);
           var duration_mm = duration - duration_hh * 60;
            if (duration_hh < 10) {duration_hh = '0' + duration_hh;}
            if (duration_mm < 10) {duration_mm = '0' + duration_mm;}
           $('#HDTimer_popup #duration_hour').val(duration_hh);
           $('#HDTimer_popup #duration_minute').val(duration_mm);

            var timer_lunchtime = state_data.Timer.LunchTime / 60; //in minutes
            var lunch_hh = parseInt(timer_lunchtime / 60, 10);
            var lunch_mm = timer_lunchtime - lunch_hh * 60;
            if (lunch_hh < 10) {lunch_hh = '0' + lunch_hh;}
            if (lunch_mm < 10) {lunch_mm = '0' + lunch_mm;}
            $('#HDTimer_popup #break_hour').val(lunch_hh);
            $('#HDTimer_popup #break_minute').val(lunch_mm);
        }
    }
}

function update_timers_list(response) {
    if(response.Result && response.Result.length) {
        console.log('No of responses: ' + response.Result.length);

        var helpdesk_ticket = $('#helpdesk_page .helpdesk_ticket.user_selected');
        if (helpdesk_ticket.length) {
            var helpdeskI3D = helpdesk_ticket.find('.helpdeskI3D').html();
            helpdeskI3D = parseInt(helpdeskI3D, 10);
            console.log('helpdeskI3D: ' + helpdeskI3D);

            var ShortDescription = helpdesk_ticket.find('.short_description_text').html();

            var helpdeskNumber = helpdesk_ticket.find('.hd_number').html();
            helpdeskNumber = parseInt(helpdeskNumber, 10);
        }

        var content = '';
        $.each(response.Result, function (index, result) {
            if(result && result.I3D) {
                var employee = result.Employee;
                var type = result.Type;

                var stopDate = result.Stop;
                var stop_date = '', stop_time = '';
                if(stopDate){

                    stop_date = moment( stopDate );
                    var stopTimestamp = stop_date.valueOf();

                    var stop_dd = stop_date.date();
                    if (stop_dd < 10) {
                        stop_dd = '0' + stop_dd;
                    }

                    var stop_mm = stop_date.month() + 1;
                    if (stop_mm < 10) {
                        stop_mm = '0' + stop_mm;
                    }

                    var stop_yy = stop_date.year();

                    var stop_time_hh = stop_date.hour();
                    if (stop_time_hh < 10) {
                        stop_time_hh = '0' + stop_time_hh;
                    }

                    var stop_time_mm = stop_date.minute();
                    if (stop_time_mm < 10) {
                        stop_time_mm = '0' + stop_time_mm;
                    }

                    stop_time = stop_time_hh + ':' + stop_time_mm;
                }

                var startDate = result.Start;
                var start_date = '', start_time = '';
                if(startDate){
                   
                    start_date = moment( startDate );
                    var startTimestamp = start_date.valueOf();

                    var start_dd = start_date.date();
                    if (start_dd < 10) {
                        start_dd = '0' + start_dd;
                    }

                    var start_mm = start_date.month() + 1;
                    if (start_mm < 10) {
                        start_mm = '0' + start_mm;
                    }

                    var start_yy = start_date.year();

                    var start_time_hh = start_date.hour();
                    if (start_time_hh < 10) {
                        start_time_hh = '0' + start_time_hh;
                    }

                    var start_time_mm = start_date.minute();
                    if (start_time_mm < 10) {
                        start_time_mm = '0' + start_time_mm;
                    }
                    start_date = start_dd + '/' + start_mm + '/' + start_yy;
                    start_time = start_time_hh + ':' + start_time_mm;
                }
                   
                var duration_hh = '', duration_mm = '';
                if(result.Timer) {

                    var duration = result.Timer / 60; //in minutes
                    duration_hh = parseInt(duration / 60, 10);
                    duration_mm = duration - duration_hh * 60;

                    if (duration_hh < 10) {duration_hh = '0' + duration_hh;}
                    if (duration_mm < 10) {duration_mm = '0' + duration_mm;}
                }

                content += '<div class="info_container" data-i3d="' + result.I3D + '" data-time_fixed="false"><div class="col1"><div class="padder">';

                content += '<div class="timer">' + duration_hh + ':' + duration_mm + '</div>';
                content += '<div class="date">' + start_date + '</div>';

                var calculable = '';
                if (result.Calculable) {
                    calculable = _('Calculable');
                }
                else {
                    calculable = 'Not Calculable';
                }
                content += '<div class="calculable">' + calculable + '</div>';
                   
                var planned = '';
                if (result.IsPlanned) {
                    planned = _('Planned');
                }
                else {
                    //Error Reporting - Deployment 2014-02-18.docx
                    //-	Only show in the summery if time is PLANNED, don’t show ‘not planned’
                    planned = '';
                }

                content += '<div class="planned">' + planned + '</div>';

                content += '</div></div><div class="col2">';

                var ExternalNote;
                if(result.ExternalNote) {
                    ExternalNote = result.ExternalNote;
                }
                else {
                    ExternalNote = '';
                }

                content += '<div class="padder">' + ExternalNote + '</div>';
                content += '</div><div class="cb"></div>';

                content += '<div class="ticket_timers_details">';
                content += '<h2 class="headline_text">' + ShortDescription + ' | ' + helpdeskNumber + ' | Time details</h2>';
                   
                content += '<div class="close_ticket_details icon-cancel" ></div>';

                content += '<h2 class="bold_text">'+_('Note')+'</h2>';
                if (result.ExternalNote) {
                    content += '<p class="timer_description bold_text">' + ExternalNote + '</p>';
                }

                content += '<h2 class="bold_text">'+_('Internal Note')+'</h2>';
                if (result.InternalNote) {
                    content += '<p class="timer_internal_note">' + result.InternalNote + '</p>';
                }

                content += '<div class="normal_text">';
                content += '<div class="timer_details_col_1">';
                   
                var type_id = 0, type_name = '';
                if(type) {
                    type_id = type.I3D;
                    if(!type_id) {
                        type_id = 0;
                    }
                    type_name = type.Name;
                    if(!type_name) {
                        type_name = '';
                    }
                }
                content += '<div class="timer_details_field timer_type" data-type_i3d="' + type_id + '">';
                content += '<div class="field_label">'+_('Type')+'</div>';
                content += '<div class="field_value">' + type_name + '</div></div>';

                content += '<div class="timer_details_field timer_datum" data-datum="' + startTimestamp + '">';
                content += '<div class="field_label">'+_('Date')+'</div>';
                content += '<div class="field_value">' + start_date + '</div></div>';

                content += '<div class="timer_details_field timer_calculable" data-calculable="' + result.Calculable + '">';
                content += '<div class="field_label">'+_('Calculable')+'</div>';
                content += '<div class="field_value">' + calculable + '</div></div>';

                content += '<div class="timer_details_field timer_planned" data-planned="' + result.IsPlanned + '">';
                content += '<div class="field_label">'+_('Schedule')+'</div>';
                content += '<div class="field_value">' + planned + '</div></div>';

                content += '<div class="timer_details_field timer_emp_article" data-emp_article="' + result.ArticleI3D + '">';
                content += '<div class="field_label">'+_('Employee Article')+'</div>';
                content += '<div class="field_value"></div></div>';

                content += '<div class="timer_details_field timer_signature">';
                content += '<div class="field_label">'+_('Signature')+'</div>';
                content += '<div class="field_value"></div></div>';

                if(employee && employee.I3D && employee.FirstName && employee.LastName) {
                    content += '<div class="timer_details_field timer_editor" data-editor_i3d="' + employee.I3D + '">';
                    content += '<div class="field_label">'+_('Editor')+'</div>';
                    content += '<div class="field_value">' + employee.LastName + ', ' + employee.FirstName + '</div></div>';
                }

                content += '</div><!--.timer_details_col_1-->';
                content += '<div class="timer_details_col_2">';

                duration = duration_hh + ':' + duration_mm;
                content += '<div class="timer_details_field timer_duration" data-duration_hh="' + duration_hh + '" data-duration_mm="' + duration_mm + '">';
                content += '<div class="field_label">'+_('Duration')+'</div>';
                content += '<div class="field_value">' + duration + '</div></div>';

                content += '<div class="timer_details_field timer_start" data-start_timestamp="'+startTimestamp+'" data-start_dd="' + start_dd + '" data-start_mm="' + start_mm + '" data-start_yy="' + start_yy + '" data-start_time_hh="' + start_time_hh + '" data-start_time_mm="' + start_time_mm + '">';
                content += '<div class="field_label">'+_('Start')+'</div>';
                content += '<div class="field_value">' + start_time + '</div></div>';

                content += '<div class="timer_details_field timer_stop" data-stop_timestamp="'+stopTimestamp+'" data-stop_dd="' + stop_dd + '" data-stop_mm="' + stop_mm + '" data-stop_yy="' + stop_yy + '" data-stop_time_hh="' + stop_time_hh + '" data-stop_time_mm="' + stop_time_mm + '">';
                content += '<div class="field_label">'+_('Stop')+'</div>';
                content += '<div class="field_value">' + stop_time + '</div></div>';

                var lunchTime, lunch_hh, lunch_mm;
                if(result.LunchTime) {
                    lunchTime = result.LunchTime / 60; //in minutes
                    lunch_hh = parseInt(lunchTime / 60, 10);
                    lunch_mm = lunchTime - lunch_hh * 60;

                    if (lunch_hh < 10) {lunch_hh = '0' + lunch_hh;}
                    if (lunch_mm < 10) {lunch_mm = '0' + lunch_mm;}

                    lunchTime = lunch_hh + ':' + lunch_mm;
                }
                else {
                    lunchTime = '00:00';
                    lunch_hh = lunch_mm = 0;
                }
                content += '<div class="timer_details_field timer_lunchtime" data-lunch_hh="' + lunch_hh + '" data-lunch_mm="' + lunch_mm + '">';
                content += '<div class="field_label">'+_('Break')+'</div>';
                content += '<div class="field_value">' + lunchTime + '</div></div>';

                content += '</div><!--.timer_details_col_2-->';
                content += '</div><!--.normal_text-->';
                content += '</div><!--.ticket_timers_details-->';
                content += '</div><!--.info_container-->';
            }
        });

        $('#helpdesk_timers_page .info_container').remove();
        $('#helpdesk_timer_container').html(content);
    }
}

//create a HD timers page
function create_HD_timers_page() {

    //prepare Helpdesk ticket details
    var helpdesk_ticket = $('#helpdesk_page .helpdesk_ticket.user_selected');
    if (helpdesk_ticket.length) {
        var helpdeskI3D = helpdesk_ticket.find('.helpdeskI3D').html();
        helpdeskI3D = parseInt(helpdeskI3D, 10);
        console.log('helpdeskI3D: ' + helpdeskI3D);

        var ShortDescription = helpdesk_ticket.find('.short_description_text').html();

        var helpdeskNumber = helpdesk_ticket.find('.hd_number').html();
        helpdeskNumber = parseInt(helpdeskNumber, 10);

        var helpdeskContactTitle = helpdesk_ticket.find('.helpdeskContactTitle').html();
        helpdeskContactTitle = helpdeskContactTitle ? helpdeskContactTitle : '';

        var helpdeskContactName = helpdesk_ticket.find('.helpdeskContactName').html();
        helpdeskContactName = (helpdeskContactName && helpdeskContactName != 'null') ? helpdeskContactName : '';

        var helpdeskCustomer = helpdesk_ticket.find('.customer').html();

        $('#helpdesk_timers_page .contact_container .content').html(ShortDescription + ' | ' + helpdeskNumber + '<br>' + helpdeskContactTitle + '&nbsp;' + helpdeskContactName);

        $('#helpdesk_timers_page .title_container').html(helpdeskCustomer);

        var ticketid = helpdesk_ticket.data('ticketid');
        ticketid = parseInt(ticketid, 10);
        var ticket_details = '<div class="ticket_details">' + $('#helpdesk_page .ticket_details[data-ticketid="' + ticketid + '"]').html() + '</div>';
        $('#helpdesk_timers_page #main_wrapper2').append(ticket_details);

        var login_ticket = window.localStorage.getItem('Ticket');
        var timer_param = {
            Ticket: login_ticket,
            Data: ticketid
        };
        service_request('GetActiveHelpdeskTimersFromHelpdesk', timer_param).done(function (response) {

            if (0 === response.Status) {
                $('#helpdesk_timers_page').data('helpdesk_i3d', helpdeskI3D);

                if(response.Result && response.Result.length) {
                    update_timers_list(response);
                }
            }
        });
    }
    else {
        $( "#helpdesk_timers_page .centron-alert-info" ).find('p').html(_('Select timer, please.')).end().popup('open');
    }
}

$.mobile.document.on('pagecreate', '#helpdesk_timers_page', function (event) {
    console.log('helpdesk_timers_page: pagecreate');
    $( "#helpdesk_timers_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#helpdesk_timers_page .centron-alert" ).popup( 'close' );
            }, 3000);
        }
    });

    var lang = window.localStorage.getItem('user_lang');
    if(!lang) {
        lang = 'en';
    }
    $('#HDTimer_emp_article').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });
    $('#HDTimer_emp_article_dummy').click(function () {
        $('#HDTimer_emp_article').mobiscroll('show');
        return false;
    });
    $('#HDTimer_type').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });
    $('#HDTimer_type_dummy').click(function () {
        $('#HDTimer_type').mobiscroll('show');
        return false;
    });

    $('#toHelpdesk').click(function () {
        console.log('back to Helpdesk');

        $('#helpdesk_timers_page .info_container, #helpdesk_timers_page .ticket_details').remove();
        $('#helpdesk_timer_summary').removeClass('down').addClass('left');
        $.mobile.changePage('#helpdesk_page', {
            transition: "flip",
            changeHash: false
        });
    });

    $('#helpdesk_timers_page').addClass('page_with_popup');

    var user_lang = window.localStorage.getItem('user_lang');
    if(!user_lang) {
        user_lang = 'en';
    }
    $("#date_start, #date_end").mobiscroll().datetime({
        animate: 'fade',
        preset: 'datetime',
        theme: 'android-ics light',
        mode: 'scroller',
        display: 'modal',
        lang: user_lang,
        dateFormat: 'dd.mm.yy',
        dateOrder: 'ddmmy',
        timeFormat: 'HH:ii'
    });

    $('#helpdesk_timers_page').on('click', '.ticket_timers_details .close_ticket_details', function(){
        console.log('Timer page: close timer details ');
        $('.ticket_timers_details').hide();
        return false;
    });

    $('#timer_submit').on('click', function(e){
        e.preventDefault();
        var customer_email = $('#timer_send_to').val().trim();
        if(customer_email) {
            customer_email = strip_tags( customer_email );
        }
        var emails_cc = $('#timer_copy').val().trim();
        if(emails_cc) {
            emails_cc = strip_tags( emails_cc );
        }
        var HelpdeskTimerI3D = $('#timer_ids').val();
        var ids_array = JSON.parse("[" + HelpdeskTimerI3D + "]");
                          
        if(!validateEmail(customer_email)){
            $( "#helpdesk_timers_page .centron-alert-error" ).find('p').html(_('Invalid EMail!')).end().popup('open');
            return;
        }

        var data = {
            "EmailsTO": customer_email,
            "HelpdeskTimerIDs": ids_array
        };

        if(emails_cc) {
            if(validateEmail(emails_cc)) {
                data.EmailsCC = emails_cc;
            }
            else {
                $( "#helpdesk_timers_page .centron-alert-error" ).find('p').html(_('Invalid EMail!')).end().popup('open');
                return;
            }
        }

        var login_ticket = window.localStorage.getItem('Ticket');
        var timer_report_param = {
            Ticket: login_ticket,
            Data: data
        };
        service_request('SendHelpdeskTimerSignatureReportToCustomerV2', timer_report_param).done(function (response) {
            if (0 === response.Status) {
                var customer_email = $('#timer_send_to').val('');
                var emails_cc = $('#timer_copy').val('');
                var HelpdeskTimerI3D = $('#timer_ids').val('');
                $('#send_report_container, #send_report_popup_overlay').removeClass('send_report_show');

                $('.tick_to_send_report').remove();

                $( "#helpdesk_timers_page .centron-alert-success" ).find('p').html(_('Report sent.')).end().popup('open');
            }
        });
    });

    $('.send_report_close').click(function(e){
        if(this == e.target){
            console.log('Closing send report');
            $('#send_report_container, #send_report_popup_overlay').removeClass('send_report_show');

            $('.tick_to_send_report').remove();
        }
    });

    $('#helpdesk_timers_page').on('click', '.ticket_timers_details', function () {
        return false;
    });
    $('#helpdesk_timers_page').on('click', '.info_container', function () {
        var ticket = $(this);
        console.log('Timer details request');
        $('#helpdesk_timers_page .action_button_container .button').addClass('disabled');
        //hide ticket details if visible
        $('#helpdesk_timers_page .ticket_details').hide();

        $('#helpdesk_timers_page .info_container').removeClass('user_selected');

        var TimerI3D = ticket.data('i3d');
        console.log('TimerI3D: ' + TimerI3D);
        var signatureReadyDeferred = $.Deferred();
        var articleReadyDeferred = $.Deferred();


        var login_ticket = window.localStorage.getItem('Ticket');
        var sig_param = {
            Ticket: login_ticket,
            Data: TimerI3D
        };
        service_request('GetSignatureFromHelpdeskTimer', sig_param).done(function (response) {

            signatureReadyDeferred.resolve();
            console.log('***************** : ' + response.Status);
            if (0 === response.Status) {
                ticket.find('.timer_signature').data('has_signature', 'true').find('.field_value').html('Signed');
            } else {
                ticket.find('.timer_signature').data('has_signature', 'false').find('.field_value').html('Not Signed');
            }
        });


        var emp_article = ticket.find('.timer_emp_article');
        var article_i3d = emp_article.data('emp_article');
        article_i3d = parseInt(article_i3d, 10);
        service_request('GetEmployeeArticlesFromTicket', {Ticket: login_ticket}).done(function(response){

            if (0 === response.Status) {
                articleReadyDeferred.resolve();
                if (response.Result.length) {
                    $.each(response.Result, function (index, result) {
                        if(result && result.ArticleI3D && result.ArticleCode && result.ArticleDescription) {
                            if(article_i3d === result.ArticleI3D) {
                                emp_article.find('.field_value').html(result.ArticleCode + '<br>' + result.ArticleDescription);
                            } else {
                                console.log('article_i3d: '+article_i3d+' result.ArticleI3D: '+result.ArticleI3D);
                            }
                        }
                    });
                }
            }
        });

        $.when(signatureReadyDeferred, articleReadyDeferred).then(function(){
            ticket.addClass('user_selected').find('.ticket_timers_details').show();
            $('#helpdesk_timers_page .action_button_container .button').removeClass('disabled');
            if( window.localStorage.getItem('offline_mode') === 'on' ) {
                $('#helpdesk_timers_page .send_report').addClass('disabled');
            }
        });
    });

    $('#helpdesk_timer_summary.arrow').on('click', function (event) {

        console.log('click on helpdesk_timer_summary');
        if ($(this).hasClass('left')) {
            console.log('removing left adding down');
            $(this).removeClass('left').addClass('down');

            $('.ticket_details').css({
                display: 'block',
                padding: '1% 2%'
            });
        } else {
            console.log('removing down adding left');
            $(this).removeClass('down').addClass('left');
            $('.ticket_details').css({
                display: 'none'
            });
        }
    });
               
    //hide details on click on blank space
    $('#helpdesk_timer_container').click(function (e) {
        if (e.target == this) {
            $('#helpdesk_timers_page .info_container').removeClass('user_selected');
            $('.tick_to_send_report').remove();
        }
    });

    $('#helpdesk_timers_page .add_timer').click(function () {
        console.log('add_timer: '+ $(this).attr("class"));
        if(!$(this).hasClass('disabled')) {

            $('#helpdesk_timers_page.stopwatch-available .open-stopwatch-bar, #helpdesk_timers_page.stopwatch-available .open-stopwatch').show();

            $('.ticket_details').hide();

            $('#HDTimer_signature').show();
            $('#signature_exists').hide();

            //Make a button aside to clear signature – only new mode!!
            $('#HDTimer_signature .clearSignature').closest('.ui-btn').show();
            //New mode, there will be no content in internal note
            $('#internal_note_switch').removeClass('blue_pin');
            $('#HDTimer_popup .internal_note_container').hide();

            //clearing the new time entry form
            var api = $('.sigPad').signaturePad();
            api.clearCanvas();
            //saving initial canvas data to be compared later to determine if user signed or not
            var sig = api.getSignatureImage();
            $('#timer_signature_canvas').data('init_data_url', sig);

            init_start_stop_time();
                                                
            $('#HDTimer_emp_article').mobiscroll('init');
            var lang = window.localStorage.getItem('user_lang');
            if(!lang) {
                lang = 'en';
            }
            $('#HDTimer_emp_article').mobiscroll('option', { lang: lang });
            if(default_article_i3d) {
                console.log('Default Article found!');
                $('#HDTimer_emp_article').val(default_article_i3d).change();
            }
            $('#HDTimer_type').val('').change();

            $('#HDTimer_description').val('');
            $('#internal_note').val('');

            $('#calculable option[value="on"]').prop('selected', true);
            $('#calculable').slider('refresh');
            $('#planned option[value="off"]').prop('selected', true);
            $('#planned').slider('refresh');

            $('#HDTimer_popup_overlay, #HDTimer_popup').show();

            $('#helpdesk_timers_page .ticket_timers_details').hide();

            window.sessionStorage.setItem('new_timer_mode', true);
        }
    });
               
    $('#helpdesk_timers_page .send_report').click(function (e) {
        if(!$(this).hasClass('disabled')) {
            console.log('Requesting helpdesk_timers_page send report...');
                                                      
            if(!$(this).hasClass('disabled')) {
                console.log('Timer details: '+$('#helpdesk_timers_page .ticket_timers_details').length);
                $('#helpdesk_timers_page .ticket_timers_details').hide();

                var total_ticks = $('.tick_to_send_report').length;
                var selected_ticks = $('.tick_to_send_report.icon-ok').length;

                console.log('Searching Timers to Report...' + total_ticks);
                if (0 === total_ticks) {
                    $('#helpdesk_timers_page .info_container .col2').append('<div class="tick_to_send_report"></div>');
                } else {
                    if (0 === selected_ticks) {
                        console.log('Searching notification container: ' + $( "#helpdesk_timers_page .centron-alert-info" ).length);
                        $( "#helpdesk_timers_page .centron-alert-info" ).find('p').html(_('Select timer, please.')).end().popup('open');
                    }
                    else {
                        console.log('Selected Timers to Report...' + selected_ticks);
                        var HelpdeskTimerI3D = [];
                        $('.tick_to_send_report.icon-ok').closest('.info_container').each(function (index) {

                            var selectedTimerI3D = $(this).data('i3d');
                            console.log(index + ": " + selectedTimerI3D);
                            HelpdeskTimerI3D.push(selectedTimerI3D);
                        });
                        console.log('HelpdeskTimerI3D: ' + JSON.stringify(HelpdeskTimerI3D));

                        var customer_email = $('#helpdesk_timers_page .ticket_details .customer_email').html();

                        console.log('Popup:'+$('#helpdesk_timers_page #send_report_container').length);
                                                          
                        $('#timer_send_to').val(customer_email);
                        $('#timer_ids').val(HelpdeskTimerI3D);
                                                          
                        $('#timer_submit').html(_('Send Report'));
                        $('#timer_submit').button( "refresh" );
                        $('#helpdesk_timers_page #send_report_container, #send_report_popup_overlay').addClass('send_report_show');
                    }
                }
            }
        }
    });
               
    $('#helpdesk_timers_page').on('touchstart', '.tick_to_send_report', function (event) {
        console.log('Making selective report...');

        var this_tick = $(this);
        if (this_tick.hasClass('icon-ok')) {
            this_tick.removeClass('icon-ok');
        } else {
            this_tick.addClass('icon-ok');
        }

        return false;
    });
               
    $('#helpdesk_timers_page').on('click', '.route', function(){
        console.log('Showing map in timers');
        show_customer_loc_timers();
    });
               
    $('#internal_note_switch').click(function () {
        console.log('toggle internal_note...');
        $('.internal_note_container').toggle();
    });
               
    $('#helpdesk_timers_page').on('click', '.gmap_close', function (e) {
        $('.gmap_outer_container').hide().css({
            'z-index': '-900'
        });
        e.stopPropagation();
    });

    init_start_stop_time();

	$('#duration_hour, #duration_minute').change(function(){

        stop = get_stop_time();

        var duration_hour = parseInt($('#duration_hour').val(), 10);
        duration_hour = Math.abs(duration_hour);
        duration_hour = isNaN(duration_hour)? 0 : duration_hour;
        $('#duration_hour').val(leadByZero(duration_hour));

        var duration_minute = parseInt($('#duration_minute').val(), 10);
        duration_minute = Math.abs(duration_minute);
        duration_minute = isNaN(duration_minute)? 0 : duration_minute;
        $('#duration_minute').val(leadByZero(duration_minute));

        start = stop-(duration_hour*60+duration_minute)*60*1000;

        var start_obj = new Date(start);

        //$('#date_start').mobiscroll().datetime('setDate', start_obj, true, 1000);
        $('#date_start').mobiscroll('setDate', start_obj, true, 1000);
	});

    $('#date_start, #date_end').change(function(){

        var stop = get_stop_time();
        var start = get_start_time();

        if(stop >= start) {
            $('.start_time .hour_minute').removeClass('invalid_date');
            duration = (stop - start)/1000;

            //break does not be affect Duration
            if(duration >= 0){
                duration_hour = parseInt(duration/3600, 10);
                duration_minute = (duration-duration_hour*3600)/60;
        
                duration_hour = leadByZero(duration_hour);
                $('#duration_hour').val(duration_hour);		
        
                duration_minute = leadByZero(duration_minute);
                $('#duration_minute').val(duration_minute);
            }
        }
        else {
            $('.start_time .hour_minute').addClass('invalid_date');
        }
	});

	$('#duration_fifteen_minus').on('touchstart', function(){
        update_duration(15, 0);
	});

	$('#duration_fifteen_plus').on('touchstart', function(){
        update_duration(15, 1);
	});

	$('#duration_sixty_minus').on('touchstart', function(){
        update_duration(60, 0);
	});

	$('#duration_sixty_plus').on('touchstart', function(){
        update_duration(60, 1);
	});	

	$('#duration_eight').on('touchstart', function(){
        $('#duration_hour').val('08').change();
        $('#duration_minute').val('00').change();
	});

	$('#break_fifteen_minus').on('touchstart', function(){
        update_break(15, 0);
	});

	$('#break_fifteen_plus').on('touchstart', function(){
        update_break(15, 1);
	});

	$('#break_sixty_minus').on('touchstart', function(){
        update_break(60, 0);
	});

	$('#break_sixty_plus').on('touchstart', function(){
        update_break(60, 1);
	});

    $('.sigPad').signaturePad({
        clear: '.clearSignature',
        output: '.output',
        validateFields: false,
        defaultAction: 'drawIt',
        drawOnly: true,
        canvas: '#HDTimer_signature .pad',
        bgColour: '#fff',
        penColour: '#333',
        penWidth: 1,
        lineColour: 'transparent'
    });

    $( '#submit_time_entry' ).touchstart(function() {
        if(!$(this).hasClass('disabled')) {
            $('.open-stopwatch-bar, .open-stopwatch').hide();
            console.log( "Processing Time Entry submission" );

            var Ticket = window.localStorage.getItem('Ticket');

            

            var calculable = $('#calculable').val();
            calculable = (calculable == 'on') ? true : false;

            var ExternalNote = $('#HDTimer_description').val();
            if(ExternalNote) {
                ExternalNote = strip_tags( ExternalNote );
                ExternalNote = ExternalNote.replace(/(\r\n|\n|\r)/gm, ' ');
                ExternalNote = ExternalNote.trim();
            }
            console.log( "ExternalNote: "+ExternalNote);
            if(!ExternalNote) {
                $( "#helpdesk_timers_page .centron-alert-info" ).find('p').html(_('Enter description, please.')).end().popup('open');
                return;
            }

            var HelpdeskI3D = $('#helpdesk_timers_page').data('helpdesk_i3d');
            console.log( "HelpdeskI3D: "+HelpdeskI3D);

            var InternalNote = $('#internal_note').val().trim();
            if(InternalNote) {
                InternalNote = strip_tags( InternalNote );
                InternalNote = InternalNote.replace(/(\r\n|\n|\r)/gm, ' ');
            }
            var planned = $('#planned').val();
            planned = (planned == 'on') ? true : false;

            var LunchTime = get_lunch_break();

            var Start = '\/Date(' + get_start_time() + get_time_offset() + ')\/';

            var Stop = '\/Date(' + get_stop_time() + get_time_offset() + ')\/';

            var duration = get_duration();
            if(!duration) {
                $( "#helpdesk_timers_page .centron-alert-info" ).find('p').html(_('Duration, please!')).end().popup('open');
                return;
            } else if (LunchTime > duration) {
                $( "#helpdesk_timers_page .centron-alert-info" ).find('p').html(_('Break is greater than Duration!')).end().popup('open');
                return;
            }

            var ArticleI3D = $("#HDTimer_emp_article").val();
            ArticleI3D = parseInt(ArticleI3D, 10);
            if(!ArticleI3D) {
                //$( "#helpdesk_timers_page .centron-alert-info" ).find('p').html(_('Select service article, please.')).end().popup('open');
                //return;
                ArticleI3D = 0;
            }

            //Signature: [81,109,89,61]
            //Signature: sigByteNumbers,
            //Signature: sigByteArray,

            var CurrentAppUserI3D = parseInt(window.localStorage.getItem("CurrentAppUserI3D"), 10);
            var CurrentAppUserFirstName = window.localStorage.getItem("CurrentAppUserFirstName");
            var CurrentAppUserLastName = window.localStorage.getItem("CurrentAppUserLastName");

            var data = {
                Timer: {
                    ArticleI3D: ArticleI3D,
                    Calculable: calculable,
                    Employee: {
                        I3D: CurrentAppUserI3D,
                        FirstName: CurrentAppUserFirstName,
                        LastName: CurrentAppUserLastName
                    },
                    ExternalNote: ExternalNote,
                    HelpdeskI3D: HelpdeskI3D,
                    /*InternalNote: InternalNote,*/
                    IsPlanned: planned,
                    LunchTime: LunchTime,
                    Start: Start,
                    Stop: Stop,
                    Timer: duration
                }
            };

            if(InternalNote) {
                data.Timer.InternalNote = InternalNote;
            }

            var TypeI3D = $('#HDTimer_type').val();
            TypeI3D = parseInt(TypeI3D, 10);
            if(TypeI3D) {
                var TypeName = $('#HDTimer_type option[value="'+TypeI3D+'"]').html();
                data.Timer.Type = {
                    I3D: TypeI3D,
                    Name: TypeName
                };
            }

            var new_timer_mode = window.sessionStorage.getItem('new_timer_mode');
            var timerI3D;
            if('false' === new_timer_mode ) {
                console.log('Timer: Edit mode');
                timerI3D = $('#helpdesk_timers_page .info_container.user_selected').data('i3d');
                if(timerI3D){
                    data.Timer.I3D = parseInt(timerI3D, 10);
                }
            }
            else {
                console.log('Timer: New mode');
            }

            var api = $('.sigPad').signaturePad();
            var sig = api.getSignatureImage();

            if(!$('#HDTimer_signature').is(":visible")){
                $.extend(data, {
                    HasSigned: true
                });
            }
            if(sig == $('#timer_signature_canvas').data('init_data_url')) {
                console.log('Empty Signature');
            } else {
                //strip "data:image/png;base64,"
                var signature = sig.substring(22);

                var sigByteCharacters = atob(signature);
                var sigByteNumbers = [];
                for (var i = 0; i < sigByteCharacters.length; i++) {
                    sigByteNumbers[i] = sigByteCharacters.charCodeAt(i);
                }
                var offline_mode = window.localStorage.getItem('offline_mode');
                $.extend(data, {
                       Signature: sigByteNumbers
                    });
            }
            
            var login_ticket = window.localStorage.getItem('Ticket');
            var timer_param = {
                Ticket: login_ticket,
                Data: data
            };

            $( '#submit_time_entry' ).addClass('disabled');
            console.log('new_timer_mode: ' + new_timer_mode);
            service_request('SaveHelpdeskTimerWithSignatureAndSpecialArticles', timer_param).done( function (response) {

                if (0 === response.Status) {

                    //clearing the new time entry form
                    var api = $('.sigPad').signaturePad();
                    api.clearCanvas();
                    init_start_stop_time();
                    $('#HDTimer_type').val('').change();
                    $('#HDTimer_emp_article').val('').change();

                    $('#HDTimer_description, #internal_note').val('');
                    $('#HDTimer_popup_overlay,#HDTimer_popup').hide();

                    window.setTimeout(function(){
                        $('#helpdesk_timers_page .info_container').remove();
                        create_HD_timers_page();
                    }, 500);
                }
            }).always(function() {
                $( '#submit_time_entry' ).removeClass('disabled');
            });
            return false;
        }
    });

    $('#helpdesk_timers_page .edit_time_btn').click(function(){
        console.log('edit_time_btn: '+ $(this).attr("class"));
        if(!$(this).hasClass('disabled')) {
            var selected_timer = $('#helpdesk_timers_page .info_container.user_selected');
            if(selected_timer.length) {
                console.log('Editing timer...');
                var has_signature = selected_timer.find('.timer_signature').data('has_signature');
                if ('true' == has_signature) {
                    $('#HDTimer_signature').hide();
                    $('#signature_exists').show();
                    //Make a button aside to clear signature – only new mode!!
                    $('#HDTimer_signature .clearSignature').closest('.ui-btn').hide();
                }
                else {
                    $('#HDTimer_signature').show();
                    $('#signature_exists').hide();
                    //Make a button aside to clear signature – only new mode!!
                    $('#HDTimer_signature .clearSignature').closest('.ui-btn').show();
                }

                $('.ticket_timers_details').hide();

                var timer_start = $('#helpdesk_timers_page .info_container.user_selected .timer_start');

                var start_timestamp = timer_start.data('start_timestamp');
                $('#date_start').mobiscroll('setDate', new Date(start_timestamp), true, 1000);

                var timer_stop = $('#helpdesk_timers_page .info_container.user_selected .timer_stop');

                var stop_timestamp = timer_stop.data('stop_timestamp');
                $('#date_end').mobiscroll('setDate', new Date(stop_timestamp), true, 1000);

                var timer_duration = $('#helpdesk_timers_page .info_container.user_selected .timer_duration');
                $('#HDTimer_popup #duration_hour').val(timer_duration.data('duration_hh'));
                $('#HDTimer_popup #duration_minute').val(timer_duration.data('duration_mm'));

                var timer_lunchtime = $('#helpdesk_timers_page .info_container.user_selected .timer_lunchtime');
                $('#HDTimer_popup #break_hour').val(leadByZero(timer_lunchtime.data('lunch_hh')));
                $('#HDTimer_popup #break_minute').val(leadByZero(timer_lunchtime.data('lunch_mm')));

                var timer_calculable = $('#helpdesk_timers_page .info_container.user_selected .timer_calculable');
                var calculable = timer_calculable.data('calculable');

                if(calculable) {
                    $('#HDTimer_popup #calculable').val('on');
                }
                else {
                    $('#HDTimer_popup #calculable').val('off');
                }
                $('#calculable').slider( "refresh" );

                var timer_planned = $('#helpdesk_timers_page .info_container.user_selected .timer_planned');
                
                var planned = timer_planned.data('planned');

                if(planned) {
                    $('#HDTimer_popup #planned').val('on');
                }
                else {
                    $('#HDTimer_popup #planned').val('off');
                }
                $('#planned').slider( "refresh" );

                var timer_emp_article = $('#helpdesk_timers_page .info_container.user_selected .timer_emp_article');
                var article_i3d = timer_emp_article.data('emp_article');

                $( '#HDTimer_emp_article').val(article_i3d).change();

                var timer_type = $('#helpdesk_timers_page .info_container.user_selected .timer_type');
                var type_i3d = timer_type.data('type_i3d');

                $( '#HDTimer_type' ).val(type_i3d).change();
                                  
                var description = $('#helpdesk_timers_page .info_container.user_selected .timer_description').html();
                $('#HDTimer_description').val(description);

                var timer_internal_note = $('#helpdesk_timers_page .info_container.user_selected .timer_internal_note').html();
                $('.internal_note_container').hide();
                                  
                if(timer_internal_note) {
                    $('#internal_note').val(timer_internal_note);
                    $('#internal_note_switch').addClass('blue_pin');
                }
                else {
                    $('#internal_note_switch').removeClass('blue_pin');
                }

                $('#HDTimer_popup_overlay, #HDTimer_popup').show();
            }
            else {
                console.log('Please select a timer!');
                $( "#helpdesk_timers_page div.centron-alert-info" ).find('p').html(_('Select timer, please.')).end().popup('open');
            }
            window.sessionStorage.setItem('new_timer_mode', false);
        }
    });

    //Close HDTimer_popup
    $('#close_HDTimer_popup, #cancel_time_entry').click(function(e){ // #HDTimer_popup_overlay outside popup
        if(e.target == this) {
            $('.open-stopwatch-bar, .open-stopwatch').hide();

            $('#helpdesk_timers_page .info_container').find('.ticket_timers_details').hide();
            //clearing the new time entry form
            var api = $('.sigPad').signaturePad();
            api.clearCanvas();
            init_start_stop_time();
            $('#HDTimer_type').val('').change();

            $('#HDTimer_description, #internal_note').val('');
            $('#HDTimer_popup_overlay, #HDTimer_popup').hide();

            e.stopImmediatePropagation();
            return false;
        }
    });

    $('#helpdesk_timers_page .open-stopwatch').click(function(){
        load_all_stopwatch();
        $('.open-stopwatch-bar, .open-stopwatch').hide();
    });
                     
    $('#helpdesk_timers_page .open-stopwatch').on( "swiperight", function(){
        console.log('Swiperight');
        $(this).click();
    });
                     
    $('#helpdesk_timer_container').on('touchstart', '.ticket_timers_details', function(e){
                                      
        if(this == e.target){
            return false;
        }
    });
});

$.mobile.document.on('pagebeforeshow','#helpdesk_timers_page', function(event) {
    textAreaAttributes();
    $('#helpdesk_timers_page .action_button_container .button').addClass('disabled');

    //clearing the new time entry form
    var api = $('.sigPad').signaturePad();
    api.clearCanvas();
    init_start_stop_time();

    $('#HDTimer_type').val('').change();

    $('#HDTimer_description, #internal_note').val('');
    $('#HDTimer_popup_overlay,#HDTimer_popup').hide();

    var login_ticket = window.localStorage.getItem('Ticket');
    service_request('GetEmployeeArticlesFromTicket', {Ticket: login_ticket}).done(function(response){

        if (0 === response.Status) {
            var emp_article = '';
            
            if (response.Result.length) {
                emp_article += '<option value="0">---</option>';
                $.each(response.Result, function (i, result) {
                    if(result && result.ArticleI3D && result.ArticleCode && result.ArticleDescription) {
                        if(result.IsDefault) {
                            default_article_i3d = result.ArticleI3D;
                        }
                        emp_article += '<option value="' + result.ArticleI3D + '">';
                        emp_article += result.ArticleCode + '-' + result.ArticleDescription + '</option>';
                    }
                });
            }
            $('#HDTimer_emp_article').html(emp_article);
            /*
            $('#HDTimer_emp_article').mobiscroll('init');
            var lang = window.localStorage.getItem('user_lang');
            if(!lang) {
                lang = 'en';
            }
            $('#HDTimer_emp_article').mobiscroll('option', { lang: lang });
            if(default_article_i3d) {
                console.log('Default Article found!');
                $('#HDTimer_emp_article').val(default_article_i3d).change();
            }
            */
        }
    });

    service_request('GetHelpdeskTimerTypes', {Ticket: login_ticket}).done(function (response) {

        if (response.Status === 0) {
            var timer_type = '';
            if(response.Result.length) {
                timer_type += '<option value="0">---</option>';
                $.each(response.Result, function (i, result) {
                    if(result && result.I3D && result.Name) {
                        timer_type += '<option value="' + result.I3D + '">' + result.Name + '</option>';
                    }
                });
            }
            $('#HDTimer_type').html(timer_type);
            $('#HDTimer_type').mobiscroll('init');
            var lang = window.localStorage.getItem('user_lang');
            if(!lang) {
                lang = 'en';
            }
            $('#HDTimer_type').mobiscroll('option', { lang: lang });
        }
    });
});

$.mobile.document.on('pageshow', '#helpdesk_timers_page', function (event) {
    
    check_stopwatch_availability();
    $('.stopwatch-popup-overlay, .open-stopwatch-bar, .open-stopwatch').hide();
                     
    create_HD_timers_page();

    $('#send_report_container, #send_report_popup_overlay').removeClass('send_report_show');

    $('#helpdesk_timers_page .action_button_container .button').removeClass('disabled');
    if( window.localStorage.getItem('offline_mode') === 'on' ) {
        $('#helpdesk_timers_page .send_report').addClass('disabled');
    }

    var LoadHelpdeskTimerWithNew = window.sessionStorage.getItem('LoadHelpdeskTimerWithNew');
    var LoadHelpdeskTimerWithEdit = window.sessionStorage.getItem('LoadHelpdeskTimerWithEdit');

    if (LoadHelpdeskTimerWithNew) {
        console.log('Issuing New HelpDeskTimer...');
        $('#helpdesk_timers_page .add_timer').click();
        window.sessionStorage.removeItem("LoadHelpdeskTimerWithNew");
        setTimeout(function(){
            restore_helpdesk_timer_snapshot();
        },500);
    } else if (LoadHelpdeskTimerWithEdit) {
        var HelpdeskTimerI3D = window.sessionStorage.getItem('HelpdeskTimerI3D');
        if(HelpdeskTimerI3D) {
            $('#helpdesk_timers_page .edit_time_btn').click();
            setTimeout(function(){
                restore_helpdesk_timer_snapshot();
            },500);
        }
    }

});
