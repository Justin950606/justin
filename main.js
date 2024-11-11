// 聊天功能
const socket = io('your-server-url'); // 需要替換為實際的伺服器地址

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        appendMessage('user', message);
        socket.emit('chat message', message);
        input.value = '';
    }
}

function appendMessage(sender, message) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 自動回應功能
socket.on('auto response', (message) => {
    appendMessage('bot', message);
});

// 互動性問題
function askQuestion(topic) {
    let message = '';
    switch(topic) {
        case 'archery':
            message = '很高興你對射箭有興趣！我有多年的射箭經驗，歡迎交流討論。';
            break;
        case 'basketball':
            message = '籃球是一項很棒的運動！我經常在週末打球，你也喜歡嗎？';
            break;
    }
    appendMessage('bot', message);
}

// 作品展示區域
const galleryImages = [
    'path/to/image1.jpg',
    'path/to/image2.jpg',
    'path/to/image3.jpg',
    // 添加更多圖片
];

function loadGallery() {
    const gallery = document.getElementById('galleryGrid');
    galleryImages.forEach(imagePath => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = '作品展示';
        
        item.appendChild(img);
        gallery.appendChild(item);
    });
}

// 頁面載入時初始化圖片庫
document.addEventListener('DOMContentLoaded', loadGallery); 