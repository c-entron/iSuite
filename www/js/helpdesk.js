//tested on javascriptlint.com on 24 Jul 2014

function get_display_filter_options() {
    var HelpdeskFilter = {};

    var all_tickets = $('input[name="all_tickets"]:checked').val();
    
    var closed_tickets = $('input[name="closed_tickets"]:checked').length;
    
    var categories = $('#helpdesk_categories').mobiscroll('getValue');

    categories = categories.filter(function(val) { return val !== 0 && val !== null;});
    var category_depth = categories.length;
    if(category_depth) {
        var category_label = categories[category_depth-1];
        var category;
        if(category_label == '---' && category_depth > 1){
            category_label = categories[category_depth-2];
            category_parent_label = categories[category_depth-3];
            category = $('#helpdesk_categories li[data-val="'+category_parent_label+'"] ul li[data-val="'+category_label+'"]').data('id');
        } else {
            category = $('#helpdesk_categories li[data-val="'+category_label+'"]').data('id');
        }
        category = parseInt(category, 10);
        if(category) {
            HelpdeskFilter['Category'] = category;
        }
    }
    
    var state = $('#helpdesk_states').val();
    state = parseInt(state, 10);

    var editor = $('#helpdesk_editors').val();
    editor = parseInt(editor, 10);
    
    var editors = new Array();
    
    if ('my_tickets' == $('input[name="all_tickets"]:checked').val()) {
        var CurrentAppUserI3D = window.localStorage.getItem("CurrentAppUserI3D");
        CurrentAppUserI3D = parseInt(CurrentAppUserI3D, 10);
        editors.length = 0;
        editors.push(CurrentAppUserI3D);
    } else {
        if (parseInt(editor, 10)) {
            editors.push(editor);
        }
    }
    
    if (editors && editors.length > 0) {
        HelpdeskFilter['EditorI3Ds'] = editors;
    }
    if (closed_tickets) {
        HelpdeskFilter['OnlyActive'] = false;
    }
    else {
        HelpdeskFilter['OnlyActive'] = true;
    }
    if (parseInt(state, 10)) {
        HelpdeskFilter['HelpdeskState'] = state;
    }
    return HelpdeskFilter;
}

var toggle_helpdesk_display_options = function () {
    console.log('Toggling Display/Filter Options');
    if ($('.helpdesk_display_options').hasClass('helpdesk_filter')) {
        
        $('.helpdesk_display_options').css({
            'display': 'none'
        });
        
    } else {
        
        $('.helpdesk_display_options').css({
            'display': 'block'
        });

        $('#helpdesk_page .ticket_details').removeClass('active_ticket_detail').hide();
    }
    $('.helpdesk_display_options').toggleClass('helpdesk_filter');
};

function discard_bad_mdl(element) {
    if(element.I3D && (element.Caption || element.Caption)) {
        return true;
    } else {
        return false;
    }
}

//creates a helpdesk page of tickets and their corresponding details
//18 Dec 2013
var create_helpdesk_page = function (response) {

    var i, result;
    $.each(response.Result, function (i, result) {
        if(result && result.Count && result.CurrentPage && result.PageCount && result.Result) {
           
            console.log('Showing Tickets: ' + result.Result.length);
            console.log('Count/Total Tickets: ' + result.Count);
            console.log('CurrentPage: ' + result.CurrentPage);
            console.log('PageCount/Total Pages: ' + result.PageCount);

            var content = '';
            var content_details = '';

            $.each(result.Result, function (j, helpdesk) {
                if(helpdesk && helpdesk.I3D && helpdesk.CustomerI3D && helpdesk.CustomerName) {
                    //var CreatedBy = helpdesk.CreatedBy;

                    var editor_string = '';
                    if(helpdesk.Editors) {
                        $.each(helpdesk.Editors, function (k, editor) {
                            if(editor && editor.DisplayText) {
                                var editor_display_text = editor.DisplayText;
                                if (0 === editor_string.length) {
                                    if(editor_display_text){
                                        editor_string += editor_display_text;
                                    }
                                }
                                else {
                                    editor_string += '<br>' + editor_display_text;
                                }
                            }
                        });
                    }

                    var due_date_string = '';
                    if(helpdesk.DueDate) {

                        var due_date = moment( helpdesk.DueDate );
                        var due_timestamp = due_date.valueOf();
                        due_date_string = due_date.format("DD.MM.YYYY HH:mm");
                    }
                       
                    var created_timestamp, created_date, created_date_string = '', duration_hours = 0;
                    if(helpdesk.CreatedDate) {

                        created_date = moment( helpdesk.CreatedDate );
                        created_date_string = created_date.format("DD.MM.YYYY HH:mm");
                        created_timestamp = created_date.valueOf();
                        duration_hours = parseInt((due_timestamp - created_timestamp) / 3600000, 10);
                    }
                    var planned_duration = helpdesk.PlannedDurationInHours;
                    if(!isNumber(planned_duration)) {
                        planned_duration = '0';
                    }
                    content += '<li class="info_container helpdesk_ticket" data-ticketid="'+helpdesk.I3D+'" data-planned_duration="'+planned_duration+'">';

                    content += '<div class="col1"><div class="padder">';
                    content += '<div class="date normal_text">' + due_date_string + '</div>';

                    var priority_caption = helpdesk.HelpdeskPriorityCaption;
                    if (!priority_caption) {
                        priority_caption = '';
                    }
                    content += '<div class="priority_caption normal_text">' + priority_caption + '</div>';
                       
                    var status_caption = helpdesk.HelpdeskStatusCaption;
                    if(!status_caption) {
                       status_caption = '';
                    }
                    content += '<div class="status_caption normal_text">' + status_caption + '</div>';
                    content += '</div></div><!--.padder--><!--.col1-->';

                    content += '<div class="col2"><div class="padder">';

                    content += '<div class="short_description">';
                    var hd_short_description = helpdesk.ShortDescription;
                    if (!hd_short_description) {
                        hd_short_description = '';
                    }

                    content += '<div class="short_description_text subhead_text">' + hd_short_description + '</div>';
                    var helpdesk_mumber = helpdesk.Number;
                    if(!isNumber(helpdesk_mumber) ) {
                        helpdesk_mumber = 0;
                    }
                    content += '<div class="hd_number subhead_text">' + helpdesk_mumber + '</div>';
                    content += '<div class="helpdeskI3D">' + helpdesk.I3D + '</div>';
                    var contact_title = helpdesk.ContactTitle;
                    if(!contact_title) {
                        contact_title = '';
                    } else {
                        contact_title = contact_title + '&nbsp;';
                    }
                    content += '<div class="helpdeskContactTitle">' + contact_title + '</div>';
                    var contact_name = helpdesk.ContactName;
                    if(!contact_name) {
                        contact_name = '';
                    }
                    content += '<div class="helpdeskContactName">' + contact_name + '</div>';
                    content += '<div class="cb"></div>';
                    content += '</div><!--.short_description-->';

                    content += '<div class="customer subhead_text">' + helpdesk.CustomerName + '</div>';

                    var hd_description = helpdesk.Description;
                    if(!hd_description) {
                       hd_description = '';
                    }
                    content += '<div class="description normal_text">' + hd_description + '</div>';

                    content += '</div></div><!--.padder--><!--.col2--><div class="cb"></div>';

                    //following are details of a helpdesk ticket shown to user on request
                    content_details += '<li class="ticket_details" data-ticketid="' + helpdesk.I3D + '">';
                    content_details += '<div class="close_ticket_details icon-cancel"  data-ticketid="' + helpdesk.I3D + '"></div>';
                       
                    var short_description = helpdesk.ShortDescription;
                    if(!short_description) {
                        short_description = '&nbsp;';
                    }
                    content_details += '<h2 class="headline_text"><span class="hd_short_desc">' + short_description + '</span> | ' + helpdesk_mumber + '</h2>';

                    content_details += '<h2 class="headline_text">' + _('Due on')+' ' + due_date_string + ', '+_('Record by')+' <span class="created_by_display_text"></span><span class="normal_text"> (at ' + created_date_string + ')' + '</span></h2>';

                    content_details += '<p class="normal_text hd_description"><strong>' + hd_description + '</strong></p>';

                    content_details += '<div class="normal_text">';

                    content_details += '<div class="ticket_details_col_1">';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label">'+_('Number')+'</div>';
                    content_details += '<div class="field_value helpdesk_number">' + helpdesk_mumber + '</div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label">'+_('State')+'</div>';
                       
                    var hd_status_caption = helpdesk.HelpdeskStatusCaption;
                    if(!hd_status_caption) {
                       hd_status_caption = '';
                    }

                    var statusI3D = helpdesk.HelpdeskStatusI3D;
                    if(!isNumber(statusI3D)) {
                        statusI3D = 0;
                    }
                    content_details += '<div class="field_value hd_status" data-hd_status_i3d="' + statusI3D + '">' + hd_status_caption + '</div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label i18n" data-i18n="Due on">'+_('Due on')+'</div>';
                    content_details += '<div class="field_value hd_due_date" data-duration_hours="' + duration_hours + '" data-due_timestamp="' + due_timestamp + '">' + due_date_string + '</div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label">'+_('Record on')+'</div>';
                    content_details += '<div class="field_value">' + created_date_string + '</div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label i18n" data-i18n="Priority">'+_('Priority')+'</div>';
                   
                    var priorityI3D = helpdesk.HelpdeskPriorityI3D;
                    if(!isNumber(priorityI3D)) {
                        priorityI3D = 0;
                    }

                    content_details += '<div class="field_value"><label class="priority" data-hd_priority_i3d="' + priorityI3D + '">' + priority_caption + '</label></div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label i18n" data-i18n="Type">'+_('Type')+'</div>';
                    content_details += '<div class="field_value hd_type" ></div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label">'+_('Main category')+'</div>';
                    content_details += '<div class="field_value"><label class="main_cat"></label></div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label">'+_('Sub category')+'</div>';
                    content_details += '<div class="field_value"><label class="sub_cat"></label></div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label">'+_('Sub category2')+'</div>';
                    content_details += '<div class="field_value"><label class="sub_cat2"></label></div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label i18n" data-i18n="Contract">'+_('Contract')+'</div>';
                    content_details += '<div class="field_value"><label class="contract"></label></div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label i18n" data-i18n="Master data list">'+_('Master data list')+'</div>';
                    content_details += '<div class="field_value"><label class="master-data-list"></label></div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label i18n" data-i18n="Responsible">'+_('Responsible')+'</div>';
                    content_details += '<div class="field_value"><label class="responsible"></label></div></div>';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_label">'+_('Editor')+'</div>';
                    content_details += '<div class="field_value">' + editor_string + '</div></div>';

                    content_details += '</div><!--.ticket_details_col_1-->';
                    content_details += '<div class="ticket_details_col_2">';

                    content_details += '<div class="ticket_details_field field_contact_person">';
                    content_details += '<strong class="i18n" data-i18n="Contact person">'+_('Contact person')+'</strong>';

                    content_details += '<div>' + contact_title + contact_name + '</div>';

                    content_details += '<div><label class="email1"></label></div>';

                    content_details += '</div>';

                    content_details += '<div class="ticket_details_field field_contacts">';
                    content_details += '<div class="field_label i18n" data-i18n="Phone">'+_('Phone')+'</div>';
                    content_details += '<div class="field_value"><label class="phoneBusiness1"></label></div></div>';

                    content_details += '<div class="ticket_details_field field_contacts contact_email">';
                    content_details += '<div class="field_label">'+_('E-Mail')+'</div>';
                    content_details += '<div class="field_value"><label class="email1"></label></div></div>';

                    content_details += '<div class="ticket_details_field field_customer">';
                    content_details += '<strong class="i18n" data-i18n="Customer">'+_('Customer')+'</strong>';
                    var CustomerI3D = helpdesk.CustomerI3D;
                    if(!isNumber(CustomerI3D)) {
                        CustomerI3D = 0;
                    }
                    var addressI3D = helpdesk.AddressI3D;
                    if(!isNumber(addressI3D)) {
                        addressI3D = 0;
                    }
                    content_details += '<div><span class="CustomerI3D" data-address_i3d="' + addressI3D + '"> ' + CustomerI3D + '</span></div>';

                    var CustomerName = helpdesk.CustomerName;
                    if(!CustomerName) {
                        CustomerName = '';
                    }
                    content_details += '<div class="customer-name">' + CustomerName + '</div>';
                       
                    var CustomerStreet = helpdesk.CustomerStreet;
                    if(!CustomerStreet) {
                        CustomerStreet = '';
                    }
                    content_details += '<div class="CustomerStreet">' + CustomerStreet + '</div>';
                       
                    var CustomerCity = helpdesk.CustomerCity;
                    if(!CustomerCity) {
                        CustomerCity = '';
                    }
                       
                    var CustomerZip = helpdesk.CustomerZip;
                    if(!CustomerZip) {
                        CustomerZip = '';
                    }
                    
                    content_details += '<div><span class="CustomerZip">' + CustomerZip + '&nbsp;</span><span class="CustomerCity">' + CustomerCity + '</span></div>';
                    content_details += '<div><span class="customer_email"></span></div>';
                    content_details += '</div>';

                    content_details += '</div><!--.ticket_details_col_2-->';
                    content_details += '<div class="ticket_details_col_3">';

                    content_details += '<div class="ticket_details_field">';
                    content_details += '<div class="field_value ContactPersonImage">';
                    content_details += '<div class="customer_photo"><img src="img/user_photo.png" /></div>';
                    var adressContactI3D = helpdesk.AdressContactI3D;
                    if(!isNumber(adressContactI3D)) {
                        adressContactI3D = 0;
                    }
                    content_details += '<span class="AdressContactI3D">' + adressContactI3D + '</span></div></div>';

                    content_details += '<div class="ticket_details_field field_route">';
                    content_details += '<label class="route_label"><strong>Route</strong></label>';
                    content_details += '<div class="route"></div>';
                    content_details += '</div>';

                    content_details += '</div><!--.ticket_details_col_3-->';

                    content_details += '</div><!--.normal_text-->';
                    content_details += '</li><!--.ticket_details-->';

                    content += '</li><!--.info_container.helpdesk_ticket-->';
                }
            });

            content += '<li class="cb"></li>';
            $('#helpdesk_ticket_list').find('.cb').remove();
            $('#helpdesk_ticket_list').append(content);

            //Don’t show Pull up/Pull down if respone is empty
            if (result.Count) {
                $('#pullUp').show();
            }
            myHelpdeskScroll.refresh();

            //fill in tickets details too
            $('#helpdesk_ticket_details').append(content_details);
        }
    });
};

