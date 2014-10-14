//tested on javascriptlint.com on 12 Aug 2014

var crm_edit_mode = false;

function get_crm_filter_options() {

    var all_crm = $('input[name="all_crm"]:checked').val();
    console.log('all_crm: '+all_crm);

    var closed_crm = $('input[name="closed_crm"]:checked').length;
    console.log('closed_crm: '+closed_crm);

    var customer_i3d = window.sessionStorage.getItem('CustomerSelected');
    console.log('customer_i3d: '+customer_i3d);

    var crm_filter = {};

    crm_filter['OnlyOwn'] = ('all_crm' == all_crm) ? false: true;

    crm_filter['OnlyActiv'] = (closed_crm) ? false : true;

    if(customer_i3d) {
        crm_filter['CustomerI3D'] = parseInt(customer_i3d, 10);
        $('#crm_scroller .title_container').html(window.sessionStorage.getItem('CustomerName'));
    }
    return crm_filter;
}

//creates a CRM page of tickets and their corresponding details
//01 Apr 2013
var create_crm_page = function (response) {

    var i, result;
    $.each(response.Result, function (i, result) {

        console.log('Count/Total Tickets: ' + result.Count);
        if(result.Count) {
            $('#pull_up_crm').show();
        } else {
           $('#pull_up_crm').hide();
        }
        console.log('Showing Tickets: ' + result.Result.length);
        console.log('CurrentPage: ' + result.CurrentPage);
        console.log('PageCount/Total Pages: ' + result.PageCount);
        
        var content = '', contact_person;

        $.each(result.Result, function (j, crm) {

            if((crm !== null && typeof crm === 'object') && !isEmpty(crm) && crm.I3D) {
                content += '<li class="info_container helpdesk_ticket" data-ticketid="'+crm.I3D+'" >';

                content += '<div class="col1"><div class="padder">';

                if(crm.DueDate){
               
                    var crm_duedate_moment = moment( crm.DueDate );

                    crm_duedate_string = crm_duedate_moment.format("DD.MM.YYYY HH:mm");
               
                    content += '<div class="date normal_text">' + crm_duedate_string + '</div>';
                }

                var crm_state = crm.State;
                crm_state = crm_state ? _('Closed') : _('Open');
                content += '<div class="normal_text">' + crm_state + '</div>';

                var crm_type;
                if(crm.Type === 0) {
                    crm_type = 'type_zero';
                }
                if(crm.Type === 1) {
                    crm_type = 'type_one';
                }
                if(crm.Type === 2) {
                    crm_type = 'type_two';
                }
                if(crm.Type === 3) {
                    crm_type = 'type_three';
                }
                if(crm.Type === 4) {
                    crm_type = 'type_four';
                }
                content += '<div class="crm_type '+crm_type+'">' + '</div>';

                content += '</div></div><!--.padder--><!--.col1-->';

                content += '<div class="col2"><div class="padder">';

                contact_person = crm.FullNameContactPerson;
                contact_person = contact_person ? contact_person : '';

                crm_object_i3d = crm.ObjectI3D;
                crm_object_i3d = crm_object_i3d ? crm_object_i3d : '';

                if(crm_object_i3d) {
                    content += '<div class="subhead_text">' + contact_person + '<div class="crm-object-i3d" >' + crm_object_i3d + '</div>';
                }
                content += '</div>';

                var crm_name = crm.Name;
                if(!crm_name) {
                    crm_name = '';
                }
                content += '<div class="crm-name normal_text">' + crm_name + '</div>';

                var crm_description = crm.Description;
                if(!crm_description) {
                   crm_description = '';
                }
                content += '<div class="description subhead_text">' + crm_description + '</div>';

                content += '</div></div><!--.padder--><!--.col2--><div class="cb"></div>';
                content += '</li><!--.info_container.helpdesk_ticket-->';
            }
        });

        $('#crm_ticket_list li.cb').remove();
        content += '<li class="cb"></li>';
        $('#crm_ticket_list').append(content);
        crm_scroll.refresh();
    });
};

