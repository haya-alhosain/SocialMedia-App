// const baseUrl = "https://tarmeezacademy.com/api/v1";

// getUser
function getUserClickedId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
}
getUser();
function getUser() {
  const id = getUserClickedId();
  toggleLoader(true);
  axios.get(`${baseUrl}/users/${id}`).then((res) => {
    toggleLoader(false);
    let post = res.data.data;
    let userContent = `
    <div class="col-2">
    <img
      class="rounded-circle"
      src="${post.profile_image}"
      alt=""
      style="width: 110px; height: 110px"
    />
  </div>
  <div
    class="col-4 d-flex justify-content-evenly flex-column"
    style="font-size: 16px; font-weight: 500"
  >
    <div>${post.email}</div>
    <div>${post.name}</div>
    <div>${post.username}</div>
  </div>
  <div class="col-4">
    <div class="number">
      <span style="font-size: 40px; font-weight: 100; color: #000"
        >${post.posts_count}</span
      >Posts
    </div>
    <div class="number">
      <span style="font-size: 40px; font-weight: 100; color: #000"
        >${post.comments_count}</span
      >Comments
    </div>
  </div>
    `;
    document.getElementById("user-info").innerHTML = userContent;
    document.getElementById(
      "username-header"
    ).innerHTML = `${post.username}'s Posts`;
  });
}

getpostsUser();

function getpostsUser() {
  const id = getUserClickedId();
  toggleLoader(true);

  axios.get(`${baseUrl}/users/${id}/posts`).then((res) => {
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
          )}')">edit</button>

          `;
      }
      let content = `
        <div class="card shadow-sm">
            <div class="card-header">
                <img style="width: 40px; height: 40px" src=${post.author.profile_image} alt="" class="rounded-circle border-2"/>
                <b class="username">${post.author.username}</b>
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
      document.getElementById("user-posts").innerHTML += content;
      const currentPostTags = `post-tags-${post.id}`;
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
function profileClicked() {
  let user = getUserInfo();
  let user_Id = user.id;
  window.location = `profile.html?userid=${user_Id}`;
}
