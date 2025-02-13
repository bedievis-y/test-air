import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAduoxdb-_11TiUDwZWeeb5UgKNP3kWMa8",
    authDomain: "airtechnic-295b5.firebaseapp.com",
    projectId: "airtechnic-295b5",
    storageBucket: "airtechnic-295b5.firebasestorage.app",
    messagingSenderId: "389679362580",
    appId: "1:389679362580:web:e4474e8e171b04d5e4ad01"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

if (localStorage.getItem('authenticated') !== 'true') {
    window.location.href = 'login.html';
}

const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('form');
const sections = document.querySelectorAll('.content-section');

let currentEditingId = null;
let activeTab = 'products';

tabs.forEach((tab) => {
    tab.addEventListener('click', async () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        activeTab = target;
        forms.forEach((form) => form.classList.remove('active'));
        sections.forEach((section) => section.classList.remove('active'));

        document.getElementById(`${target}Form`).classList.add('active');
        document.getElementById(`${target}Section`).classList.add('active');

        cancelEdit();
        await loadData(target);
    });
});

async function uploadImage(file) {
    try {
        console.log('Загружаемый файл:', file);
        const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
        const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
        console.log('Загруженный URL:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
        return '';
    }
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

async function loadData(type) {
    showLoading();
    try {
        const container = document.getElementById(`${type}Container`);
        container.innerHTML = '';

        const q = query(collection(db, type), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.name || data.title}" class="card-img">` : ''}
                <div class="card-content">
                    ${data.name ? `<p><span>Название:</span> ${data.name}</p>` : ''}
                    ${data.category ? `<p><span>Категория:</span> ${data.category}</p>` : ''}
                    ${data.price ? `<p><span>Цена:</span> ${data.price} сум</p>` : ''}
                    ${data.content ? `<p><span>Контент:</span> ${data.content}</p>` : ''}
                </div>
                <div class="card-buttons">
                    <button class="edit-button" onclick="editData('${type}', '${doc.id}', ${JSON.stringify(data).replace(/\"/g, '&quot;')})">Редактировать</button>
                    <button class="delete-button" onclick="deleteData('${type}', '${doc.id}')">Удалить</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        alert('Ошибка при загрузке данных.');
    } finally {
        hideLoading();
    }
}

async function deleteData(type, id) {
    const confirmation = confirm('Вы уверены, что хотите удалить запись?');
    if (!confirmation) return;

    showLoading();
    try {
        await deleteDoc(doc(db, type, id));
        alert('Запись успешно удалена!');
        await loadData(type);
    } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Ошибка при удалении записи.');
    } finally {
        hideLoading();
    }
}

function editData(type, id, data) {
    currentEditingId = id;

    if (type === 'products') {
        document.getElementById('productName').value = data.name || '';
        document.getElementById('productCategory').value = data.category || '';
        document.getElementById('productPrice').value = data.price || '';

        document.getElementById('cancelProductEditButton').style.display = 'block';
        document.getElementById('cancelNewsEditButton').style.display = 'none';
    } else if (type === 'news') {
        document.getElementById('newsTitle').value = data.title || '';
        document.getElementById('newsContent').value = data.content || '';

        document.getElementById('cancelNewsEditButton').style.display = 'block';
        document.getElementById('cancelProductEditButton').style.display = 'none';
    }

    const submitButton = document.querySelector(`#${type}Form button[type="submit"]`);
    submitButton.textContent = 'Обновить';

    document.getElementById(`${type}Form`).onsubmit = async (e) => {
        e.preventDefault();
        await updateData(type, id, data.imageUrl);
    };
}

async function addData(type) {
    showLoading();
    try {
        const fileInput = document.getElementById(type === 'products' ? 'productImage' : 'newsImage');
        const file = fileInput ? fileInput.files[0] : null;
        let imageUrl = '';

        if (file) {
            console.log('Загружаем изображение:', file);
            imageUrl = await uploadImage(file);
        }

        const newDoc = {
            createdAt: new Date().toISOString(),
            imageUrl: imageUrl || '',
        };

        if (type === 'products') {
            newDoc.name = document.getElementById('productName').value || '';
            newDoc.category = document.getElementById('productCategory').value || '';
            newDoc.price = document.getElementById('productPrice').value || 0;
        } else if (type === 'news') {
            newDoc.title = document.getElementById('newsTitle').value || '';
            newDoc.content = document.getElementById('newsContent').value || '';
        }

        console.log('Добавляем документ:', newDoc);
        await addDoc(collection(db, type), newDoc);
        alert(`${type === 'products' ? 'Продукт' : 'Новость'} успешно добавлен!`);
        await loadData(type);
    } catch (error) {
        console.error('Ошибка при добавлении:', error);
        alert('Ошибка при добавлении данных.');
    } finally {
        hideLoading();
        cancelEdit();
    }
}

async function updateData(type, id, oldImageUrl) {
    showLoading();
    try {
        const fileInput = document.getElementById(type === 'products' ? 'productImage' : 'newsImage');
        const file = fileInput ? fileInput.files[0] : null;
        let imageUrl = oldImageUrl;

        if (file) {
            console.log('Загружаем новое изображение...');
            imageUrl = await uploadImage(file);
        } else {
            console.warn('Файл не загружен, оставляем старое изображение:', oldImageUrl);
        }

        const updatedDoc = {
            updatedAt: new Date().toISOString(),
            imageUrl: imageUrl, // Сохраняем изображение
        };

        if (type === 'products') {
            updatedDoc.name = document.getElementById('productName').value || '';
            updatedDoc.category = document.getElementById('productCategory').value || '';
            updatedDoc.price = document.getElementById('productPrice').value || 0;
        } else if (type === 'news') {
            updatedDoc.title = document.getElementById('newsTitle').value || '';
            updatedDoc.content = document.getElementById('newsContent').value || '';
        }

        console.log('Обновляем документ:', updatedDoc);
        await updateDoc(doc(db, type, id), updatedDoc);

        alert(`${type === 'products' ? 'Продукт' : 'Новость'} успешно обновлен!`);
        await loadData(type);
    } catch (error) {
        console.error('Ошибка при обновлении:', error);
        alert('Ошибка при обновлении данных.');
    } finally {
        hideLoading();
        cancelEdit();
    }
}

function cancelEdit() {
    if (activeTab === 'products') {
        document.getElementById('productsForm').reset();
        document.getElementById('cancelProductEditButton').style.display = 'none';
        document.querySelector(`#productsForm button[type="submit"]`).textContent = 'Добавить продукт';
    } else if (activeTab === 'news') {
        document.getElementById('newsForm').reset();
        document.getElementById('cancelNewsEditButton').style.display = 'none';
        document.querySelector(`#newsForm button[type="submit"]`).textContent = 'Добавить новость';
    }

    currentEditingId = null;
}

const cancelProductBtn = document.getElementById('cancelProductEditButton');
const cancelNewsBtn = document.getElementById('cancelNewsEditButton');

if (cancelProductBtn) {
    cancelProductBtn.addEventListener('click', cancelEdit);
}
if (cancelNewsBtn) {
    cancelNewsBtn.addEventListener('click', cancelEdit);
}

forms.forEach((form) => {
    form.onsubmit = (e) => {
        e.preventDefault();
        if (currentEditingId) {
            updateData(activeTab, currentEditingId);
        } else {
            addData(activeTab);
        }
    };
});

loadData('products');

window.deleteData = deleteData;
window.editData = editData;
window.cancelEdit = cancelEdit;