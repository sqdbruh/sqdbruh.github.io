// Configuration for all projects
const projectsConfig = [
    {
        key: 'evofrogs',
        color: '#4CAF50',
        title: 'Evo Frogs — криптопроект с инвестициями $3млн',
        media: ['evofrogs1.mp4', 'evofrogs2.mp4'],
        mediaType: 'video',
        hasExpandButton: true,
        buttons: []
    },
    {
        key: 'megamod',
        color: '#406bfb',
        title: 'MegaMod — империя',
        media: [],
        mediaType: null,
        hasExpandButton: false,
        buttons: [
            {
                icon: 'fa-solid fa-arrow-right',
                url: 'https://investors.megamod.io/',
                text: 'Узнать подробнее'
            }
        ]
    },
    {
        key: 'chillage',
        color: '#0AAB4D',
        title: 'Chillage — амбициозный пет-проект на собственном игровом движке',
        media: ['chillage1.mp4', 'chillage2.mp4'],
        mediaType: 'video',
        hasExpandButton: true,
        buttons: [
            {
                icon: 'fa-brands fa-youtube',
                iconColor: '#ff0000',
                text: 'Скоро видео о создании',
                disabled: true
            }
        ]
    },
    {
        key: 'megaobby',
        color: '#5662f6',
        title: 'MegaObby — обби для Discord Activities!',
        media: ['megaobby1.mp4', 'megaobby2.mp4'],
        mediaType: 'video',
        hasExpandButton: false,
        buttons: [
            {
                icon: 'fa-solid fa-bolt',
                url: 'https://megarun.playroom.gg/',
                text: 'Попробовать в браузере'
            }
        ]
    },
    {
        key: 'notalone',
        color: '#da397d',
        title: 'NotAlone — LGBT* friendly дейт-сим для одиноких дам и даместосов!',
        media: ['notalone1.png', 'notalone2.gif'],
        mediaType: 'image',
        hasExpandButton: true,
        buttons: [
            {
                icon: 'fa-brands fa-app-store-ios',
                iconColor: '#418fde',
                url: 'https://apps.apple.com/us/app/notalone-love-chat-story/id1567415285',
                text: 'Игра в AppStore'
            }
        ]
    },
    {
        key: 'megacode',
        color: '#2268BD',
        title: 'MegaCode — это инновация, сейчас я вам все объясню!',
        media: ['megacode2.gif', 'megacode1.mp4'],
        mediaType: 'mixed',
        hasExpandButton: true,
        buttons: [
            {
                icon: 'fa-solid fa-bolt',
                url: 'https://code.megamod.io/',
                text: 'Попробовать в браузере'
            },
            {
                icon: 'fa-brands fa-app-store-ios',
                iconColor: '#418fde',
                url: 'https://apps.apple.com/ru/app/megacode-lite/id6463144034',
                text: 'Lite в AppStore'
            }
        ]
    },
    {
        key: 'tyrant',
        color: '#98c448',
        title: 'Pretty Tyrant — Tower Defense нового поколения',
        media: ['tyrant1.png', 'tyrant2.gif'],
        mediaType: 'image',
        hasExpandButton: true,
        buttons: []
    },
    {
        key: 'sketch',
        color: '#bdd2e5',
        title: 'Sketch-Pro — медитативная раскраска по номерам',
        media: ['sketchpro1.jpg', 'sketchpro2.jpg'],
        mediaType: 'image',
        hasExpandButton: true,
        buttons: []
    }
];

// Toggle text function
function toggleText(blockId, event) {
    const textBlock = document.getElementById(blockId);
    const button = event.currentTarget;
    const textSpan = button.querySelector("span");
    const icon = button.querySelector(".icon");

    if (textBlock.style.display === "none" || textBlock.style.display === "") {
        textBlock.style.display = "block";
        textSpan.textContent = "Скрыть";
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
    } else {
        textBlock.style.display = "none";
        textSpan.textContent = "Показать полностью";
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
    }
}

