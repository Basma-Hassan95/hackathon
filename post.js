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
openModalBtn.addEventListener('click', () => {
  modal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

// ================= CREATE POST =================
createPostForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('postTitle').value;
  const content = document.getElementById('postContent').value;
  const imageFile = document.getElementById('postImage').files[0];

  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    alert('Please login first');
    return;
  }

  let imageUrl = null;

  // Upload image
  if (imageFile) {
    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabaseClient.storage
      .from('post-image')
      .upload(fileName, imageFile);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    imageUrl = `${SUPABASE_URL}/storage/v1/object/public/post-image/${fileName}`;
  }

  // Insert post
  const { error } = await supabaseClient
    .from('posts')
    .insert([
      {
        user_id: user.id,
        title: title,
        content: content,
        image_url: imageUrl
      }
    ]);

  if (error) {
    alert(error.message);
  } else {
    alert('Post created successfully');
    createPostForm.reset();
    modal.classList.remove('active');
    loadPosts();
  }
});

// ================= LOAD POSTS =================
async function loadPosts() {
  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  postsContainer.innerHTML = '';

  data.forEach((post) => {
    postsContainer.innerHTML += `
      <div class="post-card">
        ${post.image_url ? `<img src="${post.image_url}" />` : ''}
        <div class="post-content">
          <h3>${post.title}</h3>
          <p class="post-description">${post.content}</p>
        </div>
      </div>
    `;
  });
}

// Initial load
loadPosts();