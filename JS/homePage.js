
let currentPage = 1;
let lastPage = 1;

// Infinte Scroll
window.addEventListener("scroll", () => {
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage++;
    
    getPosts(currentPage);
  }
});

getPosts()

// Request Get Posts
function getPosts(page = 1) {
  toggleLoader(true)
  
  axios.get(`${baseUrl}/posts?page=${page}`)
  .then((response) => {

    toggleLoader(false)

    lastPage = response.data.meta.last_page;

    for (post of response.data.data) {

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

      content = `
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
        
      </div>`
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
  })
}