function restore_crm_snapshot () {
	console.log('Recovering CRM State...');
	var details = window.sessionStorage.getItem('AppSnapshot');
	window.sessionStorage.removeItem('AppSnapshot');
	if(details) {
        console.log('Snapshot found');
		var param = JSON.parse(details);

		var state_data = param.Data;
		if(Object.keys(state_data).length) {
            
            var crm_type = state_data.Type;
            crm_type = parseInt(crm_type, 10);
            if([0,1,2,3].indexOf(crm_type) !== -1) {
                $('input[name="crm_type"]').prop( "checked", false ).checkboxradio( "refresh" );
                $('input[name="crm_type"][value="'+crm_type+'"]').prop( "checked", true ).checkboxradio( "refresh" );

                $( 'input[name="crm_type"][value="'+crm_type+'"]').change();
            }

            var crm_short_desc = state_data.Name;
            if(crm_short_desc) {
                $('#crm_short_description').val(crm_short_desc);
            }

            var crm_description = state_data.Description;
            if(crm_description) {
                $('#crm_description').val(crm_description);
            }

            var contact_i3d = state_data.ContactPerson;
            $('#crm_contact_person').val(contact_i3d).change();

            var due_date_timestamp = state_data.DueDate;
            var due_date_obj = moment(due_date_timestamp);
            $('#crm_due_date').mobiscroll('setDate', due_date_obj.toDate(), true, 1000);

            if(1 == crm_type) {
                var end_date_timestamp = state_data.EndDate;
                if(end_date_timestamp) {
                    var end_date_obj = moment(end_date_timestamp);
                    $('#crm_end_date').mobiscroll('setDate', end_date_obj.toDate(), true, 1000);
                }
            }

            var followup_date_timestamp = state_data.FollowUpDate;
            if(followup_date_timestamp) {
                var followup_date_obj = moment(followup_date_timestamp);
                $('#crm_followup_date').mobiscroll('setDate', followup_date_obj.toDate(), true, 1000);
            }

            var crm_receiver = state_data.ReceiverEmployee;
            if(crm_receiver) {
                $('#crm_receiver_employee').val(crm_receiver).change();
            }

            var crm_status = state_data.State;
            if(crm_status) {
                $('#crm_status').val(crm_status);
                $('#crm_status').slider('refresh');
            }
        }
	}
}

