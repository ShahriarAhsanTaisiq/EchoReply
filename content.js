console.log("Hello from EchoReply Chrome Extension");

function createEchoReplyButton() {

}

function findComposeToolbar() {
    const selectors = [
        '.aDh',
        '.btC',
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
        console.log("Echo reply button clicked");
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