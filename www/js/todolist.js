//tested on javascriptlint.com on 15 Jul 2014

function update_todo_list(response){

	if( response.Result && response.Result.length ) {

		for (var i = 0; i < response.Result.length; i++) {

			console.log('Count: '+response.Result[i].Count);
			var responseHtml = "<div>";

			var date, due_date;
			var areas = [], area, area_slug;
			var customer_i3d, customer_name;
			var helpdesk_i3d, object_raw_type;
			var description, todo_comment, todo_number;

			if( response.Result[i] ){

				if(response.Result[i] && response.Result[i].Result ){

					for (var j = 0; j < response.Result[i].Result.length; j++) {

						if(!isEmpty(response.Result[i]) && !isEmpty(response.Result[i].Result[j])) {

							area = response.Result[i].Result[j].Area;
							area = area ? area : '_blank_';

							areas.push(area);

							if(response.Result[i].Result[j].Date) {
                                var date_moment = moment( response.Result[i].Result[j].Date );
                                date = date_moment.format("DD.MM.YYYY");
                            }
							if(response.Result[i].Result[j].DueDate) {
                                var due_date_moment = moment( response.Result[i].Result[j].DueDate );
                                due_date = due_date_moment.format("DD.MM.YYYY");
                            }
							customer_i3d = customer_name = '';
							if(response.Result[i].Result[j].Customer && response.Result[i].Result[j].Customer.I3D && response.Result[i].Result[j].Customer.Name) {
								customer_i3d = response.Result[i].Result[j].Customer.I3D;
								customer_name = response.Result[i].Result[j].Customer.Name;
							}
							area_slug = css_friendly_name(area);

							description = response.Result[i].Result[j].Description;
							if( !description ) {
								description = '';
                            }
							if(response.Result[i].Result[j].Comment) {
								todo_comment = response.Result[i].Result[j].Comment;
								todo_comment = todo_comment ? todo_comment : '';
							}

							if(response.Result[i].Result[j].Number){
								todo_number = response.Result[i].Result[j].Number;
                                todo_number = todo_number ? todo_number : 0;
							}

							helpdesk_i3d = response.Result[i].Result[j].ObjectI3D;
							object_raw_type = response.Result[i].Result[j].ObjectRawType;

							if(helpdesk_i3d && object_raw_type) {

								responseHtml += '<p data-helpdesk_i3d="'+helpdesk_i3d+'" data-object_raw_type="'+object_raw_type+'" class="'+area_slug+'">' + ' ' + todo_number+' | '+ date+' | '+ due_date+' | '+ todo_comment+ '</br>'+customer_i3d+' '+customer_name+'</br>'+description+'</p>';
							}
						}
					}
				}
			}
			responseHtml += '</div>';

			var unique_areas = areas.filter( onlyUnique );

			var rearrangedHtml = '';
			var collection = '';
			$.each(unique_areas, function(i, area){
				area_slug = css_friendly_name(area);

				rearrangedHtml += '<div data-role="collapsible" data-collapsed="false" class="centron_icon" data-collapsed-icon="down-open" data-expanded-icon="up-open"><h3>' + area + '</h3>';

				$(responseHtml).find('.'+area_slug).map(function(j, html){
					rearrangedHtml += '<p class="todo" data-helpdesk_i3d="'+$(html).data('helpdesk_i3d')+'" data-object_raw_type="'+$(html).data('object_raw_type')+'">' + $(html).html() + '</p>';
				});

				rearrangedHtml += '</div>';
			});

			$('#todo_list_data').html(rearrangedHtml);
			$('#todo_list_data').find('div[data-role=collapsible]').collapsible();
            todo_list_scroll.refresh();
		}
	}
	else {
		console.log('GetTodosThroughPaging: empty response');
	}
}

