  // Supabase Configuration
  const SUPABASE_URL = 'https://ywchfwrienbgastlicye.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Y2hmd3JpZW5iZ2FzdGxpY3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MDY3ODIsImV4cCI6MjA4MzA4Mjc4Mn0.4GxhWuEC3IbCxti6tAgwEh-nFr0tK1VhW2YbnyUk2uc';
  
  // Initialize Supabase
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('Supabase Connected');

 
// ================= ELEMENTS =================
const createPostForm = document.getElementById('createPostForm');
const modal = document.getElementById('createPostModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const postsContainer = document.querySelector('.posts-grid');

// ================= MODAL =================
openModalBtn.addEventListener('click', () => modal.classList.add('active'));
closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

// ================= CREATE POST =================
createPostForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const imageFile = document.getElementById('postImage').files[0];

  // ✅ Optional: check user
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    alert('Please login first');
    return;
  }

  let imageUrl = null;

  // Upload image if provided
  if (imageFile) {
    const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`; // remove spaces
    const { error: uploadError } = await supabaseClient.storage
      .from('post-image')
      .upload(fileName, imageFile);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const encodedFileName = encodeURIComponent(fileName);
    imageUrl = `${SUPABASE_URL}/storage/v1/object/public/post-image/${encodedFileName}`;
  }

  // Insert post
  const { error } = await supabaseClient
    .from('posts')
    .insert([
      {
        user_id: user.id,  // RLS disabled, par still good practice
        title,
        content,
        image_url: imageUrl
      }
    ]);

  if (error) {
    console.log('Insert error:', error);
    alert(error.message);
    return;
  }

  alert('Post created successfully!');
  createPostForm.reset();
  modal.classList.remove('active');
  loadPosts();
});

// ================= LOAD POSTS =================
async function loadPosts() {
  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Load error:', error);
    return;
  }

  postsContainer.innerHTML = '';

  data.forEach((post) => {
    postsContainer.innerHTML += `
      <div class="post-card">
        ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" />` : ''}
        <div class="post-content">
          <h3>${post.title}</h3>
          <p class="post-description">${post.content}</p>
          <button onclick="deletePost('${post.id}')">Delete</button>
          <button onclick="editPost('${post.id}')">Edit</button>
        </div>
      </div>
    `;
  });
}





// ================= DELETE POST =================
window.deletePost = async function(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
  
    const { error } = await supabaseClient.from('posts').delete().eq('id', postId);
    if (error) {
      alert('Error deleting post: ' + error.message);
      return;
    }
  
    alert('Post deleted successfully!');
    loadPosts();
  };

  // ================= EDIT POST =================
window.editPost = async function(postId) {
    const { data, error } = await supabaseClient.from('posts').select('*').eq('id', postId).single();
    if (error) {
      alert('Error fetching post: ' + error.message);
      return;
    }
  
    document.getElementById('postTitle').value = data.title;
    document.getElementById('postContent').value = data.content;
    // image optional
  
    editMode = true;
    editPostId = postId;
  
    modal.classList.add('active');
  };
// Initial load
loadPosts();