let API = 'http://localhost:8000/instagram'
// инпуты для создания
let inpTitle = document.getElementById("inpTitle");
let inpSig = document.getElementById("inpSig");
let inpImg = document.getElementById("inpImg");
let btnAdd = document.getElementById("btnAdd");
let sectionPosts = document.getElementById("sectionPosts")
// пагинация
let searchValue = "";
let currentPage = 1;
let countLikes = 0;
let countComment = 0;
let countPlane = 0;
// функция для рандома
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

btnAdd.addEventListener("click", () => {
    if (
        !inpTitle.value.trim() ||
        !inpSig.value.trim() ||
        !inpImg.value.trim()
    ){
        return alert("заполните пустые поля!");
    }

    let newPost = {
        postTitle: inpTitle.value,
        postSig: inpSig.value,
        postImg: inpImg.value,
        postVies: getRandomInt(1000),
        postLike: countLikes,
        postCom: countComment,
        postPlane: countPlane
    };
    createPost(newPost);
    readPosts();
})
// create start
function createPost(postObj) {
    fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(postObj),
    });

    inpTitle.value = "";
    inpSig.value = "";
    inpImg.value = "";
}
// create end
// read start
function readPosts() {
    fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=6`) // получение данных из db.json
        .then((res) => res.json())
        .then((data) => {
            sectionPosts.innerHTML = ""; // очищаем наш тег section, чтобы не было дубликатов
            data.forEach((item) => {
                // перебираем наш полученный массив с объектами
                // добаляем в наш тег section верстку при каждом цикле
                sectionPosts.innerHTML += ` 
          <div class="card m-4 cardBook" style="width: 18rem">
          <img id="${item.id}" src="${item.postImg}" class="card-img-top detailsCard card-img" style="width: 280px" alt="${item.postTitle}" />
        <div class="card-body">
          <h6 class="card-title">${item.postTitle}</h6>
          <p style="font-size: 12px;">Views: ${item.postVies}</p>
          <div style="display: flex;justify-content: space-around;
    align-items: center;" >
          <img width="25" height="25" src="https://img.icons8.com/ios/512/facebook-like.png" onclick="addLike(${item.id})" alt="like">${item.postLike}
          <img width="20" height="20" src="https://img.icons8.com/ios/512/comments.png" onclick="addCom(${item.id})" alt="comment">${item.postCom}
          <img width="25" height="25" src="https://img.icons8.com/ios-glyphs/2x/hearts.png" onclick="addPlane(${item.id})" alt="plane">${item.postPlane}     
          </div>
          <p class="card-text para">
            Цена:${item.postSig}
          </p>
          <button class="btn btn-outline-danger btnDelete" id="${item.id}">
              Delete
            </button>
            <button type="button" class="btn btn-warning btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Edit
          </button>
          
        </div>
      </div>
          `;
            });
        });
}

// read end
// функция ++ лайков
function addLike(id) {
    countLikes++;
   let objCount ={
        postLike: countLikes
    }
    fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(objCount),
    }).then(() => readPosts());
}
// функция ++ комм
function addCom(id){
    countComment++;
  let  objCount ={
        postCom: countComment,
    }
    fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(objCount),
    }).then(() => readPosts());

}

function addPlane(id){
    countPlane++;
    let  objCount ={
        postPlane: countPlane
    }
    fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(objCount),
    }).then(() => readPosts());

}
// удаление
document.addEventListener("click", (e) => {
    // с помощью объекта event ищем id нашего элемента
    let del_class = [...e.target.classList]; // Сохраняем массив с классами в переменную
    if (del_class.includes("btnDelete")) {
        // проверяем, есть ли в нашем поиске наш класс btnDelete
        let del_id = e.target.id; // сохраняем id элемента, по которому кликнули
        fetch(`${API}/${del_id}`, {
            method: "DELETE",
        }).then(() => readPosts()); // вызываем функцию отображения данных, для того чтобы всё переотобразилось сразу же после удаления одной книги
    }
});
// изменение
let editInpTitle = document.getElementById("editInpTitle");
let editInpSig = document.getElementById("editInpSig");
let editInpImg = document.getElementById("editInpImg");
let btnEditSave = document.getElementById("btnEditSave");


document.addEventListener("click", (e) => {
    let arr = [...e.target.classList];
    if (arr.includes("btnEdit")) {
        let id = e.target.id;
        fetch(`${API}/${id}`)
            .then((res) => res.json())
            .then((data) => {
                editInpTitle.value = data.postTitle;
                editInpSig.value = data.postSig;
                editInpImg.value = data.postImg;
                btnEditSave.setAttribute("id", data.id);
            });
    }
});

btnEditSave.addEventListener("click", () => {
    let editedPost = {
        postTitle: editInpTitle.value,
        postSig: editInpSig.value,
        postImg: editInpImg.value,
    };
    // console.log(btnEditSave.id);
    editTrip(editedPost, btnEditSave.id);
});

function editTrip(editObj, id) {
    fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(editObj),
    }).then(() => readPosts());
}

let inpSearch = document.getElementById("inpSearch");
let btnSearch = document.getElementById("btnSearch");

inpSearch.addEventListener("change", (e) => {
    searchValue = e.target.value;
    readPosts();
});

btnSearch.addEventListener('click', (e) => {
    searchValueC = e.target.value;
    readPosts()
})

let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
    currentPage--;
    readPosts();
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    readPosts();
});

readPosts()