// Generate media HTML
function generateMediaHTML(media, mediaType, projectKey) {
    if (!media || media.length === 0) return '';
    
    return `
        <div class="two_media_container">
            ${media.map((mediaFile, index) => {
                const isVideo = mediaType === 'video' || 
                              (mediaType === 'mixed' && mediaFile.endsWith('.mp4'));
                
                if (isVideo) {
                    return `
                        <div class="media_container">
                            <div class="placeholder"></div>
                            <video class="media_content" loading="lazy" onloadeddata="this.classList.add('loaded'); this.previousElementSibling.style.display = 'none';" autoplay loop muted playsinline>
                                <source src="${mediaFile}" type="video/mp4">
                            </video>
                        </div>
                    `;
                } else {
                    return `
                        <div class="media_container">
                            <div class="placeholder"></div>
                            <img class="media_content" loading="lazy" onload="this.classList.add('loaded'); this.previousElementSibling.style.display = 'none';" src="${mediaFile}">
                        </div>
                    `;
                }
            }).join('')}
        </div>
    `;
}

// Generate buttons HTML
function generateButtonsHTML(buttons) {
    if (!buttons || buttons.length === 0) return '';
    
    return buttons.map(button => {
        const iconStyle = button.iconColor ? `style="color: ${button.iconColor};"` : '';
        const buttonStyle = button.disabled ? 'style="cursor: default;"' : '';
        const linkStyle = button.disabled ? 'style="text-decoration: underline; color: #888; cursor: inherit;"' : 
                                           'style="text-decoration: underline; color: inherit;"';
        const targetBlank = button.disabled ? '' : 'target="_blank"';
        const href = button.disabled ? '#' : button.url;
        
        return `
            <button class="external_link-button" ${buttonStyle}>
                <i class="${button.icon}" ${iconStyle}></i>
                <a href="${href}" ${targetBlank} ${linkStyle}>
                    ${button.text}
                </a>
            </button>
        `;
    }).join('');
}

// Generate project block HTML
function generateProjectBlock(project, index) {
    const projectName = project.title.split(' — ')[0];
    const projectDescription = project.title.split(' — ')[1] || '';
    
    const expandButtonHTML = project.hasExpandButton ? `
        <div class="button-container">
            <button class="expand-button" onclick="toggleText('textBlock${index}', event)">
                <span>Показать полностью</span>
                <i class="fas fa-chevron-down icon"></i>
            </button>
        </div>
    ` : '';

    return `
        <div class="gameblock">
            <div class="title-container">
                <p class="title">
                    <span class="project-${project.key}">${projectName}</span>${projectDescription ? ' — ' + projectDescription : ''}
                </p>
                ${generateButtonsHTML(project.buttons)}
            </div>
            <hr>
            <p class="sub_title" id="${project.key}_subtitle"></p>
            ${generateMediaHTML(project.media, project.mediaType, project.key)}
            <p class="description" id="${project.key}_description"></p>
            <div class="expandable-text" id="textBlock${index}">
                <p class="description" id="${project.key}_content"></p>
            </div>
            ${expandButtonHTML}
        </div>
    `;
}

// Generate all project blocks
function generateProjectBlocks() {
    const gameblocks = document.querySelector('.gameblocks');
    if (!gameblocks) return;
    
    gameblocks.innerHTML = projectsConfig.map((project, index) => 
        generateProjectBlock(project, index)
    ).join('');
}

// Load content from JSON
function loadContent() {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            projectsConfig.forEach(project => {
                const elements = {
                    subtitle: document.getElementById(`${project.key}_subtitle`),
                    description: document.getElementById(`${project.key}_description`),
                    content: document.getElementById(`${project.key}_content`)
                };
                
                if (elements.subtitle && data[`${project.key}_subtitle`]) {
                    elements.subtitle.innerText = data[`${project.key}_subtitle`];
                }
                if (elements.description && data[`${project.key}_description`]) {
                    elements.description.innerText = data[`${project.key}_description`];
                }
                if (elements.content && data[`${project.key}_content`]) {
                    elements.content.innerText = data[`${project.key}_content`];
                }
            });
        })
        .catch(error => console.error('Error loading content:', error));
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    function updateButtonText(isDarkTheme) {
        themeToggleButton.textContent = isDarkTheme ? 'Dark Theme' : 'Light Theme';
    }

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        const isDarkTheme = savedTheme === 'dark';
        body.classList.toggle('dark-theme', isDarkTheme);
        updateButtonText(isDarkTheme);
    } else {
        updateButtonText(false);
    }

    themeToggleButton.addEventListener('click', () => {
        const isDarkTheme = body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        updateButtonText(isDarkTheme);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    generateProjectBlocks();
    loadContent();
    initThemeToggle();
});

// Make toggleText available globally for onclick handlers
window.toggleText = toggleText; 