//tested on javascriptlint.com on 12 Aug 2014

//CustomerSelected: I3D of Customer selected
//CustomerI3D: currently viewd Customer I3D

function make_customer_favorite(target) {
	target.addClass('icon-star');

	var i3d = $('#selected_customer_i3d').html();
	var customer = $('#selected_customer_name').html();

	var street = $('#selected_customer_i3d').data('street');
	var zip = $('#selected_customer_i3d').data('zip');
	var city = $('#selected_customer_i3d').data('city');
	var country = $('#selected_customer_i3d').data('country');

	var customer_obj = {
		I3D: i3d,
		Name: customer,
		Street: street,
		Zip: zip,
		City: city,
		Country: country
	};
	insertFavouriteCustomer (customer_obj);
}

function download_customer_data () {
    if(window.localStorage.getItem('offline_mode') == 'off') {

        var login_ticket = window.localStorage.getItem('Ticket');

        var current_page_id = $.mobile.activePage.attr("id");
        $('#' + current_page_id + ' .overlay_when_downloading').show();
        
        //on download add customer to favourites
        //var target;
        //if(current_page_id === 'customer_details_page') {
        //    target = $('#selected_customer_headline .fav_customer_symbol');
        //    make_customer_favorite(target);
        //}

        var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
        CustomerI3D = parseInt(CustomerI3D, 10);

        //Customer
        var customer_details = window.sessionStorage.getItem('CustomerDetails');
        if(customer_details) {
            saveCustomerDetails ( customer_details );
        }

        //Customer Addresses
        var address_details = window.sessionStorage.getItem('AddressDetails');
        if(address_details) {
            saveCustomerAddressDetails (JSON.parse(address_details));
        }

        //Customer Contacts
        //saveContactDetails saves both Contacts and Contact images
        var contacts_dfd = $.Deferred();

        var contact_param = {
            Ticket: login_ticket,
            Data: CustomerI3D
        };
        service_request('GetAddressContactsFromCustomer', contact_param).done(function(response){
            if(0 === response.Status) {
                
                if(response.Result) {
                    contacts_dfd.resolve();
                    saveContactDetails (response.Result);
                } else {
                    contacts_dfd.reject();
                }
            } else {
                contacts_dfd.reject();
            }
        });

        //CRM-Details for customer block
        var crm_details_dfd = $.Deferred();
        var param = {
            Ticket: login_ticket,
            Data: CustomerI3D
        };
        service_request('GetCRMDetailsFromCustomerI3D', param).done(function(response){
            if(0 === response.Status) {
                if(response.Result) {
                    crm_details_dfd.resolve();
                    saveCRMDetails (response.Result);
                } else {
                    crm_details_dfd.reject();
                }
            } else {
                crm_details_dfd.reject();
            }
        });

        //CRM-Activities for CRM block
        var crm_activities_dfd = $.Deferred();
        var CRMActivityFilter= {
            CustomerI3D: CustomerI3D,
            OnlyActiv: true,
            OnlyOwn: true
        };
        
        var crm_param = {
            Ticket: login_ticket,
            Data: {
                CRMActivityFilter: CRMActivityFilter,
                Sort: 'I3D',
                descending: true,
                entriesPerPage: 500,
                page: 1
            }
        };
        service_request('SearchCRMActivitiesThroughPaging', crm_param).done(function (response) {
            if (0 === response.Status) {
                if(response.Result && response.Result[0] && response.Result[0].Result) {
                    crm_activities_dfd.resolve();
                    saveCRMActivities(response.Result[0].Result);
                } else {
                    crm_activities_dfd.reject();
                }
            } else {
                crm_activities_dfd.reject();
            }
        });

        //Hotlines
        var hotlines_dfd = $.Deferred();
        var hotline_param = {
            Ticket: login_ticket,
            Data: CustomerI3D
        };
        service_request('GetHotlinesFromCustomerByI3D', hotline_param).done(function(response){
            if(0 === response.Status) {
                if(response.Result) {
                    hotlines_dfd.resolve();
                    saveHotlines (response.Result);
                } else {
                    hotlines_dfd.reject();
                }
            } else {
                hotlines_dfd.reject();
            }
        });

        //Contracts
        var contracts_dfd = $.Deferred();
        var contract_param = {
            Ticket: login_ticket,
            Data: CustomerI3D
        };

        service_request('GetContractsByCustomerI3D', contract_param).done(function (response) {
            if(0 === response.Status) {
                if(response.Result) {
                    contracts_dfd.resolve();
                    saveContracts (response.Result);
                } else {
                    contracts_dfd.reject();
                }
            } else {
                contracts_dfd.reject();
            }
        });

        //Master Data List
        var mdl_dfd = $.Deferred();
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
        service_request('SearchMasterDataListsThroughPaging', mdl_param).done(function(response){
            if(0 === response.Status) {
                if(response.Result && response.Result[0] && response.Result[0].Result) {
                    mdl_dfd.resolve();
                    saveMasterDataLists (response.Result[0].Result);
                } else {
                    mdl_dfd.reject();
                }
            } else {
                mdl_dfd.reject();
            }
        });

        //Device Links
        var device_links_dfd = $.Deferred();
        var link_param = {
            Ticket: login_ticket,
            Data: {
                CustomerI3D: CustomerI3D
            }
        };
        service_request('GetDeviceLinks', link_param).done(function(response){
            if (0 === response.Status) {
                if (response.Result) {
                    device_links_dfd.resolve();
                    saveDeviceLinks (response.Result);
                } else {
                    device_links_dfd.reject();
                }
            } else {
                device_links_dfd.reject();
            }
        });

        //Categories
        var helpdesk_categories_dfd = $.Deferred();
        service_request('GetActiveHelpdeskCategories', { Ticket: login_ticket}).done(function(response){
            if(0 === response.Status) {
                if (response.Result) {
                    helpdesk_categories_dfd.resolve();
                    saveHelpdeskCategories (response.Result);
                } else {
                    helpdesk_categories_dfd.reject();
                }
            } else {
                helpdesk_categories_dfd.reject();
            }
        });

        //Articles
        var employee_i3d = window.localStorage.getItem('CurrentAppUserI3D');
        var emp_article_param = {
            EmployeeI3D: employee_i3d,
            IsDefault: false,
            OnlyOwn: true
        };
        var employee_articles_dfd = $.Deferred();
        service_request('GetEmployeeArticles', { Ticket: login_ticket, Data: emp_article_param}).done(function(response){
            if(0 === response.Status) {
                if(response.Result) {
                    employee_articles_dfd.resolve();
                    saveEmployeeArticles (response.Result);
                } else {
                    employee_articles_dfd.reject();
                }
            } else {
                employee_articles_dfd.reject();
            }
        });

        //Employees
        var employees_dfd = $.Deferred();
        service_request('GetEmployees', { Ticket: login_ticket}).done(function(response){
            if(0 === response.Status) {
                if (response.Result) {
                    employees_dfd.resolve();
                    saveEmployees (response.Result);
                } else {
                    employees_dfd.reject();
                }
            } else {
                employees_dfd.reject();
            }
        });

        //Employees Departments
        var employee_departments_dfd = $.Deferred();
        service_request('GetEmployeeDepartments', { Ticket: login_ticket}).done(function(response){
            if(0 === response.Status) {
                if(response.Result) {
                    employee_departments_dfd.resolve();
                    saveEmployeeDepartments (response.Result);
                } else {
                    employee_departments_dfd.reject();
                }
            } else {
                employee_departments_dfd.reject();
            }
        });

        //States
        var helpdesk_states_dfd = $.Deferred();
        service_request('GetHelpdeskStates', { Ticket: login_ticket}).done(function(response){
            if(0 === response.Status) {
                if (response.Result) {
                    helpdesk_states_dfd.resolve();
                    saveHelpdeskStates (response.Result);
                } else {
                    helpdesk_states_dfd.reject();
                }
            } else {
                helpdesk_states_dfd.reject();
            }
        });

        //Priorities
        var helpdesk_priorities_dfd = $.Deferred();
        service_request('GetActiveHelpdeskPriorities', { Ticket: login_ticket }).done(function(response){
            if(0 === response.Status) {
                if(response.Result) {
                    helpdesk_priorities_dfd.resolve();
                    saveHelpdeskPriorities (response.Result);
                } else {
                    helpdesk_priorities_dfd.reject();
                }
            } else {
                helpdesk_priorities_dfd.reject();
            }
        });

        //Types
        var helpdesk_types_dfd = $.Deferred();
        service_request('GetHelpdeskTypes', { Ticket: login_ticket }).done(function(response){
            if(0 === response.Status) {
                if(response.Result) {
                    helpdesk_types_dfd.resolve();
                    saveHelpdeskTypes (response.Result);
                } else {
                    helpdesk_types_dfd.reject();
                }
            } else {
                helpdesk_types_dfd.reject();
            }
        });

        //Timer Types
        var helpdesk_timer_types_dfd = $.Deferred();
        service_request('GetHelpdeskTimerTypes', {Ticket: login_ticket }).done(function (response) {
            if(0 === response.Status) {
                if(response.Result){
                    helpdesk_timer_types_dfd.resolve();
                    saveHelpdeskTimerTypes (response.Result);
                } else {
                    helpdesk_timer_types_dfd.reject();
                }
            } else {
                helpdesk_timer_types_dfd.reject();
            }
        });

        //AppSettings
        //load label and value of adviser checkboxes: adviser1', 'adviser2', 'adviser3', 'adviser4
        //load value of DefaultStatus, DefaultResponsibility, DefaultHelpdeskStateForwarding, InactiveHelpdeskStatusI3D
        var app_settings_dfd = $.Deferred();
        $(function () {
            //setup an array of to loop through
            var adviser = [959, 960, 961, 962, 687, 1512, 173, 690, 696], current = 0;
            var checkbox_id = ['adviser1', 'adviser2', 'adviser3', 'adviser4', 'DefaultStatus', 'DefaultResponsibility', 'DefaultPriority', 'DefaultHelpdeskStateForwarding', 'InactiveHelpdeskStatusI3D'];
            var advisers_html = '';
          
            var login_ticket = window.localStorage.getItem('Ticket');
            var app_settings_param = {
                Ticket: login_ticket
            };

            function do_ajax() {

                if (current < adviser.length) {
                    app_settings_param.Data = adviser[current];
                    service_request('GetAppSettingByI3D', app_settings_param).done(function (response) {

                        var label_for = checkbox_id[current];
                        if(label_for) {
                            var I3D = adviser[current];
                            var value;
                            current++;

                            if (0 === response.Status) {
                                if(adviser.length === current) {
                                    //End of loop
                                    app_settings_dfd.resolve();
                                }

                                $.each(response.Result, function (i, result) {
                                    if(result) {
                                        value = null;
                                        if( label_for.indexOf('adviser') === 0 ) {
                                            value = result.ValueText;
                                        } else {
                                            value = result.Value.toString();
                                        }

                                        if(value) {
                                            saveAppSetting(I3D, label_for, value);
                                        }
                                    }
                                });
                            } else {
                                if(adviser.length === current) {
                                    //End of loop
                                    app_settings_dfd.reject();
                                }
                            }
                            do_ajax();
                        }
                    });
                }
            }
            do_ajax();
        });

        //Helpdesks
        //saveHelpdesksToDevice saves both Helpdesks and Helpdesk Timers

        var customerHelpdeskCount = parseInt($('#customerHelpdeskCount').html(), 10) || parseInt($('#favHelpdeskCount').html(), 10);
        if(customerHelpdeskCount) {

            var helpdesks_dfd = $.Deferred();

            var helpdesk_param = {
                Ticket: login_ticket,
                Data: {
                    Descending: true,
                    EntriesPerPage: customerHelpdeskCount,
                    HelpdeskFilter: {
                        OnlyActive: true,
                        CustomerI3D: CustomerI3D
                    },
                    Page: 1,
                    Sort: 1
                }
            };
            service_request('GetHelpdesksThroughPaging', helpdesk_param).done(function (response) {
                if (0 === response.Status) {
                    if(response.Result && response.Result[0] && response.Result[0].Result){
                        console.log('Downloading Helpdesks : '+response.Result[0].Result.length);
                        var helpdesk_timers_dfd = saveHelpdesksToDevice (response.Result[0].Result);
                        $.when(helpdesk_timers_dfd).then(function(){
                            helpdesks_dfd.resolve();
                        });
                    } else {
                        helpdesks_dfd.reject();
                    }
                } else {
                    helpdesks_dfd.reject();
                }
            });
        }

        $.when( contacts_dfd, crm_details_dfd, crm_activities_dfd, hotlines_dfd, contracts_dfd, mdl_dfd, device_links_dfd, helpdesk_categories_dfd, employee_articles_dfd, employees_dfd, employee_departments_dfd, helpdesk_states_dfd, helpdesk_priorities_dfd, helpdesk_types_dfd, helpdesk_timer_types_dfd, helpdesks_dfd, app_settings_dfd ).then(function(){
            console.log('Got them all...');
            $('.overlay_when_downloading').hide();
        });
    }
}

