//tested on javascriptlint.com on 10 Jul 2014

jQuery(document).ready(function($){

	var target_id = "language_select";
                       
    $('#' + target_id + '-button').addClass($('#'+target_id).find(':selected').attr('icon'));
                       
	$('#' + target_id + ' option').each(function () {
		var ind = $(this).index();
		$('#' + target_id + '-menu').find('[data-option-index=' + ind + ']').addClass($(this).attr('icon'));
	});
	var last_style;

	$('#' + target_id).on('change', function () {
		var selection = $(this).find(':selected').attr('icon');
		if (last_style) {
			$(this).closest('.ui-select').find('.ui-btn').removeClass(last_style);
		}
		$(this).closest('.ui-select').find('.ui-btn').addClass(selection);
		last_style = selection;
	});
});
