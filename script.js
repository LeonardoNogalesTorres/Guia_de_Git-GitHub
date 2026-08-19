document.addEventListener('DOMContentLoaded', () => {
    const codeBlocks = document.querySelectorAll('.code-block');

    codeBlocks.forEach((block) => {
        // Extraer comandos y comentarios hijos del bloque
        const items = [];
        let currentItem = null;

        Array.from(block.children).forEach((child) => {
            if (child.tagName === 'CODE') {
                if (currentItem) items.push(currentItem);
                currentItem = { cmd: child.innerText.trim(), comment: '' };
            } else if (child.classList.contains('comment')) {
                if (currentItem) {
                    currentItem.comment = child.innerText.trim();
                    items.push(currentItem);
                    currentItem = null;
                } else {
                    items.push({ cmd: '', comment: child.innerText.trim() });
                }
            }
        });
        if (currentItem) items.push(currentItem);

        // Si se encontraron comandos, transformar el contenedor al diseño del generador
        if (items.length > 0 && items.some(i => i.cmd)) {
            block.innerHTML = ''; // Limpiar bloque original

            items.forEach((item) => {
                if (!item.cmd && item.comment) return;

                const row = document.createElement('div');
                row.className = 'command-item';

                const details = document.createElement('div');
                details.className = 'command-details';

                const codeEl = document.createElement('code');
                codeEl.innerText = item.cmd;
                details.appendChild(codeEl);

                if (item.comment) {
                    const commentEl = document.createElement('span');
                    commentEl.className = 'comment';
                    commentEl.innerText = item.comment;
                    details.appendChild(commentEl);
                }

                const btn = document.createElement('button');
                btn.className = 'single-copy-btn';
                btn.innerText = 'Copiar';

                // Obtener solo la sintaxis limpia para copiar
                const cleanCmd = cleanCommandToSyntax(item.cmd);

                btn.addEventListener('click', () => {
                    navigator.clipboard.writeText(cleanCmd).then(() => {
                        btn.innerText = '¡Copiado!';
                        btn.classList.add('copied');
                        setTimeout(() => {
                            btn.innerText = 'Copiar';
                            btn.classList.remove('copied');
                        }, 1800);
                    });
                });

                row.appendChild(details);
                row.appendChild(btn);
                block.appendChild(row);
            });
        }
    });
});

// Limpieza para copiar ÚNICAMENTE la sintaxis base del comando
function cleanCommandToSyntax(fullCmd) {
    if (fullCmd.includes('http://') || fullCmd.includes('https://')) {
        fullCmd = fullCmd.replace(/\s+https?:\/\/\S+/gi, '');
    }
    fullCmd = fullCmd.replace(/-m\s+["'].*?["']/gi, '-m ""');

    if (fullCmd.startsWith('git config --global user.name')) return 'git config --global user.name ""';
    if (fullCmd.startsWith('git config --global user.email')) return 'git config --global user.email ""';
    if (fullCmd.startsWith('git clone')) return 'git clone';
    if (fullCmd.startsWith('git remote add origin')) return 'git remote add origin';
    if (fullCmd.startsWith('git remote set-url origin')) return 'git remote set-url origin';
    if (fullCmd.startsWith('git switch -c')) return 'git switch -c';
    if (fullCmd.startsWith('git checkout -b')) return 'git checkout -b';
    if (fullCmd.startsWith('git push -u origin')) return 'git push -u origin';
    if (fullCmd.startsWith('git push origin')) return 'git push origin';
    if (fullCmd.startsWith('git pull origin')) return 'git pull origin';
    if (fullCmd.startsWith('git merge')) return 'git merge';
    if (fullCmd.startsWith('git branch -d')) return 'git branch -d';
    if (fullCmd.startsWith('git branch -D')) return 'git branch -D';
    if (fullCmd.startsWith('cd ')) return 'cd';

    return fullCmd;
}