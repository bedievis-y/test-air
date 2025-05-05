document.addEventListener('DOMContentLoaded', function () {
    // Находим форму на странице по уникальному ID
    const pageForm = document.getElementById('pageContactForm');

    if (pageForm) {
        pageForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

            // Получаем данные из полей формы
            const name = document.getElementById('pageName').value;
            const email = document.getElementById('pageEmail').value;
            const phone = document.getElementById('pagePhone').value;
            const company = document.getElementById('pageCompany').value;
            const comment = document.getElementById('pageComment').value;

            // Формируем сообщение для отправки в Telegram
            const message = `
                <b>Новая заявка с сайта!</b>\n
                <b>Имя:</b> ${name}\n
                <b>Email:</b> ${email}\n
                <b>Телефон:</b> ${phone}\n
                <b>Компания:</b> ${company}\n
                <b>Комментарий:</b> ${comment}
            `;

            // Настраиваем данные для отправки через Telegram Bot API
            const token = '7293516975:AAHY1dccHEK8lzij50zPzlUKOmDcQYtkp64'; // Ваш токен бота
            const chat_id = '-1002454273416'; // Ваш chat_id
            const url = `https://api.telegram.org/bot${token}/sendMessage`;

            // Отправка данных в Telegram
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chat_id,
                    text: message,
                    parse_mode: 'HTML'
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        alert('Ваше сообщение было успешно отправлено!');
                        pageForm.reset(); // Очистка формы после успешной отправки
                    } else {
                        alert('Ошибка при отправке сообщения. Попробуйте еще раз.');
                    }
                })
                .catch(error => {
                    console.error('Ошибка при отправке сообщения:', error);
                    alert('Ошибка при отправке сообщения. Попробуйте еще раз.');
                });
        });
    }
});
