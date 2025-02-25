import { screens } from './screensData.js';

document.addEventListener('DOMContentLoaded', () => {
    const screenContainer = document.getElementById('screen-container');
    const screenList = document.getElementById('screen-list');

    const groupedScreens = screens.reduce((acc, screen) => {
        if (!acc[screen.region]) {
            acc[screen.region] = [];
        }
        acc[screen.region].push(screen);
        return acc;
    }, {});

    Object.keys(groupedScreens).forEach(region => {
        const regionSection = document.createElement('div');
        regionSection.classList.add('region-section');

        const regionTitle = document.createElement('h2');
        regionTitle.textContent = region;

        const showButton = document.createElement('i');
        showButton.className = 'fa-solid fa-eye toggle-button';
        showButton.addEventListener('click', () => {
            groupedScreens[region].forEach(screen => {
                if (screen.width !== 0 && screen.height !== 0 && screen.element) {
                    screen.element.style.display = 'block';
                    screen.listItem.className = `screen-list-item ${screen.isOld ? 'hiding' : 'showing'}`;
                    screen.listItem.querySelector('i').className = 'fa-solid fa-eye';
                }
            });
            recalculateScreenSizes();
        });
        
        const hideButton = document.createElement('i');
        hideButton.className = 'fa-solid fa-eye-slash toggle-button';
        hideButton.addEventListener('click', () => {
            groupedScreens[region].forEach(screen => {
                if (screen.width !== 0 && screen.height !== 0 && screen.element) {
                    screen.element.style.display = 'none';
                    screen.listItem.className = 'screen-list-item hiding';
                    screen.listItem.querySelector('i').className = 'fa-solid fa-eye-slash';
                }
            });
            recalculateScreenSizes();
        });

        regionTitle.appendChild(showButton);
        regionTitle.appendChild(hideButton);
        regionSection.appendChild(regionTitle);

        groupedScreens[region].forEach((screen, index) => {
            if (screen.width === 0 || screen.height === 0) return;

            const screenBox = document.createElement('div');
            screenBox.className = 'screen-box';
            screenBox.id = `screen-box-${index + 1}`;
            screenBox.style.display = region === '大台北和宜蘭地區' && !screen.isOld ? 'block' : 'none';
            screenContainer.appendChild(screenBox);
            screen.element = screenBox;

            const listItem = document.createElement('div');
            listItem.className = `screen-list-item ${region === '大台北和宜蘭地區' && !screen.isOld ? 'showing' : 'hiding'}`;
            listItem.textContent = screen.name;

            const eyeIcon = document.createElement('i');
            eyeIcon.className = `fa-solid ${region === '大台北和宜蘭地區' && !screen.isOld ? 'fa-eye' : 'fa-eye-slash'}`;
            eyeIcon.style.marginLeft = '10px';
            eyeIcon.style.float = 'right';
            listItem.appendChild(eyeIcon);

            listItem.addEventListener('click', () => {
                const isShowing = screen.element.style.display !== 'none';
                screen.element.style.display = isShowing ? 'none' : 'block';
                listItem.className = `screen-list-item ${isShowing ? 'hiding' : 'showing'}`;
                eyeIcon.className = `fa-solid ${isShowing ? 'fa-eye-slash' : 'fa-eye'}`;
                recalculateScreenSizes();
            });
            listItem.addEventListener('mouseover', () => {
                screens.forEach(s => {
                    if (s !== screen && s.element) {
                        s.element.style.opacity = '0.2';
                    }
                });
            });
            listItem.addEventListener('mouseout', () => {
                screens.forEach(s => {
                    if (s.element) {
                        s.element.style.opacity = '1';
                    }
                });
            });
            regionSection.appendChild(listItem);
            screen.listItem = listItem;
        });

        screenList.appendChild(regionSection);
    });

    function recalculateScreenSizes() {
        const visibleScreens = screens.filter(screen => screen.element && screen.element.style.display !== 'none');
        if (visibleScreens.length === 0) return;

        const maxScreen = visibleScreens.reduce((max, screen) => {
            const screenArea = screen.width * screen.height;
            return screenArea > max.width * max.height ? screen : max;
        }, visibleScreens[0]);

        const screenContainerWidth = document.getElementById('screen-container').clientWidth;
        const scaleFactorWidth = screenContainerWidth / (maxScreen.width * 10);
        const scaleFactorHeight = window.innerHeight / (maxScreen.height * 10);
        const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight) * 0.9;
        const borderWidth = 2; // Border width in pixels

        visibleScreens.forEach(screen => {
            const area = screen.width * screen.height;
            screen.element.style.width = `${screen.width * scaleFactor * 10}px`; // Adjust width based on scale factor
            screen.element.style.height = `${screen.height * scaleFactor * 10}px`; // Adjust height based on scale factor
            screen.element.style.position = 'absolute';
            if (screen === maxScreen) {
                screen.element.style.top = '50%';
                screen.element.style.left = '50%';
                screen.element.style.transform = 'translate(-50%, -50%)';
            } else {
                screen.element.style.top = `calc(50% + ${(maxScreen.height * scaleFactor * 10 / 2) - (screen.height * scaleFactor * 10) - borderWidth}px)`;
                screen.element.style.left = '50%';
                screen.element.style.transform = 'translateX(-50%)';
            }
            screen.element.innerHTML = `
                <div class="screen-text">
                    <div>${screen.name}</div>
                    <div>${screen.width}m × ${screen.height}m = ${Math.round(area * 100) / 100}m²</div>
                </div>
            `;
        });
    }

    recalculateScreenSizes();

    window.addEventListener('resize', recalculateScreenSizes);

    // Reusable function to toggle footer visibility
    function toggleFooter() {
        const footer = document.getElementById('footer');
        footer.classList.toggle('hidden');
    }

    // Info button functionality
    document.getElementById('info-button').addEventListener('click', toggleFooter);

    // Close button functionality
    document.getElementById('close-footer').addEventListener('click', toggleFooter);
});