$.mobile.document.on( "pagecreate", "#crm_page", function() {

    $('#crm_to_home').click(function(){

        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });

    $( "#crm_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#crm_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    var user_lang = window.localStorage.getItem('user_lang');
    if(!user_lang) {
        user_lang = 'en';
    }

    var today = new Date();
    $("#crm_due_date, #crm_end_date, #crm_followup_date").mobiscroll().datetime({
        defaultValue: today,
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

    $('#crm_filter_toggle').click(function(){

        $('#crm_ticket_details .ticket_details').hide();

        console.log('Toggling Display/Filter Options');
        if ($('#crm_page .helpdesk_display_options').hasClass('helpdesk_filter')) {
            
            $('#crm_page .helpdesk_display_options').css({
                'display': 'none'
            });
            
        } else {
            
            $('#crm_page .helpdesk_display_options').css({
                'display': 'block'
            });
        }
        $('#crm_page .helpdesk_display_options').toggleClass('helpdesk_filter');
    });

    $('#crm_wrapper').click(function(e){
        if(this == e.target) {
            $('#crm_page .helpdesk_display_options').css({
                'display': 'none'
            });
            $('#crm_page .helpdesk_display_options').removeClass('helpdesk_filter');
        }
    });

    //change in CRM Display/Filters options
    $('#all_crm, #my_crm, #closed_crm').change(function () {

        var current_page = 1;
        window.sessionStorage.setItem("crm_current_page", current_page);
        var response;

        var entries_per_page = window.localStorage.getItem('crm_record_limit');
        var ticket = window.localStorage.getItem('Ticket');
        var crm_param = {
            Ticket: ticket,
            Data: {
                CRMActivityFilter: get_crm_filter_options(),
                Sort: 'I3D',
                descending: true,
                entriesPerPage: entries_per_page,
                page: current_page
            }
        };
        var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
        if(CustomerI3D) {
            CustomerI3D = parseInt(CustomerI3D, 10);
            crm_param.Data.CRMActivityFilter.CustomerI3D = CustomerI3D;
        }
        service_request('SearchCRMActivitiesThroughPaging', crm_param).done(function (response) {

            if (0 === response.Status) {
                $('#crm_ticket_list').html('');
                create_crm_page(response);
            }
        });
    });

    $('#crm_ticket_list').on('click', '.info_container', function (event) {

        var display_options = $('#crm_page .helpdesk_display_options');

        if (display_options.hasClass('helpdesk_filter')) {
            display_options.css({ 'display': 'none' }).toggleClass('helpdesk_filter');
        }

        $('#crm_page .info_container').removeClass('user_selected');

        var ticket = $(this);
        ticket.addClass('user_selected');

        var crm_i3d = ticket.data('ticketid');
        window.sessionStorage.setItem('crm_i3d', crm_i3d);

        var content_details;

        if (crm_i3d) {
            var crm_name, crm_type, due_date, date, followup_date, end_date, crm_creater_display_text, crm_creator_i3d, crm_receiver_employee, crm_contact_person, crm_contact_i3d;
            var due_date_timestamp, date_timestamp, followup_date_timestamp;
            var state, state_label;
            var crm_email_message, crm_email_message_label;

            console.log('crm_i3d: ' + crm_i3d);

            var login_ticket = window.localStorage.getItem('Ticket');
            var crm_param = {
                Ticket: login_ticket,
                Data: crm_i3d
            };
            service_request('GetCRMActivityByI3D', crm_param).done(function(response){
                if (0 === response.Status ) {
                    var crm = response.Result[0];

                    if((crm !== null && typeof crm === 'object') && !isEmpty(crm) && crm.I3D) {
                        content_details = '';

                        content_details += '<div class="ticket_details" data-ticketid="' + crm.I3D + '">';
                        content_details += '<div class="close_ticket_details icon-cancel" data-ticketid="' + crm.I3D + '"></div>';

                        crm_name = crm.Name;
                        crm_name = crm_name ? crm_name : '';

                        crm_type = crm.Type;
                        window.localStorage.setItem("CurrentCrmType",crm_type);
                        crm_type = (null !== crm_type) ? crm_type : '';
                        content_details += '<h2 class="headline_text"><span class="crm-short-desc">' + crm_name + '</span> | <span class="crm-type">' + crm_type + '</span></h2>';

                        due_date = crm.DueDate;
                        if(due_date) {
                                                                   
                            due_date = moment( due_date );
                            due_date_timestamp = due_date.valueOf();
                            due_date = due_date.format("DD.MM.YYYY HH:mm");
                        }
                        else {
                            due_date_timestamp = 0;
                            due_date = '&nbsp;';
                        }

                        date = crm.Date;
                        if(date) {
                             
                            date = moment( date );
                            date_timestamp = date.valueOf();
                            date = date.format("DD.MM.YYYY HH:mm");
                        }
                        else {
                            date_timestamp = 0;
                            date = '&nbsp;';
                        }

                        crm_creater_display_text = crm.CreaterDisplayText;
                        crm_creater_display_text = crm_creater_display_text ? crm_creater_display_text : '';

                        crm_creator_i3d = crm.Creator;
                        crm_creator_i3d = crm_creator_i3d ? crm_creator_i3d : 0;

                        content_details += '<h2 class="headline_text">' + _('Due on') + '&nbsp;' + due_date + ',&nbsp;'+_('Record by')+'&nbsp;<span class="crm-creater-display-text" data-crm-creator="'+crm_creator_i3d+'">' + crm_creater_display_text + '</span><span class="normal_text"> ('+ _('at')+'</span> <span class="normal_text crm-date" data-timestamp="'+date_timestamp+'">'  + date + '</span><span class="normal_text">)</span></h2>';

                        if(crm.Description) {
                            content_details += '<p class="normal_text crm_description">' + crm.Description + '</p>';
                        }
                        content_details += '<div class="normal_text">';

                        content_details += '<div class="ticket_details_col_1">';

                        content_details += '<div class="ticket_details_field">';

                        if(1 == crm_type) {
                            content_details += '<div class="field_label">'+_('Date at')+'</div>';
                        }
                        else {
                            content_details += '<div class="field_label">'+_('Due date')+'</div>';
                        }
                        content_details += '<div class="crm-due-date field_value" data-timestamp="'+due_date_timestamp+'">' + due_date + '</div></div>';

                        followup_date = crm.FollowUpDate;
                        if(followup_date) {
                            
                            followup_date = moment( followup_date );
                            followup_date_timestamp = followup_date.valueOf();
                            followup_date = followup_date.format("DD.MM.YYYY HH:mm");
                        }
                        else {
                            followup_date_timestamp = 0;
                            followup_date = '&nbsp;';
                        }

                        content_details += '<div class="ticket_details_field">';
                        if(1 == crm_type) {
                            content_details += '<div class="field_label" >'+_('Reminder')+'</div>';
                        }
                        else {
                            content_details += '<div class="field_label" >'+_('Resubmission')+'</div>';
                        }
                        content_details += '<div class="crm-followup-date field_value" data-timestamp="'+followup_date_timestamp+'">' + followup_date + '</div></div>';

                        crm_receiver_employee = crm.ReceiverEmployee;
                        crm_receiver_employee = crm_receiver_employee ? crm_receiver_employee : '';
                        content_details += '<div class="ticket_details_field">';
                        content_details += '<div class="field_label">'+_('To do by')+'</div>';
                        content_details += '<div class="crm-receiver-employee field_value" data-crm_receiver_employee_i3d="'+crm_receiver_employee+'">' + crm_receiver_employee + '</div></div>';

                        if(crm_receiver_employee){

                            var login_ticket = window.localStorage.getItem('Ticket');
                            var employee_param = {
                                Ticket: login_ticket,
                                Data: crm_receiver_employee
                            };
                            service_request('GetEmployeeByI3D', employee_param).done(function(response){
                                var employee_data, firstname, lastname;
                                if(0 === response.Status) {
                                    if(response.Result && response.Result[0]) {
                                        employee_data = response.Result[0];

                                        firstname = employee_data.FirstName;
                                        if(!firstname) {
                                            firstname = '';
                                        }
                                        lastname = employee_data.LastName;
                                        if(!lastname) {
                                            lastname = '';
                                        }
                                        $('.crm-receiver-employee').html(lastname + ', ' + firstname);
                                    }
                                }
                            });
                        }

                        crm_email_message = crm.EMailMessage;
                        if(crm_email_message) {
                            crm_email_message_label = _('Yes');
                        }
                        else {
                            crm_email_message_label = _('No');
                        }
                        content_details += '<div class="ticket_details_field">';
                        content_details += '<div class="field_label">'+_('Inform by E-Mail')+'</div>';
                        content_details += '<div class="crm-email-message field_value" data-email_message="'+crm_email_message+'">' + crm_email_message_label + '</div></div>';

                        crm_contact_person = crm.FullNameContactPerson;
                        crm_contact_person = crm_contact_person ? crm_contact_person : '';
                        crm_contact_i3d = crm.ContactPerson;
                        crm_contact_i3d = crm_contact_i3d ? crm_contact_i3d : 0;

                        content_details += '<div class="ticket_details_field">';
                        content_details += '<div class="field_label">'+_('Contact person')+'</div>';
                        content_details += '<div class="crm-contact-person field_value" data-contact_i3d="'+crm_contact_i3d+'">' + crm_contact_person + '</div></div>';

                        content_details += '</div><!--.ticket_details_col_1-->';
                        content_details += '<div class="ticket_details_col_2">';

                        if(1 == crm_type) {
                            end_date = crm.EndDate;
                            if(end_date) {

                                end_date_moment = moment( end_date );
                                end_date_timestamp = end_date_moment.valueOf();

                                end_date = end_date_moment.format("DD.MM.YYYY HH:mm");
                            }
                            else {
                                end_date_timestamp = 0;
                                end_date = '&nbsp;';
                            }
                            content_details += '<div class="ticket_details_field">';
                            content_details += '<div class="field_label">'+_('End date')+'</div>';
                            content_details += '<div class="crm-end-date field_value" data-timestamp="'+end_date_timestamp+'">'+end_date+'</div></div>';
                        }
                        else {
                            content_details += '<div class="ticket_details_field">';
                            content_details += '<div class="field_label"></div>';
                            content_details += '<div class="field_value" ></div></div>';
                        }

                        content_details += '<div class="ticket_details_field">';
                        content_details += '<div class="field_label">&nbsp;</div>';
                        content_details += '<div class="field_value"></div></div>';

                        content_details += '<div class="ticket_details_field">';
                        content_details += '<div class="field_label">&nbsp;</div>';
                        content_details += '<div class="field_value"></div></div>';

                        content_details += '<div class="ticket_details_field">';
                        content_details += '<div class="field_label">'+_('State')+'</div>';
                        state = crm.State;
                        if(state !== null) {
                            state_label = state ? 'Closed' : 'Open';
                            content_details += '<div class="crm-status field_value" data-status="'+state+'">'+ _(state_label) +'</div></div>';
                        }
                        else {
                            content_details += '<div class="field_value">&nbsp;</div></div>';
                        }
                        content_details += '</div><!--.ticket_details_col_2-->';

                        content_details += '</div><!--.normal_text-->';
                        content_details += '</div><!--.ticket_details-->';

                        $('#crm_ticket_details').html(content_details);
                        $('#crm_ticket_details .ticket_details').show();
                        
                        if(window.sessionStorage.getItem("LoadCRMWithEditCRM")) {
                            $('.edit_crm').click();
                            window.sessionStorage.removeItem("LoadCRMWithEditCRM");
                        }
                    }
                }
            });
        }
    });
                     
    $('#crm_ticket_details').on('click', '.close_ticket_details', function(){

        $('#crm_ticket_details .ticket_details').hide();
    });
    
    $('.new_crm, .edit_crm').click(function(e){
        e.preventDefault();

        var customer_i3d, crm_i3d, crm_description = '', crm_short_desc = '', crm_type, contact_i3d, contact_person = '', receiver_employee, receiver_employee_i3d, due_date_timestamp, due_date_obj, end_date_timestamp, end_date_obj, followup_date_timestamp, followup_date_obj, crm_status;
                                   
        //Populate CRM type
        var crm_type_html = '<label class="new_edit_HD_clear_left_padding crm_type_label" >'+_('CRM-Type')+'</label>';

        crm_type_html += '<input type="radio" name="crm_type" id="visit_report" value="2">';
        crm_type_html += '<label for="visit_report" >'+_('Visit report')+'</label>';
                           
        crm_type_html += '<input type="radio" name="crm_type" id="note" value="3">';
        crm_type_html += '<label for="note" >'+_('CRM Note')+'</label>';
                           
        crm_type_html += '<input type="radio" name="crm_type" id="phone_notice" value="0">';
        crm_type_html += '<label for="phone_notice" >'+_('Phone notice')+'</label>';
                
        crm_type_html += '<input type="radio" name="crm_type" id="time_schedule" value="1">';
        crm_type_html += '<label for="time_schedule" >'+_('Time schedule')+'</label>';
            
        $('.crm_type_container').html(crm_type_html);
        $( 'input[name="crm_type"]' ).checkboxradio();
                                   
        $('#crm_cancel').html(_('Cancel'));
        $('#crm_submit').html(_('Save'));
        $('#crm_cancel, #crm_submit').button( "refresh" );

        var crm_flow_mode = $(e.target).data('i18n');

        //Edit CRM
        if('Edit' == crm_flow_mode) {
            console.log('CRM flow mode: ' + crm_flow_mode);
            crm_edit_mode = true;
            var crm_ticket = $('#crm_page .info_container.user_selected');
            var crm_details = $('#crm_ticket_details');

            if(crm_ticket.length) {
                $('.crm-popup-heading').html(_('CRM Activity'));
                
                var crm_creater = crm_details.find('.crm-creater-display-text').html();
                var crm_date = crm_details.find('.crm-date').html();
                                   
                $('.crm-record-by').html(_('Record by') + '&nbsp;' + crm_date + ' | ' + crm_creater);
                                   
                customer_i3d = parseInt(crm_ticket.find('.crm-object-i3d').html(), 10);
                                   
                window.sessionStorage.setItem('CustomerI3D',customer_i3d);
                                   
                crm_i3d = crm_details.find('.ticket_details').data('ticketid');
                $('#new_edit_CRM_popup').attr('data-crm_i3d', crm_i3d);

                crm_description = crm_details.find('.crm_description').html();
                $('#crm_description').val(crm_description);

                crm_short_desc = crm_details.find('.crm-short-desc').html();
                $('#crm_short_description').val(crm_short_desc);

                crm_type = crm_details.find('.crm-type').html();
                $('input[name="crm_type"]').prop( "checked", false ).checkboxradio( "refresh" );
                $('input[name="crm_type"][value="'+crm_type+'"]').prop( "checked", true ).checkboxradio( "refresh" );
                                   
                $('input[name="crm_type"]').checkboxradio('disable');
                                   
                if(1 == crm_type) {
                    $('.crm-end-date').addClass('time-schedule');
                                   
                    $('.crm-label-due-date').html(_('Date at'));
                    $('.crm-label-followup-date').html(_('Reminder'));
                }
                else {
                    $('.crm-end-date').removeClass('time-schedule');
                                   
                    $('.crm-label-due-date').html(_('Due date'));
                    $('.crm-label-followup-date').html(_('Resubmission'));
                }

                due_date_timestamp = crm_details.find('.crm-due-date').data('timestamp');
                due_date_obj = new Date(due_date_timestamp);
                $('#crm_due_date').mobiscroll('setDate', due_date_obj, true, 1000);

                if(1 == crm_type) {
                    end_date_timestamp = crm_details.find('.crm-end-date').data('timestamp');
                    end_date_obj = new Date(end_date_timestamp);
                    $('#crm_end_date').mobiscroll('setDate', end_date_obj, true, 1000);
                }

                followup_date_timestamp = crm_details.find('.crm-followup-date').data('timestamp');
                followup_date_obj = new Date(followup_date_timestamp);
                $('#crm_followup_date').mobiscroll('setDate', followup_date_obj, true, 1000);
                                   
                crm_status = crm_details.find('.crm-status').data('status');
                $('#crm_status').val(crm_status);
                $('#crm_status').slider('refresh');
            }
            else {
                $( "#crm_page .centron-alert-info" ).find('p').html(_('Select ticket, please.')).end().popup('open');
                return;
            }
        }
        //New CRM
        else if('New' == crm_flow_mode){
            console.log('CRM flow mode: ' + crm_flow_mode);
            crm_edit_mode = false;
            customer_i3d = window.sessionStorage.getItem('CustomerSelected');
                                   
            if(!customer_i3d) {
                console.log('Customer not found');
                $( "#crm_page .centron-alert-info" ).find('p').html(_('Select customer, please.')).end().popup('open');
                return;
            }
                                   
            $('input[name="crm_type"]').prop( "checked", false ).checkboxradio( "refresh" );
            $('#crm_short_description').val('');
            $('#crm_description').val('');
            $('#crm_due_date, #crm_followup_date').val('');
                                   
            var today_date_obj = new Date();
            $('#crm_due_date').mobiscroll('setDate', today_date_obj, true, 1000);
            $('#crm_followup_date').mobiscroll('setDate', today_date_obj, true, 1000);
                                   
            $('.crm-popup-heading').html(_('New CRM Activity'));
            $('.crm-record-by').html('');
        }
        else {
            console.log('Extra mode!');
            return;
        }
        
        if(customer_i3d){
                               
            var load_employee_dropdown = $.Deferred();
            var load_contact_dropdown = $.Deferred();

            var ticket = window.localStorage.getItem('Ticket');
            service_request('GetEmployees', { Ticket: ticket}).done(function(response){

                if(0 === response.Status) {

                    var crm_receiver_employee = '';
                    $.each(response.Result, function (index, result) {
                        if(result && result.I3D && result.ShortSign && result.LastName && result.FirstName) {
                            crm_receiver_employee += '<option value="'+result.I3D+'">' + result.ShortSign + ' &brvbar; ' + result.LastName + '&#44; ' + result.FirstName + '</option>';
                        }
                    });
                    if(crm_receiver_employee) {
                        $('#crm_receiver_employee').html(crm_receiver_employee);
                        $('#crm_receiver_employee').mobiscroll('init');
                        var lang = window.localStorage.getItem('user_lang');
                        if(!lang) {
                            lang = 'en';
                        }
                        $('#crm_receiver_employee').mobiscroll('option', { lang: lang });
                    }
                    if(crm_details){
                        console.log('Marking selected receiver employee');
                        receiver_employee_i3d = crm_details.find('.crm-receiver-employee').data('crm_receiver_employee_i3d');
                        if(receiver_employee_i3d) {
                            receiver_employee_i3d = parseInt(receiver_employee_i3d, 10);
                            $('#crm_receiver_employee').val(receiver_employee_i3d).change();
                            receiver_employee = $('#crm_receiver_employee option[value="'+receiver_employee_i3d+'"]').html();
                        }
                    }
                    else {
                        console.log('Did not select receiver employee');
                    }
                    load_employee_dropdown.resolve();
                }
            });

            var login_ticket = window.localStorage.getItem('Ticket');
            var contact_param = {
                Ticket: login_ticket,
                Data: customer_i3d
            };
            service_request('GetAddressContactsFromCustomer', contact_param).done(function(response){

                if(0 === response.Status) {

                    var crm_contact_person = '';
                    var index, result;
                    var salutation, first_name, last_name, contact_name;
                    $.each(response.Result, function (index, result) {
                        if(result) {
                            salutation = result.Salutation ? result.Salutation.Salutation + '&nbsp;' : '';

                            first_name = result.Firstname;
                            first_name = first_name ? first_name + '&nbsp;' : '';

                            last_name = result.Lastname;
                            last_name = last_name ? last_name : '';

                            contact_name = salutation + first_name + last_name;
                            if(contact_name) {
                                crm_contact_person += '<option value="'+result.I3D+'">'+ contact_name + '</option>';
                            }
                        }
                    });
                    $('#crm_contact_person').html(crm_contact_person);
                    $('#crm_contact_person').mobiscroll('init');
                    var lang = window.localStorage.getItem('user_lang');
                    if(!lang) {
                        lang = 'en';
                    }
                    $('#crm_contact_person').mobiscroll('option', { lang: lang });

                    if(crm_details){
                        console.log('Marking selected contact person');
                        contact_i3d = crm_details.find('.crm-contact-person').data('contact_i3d');
                        if (contact_i3d) {
                            contact_i3d = parseInt(contact_i3d, 10);
                            $('#crm_contact_person').val(contact_i3d).change();
                            contact_person = $('#crm_contact_person option[value="'+contact_i3d+'"]').html();
                        }
                    }
                    else {
                        console.log('Did not select contact person');
                    }
                    load_contact_dropdown.resolve();
                }
            });

            $.when(load_employee_dropdown, load_contact_dropdown).done(function(){

                $('#new_edit_CRM_popup_overlay, #new_edit_CRM_popup').show();

                restore_crm_snapshot();
            });
        }
    });
                     
    $('#new_edit_CRM_popup_close, #crm_cancel').click(function(){ // #new_edit_CRM_popup_overlay outside popup
        $('#new_edit_CRM_popup_overlay, #new_edit_CRM_popup').hide();
    });

    $('#crm_submit').click(function(){
        console.log('CRM submit request');
                           
        var crm_i3d, crm_object, crm_object_i3d, crm_object_kind, crm_contact, full_name_contact_person, crm_type, crm_status, crm_short_description, crm_description, crm_receiver;
        var crm_due_date, crm_due_date_timestamp, crm_followup_date, crm_followup_date_timestamp;
        var crm_end_date_timestamp;
                           
        var crm_ticket = $('#crm_page .info_container.user_selected');
        var crm_details = $('#crm_ticket_details');
                           
        crm_type = $('input[name="crm_type"]:checked').val();
        if(typeof crm_type == 'undefined') {
            crm_type = window.localStorage.getItem("CurrentCrmType");
            window.localStorage.removeItem("CurrentCrmType");
            if(typeof crm_type == 'undefined' || crm_type == null) {
               $( "#crm_page .centron-alert-info" ).find('p').html(_('Please Select Type')).end().popup('open');
               return;
            }
        }
        crm_type = parseInt(crm_type, 10);
                           
        crm_short_description = $('#crm_short_description').val().trim();
        if(crm_short_description) {
            crm_short_description = strip_tags( crm_short_description );
        }
        if(!crm_short_description) {
            $( "#crm_page .centron-alert-info" ).find('p').html(_('Short Description')).end().popup('open');
            return;
        }

        crm_contact = $('#crm_contact_person').val();
        if(!crm_contact) {
            $( "#crm_page .centron-alert-info" ).find('p').html(_('Contact person')).end().popup('open');
            return;
        } else {
            crm_contact = parseInt(crm_contact, 10);
            full_name_contact_person = $('#crm_contact_person option[value="'+crm_contact+'"]').html();
        }

        if($("#crm_due_date").val().trim()) {
            crm_due_date = moment($("#crm_due_date").mobiscroll('getDate'));
            crm_due_date_timestamp = crm_due_date.valueOf();
        }
        else {
            if(1 === crm_type){
                $( "#crm_page .centron-alert-info" ).find('p').html(_('Date at')).end().popup('open');
                return;
            }
            else {
                $( "#crm_page .centron-alert-info" ).find('p').html(_('Due date')).end().popup('open');
                return;
            }
        }

        if(1 === crm_type){
            if($("#crm_end_date").val().trim()) {
                crm_end_date = moment($("#crm_end_date").mobiscroll('getDate'));
                crm_end_date_timestamp = crm_end_date.valueOf();
            }
            else {
                $( "#crm_page .centron-alert-info" ).find('p').html(_('End date')).end().popup('open');
                return;
            }
        }
        if($("#crm_followup_date").val().trim()){
            crm_followup_date = moment($("#crm_followup_date").mobiscroll('getDate'));
            crm_followup_date_timestamp = crm_followup_date.valueOf();
        }
        else {
            if(1 === crm_type){
                $( "#crm_page .centron-alert-info" ).find('p').html(_('Reminder')).end().popup('open');
                return;
            }
            else {
                $( "#crm_page .centron-alert-info" ).find('p').html(_('Resubmission')).end().popup('open');
                return;
            }
        }
                           
        crm_receiver = $('#crm_receiver_employee').val();
        if(!crm_receiver) {
            $( "#crm_page .centron-alert-info" ).find('p').html(_('To do by')).end().popup('open');
            return;
        } else {
            crm_receiver = parseInt(crm_receiver, 10);
        }
                           
        if(crm_edit_mode) {
            crm_object = crm_ticket.find('.crm-object-i3d');
            crm_object_i3d = crm_object.html();
            crm_object_i3d = parseInt(crm_object_i3d, 10);
        }
        else {
            crm_object_i3d = window.sessionStorage.getItem('CustomerSelected');
            crm_object_i3d = parseInt(crm_object_i3d, 10);
        }
                           
        if(typeof crm_object_i3d == 'undefined') {
            $( "#crm_page .centron-alert-info" ).find('p').html(_('Select Customer, please.')).end().popup('open');
            return;
        }

        crm_status = $('#crm_status').val();
        crm_status = parseInt(crm_status, 10);
                           
        var crm = {
            Name: crm_short_description,
            ContactPerson: crm_contact,
            FullNameContactPerson: full_name_contact_person,
            DueDate: '\/Date(' + crm_due_date_timestamp + get_time_offset() + ')\/',
            FollowUpDate: '\/Date(' + crm_followup_date_timestamp + get_time_offset() + ')\/',
            ReceiverEmployee: crm_receiver,
            ObjectI3D: crm_object_i3d,
            ObjectKind: 5000012,
            Type: crm_type,
            State: crm_status
        };

        crm_i3d = $('#new_edit_CRM_popup').attr('data-crm_i3d');
        if(crm_edit_mode && crm_i3d) {
            crm.I3D = crm_i3d;
        }
                           
        if(1 == crm_type){
            crm.EndDate = '\/Date(' + crm_end_date_timestamp + get_time_offset() + ')\/';
        }

        crm_description =  $('#crm_description').val().trim();
        if(crm_description) {
            crm_description = strip_tags( crm_description );
            crm_description = crm_description.replace(/(\r\n|\n|\r)/gm, ' ');
            crm.Description = crm_description;
        }

        if(crm_edit_mode) {
            var crm_creater = crm_details.find('.crm-creater-display-text');
                               
            var crm_creater_display_text = crm_creater.html();
            if(crm_creater_display_text) {
                crm.CreaterDisplayText = crm_creater_display_text;
            }

            var crm_creator = parseInt(crm_creater.data('crm-creator'), 10);
            if(crm_creator) {
                crm.Creator = crm_creator;
            }
                           
            //var email_message = crm_details.find('.crm-email-message').data('email_message');
            //if(email_message) {
            //    crm.EMailMessage = email_message;
            //}

            var crm_date_timestamp = crm_details.find('.crm-date').data('timestamp');
            if(crm_date_timestamp) {
                crm.Date = '\/Date(' + crm_date_timestamp + get_time_offset() + ')\/';
            }
        } else {
            var CurrentAppUserI3D = window.localStorage.getItem('CurrentAppUserI3D');
            CurrentAppUserI3D = parseInt(CurrentAppUserI3D, 10);
            crm.Creator = CurrentAppUserI3D;
                               
            var CurrentAppUserDisplayText = window.localStorage.getItem('CurrentAppUserDisplayText');
            crm.CreaterDisplayText = CurrentAppUserDisplayText;
                           
            //crm.EMailMessage = false;
        }

        console.log('Save mode Edit: '+ crm_edit_mode);

        var crm_response;
                           
        var login_ticket = window.localStorage.getItem('Ticket');
        var crm_param = {
            Ticket: login_ticket,
            Data: crm
        };
        service_request('SaveCRMActivity', crm_param).done(function(crm_response){

            if(0 === crm_response.Status){
                $('#new_edit_CRM_popup_overlay, #new_edit_CRM_popup').hide();
                $('#crm_ticket_details .close_ticket_details').click();
                if(crm_response.Result && crm_response.Result[0]) {
                    console.log('SaveCRMActivity: ' + crm_response.Result[0]);
                    window.setTimeout(function(){
                        $('#helpdesk_timers_page .info_container').remove();
                                      
                        var current_page = 1;
                        window.sessionStorage.setItem("crm_current_page", current_page);
                        var response;

                        $('#crm_ticket_list').html('');
                                      
                        var entries_per_page = window.localStorage.getItem('crm_record_limit');
                        var ticket = window.localStorage.getItem('Ticket');
                        var crm_param = {
                            Ticket: ticket,
                            Data: {
                                CRMActivityFilter: get_crm_filter_options(),
                                Sort: 'I3D',
                                descending: true,
                                entriesPerPage: entries_per_page,
                                page: current_page
                            }
                        };
                        var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
                        if(CustomerI3D) {
                            CustomerI3D = parseInt(CustomerI3D, 10);
                            crm_param.Data.CRMActivityFilter.CustomerI3D = CustomerI3D;
                        }
                        service_request('SearchCRMActivitiesThroughPaging', crm_param).done(function (response) {

                            if (0 === response.Status) {
                                create_crm_page(response);
                            }
                        });
                    }, 1000);
                }
            }
        });
    });
                     
    $( '.crm_type_container' ).on('change', 'input[name="crm_type"]', function(e){
        //New CRM
        if(!crm_edit_mode) {
            console.log('change in CRM type '+e.target.value);
            if(1 == e.target.value){
                $('.crm-end-date').addClass('time-schedule');
                var today_date_obj = new Date();
                $('#crm_end_date').mobiscroll('setDate', today_date_obj, true, 1000);
                               
                $('.crm-label-due-date').html(_('Date at'));
                $('.crm-label-followup-date').html(_('Reminder'));
            }
            else {
                $('.crm-end-date').removeClass('time-schedule');
                               
                $('.crm-label-due-date').html(_('Due date'));
                $('.crm-label-followup-date').html(_('Resubmission'));
            }
        }
        else {
            return false;
        }
    });
                     
    var lang = window.localStorage.getItem('user_lang');
    if(!lang) {
        lang = 'en';
    }
    $('#crm_receiver_employee').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });
    $('#crm_receiver_employee_dummy').click(function () {
        $('#crm_receiver_employee').mobiscroll('show');
        return false;
    });
                     
    $('#crm_contact_person').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });
    $('#crm_contact_person_dummy').click(function () {
        $('#crm_contact_person').mobiscroll('show');
        return false;
    });

});