function onRemoveFavCustomer() {
    var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
    if(CustomerI3D) {
        db.transaction( function(tx){ removeFavCustomer(tx, CustomerI3D); }, function(){console.log('ErrorCallBack');} );
    }
    else {
        console.log('onRemoveFavCustomer: CustomerI3D not found');
    }
}

function onBefore(curr, next, opts) {
    var index = opts.nextSlide;
    console.log('Slider index: '+index);
    $('#customer_contact_dropdown').val(index);
    $('#customer_contact_dropdown_dummy').val($('#customer_contact_dropdown option[value="'+index+'"]').html());
}

$.mobile.document.on( "pagecreate", "#customer_details_page", function() {
    $( "#customer_details_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#customer_details_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    $('#customer_details_close').click(function(){
        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });

    $('#backBtnCustomerDetails').click(function(){
        $.mobile.changePage('#customer_page', {
            transition: "flip",
            changeHash: false
        });
    });
                     
                     
    var lang = window.localStorage.getItem('user_lang');
    if(!lang) {
        lang = 'en';
    }
    $('#customer_contact_dropdown').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });
    $('#customer_contact_dropdown_dummy').click(function () {
        $('#customer_contact_dropdown').mobiscroll('show');
        return false;
    });

    $('#customer_details_page .customer_details_address').on('click', 'ul', function(){
        console.log('click on addesss');
        $('#customer_details_page .customer_details_address ul').removeClass('selected_address');
        $(this).addClass('selected_address');

        var AddressI3D = $(this).data('address_i3d');
        AddressI3D = parseInt(AddressI3D, 10);
        var ticket = window.localStorage.getItem('Ticket');

        var param = {
            Ticket: ticket,
            Data: {
                AddressI3D: AddressI3D,
                OnlyActive: true
            }
        };
        service_request('GetContactsFromAddress', param).done(function(response){

            if (0 === response.Status) {
                console.log('No of contacts: '+response.Result.length);

                var contact;
                var response_html = '';
                var contact_dropdown_html = '';
                var contact_name = '';
                var contact_salutation, contact_firstname, contact_lastname;
                var contact_email1, contact_email2;
                var contact_phone_business1, contact_phone_business2;
                var contact_phone_mobile, contact_phone_private;
                $.each(response.Result, function (i, contact) {
                    if(contact && contact.I3D) {
                        contact_salutation = (contact.Salutation) ? contact.Salutation.Salutation : '';

                        contact_firstname = contact.Firstname;
                        contact_firstname = contact_firstname ? contact_firstname : '';

                        contact_lastname = contact.Lastname;
                        contact_lastname = contact_lastname ? contact_lastname : '';

                        contact_name = contact_salutation+' '+contact_firstname+' '+contact_lastname;

                        contact_dropdown_html += '<option value="'+i+'">'+contact_firstname+' '+contact_lastname+'</option>';

                        response_html += '<li>';
                        response_html += '<ul class="customer_contact" data-contact_i3d="'+contact.I3D+'">';

                        response_html += '<li class="contact_photo">';
                        response_html += '<div class="contact_photo_container">';
                        response_html += '<img src="img/contact_placeholder.png" width="130" height="168">';
                        response_html += '</div>';
                        response_html += '</li>';

                        response_html += '<li class="contact_name">'+contact_name+'</li>';

                        contact_email1 = contact.EMail1;
                        contact_email1 = contact_email1 ? contact_email1 : '';
                        response_html += '<li>';
                        response_html += '<div class="field_label">E-Mail1</div>';

                        response_html += '<div id="" class="field_value" >'+'<a href="mailto:'+contact_email1+'">'+contact_email1+'</a>'+'</div>';
                        response_html += '</li>';

                        contact_email2 = contact.EMail2;
                        contact_email2 = contact_email2 ? contact_email2 : '';
                        response_html += '<li>';
                        response_html += '<div class="field_label">E-Mail2</div>';
                        response_html += '<div id="" class="field_value" >'+'<a href="mailto:'+contact_email2+'">'+contact_email2+'</a>'+'</div>';
                        response_html += '</li>';
                        response_html += '<li></li>';

                        contact_phone_business1 = contact.PhoneBusiness1;
                        contact_phone_business1 = contact_phone_business1 ? contact_phone_business1 : '';
                        response_html += '<li>';
                        response_html += '<div class="field_label">'+_('Phone Number 1')+'</div>';

                        response_html += '<div id="" class="field_value" >'+'<a href="tel:'+contact_phone_business1+'">'+contact_phone_business1+'</a>'+'</div>';
                        response_html += '</li>';

                        contact_phone_business2 = contact.PhoneBusiness2;
                        contact_phone_business2 = contact_phone_business2 ? contact_phone_business2 : '';
                        response_html += '<li>';
                        response_html += '<div class="field_label">'+_('Phone Number 2')+'</div>';
                        response_html += '<div id="" class="field_value" >'+'<a href="tel:'+contact_phone_business2+'">'+contact_phone_business2+'</a>'+'</div>';
                        response_html += '</li>';

                        contact_phone_mobile = contact.PhoneMobile;
                        contact_phone_mobile = contact_phone_mobile ? contact_phone_mobile : '';
                        response_html += '<li>';
                        response_html += '<div class="field_label">'+_('Phone Mobile')+'</div>';
                        response_html += '<div id="" class="field_value" >'+'<a href="tel:'+contact_phone_mobile+'">'+contact_phone_mobile+'</a>'+'</div>';
                        response_html += '</li>';

                        contact_phone_private = contact.PhonePrivate;
                        contact_phone_private = contact_phone_private ? contact_phone_private : '';
                        response_html += '<li>';
                        response_html += '<div class="field_label">'+_('Phone Private')+'</div>';
                        response_html += '<div id="" class="field_value" >'+'<a href="tel:'+contact_phone_private+'">'+contact_phone_private+'</a>'+'</div>';
                        response_html += '</li>';
                        response_html += '</ul>';
                        response_html += '</li>';

                        var load_photo_contact = window.localStorage.getItem("load_photo_contact");
                        console.log('load_photo_contact: ' + load_photo_contact);
                        if ('1' == load_photo_contact) {
                            var photo_load_delay = parseInt(window.localStorage.getItem("photo_load_delay"), 10);

                            window.setTimeout(function(){

                                var param = {
                                    Ticket: ticket,
                                    Data: contact.I3D
                                };
                                service_request('GetContactPersonImage', param).done(function(response){

                                    if (0 === response.Status) {
                                        if(response.Result && response.Result[0]) {
                                            var img_data = response.Result[0];
                                            if(img_data) {
                                                $('ul.customer_contact[data-contact_i3d='+contact.I3D+'] .contact_photo img').attr('src', 'data:image/png;base64,' + img_data);
                                            }
                                        }
                                    }
                                });
                            }, photo_load_delay);
                        }
                    }
                });
                $('#customer_contact_slider').html(response_html);

                $('.nav').remove();

                $('#customer_contact_slider').after('<div class="nav">').cycle({
                    pager: '#customer_details_page .nav',
                    before: onBefore,
                    timeout: 0
                });
                                                              
                // **** Hide more than 18 .nav a
                hideTraverseNav(18); // pass max count

                $('#customer_contact_dropdown').html(contact_dropdown_html);
                $('#customer_contact_dropdown').mobiscroll('init');
                var lang = window.localStorage.getItem('user_lang');
                if(!lang) {
                    lang = 'en';
                }
                $('#customer_contact_dropdown').mobiscroll('option', { lang: lang });
            }
        });
    });
