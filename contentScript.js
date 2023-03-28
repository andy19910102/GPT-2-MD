function extractText(inputDOM) {
    // 複製一份 DOM
    const doc = inputDOM.cloneNode(true);
    // 移除 code block 的 header 區
    const elementsToRemove = doc.querySelectorAll('.flex.items-center.relative');
    elementsToRemove.forEach(element => element.remove());
    // 處理 <code> 標籤
    const codeElements = doc.querySelectorAll('.overflow-y-auto');
    for (const codeElement of codeElements) {
        codeElement.innerHTML = '\n\n' + codeElement.innerHTML + '\n'
    }
    // 擷取文字
    return doc.innerText.trim();
}

function downloadMarkdown(conversation, title) {
    const markdownContent = conversation
        .map((entry) => {
            const content = extractText(entry.content);
            // 回傳的文字將包含分隔線
            return `${entry.author}：\n\n${content}\n\n---\n`;
        })
        .join('\n');
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    // 下載檔案
    const url = URL.createObjectURL(blob);
    const reconstructedTitle = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9 ]/g, '');
    const fileName = `${reconstructedTitle}.md`;
    chrome.runtime.sendMessage({ download: { url, filename: fileName } });
}

function extractConversation() {
    // 取得對話內容
    const textBaseList = Array.from(
        document.querySelectorAll('main.relative .group.w-full>.text-base')
    );
    // 將對話內容轉換成 { author, content } 的格式
    const conversation = textBaseList.map((textBase, idx) => {
        // 取得對話內容
        const contentBase = textBase.childNodes[1].querySelector("div>div>div");
        let author = null;
        if (idx % 2 === 0) {
            author = "我";
        } else {
            author = "ChatGPT"
        }
        // 將對話內容轉換成 { author, content } 的格式
        const content = contentBase;
        return { author, content };
    });
    return conversation;
}

function run() {
    const conversation = extractConversation();
    const title = document.title;
    downloadMarkdown(conversation, title);
}

// 執行
run();