$.mobile.document.on( "pagecreate", "#todo_list_page", function() {

    $( "#todo_list_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#todo_list_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    $('#toDoListBack').click(function(){

        $('#todo_list_page .display_options').removeClass('todo_filters_visible');

        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });

    $('#open_todo_filters').click(function(){
        console.log('toggle todo filters');
                                  
        var target = $('#todo_list_page .display_options');
        target.toggleClass('todo_filters_visible');
    });

    $('#todo_list_page').click(function(e){
        if(this == e.target){
            $('#todo_list_page .display_options').removeClass('todo_filters_visible');
        }
    });

    var user_lang = window.localStorage.getItem('user_lang');
    if(!user_lang) {
        user_lang = 'en';
    }
    $("#ToDate").mobiscroll().date({
        animate: 'fade',
        preset: 'datetime',
        theme: 'android-ics light',
        mode: 'scroller',
        display: 'modal',
        lang: user_lang,
        dateFormat: 'dd.mm.yy',
        dateOrder: 'ddmmy'
    });

    $("#WithDiscarded, #OnlyOwn, #ToDate").change(function(){
        var withDiscardedFilter = false;
        var onlyOwnFilter = false;

        var now = new Date().valueOf();
        var toDate = '\/Date(' + now + get_time_offset() + ')\/';

        if(!$("#OnlyOwn").is(':checked')){
            onlyOwnFilter = false;
        }

        if($("#WithDiscarded").is(':checked')){
            withDiscardedFilter = true;
        }

        if( $("#ToDate").val() ){
          var current = $("#ToDate").val();
          dateParts = current.split('.');
          current = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], 00, 00).valueOf();
          toDate = '\/Date(' + current + get_time_offset() + ')\/';
        }
        console.log('onlyOwn: '+onlyOwnFilter);
        console.log('withDiscarded: '+withDiscardedFilter);
        GetTodosThroughPagingdataList(toDate, onlyOwnFilter, withDiscardedFilter);
    });

    $('#todo_list_data').on('click', 'p.todo', function(){
        var HelpdeskI3D = $(this).data('helpdesk_i3d');
        console.log('HelpdeskI3D: '+HelpdeskI3D);

        var object_raw_type = $(this).data('object_raw_type');
        //if ToDos are for helpdesk
        if(10 == object_raw_type) {
                            
            var login_ticket = window.localStorage.getItem('Ticket');
            var helpdek_param = {Ticket: login_ticket, Data: HelpdeskI3D};
            service_request('GetHelpdeskByI3D', helpdek_param).done(function (response) {

                if (0 === response.Status && response.Result) {
                    console.log('response.Status: '+response.Status);

                    if(Array.isArray(response.Result) && response.Result.length ){
                        var result = response.Result[0];

                        var ticket_details = $("#todo_details .ticket_details");

                        if(ticket_details.length){

                            var short_desc = result.ShortDescription;
                            short_desc = short_desc ? short_desc : '';
                            ticket_details.find('.hd_short_desc').html(short_desc);

                            var due_date = '';
                            if(result.DueDate) {
                                var due_date_moment = moment( result.DueDate );
                                due_date = due_date_moment.format("DD.MM.YYYY HH:mm");
                            }

                            var created_date = '';
                            if(result.CreatedDate) {

                                var created_date_moment = moment( result.CreatedDate );
                                created_date = created_date_moment.format("DD.MM.YYYY HH:mm");
                            }

                            var helpdesk_number = '';
                            if(result.Number) {
                                helpdesk_number = result.Number;
                            }

                            var helpdesk_created_by = '';
                            if(result.CreatedBy) {
                                helpdesk_created_by = result.CreatedBy.DisplayText;
                                helpdesk_created_by = helpdesk_created_by ? helpdesk_created_by : '';
                            }

                            var headlines = '<h2 class="headline_text"><span class="hd_short_desc">'+short_desc+'</span> | '+helpdesk_number+'</h2>';
                            headlines += '<h2 class="headline_text">'+_('Due on')+' '+due_date+', '+_('Record by')+' '+helpdesk_created_by+'<span class="normal_text">'+' (at '+created_date+')'+'</span></h2>';

                            ticket_details.find('.headline_text').remove();
                            ticket_details.find('.close_ticket_details').after(headlines);

                            var description = result.Description;
                            description = description ? description : '';
                            if(description) {
                                ticket_details.find('.hd_description').html(description);
                            }
                            ticket_details.find('.helpdesk_number').html(helpdesk_number);

                            var status_caption = result.HelpdeskStatusCaption;
                            status_caption = status_caption ? status_caption : '';
                            if(status_caption) {
                                ticket_details.find('.hd_status').html(status_caption);
                            }
                            ticket_details.find('.hd_due_date').html(due_date);
                            ticket_details.find('.hd_record_date').html(created_date);

                            var priority_caption = result.HelpdeskPriorityCaption;
                            priority_caption = priority_caption ? priority_caption : '';
                            if(priority_caption) {
                                ticket_details.find('.priority').html(priority_caption);
                            }

                            var type_name = result.HelpdeskType ? result.HelpdeskType.Name : '';
                            type_name = type_name ? type_name : '';
                            if(type_name) {
                                ticket_details.find('.hd_type').html(type_name);
                            }
                            if(result.MainCategory && result.MainCategory.Name) {
                                ticket_details.find('.main_cat').html(result.MainCategory.Name);
                            }
                            if(result.SubCategory1 && result.SubCategory1.Name) {
                                ticket_details.find('.sub_cat').html(result.SubCategory1.Name);
                            }
                            if(result.SubCategory2 && result.SubCategory2.Name) {
                                ticket_details.find('.sub_cat2').html(result.SubCategory2.Name);
                            }
                            if(result.ContractCaption) {
                                ticket_details.find('.contract').html(result.ContractCaption);
                            }
                            if(result.ResponsiblePerson && result.ResponsiblePerson.DisplayText) {
                                    ticket_details.find('.responsible').html(result.ResponsiblePerson.DisplayText);
                                    ticket_details.find('.editor').html(result.ResponsiblePerson.DisplayText);
                            }

                            if(result.AddressI3D){
                                var AddressI3D = parseInt(result.AddressI3D, 10);
                                var login_ticket = window.localStorage.getItem('Ticket');
                                var contact_param = {
                                    Ticket: login_ticket,
                                    Data: {
                                        AddressI3D: AddressI3D,
                                        OnlyActive: true
                                    }
                                };
                                service_request('GetContactsFromAddress', contact_param).done(function(response){

                                    var i, contact;
                                    $.each(response.Result, function (i, contact) {
                                        if(contact && contact.Default && true === contact.Default) {
                                            var contact_name, contact_salutation, contact_firstname, contact_lastname;
                                            var contact_email1, contact_phone_business1;

                                            contact_salutation = (contact.Salutation) ? contact.Salutation.Salutation : '';
                                            contact_salutation = contact_salutation ? contact_salutation : '';

                                            contact_firstname = contact.Firstname;
                                            contact_firstname = contact_firstname ? contact_firstname : '';

                                            contact_lastname = contact.Lastname;
                                            contact_lastname = contact_lastname ? contact_lastname : '';

                                            contact_name = contact_salutation+' '+contact_firstname+' '+contact_lastname;
                                            ticket_details.find('.contact_name').html(contact_name);

                                            contact_email1 = contact.EMail1;
                                            contact_email1 = contact_email1 ? contact_email1 : '';
                                            ticket_details.find('.email1').html(contact_email1);

                                            contact_phone_business1 = contact.PhoneBusiness1;
                                            contact_phone_business1 = contact_phone_business1 ? contact_phone_business1 : '';
                                            ticket_details.find('.phoneBusiness1').html(contact_phone_business1);
                                        }
                                    });
                                });
                            }

                            if(result.CustomerI3D) {

                                var CustomerI3D = parseInt(result.CustomerI3D, 10);
                                ticket_details.find('.CustomerI3D').html(CustomerI3D);

                                var customer_param = {
                                    Ticket: login_ticket,
                                    Data: CustomerI3D
                                };
                                service_request('GetCustomerByI3D', customer_param).done(function(response){

                                    if (0 === response.Status) {
                                        var i, result;
                                        if(Array.isArray(response.Result) && response.Result.length) {
                                            $.each(response.Result, function (i, result) {
                                                var customer_email = result.EMail;
                                                if(customer_email) {
                                                    ticket_details.find('.customer_email').html(customer_email);
                                                    ticket_details.data('customer_email', customer_email);
                                                }
                                            });
                                        }
                                    }
                                });
                            }

                            if(result.CustomerName) {
                                ticket_details.find('.CustomerName').html(result.CustomerName);
                            }
                            if(result.CustomerStreet) {
                                ticket_details.find('.CustomerStreet').html(result.CustomerStreet);
                            }
                            if(result.CustomerZip) {
                                ticket_details.find('.CustomerZip').html(result.CustomerZip+'&nbsp;');
                            }
                            if(result.CustomerCity) {
                                ticket_details.find('.CustomerCity').html(result.CustomerCity);
                            }

                            $("#todo_details .ticket_details").show();
                        }
                        else {
                            console.log('#todo_details .ticket_details not found');
                        }
                        translate();
                        $( "#todo_details" ).show();
                    }
                }
            });
        }
    });

    $('#todo_details .close_ticket_details').on('click', function(){
        $('#todo_details .field_value label').html('');
        $( "#todo_details" ).hide();
    });

    $('#todo_list_data').on( "expand", 'div[data-role=collapsible]', function( event, ui ) {
        console.log('Todo List expand');
        var collapsibles  = $('#todo_list_data [data-role="collapsible"]').length;
        var collapsed = $('#todo_list_data .ui-collapsible-collapsed').length;

        if(collapsibles === collapsed) {
            todo_list_scroll.refresh();
            todo_list_scroll.disable();
            $('#pull_up_todo_list').hide();
        } else {
            todo_list_scroll.refresh();
            todo_list_scroll.enable();
            $('#pull_up_todo_list').show();
        }
    });

    $('#todo_list_data').on( "collapse", 'div[data-role=collapsible]', function( event, ui ) {
        console.log('Todo List collapse');
        var collapsibles  = $('#todo_list_data [data-role="collapsible"]').length;
        var collapsed = $('#todo_list_data .ui-collapsible-collapsed').length;

        if(collapsibles === collapsed) {
            todo_list_scroll.disable();
            $('#pull_up_todo_list').hide();
        } else {
            todo_list_scroll.enable();
            $('#pull_up_todo_list').show();
        }
    });
});