/*
    $('#customer_details_page .contact_dropdown').on('click', 'li', function(){
        console.log('Move to index: '+$(this).data('index'));
                              
        $('#customer_details_page .contact_dropdown li').removeClass('selected_contact');
        $(this).addClass('selected_contact');
                              
        $('.contact_slider').cycle($(this).data('index'));
    });
*/
    $('#customer_contact_dropdown').change(function(){
        var index = parseInt($(this).val(), 10);
        console.log('Change of contact: '+ index);
        if(!isNaN(index)) {
            $('#customer_contact_slider').cycle(index);
        }
    });
/*
    $('#customer_details_page .contact_dropdown_opener').click(function(){
        var the_opener = $(this);
        if(the_opener.hasClass('icon-left-open')) {
            the_opener.removeClass('icon-left-open').addClass('icon-down-open');
            $('#customer_details_page .contact_dropdown').show();
        }
        else {
            the_opener.addClass('icon-left-open').removeClass('icon-down-open');
            $('#customer_details_page .contact_dropdown').hide();
        }
    });
*/
    /*footer buttons*/

    /*List Helpdesks*/
    $('#customer_details_page .list_helpdesk').click(function(){
        //var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
        //window.sessionStorage.setItem('LoadHelpdeskWithCustomerI3D', CustomerI3D);

        $('#customer_details_page .select_customer').click();
        $.mobile.changePage('#helpdesk_page',{transition: 'flip', changeHash: false,reloadPage : false});
    });

    /*Show New Helpdesk form*/
    $('#customer_details_page .customer_new_helpdesk').click(function(){

        $('#customer_details_page .select_customer').click();
        window.sessionStorage.setItem('LoadHelpdeskWithNewHelpdesk', 1);
        $.mobile.changePage('#helpdesk_page',{transition: 'flip', changeHash: false,reloadPage : false});
    });

    /*List CRMs*/
    $('#customer_details_page .list-crm').click(function(){

        $('#customer_details_page .select_customer').click();
        $.mobile.changePage('#crm_page',{transition: 'flip', changeHash: false,reloadPage : false});
    });

    /*Show New CRM form*/
    $('#customer_details_page .new_crm').click(function(){

        $('#customer_details_page .select_customer').click();
        window.sessionStorage.setItem('LoadCRMWithNewCRM', 1);
        $.mobile.changePage('#crm_page',{transition: 'flip', changeHash: false,reloadPage : false});
        
    });

    /*Sales Information*/
    $('#customer_details_page .customer_sales_info').click(function(){
        console.log('Requesting Sales Information');

        var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
        CustomerI3D = parseInt(CustomerI3D, 10);
        var ticket = window.localStorage.getItem('Ticket');

        var param = {
            Ticket: ticket,
            Data: CustomerI3D
        };
        service_request('GetCRMDetailsFromCustomerI3D', param).done(function(response){

            if(0 === response.Status && response.Result) {

                console.log('GetCRMDetailsFromCustomerI3D  No of responses:'+response.Result.length);

                var two_years_ago = response.Result[0];
                var previous_year = response.Result[1];
                var current_year = response.Result[2];

                if(two_years_ago && previous_year && current_year) {
                    var A1 = current_year.SumOfOffers - previous_year.SumOfOffers;

                    var A2 = 0;
                    if ( previous_year.SumOfOffers === 0 ) {
                        A2 = 0;
                    }
                    else {
                        A2 = ( current_year.SumOfOffers / previous_year.SumOfOffers) * 100;
                        A2 = parseInt(A2, 10);
                    }

                    var B1 = (current_year.Sales - previous_year.Sales).toFixed(2);

                    var B2 = 0;
                    if (previous_year.Sales === 0) {
                        B2 = 0;
                    }
                    else {
                        B2 = (current_year.Sales / previous_year.Sales) * 100;
                        B2 = parseInt(B2, 10);
                    }

                    var C1 = (current_year.Earnings - previous_year.Earnings).toFixed(2);

                    var C2 = 0;
                    if (previous_year.Earnings === 0) {
                        C2 = 0;
                    }
                    else { 
                        C2 = (current_year.Earnings / previous_year.Earnings) * 100;
                        C2 = parseInt(C2, 10);
                    }

                    var D1 = current_year.SumOfAttendance - previous_year.SumOfAttendance;

                    var D2 = 0;
                    if (previous_year.SumOfAttendance === 0) {
                        D2 = 0;
                    }
                    else {
                        D2 = (current_year.SumOfAttendance / previous_year.SumOfAttendance) * 100;
                        D2 = parseInt(D2, 10);
                    }

                    var data = '<table width="100%" class="border_table" >';

                    data += '<thead><tr>';
                    data += '<th class="years_col"></th><th class="wide_col">'+_('Sum of offers')+'</th><th class="narrow_col">'+_('Ct.')+'</th><th class="wide_col">'+_('Open orders (incl. services)')+'</th>'+
                                '<th class="narrow_col">'+_('Ct.')+'</th>'+
                                '<th class="wide_col">'+_('Turnover')+'</th>'+
                                '<th class="wide_col">'+_('Earings')+'</th>'+
                                '<th class="wide_col">'+_('Sum of attendance')+'</th>'+
                                '<th class="narrow_col">'+_('hour')+'</th>'+
                            '</tr></thead>';
                    data += '<tbody><tr>'+
                            '<td>'+_('2 years ago')+'</td>'+
                            '<td>'+localise(two_years_ago.SumOfOffers)+'</td>'+
                            '<td>'+localise(two_years_ago.OffersCount)+'</td>'+
                            '<td></td>'+
                            '<td></td>'+
                            '<td>'+localise(two_years_ago.Sales)+'</td>'+
                            '<td>'+localise(two_years_ago.Earnings)+'</td>'+
                            '<td>'+localise(two_years_ago.SumOfAttendance)+'</td>'+
                            '<td>'+localise(two_years_ago.Time)+'</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>'+_('Previous year')+'</td>'+
                            '<td>'+localise(previous_year.SumOfOffers)+'</td>'+
                            '<td>'+localise(previous_year.OffersCount)+'</td>'+
                            '<td></td>'+
                            '<td></td>'+
                            '<td>'+localise(previous_year.Sales)+'</td>'+
                            '<td>'+localise(previous_year.Earnings)+'</td>'+
                            '<td>'+localise(previous_year.SumOfAttendance)+'</td>'+
                            '<td>'+localise(previous_year.Time)+'</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>'+_('Current year')+'</td>'+
                            '<td>'+localise(current_year.SumOfOffers)+'</td>'+
                            '<td>'+localise(current_year.OffersCount)+'</td>'+
                            '<td>'+localise(current_year.SumOfOpenErrands)+'</td>'+
                            '<td>'+localise(current_year.OpenErrandsCount)+'</td>'+
                            '<td>'+localise(current_year.Sales)+'</td>'+
                            '<td>'+localise(current_year.Earnings)+'</td>'+
                            '<td>'+localise(current_year.SumOfAttendance)+'</td>'+
                            '<td>'+localise(current_year.Time)+'</td>'+
                        '</tr>'+
                        '</tbody><tfoot>'+
                        '<tr>'+
                            '<td>'+_('Difference')+'</td>'+
                            '<td>'+localise(A1)+'</td>'+
                            '<td></td>'+
                            '<td></td>'+
                            '<td></td>'+
                            '<td>'+localise(B1)+'</td>'+
                            '<td>'+localise(C1)+'</td>'+
                            '<td>'+localise(D1)+'</td>'+
                            '<td></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>%</td>'+
                            '<td>'+A2+'%'+'</td>'+
                            '<td></td>'+
                            '<td></td>'+
                            '<td></td>'+
                            '<td>'+B2+'%'+'</td>'+
                            '<td>'+C2+'%'+'</td>'+
                            '<td>'+D2+'%'+'</td>'+
                            '<td></td>'+
                        '</tr>'+
                        '</tfoot>'+
                        '</table>';

                    console.log('CRM Details collected. Presenting...');
                    $('#customer_details_page .sales_information .main_table_class').html(data);
                    $('#customer_details_page .sales_information').popup( "open" );
                }
            }
        });
    });

    $('#popupDeleteFavDialog').on('popupbeforeposition', function( event, ui ) {
        console.log('beforeposition on popup');
        $('#popupDeleteFavDialog h1').html(_('Delete customer from your favourites?'));
        $('#popupDeleteFavDialog h3').html(_('Confirm, please!'));
        $('#popupDeleteFavDialog .remove_fav_no .ui-btn-text').html(_('Cancel'));
        $('#popupDeleteFavDialog .remove_fav_yes .ui-btn-text').html(_('Delete'));
    });

    /*Make a Customer favourite*/
    $('#customer_details_page .fav_customer').click(function(){
        console.log('Favourite Customer request...');
        var target = $('#selected_customer_headline .fav_customer_symbol');

        if(target.hasClass('icon-star')) {
            console.log('remove after confirmation');
            $('#popupDeleteFavDialog').popup( "open" );
        }
        else {
            make_customer_favorite(target);
        }
    });

    $('#customer_details_page .remove_fav_no').click(function(){
        console.log('No! Do not remove fav customer!');
    });

    $('#customer_details_page .remove_fav_yes').click(function(){
        console.log('Yes! Remove fav customer!');
        onRemoveFavCustomer();
    });

    /*Select a Customer*/
    $('#selected_customer_headline .customer_details_top, #customer_details_page .select_customer').click(function(){

        $('#selected_customer_headline').addClass('selected_customer');
        $('.select_customer').addClass('icon-ok');

        var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');

        window.sessionStorage.setItem('CustomerSelected', CustomerI3D);
                                       
        var CustomerName = $('#selected_customer_name').html();
        window.sessionStorage.setItem('CustomerName', CustomerName);
                                           
        $('#wheel_selected_customer_name').html(CustomerName);
        $('#span_selected_customer').show();
        $('#span_no_selected_customer').hide();
        $('#remove_selected_customer').show();
    });

    $('#customer_details_page .download_customer').click(function(){
        download_customer_data();
    });

    $('.sales_info_close').click(function(){
        $('#customer_details_page .sales_information').popup( "close" );
    });
