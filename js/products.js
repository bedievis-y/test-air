$(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
        $('#header').addClass('bg-white shadow');
        $('#menu-button').addClass('hide-white-button');
        $('#logo-img').attr('src', 'img/main_screen/footer_logo.svg');
        $('img[src="img/main_screen/header_logo_phone.png"]').attr('src', 'img/main_screen/header_logo_phone-blue.png');
        $('img[src="img/main_screen/header_logo_lan.png"]').attr('src', 'img/main_screen/header_logo_lan-blue.png');
        $('img[src="img/main_screen/header_search.png"]').attr('src', 'img/main_screen/header_search-black.png');
        $('.nav-item.active .nav-link').addClass('text-blue');
    } else {
        $('#header').removeClass('bg-white shadow');
        $('#menu-button').removeClass('hide-white-button');
        $('#logo-img').attr('src', 'img/main_screen/header_logo.svg');
        $('img[src="img/main_screen/header_logo_phone-blue.png"]').attr('src', 'img/main_screen/header_logo_phone.png');
        $('img[src="img/main_screen/header_logo_lan-blue.png"]').attr('src', 'img/main_screen/header_logo_lan.png');
        $('img[src="img/main_screen/header_search-black.png"]').attr('src', 'img/main_screen/header_search.png');
        $('.nav-item.active .nav-link').removeClass('text-blue');
    }
});

$(document).ready(function () {
    // Закрытие модального окна
    $('#modalClose').on('click', function () {
        $('#contactModalTab').modal('hide');
    });

    // Кнопка "Назад"
    $('#backButton').on('click', function () {
        $('#contactModalTab').modal('hide');
    });

    // Обработчик открытия модального окна
    $('.h-custom-button').on('click', function () {
        $('#contactModalTab').modal('show');
    });
});