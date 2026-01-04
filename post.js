  // Supabase Configuration
  const SUPABASE_URL = 'https://ywchfwrienbgastlicye.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Y2hmd3JpZW5iZ2FzdGxpY3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MDY3ODIsImV4cCI6MjA4MzA4Mjc4Mn0.4GxhWuEC3IbCxti6tAgwEh-nFr0tK1VhW2YbnyUk2uc';
  
  // Initialize Supabase
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('Supabase Connected');

  document
  .getElementById('createPostForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('image').files[0];

    // 1️⃣ Get logged in user
    const {
      data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {
      alert('Login required');
      return;
    }

    let imageUrl = null;

    // 2️⃣ Upload image (optional)
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;

      const { error: uploadError } =
        await supabaseClient.storage
          .from('post-images')
          .upload(fileName, imageFile);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      imageUrl = `${SUPABASE_URL}/storage/v1/object/public/post-images/${fileName}`;
    }

    // 3️⃣ Insert post
    const { error } = await supabaseClient
      .from('posts')
      .insert([
        {
          user_id: user.id,
          title,
          content,
          image_url: imageUrl
        }
      ]);

    if (error) {
      alert(error.message);
    } else {
      alert('Post created');
      location.reload();
    }
  });


  async function loadPosts() {
    const { data, error } = await supabaseClient
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
  
    if (error) return;
  
    const container = document.getElementById('posts');
  
    container.innerHTML = '';
  
    data.forEach((post) => {
      container.innerHTML += `
        <div class="post">
          <h3>${post.title}</h3>
          ${post.image_url ? `<img src="${post.image_url}" />` : ''}
          <p>${post.content}</p>
          <button onclick="deletePost('${post.id}')">Delete</button>
        </div>
      `;
    });
  }
  
  loadPosts();
 
 // Get modal elements
 const modal = document.getElementById('createPostModal');
 const openModalBtn = document.getElementById('openModalBtn');
 const closeModalBtn = document.getElementById('closeModalBtn');
 const createPostForm = document.getElementById('createPostForm');

 // Open modal
 openModalBtn.addEventListener('click', () => {
     modal.classList.add('active');
 });

 // Close modal
 closeModalBtn.addEventListener('click', () => {
     modal.classList.remove('active');
 });

 // Close modal when clicking outside
 window.addEventListener('click', (e) => {
     if (e.target === modal) {
         modal.classList.remove('active');
     }
 });

 // Handle form submission
 createPostForm.addEventListener('submit', (e) => {
     e.preventDefault();
     
     const title = document.getElementById('postTitle').value;
     const content = document.getElementById('postContent').value;
     const image = document.getElementById('postImage').files[0];
     
     console.log('Post Created:', { title, content, image });
     
     // Close modal and reset form
     modal.classList.remove('active');
     createPostForm.reset();
     
     alert('Post published successfully!');
 });