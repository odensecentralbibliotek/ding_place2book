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
                $(obj).parent().append("<div class='p2b_preloader'><a target='_blank' href='"+Drupal.settings.ding_place2book.pre_loader_url+"'>Bestil billet(ter)</a><span class='fa fa-cog fa-spin fa-2x fa-fw'></span><div>");
            }
            else
            {
                $(obj).parent().append("<div class='p2b_preloader'><span class='fa fa-cog fa-spin fa-2x fa-fw'></span><div>");
            }
		$.getJSON(Drupal.settings.basePath + 'ding/place2book/ticketinfo/' + this.value + "?time=" + new Date().getTime(), function(data) {
		  $(obj).replaceWith(data['markup']);
                  $('.p2b_preloader').remove();
		});		
    });
    
    //TODO: Move to place2book module.
    function bindPlace2bookEvents()
    {
        
        if ($('#search_input').length != 0 && $.fn.fastLiveFilter !== undefined) {
            $('#search_input').fastLiveFilter('.fastfilter');
            UpdatePlace2bookEventStatus();
        } else if ($('.view-display-id-library_featured_event_list_view').length) {
            UpdatePlace2bookEventStatus();
        }
        $(document).ajaxSuccess(UpdatePlace2bookEventStatus);
    }
    function UpdatePlace2bookEventStatus(event, xhr, settings) {

        $('.p2b_event_list_btn_wrap').each(function () { // For each element
            $(this).children().addClass('btn');
            if ($(this).text().trim() === '')
                $(this).remove(); // if it is empty, it removes it
        });
        $('#panel-bootstrap-region-centreret .btn-warning').addClass('btn');
        if ($('select[name="provider_options[interest_period]"]').val() === '') {
            $(".form-item-provider-options-interest-period label").css("color", "red");

        } else {
            $(".form-item-provider-options-interest-period label").css("color", "green").removeClass('error');
        }
        //Only execute if we are requesting TicketInfo throu ajax.
        if (settings !== undefined && settings.url.indexOf("/ding/place2book/ticketinfo/ajax/") === 0
                && settings.url.indexOf("onlinebooq") !== 0) {

            return;
        };
        //Klubtilbud_tooltips();
        //Make sure that live filtering works aswell.
        if ($('#search_input').length && $.fn.fastLiveFilter !== undefined) {
            $('#search_input').fastLiveFilter('.fastfilter');
        }
        //Update Place2Book Status for list 
        var NodeArray = new Array();
        Place2BookEvents = [];
        $('.list-item .views-field-field-place2book-tickets .field-content, .thumbnail .views-field-field-place2book-tickets .field-content').each(function (index, val) {
            var Nodeid = $(val.parentNode.parentNode).find(".views-field-nid .field-content").text();
            var PlaceHolder = $(val.parentNode.parentNode).find(".views-field-field-place2book-tickets .field-content").text();
            if (Nodeid !== undefined && Nodeid !== "" && $(val.parentNode.parentNode).find(".p2b_preloader").length == 0) {
                NodeArray.push(Nodeid);
                Place2BookEvents.push(val);
            }
        });

        
        if (NodeArray.length === 0) {
            return;
        }
        $.each(Place2BookEvents, function (index, val) {
            //debugger;
            if (Drupal.settings.ding_place2book.pre_loader_url !== undefined) {
                $(val.parentNode.parentNode).append("<div class='p2b_preloader' style='float:right;'><a target='_blank' href='" + Drupal.settings.ding_place2book.pre_loader_url + "'>Bestil billet(ter)</a><span class='fa fa-cog fa-spin fa-2x fa-fw'></span><div>");
            } else {
                $(val.parentNode.parentNode).append("<div class='p2b_preloader' style='float:right;'><span class='fa fa-cog fa-spin fa-2x fa-fw'></span><div>");
            }
        });
        //Retrive shown events status. ( Making it appear more responsive loading to user)
        $.each(NodeArray, function (index, obj) {

            if (obj === "") {
                return;
            }
            setTimeout(function () {
                var json = JSON.stringify([obj]);
                $.ajax({
                    url: "/ding/place2book/ticketinfo/ajax/" + json,
                    cache: false,
                    success: function (data) {
                        $.each(data, function (index, obj) {

                            $('.list-item .views-field-nid .field-content, .thumbnail .views-field-nid .field-content').each(function (index, val) {
                                if (obj.nid === val.innerHTML) {
                                    $(val.parentNode).once().before("<div class='p2b_event_list_btn_wrap'>" + obj.markup + "</div>");
                                    $(val.parentNode).addClass('js-hide');
                                    $(val.parentNode.parentNode).find(".p2b_preloader").addClass('js-hide');
                                    //return;                  
                                }
                            });
                        });
                    }

                });
            }, 100);

        });
    };
    bindPlace2bookEvents();
    
});