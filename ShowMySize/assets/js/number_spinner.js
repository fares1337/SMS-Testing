! function (t) {
	var n = t.event.dispatch || t.event.handle,
		e = t.event.special,
		a = "D" + +new Date,
		l = "D" + (+new Date + 1);
	e.scrollstart = {
		setup: function (l) {
			var c, s = t.extend({
				latency: e.scrollstop.latency
			}, l),
				i = function (t) {
					var e = this,
						a = arguments;
					c ? clearTimeout(c) : (t.type = "scrollstart", n.apply(e, a)), c = setTimeout(function () {
						c = null
					}, s.latency)
				};
			t(this).bind("scroll", i).data(a, i)
		},
		teardown: function () {
			t(this).unbind("scroll", t(this).data(a))
		}
	}, e.scrollstop = {
		latency: 150,
		setup: function (a) {
			var c, s = t.extend({
				latency: e.scrollstop.latency
			}, a),
				i = function (t) {
					var e = this,
						a = arguments;
					c && clearTimeout(c), c = setTimeout(function () {
						c = null, t.type = "scrollstop", n.apply(e, a)
					}, s.latency)
				};
			t(this).bind("scroll", i).data(l, i)
		},
		teardown: function () {
			t(this).unbind("scroll", t(this).data(l))
		}
	}
}(jQuery);

(function ($) {
	$.fn.picker = function (json, callback) {
		var options = json.data;
		var lineHeight = 22.5;
		var outElement = 'scrollOutput';
		var cloneScroller = 'clone-scroller';
		var pickerScroller = 'picker-scroller';

		if (typeof json.cloneScroller !== "undefined") {
			cloneScroller = json.cloneScroller;
		}

		if (typeof json.pickerScroller !== "undefined") {
			pickerScroller = json.pickerScroller;
		}

		$ele = $(this);
		$ele.empty();
		$ele.addClass("picker-wrapper");
		$ele.append('<div class="clone-scroller ' + cloneScroller + '"></div>');
		$ele.append('<div class="picker-up"></div>');
		$ele.append('<div class="picker-down"></div>');
		$ele.append('<div class="picker-scroller ' + pickerScroller + '"></div>');

		if (typeof json.lineHeight !== "undefined") {
			lineHeight = json.lineHeight;
		}

		if (typeof json.scrollOutput !== "undefined") {
			outElement = json.scrollOutput;
		}
		$.each(options, function (index, option) {
			$ele.find('.' + cloneScroller).append('<div class="option">' + option + '</div>');
			$ele.find('.' + pickerScroller).append('<div class="option">' + option + '</div>');
		});
		$ele.find('.' + cloneScroller).bind("scroll", function () {
			clockWise(lineHeight, outElement, cloneScroller, pickerScroller);
		});
		$ele.find("." + cloneScroller).bind("scrollstop", function (e) {
			var scrollAmount = Math.round($(this).scrollTop() / lineHeight) * lineHeight;
			$(this).parent().find("." + cloneScroller).animate({
				scrollTop: scrollAmount
			}, 100);



			var eIndex = Math.round(unit / 22.5);
			var $scroller = $("." + pickerScroller);
			var $clone = $("." + cloneScroller);
			var $cloneScrollTop = $("." + cloneScroller).scrollTop();
			var $options = $scroller.find(".option");
			var $optionsNo = $options.length;
			var $cloneHeight = lineHeight * $optionsNo;
			var totalDeg = 22.5 * $optionsNo;
			var unit = totalDeg / $cloneHeight * $cloneScrollTop;

			unit = Math.round(unit / 22.5) * 22.5;
			$scroller.css("-webkit-transform", "translateZ(-90px) rotateX(" + unit + "deg)");


		});

		/*setting css*/
		if (typeof json.lineHeight !== "undefined") {
			$ele.css("height", (lineHeight * 5) + "px");
			$ele.css("line-height", lineHeight + "px");
			$ele.find('.' + cloneScroller).css({
				"padding-top": (lineHeight * 2) + "px",
				"padding-bottom": (lineHeight * 2) + "px"
			});
			$ele.find('.' + pickerScroller).css({
				"padding-top": (lineHeight * 2) + "px",
				"padding-bottom": (lineHeight * 2) + "px"
			});
			$ele.find(".picker-up").css("height", (lineHeight * 2) + "px");
			$ele.find(".picker-down").css("height", (lineHeight * 2) + "px");
			$ele.find(".picker-down").css("top", (lineHeight * 3) + "px");
		}
		// default selected
		if (typeof json.selected !== "undefined") {
			$ele.find('.' + cloneScroller).scrollTop(lineHeight * json.selected);
			$ele.find('.' + pickerScroller).scrollTop(lineHeight * json.selected);
		}

		$ele.find('.' + pickerScroller).find(".option").each(function (index, $option) {
			$option = $($option);
			$option.css("-webkit-transform", "rotateX(-" + (22.5 * index) + "deg) translateZ(90px)");
			if (index > 2) {
				$option.hide();
			}
		});

	};
}(jQuery));


let deg = 0;

function clockWise(lineHeight, out_element, cloneScroller, pickerScroller) {
	var $scroller = $("." + pickerScroller);
	var $clone = $("." + cloneScroller);
	var $cloneScrollTop = $("." + cloneScroller).scrollTop();
	var $options = $scroller.find(".option");
	var $optionsNo = $options.length;
	var $cloneHeight = lineHeight * $optionsNo;
	var totalDeg = 22.5 * $optionsNo;
	var unit = totalDeg / $cloneHeight * $cloneScrollTop;
	$scroller.css("-webkit-transform", "translateZ(-90px) rotateX(" + unit + "deg)");

	var eIndex = Math.round(unit / 22.5);

	let outDom = ('#' + out_element);
	$(outDom).val(eIndex);

	$($options).hide();
	$($options.get(eIndex)).show();
	for (i = eIndex; i < (eIndex + 3); i++) {
		$($options.get(i)).show();
	}
	if (eIndex > 3) {
		for (i = eIndex; i >= (eIndex - 2); i--) {
			$($options.get(i)).show();
		}
	} else {
		for (i = 0; i < 3; i++) {
			$($options.get(i)).show();
		}
	}

}