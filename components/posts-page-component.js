import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  // console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const postsHtml = posts.map((post) => getPost(post)).join("");  

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul>
               ${postsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}

function getPost(post) {
  return `<li class="post">
  <div class="post-header" data-user-id=${post.user.id}>
      <img src=${post.user.imageUrl} class="post-header__user-image">
      <p class="post-header__user-name">${post.user.name}</p>
  </div>
  <div class="post-image-container">
    <img class="post-image" src=${post.imageUrl}>
  </div>
  <div class="post-likes">
    <button data-post-id="${post.id}" class="like-button">
    ${post.isLiked ? '<img src="./assets/images/like-active.svg">' : '<img src="./assets/images/like-not-active.svg">'}
    </button>
    <p class="post-likes-text">
      Нравится: <strong>${post.likes.length}</strong>
    </p>
  </div>
  <p class="post-text">
    <span class="user-name">${post.user.name}</span>
    ${post.description}
  </p>
  <p class="post-date">
  ${post.createdAt}
  </p>
</li>
`
};
export function renderUserPosts({ appEl }) {
  const postsHtml = posts.map((post) => getUserPost(post)).join("");  
const user = posts.shift().user;
  const appHtml = `
  <div class="page-container">
  <div class="header-container"></div>
  <div class="posts-user-header">
      <img src=${user.imageUrl} class="posts-user-header__user-image">
      <p class="posts-user-header__user-name">${user.name}</p>
  </div>
  <div id="carousel" class="carousel">
    <button class="arrow prev">⇦</button>
    <div class="gallery">
      <ul>
        ${postsHtml}
      </ul>
    </div>
    <button class="arrow next">⇨</button>
  </div>
</div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  let i = 1;
  for(let li of carousel.querySelectorAll('li')) {
    li.style.position = 'relative';
    li.insertAdjacentHTML('beforeend', `<span style="position:absolute;left:0;top:0"></span>`);
    i++;
  }

  /* конфигурация */
  let width = 30; // ширина картинки
  let count = 3; // видимое количество изображений

  let list = carousel.querySelector('ul');
  let listElems = carousel.querySelectorAll('li');

  let position = 0; // положение ленты прокрутки

  carousel.querySelector('.prev').onclick = function() {
    // сдвиг влево
    position += width * count;
    // последнее передвижение влево может быть не на 3, а на 2 или 1 элемент
    position = Math.min(position, 0)
    list.style.marginLeft = position + 'vw';
  };

  carousel.querySelector('.next').onclick = function() {
    // сдвиг вправо
    position -= width * count;
    // последнее передвижение вправо может быть не на 3, а на 2 или 1 элемент
    position = Math.max(position, -width * (listElems.length - count));
    list.style.marginLeft = position + 'vw';
  };
};
function getUserPost(post) {
  return `<li class="user-post">
  <div class="post-user-image-container">
    <img class="user-post-image" src=${post.imageUrl}>
  </div>
  <div class="post-footer">
  <div class="post-info">
  <div class="post-likes">
    <button data-post-id="${post.id}" class="like-button">
    ${post.isLiked ? '<img src="./assets/images/like-active.svg">' : '<img src="./assets/images/like-not-active.svg">'}
    </button>
    <p class="post-likes-text">
      Нравится: <strong>${post.likes.length}</strong>
    </p>
  </div>
  <p class="post-text">
    <span class="user-name">${post.user.name}</span>
    ${post.description}
  </p>
  <p class="post-date">
  ${post.createdAt}
  </p>
  </div>
  <button class="delete-button">Удалить пост</button>
  </div>
</li>
`
};