const alts = ['', 'Me in Tatry mountains', 'my car - Chrysler 300m', 'my plant - ficus']
const baseUrl = 'pics/';
const gallery = document.querySelector('.gallery');

for (let i = 1; i <= 3; i++) {
    const image = document.createElement('img');
    image.src = `${baseUrl}${i}.jpg`;
    image.alt = alts[i];
    image.classList.add('gallery__image');
    gallery.appendChild(image);
}
