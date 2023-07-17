let baseUrl = "https://tarmeezacademy.com/api/v1";

let urlSearch = location.search;

let URLPost = new URLSearchParams(urlSearch);

let getUrl = URLPost.get("postId");


function userIdStorage() {
  let user =localStorage.getItem('user');
  if (user != null) {
    let userIdLocalStorage = JSON.parse(user).id;
    if (getUrl == userIdLocalStorage) {
      document.getElementById('addPost').style.visibility = 'visible';
    } else {
      document.getElementById('addPost').style.visibility = 'hidden';
    }
  }
}

// default Avatar
function avatar(avatar) {
  let defaultAvatar = "Imgs/kisspng-avatar.jpg";
  if (!Object.keys(avatar).length) {
    return defaultAvatar;
  } else {
    return avatar;
  }
}
// default Image
function imgs(img) {
  let defaultImage = "Imgs/placeholders/landing-1.png";
  if (!Object.keys(img).length) {
    return defaultImage;
  } else {
    return img;
  }
}

// Request Login
function login() {
  
  document.getElementById('login').addEventListener('click', () => {
      let userName = document.querySelector('.userName').value;
      let password = document.querySelector('.password').value;
      
      let params = {
        "username" : userName,
        "password" : password
      }
      toggleLoader(true)

      axios.post(`${baseUrl}/login`, params)
      .then((response) => {
        window.localStorage.setItem('token', response.data.token)
        window.localStorage.setItem('user', JSON.stringify(response.data.user))
        
        toggleLoader(false)

        var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal-1'));
        myModal.hide();
        
        showAlert('Logged In successfully', 'success')
        
        setupUI()
        location.reload();
        
      })
    .catch((error) => {
      document.querySelector('.error-login').innerHTML = error.response.data.message;
    }).finally(() => {
      toggleLoader(false)
    })
  })
}
login();


let registerBtn = document.getElementById('register-btn');
let loginBtn = document.getElementById('login-btn');
let logoutBtn = document.getElementById('logout-btn');

// Logout From Account
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  showAlert('Logged out successfully', 'success')

  setupUI()
  location.reload();
  
}


// Login Alert
function showAlert(customMessage, type) {
    const alertPlaceholder = document.getElementById('login-success')
    const alert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
  }

  alert(customMessage, type)

  // ToDo : Hide The Alert
  setTimeout(() => {
  const alertToHide = bootstrap.Alert.getOrCreateInstance('#login-success')
  // alertToHide.close()
  
  }, 2000);

}
// Show And fade setupUI
function setupUI() {
  let token = window.localStorage.getItem('token');
  let user = window.localStorage.getItem('user');
  
  if (user == null) {
    document.getElementById('navUserName').innerHTML = '';
  } else {
    let contentUsername = `<img style="width: 40px; height: 40px;" class="rounded-circle border border-3" src="${avatar(JSON.parse(user).profile_image)}" alt="">
    <h5 class="m-0 fw-bold">${JSON.parse(user).username}</h5>`;
    
    document.getElementById('navUserName').innerHTML = contentUsername;
  }

  let AddPost = document.getElementById('addPost');
  

  if (token == null) {
    registerBtn.style.setProperty('display', 'block' , 'important');
    loginBtn.style.setProperty('display', 'block' , 'important');
    logoutBtn.style.setProperty('display', 'none' , 'important');
    AddPost.style.setProperty('display', 'none' );
    
  } else {
    registerBtn.style.setProperty('display', 'none' , 'important');
    loginBtn.style.setProperty('display', 'none' , 'important');
    logoutBtn.style.setProperty('display', 'block' , 'important');
    AddPost.style.setProperty('display', 'block');
  }
  
}
setupUI()

// Request Create And Edit Post
document.getElementById('newPost').addEventListener('click', () => {
  let postId = document.getElementById('post-id-input').value
  let isCreate = postId == null || postId == ""

  let TitleName = document.querySelector('#TitleName').value;
  let Body = document.querySelector('#Body').value;
  let imgPost = document.querySelector('#imgPost');

  let token = window.localStorage.getItem('token')
  
  let formData = new FormData();

  formData.append('body', Body);
  formData.append('title', TitleName);
  formData.append('image', imgPost.files[0]);

  toggleLoader(true)

  let url = ``
  
  if (isCreate) {
    url = `${baseUrl}/posts`;
    
  } else {
    url = `${baseUrl}/posts/${postId}`
    
    formData.append('_method', 'put')
  }
  
  axios.post(url, formData,
  { headers: {
    'authorization': `Bearer ${token}`,
    "Content-Type": "multipart/form-data" 
  }})
  .then((response) => {
    
    toggleLoader(false)
    location.reload();
    var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal-3'));
    myModal.hide();
    
    showAlert('Posted successfully', 'success')
    
  })
  .catch((error) => {
    showAlert(`${error.response.data.message}`, 'danger');
  }).finally(() => {
    toggleLoader(false)
  })
  
})

// Model Create Post
function addBtnClick() {
  document.getElementById('addBtn').addEventListener('click', () => {
  document.getElementById('post-Model-title').innerHTML = 'Create A New Post';
  document.getElementById('newPost').innerHTML = 'Create';
  document.getElementById('post-id-input').value = '';
  document.getElementById('TitleName').value = '';
  document.getElementById('Body').value = '';
  
  let postModel = new bootstrap.Modal(document.getElementById('exampleModal-3'), {})
  postModel.toggle()
  })
}
addBtnClick()

