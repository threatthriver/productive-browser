const webview = document.getElementById('webview')
const urlInput = document.getElementById('url')
const backBtn = document.getElementById('back')
const forwardBtn = document.getElementById('forward')
const refreshBtn = document.getElementById('refresh')
const goBtn = document.getElementById('go')

// Navigation handlers
backBtn.addEventListener('click', () => {
    if (webview.canGoBack()) {
        webview.goBack()
    }
})

forwardBtn.addEventListener('click', () => {
    if (webview.canGoForward()) {
        webview.goForward()
    }
})

refreshBtn.addEventListener('click', () => {
    webview.reload()
})

// URL navigation
function navigateToUrl() {
    let url = urlInput.value.trim()
    if (!url) return
    
    // Add https:// if no protocol is specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
    }
    
    webview.src = url
}

goBtn.addEventListener('click', navigateToUrl)

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        navigateToUrl()
    }
})

// Update URL when page changes
webview.addEventListener('did-navigate', (e) => {
    urlInput.value = e.url
})

// Handle page title updates
webview.addEventListener('page-title-updated', (e) => {
    document.title = e.title + ' - Productive Browser'
})

// Handle loading state
webview.addEventListener('did-start-loading', () => {
    document.title = 'Loading... - Productive Browser'
})

webview.addEventListener('did-stop-loading', () => {
    webview.executeJavaScript('document.title')
        .then(title => {
            document.title = title + ' - Productive Browser'
        })
})