/*
    $('.customer_details_contact').on('click', '.nav a', function(){
        $('.contact_dropdown_opener').addClass('icon-left-open').removeClass('icon-down-open');
        $('.contact_dropdown').hide();
    });
*/
});

$.mobile.document.on( "pagehide", "#customer_details_page", function() {
    $('#customer_details_adviser1, #customer_details_adviser2, #customer_details_pl1, #customer_details_pl2').html('');
    $('#customer_details_phone, #customer_details_fax, #customer_details_email, #customer_details_web').html('');
                    
    $('#selected_customer_headline .fav_customer_symbol').removeClass('icon-star');
    $('.nav').remove();
    $('#customer_details_page .contact_dropdown').html('');

    $('#selected_customer_i3d, #selected_customer_name, .customer_details_address').html('');
    
    window.sessionStorage.removeItem('CustomerDetails');
    window.sessionStorage.removeItem('AddressDetails');
});

$.mobile.document.on( "pagebeforeshow", "#customer_details_page", function() {
    textAreaAttributes();
    $('#customer_contact_slider').html('<li>'+_('Please select an address.')+'</li>');

    if(window.localStorage.getItem('offline_mode') == 'on'){
        $('#customer_details_page .download_customer').addClass('disabled');
    }else{
        $('#customer_details_page .download_customer').removeClass('disabled');
    }
                     
    if(window.sessionStorage.getItem('CustomerSelected') == window.sessionStorage.getItem('CustomerI3D')) {
        $('#selected_customer_headline').addClass('selected_customer');
        $('.select_customer').addClass('icon-ok');
    }
    else {
        $('#selected_customer_headline').removeClass('selected_customer');
        $('.select_customer').removeClass('icon-ok');
    }
                     
    $('#customer_contact_dropdown_dummy').val('');
                     
    var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
    db.transaction( function(tx){ is_customer_fav(tx, CustomerI3D); }, function(){console.log('ErrorCallBack');} );
});

