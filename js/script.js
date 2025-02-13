const translations = {
    // en: {
    //     'Hello, world!': 'Hello, world!',
    //     'This is a sample paragraph.': 'This is a sample paragraph.',
    // },
    // ru: {
    //     'Hello, world!': 'Здравствуйте, мир!',
    //     'This is a sample paragraph.': 'Это пример абзаца.',  
    // }
};

// Set the default language to Russian
let currentLang = 'ru';
translatePage(currentLang);

const burger = document.querySelector(".burger-menu");
const menu = document.querySelector(".list");

burger.addEventListener("click", () => {
    document.body.classList.toggle("burger-active");
});

// Toggle dropdown visibility with transition
document.querySelector('.globe').addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent click event from bubbling up
    var dropdown = document.querySelector('.dropdown-content');
    dropdown.classList.toggle('show');
});

// Hide dropdown if clicking outside
window.addEventListener('click', function(event) {
    if (!event.target.closest('.lang-dropdown')) {
        var dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(function(dropdown) {
            dropdown.classList.remove('show');
        });
    }
});

// Handle language selection
document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedLang = this.getAttribute('data-lang');
        if (selectedLang !== currentLang) {
            currentLang = selectedLang;
            translatePage(currentLang);
        }
    });
});

function translatePage(lang) {
    const translation = translations[lang];

    if (translation) {

        document.body.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const originalText = node.textContent.trim();
                const translatedText = translation[originalText] || originalText;
                node.textContent = translatedText;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                node.childNodes.forEach(subNode => {
                    if (subNode.nodeType === Node.TEXT_NODE) {
                        const originalText = subNode.textContent.trim();
                        const translatedText = translation[originalText] || originalText;
                        subNode.textContent = translatedText;
                    }
                });
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 1, 
        spaceBetween: 0,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: true,
        autoplay: {
            delay: 8000,
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        loop: true,
        autoplay: {
            delay: 8000,
            disableOnInteraction: false, 
        },
        on: {
            slideChange: function () {
                swiper.pagination.update();
            }
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.testimonial-wrapper');
    const testimonials = document.querySelectorAll('.testimonial');


    testimonials.forEach(testimonial => {
        const clone = testimonial.cloneNode(true);
        wrapper.appendChild(clone);
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Найти все элементы на странице, кроме тех, которые не должны быть анимированы при скролле
    const elements = document.querySelectorAll('body *:not(.no-scroll-animation)');

    elements.forEach(el => {
        // Добавить класс для анимации
        el.classList.add('animate-on-scroll');
    });

    function checkVisibility() {
        const windowHeight = window.innerHeight;
        elements.forEach(el => {
            const { top, bottom } = el.getBoundingClientRect();
            if (top < windowHeight && bottom > 0) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    // Запустить checkVisibility при первоначальной загрузке
    checkVisibility();
});

document.addEventListener('DOMContentLoaded', function() {
    // Функция для проверки видимости элемента в окне просмотра
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom >= 0
        );
    }

    // Функция для добавления анимации при прокрутке
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll'); // Убедитесь, что элементы имеют этот класс
        elements.forEach(el => {
            if (isElementInViewport(el) && !el.classList.contains('animated') && !el.classList.contains('no-scroll-animation')) {
                el.classList.add('visible');
                el.classList.add('animated'); // Добавляем класс для предотвращения повторной анимации
            }
        });
    }

    // Запускаем анимацию при прокрутке и загрузке страницы
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    // Начальная проверка, если элементы уже в видимой части экрана
    animateOnScroll();
});