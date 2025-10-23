function test() {
    const out = document.getElementById('output');
    if (!out) return;
    const lines = [];
    for (let i = 1; i <= 10; i++) {
        lines.push('hello world ' + i);
    }
    out.innerHTML = lines.join('<br>');
    console.log('Pampos');
}

window.addEventListener('load', test);