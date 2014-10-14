//tested on javascriptlint.com on 12 Aug 2014

var myHelpdeskScroll, pullUpEl, pullUpOffset, is_helpdesk_scrolling = false, PageCount  = 1; generatedCount = 0;

function pullUpAction () {

    var el, li, i;
    el = document.getElementById('helpdesk_ticket_list');

    var helpdesk_record_limit = parseInt(window.localStorage.getItem("helpdesk_record_limit"), 10);

    var current_page = parseInt(window.sessionStorage.getItem("HDCurrentPage"), 10);

    var HelpdeskFilter = {};

    HelpdeskFilter = get_display_filter_options();
    if(!is_helpdesk_scrolling){
        current_page += 1;

        window.sessionStorage.setItem("HDCurrentPage", current_page);

        is_helpdesk_scrolling = true;
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
                if( response.Result && response.Result[0] && response.Result[0].PageCount ) {
                    PageCount = response.Result[0].PageCount;

                    if(current_page <= PageCount){
                        create_helpdesk_page(response);
                                    
                        myHelpdeskScroll.refresh();
                    }
                    else {
                        current_page -= 1;
                        myHelpdeskScroll.refresh();
                    }
                }
            }
        }).always(function(){
            is_helpdesk_scrolling = false;
        });
    }
}

function initialize_helpdesk_iscroll4() {

	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;

	myHelpdeskScroll = new iScroll('iscroll4_wrapper', {
		useTransition: true,
		onRefresh: function () {
            if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
			}
		},
		onScrollMove: function () {
            if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = _('Release to load...');
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function () {

            var current_page = parseInt(window.sessionStorage.getItem("HDCurrentPage"), 10);

            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = _('Loading...');

                pullUpAction();
            }
		}
	});

	setTimeout(function () { document.getElementById('iscroll4_wrapper').style.left = '0'; }, 800);
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initialize_helpdesk_iscroll4, 50);

    setTimeout(initialize_article_iscroll4, 50);

    setTimeout(initialize_crm_iscroll4, 50);

    setTimeout(initialize_customer_iscroll4, 50);

    setTimeout(initialize_serial_number_iscroll4, 50);

    setTimeout(initialize_todo_list_iscroll4, 50);

}, false);
