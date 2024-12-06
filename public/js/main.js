$(document).ready(function () {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        events: function (start, end, timezone, callback) {
            $.ajax({
                url: '/api/ferias',
                dataType: 'json',
                success: function (data) {
                    const events = data.map(item => ({
                        title: 'Férias: ' + item.id_colaborador,
                        start: item.data_inicio,
                        end: item.data_fim,
                        allDay: true
                    }));
                    callback(events);
                }
            });
        }
    });

    $('#feriasForm').submit(function (e) {
        e.preventDefault();

        const data = {
            id_colaborador: $('#colaborador').val(),
            data_inicio: $('#data_inicio').val(),
            data_fim: $('#data_fim').val()
        };

        $.ajax({
            url: '/api/ferias',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function () {
                alert('Férias registradas com sucesso!');
                $('#calendar').fullCalendar('refetchEvents');
            },
            error: function () {
                alert('Erro ao registrar férias!');
            }
        });
    });
});
