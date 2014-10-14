//tested on javascriptlint.com on 12 Aug 2014

var crm_scroll, pull_up_crm_el, pull_up_crm_offset, is_crm_scrolling = false, crm_page_count  = 1;

function crm_pull_up_action () {

    var el, li, i;
    el = document.getElementById('crm_ticket_list');

    var current_page = parseInt(window.sessionStorage.getItem("crm_current_page"), 10);
    
    if(!is_crm_scrolling){

        is_crm_scrolling = true;

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
                page: current_page+1
            }
        };
        var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
        if(CustomerI3D) {
            CustomerI3D = parseInt(CustomerI3D, 10);
            crm_param.Data.CRMActivityFilter.CustomerI3D = CustomerI3D;
        }
        service_request('SearchCRMActivitiesThroughPaging', crm_param).done(function (response) {

            if (0 === response.Status) {
                console.log('No of CRM: ' + response.Result[0].Result.length);
                if(response.Result && response.Result[0] && response.Result[0].Result && response.Result[0].Result.length){
                    create_crm_page(response);

                    current_page += 1;
                    window.sessionStorage.setItem("crm_current_page", current_page);
                                                                                   
                    $('#pull_up_crm').css('visibility', 'visible');
                }
                else {
                    $('#pull_up_crm').removeClass('loading');
                    $('#pull_up_crm .pullUpLabel').html(_('Pull up to load more...'));
                }
            }
            is_crm_scrolling = false;
        });
    }
}

function initialize_crm_iscroll4() {

	pull_up_crm_el = document.getElementById('pull_up_crm');
	pull_up_crm_offset = pull_up_crm_el.offsetHeight;
	
	crm_scroll = new iScroll('crm_wrapper', {
		useTransition: true,
		onRefresh: function () {
            if (pull_up_crm_el.className.match('loading')) {
				pull_up_crm_el.className = '';
				pull_up_crm_el.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
			}
		},
		onScrollMove: function () {
            if (this.y < (this.maxScrollY - 5) && !pull_up_crm_el.className.match('flip')) {
				pull_up_crm_el.className = 'flip';

				pull_up_crm_el.querySelector('.pullUpLabel').innerHTML = _('Release to load...');
				this.maxScrollY = this.maxScrollY;
			}
            else if (this.y > (this.maxScrollY + 5) && pull_up_crm_el.className.match('flip')) {
				pull_up_crm_el.className = '';

				pull_up_crm_el.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
				this.maxScrollY = pull_up_crm_offset;
			}
		},
		onScrollEnd: function () {

            if (pull_up_crm_el.className.match('flip')) {
                pull_up_crm_el.className = 'loading';
                pull_up_crm_el.querySelector('.pullUpLabel').innerHTML = _('Loading...');

                crm_pull_up_action();
            }
		}
	});
	
	setTimeout(function () { document.getElementById('crm_wrapper').style.left = '0'; }, 800);
}
