import { renderHeaderComponent } from "./header-component.js";
import { uploadImage } from "../api.js";
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml =
      `<div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container">
              <div class="upload=image">
              ${imageUrl ? `\n <div class="file-upload-image-conrainer">\n
              <img class="file-upload-image" src="${imageUrl}">\n
              <button class="file-upload-remove-button button">Заменить фото</button>\n
              </div> \n
              ` : '\n <label class="file-upload-label secondary-button">\n <input\n type="file"\n class="file-upload-input"\n style="display:none"\n />\n Выберите фото\n </label>\n \n'}
              </div>
            </div>
            <label>
              Опишите фотографию:
              <textarea class="input textarea" id ="description" rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>`
      ;

    appEl.innerHTML = appHtml;

    const fileInput = document.querySelector(".file-upload-input");
    fileInput?.addEventListener("change", (() => {
      const file = fileInput.files[0];
      if (file) {
        const fileLabel = document.querySelector(".file-upload-label");
        fileLabel.setAttribute("disabled", !0),
          fileLabel.textContent = "Загружаю файл...",
          uploadImage({ file })
            .then((responseData) => {
              imageUrl = responseData.fileUrl,
              render();
            }
            )
      }
    }
    )),
      document.querySelector(".file-upload-remove-button")?.addEventListener("click", (() => {
        imageUrl = "",
          render()
      }
      ))

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    document.getElementById("add-button").addEventListener("click", () => {
      if (imageUrl) {
        onAddPostClick({
          description: document.getElementById("description").value,
          imageUrl: imageUrl,
        });
  
      } else {
        alert("Сначала выберите фото и опишите его ");
      }
    });
  };

  render();
};