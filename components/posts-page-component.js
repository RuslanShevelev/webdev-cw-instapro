import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const postsHtml = posts.map((post, index) => getPost(post, index)).join("");  

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
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
function getPost(post, index, token, user) {
  // let like = (message.liked) ? 'like-button -active-like' : 'like-button';
  // let edit = (message.isEdit) ? `<textarea type="textarea" class="comment-correction"rows="4">${message.comment}</textarea>` : `<div class="comment-text">${message.comment.replaceAll("QUOTE_BEGIN", "<div class='quote'>").replaceAll("QUOTE_END", "</div>").replaceAll("\n", "<br>")}</div>`;
  // let correctBtn = (message.isEdit) ? `<button data-index="${index}" data-id="${message.commentID}" class="correct-button save-button">Сохранить</button>` : `<button data-index="${index}" class="correct-button">Редактировать</button>`;
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
//    `<li class="comment" data-index="${index}">
//   <div class="comment-header" >
//     <div>${message.name}</div>
//     <div>${message.time}</div>
//   </div>
//   <div class="comment-body">
//     ${edit}
//   </div>
//   <div class="comment-footer">
//   ${(token && message.login === user.login) ? `<div class="buttons">` : `<div class="buttons hide">`}
// ${correctBtn}
// <button data-id="${message.commentID}" class="delete">Удалить</button>
//     </div>
//     <div class="likes">
//       <span class="likes-counter">${message.likesCount}</span>
//       <button data-id="${message.commentID}" class="${like}"></button>
//     </div>
//   </div>
// </li>`;
};