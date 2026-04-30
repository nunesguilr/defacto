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
              <article class="post-preview" style="margin-bottom: var(--space-md); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--c-border);">
                <h3 style="margin-bottom: 0.2rem;"><a href="${item.url}">${item.title}</a></h3>
                <p class="article-meta" style="font-size: 0.9em; color: var(--c-secondary); margin-bottom: 0.5rem;">
                  ${item.date} ${item.author ? `&bull; ${item.author}` : ''}
                </p>
                ${item.excerpt ? `<p style="font-size: 0.95em;">${item.excerpt}</p>` : ''}
              </article>
            `;
          }).join('');

          searchResults.innerHTML = html;
        });
      })
      .catch(err => console.error('Error loading search index:', err));
  }

  // PDF Catalog Filtering
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
