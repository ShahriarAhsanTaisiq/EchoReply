console.log("Hello from EchoReply Chrome Extension");

function createEchoReplyButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'EchoReply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate Reply');
    return button;
}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trip();
        }
        return '';
    }
}

function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="dialog"]',
        '.gU,Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
        return null;
    }
}

function injectButton (){
    const existingButton = document.querySelector('.echo-reply-button');
    if (existingButton) {
        existingButton.remove();
    }
    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Compose toolbar not found");
        return;
    }
    console.log("Compose toolbar found, crating button");
    const button = createEchoReplyButton();
    button.classList.add('echo-reply-button');

    button.addEventListener('click', async () => {
        try{
            button.innerHTML = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();
            const respose = await fetch('http://localhost:9099/api/email/generate',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        emailContent : emailContent,
                        tone : "professional"
                })
            });
            if(!respose.ok){
                throw new Error('Failed to generate response');
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"] [g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('Compose box not found');
            }
        } catch (error) {
            console.error(error);
            allert('Failed to generate the EchoReply');
        } finally {
            button.innerHTML = 'EchoReply';
            button.disabled = false;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);

}

const observer = new MutationObserver((mutations) => {
  for(const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(node =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role = "dialog"]') || node.querySelector('.aDh, .btC, [role = "dialog"]'))
    );
    if (hasComposeElements) {
      console.log("Compose elements found");
      setTimeout(injectButton, 500);
    }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
    });