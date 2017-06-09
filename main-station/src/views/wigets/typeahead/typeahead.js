exports.initVideoSearch = function() {
    var videos = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // `states` is an array of state names defined in "The Basics"
        // local: states,
        remote: {
            url: '/api/search/%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('.typeahead-video-search').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        name: 'videos',
        display: 'videoName',
        source: videos,
        templates: {
            suggestion: function(data) {
                var html = '<a href="/search/' + data.videoInfo + '">';
                html += '<span>' + data.videoName + '</span>'
                html += '<div class="text-muted">' + data.videoInfo + '</div>'
                html += '</a>'
                return html
            }
        }
    });

}