/*load contact from_address*/
function load_contact_from_address(address_i3d) {
    
    var login_ticket = window.localStorage.getItem('Ticket');
    var address_param = {
        Ticket: login_ticket,
        Data: {
            AddressI3D: address_i3d,
            OnlyActive: true
        }
    };
    return service_request('GetContactsFromAddress', address_param).done(function (response) {
        if (0 === response.Status) {
            var result, hd_contact = '';
            var contact_firstname, contact_lastname, salutation, phoneBusiness1, faxOnBusiness, eMail1, contact_i3d;
            var default_contact_found = false;
            $.each(response.Result, function (i, contact) {
              if(contact && contact.I3D) {
                 salutation = (contact.Salutation) ? contact.Salutation.Salutation : '';
                 if(!salutation){
                   salutation = '';
                 }
                 contact_firstname = contact.Firstname;
                 contact_firstname = contact_firstname ? contact_firstname : '';
                 contact_lastname = contact.Lastname;
                 contact_lastname = contact_lastname ? contact_lastname : '';
                 phoneBusiness1 = contact.PhoneBusiness1;
                 if(!phoneBusiness1) {
                   phoneBusiness1 = '';
                 }
                 faxOnBusiness = contact.FaxOnBusiness;
                 if(!faxOnBusiness) {
                   faxOnBusiness = '';
                 }
                 eMail1 = contact.EMail1;
                 if(!eMail1) {
                   eMail1 = '';
                 }
                 contact_i3d = contact.I3D;
                 
                 hd_contact += '<option value="' + contact_i3d + '" data-contact_salutation="' + salutation + '">' + contact_firstname + ' ' + contact_lastname + '</option>';
                 console.log('Address change, loading contact...'+contact_firstname+contact_lastname);
             }
            });
            $('#hd_contact').html(hd_contact);
            var lang = window.localStorage.getItem('user_lang');
            if(!lang) {
              lang = 'en';
            }
            $('#hd_contact').mobiscroll('init');
            $('#hd_contact').mobiscroll('option', { disabled: false, lang: lang });
            $('#hd_phone').val(phoneBusiness1);
            $('#hd_fax').val(faxOnBusiness);
            $('#hd_email').val(eMail1);
        }
      return false;
    });
}
/*
var translate_filter_labels = function(){
    $('.helpdesk_display_options').removeClass('helpdesk_filter');
    console.log('Translate filter lables...');
    var category, category_selector;
               
    category_selector = $('#helpdesk_categories > li:first-child > a');
    category = category_selector.html();

    if (typeof category !== "undefined") {
        $('#category_opener').html(_('Select all'));
        category_selector.html(_('Select all'));
    }

};
*/

function restore_helpdesk_snapshot() {
	console.log('Recovering Helpdesk State...');
	var details = window.sessionStorage.getItem('AppSnapshot');
	window.sessionStorage.removeItem('AppSnapshot');
	if(details) {
		var param = JSON.parse(details);

		var state_data = param.Data;
		if(Object.keys(state_data).length) {
			var short_description = state_data.ShortDescription;
			if(short_description) {
				$('#hd_shortDescription').val(short_description);
			}

			var description = state_data.Description;
			if(description) {
				$('#hd_description').val(description);
			}

			var duration = state_data.PlannedDurationInHours;
			if(duration) {
				$('#hd_duration').val(duration);
			}

			var due_timestamp = state_data.DueDate;
			console.log('DueDate: '+due_timestamp);

			if(due_timestamp) {
				var due_date_obj = moment(due_timestamp);
				$('#hd_date').mobiscroll('setDate', due_date_obj.toDate(), true, 1000);
			}
            if(state_data.ResponsiblePerson) {
                var responsiblePersonI3D = state_data.ResponsiblePerson.I3D;
                if(responsiblePersonI3D) {
                    responsiblePersonI3D = parseInt(responsiblePersonI3D, 10);
                    $('#hd_responsibility').val(responsiblePersonI3D).change();
                }
            }
			var helpdeskStatusI3D = state_data.HelpdeskStatusI3D;
            helpdeskStatusI3D = parseInt(helpdeskStatusI3D, 10);
			if(helpdeskStatusI3D) {
				
				$('#hd_status').val(helpdeskStatusI3D).change;
			}

			var helpdeskPriorityI3D = state_data.HelpdeskPriorityI3D;
            helpdeskPriorityI3D = parseInt(helpdeskPriorityI3D, 10);
			if(helpdeskPriorityI3D) {
				
				$('#hd_priority').val(helpdeskPriorityI3D).change();
			}

			var helpdeskTypeI3D = state_data.HelpdeskType.I3D;
            helpdeskTypeI3D = parseInt(helpdeskTypeI3D, 10);
			if(helpdeskTypeI3D) {
				
				$('#hd_type').val(helpdeskTypeI3D).change();
			}

			var categories = [];
			var mainCategoryI3D_label = state_data.MainCategoryCaption;
			if(mainCategoryI3D_label) {
				categories.push(mainCategoryI3D_label);
			}
			var subCategory1I3D_label = state_data.SubCategory1Caption;
			if(mainCategoryI3D_label && subCategory1I3D_label) {
				categories.push(subCategory1I3D_label);
			}
			var subCategory2I3D_label = state_data.SubCategory2Caption;
			if(mainCategoryI3D_label && subCategory1I3D_label && subCategory2I3D_label) {
				categories.push(subCategory2I3D_label);
			}
			if(categories.length) {
				$('#hd_category').mobiscroll('setValue', categories, true);
                $('#hd_category_dummy').val(categories);
			}

			var contractId = state_data.ContractId;
            contractId = parseInt(contractId, 10);
			if(contractId) {

				$('#hd_contract').val(contractId).change();
			}

			var addressI3D = state_data.AddressI3D;
            addressI3D = parseInt(addressI3D, 10);
			if(addressI3D) {

				$('#hd_address').val(addressI3D).change();
			}

            var intervalID = window.setInterval(function(){
                var xhr_length = $.xhrPool.length;
                console.log('Remaining XHR operations: ' + xhr_length);
                if(xhr_length == 0) {
                    var deviceHeadI3D = state_data.DeviceHeadI3D;
                    deviceHeadI3D = parseInt(deviceHeadI3D, 10);
                    if(deviceHeadI3D) {

                        $('#master_data_list').val(deviceHeadI3D).change();
                    }
                                                
                    var phone = state_data.ContactTelephoneNumber;
                    if(phone) {
                        $('#hd_phone').val(phone);
                        console.log('Recovered phone: ' + phone);
                    }
                    
                    var ContactEmail = state_data.ContactEmail;
                    if(ContactEmail) {
                        $('#hd_email').val(ContactEmail);
                    }
                    window.clearInterval(intervalID);
                }
            }, 1000);
		}
	}
}

$(document).on('pagebeforeshow', '#helpdesk_page', function (event) {
    textAreaAttributes();
    $('#helpdesk_page .action_button_container .button').addClass('disabled');

    console.log('Hide Display/Filter Options');
    $('.helpdesk_display_options').css({
        'display': 'none'
    });
    $('.helpdesk_display_options').removeClass('helpdesk_filter');
});

