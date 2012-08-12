// data is provided by data.js. See that file for its structure.

// set customizations
['title', 'subtitle', 'footer'].forEach(function(x) {
    $('#'+x).html(data[x])
});

if (!data.suggestions) { console.log('wtf'); $('li.suggestions').remove(); }

// add map function
data.columns.forEach(function(column) {
    column.places.forEach(function(p) {
        // gutenfleischers, mysore woodlands, graveyard, revolution, spoon west, we suki suki, arden's, tradjoe, wf
        p.map = function() {
            return (this.name+' '+this.address).replace(/ /g, '+');
        };
    });
});

// lay out data
var column_tmpl = $('#column.template').html();
$('#content div.row-fluid').html(data.columns.reduce(function(p, c) {
    return p + Mustache.render(column_tmpl, c);
}, ""));

// suggestion form
$('#suggest form').submit(function(e) {
    e.preventDefault();
    $.post('http://localhost:3000/suggest', $("#suggest form").serialize())
    .success(function() {
        $('#suggest').modal('hide');
        $('#hooray').modal('show');
        $('#suggest input[type=text]').each(function() {
            $(this).val('');
        });
    })
    .error(function() { $('#tryagain').modal('show'); });
});

// filtering
$('#filter').keyup(function() {
    var search = $('#filter').attr('value');
    console.log(search);
    if (search === '') {
        $('.place').show();
    }
    else {
        $('.place').each(function() {
            var $place = $(this);
            var selectors = ['.address', '.name', '.notes'];
            var match = selectors.reduce(function(p,c) {
                return p || Boolean($place.find(c).text().toLowerCase().match(search));
            }, false);
            if (!match) { $place.hide(); }
            else { $place.show(); }
        });
    }
});

// random
$('#random').click(function() {
    $('.highlight').removeClass('highlight');
    var $places = $('.place:visible')
    var index = Math.floor(Math.random() * ($places.length + 1));
    var $place = $($places[index]);
    $place.addClass('highlight');
    $('html, body').animate({scrollTop: $place.offset().top-$place.height()}, 500);
});
