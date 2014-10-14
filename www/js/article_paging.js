//tested on javascriptlint.com on 12 Aug 2014

var article_scroll, pull_up_article_el, pull_up_article_offset, is_articles_scrolling = false, article_page_count  = 1;

function article_pull_up_action () {
    var el, li, i;
    el = document.getElementById('article_accordion');

    var distributor_i3d = $('#distributor_dropdown').val();
    var search_text = $('#distributor_search_text').val().trim();
    if(search_text) {
        search_text = strip_tags( search_text );
    }
    var current_page = parseInt(window.sessionStorage.getItem("article_current_page"), 10);
    
    if(!is_articles_scrolling){

        is_articles_scrolling = true;

        var login_ticket = window.localStorage.getItem('Ticket');
        var article_param = {
            Ticket: login_ticket,
            Data:{
                EntriesPerPage: 10,
                Filter: {
                    DistributorI3D: distributor_i3d,
                    SearchText: search_text
                },
                Page: current_page+1
            }
        };
        service_request('SearchArticleWithPaging', article_param).done(function(response){
            if (0 === response.Status) {
                if(response.Result && response.Result.length){
                    create_article_page(response);

                    current_page += 1;
                    window.sessionStorage.setItem("article_current_page", current_page);

                    $('#pull_up_article').show();
                }
                else {
                    $('#pull_up_article').removeClass('loading');
                    $('#pull_up_article .pullUpLabel').html(_('No more Articles'));
                }
            }
            is_articles_scrolling = false;
        });
    }
}

function initialize_article_iscroll4() {

	pull_up_article_el = document.getElementById('pull_up_article');
	pull_up_article_offset = pull_up_article_el.offsetHeight;
	
	article_scroll = new iScroll('article_wrapper', {
		useTransition: true,
		onRefresh: function () {
            if (pull_up_article_el.className.match('loading')) {
				pull_up_article_el.className = '';
				pull_up_article_el.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
			}
		},
		onScrollMove: function () {
            if (this.y < (this.maxScrollY - 5) && !pull_up_article_el.className.match('flip')) {
				pull_up_article_el.className = 'flip';

				pull_up_article_el.querySelector('.pullUpLabel').innerHTML = _('Release to load...');
				this.maxScrollY = this.maxScrollY;
			}
            else if (this.y > (this.maxScrollY + 5) && pull_up_article_el.className.match('flip')) {
				pull_up_article_el.className = '';

				pull_up_article_el.querySelector('.pullUpLabel').innerHTML = _('Pull up to load more...');
				this.maxScrollY = pull_up_article_offset;
			}
		},
		onScrollEnd: function () {

            if (pull_up_article_el.className.match('flip')) {
                pull_up_article_el.className = 'loading';
                pull_up_article_el.querySelector('.pullUpLabel').innerHTML = _('Loading...');

                article_pull_up_action();
            }
		}
	});
	
	setTimeout(function () { document.getElementById('article_wrapper').style.left = '0'; }, 800);
}
