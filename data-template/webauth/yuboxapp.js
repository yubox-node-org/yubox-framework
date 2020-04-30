function setupWebAuthTab()
{
    //
    var authpane = $('div#yuboxMainTabContent > div.tab-pane#webauth');

    // https://getbootstrap.com/docs/4.4/components/navs/#events
    $('ul#yuboxMainTab a#webauth-tab[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var authpane = $('div#yuboxMainTabContent > div.tab-pane#webauth');
        $.getJSON(yuboxAPI('authconfig'))
        .done(function (data) {
            authpane.find('input#yubox_username').val(data.username);
            authpane.find('input#yubox_password1, input#yubox_password2').val(data.password);
        })
        .fail(function (e) {
            var msg;
            if (e.status == 0) {
                msg = 'Fallo al contactar dispositivo';
            } else if (e.responseJSON == undefined) {
                msg = 'Tipo de dato no esperado en respuesta';
            } else {
                msg = e.responseJSON.msg;
            }
            yuboxMostrarAlertText('danger', msg, 2000);
        });
    });
    authpane.find('button[name=apply]').click(function () {
        var postData = {
            password1: authpane.find('input#yubox_password1').val(),
            password2: authpane.find('input#yubox_password2').val()
        };
        if (postData.password1 != postData.password2) {
            yuboxMostrarAlertText('danger', 'Contraseña y confirmación no coinciden.', 5000);
        } else if (postData.password1 == '') {
            yuboxMostrarAlertText('danger', 'Contraseña no puede estar vacía.', 5000);
        } else {
            $.post(yuboxAPI('authconfig'), postData)
            .done(function (data) {
                if (data.success) {
                    // Al guardar correctamente las credenciales, recargar para que las pida
                    yuboxMostrarAlertText('success', data.msg, 2000);
                    setTimeout(function () {
                        window.location.reload();
                    }, 3 * 1000);
                } else {
                    yuboxMostrarAlertText('danger', data.msg, 2000);
                }
            })
            .fail(function (e) {
                var msg;
                if (e.status == 0) {
                    msg = 'Fallo al contactar dispositivo';
                } else if (e.responseJSON == undefined) {
                    msg = 'Tipo de dato no esperado en respuesta';
                } else {
                    msg = e.responseJSON.msg;
                }
                yuboxMostrarAlertText('danger', msg, 2000);
            });
        }
    });
}