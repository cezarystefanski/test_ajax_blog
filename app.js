/**
 * Created by Cezary on 2016-03-04.
 */

;(function() {
    "use strict";

    var $ = window.jQuery;

    var counter = 0;
    var $noMore = $("<p></p>");
    $noMore.text("No more stories.");

    $(".loader").on("click", function () {
        $(".loading").css("display", "block");
        var template;
        var responseObj;
        var templatePromise = $.Deferred();
        var dataPromise = $.Deferred();
        $.get("data.json", function (response) {
            dataPromise.resolve(response);
        });
        $.get("template.html", function (response) {
            templatePromise.resolve(response);
        });

        $.when(dataPromise, templatePromise)
            .then(function (data, temp) {
                data = data.reverse();
                template = temp;
                if (data[counter]) {
                    responseObj = data[counter];
                } else {
                    $(".loading").css("display", "none");
                    $(".textBox").append($noMore);
                    $(".loader").css("display", "none");
                    return;
                }
                var $template = $(template);

                $template.attr("id", "article-" + counter);
                $template.find(".title").append(responseObj.title);
                $template.find(".date").append(responseObj.date);
                $template.find(".text").append(responseObj.text);

                $(".textBox").append($template);
                $(".loading").css("display", "none");
                $('html, body').animate({
                    scrollTop: $("section#article-" + counter).offset().top
                }, 50);
                counter++;
            });
    })
})();
