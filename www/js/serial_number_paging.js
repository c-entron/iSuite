//tested on javascriptlint.com on 10 Jul 2014

var serial_number_scroll, pull_up_serial_number_el, pull_up_serial_number_offset, is_serial_number_scrolling = false, serial_number_page_count  = 1;

function serial_number_pull_up_action () {
    var el, li, i;

    var current_page = parseInt(window.sessionStorage.getItem("serial_number_current_page"), 10);

    if(!is_serial_number_scrolling){

        is_serial_number_scrolling = true;

        var response;
        var barcode = $('#serial_number_input').val();
        if(barcode) {
            barcode = strip_tags( barcode );
        }
        var login_ticket = window.localStorage.getItem('Ticket');
        var barcode_param = {
            Ticket: login_ticket,
            Data: {
                BarcodeFilter: {
                    Barcode: barcode
                },
                EntriesPerPage: 10,
                Page: current_page+1
            }
        };
        service_request('GetBarcodesThroughPaging', barcode_param).done(function (response) {
            if (0 === response.Status && response.Result && response.Result[0] && response.Result[0].Result) {

                create_serial_number_list(response);

                current_page += 1;
                window.sessionStorage.setItem("serial_number_current_page", current_page);

                $('#pull_up_serial_number').css('visibility', 'visible');
            }
            else {
                $('#pull_up_serial_number').removeClass('loading');
                $('#pull_up_serial_number .pullUpLabel').html(_('Pull up to load more...'));
            }
            is_serial_number_scrolling = false;
        });
    }
}

function initialize_serial_number_iscroll4() {

	pull_up_serial_number_el = document.getElementById('pull_up_serial_number');
	pull_up_serial_number_offset = pull_up_serial_number_el.offsetHeight;
	
	serial_number_scroll = new iScroll('serial_number_wrapper', {
		useTransition: true,
		onRefresh: function () {
            if (pull_up_serial_number_el.className.match('loading')) {
				pull_up_serial_number_el.className = '';
				pull_up_serial_number_el.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
			}
		},
		onScrollMove: function () {

            if (this.y < (this.maxScrollY - 5) && !pull_up_serial_number_el.className.match('flip')) {
				pull_up_serial_number_el.className = 'flip';

				pull_up_serial_number_el.querySelector('.pullUpLabel').innerHTML = _('Release to load...');
				this.maxScrollY = this.maxScrollY;
			}
            else if (this.y > (this.maxScrollY + 5) && pull_up_serial_number_el.className.match('flip')) {
				pull_up_serial_number_el.className = '';

				pull_up_serial_number_el.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
				this.maxScrollY = pull_up_serial_number_offset;
			}
		},
		onScrollEnd: function () {

            if (pull_up_serial_number_el.className.match('flip')) {
                pull_up_serial_number_el.className = 'loading';
                pull_up_serial_number_el.querySelector('.pullUpLabel').innerHTML = _('Loading...');

                serial_number_pull_up_action();
            }
		}
	});
	
	setTimeout(function () { document.getElementById('serial_number_wrapper').style.left = '1%'; }, 800);
}
