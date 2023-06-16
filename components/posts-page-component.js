import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, onClickLike, user } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from 'date-fns/locale'
export function renderPostsPageComponent({ appEl }) {
  // console.log("Актуальный список постов:", posts);

  const postsHtml = posts.map((post) => getPost(post)).join("");
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="list">
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
  initLikeButtons();
}

function getPost(post) {
  const fromDate = formatDistanceToNow(new Date(post.createdAt), { locale: ru });
  return `<li class="post">
  <div class="post-header" data-user-id=${post.user.id}>
      <img src=${post.user.imageUrl} class="post-header__user-image">
      <p class="post-header__user-name">${post.user.name}</p>
  </div>
  <div class="post-image-container">
    <img class="post-image" src=${post.imageUrl}>
  </div>
  <div class="post-likes">
    <button data-post-id="${post.id}" class="like-button ${post.isLiked ? 'active-like' : 'inactive-like'}">
    ${post.isLiked ? '<img src="./assets/images/like-active.svg">' : '<img src="./assets/images/like-not-active.svg">'}
    </button>
    <p class="post-likes-text">
      ${(post.likes.at(-1)) ? `Нравится: <strong>${post.likes.at(-1).name}</strong>` : ""}${(post.likes.length - 1 > 0) ? ` и <strong>еще ${post.likes.length - 1}</strong>` : ""} 
    </p>
  </div>
  <p class="post-text">
    <span class="user-name">${post.user.name}</span>
    ${post.description}
  </p>
  <p class="post-date">
  Опубликовано ${fromDate} назад
  </p>
</li>
`
};
export function renderUserPosts({ appEl }) {
  const postsHtml = posts.map((post) => getUserPost(post)).join("");
  let postsAuthor = posts[0] ? posts[0].user : user;
  const appHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    <div class="posts-user-header">
      <img src=${postsAuthor.imageUrl} class="posts-user-header__user-image">
      <p class="posts-user-header__user-name">${postsAuthor.name}</p>
    </div>
    ${posts[0] ? 
    `<div id="carousel" class="carousel">
      <button class="arrow prev">⇦</button>
      <div class="gallery">
        <ul>
         ${postsHtml}
        </ul>
      </div>
      <button class="arrow next">⇨</button>
      </div>` : 
    '<h3 class="form-title">Здесь будут размещаться ваши посты, при необходимости вы сможете их удалить</h3>'}
  </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  doCarousel(appEl);
};
const doCarousel = (appEl) => {
  const carouselContainer = appEl.querySelector(".carousel")
  if (carouselContainer) {
    let i = 1;
    for (let li of carouselContainer.querySelectorAll('li')) {
      li.style.position = 'relative';
      li.insertAdjacentHTML('beforeend', `<span style="position:absolute;left:0;top:0"></span>`);
      i++;
    }

    let width = 30;
    let count = 3;

    let list = carouselContainer.querySelector('ul');
    let listElems = carouselContainer.querySelectorAll('li');

    let position = 0;

    carouselContainer.querySelector('.prev').onclick = function () {
      position += width * count;
      position = Math.min(position, 0)
      list.style.marginLeft = position + 'vw';
    };

    carouselContainer.querySelector('.next').onclick = function () {
      position -= width * count;
      position = Math.max(position, -width * (listElems.length - count));
      list.style.marginLeft = position + 'vw';
    };

    initLikeButtons();
  }
  else {
    return
  }
};
function initLikeButtons() {
  for (let dislikeEl of document.querySelectorAll('.active-like'))
    dislikeEl.addEventListener("click", (event) => {
      event.stopPropagation();
      dislikeEl.classList.add('-loading-like');
      onClickLike({ id: dislikeEl.dataset.postId }, "dislike");
    })
  for (let likeEl of document.querySelectorAll('.inactive-like'))
    likeEl.addEventListener("click", (event) => {
      event.stopPropagation();
      likeEl.classList.add('-loading-like');
      onClickLike({ id: likeEl.dataset.postId }, "like");
    })
}


function getUserPost(post) {
  const fromDate = formatDistanceToNow(new Date(post.createdAt), { locale: ru });
  return `
  <li class="user-post">
    <div class="post-user-image-container">
      <img class="user-post-image" src=${post.imageUrl}>
    </div>
    <div class="post-footer">
      <div class="post-info">
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button ${post.isLiked ? 'active-like' : 'inactive-like'}">
           ${post.isLiked ? '<img src="./assets/images/like-active.svg">' : '<img src="./assets/images/like-not-active.svg">'}
          </button>
          <p class="post-likes-text">
            ${(post.likes.at(-1)) ? `Нравится: <strong>${post.likes.at(-1).name}</strong>` : ""}${(post.likes.length - 1 > 0) ? ` и <strong>еще ${post.likes.length - 1}</strong>` : ""} 
          </p>
        </div>
        <p class="post-text"><span class="user-name">${post.user.name}</span> ${post.description}</p>
        <p class="post-date">Опубликовано ${fromDate} назад</p>
      </div>
      <button class="delete-button" data-post-id="${post.id}">Удалить пост</button>
    </div>
  </li>`
};
