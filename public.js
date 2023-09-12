// const { default: axios } = require("axios");
let baseUrl = "https://tarmeezacademy.com/api/v1";
function userClicked(userId) {
  window.location = `profile.html?userid=${userId}`;
}
getPosts();
function getPosts(page = 1) {
  toggleLoader(true);
  axios.get(`${baseUrl}/posts?limit=5&page=${page}`).then((res) => {
    toggleLoader(false);
    let posts = res.data.data;
    posts.map((post) => {
      let postTitle = "";
      if (post.title != null) {
        postTitle = post.title;
      }
      let user = getUserInfo();
      let isMyPost = user != null && post.author.id == user.id;
      let editBtnContent = ``;
      if (isMyPost) {
        editBtnContent = `
        <button class="btn btn-danger float-end p-1 mt-1 mx-1" style="font-size:12px" onclick="detetePostClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')">delete</button>
        <button class="btn btn-secondary float-end p-1 mt-1" style="font-size:12px" onclick="editPostClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')">edit</button
        `;
      }
      document.getElementById("allposts").innerHTML += `
      <div class="card shadow-sm">
          <div class="card-header">
              <span onclick="userClicked(${post.author.id})" style="cursor:pointer">
                  <img style="width: 40px; height: 40px" src=${post.author.profile_image} alt=""     class="rounded-circle border-2"/>
                  <b class="username">${post.author.username}</b>
              </span>
              ${editBtnContent}
          </div>
          <div class="card-body" onclick="postClicked(${post.id})">
            <img src="${post.image}" class="w-100" />
            <h6 style="color: rgb(179, 177, 177)" class="mt-1">${post.created_at}</h6>
            <h5>${postTitle}</h5>
            <p>${post.body}</p>
            <hr />
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
              </svg>
              <span style="margin-right:10px">(${post.comments_count}) comments</span>
              <span id="post-tags-${post.id}">
              </span>
            </div>
          </div>
        </div>
  `;

      let currentPostTags = `post-tags-${post.id}`;
      document.getElementById(currentPostTags).innerHTML = "";

      for (tag of post.tags) {
        let tagsContent = `
        <button class="btn btn-sm rounded-5" style="background-color:gray; color:#fff">${tag.name}</button>
      `;
        document.getElementById(currentPostTags).innerHTML += tagsContent;
      }
    });
  });
}

//Get Current User
function getUserInfo() {
  let user = null;
  if (localStorage.getItem("user") != null) {
    user = JSON.parse(localStorage.getItem("user"));
  }
  return user;
}
// Create New Post
function createPostClicked() {
  const titlePost = document.getElementById("title-post").value;
  const bodyPost = document.getElementById("body-post").value;
  const imgPost = document.getElementById("image-post").files[0];
  let token = localStorage.getItem("token");
  let bodyFormData = new FormData();
  bodyFormData.append("title", titlePost);
  bodyFormData.append("body", bodyPost);
  bodyFormData.append("image", imgPost);

  let headers = {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
  let postId = document.getElementById("post-id").value;
  let isCreate = postId == null || postId == "";
  let url = ``;
  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    bodyFormData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }
  toggleLoader(true);
  axios
    .post(url, bodyFormData, headers)
    .then((res) => {
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("You Are Create New Post", "success");
      location.reload();
    })
    .catch((error) => {
      const message = error.response.data.message;
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
// createCommentClicked
function createCommentClicked() {
  let commentContent = document.getElementById("comment-input").value;
  let params = {
    body: commentContent,
  };

  let token = localStorage.getItem("token");
  let url = `${baseUrl}/posts/${id}/comments`;
  let headers = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  axios
    .post(url, params, headers)
    .then((res) => {
      showAlert("The comment has been successfully", "success");
      // getPost();
      location.reload();
    })
    .catch((error) => {
      let errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}
// Edit Post
function editPostClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-modal-submit").innerHTML = "Update";
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("title-post").value = post.title;
  document.getElementById("body-post").value = post.body;
  document.getElementById("post-id").value = post.id;

  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal")
  );
  postModal.toggle();
}
// Create Post
function addBtnClicked() {
  document.getElementById("post-modal-submit").innerHTML = "Create";
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("title-post").value = "";
  document.getElementById("body-post").value = "";
  document.getElementById("post-id").value = "";

  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal")
  );
  postModal.toggle();
}
// Delete Post
function detetePostClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-delete-id").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal")
  );
  postModal.toggle();
}
// confirm deleted
function confiremDelete() {
  let postId = document.getElementById("post-delete-id").value;
  let token = localStorage.getItem("token");
  let headers = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  axios
    .delete(`${baseUrl}/posts/${postId}`, headers)
    .then((res) => {
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      // getPosts();
      location.reload();
      showAlert("The Post is Deleted", "success");
    })
    .catch((error) => {
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert(error.message, "danger");
    });
}
// loader
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("toggle-loader").style.visibility = "visible";
  } else {
    document.getElementById("toggle-loader").style.visibility = "hidden";
  }
}
