
userIdStorage()

function profileInfo() {
  axios.get(`${baseUrl}/users/${getUrl}`)
  .then((response) => {
    
    let userResponse = response.data.data
    
    document.getElementById('profileInterface').innerHTML = '';
    document.getElementById('namePosts').innerHTML = '';
    
      let content = `
      <div class="imageProfile text-center border-end pe-5 ps-4">
        <img class="imgProfile rounded-circle border border-4" style="width: 130px; height: 130px;" src="${avatar(userResponse.profile_image)}" alt="Photo">
        <h2 class="m-0 mt-2">${userResponse.username[0].toUpperCase() + userResponse.username.substring(1)}</h2>
      </div>
      <div class="numberInfo text-center d-flex align-items-center flex-fill flex-column">
        <p class="m-0 mb-5 fs-5 d-flex align-items-center">Posts: <Span class="text-primary ms-2">${userResponse.posts_count}</Span></p>
        <p class="m-0 fs-5 d-flex align-items-center">Comments: <Span class="text-primary ms-2 fs--3">${userResponse.comments_count}</Span></p>
      </div>
      `
  
      document.getElementById('profileInterface').innerHTML = content;
      document.getElementById('namePosts').innerHTML = `${userResponse.username[0].toUpperCase() + userResponse.username.substring(1)}'s Posts...`;
    
  })
}

profileInfo();

function PostsProfile() {
  toggleLoader(true)
  axios.get(`${baseUrl}/users/${getUrl}/posts`)
  .then((response) => {
    let userPostsResponse = response.data.data;

    toggleLoader(false)

    for(post of userPostsResponse) {

      //Show or Hide (Edit) Button
      let user = getCurrentUser()
      let isMyPost = user != null && post.author.id == user.id;
      editButton = ``;

      if (isMyPost) {
        editButton = `
        <div id="${post.id}" class="ellipsis position-relative p-2 rounded-circle" style="cursor: pointer">
            <i class="fa-solid fa-ellipsis fa-xl"></i>
            <div id="listGroup-${post.id}" class="listGroup active card p-2 position-absolute" style="left: -134px; top: 40px; width: 170px;">
              <div id="editPost-${post.id}" class="w-100 p-2 edit rounded d-flex align-items-center">
                <i class="fa-solid fa-pen me-2"></i>
                <span>Edit Post</span>
              </div>
              <div id="deletePost-${post.id}" class="w-100 text-danger p-2 delete rounded d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#exampleModal-4">
                <i class="fa-solid fa-trash-can me-2"></i>
                <span>Delete Post</span>
              </div>
            </div>
          </div>
        `
      }

      let content = `
      <div id="${post.id}" class="card shadow mb-4">
      <div class="card-header d-flex align-items-center justify-content-between">
        <div data-profile="${post.author.id}" class="imageAndUsername d-flex align-items-center" style="cursor: pointer">
          <img
            src="${avatar(post.author.profile_image)}"
            alt="Photo"
            class="avatar me-2 rounded-circle border border-3"
          />
          <h3 class="avatar-name fs-5 fw-bold m-0">${post.author.username}</h3>
        </div>

        ${editButton}

        </div>
      <img
        src="${imgs(post.image)}"
        style="max-height: 600px"
        class="img-fluid"
        alt="Photo"
      />
      <div id="${post.id}" class="card-body comments" style="cursor: pointer">
        <p class="card-text">
          <small class="text-body-secondary">${post.created_at}</small>
        </p>
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text">${post.body}</p>
        <hr />
        <a class="d-flex align-items-center comment">
          <i class="fa-regular fa-comment fa-flip-horizontal fa-2x me-3 text-primary"></i>
          <span class="fs-5 text-primary"> (${post.comments_count}) Comments </span>
          <ul class="ms-3 d-flex tags" id="tags-${post.id}"></ul>
        </a>
      </div>
        
      </div>
      `
      document.getElementById('posts').innerHTML += content;

      let currentPostTags = `tags-${post.id}`;
      document.getElementById(currentPostTags).innerHTML = '';
      for(tag of post.tags) {
        let lis = `<li>${tag.name}</li>`;
        document.getElementById(currentPostTags).innerHTML += lis;
      }
      postDetails()
      listGroup()
      postProfile()
    }
  }).finally(() => {
    toggleLoader(false)
  })
}
PostsProfile()