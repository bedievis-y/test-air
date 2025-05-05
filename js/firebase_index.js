// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Инициализация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAvzVROIUnoConplwk-8tpyz43Srg2qDso",
    authDomain: "mesal-web-site.firebaseapp.com",
    projectId: "mesal-web-site",
    storageBucket: "mesal-web-site.appspot.com",
    messagingSenderId: "648438491500",
    appId: "1:648438491500:web:4d6326b259643259832b49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Функция для отображения статей
async function displayArticles() {
    try {
        const blogList = document.getElementById('blog-list');
        if (!blogList) {
            console.error('Элемент с ID "blog-list" не найден.');
            return;
        }

        blogList.innerHTML = ''; // Очищаем содержимое перед добавлением новых статей

        // Запрос к Firestore для получения коллекции "articles"
        const querySnapshot = await getDocs(collection(db, "articles"));

        // Проверяем, есть ли документы в коллекции
        if (querySnapshot.empty) {
            console.warn('Нет доступных статей для отображения.');
            blogList.innerHTML = '<p>Нет доступных новостей.</p>';
            return;
        }

        // Обработка и отображение статей
        querySnapshot.forEach((doc) => {
            const article = doc.data();
            const blogItem = document.createElement('div');
            blogItem.className = 'blog-item';
            blogItem.innerHTML = `
                <img src="${article.imageUrl}" alt="${article.title}">
                <div class="blog-content">
                    <div class="blog-meta">
                        <div class="category">Компания</div>
                        <div class="date">${article.publishDate}</div>
                    </div>
                    <div class="blog-title">${article.title}</div>
                    <div class="blog-description">${article.description}</div>
                    <a href="#!" class="blog-read-more">Подробнее</a>
                </div>
            `;
            blogList.appendChild(blogItem);
        });
    } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
        const blogList = document.getElementById('blog-list');
        blogList.innerHTML = '<p>Произошла ошибка при загрузке новостей. Пожалуйста, попробуйте позже.</p>';
    }
}

// Вызов функции для отображения статей
displayArticles();