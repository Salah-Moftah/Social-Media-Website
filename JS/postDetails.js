
userIdStorage();
getPost();

// Get Request Post
function getPost() {
  toggleLoader(true)

  axios.get(`${baseUrl}/posts/${getUrl}`)
  .then((response) => {
    toggleLoader(false)

    let respon = response.data.data;
    let comments = respon.comments;
    
    content = `
    <div class="card shadow mb-4">
    <div class="card-header d-flex align-items-center">
    <img
    src="${avatar(respon.author.profile_image)}"
    alt="Photo"
        class="avatar me-2 rounded-circle border border-3"
      />
      <h3 class="avatar-name fs-5 fw-bold m-0">${respon.author.username}</h3>
    </div>
    <img
      src="${imgs(respon.image)}"
      style="max-height: 600px"
      class="img-fluid"
      alt="Photo"
    />
    <div id="content" class="card-body">
      <p class="card-text">
        <small class="text-body-secondary">${respon.created_at}</small>
      </p>
      <h5 class="card-title">${respon.title}</h5>
      <p class="card-text">${respon.body}</p>
      <hr />
      <a class="d-flex align-items-center">
      <i class="fa-regular fa-comment fa-flip-horizontal fa-2x me-3 text-primary"></i>
        <span class="fs-5 text-primary"> (${
          respon.comments_count
        }) Comments </span>
        <ul class="ms-3 d-flex tags" id="tags-${respon.id}"></ul>
        </a>
        </div>
        
        <div id="cardComment" class="card card-body rounded-0 rounded-bottom border-start-0 border-end-0 border-bottom-0">
          <div id="sectionComments">
          </div>
        </div>
        
          <div id="sectionWriteComment" class="py-3 px-4 d-flex align-items-center">
            <img id="avatar-1" src="${imgComment()}" alt="Photo" class="avatar me-2 rounded-circle border border-3"/>
            <input id="newComment" class="form-control rounded-circle-end me-2" type="text" placeholder="Write A Comment...">
            <div id="send">
              <i class="fa-solid fa-paper-plane fa-lg text-primary btn-primary" role="button"></i>
            </div>
          </div>
        </div>
    `;
  document.getElementById("posts").innerHTML = content;
  
  if (!Object.keys(comments).length) {
  
  document.getElementById("cardComment").style.setProperty('display', 'none');
  } else {
    
    for (comment of comments) {
      
      let commentsContent = `
      <div class="container text-dark p-2">
      <div class="row d-flex ">
        <div class="">
          <div class="d-flex flex-start mb-3">
            <img class="rounded-circle me-2 border border-3 mt-2"
              src="${avatar(
                comment.author.profile_image
              )}" alt="avatar" style='width: 40px; height: 40px;'/>
            <div class="card w-100">
              <div class="card-body p-3">
                <div class="">
                  <h5 class="mb-0 mb-2 fw-bold fs-5">${comment.author.username}</h5>
                  <p class="mb-2">
                  ${comment.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    document.getElementById("sectionComments").innerHTML += commentsContent;
    
  }
}
  disabled()
  createComment()

}).finally(() => {
  toggleLoader(false)
})
}

// Create Comment
function createComment() {
  let send = document.getElementById('send');
  send.addEventListener('click', () => {
  let comment = document.getElementById('newComment').value;
  let token = window.localStorage.getItem('token');
  if (comment !== '') {

  let params = {
    "body": comment,
  }
  let headers = {
    'authorization': `Bearer ${token}`,
  }
  toggleLoader(true)

  axios.post(`${baseUrl}/posts/${getUrl}/comments`, params, {
    headers: headers
  })
  .then((response) => {
    toggleLoader(false)

    getPost();

  }).finally(() => {
    toggleLoader(false)
  })
  }
  
  })
}

function disabled() {
  let token = window.localStorage.getItem('token');
  let comment1 = document.getElementById('newComment');
    
  if (token == null) {
    comment1.setAttribute("disabled", "");
    
  } else {
    comment1.removeAttribute("disabled");
  }
}