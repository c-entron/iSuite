//tested on javascriptlint.com on 10 Jul 2014

var todo_list_scroll, pull_up_todo_list_el, pull_up_todo_list_offset, is_todo_list_scrolling = false, todo_list_page_count  = 1;

function todo_list_pull_up_action () {
    console.log('todo_list_pull_up_action');
    var el, li, i;

    var current_page = parseInt(window.sessionStorage.getItem("todo_list_current_page"), 10);
    
    if(!is_todo_list_scrolling){

        is_todo_list_scrolling = true;

        var response;
        var withDiscarded = false;
        var onlyOwn = false;

        var now = new Date().valueOf();
        var toDate = '\/Date(' + now + get_time_offset() + ')\/';

        if(!$("#OnlyOwn").is(':checked')){
            onlyOwn = false;
        }

        if($("#WithDiscarded").is(':checked')){
            withDiscarded = true;
        }

        if($("#ToDate").val()){
            var current = $("#ToDate").val();
            dateParts = current.split('.');
            current = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], 00, 00).valueOf();
            toDate = '\/Date(' + current + get_time_offset() + ')\/';
        }

        var login_ticket = window.localStorage.getItem('Ticket');
        var CurrentAppUserI3D = parseInt(window.localStorage.getItem("CurrentAppUserI3D"), 10);
        current_page = current_page+1;
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
            if (0 === response.Status) {

                if(response.Result && response.Result.length){
                    update_todo_list(response);

                    current_page += 1;
                    window.sessionStorage.setItem("todo_list_current_page", current_page);
                }
            }
            else if(1 == response.Status){
                $('#pull_up_todo_list').removeClass('loading');
                $('#pull_up_todo_list .pullUpLabel').html(_('Pull up to load more...'));
            }
            is_todo_list_scrolling = false;
        });
    }
}

function initialize_todo_list_iscroll4() {
    window.sessionStorage.setItem("todo_list_current_page", 1);

	pull_up_todo_list_el = document.getElementById('pull_up_todo_list');
	pull_up_todo_list_offset = pull_up_todo_list_el.offsetHeight;
	
	todo_list_scroll = new iScroll('todo_list_wrapper', {
		useTransition: true,
		onRefresh: function () {
            if (pull_up_todo_list_el.className.match('loading')) {
				pull_up_todo_list_el.className = '';
				pull_up_todo_list_el.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
			}
		},
		onScrollMove: function () {
            if (this.y < (this.maxScrollY - 5) && !pull_up_todo_list_el.className.match('flip')) {
				pull_up_todo_list_el.className = 'flip';

				pull_up_todo_list_el.querySelector('.pullUpLabel').innerHTML = _('Release to load...');
				this.maxScrollY = this.maxScrollY;
			}
            else if (this.y > (this.maxScrollY + 5) && pull_up_todo_list_el.className.match('flip')) {
				pull_up_todo_list_el.className = '';

				pull_up_todo_list_el.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
				this.maxScrollY = pull_up_todo_list_offset;
			}
		},
		onScrollEnd: function () {

            if (pull_up_todo_list_el.className.match('flip')) {
                pull_up_todo_list_el.className = 'loading';
                pull_up_todo_list_el.querySelector('.pullUpLabel').innerHTML = _('Loading...');

                todo_list_pull_up_action();
            }
		}
	});
	
	setTimeout(function () { document.getElementById('todo_list_wrapper').style.left = '0'; }, 800);
}
