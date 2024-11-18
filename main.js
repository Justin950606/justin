// 初始化聊天相關變數
let chatMessages = document.getElementById('chatMessages');
let messageInput = document.getElementById('messageInput');

// API 配置
const API_URL = 'https://free.v36.cm/v1/chat/completions';
const API_KEY = 'sk-9lx492LK3xXMCvbgEd0fBc18A46842819bF9Cd85E98a5925';

// 發送消息函數
async function sendMessage(customSystemPrompt = null) {
    const message = messageInput.value.trim();
    if (!message) return;

    // 添加用戶消息到聊天框
    addMessageToChat('user', message);
    messageInput.value = '';

    try {
        const loadingMessage = addMessageToChat('system', '正在思考中...');
        
        const systemMessage = customSystemPrompt || "你是一個友善的助手，請用繁體中文回答。回答要完整且有條理。";
        
        const requestBody = {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: systemMessage
            }, {
                role: "user",
                content: message
            }],
            temperature: 0.7,
            max_tokens: 2000
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        // 移除載入提示
        chatMessages.removeChild(loadingMessage);

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API 錯誤 (${response.status}): ${errorData}`);
        }

        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const responseText = data.choices[0].message.content;
            // 分段顯示回答
            const paragraphs = responseText.split('\n').filter(p => p.trim());
            paragraphs.forEach(paragraph => {
                if (paragraph.trim()) {
                    addMessageToChat('assistant', paragraph);
                }
            });
        } else {
            console.log('Unexpected response:', data);
            throw new Error('回應格式不正確');
        }

    } catch (error) {
        console.error('Error details:', error);
        addMessageToChat('assistant', `抱歉，發生錯誤：${error.message}`);
    }
}

// 預設問題回應函數
function askQuestion(topic) {
    let question = '';
    let systemPrompt = '';
    
    switch (topic) {
        case 'weather':
            question = '請告訴我今天的天氣狀況和建議穿著';
            systemPrompt = "你是一個天氣預報助手，請根據當前季節提供天氣資訊和穿著建議。回答要具體且實用。";
            break;
        case 'money':
            question = '請分享一些理財建議和賺錢方法';
            systemPrompt = "你是一個理財顧問，請提供實用的理財建議和賺錢方法。回答要具體且實用。";
            break;
        default:
            return;
    }
    
    if (question) {
        messageInput.value = question;
        sendMessage(systemPrompt);  // 傳遞 systemPrompt 參數
    }
}

// 添加消息到聊天框函數
function addMessageToChat(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    // 處理換行符
    content = content.replace(/\n/g, '<br>');
    messageDiv.innerHTML = content;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

// 添加回車鍵發送功能
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

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

// 在文件開頭添加這個函數
function showEmail() {
    const email = 'a113320047@mail.shu.edu.tw';
    addMessageToChat('system', `我的電子郵件是：${email}`);
    
    // 可選：複製到剪貼板
    navigator.clipboard.writeText(email).then(() => {
        addMessageToChat('system', '郵件地址已複製到剪貼板！');
    }).catch(err => {
        console.error('複製失敗:', err);
    });
}
  