let currentModel = 'local';
let uploadedFiles = new Map();

function switchModel(model) {
    currentModel = model;
    document.getElementById('localButton').classList.toggle('active', model === 'local');
    document.getElementById('externalButton').classList.toggle('active', model === 'external');
}

async function uploadFiles(files) {
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file);
    }

    try {
        const response = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const result = await response.json();
        result.files.forEach(file => {
            uploadedFiles.set(file.id, file);
            addFileToList(file);
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        alert('Failed to upload files. Please try again.');
    }
}

function addFileToList(file) {
    const fileList = document.getElementById('file-list');
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        ${file.name}
        <button onclick="removeFile('${file.id}')">&times;</button>
    `;
    fileList.appendChild(fileItem);
}

async function removeFile(fileId) {
    try {
        const response = await fetch(`/api/files/${fileId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete file');
        }

        uploadedFiles.delete(fileId);
        const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
        if (fileElement) {
            fileElement.remove();
        }
    } catch (error) {
        console.error('Error removing file:', error);
        alert('Failed to remove file. Please try again.');
    }
}

async function sendMessage() {
    const promptInput = document.getElementById('prompt-input');
    const messagesContainer = document.getElementById('chat-messages');
    const prompt = promptInput.value.trim();
    
    if (!prompt) return;

    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.textContent = prompt;
    messagesContainer.appendChild(userMessageDiv);

    // Add loading message
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message loading';
    loadingDiv.textContent = 'Thinking';
    messagesContainer.appendChild(loadingDiv);

    // Clear input and focus
    promptInput.value = '';
    promptInput.focus();

    try {
        const fileIds = Array.from(uploadedFiles.keys());
        const response = await fetch(`/api/chat/${currentModel}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                prompt,
                fileIds
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Replace loading message with actual response
        loadingDiv.className = 'message bot-message';
        loadingDiv.textContent = data.response;
    } catch (error) {
        loadingDiv.className = 'message bot-message';
        loadingDiv.textContent = 'Sorry, I encountered an error while processing your request. Please try again.';
        console.error('Error:', error);
    }

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Event Listeners
document.getElementById('prompt-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// File upload handling
document.getElementById('file-input').addEventListener('change', (e) => {
    uploadFiles(e.target.files);
});

// Auto-resize textarea
const textarea = document.getElementById('prompt-input');
textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});