$.mobile.document.on( "pageshow", "#customer_details_page", function() {

    var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
    $('#selected_customer_i3d').html(CustomerI3D);
    console.log('CustomerI3D: '+CustomerI3D);

    var ticket = window.localStorage.getItem('Ticket');
    var param = {
        Ticket: ticket,
        Data: CustomerI3D
    };

    service_request('GetCustomerByI3D', param).done(function(response){
        if (0 === response.Status) {
            window.sessionStorage.setItem('CustomerDetails', JSON.stringify(response.Result[0]));
            var result = '';
            
            $.each(response.Result, function (i, result) {
                if(result && result.I3D && result.Name && result.HelpdeskCount) {
                    $('#selected_customer_name').html(result.Name);
                    var CustomerI3D = result.I3D;
                    $('#customerHelpdeskCount').html(result.HelpdeskCount);
                       
                    var advisers = '';
                    var value_text = '';
                    
                    var adviser1 = window.sessionStorage.getItem('adviser1');
                    
                    if(adviser1) {
                        advisers += '<li class="adviser"><div class="field_label">'+adviser1+'</div>';
                        if(result.Adviser1) {
                            value_text = result.Adviser1.DisplayText;
                            if(!value_text) {
                                value_text = '';
                            }
                        }
                        advisers += '<div id="customer_details_adviser1" class="field_value" >'+value_text+'</div></li>';
                    }
                    
                    var adviser2 = window.sessionStorage.getItem('adviser2');
                    value_text = '';
                    if(adviser2) {
                        advisers += '<li class="adviser"><div class="field_label">'+adviser2+'</div>';
                        if(result.Adviser2) {
                            value_text = result.Adviser2.DisplayText;
                            if(!value_text) {
                                value_text = '';
                            }
                        }
                        advisers += '<div id="customer_details_adviser2" class="field_value" >'+value_text+'</div></li>';
                    }
                    
                    var adviser3 = window.sessionStorage.getItem('adviser3');
                    value_text = '';
                    if(adviser3) {
                        advisers += '<li class="adviser"><div class="field_label">'+adviser3+'</div>';
                        if(result.Adviser3) {
                            value_text = result.Adviser3.DisplayText;
                            if(!value_text) {
                                value_text = '';
                            }
                        }
                        advisers += '<div id="customer_details_pl1" class="field_value" >'+value_text+'</div></li>';
                    }
                       
                    var adviser4 = window.sessionStorage.getItem('adviser4');
                    value_text = '';
                    if(adviser4) {
                        advisers += '<li class="adviser"><div class="field_label">'+adviser4+'</div>';
                        if(result.Adviser4) {
                            value_text = result.Adviser4.DisplayText;
                            if(!value_text) {
                                value_text = '';
                            }
                        }
                        advisers += '<div id="customer_details_pl2" class="field_value" >'+value_text+'</div></li>';
                    }

                    $('.customer_details_info ul .adviser').remove();
                    $('.customer_details_info ul').prepend(advisers);

                    if(result.Phone) {
                        $('#customer_details_phone').html('<a href="tel:'+result.Phone+'">'+result.Phone+'</a>');
                    }
                    if(result.Fax) {
                        $('#customer_details_fax').html('<a href="tel:'+result.Fax+'">'+result.Fax+'</a>');
                    }
                    if(result.EMail) {
                        $('#customer_details_email').html('<a href="mailto:'+result.EMail+'">'+result.EMail+'</a>');
                    }
                    if(result.Website) {
                        var url = addhttp(result.Website);
                        var handler = 'window.open("'+url+'","_blank","location=yes")';
                        $('#customer_details_web').html('<a href="#" onclick='+handler+'>'+result.Website+'</a>');
                    }
                       
                    var default_address = result.DefaultAddress;
                    if(default_address){
                        var street = default_address.Street;
                        street = street ? street : '';
                        $('#selected_customer_i3d').data('street', street);
                       
                        var zip = default_address.Zip;
                        zip = zip ? zip : '';
                        $('#selected_customer_i3d').data('zip', zip);
                       
                        var city = default_address.City;
                        city = city ? city : '';
                        $('#selected_customer_i3d').data('city', city);
                           
                        var country = '';
                        if(default_address.Country){
                           country = default_address.Country.Name;
                           country = country ? country : '';
                        }
                        $('#selected_customer_i3d').data('country', country);
                    }
                       
                    var address_content = '';
                    if(1 == result.AddressCount) {
                        console.log('Using DefaultAddress');
                        var address = result.DefaultAddress;
                       
                        window.sessionStorage.setItem('AddressDetails', JSON.stringify([address]));
                       
                        var address_street = '', address_zip = '', address_city = '', address_country_name = '';
                        if(address && address.I3D) {
                            address_street = address.Street;
                            if(!address_street) {
                                address_street = '';
                            }
                            address_zip = address.Zip;
                            if(!address_zip) {
                                address_zip = '';
                            }
                            address_zip = address.City;
                            if(!address_zip) {
                                address_zip = '';
                            }
                            address_country_name = address.Country ? address.Country.Name : '';
                            if(!address_country_name) {
                                address_country_name = '';
                            }
                            address_content += '<ul data-address_i3d="'+address.I3D+'">';
                            address_content += '<li><div class="field_label">'+_('Street')+'</div><div class="customer_details_street field_value" >'+address_street+'</div></li>';

                            address_content += '<li><div class="field_label">'+_('Postcode City')+'</div><div class="customer_details_city field_value" >'+address_zip+' '+address_city+'</div></li>';

                            address_content += '<li><div class="field_label">'+_('Country')+'</div><div class="customer_details_country field_value" >'+address_country_name+'</div></li>';
                            address_content += '</ul>';

                            $('#customer_details_page .customer_details_address ul').remove();
                            $('#customer_details_page .customer_details_address').append(address_content);
                        }
                    }
                    else {
                        //Not Using DefaultAddress
                        var address_param = {
                            Ticket: ticket,
                            Data: {
                                CustomerI3D: CustomerI3D,
                                OnlyActive: true
                            }
                        };

                        service_request('GetAddressesFromCustomer', address_param).done(function(response){
                            if (0 === response.Status) {
                                window.sessionStorage.setItem('AddressDetails', JSON.stringify(response.Result));

                                var addr_result;

                                var addr_result_street, addr_result_zip, addr_result_city, addr_result_country_name;
                                $.each(response.Result, function (i, addr_result) {
                                    if(addr_result && addr_result.I3D) {
                                        address_content += '<ul data-address_i3d="'+addr_result.I3D+'">';
                                           
                                        addr_result_street = addr_result.Street;
                                        if(!addr_result_street) {
                                            addr_result_street = '';
                                        }
                                        address_content += '<li><div class="field_label">'+_('Street')+'</div><div class="customer_details_street field_value" >'+addr_result_street+'</div></li>';
                                           
                                        addr_result_zip = addr_result.Zip;
                                        if(!addr_result_zip) {
                                            addr_result_zip = '';
                                        }
                                       
                                        addr_result_city = addr_result.City;
                                        if(!addr_result_city) {
                                             addr_result_city = '';
                                        }

                                        address_content += '<li><div class="field_label">'+_('Postcode City')+'</div><div class="customer_details_city field_value" >'+addr_result_zip+' '+addr_result_city+'</div></li>';
                                           
                                        addr_result_country_name = addr_result.Country ? addr_result.Country.Name : '';
                                        if(addr_result_country_name) {
                                            addr_result_country_name = '';
                                        }
                                        address_content += '<li><div class="field_label">'+_('Country')+'</div><div class="customer_details_country field_value" >'+addr_result_country_name+'</div></li>';
                                        address_content += '</ul>';
                                    }
                                });
                                $('#customer_details_page .customer_details_address ul').remove();
                                $('#customer_details_page .customer_details_address').append(address_content);
                            }
                        });
                    }
                }
            });
        }
    });
});
