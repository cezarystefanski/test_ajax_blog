/**
 * Created by Cezary on 2016-03-04.
 */

;(function () {
    "use strict";

    var $ = window.jQuery;

    var counter = 0;
    var $noMore = $("<p></p>");
    var endFlag;
    $noMore.text("No more stories.");

    $(document).ready(loadArticles);

    $(".loader").on("click", loadArticles);

    function loadArticles() {
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

                if (!data[counter]) {
                    endFlag = true;
                } else if (data[counter + 3]) {
                    responseObj = data.slice(counter, counter + 3);
                } else {
                    responseObj = data.slice(counter);
                    endFlag = true;
                }

                template = temp;

                if (responseObj) {
                    responseObj.forEach(function (post) {
                        var $template = $(template);
                        $template.attr("id", "article-" + counter);
                        $template.find(".title").html(post.title);
                        $template.find(".date").html(post.date);
                        $template.find(".text").html(post.text);

                        $(".textBox").append($template);
                        $(".loading").css("display", "none");
                        counter++;
                    });
                }

                $('html, body').animate({
                    scrollTop: $("section#article-" + (counter - 1)).offset().top
                }, 50);

                if (endFlag) {
                    $(".loading").css("display", "none");
                    $(".textBox").append($noMore);
                    $(".loader").css("display", "none");
                    return;
                }
            });
    }
})();