$(document).on('pageshow', '#helpdesk_page', function (event) {
    var lang = window.localStorage.getItem('user_lang');
    if(!lang) {
        lang = 'en';
    }
    if(!window.sessionStorage.getItem('session_active')) {
        load_static_parameters().done(function(){
            //translate_filter_labels();
            $('#helpdesk_categories').mobiscroll('init');
            $('#helpdesk_categories').val('Select all');
            $('#helpdesk_categories li[data-id="0"]').html(_('Select all'));
            $('#helpdesk_categories').mobiscroll('option', { lang: lang });
            $('#helpdesk_categories_dummy').attr('placeholder', _('Select all'));

            $('#hd_category').mobiscroll('init');
            $('#hd_category').mobiscroll('option', { lang: lang });

            $('#helpdesk_states').mobiscroll('init');
            $('#helpdesk_states').val(0);
            $('#helpdesk_states option[value="0"]').html(_('Select all'));
            $('#helpdesk_states_dummy').val(_('Select all'));
            $('#helpdesk_states').mobiscroll('option', { lang: lang });

            $('#status_after_forwarding').mobiscroll('init');
            $('#status_after_forwarding').mobiscroll('option', { lang: lang });

            $('#helpdesk_editors').mobiscroll('init');
            $('#helpdesk_editors').val(0);
            $('#helpdesk_editors option[value="0"]').html(_('Select all'));
            $('#helpdesk_editors_dummy').val(_('Select all'));
            $('#helpdesk_editors').mobiscroll('option', { lang: lang });
        });
    }
    else {
        $('#helpdesk_categories').mobiscroll('init');
        $('#helpdesk_categories').val('Select all');
        $('#helpdesk_categories li[data-id="0"]').html(_('Select all'));
        $('#helpdesk_categories').mobiscroll('option', { lang: lang });
        $('#helpdesk_categories_dummy').attr('placeholder', _('Select all'));

        $('#hd_category').mobiscroll('init');
        $('#hd_category').mobiscroll('option', { lang: lang });

        $('#helpdesk_states').mobiscroll('init');
        $('#helpdesk_states').val(0);
        $('#helpdesk_states option[value="0"]').html(_('Select all'));
        $('#helpdesk_states_dummy').val(_('Select all'));
        $('#helpdesk_states').mobiscroll('option', { lang: lang });

        $('#status_after_forwarding').mobiscroll('init');
        $('#status_after_forwarding').mobiscroll('option', { lang: lang });

        $('#helpdesk_editors').mobiscroll('init');
        $('#helpdesk_editors').val(0);
        $('#helpdesk_editors option[value="0"]').html(_('Select all'));
        $('#helpdesk_editors_dummy').val(_('Select all'));
        $('#helpdesk_editors').mobiscroll('option', { lang: lang });
    }


    $( 'input[name="all_tickets"][value="all_tickets"]' ).prop( "checked", false ).checkboxradio( "refresh" );
    $( 'input[name="all_tickets"][value="my_tickets"]' ).prop( "checked", true ).checkboxradio( "refresh" );

    $( '#closed_tickets' ).prop( "checked", false ).checkboxradio( "refresh" );

    var HelpdeskFilter = {
        "OnlyActive": true
    };

    if ( window.sessionStorage.getItem('CustomerSelected')) {
        console.log('Customer found');
        $('.new_helpdesk').removeClass('no-customer disabled');
        $( 'input[name="all_tickets"][value="all_tickets"]' ).prop( "checked", true ).checkboxradio( "refresh" );
        $( 'input[name="all_tickets"][value="my_tickets"]' ).prop( "checked", false ).checkboxradio( "refresh" );
    } else {
        console.log('Customer not found');
        $('.new_helpdesk').addClass('no-customer');
    }

    $('#helpdesk_ticket_list').html('');
    $('#helpdesk_ticket_details').html('');

    HelpdeskFilter = get_display_filter_options();
    var current_page = 1;
    var login_ticket = window.localStorage.getItem('Ticket');
    var entries_per_page = window.localStorage.getItem('helpdesk_record_limit');
    var helpdesk_param = {
        Ticket: login_ticket,
        Data: {
            Descending: true,
            EntriesPerPage: entries_per_page,
            HelpdeskFilter: HelpdeskFilter,
            Page: current_page,
            Sort: 1
        }
    };
    var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
    if(CustomerI3D) {
        CustomerI3D = parseInt(CustomerI3D, 10);
        helpdesk_param.Data.HelpdeskFilter.CustomerI3D = CustomerI3D;
    }
    service_request('GetHelpdesksThroughPaging', helpdesk_param).done(function (response) {

        if (0 === response.Status) {
            create_helpdesk_page(response);
            $('#pullUp').show();

            var intervalID = window.setTimeout(function(){
                var LoadHelpdeskWithNewHelpdesk = window.sessionStorage.getItem('LoadHelpdeskWithNewHelpdesk');
                var LoadHelpdeskWithEditHelpdesk = window.sessionStorage.getItem('LoadHelpdeskWithEditHelpdesk');

                if (LoadHelpdeskWithNewHelpdesk && !($('#helpdesk_page .button.new_helpdesk').hasClass('disabled'))) {
                    $('#helpdesk_page .new_helpdesk').click();
                    window.sessionStorage.removeItem("LoadHelpdeskWithNewHelpdesk");

                } else if (LoadHelpdeskWithEditHelpdesk) {
                    var helpdeskI3D = window.sessionStorage.getItem('helpdeskI3D');
                    if(helpdeskI3D) {
                        var target_ticket = $('#helpdesk_ticket_list .info_container[data-ticketid="'+helpdeskI3D+'"]');
                        if(target_ticket.length) {
                            target_ticket.click();
                        } else {
                            console.log('Helpdesk not found: ' + helpdeskI3D);
                            /*If the ticket is not
                            Requests to following services are to be made:
                            GetHelpdeskByI3D
                            GetCustomerByI3D
                            GetDeviceLinks
                            GetContactsFromAddress
                            GetContractsByCustomerI3D
                            GetAddressesFromCustomer
                            GetAddressByI3D
                            SearchMasterDataListsThroughPaging
                            */
                            var login_ticket = window.localStorage.getItem('Ticket');
                            var helpdesk_param = {
                                Ticket: login_ticket,
                                Data: helpdeskI3D
                            }
                            service_request('GetHelpdeskByI3D', helpdesk_param).done(function(response){
                                var helpdesk = response.Result[0];
                                if(Object.keys(helpdesk).length) {
                                   console.log('Helpdesk: '+JSON.stringify(helpdesk));
                                    window.sessionStorage.setItem('NewHelpdesk', 'false');
                                    $('#new_edit_HD_popup').data('helpdeski3d', helpdeskI3D);
                                                                                         
                                    var helpdesk_number = helpdesk.Number;
                                    helpdesk_number = parseInt(helpdesk_number, 10);
                                    if(helpdesk_number) {
                                        $('.new_edit_HD_help_desk_heading').html(_('Edit Ticket')).append('<span class="hd_number">' + helpdesk_number + '</span>');
                                    }
                                                                                     
                                    var due_date_obj = moment(helpdesk.DueDate);
                                    $('#hd_date').mobiscroll('setDate', due_date_obj.toDate(), true, 1000);
                                                                                     
                                    var duration_hours = helpdesk.PlannedDurationInHours;
                                    duration_hours = parseInt(duration_hours, 10);
                                    if(duration_hours) {
                                        $('#hd_duration').val(duration_hours);
                                    }

                                    var short_description = helpdesk.ShortDescription;
                                    $('#hd_shortDescription').val(short_description);

                                    var description = helpdesk.Description;
                                    $('#hd_description').val(description);
                                                                                     
                                    var lang = window.localStorage.getItem('user_lang');

                                    $('#hd_responsibility').mobiscroll('option', { disabled: false, lang: lang });
                                    if(helpdesk.ResponsiblePerson) {
                                        var ResponsiblePersonI3D = helpdesk.ResponsiblePerson.I3D;
                                        ResponsiblePersonI3D = parseInt(ResponsiblePersonI3D, 10);
                                        if(ResponsiblePersonI3D) {
                                            $('#hd_responsibility').val(ResponsiblePersonI3D).change();
                                        }
                                    }

                                    $('#hd_status').mobiscroll('option', { disabled: false, lang: lang });
                                    var HelpdeskStatusI3D = helpdesk.HelpdeskStatusI3D;
                                    HelpdeskStatusI3D = parseInt(HelpdeskStatusI3D, 10);
                                    if(HelpdeskStatusI3D) {
                                        $('#hd_status').val(HelpdeskStatusI3D).change();
                                    }

                                    $('#hd_priority').mobiscroll('option', { disabled: false, lang: lang });
                                    var HelpdeskPriorityI3D = helpdesk.HelpdeskPriorityI3D;
                                    HelpdeskPriorityI3D = parseInt(HelpdeskPriorityI3D, 10);
                                    if(HelpdeskPriorityI3D) {
                                        $('#hd_priority').val(HelpdeskPriorityI3D).change();
                                    }

                                    $('#hd_type').mobiscroll('option', { disabled: false, lang: lang });
                                    var HelpdeskTypeI3D = helpdesk.HelpdeskTypeI3D;
                                    HelpdeskTypeI3D = parseInt(HelpdeskTypeI3D, 10);
                                    if(HelpdeskTypeI3D) {
                                        $('#hd_type').val(HelpdeskTypeI3D).change();
                                    }

                                    $('#hd_category').mobiscroll('option', { disabled: false, lang: lang });
                                    var categories = [];
                                    var MainCategoryI3D = helpdesk.MainCategoryI3D;
                                    MainCategoryI3D = parseInt(MainCategoryI3D, 10);
                                    if(MainCategoryI3D) {
                                        var MainCategoryCaption = helpdesk.MainCategoryCaption;
                                        categories.push(MainCategoryCaption);
                                        console.log('MainCategory: '+MainCategoryI3D+' '+MainCategoryCaption);
                                    }

                                    var SubCategory1I3D = helpdesk.SubCategory1I3D;
                                    if(MainCategoryI3D && SubCategory1I3D) {
                                        var SubCategory1Caption = helpdesk.SubCategory1Caption;
                                        categories.push(SubCategory1Caption);
                                        console.log('SubCategory1: '+SubCategory1I3D+' '+SubCategory1Caption);
                                    }

                                    var SubCategory2I3D = helpdesk.SubCategory2I3D;
                                    if(MainCategoryI3D && SubCategory1I3D && SubCategory2I3D) {
                                        var SubCategory2Caption = helpdesk.SubCategory2Caption;
                                        categories.push(SubCategory2Caption);
                                        console.log('SubCategory2: '+SubCategory2I3D+' '+SubCategory2I3D);
                                    }
                                    console.log('Categories: '+categories);
                                    if(categories.length) {
                                        $('#hd_category').mobiscroll('setValue', categories, true);
                                        $('#hd_category_dummy').val(categories);
                                    }

                                    var CustomerI3D = helpdesk.CustomerI3D;
                                    CustomerI3D = parseInt(CustomerI3D, 10);
                                    $('#customerI3D').val(CustomerI3D);

                                    var login_ticket = window.localStorage.getItem('Ticket');
                                    var contract_param = {
                                        Ticket: login_ticket,
                                        Data: CustomerI3D
                                    };

                                    var contracts_dfd = $.Deferred();
                                    service_request('GetContractsByCustomerI3D', contract_param).done(function (response) {

                                        if (0 === response.Status) {
                                            var result;
                                            var hd_contract = '';
                                            var ContractKind;
                                            if(response.Result) {
                                                //var default_contract = response.Result.filter(function (result) { return result.IsGeneralAgreement == 1; });

                                                var lang = window.localStorage.getItem('user_lang');
                                                if(!lang) {
                                                    lang = 'en';
                                                }
                                                //if(default_contract.length && Array.isArray(default_contract)) {
                                                //    console.log('Default Contract');
                                                //    $('#hd_contract').html('');
                                                //    result = default_contract[0];
                                                //    if(result) {
                                                //        ContractKind = result.ContractKind;

                                                //        if(ContractKind && ContractKind.Name && ContractKind.Description){
                                                //            var contract_label = ContractKind.Name +  '-' + ContractKind.Description;

                                                //            hd_contract += '<option value="'+result.I3D+'">'+ contract_label +'</option>';
                                                //            $('#hd_contract').html(hd_contract);
                                                //            $('#hd_contract').mobiscroll('init');
                                                //            $('#hd_contract').mobiscroll('option', { disabled: true, lang: lang });
                                                //        }
                                                //    }
                                                //} else {
                                                    if(response.Result.length) {
                                                        $.each(response.Result, function (i, result) {
                                                            if(result && result.I3D && result.ContractKind) {
                                                                ContractKind = result.ContractKind;
                                                                if(ContractKind && ContractKind.Name && ContractKind.Description){
                                                                    hd_contract += '<option value="'+result.I3D+'">'+ContractKind.Name +  '-' + ContractKind.Description+'</option>';
                                                                }
                                                                else {
                                                                    console.log('Contract: Name & Description not found');
                                                                }
                                                            }
                                                        });
                                                        $('#hd_contract').html('<option>---</option>' + hd_contract);
                                                        $('#hd_contract').mobiscroll('init');
                                                        $('#hd_contract').mobiscroll('option', { disabled: false, lang: lang });
                                                    } else {
                                                        $('#hd_contract').html('');
                                                        $('#hd_contract').mobiscroll('option', { disabled: true });
                                                    }
                                                //}
                                            }
                                        }
                                        else {
                                            $('#hd_contract').html('');
                                            $('#hd_contract').mobiscroll('option', { disabled: true });
                                        }
                                        contracts_dfd.resolve();
                                    });
                                                                                     
                                    var ContractId = helpdesk.ContractId;
                                    ContractId = parseInt(ContractId, 10);
                                    if(ContractId) {
                                        $.when(contracts_dfd).done(function(){
                                            $('#hd_contract').val(ContractId).change();
                                        });
                                    }

                                    var CustomerName = helpdesk.CustomerName;
                                    $('#customer_name').val(CustomerName);

                                    var address_param = {
                                        Ticket: login_ticket,
                                        Data: {
                                            CustomerI3D: CustomerI3D,
                                            OnlyActive: true
                                        }
                                    };
                                    var address_dfd = $.Deferred();
                                    service_request('GetAddressesFromCustomer', address_param).done(function(response){

                                        if(0 === response.Status) {
                                            var result, hd_address = '';
                                            $.each(response.Result, function (i, result) {
                                                if(result && result.I3D && result.City && result.Zip && result.Street) {
                                                    hd_address += '<option value="'+result.I3D+'"><span class="addr_city">'+result.City + '</span> <span class="addr_zip">' + result.Zip + '</span> (<span class="addr_street">' + result.Street + '</span>)'+'</option>';
                                                }
                                            });
                                            $('#hd_address').html(hd_address);
                                            $('#hd_address').mobiscroll('init');

                                            if(!lang) {
                                                lang = 'en';
                                            }
                                            $('#hd_address').mobiscroll('option', { lang: lang });
                                        }
                                        address_dfd.resolve();
                                    });

                                    var contacts_dfd = $.Deferred();
                                    var addressI3D = helpdesk.AddressI3D;
                                    load_contact_from_address(addressI3D).done(function () {
                                        console.log('finished loading contact from address');
                                        $('#hd_contact').mobiscroll('init');
                                        var lang = window.localStorage.getItem('user_lang');
                                        if(!lang) {
                                            lang = 'en';
                                        }
                                        $('#hd_contact').mobiscroll('option', { lang: lang });
                                        contacts_dfd.resolve();
                                    });

                                    $.when(contracts_dfd, address_dfd, contacts_dfd).done(function(){

                                        var ContactTelephoneNumber = helpdesk.ContactTelephoneNumber;
                                        $('#hd_phone').val(ContactTelephoneNumber);
                                                              
                                        var ContactEmail = helpdesk.ContactEmail;
                                        $('#hd_email').val(ContactEmail);
                                                              
                                        $('#hd_cancel').html(_('Cancel'));
                                        $('#hd_submit').html(_('Save'));
                                        $('#hd_cancel, #hd_submit').button('refresh');
                                                                                         
                                        restore_helpdesk_snapshot()
                                        $('#new_edit_HD_popup_overlay, #new_edit_HD_popup').show();
                                    });
                                }                                                      
                            });
                        }
                    }
                    
                }
                //window.clearInterval(intervalID);
            }, 500);
        }
    });
});

