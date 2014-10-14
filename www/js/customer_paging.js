//tested on javascriptlint.com on 12 Aug 2014

var customer_scroll, pull_up_customer_el, pull_up_customer_offset, is_customer_scrolling = false, customer_page_count  = 1;

function customer_pull_up_action () {
    var el, li, i;
    el = document.getElementById('customer_list');

    var current_page = parseInt(window.sessionStorage.getItem("customer_current_page"), 10);
    
    if(!is_customer_scrolling){

        is_customer_scrolling = true;

        var response;
        var searchText = $(".inputSearch_h").val();
        if(searchText) {
            searchText = strip_tags( searchText );
        }
        var customer_record_limit = window.localStorage.getItem('customer_record_limit');
        var service_url = window.localStorage.getItem('SERVICE_URL');
        var login_ticket = window.localStorage.getItem('Ticket');
        var customer_param = {
            Ticket: login_ticket,
            Data: {
                EntriesPerPage: customer_record_limit,
                Page: current_page+1,
                SearchText: searchText
            }
        };
        service_request('SearchCustomerBySearchTextWithPaging', customer_param).done(function(response){

            console.log('Status: '+response.Status);
            if (0 === response.Status) {
                console.log('No of Customers: ' + response.Result.length);
                if(response.Result.length){
                    create_customer_page(response);

                    current_page += 1;
                    window.sessionStorage.setItem("customer_current_page", current_page);
                                                                                   
                    $('#pull_up_customer').css('visibility', 'visible');
                }
            }
            is_customer_scrolling = false;
        }).always(function(){
            $('#pull_up_customer').removeClass('loading');
            $('#pull_up_customer .pullUpLabel').html(_('Pull up to load more...'));
        });
    }
}

function initialize_customer_iscroll4() {

	pull_up_customer_el = document.getElementById('pull_up_customer');
	pull_up_customer_offset = pull_up_customer_el.offsetHeight;
	
	customer_scroll = new iScroll('customer_wrapper', {
		useTransition: true,
		onRefresh: function () {
            if (pull_up_customer_el.className.match('loading')) {
				pull_up_customer_el.className = '';
				pull_up_customer_el.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
			}
		},
		onScrollMove: function () {
            if (this.y < (this.maxScrollY - 5) && !pull_up_customer_el.className.match('flip')) {
				pull_up_customer_el.className = 'flip';

				pull_up_customer_el.querySelector('.pullUpLabel').innerHTML = _('Release to load...');
				this.maxScrollY = this.maxScrollY;
			}
            else if (this.y > (this.maxScrollY + 5) && pull_up_customer_el.className.match('flip')) {
				pull_up_customer_el.className = '';

				pull_up_customer_el.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
				this.maxScrollY = pull_up_customer_offset;
			}
		},
		onScrollEnd: function () {

            if (pull_up_customer_el.className.match('flip')) {
                pull_up_customer_el.className = 'loading';
                pull_up_customer_el.querySelector('.pullUpLabel').innerHTML = _('Loading...');

                customer_pull_up_action();
            }
		}
	});
	
	setTimeout(function () { document.getElementById('customer_wrapper').style.left = '0'; }, 800);
}
