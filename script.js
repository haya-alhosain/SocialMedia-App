// let baseUrl = "https://tarmeezacademy.com/api/v1";

// pagination
let currentPage = 1;
let lastPage = 1;
window.addEventListener("scroll", () => {
  const enfOfPage =
    window.innerHeight + window.scrollY >= document.body.offsetHeight;
  if (enfOfPage) {
    currentPage = currentPage + 1;
    getPosts(currentPage);
  }
});

// Login
function loginBtnClicked() {
  const userValue = document.getElementById("user-name").value;
  const passValue = document.getElementById("password").value;
  const params = {
    username: userValue,
    password: passValue,
  };
  toggleLoader(true);
  axios
    .post(`${baseUrl}/login`, params)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setupUI();
      showAlert("Logeed In Successfully", "success");
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
// Register New User
function registerBtnClicked() {
  const nameValue = document.getElementById("register-name").value;
  const userValue = document.getElementById("register-username").value;
  const passValue = document.getElementById("register-password").value;
  const imgUser = document.getElementById("register-image").files[0];

  var formData = new FormData();
  formData.append("name", nameValue);
  formData.append("username", userValue);
  formData.append("password", passValue);
  formData.append("image", imgUser);
  let headers = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  axios
    .post(`${baseUrl}/register`, formData, headers)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setupUI();
      showAlert("New User Registered Is Successfully", "success");
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
//Logout
function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  showAlert("Logeed Out Successfully", "success");
}
//Get Current User
function getUserInfo() {
  let user = null;
  if (localStorage.getItem("user") != null) {
    user = JSON.parse(localStorage.getItem("user"));
  }
  return user;
}
//setUpUI
function setupUI() {
  let token = localStorage.getItem("token");
  const loginDiv = document.getElementById("login-btns");
  const logoutDiv = document.getElementById("logout-btn");
  const addBtn = document.getElementById("add-btn");
  let commentDiv = document.getElementById("add-comment-div");

  if (token == null) {
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
    // commentDiv.style.display = "none";
  } else {
    if (addBtn != null) {
      addBtn.style.setProperty("display", "flex", "important");
    }
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    let user = getUserInfo();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-image-user").src = user.profile_image;
    // commentDiv.style.setProperty("display", "flex", "important");
  }
}
setupUI();
// Sahow Alert
function showAlert(alert_text, type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(alert_text, type);
  // const alertT = bootstrap.Alert.getOrCreateInstance("#success-alert");
  // setTimeout(alertT.close(), 1000);
}
function postClicked(id) {
  location.href = `postDetails.html?postId=${id}`;
}
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");
getPostDetails();
function getPostDetails() {
  toggleLoader(true);
  axios.get(`${baseUrl}/posts/${id}`).then((res) => {
    toggleLoader(false);
    // variables
    let post = res.data.data;
    let comments = res.data.data.comments;
    console.log(res);
    let author = res.data.data.author;
    let postTitle = "";
    if (post.title != null) {
      postTitle = post.title;
    }
    const postContent = document.getElementById("user-post");
    // looping for comments
    comments.map((comment) => {
      document.getElementById("comments-body").innerHTML += `
      <div class="p-3" style="background-color: #ddd">
      <img
        src="${comment.author.profile_image}"
        alt=""
        class="rounded-circle"
        style="width: 40px; height: 40px"
      />
      <b>@h${comment.author.username}</b>
      <p>${comment.body}</p>
    </div>
  </div>
      `;
    });

    // storing data
    postContent.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-header">
        <img
          style="width: 40px; height: 40px"
          src="${author.profile_image}"
          alt=""
          class="rounded-circle border-2"
        />
        <b class="username">@${author.username}</b>
      </div>
      <div class="card-body">
        <img
          src="${post.image}"
          class="w-100"
        />
        <h6 style="color: rgb(179, 177, 177)" class="mt-1">${post.created_at}</h6>
        <h5>${postTitle}</h5>
        <p>
        ${post.body}
        </p>
        <hr />
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-pen"
            viewBox="0 0 16 16"
          >
            <path
              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
            />
          </svg>
          <span style="margin-right: 10px">(${post.comments_count}) comments</span>
        </div>

  </div>
  `;
  });
}
window.onscroll = function () {
  if (window.scrollY >= 600) {
    document.getElementById("scroll-top").style.display = "block";
  } else {
    document.getElementById("scroll-top").style.display = "none";
  }
};
document.getElementById("scroll-top").onclick = function () {
  window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
};
