
const GITHUB_USERNAME = 'GabrielMouraS';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

const languageColors = {
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C': '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'TypeScript': '#2b7489',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Shell': '#89e051',
    'Rust': '#dea584',
    'Kotlin': '#F18E33',
    'Swift': '#ffac45',
    'Dart': '#00B4AB',
    'Vue': '#41b883',
    'Arduino': '#bd79d1'
};

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Atualizado hoje';
    } else if (diffDays === 1) {
        return 'Atualizado ontem';
    } else if (diffDays < 30) {
        return `Atualizado há ${diffDays} dias`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `Atualizado há ${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `Atualizado há ${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
}

// Função para criar um card de projeto
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => window.open(repo.html_url, '_blank');
    
    const header = document.createElement('div');
    header.className = 'project-header';
    
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'project-icon');
    icon.setAttribute('viewBox', '0 0 16 16');
    icon.setAttribute('fill', 'currentColor');
    icon.innerHTML = '<path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>';
    
    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = repo.name;
    
    header.appendChild(icon);
    header.appendChild(title);
    
    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = repo.description || 'Sem descrição disponível';
    
    const meta = document.createElement('div');
    meta.className = 'project-meta';
    
  
    if (repo.language) {
        const language = document.createElement('div');
        language.className = 'project-language';
        
        const dot = document.createElement('span');
        dot.className = 'language-dot';
        dot.style.backgroundColor = languageColors[repo.language] || '#858585';
        
        const langText = document.createElement('span');
        langText.textContent = repo.language;
        
        language.appendChild(dot);
        language.appendChild(langText);
        meta.appendChild(language);
    }
    
    // Stars
    if (repo.stargazers_count > 0) {
        const stars = document.createElement('div');
        stars.className = 'project-stats';
        stars.innerHTML = `
            <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
            </svg>
            <span>${repo.stargazers_count}</span>
        `;
        meta.appendChild(stars);
    }
    
    // Forks
    if (repo.forks_count > 0) {
        const forks = document.createElement('div');
        forks.className = 'project-stats';
        forks.innerHTML = `
            <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
            </svg>
            <span>${repo.forks_count}</span>
        `;
        meta.appendChild(forks);
    }
    
    // Data de atualização
    const updated = document.createElement('div');
    updated.className = 'project-updated';
    updated.textContent = formatDate(repo.updated_at);
    meta.appendChild(updated);
    
    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(meta);
    
    return card;
}

// Função para carregar repositórios
async function loadRepositories() {
    const loadingElement = document.getElementById('loading');
    const projectsGrid = document.getElementById('projects-grid');
    
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                'Accept': 'application/vnd.github+json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar repositórios');
        }
        
        const repos = await response.json();
        
        // Ordenar por data de atualização (mais recentes primeiro)
        repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        // Filtrar apenas repositórios públicos e não forkados (opcional)
        const filteredRepos = repos.filter(repo => !repo.fork);
        
        loadingElement.style.display = 'none';
        
        if (filteredRepos.length === 0) {
            projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhum repositório encontrado.</p>';
            return;
        }
        
        filteredRepos.forEach(repo => {
            const card = createProjectCard(repo);
            projectsGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Erro:', error);
        loadingElement.textContent = 'Erro ao carregar projetos. Tente novamente mais tarde.';
        loadingElement.style.color = '#d73a49';
    }
}

document.addEventListener('DOMContentLoaded', loadRepositories);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });

});

const profileImg = document.querySelector('.profile-image');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');

profileImg.addEventListener('click', () => {
  modalImg.src = profileImg.src;
  modal.style.display = 'flex';
});

modal.addEventListener('click', () => {
  modal.style.display = 'none';
});

fetch('https://api.countapi.xyz/hit/gabrielmouras-portfolio/visitas')
  .then(response => response.json())
  .then(data => {
    document.getElementById('contador').innerText = data.value;
  });

