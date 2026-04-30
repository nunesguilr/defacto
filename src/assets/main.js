document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      siteNav.classList.toggle('is-open');
    });
  }

  // Theme Toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
  
  // Search Logic
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (searchInput && searchResults) {
    fetch('/search.json')
      .then(res => res.json())
      .then(data => {
        // Inicializa o Fuse.js com os dados do arquivo search.json
        const fuse = new Fuse(data, {
          keys: ['title', 'author', 'excerpt'],
          threshold: 0.3
        });

        searchInput.addEventListener('input', (e) => {
          const query = e.target.value;
          
          if (!query) {
            searchResults.innerHTML = '';
            return;
          }

          const results = fuse.search(query);
          
          if (results.length === 0) {
            searchResults.innerHTML = '<p style="color: var(--c-secondary);">Nenhum artigo encontrado para esta busca.</p>';
            return;
          }

          const html = results.map(result => {
            const item = result.item;
            return `
              <article class="card-dynamic">
                <div style="flex-grow: 1;">
                  <h3 style="margin-top: 0; margin-bottom: 0.2rem;"><a href="${item.url}">${item.title}</a></h3>
                  <p class="article-meta" style="font-family: var(--font-mono); font-size: 0.8em; margin-bottom: 1rem;">
                    ${item.date} ${item.author ? `<span class="accent-color">|</span> ${item.author}` : ''}
                  </p>
                  ${item.excerpt ? `<p style="font-size: 0.95em; color: var(--c-secondary);">${item.excerpt}</p>` : ''}
                </div>
                <div style="margin-top: 1rem; border-top: 1px solid var(--c-border); padding-top: 0.5rem;">
                  <a href="${item.url}" style="font-family: var(--font-serif-display); font-size: 0.85rem; text-transform: uppercase;">Ler Artigo &rarr;</a>
                </div>
              </article>
            `;
          }).join('');

          searchResults.innerHTML = html;
        });
      })
      .catch(err => console.error('Error loading search index:', err));
  }

  // Recommendations Filtering
  const pdfGrid = document.getElementById('pdf-grid');
  if (pdfGrid) {
    const params = new URLSearchParams(window.location.search);
    const collectionFilter = params.get('colecao');

    if (collectionFilter) {
      const cards = pdfGrid.querySelectorAll('.pdf-card');
      let found = false;

      cards.forEach(card => {
        const itemCollection = card.getAttribute('data-collection');
        if (itemCollection === collectionFilter) {
          card.style.display = 'flex'; // Mantendo a estrutura do grid (flexível)
          found = true;
        } else {
          card.style.display = 'none';
        }
      });

      if (!found) {
        // Opcional: mostrar mensagem que nenhum PDF foi encontrado.
        const msg = document.createElement('p');
        msg.textContent = 'Nenhum item encontrado nesta coleção.';
        msg.style.gridColumn = '1 / -1';
        pdfGrid.appendChild(msg);
      }
    }
  }
});
