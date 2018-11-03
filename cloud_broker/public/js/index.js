var app = angular.module("myApp", []);

function update_bar(){
    $('.horizontal .progress-fill span').each(function(){
        var percent = $(this).html();
        $(this).parent().css('width', percent);
    });
}

var shown_metrics = ['load','load_user','load_system','load_nice','load_idle','load_irq'];

$(window).ready(function() {
    update_bar();

    setInterval(function () {
        $.get('/curinfo', function (data) {
            $('#result-panel').html('');
            for (var i in data){
                $('#result-panel').append('<div class="col-xs-12">' +
                    '                <div class="container horizontal rounded bar-container" id="'+data[i].vm+'">' +
                    '                  <h2 class="h2-item">'+data[i].vm+'</h2>'
                    );
                for (var j in shown_metrics){
                    // $('#'+data[i].vm).find('#'+shown_metrics[j]) .html(data[i].data['current'+shown_metrics[j]]+'%');
                    $('#'+data[i].vm).append('<div class="progress-bar horizontal">'+
                        '                  <div class="col-xs-2">'+shown_metrics[j]+'</div>' +
                        '                    <div class="col-xs-10">' +
                        '                    <div class="progress-track">' +
                        '                      <div class="progress-fill">' +
                        '                        <span id="'+shown_metrics[j]+'">'+data[i].data['current'+shown_metrics[j]]+'%'+'</span>' +
                        '                      </div>' +
                        '                    </div>' +
                        '                    </div>' +
                        '                  </div>');
                }
                $('#result-panel').append('</div></div>');
            }
            update_bar();
        });
    }, 2000);

});