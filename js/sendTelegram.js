document.querySelector('#contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Получаем значения из полей формы
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const company = document.querySelector('#company').value;
    const comment = document.querySelector('#comment').value;

    // Формируем сообщение
    const message = `
        Новая заявка с сайта:
        Имя: ${name}
        Email: ${email}
        Телефон: ${phone}
        Компания: ${company}
        Комментарий: ${comment}
    `;

    // Настраиваем данные для отправки через Telegram Bot API
    const token = '7293516975:AAHY1dccHEK8lzij50zPzlUKOmDcQYtkp64'; // Ваш токен бота
    const chat_id = '-1002454273416'; // Ваш chat_id
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // Отправка сообщения в Telegram
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
            alert('Ваше сообщение отправлено!');
        } else {
            alert('Произошла ошибка при отправке сообщения.');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке сообщения.');
    });
});
