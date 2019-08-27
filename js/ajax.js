async function getPosts() {
  const { data } = await axios.get("https://jordy-dhoker-talent.herokuapp.com/posts");
  buildPosts(data);
}

function buildPosts(posts) {
  let postString = ""
  posts.forEach(post => {
    postString += '<div class="post"><a>'
            + post.user
            + '</a><span>'
            + post.createdAt
            + '</span><p>'
            + post.text.toString()
            + '</p></div>';
  });
  document.getElementById("posts").innerHTML = postString;
}
