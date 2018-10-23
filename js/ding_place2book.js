/**
 * @file
 *
 * Provide event nodes/pages with ticket info from Place2book
 */
jQuery(document).ready(function($) {
	$('.place2book-ticketinfo').each(function() { 
            debugger;
	    var obj = this;
            if(Drupal.settings.ding_place2book.pre_loader_url != undefined)
            {
                $(obj).parent().append("<div class='p2b_preloader'><a target='_blank' href='"+Drupal.settings.ding_place2book.pre_loader_url+"'>Bestil billet(ter)</a><i class='fa fa-cog fa-spin fa-2x fa-fw'></i><div>");
            }
            else
            {
                $(obj).parent().append("<div class='p2b_preloader'><i class='fa fa-cog fa-spin fa-2x fa-fw'></i><div>");
            }
		$.getJSON(Drupal.settings.basePath + 'ding/place2book/ticketinfo/' + this.value + "?time=" + new Date().getTime(), function(data) {
		  $(obj).replaceWith(data['markup']);
                  $('.p2b_preloader').remove();
		});		
    });
});