// Request Register
document.getElementById('register').addEventListener('click', () => {
  let registerName = document.querySelector('#registerName').value;
  let registerUsername = document.querySelector('#registerUsername').value;
  let registerPassword = document.querySelector('.registerPassword').value;
  let profileIamge = document.querySelector('#profileIamge');
  
  let formData = new FormData();

  formData.append('username', registerUsername)
  formData.append('password', registerPassword)
  formData.append('name', registerName)
  formData.append('image', profileIamge.files[0])
  
  toggleLoader(true)
  axios.post(`${baseUrl}/register`, formData)
  .then((response) => {
    window.localStorage.setItem('token', response.data.token)
    window.localStorage.setItem('user', JSON.stringify(response.data.user))
    
    var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal-2'));
    myModal.hide();
    
    showAlert(`New User Registered successfully, Welcome ${registerName[0].toUpperCase() + registerName.substring(1)}`, 'success')
    
    toggleLoader(false)
    setupUI()
    
  })
  .catch((error) => {
    document.querySelector('.error-register').innerHTML = error.response.data.message;
  }).finally(() => {
    toggleLoader(false)
  })
})

// get The profileImage From LocalStorage
function imgComment() {
    let userLocalStorage = window.localStorage.getItem('user');
    
    if (userLocalStorage == null) {
      return "Imgs/kisspng-avatar.jpg";
      
      
    } else {
      return `${JSON.parse(userLocalStorage).profile_image}`;
    }
    
  }

// Get Current User From LocalStorage
function getCurrentUser() {
  let user = null;
  let storageUser = localStorage.getItem('user')

  if (storageUser != null) {
    user = JSON.parse(storageUser)
  }
  return user
}

listGroup()

// When OnClicked Post Turns Into A Page Details 
function postDetails() {
  document.querySelectorAll(`.comments`).forEach((el) => {
    el.addEventListener('click', () => {
      
      window.location = `postDetails.html?postId=${el.id}`;
    })
  })
  
  
}

// When OnClicked Avatar And Username Turns Into A Profile Page 
function postProfile() {
  document.querySelectorAll(`.imageAndUsername`).forEach((el) => {
    el.addEventListener('click', () => {
      
      window.location = `profilePage.html?postId=${el.dataset.profile}`;
    })
  })
  
  
}
// When OnClicked Avatar And Username Turns Into A Profile Page 
function navProfile() {
  document.querySelectorAll(`#navUserName`).forEach((el) => {
    el.addEventListener('click', () => {
      
      window.location = `profilePage.html?postId=${(JSON.parse(window.localStorage.getItem('user')).id)}`;
    })
  })
  document.querySelectorAll(`#Profile`).forEach((el) => {
    el.addEventListener('click', () => {
      let token = localStorage.getItem('token')
      if (token != null) {
        window.location = `profilePage.html?postId=${(JSON.parse(window.localStorage.getItem('user')).id)}`;
      } else {
        showAlert('You Must Login First', 'danger')
      }
    })
  })
  
}
navProfile()
// When Clicked On Ellipsis
function listGroup() {
  
  let listGroup = document.querySelectorAll(`.listGroup`)
  document.querySelectorAll(`.ellipsis`).forEach((el) => {
    
    el.addEventListener('click', () => {
      
      modelEdit(el.id)
      modelDelete(el.id)
      let toggle = document.getElementById(`listGroup-${el.id}`);
      toggle.classList.toggle('active');
      listGroup.forEach((ele) => {
        
        
      })
    })
  })
}

// Model Edit Post
function modelEdit(id) {
  
  document.getElementById(`editPost-${id}`).addEventListener('click', () => {
  
    document.getElementById('post-Model-title').innerHTML = 'Edit Post';
    document.getElementById('newPost').innerHTML = 'Update';
    
    let postModel = new bootstrap.Modal(document.getElementById('exampleModal-3'), {})
    postModel.toggle()
    
    axios.get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      let post = response.data.data;
      
      document.getElementById('post-id-input').value = post.id;
      document.getElementById('TitleName').value = post.title;
      document.getElementById('Body').value = post.body
      
      
    })

  })
}
// Model Delete Post
function modelDelete(id) {
  
  document.getElementById(`deleteBtn`).addEventListener('click', () => {

  let token = localStorage.getItem('token');
  let  headers = {
    'authorization': `Bearer ${token}`,
  }
  toggleLoader(true)
    axios.delete(`${baseUrl}/posts/${id}`, {
    headers: headers
  })
  .then((response) => {

    toggleLoader(false)
    var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal-4'));
    myModal.hide();
    
    location.reload()
    
    showAlert('The Post Has Been Deleted successfully', 'success')
    
  }).catch((error) => {
    showAlert(`${error.response.data.message}`, 'danger');
  }).finally(() => {
    toggleLoader(false)
  })

  })
}

// Toggle Loader
function toggleLoader(show = true) {
  if (show) {
    document.getElementById('loader').style.visibility = 'visible';
    
  } else {
    document.getElementById('loader').style.visibility = 'hidden';
  }
}
