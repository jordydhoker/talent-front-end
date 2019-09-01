const hostName = "https://jordy-dhoker-talent.herokuapp.com";
//const hostName = "http://localhost:3000";

async function getPosts() {
  const { data } = await axios.get(hostName + "/posts");
  buildPosts(data);
}

async function createPost() {
  const text = document.getElementById("text").value;
  const token = getCookie("token");
  await axios.post(
    hostName + "/posts",
    { text },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  location.reload();
}

async function initProfile() {
  const userId = document.location.search.replace("?", "");
  let user = await axios.get(hostName + "/user/" + userId);
  user = user.data;
  let posts = await axios.get(hostName + "/posts/user/" + userId);
  posts = posts.data;
  user.posts = posts;
  buildUser(user);
  buildPosts(posts);
}

async function getCurrentUser() {
  const token = getCookie("token");
  if (token) {
    const { data } = await axios.get(hostName + "/user/current", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userId = document.location.search.replace("?", "");
    if (data._id === userId) {
      document.getElementById("nav").innerHTML +=
        '<a href="' + "./user.html?" + data._id + '"  class="current-page">Profile</a>';
    } else {
      document.getElementById("nav").innerHTML +=
        '<a href="' + "./user.html?" + data._id + '">Profile</a>';
    }
    document.getElementById("nav").innerHTML += '<a href="./logout.html">Logout</a>';

    const createPostElement = document.getElementById("createPost");
    if (createPostElement) {
      createPostElement.innerHTML = `<h2>New post</h2>
      <textarea name="text" id="text"></textarea>
      <button onclick="createPost()">Post</button>`;
    }
  } else {
    document.getElementById("nav").innerHTML +=
      '<a href="./login.html">Login</a><a href="./register.html">Register</a>';
  }
}

function buildUser(user) {
  document.getElementById("profile").innerHTML =
    "<span>Name</span><b>" +
    user.name +
    "</b><span>Email</span><b>" +
    user.email +
    "</b><span>Date joined</span><b>" +
    new Date(user.createdAt).toLocaleTimeString("nl", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "long"
    }) +
    "</b><span>Amount of posts</span><b>" +
    user.posts.length +
    "</b>";
}

function buildPosts(posts) {
  let postString = "";
  posts.reverse().forEach(post => {
    postString +=
      '<div class="post"><a href="./user.html?' +
      post.user._id +
      '">' +
      post.user.name +
      "</a><span>" +
      new Date(post.createdAt).toLocaleTimeString("nl", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "long"
      }) +
      "</span><p>" +
      post.text.toString() +
      "</p></div>";
  });
  document.getElementById("posts").innerHTML = postString;
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data } = await axios.post(hostName + "/user/login", { email, password });
  document.cookie = "token=" + data.token + ";Fri, 19 Jun 2022 20:47:11 UTC;path=/";
  window.location = window.location.pathname.replace("login", "index");
}

async function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data } = await axios.post(hostName + "/user/signup", { name, email, password });
  document.cookie = "token=" + data.token + ";Fri, 19 Jun 2022 20:47:11 UTC;path=/";
  window.location = window.location.pathname.replace("register", "index");
}

function logout() {
  document.cookie = "token=;Fri, 19 Jun 2000 20:47:11 UTC;path=/";
  window.location = window.location.pathname.replace("logout", "login");
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