$(document).on('pagecreate', '#helpdesk_page', function (event) {

    $( "#helpdesk_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#helpdesk_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    $('input[type="number"]').keypress( function (e) {
        // Allow: backspace
        if ( e.keyCode === 8 ) {
                 return;
        } else if (e.which < 48 || e.which > 57) {
            e.preventDefault();
        }
    });
               
    //init of mobiscroll select widgets
    var lang = window.localStorage.getItem('user_lang');
    if(!lang) {
        lang = 'en';
    }
    console.log('Language is ' + lang);

    console.log('Mobiscroll treelist: Category');
    //New/Edit Helpdesk
    $('#hd_category').mobiscroll().treelist({
        lang: lang,
        theme: 'mobiscroll',
        display: 'bottom',
        animate: 'none',
        mode: 'scroller',
        fixedWidth: [200,200,200],
        /*placeholder: 'Please Select ...',*/
        labels: ['Category', 'SubCategory1', 'SubCategory2']
    });
    //Filter in Helpdesk Overview
    $('#helpdesk_categories').mobiscroll().treelist({
        lang: lang,
        theme: 'mobiscroll',
        display: 'bottom',
        animate: 'none',
        mode: 'scroller',
        fixedWidth: [200,200,200],
        placeholder: 'Select all',
        labels: ['Category', 'SubCategory1', 'SubCategory2']
    });

    console.log('Mobiscroll select: Status');
    //New/Edit Helpdesk
    $('#hd_status').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });
    //Filter in Helpdesk Overview
    $('#helpdesk_states').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });
    //Forward Helpdesk
    $('#status_after_forwarding').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });

    console.log('Mobiscroll select: Responsibility');
    //New/Edit Helpdesk
    $('#hd_responsibility').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });
    //Filter in Helpdesk Overview
    $('#helpdesk_editors').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });

    //New/Edit Helpdesk
    console.log('Mobiscroll select: Prioity');
    $('#hd_priority').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });

    //New/Edit Helpdesk
    console.log('Mobiscroll select: Type');
    $('#hd_type').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });

    //New/Edit Helpdesk
    console.log('Mobiscroll select: Address');
    $('#hd_address').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });
    $('#hd_address').change(function(){
        var address_i3d = $(this).val();
        address_i3d = parseInt(address_i3d, 10);
        if(address_i3d) {
            console.log('Address change: '+ address_i3d +' detected, populating Contact...');
            load_contact_from_address(address_i3d);
        }
    });

    //New/Edit Helpdesk
    console.log('Mobiscroll select: Contact');
    $('#hd_contact').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });

    //New/Edit Helpdesk
    console.log('Mobiscroll select: Contract');
    $('#hd_contract').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });

    //New/Edit Helpdesk
    console.log('Mobiscroll select: Master Data List');
    $('#master_data_list').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });

    $("#helpdeskBack").click(function () {
                                            
        $('.info_container').remove();
        $('#helpdesk_page .ticket_details').remove();
        //$('.forwardHD_subLinks').menu('refresh');

        $('.gmap_outer_container').hide().css({'z-index': '-900'});
        $('#new_edit_HD_popup').hide();

        $('#forwardHD_popup_overlay, #ForwardHelpdeskPopup').hide();

        $('#pullUp').hide();

        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });
    
    $('#timer_signature_canvas').on("touchstart",function(){
        $("#HDTimer_description").blur();
    });

    $('#iscroll4_wrapper').on('touchmove', all_hail_iScroll);

    $('#iscroll4_wrapper, #helpdesk_page .header').click(function (e) {
        if (e.target == this) {
            //hide category, states, editors filter
            //$('#helpdesk_categories').hide();

            $('.helpdesk_display_options').css({
                'display': 'none'
            });
            $('.helpdesk_display_options').removeClass('helpdesk_filter');
        }
    });

    /*initialize date time picker*/
    var user_lang = window.localStorage.getItem('user_lang');
    if(!user_lang) {
        user_lang = 'en';
    }
    $("#hd_date").mobiscroll().datetime({
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

    $('#hd_contract').change(function(){
        var contract_i3d = $(this).val();
        contract_i3d = parseInt(contract_i3d, 10);
        console.log('Contract changed to: '+contract_i3d);
        var login_ticket = window.localStorage.getItem('Ticket');
        var mdl_param;
        var CustomerI3D;
        var NewHelpdesk = window.sessionStorage.getItem('NewHelpdesk');
        if(NewHelpdesk == 'true') {
            CustomerI3D = window.sessionStorage.getItem('CustomerSelected');

        } else if(NewHelpdesk == 'false') {
            /*
            var helpdeskI3D = $('.helpdesk_ticket.user_selected').find('.helpdeskI3D').html();
            console.log('helpdeskI3D: '+helpdeskI3D);
            var ticket_details = $('#helpdesk_ticket_details .ticket_details[data-ticketid="'+helpdeskI3D+'"]');
            CustomerI3D = ticket_details.find('.CustomerI3D').html();
            */
            CustomerI3D = $('#customerI3D').val();
            
        }

        if(contract_i3d){
            mdl_param = {
                Ticket: login_ticket,
                Data: {
                    ContractI3D: contract_i3d,
                    CustomerI3D: CustomerI3D
                }
            };
            CustomerI3D = parseInt(CustomerI3D, 10);
            if(CustomerI3D) {
                mdl_param.Data.CustomerI3D = CustomerI3D;
            }
            service_request('GetMasterDataListFromContract', mdl_param).done(function (response) {

                var label = '';
                if (0 === response.Status) {
                    var result, master_data_list = '';
                    if(response.Result.length) {
                        master_data_list += '<option value="0">---</option>';
                        $.each(response.Result, function (i, result) {
                            if(result && result.I3D && (result.Code || result.Caption)) {

                                label = '<span class="mdl-code">'+result.Code+'</span><span class="mdl-caption">'+result.Caption+'</span>';
                                master_data_list += '<option value="'+result.I3D+'">'+label+'</option>';
                            }
                        });

                        $('#master_data_list').html(master_data_list);
                        $('#master_data_list').mobiscroll('init');
                        $('#master_data_list').mobiscroll('option', { disabled: false, lang: lang });
                    } else {
                        $('#master_data_list').html('');
                        $('#master_data_list').mobiscroll('option', { disabled: true, lang: lang });
                    }
                }
                else {
                    $('#master_data_list').html('');
                    $('#master_data_list').mobiscroll('option', { disabled: true, lang: lang });
                }
            });
        } else {
            mdl_param = {
                Ticket: login_ticket,
                Data:{
                    EntriesPerPage: 1000,
                    Filter:{
                        CustomerI3D: CustomerI3D
                    },
                    Page: 1
                }
            };

            service_request('SearchMasterDataListsThroughPaging', mdl_param).done(function(response){

                var classes='', label='&nbsp;';
                if (0 === response.Status) {
                    var result, master_data_list = '';
                    if(response.Result && response.Result[0] && response.Result[0].Result) {
                        var results = response.Result[0].Result;

                        var filtered_results = results.filter(discard_bad_mdl);
                        if(filtered_results.length) {console.log('1488');
                            $.each(filtered_results, function (i, result) {
                                if(result && result.I3D && result.Caption) {
                                    master_data_list += '<option value="'+result.I3D+'"><span class="mdl-code">'+result.Code+'</span> <span class="mdl-caption">'+result.Caption+'</span></option>';
                                }
                            });

                            $('#master_data_list').html('<option>---</option>' + master_data_list);
                            $('#master_data_list').mobiscroll('init');
                            var lang = window.localStorage.getItem('user_lang');
                            if(!lang) {
                                lang = 'en';
                            }
                            $('#master_data_list').mobiscroll('option', { disabled: false, lang: lang });
                        } else {console.log('1502');
                            $('#master_data_list').html('');
                            $('#master_data_list').mobiscroll('option', { disabled: true });
                        }
                    } else {console.log('1506');
                        $('#master_data_list').html('');
                        $('#master_data_list').mobiscroll('option', { disabled: true });
                    }
                }
            });
                             
        }
    });

    /*Close New/Edit Helpdesk popup*/
    $('#hd_cancel, #new_edit_HD_popup_close').click(function () {// add #new_edit_HD_popup_overlay for closing if clicked outside popup
        console.log('Close New/Edit Helpdesk');
        $('#new_edit_HD_popup_overlay, #new_edit_HD_popup').hide();
        $('#hd_duration').removeClass('invalid_input');

        //clearing texts
        $('#hd_date, #hd_month, #hd_year, #hd_hour, #hd_minute, #hd_duration, #hd_shortDescription, #hd_description, #customer_name, #hd_phone, #hd_fax, #hd_email').val('');

        myHelpdeskScroll.refresh();
    });

    /*work around for footer disappearing bug when soft keyboard closes*/
    $('input[type="text"], textarea').blur(function () {
        console.log('Soft Keyboard closing');

        window.setTimeout(function () {
            $('div[data-role="footer"]').removeClass('ui-fixed-hidden');
        }, 1000);
    });

    /*Edit Helpdesk*/
    $('.edit_helpdesk').click(function () {
        console.log('Edit Helpdesk request');
        if (!$(this).hasClass('disabled')) {
            //hide ticket details
            $('#helpdesk_ticket_details .ticket_details').hide().removeClass('active_ticket_detail');

            if ($(this).hasClass('no-customer')) {
                console.log('Customer not found');
                $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select customer, please.')).end().popup('open');
                return false;
            } else {
                window.sessionStorage.setItem('NewHelpdesk', 'false');
                var helpdesk_ticket = $('.helpdesk_ticket.user_selected');

                if (helpdesk_ticket.length) {

                    var ticketid = helpdesk_ticket.data('ticketid');
                    $('#new_edit_HD_popup').data('helpdeski3d', ticketid);

                    var ticket_details = $('.ticket_details[data-ticketid="' + ticketid + '"]');

                    var CustomerI3D = ticket_details.find('.CustomerI3D').html();

                    CustomerI3D = parseInt(CustomerI3D, 10);
                    $('#customerI3D').val(CustomerI3D);
                    console.log('CustomerI3D: '+CustomerI3D);

                    var helpdesk_number = ticket_details.find('.helpdesk_number').html();
                    $('.new_edit_HD_help_desk_heading').html(_('Edit Ticket')).append('<span class="hd_number">' + helpdesk_number + '</span>');

                    var short_description = ticket_details.find('.hd_short_desc').html();
                    $('#hd_shortDescription').val(short_description);

                    var description = ticket_details.find('.hd_description strong').html();
                    $('#hd_description').val(description);

                    var hd_number = helpdesk_ticket.find('.hd_number').html();
                    console.log('hd_number: ' + hd_number);

                    var duration_hours = helpdesk_ticket.data('planned_duration');
                    if(!duration_hours){
                        duration_hours = '';
                    }
                    $('#hd_duration').val(duration_hours);

                    var due_timestamp = ticket_details.find('.hd_due_date').data('due_timestamp');
                    var due_date_obj = new Date(due_timestamp);
                    $('#hd_date').mobiscroll('setDate', due_date_obj, true, 1000);

                    var responsiblePersonI3D = ticket_details.find('.responsible').data('i3d');
                    console.log('responsiblePersonI3D: ' + responsiblePersonI3D);
                              
                    var lang = window.localStorage.getItem('user_lang');
                    if(!lang) {
                        lang = 'en';
                    }
                    $('#hd_responsibility').mobiscroll('init');
                    $('#hd_responsibility').mobiscroll('option', { lang: lang });
                    if(responsiblePersonI3D) {
                        responsiblePersonI3D = parseInt(responsiblePersonI3D, 10);
                        $('#hd_responsibility').val(responsiblePersonI3D).change();
                    }

                    var helpdeskStatusI3D = ticket_details.find('.hd_status').data('hd_status_i3d');
                    console.log('helpdeskStatusI3D: ' + helpdeskStatusI3D);
                    $('#hd_status').mobiscroll('init');
                    $('#hd_status').mobiscroll('option', { lang: lang });
                    if(helpdeskStatusI3D) {
                        helpdeskStatusI3D = parseInt(helpdeskStatusI3D, 10);
                        $('#hd_status').val(helpdeskStatusI3D).change;
                    }

                    var helpdeskPriorityI3D = ticket_details.find('.priority').data('hd_priority_i3d');
                    console.log('helpdeskPriorityI3D: ' + helpdeskPriorityI3D);
                    $('#hd_priority').mobiscroll('init');
                    $('#hd_priority').mobiscroll('option', { lang: lang });
                    if(helpdeskPriorityI3D) {
                        helpdeskPriorityI3D = parseInt(helpdeskPriorityI3D, 10);

                        $('#hd_priority').val(helpdeskPriorityI3D).change();
                    }

                    var helpdeskTypeI3D = ticket_details.find('.hd_type').data('i3d');
                    console.log('helpdeskTypeI3D: ' + helpdeskTypeI3D);
                    $('#hd_type').mobiscroll('init');
                    $('#hd_type').mobiscroll('option', { lang: lang });
                    if(helpdeskTypeI3D) {
                        helpdeskTypeI3D = parseInt(helpdeskTypeI3D, 10);
                        $('#hd_type').val(helpdeskTypeI3D).change();
                    }
                              
                    var categories = [];
                    var mainCategoryI3D = ticket_details.find('.main_cat').data('i3d');
                    if(mainCategoryI3D) {
                        var mainCategoryI3D_label = ticket_details.find('.main_cat').html();
                        categories.push(mainCategoryI3D_label);
                    }

                    var subCategory1I3D = ticket_details.find('.sub_cat').data('i3d');
                    if(mainCategoryI3D && subCategory1I3D) {
                        var subCategory1I3D_label = ticket_details.find('.sub_cat').html();
                        categories.push(subCategory1I3D_label);
                    }

                    var subCategory2I3D = ticket_details.find('.sub_cat2').data('i3d');
                    if(mainCategoryI3D && subCategory1I3D && subCategory2I3D) {
                        var subCategory2I3D_label = ticket_details.find('.sub_cat2').html();
                        categories.push(subCategory2I3D_label);
                    }
                    console.log('Categories: '+categories);
                    if(categories.length) {
                        $('#hd_category').mobiscroll('setValue', categories, true);
                        $('#hd_category_dummy').val(categories);
                    }
                    /*Load Contracts as Customer is selected*/
                    var login_ticket = window.localStorage.getItem('Ticket');
                    var contract_param = {
                        Ticket: login_ticket,
                        Data: CustomerI3D
                    };

                    var contracts_dfd = $.Deferred();
                    service_request('GetContractsByCustomerI3D', contract_param).done(function (response) {

                        if (0 === response.Status) {
                            var result;
                            var hd_contract = '';
                                                                                      
                            var lang = window.localStorage.getItem('user_lang');
                            if(!lang) {
                                lang = 'en';
                            }

                            var ContractKind, contract_label, contractId;
                            if(response.Result ) {
                                //var default_contract = response.Result.filter(function (result) { return result.IsGeneralAgreement == 1; });
                                
                                //if(default_contract.length && Array.isArray(default_contract)) {
                                //    console.log('Default Contract');
                                //    $('#hd_contract').html('');
                                //    result = default_contract[0];
                                //    if(result && result.I3D) {
                                //        ContractKind = result.ContractKind;
                                        
                                //        if(ContractKind){
                                //            var name = ContractKind.Name;
                                //            if(!name) {
                                //                name = '';
                                //            }
                                //            var description = ContractKind.Description;
                                //            if(!description) {
                                //               description = '';
                                //            }
                                //            if(name || description) {
                                //                contract_label = name +  '-' + description;

                                //                hd_contract += '<option value="'+result.I3D+'">'+ contract_label +'</option>';
                                //                $('#hd_contract').html(hd_contract);
                                //                $('#hd_contract').mobiscroll('init');

                                //                $('#hd_contract').mobiscroll('option', { disabled: true, lang: lang });
                                //            }
                                //        }
                                //    }
                                    
                                //} else {
                                    console.log('No Contract');
                                    $.each(response.Result, function (i, result) {
                                        if(result && result.I3D && result.ContractKind) {
                                            ContractKind = result.ContractKind;
                                            if(ContractKind && ContractKind.Name && ContractKind.Description) {
                                                hd_contract += '<option value="'+result.I3D+'">'+ContractKind.Name +  '-' + ContractKind.Description+'</option>';
                                            }
                                            else {
                                                console.log('Contract: Name & Description not found');
                                            }
                                        }
                                    });
                                    $('#hd_contract').html('<option>---</option>' + hd_contract);
                                    $('#hd_contract').mobiscroll('init');
                                    $('#hd_contract').mobiscroll('option', { lang: lang });
                                    contractId = ticket_details.find('.contract').data('id');
                                    if(contractId) {
                                        contractId = parseInt(contractId, 10);
                                        $('#hd_contract').val(contractId).change();
                                    }
                                //}
                            }
                        }
                        else {
                            $('#hd_contract').html('');
                        }
                        contracts_dfd.resolve();
                    });

                    var device_head_i3d = ticket_details.find('.master-data-list').data('device_head_i3d');
                    console.log('***DeviceHeadI3D: ' + device_head_i3d);

                    var mdl_param = {
                        Ticket: login_ticket,
                        Data:{
                            EntriesPerPage: 1000,
                            Filter:{
                                CustomerI3D: CustomerI3D
                            },
                            Page: 1
                        }
                    };
                    var mdl_dfd = $.Deferred();
                              
                    $.when(contracts_dfd).done(function(){
                        service_request('SearchMasterDataListsThroughPaging', mdl_param).done(function(response){

                            var classes='', label='&nbsp;';
                            if (0 === response.Status) {
                                var result, master_data_list = '';
                                var results = response.Result[0].Result;
                                var device_head_found = false;
                                                                                              
                                var filtered_results = results.filter(discard_bad_mdl);
                                if(filtered_results.length) {
                                    $.each(filtered_results, function (i, result) {
                                        if(result && result.I3D && result.Caption) {
                                            label = '<span class="mdl-code">'+result.Code+'</span> <span class="mdl-caption">'+result.Caption+'</span>';
                                            master_data_list += '<option value="'+result.I3D+'">'+label+'</option>';
                                            if(device_head_i3d && device_head_i3d == result.I3D) {
                                                console.log('***Device Head found in list: ' + device_head_i3d);
                                                device_head_found = true;
                                            }
                                        }
                                    });
                                    $('#master_data_list').html('<option>---</option>' + master_data_list);
                                    $('#master_data_list').mobiscroll('init');
                                    var lang = window.localStorage.getItem('user_lang');
                                    if(!lang) {
                                        lang = 'en';
                                    }
                                    $('#master_data_list').mobiscroll('option', { disabled: false, lang: lang });
                                    if(device_head_i3d && device_head_found) {
                                        $('#master_data_list').val(device_head_i3d).change();
                                    }
                                } else {console.log('1147');
                                    $('#master_data_list').html('');
                                    $('#master_data_list').mobiscroll('option', { disabled: true });
                                }
                            } else {console.log('1150');
                                $('#master_data_list').html('');
                                $('#master_data_list').mobiscroll('option', { disabled: true });
                            }
                            mdl_dfd.resolve();
                        });
                    });
                              


                    /*Load Addresses as Customer is selected*/
                    var address_param = {
                        Ticket: login_ticket,
                        Data: {
                            CustomerI3D: CustomerI3D,
                            OnlyActive: true
                        }
                    };
                    var address_dfd = $.Deferred();
                    var contacts_dfd = $.Deferred();
                    service_request('GetAddressesFromCustomer', address_param).done(function(response){

                        if(0 === response.Status) {
                            var result, hd_address = '';
                            $.each(response.Result, function (i, result) {
                                if(result && result.I3D && result.City && result.Zip && result.Street) {
                                    hd_address += '<option value="'+result.I3D+'"><span class="addr_city">'+result.City + '</span> <span class="addr_zip">' + result.Zip + '</span> (<span class="addr_street">' + result.Street + '</span>)'+'</option>';
                                }
                            });
                            $('#hd_address').html(hd_address);
                            $('#hd_address').mobiscroll('init');
                            var lang = window.localStorage.getItem('user_lang');
                            if(!lang) {
                                lang = 'en';
                            }
                            $('#hd_address').mobiscroll('option', { lang: lang });

                            var addressI3D = ticket_details.find('.CustomerI3D').data('address_i3d');
                            if(addressI3D) {
                                console.log('addressI3D: '+addressI3D);
                                addressI3D = parseInt(addressI3D, 10);
                                var address_label = $('#hd_address option[value="'+addressI3D+'"]').html();
                                $('#hd_address').val(addressI3D).change();
                            }
                            var AdressContactI3D = ticket_details.find('.AdressContactI3D').html();
                            console.log('AdressContactI3D:'+AdressContactI3D);
                            load_contact_from_address(addressI3D).done(function () {
                                console.log('finished loading contact from address');
                                $('#hd_contact').mobiscroll('init');
                                var lang = window.localStorage.getItem('user_lang');
                                if(!lang) {
                                    lang = 'en';
                                }
                                $('#hd_contact').mobiscroll('option', { lang: lang });
                                contacts_dfd.resolve();
                                if(AdressContactI3D){
                                    AdressContactI3D = parseInt(AdressContactI3D, 10);
                                    $('#hd_contact').val(AdressContactI3D).change();
                                }
                            });

                            $('#hd_cancel').html(_('Cancel'));
                            $('#hd_submit').html(_('Save'));
                            $('#hd_cancel, #hd_submit').button('refresh');

                            $('#customer_name').val(helpdesk_ticket.find('.customer').html());
                        }
                        address_dfd.resolve();
                    });
                } else {
                    $('#new_edit_HD_popup_overlay, #new_edit_HD_popup').hide();
                    $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select ticket, please.')).end().popup('open');
                }

                $.when(contracts_dfd, mdl_dfd, address_dfd, contacts_dfd).done(function(){
                    console.log('Showing Edit Helpdek Complete');
                    $('#new_edit_HD_popup_overlay, #new_edit_HD_popup').show();

                    restore_helpdesk_snapshot();

                });
            }
        }
    });

    /*New Helpdesk*/
    $('.new_helpdesk').click(function () {
        console.log('New Helpdesk request');
        if (!$(this).hasClass('disabled')) {

            //hide ticket details
            $('#helpdesk_ticket_details .ticket_details').hide().removeClass('active_ticket_detail');

            if ($(this).hasClass('no-customer')) {
                console.log('Customer not found');
                $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select customer, please.')).end().popup('open');
                return false;
            }
            else {
                var lang = window.localStorage.getItem('user_lang');
                if(!lang) {
                    lang = 'en';
                }
                console.log('Customer found');
                window.sessionStorage.setItem('NewHelpdesk', 'true');

                $('#new_edit_HD_popup').data('helpdeski3d', '');

                //hiding user selected ticket and details
                $('.helpdesk_ticket').removeClass('user_selected');
                $('.ticket_details').removeClass('active_ticket_detail').hide();

                $('.new_edit_HD_help_desk_heading').html(_('New Ticket'));
                //clearing texts
                $('.hd_number, #hd_duration, #hd_shortDescription, #hd_description, #customer_name, #hd_phone, #hd_fax, #hd_email').val('');
                             
                $('#hd_date').val(moment().format("DD.MM.YYYY HH:mm"));

                var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
                CustomerI3D = parseInt(CustomerI3D, 10);
                var CustomerName = window.sessionStorage.getItem('CustomerName');
                $('#customer_name').val(CustomerName + ' ' + CustomerI3D);

                $('#hd_responsibility').mobiscroll('init');
                $('#hd_responsibility').mobiscroll('option', { lang: lang });
                var responsibility = window.sessionStorage.getItem('DefaultResponsibility');
                if(responsibility) {
                    responsibility = parseInt(responsibility, 10);
                    $('#hd_responsibility').val(responsibility).change();
                }
                             
                $('#hd_status').mobiscroll('init');
                $('#hd_status').mobiscroll('option', { lang: lang });
                var status = window.sessionStorage.getItem('DefaultStatus');
                if(status) {
                    status = parseInt(status, 10);
                    $('#hd_status').val(status).change();
                }

                $('#hd_priority').mobiscroll('init');
                $('#hd_priority').mobiscroll('option', { lang: lang });
                var priority = window.sessionStorage.getItem('DefaultPriority');
                if(priority) {
                    priority = parseInt(priority, 10);
                    $('#hd_priority').val(priority).change();
                }

                $('#hd_type').mobiscroll('init');
                $('#hd_type').mobiscroll('option', { lang: lang });

                $('#hd_address').mobiscroll('init');
                $('#hd_address').mobiscroll('option', { lang: lang });

                $('#hd_contact').mobiscroll('init');
                $('#hd_contact').mobiscroll('option', { lang: lang });
                             
                $('#hd_category').mobiscroll('init');
                $('#hd_category').mobiscroll('option', { lang: lang });
                $('#hd_category_dummy').val('---').change();

                /*Load Contracts as Customer is selected*/
                var login_ticket = window.localStorage.getItem('Ticket');
                var contract_param = {
                    Ticket: login_ticket,
                    Data: CustomerI3D
                };

                var contracts_dfd = $.Deferred();
                service_request('GetContractsByCustomerI3D', contract_param).done(function (response) {
                    contracts_dfd.resolve();

                    if (0 === response.Status) {
                        var result;
                        var hd_contract = '';
                        var ContractKind;
                        if(response.Result) {
                            //var default_contract = response.Result.filter(function (result) { return result.IsGeneralAgreement == 1; });
                            //console.log('Default Contract: ' + JSON.stringify(default_contract));

                            var lang = window.localStorage.getItem('user_lang');
                            if(!lang) {
                                lang = 'en';
                            }
                            //if(default_contract.length && Array.isArray(default_contract)) {
                            //    console.log('Default Contract');
                            //    $('#hd_contract').html('');
                            //    result = default_contract[0];
                            //    if(result) {
                            //        ContractKind = result.ContractKind;

                            //        if(ContractKind && ContractKind.Name && ContractKind.Description){
                            //            var contract_label = ContractKind.Name +  '-' + ContractKind.Description;

                            //            hd_contract += '<option value="'+result.I3D+'">'+ contract_label +'</option>';
                            //            $('#hd_contract').html(hd_contract);
                            //            $('#hd_contract').mobiscroll('init');
                            //            $('#hd_contract').mobiscroll('option', { disabled: true, lang: lang });
                            //        }
                            //    }
                            //} else {
                                if(response.Result.length) {
                                    $.each(response.Result, function (i, result) {
                                        if(result && result.I3D && result.ContractKind) {
                                            ContractKind = result.ContractKind;
                                            if(ContractKind && ContractKind.Name && ContractKind.Description){
                                                hd_contract += '<option value="'+result.I3D+'">'+ContractKind.Name +  '-' + ContractKind.Description+'</option>';
                                            }
                                            else {
                                                console.log('Contract: Name & Description not found');
                                            }
                                        }
                                    });
                                    $('#hd_contract').html('<option>---</option>' + hd_contract);
                                    $('#hd_contract').mobiscroll('init');
                                    $('#hd_contract').mobiscroll('option', { disabled: false, lang: lang });
                                } else {console.log('1455');
                                    $('#hd_contract').html('');
                                    $('#hd_contract').mobiscroll('option', { disabled: true });
                                }
                            //}
                        }
                    }
                    else {
                        $('#hd_contract').html('');
                        $('#hd_contract').mobiscroll('option', { disabled: true });
                    }
                });

                var mdl_param = {
                    Ticket: login_ticket,
                    Data:{
                        EntriesPerPage: 1000,
                        Filter:{
                            CustomerI3D: CustomerI3D
                        },
                        Page: 1
                    }
                };
                var mdl_dfd = $.Deferred();
                service_request('SearchMasterDataListsThroughPaging', mdl_param).done(function(response){
                    mdl_dfd.resolve();
                    console.log('1480');
                    var classes='', label='&nbsp;';
                    if (0 === response.Status) {
                        var result, master_data_list = '';
                        if(response.Result && response.Result[0] && response.Result[0].Result) {
                            var results = response.Result[0].Result;

                            var filtered_results = results.filter(discard_bad_mdl);
                            if(filtered_results.length) {console.log('1488');
                                $.each(filtered_results, function (i, result) {
                                    if(result && result.I3D && result.Caption) {
                                        master_data_list += '<option value="'+result.I3D+'"><span class="mdl-code">'+result.Code+'</span> <span class="mdl-caption">'+result.Caption+'</span></option>';
                                    }
                                });

                                $('#master_data_list').html('<option>---</option>' + master_data_list);
                                $('#master_data_list').mobiscroll('init');
                                var lang = window.localStorage.getItem('user_lang');
                                if(!lang) {
                                    lang = 'en';
                                }
                                $('#master_data_list').mobiscroll('option', { disabled: false, lang: lang });
                            } else {console.log('1502');
                                $('#master_data_list').html('');
                                $('#master_data_list').mobiscroll('option', { disabled: true });
                            }
                        } else {console.log('1506');
                            $('#master_data_list').html('');
                            $('#master_data_list').mobiscroll('option', { disabled: true });
                        }
                    }
                });

                /*Load Addresses as Customer is selected*/
                var address_param = {
                    Ticket: login_ticket,
                    Data: {
                        CustomerI3D: CustomerI3D,
                        OnlyActive: true
                    }
                };
                var address_dfd = $.Deferred();
                service_request('GetAddressesFromCustomer', address_param).done(function (response) {
                    address_dfd.resolve();
                    if(0 === response.Status) {
                        var result, hd_address = '';
                        $.each(response.Result, function (i, result) {
                            if(result && result.I3D && result.City && result.Zip && result.Street) {
                                hd_address += '<option value="'+result.I3D+'"><span class="addr_city">'+result.City + '</span> <span class="addr_zip">' + result.Zip + '</span> (<span class="addr_street">' + result.Street + '</span>)'+'</option>';
                            }
                        });
                        $('#hd_address').html(hd_address);
                        $('#hd_address').mobiscroll('init');
                        var lang = window.localStorage.getItem('user_lang');
                        if(!lang) {
                            lang = 'en';
                        }
                        $('#hd_address').mobiscroll('option', { lang: lang });
                        $('#hd_address').val(0).change();
                    }
                });

                $.when(contracts_dfd, mdl_dfd, address_dfd).done(function(){
                    $('#new_edit_HD_popup_overlay, #new_edit_HD_popup').show();

                    restore_helpdesk_snapshot();
                });
            }
        }
        else {
            console.log('New Helpdesk Button is disabled');
            if ($(this).hasClass('no-customer')) {
              console.log('Customer not found');
              $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select customer, please.')).end().popup('open');
              return false;
            }
        }
    });

    /*New/Edit Helpdesk submit*/
    $('#hd_submit').click(function () {
                          
        var new_helpdesk = window.sessionStorage.getItem('NewHelpdesk');
        if('true' == new_helpdesk) {
            console.log('New Helpdesk');
        }
        else {
            console.log('Edit Helpdesk');
        }
        var hd_duration = $('#hd_duration').val();

        if(hd_duration) {
            if (!isNumber(hd_duration)) {
                $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Invalid Duration.')).end().popup('open');
                $('#hd_duration').addClass('invalid_input');
                return false;
            } else {
                hd_duration = parseInt(hd_duration, 10);
                if(hd_duration>0) {
                    $('#hd_duration').removeClass('invalid_input');
                    
                }
                else {
                    $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Invalid Duration.')).end().popup('open');
                    $('#hd_duration').addClass('invalid_input');
                    return false;
                }
            }
        }

        var shortDescription = $('#hd_shortDescription').val();
        if (shortDescription) {
            shortDescription = strip_tags( shortDescription );
            shortDescription = shortDescription.replace(/(\r\n|\n|\r)/gm, ' ');
            shortDescription = shortDescription.trim();
        }
        if (!shortDescription) {
            $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Enter short description, please.')).end().popup('open');
            return false;
        }
                          
        var helpdeskPriorityI3D = $('#hd_priority').val();
        helpdeskPriorityI3D = parseInt(helpdeskPriorityI3D, 10);
        console.log('helpdeskPriorityI3D: ' + helpdeskPriorityI3D);
        if(helpdeskPriorityI3D) {
            
            var helpdeskPriorityCaption = $('#hd_priority option[value="'+helpdeskPriorityI3D+'"]').html();
        } else {
            $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select priority, please.')).end().popup('open');
            return false;
        }

        var addressI3D = $('#hd_address').val();
        addressI3D = parseInt(addressI3D, 10);
        var customerCity, customerZip, customerStreet;
        if (!addressI3D) {
            $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select address, please.')).end().popup('open');
            return false;
        }
        else {
            customerCity = $('#hd_address option[value="'+addressI3D+'"] span.addr_city').html();
            customerZip = $('#hd_address option[value="'+addressI3D+'"] span.addr_zip').html();
            customerStreet = $('#hd_address option[value="'+addressI3D+'"] span.addr_street').html();
            console.log(customerCity+' '+customerZip+' '+customerStreet);
        }

        var contractId = $('#hd_contract').val();
        contractId = parseInt(contractId, 10);
        if(contractId) {
            var contractCaption = $('#hd_contract option[value="'+contractId+'"]').html();
        }

        var dueDate = moment($("#hd_date").mobiscroll('getDate'));
        var dueDateTimestamp = dueDate.valueOf();

        if (!dueDateTimestamp) {
            $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select due date, please.')).end().popup('open');
            return false;
        }

        dueDate = '\/Date(' + dueDateTimestamp + get_time_offset() + ')\/';

        var now_timestamp = new Date().getTime();
        var createdDate = '\/Date(' + now_timestamp + get_time_offset() + ')\/';
         
        var customerI3D;
                          
        if('true' == new_helpdesk) {
            customerI3D = parseInt(window.sessionStorage.getItem('CustomerSelected'), 10);
            console.log('New Entry customerI3D: ' + customerI3D);
        }
            
        else {
            console.log('Edit Helpdesk');
            /*
            var helpdesk_ticket = $('.helpdesk_ticket.user_selected');
            var ticketid = helpdesk_ticket.data('ticketid');

            var ticket_details = $('.ticket_details[data-ticketid="' + ticketid + '"]');

            customerI3D = ticket_details.find('.CustomerI3D').html();
            */
            customerI3D = $('#customerI3D').val();
            customerI3D = parseInt(customerI3D, 10);
            console.log('When Edit is Selected CustomerI3D: '+ customerI3D);
        }
                          
        var customerName = $('#customer_name').val();

        var description = $('#hd_description').val().trim();
        if(description) {
            description = strip_tags( description );
            description = description.replace(/(\r\n|\n|\r)/gm, ' ');
        }

        var helpdeskStatusI3D = $('#hd_status').val();
        helpdeskStatusI3D = parseInt(helpdeskStatusI3D, 10);
        if (helpdeskStatusI3D) {
            var helpdeskStatusCaption = $('#hd_status option[value="'+helpdeskStatusI3D+'"]').html();
        }

        var responsiblePersonI3D = $('#hd_responsibility').val();
        responsiblePersonI3D = parseInt(responsiblePersonI3D, 10);
        if (responsiblePersonI3D) {
            var responsiblePersonDisplayText = $('#hd_responsibility option[value="'+responsiblePersonI3D+'"]').html();
        }

        var helpdeskTypeI3D = $('#hd_type').val();
        console.log('helpdeskTypeI3D: ' + helpdeskTypeI3D);
        helpdeskTypeI3D = parseInt(helpdeskTypeI3D, 10);
        if(helpdeskTypeI3D) {
            var helpdeskTypeName = $('#hd_type option[value="'+helpdeskTypeI3D+'"]').html();
        }

        var contact = $('#hd_contact .selected_menu_item');
        var adressContactI3D, contact_salutation, contactName;
        if (!contact) {
            $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select contact person, please.')).end().popup('open');
            return false;
        }
        else {
            adressContactI3D = $('#hd_contact').val();
            contact_salutation = $('#hd_contact option[value="'+adressContactI3D+'"]').data('contact_salutation');
            contactName = $('#hd_contact option[value="'+adressContactI3D+'"]').html().trim();
        }
                          
        var contactEmail = $('#hd_email').val();

        var contactTelephoneNumber = $('#hd_phone').val().trim();

        var CurrentAppUserI3D = parseInt(window.localStorage.getItem("CurrentAppUserI3D"), 10);
        var CurrentAppUserDisplayText = window.localStorage.getItem("CurrentAppUserDisplayText");

        var data = {
            AddressI3D: addressI3D,
            ContactName: contactName,
            CreatedBy: {
                I3D: CurrentAppUserI3D,
                DisplayText: CurrentAppUserDisplayText
            },
            CreatedDate: createdDate,
            CustomerI3D: customerI3D,
            DueDate: dueDate,
            Editors: [{
                I3D: CurrentAppUserI3D,
                DisplayText: CurrentAppUserDisplayText
            }],
            HelpdeskPriorityI3D: helpdeskPriorityI3D,
            HelpdeskPriorityCaption: helpdeskPriorityCaption,
            ShortDescription: shortDescription
        };
        console.log('PlannedDurationInHours: '+hd_duration);
        if(hd_duration) {
            data.PlannedDurationInHours = hd_duration;
        }
        if(contactEmail) {
            data.ContactEmail = contactEmail;
        }
        if(customerName) {
            data.CustomerName = customerName;
        }
        if(adressContactI3D) {
            data.AdressContactI3D = adressContactI3D;
        }
        if(customerCity) {
            data.CustomerCity = customerCity;
        }
        if(customerZip) {
            data.CustomerZip = customerZip;
        }
        if(customerStreet) {
            data.CustomerStreet = customerStreet;
        }
        if(contractId) {
            data.ContractId = contractId;
            data.ContractCaption = contractCaption;
        }
        if(description) {
            data.Description = description;
        }
        if(helpdeskStatusI3D) {
            data.HelpdeskStatusI3D = helpdeskStatusI3D;
            data.HelpdeskStatusCaption = helpdeskStatusCaption;
        }
        if(responsiblePersonI3D) {
            data.ResponsiblePerson = {
                I3D: responsiblePersonI3D,
                DisplayText: responsiblePersonDisplayText
            };
        }
        if(helpdeskTypeI3D) {
            data.HelpdeskType = {
                I3D: helpdeskTypeI3D,
                Name: helpdeskTypeName
            };
        }
             
        if(contact_salutation) {
            data.ContactTitle = contact_salutation;
        }
        if(contactTelephoneNumber) {
            data.ContactTelephoneNumber = contactTelephoneNumber;
        }

        //edit helpdesk
        var HelpdeskI3D = $('#new_edit_HD_popup').data('helpdeski3d');
        var HelpdeskNumber = $('#new_edit_HD_popup .hd_number').html();
        if (HelpdeskI3D) {
            jQuery.extend(data, {
                I3D: HelpdeskI3D,
                Number: parseInt(HelpdeskNumber, 10)
            });
        }
                          
        var categories = $('#hd_category').mobiscroll('getValue');
        console.log('Category: '+categories);
        categories = categories.filter(function(val) { return val !== 0 && val !== null;});
        var category_depth = categories.length;
        var mainCategoryI3D, subCategory1I3D, subCategory2I3D;
        var mainCategoryCaption, subCategory1Caption, subCategory2Caption;
                          
        if (1 === category_depth) {
            mainCategoryCaption = categories[0];
            mainCategoryI3D = $('#hd_category li[data-val="'+mainCategoryCaption+'"]').data('id');
            mainCategoryI3D = parseInt(mainCategoryI3D, 10);
            if(mainCategoryI3D) {
                jQuery.extend(data, {
                    MainCategoryCaption: mainCategoryCaption,
                    MainCategoryI3D: mainCategoryI3D,
                    MainCategory: {
                        I3D: mainCategoryI3D,
                        Name: mainCategoryCaption
                    }
                });
            }
        } else if (2 === category_depth) {
                          
            mainCategoryCaption = categories[0];
            mainCategoryI3D = $('#hd_category li[data-val="'+mainCategoryCaption+'"]').data('id');
            mainCategoryI3D = parseInt(mainCategoryI3D, 10);
            if(mainCategoryI3D) {
                jQuery.extend(data, {
                    MainCategoryCaption: mainCategoryCaption,
                    MainCategoryI3D: mainCategoryI3D,
                    MainCategory: {
                        I3D: mainCategoryI3D,
                        Name: mainCategoryCaption
                    }
                });
            }
                          
            subCategory1Caption = categories[1];
            subCategory1I3D = $('#hd_category li[data-val="'+subCategory1Caption+'"]').data('id');
            subCategory1I3D = parseInt(subCategory1I3D, 10);
            if(subCategory1I3D) {
                jQuery.extend(data, {
                    SubCategory1Caption: subCategory1Caption,
                    SubCategory1I3D: subCategory1I3D,
                    SubCategory1: {
                        I3D: subCategory1I3D,
                        Name: subCategory1Caption
                    }
                });
            }

        } else if (3 === category_depth) {
            mainCategoryCaption = categories[0];
            mainCategoryI3D = $('#hd_category li[data-val="'+mainCategoryCaption+'"]').data('id');
            mainCategoryI3D = parseInt(mainCategoryI3D, 10);
            if(mainCategoryI3D) {
                jQuery.extend(data, {
                    MainCategoryCaption: mainCategoryCaption,
                    MainCategoryI3D: mainCategoryI3D,
                    MainCategory: {
                        I3D: mainCategoryI3D,
                        Name: mainCategoryCaption
                    }
                });
            }

            subCategory1Caption = categories[1];
            subCategory1I3D = $('#hd_category li[data-val="'+subCategory1Caption+'"]').data('id');
            subCategory1I3D = parseInt(subCategory1I3D, 10);
            if(subCategory1I3D) {
                jQuery.extend(data, {
                    SubCategory1Caption: subCategory1Caption,
                    SubCategory1I3D: subCategory1I3D,
                    SubCategory1: {
                        I3D: subCategory1I3D,
                        Name: subCategory1Caption
                    }
                });
            }

            subCategory2Caption = categories[2];
            subCategory2I3D = $('#hd_category li[data-val="'+subCategory2Caption+'"]').data('id');
            subCategory2I3D = parseInt(subCategory2I3D, 10);
            if(subCategory2I3D) {
                jQuery.extend(data, {
                    SubCategory2Caption: subCategory2Caption,
                    SubCategory2I3D: subCategory2I3D,
                    SubCategory2: {
                        I3D: subCategory2I3D,
                        Name: subCategory2Caption
                    }
                });
            }
        }

        var login_ticket = window.localStorage.getItem('Ticket');
        var helpdesk_param = {
            Ticket: login_ticket,
            Data: data
        };
        //console.log('SaveHelpdesk:' + JSON.stringify(helpdesk_param));
        
        service_request('SaveHelpdesk', helpdesk_param).done(function (response) {

            if (0 === response.Status) {
                var NewHelpdeskI3D = response.Result[0];
                var deviceHeadI3D = $('#master_data_list').val();

                console.log('HelpdeskI3D: ' + NewHelpdeskI3D + ' deviceHeadI3D: ' + deviceHeadI3D);
                if(deviceHeadI3D) {
                    deviceHeadI3D = parseInt(deviceHeadI3D, 10);
                    var DeviceHeadCode = $('#master_data_list option[value="'+deviceHeadI3D+'"] span.mdl-code').html();
                    var DeviceHeadCaption = $('#master_data_list option[value="'+deviceHeadI3D+'"] span.mdl-caption').html();
                }
                if(NewHelpdeskI3D && deviceHeadI3D) {
                                                             
                    var service_url = window.localStorage.getItem('SERVICE_URL');
                    var login_ticket = window.localStorage.getItem('Ticket');
                    var device_link_param = {
                        Ticket: login_ticket,
                        Data: {
                            DeviceHeadI3D: deviceHeadI3D,
                            HelpdeskI3D: NewHelpdeskI3D,
                            CustomerI3D: customerI3D,
                            DeviceHeadCode: DeviceHeadCode,
                            DeviceHeadCaption: DeviceHeadCaption
                        }
                    };
                    //Following params are not in documentation:
                    //CustomerI3D, DeviceHeadCode, DeviceHeadCaption
                    //They are added to save in local db without making an extra request to server
                    console.log('SaveDeviceLink param: ' + JSON.stringify(device_link_param));
                    service_request('SaveDeviceLink', device_link_param);
                }

                if (HelpdeskI3D) {
                    $( "#helpdesk_page .centron-alert-success" ).find('p').html(_('Ticket updated.')).end().popup('open');
                } else {
                    $( "#helpdesk_page .centron-alert-success" ).find('p').html(_('Ticket created.')).end().popup('open');
                }

                $('#new_edit_HD_popup_overlay, #new_edit_HD_popup').hide();

                var current_page = 1;
                window.sessionStorage.setItem("HDCurrentPage", current_page);

                $('#helpdesk_ticket_list').html('');
                $('#helpdesk_ticket_details').html('');

                var HelpdeskFilter = get_display_filter_options();

                login_ticket = window.localStorage.getItem('Ticket');
                var entries_per_page = window.localStorage.getItem('helpdesk_record_limit');
                var helpdesk_param = {
                    Ticket: login_ticket,
                    Data: {
                        Descending: true,
                        EntriesPerPage: entries_per_page,
                        HelpdeskFilter: HelpdeskFilter,
                        Page: current_page,
                        Sort: 1
                    }
                };
                var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
                if(CustomerI3D) {
                    CustomerI3D = parseInt(CustomerI3D, 10);
                    helpdesk_param.Data.HelpdeskFilter.CustomerI3D = CustomerI3D;
                }
                service_request('GetHelpdesksThroughPaging', helpdesk_param).done(function (response) {

                    if (0 === response.Status) {
                        create_helpdesk_page(response);
                        $('.edit_helpdesk, .ForwardHelpdesk, .view_time_btn').addClass('disabled');
                        $('#pullUp').show();
                    }
                });
            }
        });
    });

    /*Close forward Helpdesk*/
    $('#forwardHD_closePopup, #forwardHD_cancel').click(function () { // add #forwardHD_popup_overlay for closing if clicked outside popup
        console.log('Time to pack up!');
                                                                                  
        $(".forwardHD_popupBox input[type='checkbox']").attr("checked", false).checkboxradio("refresh");
        $(".forwardHD_popupPadder .icon-down-open").removeClass("icon-down-open").addClass("icon-left-open");
                                                                                  
        $('#forwardHD_popup_overlay, #ForwardHelpdeskPopup').hide();
    });

    /*Submit forward Helpdesk*/
    $('#forwardHD_forward').click(function () {
        console.log('Forward Helpdesk request...');

        var helpdeskI3D = $('#ForwardHelpdeskPopup .helpdeskI3D').html();
        helpdeskI3D = parseInt(helpdeskI3D, 10);

        var recipientI3D;
        var mail_to = [];
        $('[name="mail_to"]:checked').each(function (index, element) {
            recipientI3D = parseInt($(element).val(), 10);
            mail_to.push(recipientI3D);
        });

        var adviser1, adviser2, adviser3, adviser4;
        adviser1 = adviser2 = adviser3 = adviser4 = false;

        if($('#adviser1').length) {
            adviser1 = $('#adviser1:checked').length;
            adviser1 = adviser1 ? true : false;
        }

        if($('#adviser2').length) {
            adviser2 = $('#adviser2:checked').length;
            adviser2 = adviser2 ? true : false;
        }

        if($('#adviser3').length) {
            adviser3 = $('#adviser3:checked').length;
            adviser3 = adviser3 ? true : false;
        }

        if($('#adviser4').length) {
            adviser4 = $('#adviser4:checked').length;
            adviser4 = adviser4 ? true : false;
        }

        var mail_cc = [];
        $('[name="mail_cc"]:checked').each(function (index, element) {
            recipientI3D = parseInt($(element).val(), 10);
            mail_cc.push(recipientI3D);
        });

        var mail_bcc = [];
        $('[name="mail_bcc"]:checked').each(function (index, element) {
            recipientI3D = parseInt($(element).val(), 10);
            mail_bcc.push(recipientI3D);
        });

        var mail_subject = $('.forwardHD_mail_subject').val().trim();
        if(mail_subject) {
            mail_subject = strip_tags( mail_subject );
            mail_subject = mail_subject.replace(/(\r\n|\n|\r)/gm, ' ');
        }

        var mail_body = $('.forwardHD_mail_body').val().trim();
        if(mail_body) {
            mail_body = strip_tags( mail_body );
            mail_body = mail_body.replace(/(\r\n|\n|\r)/gm, ' ');
        }

        //var HDStateI3D = $('#newHelpdeskStateI3D').data('newHelpdeskStateI3D');
        var HDStateI3D = $('#status_after_forwarding').val();
        HDStateI3D = parseInt(HDStateI3D, 10);

        var inform_editor = $('#email_to_editor:checked').length;
        inform_editor = (inform_editor) ? true : false;

        var inform_customer = $('#email_to_customer:checked').length;
        inform_customer = (inform_customer) ? true : false;
        var CustomerMail = $('#ForwardHelpdeskPopup .CustomerMail').val();

        var inform_via_notify = $('#inform_via_notify:checked').length;
        inform_via_notify = (inform_via_notify) ? true : false;

        var forward_helpdesk_data = {
            InformViaNotify: inform_via_notify,
            HelpdeskI3D: helpdeskI3D,
            NewHelpdeskStateI3D: HDStateI3D
        };

        if(mail_subject.length){
            forward_helpdesk_data.Subject = mail_subject;
        }
        else {
            $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Email Subject, please!')).end().popup('open');
            return false;
        }

        if(mail_body.length){
            forward_helpdesk_data.Body = {
                Text: mail_body
            };
        }
        else {
            $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Email Body, please!')).end().popup('open');
            return false;
        }

        if(mail_to.length) {
                                  
            if(mail_to.length) {
                forward_helpdesk_data.EmployeeI3DsTo = mail_to;
            }
            if(mail_cc.length) {
                forward_helpdesk_data.EmployeeI3DsCC = mail_cc;
            }
            if(mail_bcc.length) {
                forward_helpdesk_data.EmployeeI3DsBCC = mail_bcc;
            }
                                  
            if(adviser1) {
                forward_helpdesk_data.Adviser1 = adviser1;
            }
            if(adviser2) {
                forward_helpdesk_data.Adviser2 = adviser2;
            }
            if(adviser3) {
                forward_helpdesk_data.Adviser3 = adviser3;
            }
            if(adviser4) {
                forward_helpdesk_data.Adviser4 = adviser4;
            }
                                  
            if(inform_editor) {
                forward_helpdesk_data.InformEditor = inform_editor;
            }
                                  
            if(inform_customer) {
                forward_helpdesk_data.CustomerMail = CustomerMail;
                forward_helpdesk_data.InformCustomer = inform_customer;
            }

            var login_ticket = window.localStorage.getItem('Ticket');
            var forward_helpdesk_param = {
                Ticket: login_ticket,
                Data: forward_helpdesk_data
            };
            service_request('ForwardHelpdeskV2', forward_helpdesk_param).done(function(respone){
                if(respone.Status === 0) {
                    $('#forwardHD_popup_overlay, #ForwardHelpdeskPopup').hide();
                    $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Ticket forwarded!')).end().popup('open');
                }
            });
        }
        else {
            $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select at least To:Forward recipient!')).end().popup('open');
            return false;
        }
    });

    $('#helpdesk_page').on('click', '.forwardHD_to', function () {
        //Open Deptt
        $(this).next('.forwardHD_subLinks').toggle();

        if ($(this).hasClass('icon-left-open')) {
            $(this).removeClass('icon-left-open');
            $(this).addClass('icon-down-open');
        } else {
            $(this).removeClass('icon-down-open');
            $(this).addClass('icon-left-open');
        }
    });

    //Helpdesk Page init
    /*Filters: states, editors*/
    (function () {
/*
        $("#helpdesk_states dd ul").on('click', 'li a', function () {

            var text = $(this).html();
                                       
            var state = $('<a>' + text + '</a>').find('span').html();
            console.log('state: ' + status);
                                       
            var closed_tickets = $('input[name="closed_tickets"]:checked').length;
            var only_active = (closed_tickets) ? false : true;
            var non_active_state = window.sessionStorage.getItem('InactiveHelpdeskStatusI3D');

            if( (!only_active && state) || (only_active && state && state != non_active_state) ) {
                $("#helpdesk_states dt a span").html(text);

                $("#helpdesk_states dd ul").hide();
                $('#helpdesk_categories').hide();

                console.log('Status: ' + getSelectedValue("helpdesk_states"));
                $("#selected_state").val(getSelectedValue("helpdesk_states")).change();
            }
        });
*/

        //change in Helpdesk Display/Filters options
        $('#all_tickets, #my_tickets, #closed_tickets, #helpdesk_categories, #helpdesk_states, #helpdesk_editors').change(function () {

            var HelpdeskFilter = {};
            HelpdeskFilter = get_display_filter_options();

            var current_page = 1;
            window.sessionStorage.setItem("HDCurrentPage", current_page);
            $('#helpdesk_ticket_list').html('');
            $('#helpdesk_ticket_details').html('');

            var login_ticket = window.localStorage.getItem('Ticket');
            var entries_per_page = window.localStorage.getItem('helpdesk_record_limit');
            var helpdesk_param = {
                Ticket: login_ticket,
                Data: {
                    Descending: true,
                    EntriesPerPage: entries_per_page,
                    HelpdeskFilter: HelpdeskFilter,
                    Page: current_page,
                    Sort: 1
                }
            };
            var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
            if(CustomerI3D) {
                CustomerI3D = parseInt(CustomerI3D, 10);
                helpdesk_param.Data.HelpdeskFilter.CustomerI3D = CustomerI3D;
            }
            service_request('GetHelpdesksThroughPaging', helpdesk_param).done(function (response) {

                if (0 === response.Status) {
                    create_helpdesk_page(response);
                    $('#pullUp').show();
                }
            });
        });
    }());

    //To toggle the helpdesk display options
    $('#helpdeskClose.closeBtn').click(toggle_helpdesk_display_options);
    $('#iscroll4_scroller').click(function(){

        if ($('.helpdesk_display_options').hasClass('helpdesk_filter')) {
            
            $('.helpdesk_display_options').css({
                'display': 'none'
            });
            
        }
        $('.helpdesk_display_options').removeClass('helpdesk_filter');
    });

    $('.view_time_btn').click(function () {
        console.log('Time Summary requested');
        if (!$(this).hasClass('disabled')) {
            if ($('#helpdesk_page .info_container.user_selected').length) {
                $.mobile.changePage('#helpdesk_timers_page', {
                    transition: 'flip',
                    changeHash: false
                });
            }
            else {
                $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select ticket, please.')).end().popup('open');
            }
        }
    });

               
    $('#helpdesk_ticket_list').on('click', '.info_container', function (event) {
        console.log('Ticket selection going on');
        var helpdesk_ticket = $(this);

        $('#helpdesk_page .action_button_container .button').addClass('disabled');
        var ticket_selected_dfd = $.Deferred();
        var helpdeskReady = $.Deferred();
        var customerReady = $.Deferred();
        var deviceLinkReady = $.Deferred();
        var contactReady = $.Deferred();
        var contactImageReady = $.Deferred();

        if ('field_route' != event.target.className && 'route' != event.target.className) {
            console.log('Aborting in progress ajax requests');
            $.xhrPool.abortAll();

            $('.helpdesk_display_options').css({ 'display': 'none' });
            $('.helpdesk_display_options').removeClass('helpdesk_filter');

            $('.info_container').removeClass('user_selected');
            $('#helpdesk_ticket_details .ticket_details').hide().removeClass('active_ticket_detail');

            helpdesk_ticket.addClass('user_selected');

            var ticket_details;

            var helpdeskI3D = helpdesk_ticket.data('ticketid');
            window.sessionStorage.setItem('helpdeskI3D', helpdeskI3D);
            if (helpdeskI3D) {
                console.log('helpdeskI3D: ' + helpdeskI3D);
                ticket_details = $('#helpdesk_ticket_details .ticket_details[data-ticketid="' + helpdeskI3D + '"]');
                ticket_details.addClass('active_ticket_detail');
                console.log('Searching ticket_details...' + ticket_details.length);

                var verify_duedate_timestamp = ticket_details.find('.hd_due_date').data('due_timestamp');
                var verify_due_date = new Date(verify_duedate_timestamp);

                var login_ticket = window.localStorage.getItem('Ticket');
                var helpdek_param = {Ticket: login_ticket, Data: helpdeskI3D};
                service_request('GetHelpdeskByI3D', helpdek_param).done(function (response) {

                    helpdeskReady.resolve();
                    if (0 === response.Status && Array.isArray(response.Result)) {
                        var result = response.Result[0];
                        if(result && result.CustomerI3D) {
                            var CustomerI3D = parseInt(result.CustomerI3D, 10);
                            console.log('CustomerI3D: '+CustomerI3D);
                                                    
                            if(result.CreatedBy) {
                                var created_by = result.CreatedBy.DisplayText;
                                if(!created_by){
                                    created_by = '';
                                }
                                $('.created_by_display_text').html(created_by);
                            }

                            var login_ticket = window.localStorage.getItem('Ticket');
                            var customer_param = {
                                Ticket: login_ticket,
                                Data: CustomerI3D
                            };
                            service_request('GetCustomerByI3D', customer_param).done(function(response){

                                customerReady.resolve();
                                if (0 === response.Status) {
                                    $.each(response.Result, function (i, result) {
                                        if(result) {
                                            var customer_email = result.EMail;
                                            if(!customer_email) {
                                                customer_email = '';
                                            }
                                            ticket_details.find('.customer_email').html(customer_email);
                                            ticket_details.data('customer_email', customer_email);
                                        }
                                    });
                                }
                            });

                            var planned_duration = 0;
                            if(result.PlannedDurationInHours) {
                                planned_duration = result.PlannedDurationInHours;
                            }
                            helpdesk_ticket.data('planned_duration', planned_duration);

                            if(result.ContactTelephoneNumber) {
                                ticket_details.find('.phoneBusiness1').html(result.ContactTelephoneNumber);
                            }
                            if(result.MainCategory && result.MainCategory.I3D && result.MainCategory.Name) {
                                ticket_details.find('.main_cat').html(result.MainCategory.Name).attr('data-i3d', result.MainCategory.I3D);
                            }
                            if(result.SubCategory1 && result.SubCategory1.I3D && result.SubCategory1.Name) {
                                ticket_details.find('.sub_cat').html(result.SubCategory1.Name).attr('data-i3d', result.SubCategory1.I3D);
                            }
                            if(result.SubCategory2 && result.SubCategory2.I3D && result.SubCategory2.Name) {
                                ticket_details.find('.sub_cat2').html(result.SubCategory2.Name).attr('data-i3d', result.SubCategory2.I3D);
                            }
                                                                        
                            if(result.ContractId && result.ContractCaption) {
                                ticket_details.find('.contract').html(result.ContractCaption).attr('data-id', result.ContractId);
                            }

                            var service_url = window.localStorage.getItem('SERVICE_URL');

                            var link_param = {
                                Ticket: login_ticket,
                                Data: {
                                    CustomerI3D: CustomerI3D,
                                    TicketI3D: helpdeskI3D
                                }
                            };
                            service_request('GetDeviceLinks', link_param).done(function(response){

                                deviceLinkReady.resolve();
                                if (0 === response.Status) {
                                    var result, device_head_i3d;
                                    $.each(response.Result, function(i, result){
                                        if(result && result.DeviceHead && result.DeviceHead.I3D && (result.DeviceHead.Code || result.DeviceHead.Caption)) {
                                            device_head = result.DeviceHead;
                                            device_head_i3d = device_head.I3D;
                                            ticket_details.find('.master-data-list').attr('data-device_head_i3d', device_head_i3d);
                                               
                                            var mdl_code_caption = '';
                                            if(device_head.Code) {
                                                mdl_code_caption = device_head.Code + '<br>';
                                            }
                                            mdl_code_caption += device_head.Caption;
                                            ticket_details.find('.master-data-list').html(mdl_code_caption);
                                        }
                                    });
                                }
                            });

                            if(result.HelpdeskType && result.HelpdeskType.I3D && result.HelpdeskType.Name) {
                                ticket_details.find('.hd_type').html(result.HelpdeskType.Name).attr('data-i3d', result.HelpdeskType.I3D);
                            }
                            if(result.ResponsiblePerson && result.ResponsiblePerson.I3D && result.ResponsiblePerson.DisplayText) {
                                ticket_details.find('.responsible').html(result.ResponsiblePerson.DisplayText).attr('data-i3d', result.ResponsiblePerson.I3D);
                            }

                            var AddressI3D = parseInt(result.AddressI3D, 10);
                            var AdressContactI3D = parseInt(result.AdressContactI3D, 10);
                            if (AddressI3D) {

                                var contact_param = {
                                    Ticket: login_ticket,
                                    Data: {
                                        AddressI3D: AddressI3D,
                                        OnlyActive: true
                                    }
                                };
                                service_request('GetContactsFromAddress', contact_param).done(function(response){

                                    contactReady.resolve();
                                    $.each(response.Result, function (i, contact) {
                                        if(contact && contact.I3D && true === contact.Default) {
                                            var contact_name, contact_salutation, contact_firstname, contact_lastname;
                                            var contact_email1, contact_phone_business1;

                                            contact_salutation = (contact.Salutation) ? contact.Salutation.Salutation : '';

                                            contact_firstname = contact.Firstname;
                                            contact_firstname = contact_firstname ? contact_firstname : '';

                                            contact_lastname = contact.Lastname;
                                            contact_lastname = contact_lastname ? contact_lastname : '';

                                            contact_name = contact_salutation+' '+contact_firstname+' '+contact_lastname;

                                            contact_email1 = contact.EMail1;
                                            contact_email1 = contact_email1 ? contact_email1 : '';
                                            ticket_details.find('.email1').html(contact_email1);

                                            contact_phone_business1 = contact.PhoneBusiness1;
                                            contact_phone_business1 = contact_phone_business1 ? contact_phone_business1 : '';
                                            ticket_details.find('.phoneBusiness1').html(contact_phone_business1);
                                           
                                            var contact_i3d = contact.I3D;
                                            var load_photo_contact = window.localStorage.getItem("load_photo_contact");

                                            if ('1' == load_photo_contact) {
                                           
                                                var photo_load_delay = parseInt(window.localStorage.getItem("photo_load_delay"), 10);

                                                var login_ticket = window.localStorage.getItem('Ticket');
                                                window.setTimeout(function(){
                                                    var contact_img_param = {
                                                        Ticket: login_ticket,
                                                        Data: contact_i3d
                                                    };
                                                                  
                                                    service_request('GetContactPersonImage', contact_img_param).done(function (response) {

                                                        contactImageReady.resolve();

                                                        if (0 === response.Status ) {
                                                            if(response.Result && response.Result[0]) {
                                                                var img_data = response.Result[0];
                                                                if(img_data){
                                                                    var img_html = '<div class="customer_photo"><img src="data:image/png;base64,' + img_data + '" /></div>';

                                                                    $('.customer_photo').remove();
                                                                    ticket_details.find('.ContactPersonImage .AdressContactI3D').before(img_html);
                                                                }
                                                            }
                                                        }
                                                    });
                                                }, photo_load_delay);
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    }
                });
            }

            $.when( helpdeskReady, customerReady, deviceLinkReady, contactReady ).then(function () {
                console.log('Helpdesk Ticket details ajax requests completed');
                ticket_details.show();

                $('#helpdesk_page .action_button_container .button').removeClass('disabled');

                if( window.localStorage.getItem('offline_mode') === 'on' ) {
                    $('#helpdesk_page .ForwardHelpdesk').addClass('disabled');
                }
                                                                                       
                var LoadHelpdeskWithEditHelpdesk = window.sessionStorage.getItem('LoadHelpdeskWithEditHelpdesk');
                if(LoadHelpdeskWithEditHelpdesk) {
                    console.log('Ticket selection complete');
                    console.log('Going to edit Ticket...');
                    $('#helpdesk_page .edit_helpdesk').click();
                    window.sessionStorage.removeItem("LoadHelpdeskWithEditHelpdesk");
                }
            });
        }
                                  
        return ticket_selected_dfd.promise();
    });

    $('#helpdesk_ticket_details').on('click', '.customer_photo', function () {

        console.log('You wanna see contact\'s photo!');
        if(window.localStorage.getItem("load_photo_contact")!="1" && !$(this).find('img').hasClass("server-image")){
            var customer_photo = $(this);

            var AdressContactI3D = parseInt(customer_photo.next('.AdressContactI3D').html(), 10);
            if (0 < AdressContactI3D) {
                var login_ticket = window.localStorage.getItem('Ticket');
                var param = {
                    Ticket: login_ticket,
                    Data: AdressContactI3D
                };
                service_request('GetContactPersonImage', param).done(function(response){
                    if (0 === response.Status && response.Result && response.Result[0]) {
                        console.log('We have CPImage');
                        var img_data = response.Result[0];
                        if(img_data){
                            customer_photo.find('img').attr('src', 'data:image/png;base64,' + img_data);
                            customer_photo.find('img').addClass("server-image");
                        }
                    }
                });
            }
        }
    });

    $('#helpdesk_page .mail_cc, #helpdesk_page .mail_bcc').click(function(){
        console.log('Toggle Copy & BCC');
        $(this).next('.forwardHD_dropDown_menu').toggle();
    });

    $('#helpdesk_ticket_details').on('click', '.close_ticket_details', function(){

        $('#helpdesk_ticket_details .ticket_details').hide().removeClass('active_ticket_detail');
    });

    $('#helpdesk_timers_page').on('click', '.close_ticket_details', function(){
        console.log('Close Ticket details in Time Summary');
        $(this).parent().hide();
        $('#helpdesk_timer_summary.arrow').removeClass('down').addClass('left');
    });

    $('#helpdesk_page .ForwardHelpdesk').click(function () {
        if (!$(this).hasClass('disabled')) {
            $('#new_edit_HD_popup').hide();

            var ticket = $('#helpdesk_page .helpdesk_ticket.user_selected');
            if (ticket.length) {
                console.log('Requesting ForwardHelpdesk...');

                //hide Forward Helpdesk CC and BCC listing
                //$('.hd_forward_cc, .hd_forward_bcc').hide();

                $('input[name="mail_to"], input[name="mail_cc"], input[name="mail_bcc"]').checkboxradio();

                $('#adviser1, #adviser2, #adviser3, #adviser4').checkboxradio();
                $('#adviser1, #adviser2, #adviser3, #adviser4').checkboxradio('refresh');

                $('.forwardHD_popupCol2 .extra_mail_options').remove();

                var extra_mail_options = '<div class="extra_mail_options">';
                extra_mail_options += '<input type="checkbox" id="email_to_editor">';
                extra_mail_options += '<label for="email_to_editor">'+_('E-mail to editor')+'</label>';
                extra_mail_options += '</div>';

                extra_mail_options += '<div class="extra_mail_options email_customer_container">';
                extra_mail_options += '<input type="checkbox" id="email_to_customer">';
                extra_mail_options += '<label for="email_to_customer">'+_('E-mail to customer')+'</label>';
                extra_mail_options += '<input readonly data-theme="y" type="text" class="CustomerMail">';
                extra_mail_options += '</div>';

                extra_mail_options += '<div class="extra_mail_options">';
                extra_mail_options += '<input type="checkbox" id="inform_via_notify">';
                extra_mail_options += '<label for="inform_via_notify" >'+_('Inform customers about iNotify')+'</label>';
                extra_mail_options += '</div>';
                $(extra_mail_options).appendTo('.forwardHD_popupCol2');
                $('#email_to_editor, #email_to_customer, #inform_via_notify').checkboxradio();
                $('.forwardHD_popupCol2 .CustomerMail').textinput();

                $('#helpdesk_page').addClass('page_with_popup');
                $('#forwardHD_popup_overlay, #ForwardHelpdeskPopup').show();

                //following lines should be moved to init
                var helpdeskI3D = ticket.find('.helpdeskI3D').html();
                console.log('helpdeskI3D: ' + helpdeskI3D);

                var ticket_details = $('#helpdesk_ticket_details .ticket_details[data-ticketid="' + helpdeskI3D + '"]');
                console.log('Searching ticket details: '+ticket_details.length);
                var CustomerMail = ticket_details.find('.customer_email').html();

                console.log('CustomerMail: ' + CustomerMail);
                $('#ForwardHelpdeskPopup .helpdeskI3D').html(helpdeskI3D);
                $('#ForwardHelpdeskPopup .CustomerMail').val(CustomerMail);
                                               
                var login_ticket = window.localStorage.getItem('Ticket');

                var email_sub_param = {
                    Ticket: login_ticket,
                    Data: helpdeskI3D
                };
                service_request('GetHelpdeskForwardingInternalEmailSubject', email_sub_param).done(function (response) {
                    if (0 === response.Status) {
                        $.each(response.Result, function (i, result) {
                            if(result) {
                                $('#helpdesk_page .forwardHD_mail_subject').val(result);
                            }
                        });
                    }
                });

                var email_body_param = {
                    Ticket: login_ticket,
                    Data: helpdeskI3D
                };
                service_request('GetHelpdeskForwardingInternalEmailBody', email_body_param).done(function (response) {
                    if (0 === response.Status) {
                        $.each(response.Result, function (i, result) {
                            if(result) {
                                $('#helpdesk_page .forwardHD_mail_body').val(result);
                            }
                        });
                    }
                });

                /*load AppSetting for DefaultHelpdeskStateForwarding*/
                var appSettingDefaultHelpdeskStateForwarding = 690;

                var app_settings_param = {
                    Ticket: login_ticket,
                    Data: appSettingDefaultHelpdeskStateForwarding
                };
                service_request('GetAppSettingByI3D', app_settings_param).done(function (response) {

                    console.log('load AppSetting for DefaultHelpdeskStateForwarding');
                    console.log('Status: '+response.Status);
                    if (0 === response.Status) {
                        $.each(response.Result, function (i, result) {
                            if(result && result.Value) {
                                $('#status_after_forwarding').val(result.Value).change();
                            }
                        });
                    }
                });

                //hide ticket details
                $('.ticket_details').removeClass('active_ticket_detail').hide();
            }
            else {
                $( "#helpdesk_page .centron-alert-info" ).find('p').html(_('Select ticket, please.')).end().popup('open');
            }
        }
    });

    //hide details on click on blank space
    $('#helpdesk_ticket_list').click(function (e) {
        if (e.target == this) {
            console.log('actual click on #main_wrapper');
            $('#helpdesk_page .info_container.user_selected').removeClass('user_selected');
            $('#helpdesk_ticket_details .ticket_details').hide().removeClass('active_ticket_detail');
            $('.edit_helpdesk, .ForwardHelpdesk, .view_time_btn').addClass('disabled');
            if ($('.helpdesk_display_options').hasClass('helpdesk_filter')) {
                $('.helpdesk_display_options').css({ 'display': 'none' });
            }
            $('.helpdesk_display_options').removeClass('helpdesk_filter');
        }
    });

    $('#helpdesk_page').on('click', '.route', show_customer_loc);

    $('#helpdesk_page').on('click', '.gmap_close', function (e) {
        $('.gmap_outer_container').hide().css({
            'z-index': '-900'
        });
        e.stopPropagation();
    });
});
