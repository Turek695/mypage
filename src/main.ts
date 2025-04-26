document.addEventListener('DOMContentLoaded', () => {
    const headerTitle = document.querySelector('.header-title');
    const headerRoles = document.querySelectorAll('.header-role');
    if (headerTitle) {
        setTimeout(() => {
            headerTitle.classList.remove('hidden');
            headerRoles.forEach(role => {
                setTimeout(() => {
                    role.classList.remove('hidden');
                }, 500);
            });
        }, 500);
    }
});

const alts = ['', 'Me in Tatry mountains', 'Me in Tatry mountains', 'my plant - ficus', 'my car - Chrysler 300m']
const baseUrl = '/images/';
const gallery = document.querySelector('.gallery');

for (let i = 1; i <= 4; i++) {
    const image: HTMLImageElement = document.createElement('img');
    image.src = `${baseUrl}${i}.jpg`;
    image.alt = alts[i] ?? '';
    image.classList.add('gallery__image');
    gallery?.appendChild(image);
}
