;(function () {
  try {
    var stored = localStorage.getItem('homesync.theme')
    var dark =
      stored === 'dark' ||
      ((stored === null || stored === 'system') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    var root = document.documentElement
    root.classList.toggle('dark', dark)
    root.style.colorScheme = dark ? 'dark' : 'light'
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', dark ? '#0b0b0d' : '#f5f5f5')
  } catch (error) {
    void error
  }
})()
