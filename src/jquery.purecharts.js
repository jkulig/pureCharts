/*
 * Pure Charts jQuery Plugin
 * Author: Jakub Kulig
 * Author Site: http://www.jkulig.com
 * License: Free General Public License (GPL)
 * Version: 0.5.1
 * Date: 22.05.2013
 */
(function($) {
    $.fn.pureCharts = function(type, options) {
		var defaults = { 
			height: 300,
			donut: true,
			donutRatio: 0.6
		};
		
		var options = $.extend(defaults, options);
		
		return this.each(function() {
			var	$this = $(this),
				bl = $this.children('.block'),
				i = bl.length;
						
			if (type == "bar") {
				var h = options.height / i;
				
				$this.addClass('bar');
				
				// build bar chart
				bl.css({"height": h + "px"})
				  .children('.fill').each(function() {
					   var fill = $(this),
					       value = fill.attr('data-value'),
					       color = fill.attr('data-color');
					   fill.css({"width": value, "backgroundColor": color, "lineHeight": h + "px" });
				  });
			} 
			
			if (type == "col") {
				var h = options.height,
					width = ((100 / i)) + '%';
				
				$this.addClass('cols');
				
				// build column chart					
				bl.css({height: h + "px", width: width})
				  .children('.label').css({textIndent: (60 - h) + "px"}).end()
				  .each(function() {
						var fill = $(this).children('.fill'),
						    value = fill.attr('data-value'),
						    color = fill.attr('data-color');
						fill.css({height: value, backgroundColor: color});
				  }).end();
			}
			
			if (type == "pie") {
				var h = options.height,
					dr = options.donutRatio;
					
				$this.addClass('pie');
				
				$this.each(function() {
					
					var slices = [],
						labels = [],
						counter = 0;
						//gid = $(this).attr('id');
					
					// iterate over all the slices
					$(this)
						.find('.fill').each(function() {
						    var slice = $(this),
						        label = slice.html(),
						        value = slice.attr('data-value'),
						        color = slice.attr('data-color'),
						        width = Math.round((parseInt(value)/100) * 360); // use value to calculate slice width
						    
						    // add id to slices
						    slice.addClass('slice-' + (counter + 1));
						     
						    // calculate slice pos based on previous slice start pos and its width    
						    if (slices.length > 0 ) {
						        var i = counter - 1,
						            startPos = slices[i]['end'],
						            endPos = startPos + width, 
						            midPos = (endPos + startPos) / 2;
						    } else {
						        var startPos = 0,
						        	midPos = width / 2,
						            endPos = width;
						    }
						
						    // build data array
						    slices.push({id: 'slice-' + (counter + 1), start: startPos, end: endPos, mid: midPos, val: width, col: color});
						    labels.push({lbl: label, id: 'label-' + (counter + 1), col: color});
						 
							
						    counter++;
						}).end()
						.css({"height" : h + "px", "width": h + "px" })
						.after('<p class="labels"></p>');
							//.children('.labels').css("top", px(h + 20));
					
					// create labels
					/*
$.each(labels,function() {
						
						$('#' + gid).next('.labels').append('<span id="' + this.id + '">' + this.lbl + '</span>').children('span')
							.closest('#' + this.id)
								.css( "backgroundColor", this.col);
							
					});
*/
					
					// create donut chart
					if(options.donut) {
						$(this).append('<div class="hole"></div>').children('.hole')
								.css({
									"display": 		"block",
									"borderRadius": h / (1 - dr) + "px",
									"height": 		h * dr + "px",
									"width": 		h * dr,
									"left": 		(h - (h * dr)) / 2 + "px",
									"top": 			(h - (h * dr)) / 2 + "px",
									"backgroundColor": '#ffffff'
								})
					}			
					
					// build the chart using array slices
					for (var i=0; i<counter; i++) { 
					    $('.' + slices[i]['id']).parent('.block')
					        .css({
					        	"height" : 		h + "px", 
					        	"width": 		h + "px", 
					        	"borderRadius": h/2 + "px",
					        	"transform": 	"rotate(" + slices[i]['start'] + "deg)", 
					        	"clip": 		"rect(0," + h + "px," + h + "px," + h/2 + "px)"})
					        .children('.fill')
					        	.text('')
						        .css({
						        	"height" : 			h + "px", 
						        	"width": 			h + "px", 
						        	"borderRadius": 	h/2 + "px",
						        	"backgroundColor": 	slices[i]['col'], 
						        	"transform": 		"rotate(" + slices[i]['val'] + "deg)",
						        	"clip": 			"rect(0," + h/2 + "px," + h + "px, 0)"
						        }).end();
					}
					
					
					// interaction
					/*
for (var i=0; i<counter; i++) { 
						var lb = labels[i]['id'],
							sl = slices[i]['id'],
							mid = slices[i]['mid'], 
							r = 10;
						
							expose(lb, sl, r, mid);
					}
*/
					
				
				}); //end .graph.each()
				
				
			}
			
		})	
		
		
	}
})(jQuery)

