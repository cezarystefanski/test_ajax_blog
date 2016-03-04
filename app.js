;(function () {
    "use strict";

    var $ = window.jQuery,
        counter = 0,
        endFlag;

    $(document).ready(loadArticles);
    $(".loader").on("click", loadArticles);

    function loadArticles() {
        var template,
            responseObj,
            templatePromise = $.Deferred(),
            dataPromise = $.Deferred();

        $(".loading").css("display", "block");
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
                    $(".loader").css("display", "none");
                }
            });
    }
})();