$.mobile.document.on( "pagebeforeshow", "#crm_page", function() {
    textAreaAttributes();
    $('#crm_ticket_list').html('');
    $('#crm_ticket_details').html('');
                     
    var display_options = $('#crm_page .helpdesk_display_options');
                     
    if (display_options.hasClass('helpdesk_filter')) {
        display_options.css({ 'display': 'none' }).toggleClass('helpdesk_filter');
    }
    
    $('.crm_status_container .ui-slider-label-a').addClass('i18n');
    $('.crm_status_container .ui-slider-label-b').addClass('i18n');
    $('.crm_status_container .ui-slider-label-a').attr('data-i18n','Closed');
    $('.crm_status_container .ui-slider-label-b').attr('data-i18n','Open');

});

$.mobile.document.on( "pageshow", "#crm_page", function() {

    var current_page = 1;
    window.sessionStorage.setItem("crm_current_page", current_page);
    var response;
    
    var entries_per_page = window.localStorage.getItem('crm_record_limit');
    var ticket = window.localStorage.getItem('Ticket');
    var crm_param = {
        Ticket: ticket,
        Data: {
            CRMActivityFilter: get_crm_filter_options(),
            Sort: 'I3D',
            descending: true,
            entriesPerPage: entries_per_page,
            page: current_page
        }
    };
    var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
    if(CustomerI3D) {
        CustomerI3D = parseInt(CustomerI3D, 10);
        crm_param.Data.CRMActivityFilter.CustomerI3D = CustomerI3D;
    }
    service_request('SearchCRMActivitiesThroughPaging', crm_param).done(function (response) {

        if (0 === response.Status) {
            create_crm_page(response);
            //current_page = current_page;
            window.sessionStorage.setItem("crm_current_page", current_page);
            var LoadCRMWithNewCRM = window.sessionStorage.getItem('LoadCRMWithNewCRM');
            var LoadCRMWithEditCRM = window.sessionStorage.getItem('LoadCRMWithEditCRM');

            if (LoadCRMWithNewCRM) {
                console.log('Issuing New CRM...');
                $('#crm_page .new_crm').click();
                window.sessionStorage.removeItem("LoadCRMWithNewCRM");
            } else if (LoadCRMWithEditCRM) {
                var crmI3D = window.sessionStorage.getItem('crmI3D');
                if(crmI3D) {
                    $('#crm_ticket_list .info_container[data-ticketid="'+crmI3D+'"]').click();
                    
                }
            }
        }
    });
});