$.mobile.document.on( "pagebeforeshow", "#todo_list_page", function() {
    $( "#todo_details" ).hide();
    textAreaAttributes();
});

$.mobile.document.on( "pageshow", "#todo_list_page", function() {

    var withDiscarded = false;
    $('#WithDiscarded').prop( "checked", false ).checkboxradio( "refresh" );

    var onlyOwn = true;
    $('#OnlyOwn').prop( "checked", true ).checkboxradio( "refresh" );

    var now = new Date().valueOf();
    var toDate = '\/Date(' + now + get_time_offset() + ')\/';
    $('#ToDate').val('');

    GetTodosThroughPagingdataList(toDate, onlyOwn, withDiscarded);
});

function GetTodosThroughPagingdataList(toDate, onlyOwn, withDiscarded){
    $('#todo_list_data').html('');
    
    var login_ticket = window.localStorage.getItem('Ticket');
    var CurrentAppUserI3D = parseInt(window.localStorage.getItem("CurrentAppUserI3D"), 10);
    var current_page = 1;
    var todo_param = {
        Ticket: login_ticket,
        Data: {
            EntriesPerPage: 100*current_page,
            Page: 1,
            IsDescending: true,
            Sort: 3,
            ToDoFilter: {
                EmployeeI3D: CurrentAppUserI3D,
                ToDate: toDate,
                OnlyOwn: onlyOwn,
                WithDiscarded: withDiscarded
            }
        }
    };
    service_request('GetTodosThroughPaging', todo_param).done(function(response){
        update_todo_list(response);
    });
}
