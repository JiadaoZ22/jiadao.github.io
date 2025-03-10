document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('gallery');
  const zoomOverlay = document.getElementById('zoom-overlay');
  const zoomedImage = document.getElementById('zoomed-image');
  const zoomContainer = document.querySelector('.zoom-container');
  
  // Initialize the gallery
  initGallery();
  
  async function initGallery() {
      const images = await fetchImagesFromDirectory();
      if (images) {
          renderGallery(images);
          setupLazyLoading();
          setupZoomFunctionality();
      } else {
          gallery.innerHTML = '<p class="no-images">No images found in the gallery.</p>';
      }
  }
  
  async function fetchImagesFromDirectory() {
      try {
          // Fetch the manifest file
          const response = await fetch('./assets/gallery/gallery-manifest.json');
          if (!response.ok) {
              throw new Error('Failed to load gallery manifest');
          }
          
          const data = await response.json();
          const imageFiles = data.images || [];
          
          // Filter for supported image types
          const supportedExtensions = ['.jpg', '.jpeg', '.png'];
          const filteredImages = imageFiles.filter(filename => {
              const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
              return supportedExtensions.includes(extension);
          });
          
          if (filteredImages.length === 0) {
              return null;
          }
          
          // Return the image paths (we'll load them lazily later)
          return filteredImages.map(filename => ({
              filename: filename,
              path: `./assets/gallery/${filename}`
          }));
      } catch (error) {
          console.error('Error fetching images:', error);
          return null;
      }
  }
  
  function renderGallery(images) {
      // Clear loading indicator
      gallery.innerHTML = '';
      
      // Create gallery items
      images.forEach((image, index) => {
          const galleryItem = document.createElement('div');
          galleryItem.className = 'gallery-item';
          galleryItem.dataset.index = index;
          
          const innerContainer = document.createElement('div');
          innerContainer.className = 'gallery-item-inner';
          
          // Add placeholder for loading
          const placeholder = document.createElement('div');
          placeholder.className = 'gallery-placeholder';
          innerContainer.appendChild(placeholder);
          
          // Create image element (without src yet for lazy loading)
          const img = document.createElement('img');
          img.className = 'gallery-img';
          img.dataset.src = image.path; // Store the path for lazy loading
          img.alt = image.filename.split('.')[0]; // Use filename as alt text
          innerContainer.appendChild(img);
          
          galleryItem.appendChild(innerContainer);
          gallery.appendChild(galleryItem);
      });
  }
  
  function setupLazyLoading() {
      // Use Intersection Observer for lazy loading
      const lazyImages = document.querySelectorAll('.gallery-img[data-src]');
      
      const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const img = entry.target;
                  const src = img.dataset.src;
                  
                  // Load the image
                  img.onload = () => {
                      // Remove placeholder and show image when loaded
                      const placeholder = img.previousElementSibling;
                      if (placeholder && placeholder.classList.contains('gallery-placeholder')) {
                          placeholder.style.opacity = 0;
                          setTimeout(() => {
                              placeholder.remove();
                          }, 300);
                      }
                      img.classList.add('loaded');
                  };
                  
                  img.src = src;
                  delete img.dataset.src;
                  observer.unobserve(img);
              }
          });
      }, {
          rootMargin: '200px 0px', // Start loading when image is 200px from viewport
          threshold: 0.01
      });
      
      lazyImages.forEach(img => {
          lazyLoadObserver.observe(img);
      });
  }
  
  function setupZoomFunctionality() {
      // Add click event to gallery items
      const galleryItems = document.querySelectorAll('.gallery-item');
      
      galleryItems.forEach(item => {
          item.addEventListener('click', () => {
              const img = item.querySelector('.gallery-img');
              if (!img || !img.src) return;
              
              // Set the zoomed image source
              zoomedImage.src = img.src;
              
              // Get original image dimensions for animation calculation
              const originalRect = img.getBoundingClientRect();
              const viewportWidth = window.innerWidth;
              const viewportHeight = window.innerHeight;
              
              // Set initial position and size to match the thumbnail
              zoomContainer.style.transition = 'none';
              zoomContainer.style.width = `${originalRect.width}px`;
              zoomContainer.style.height = `${originalRect.height}px`;
              zoomContainer.style.transform = `
                  translate(${originalRect.left - (viewportWidth / 2) + (originalRect.width / 2)}px, 
                            ${originalRect.top - (viewportHeight / 2) + (originalRect.height / 2)}px) 
                  scale(1)`;
              
              // Show the overlay without animation first
              zoomOverlay.style.opacity = '0';
              zoomOverlay.style.visibility = 'visible';
              
              // Force reflow to ensure the initial state is applied
              void zoomOverlay.offsetWidth;
              
              // Animate the overlay background
              zoomOverlay.style.transition = 'opacity 800ms cubic-bezier(0.19, 1, 0.22, 1)';
              zoomOverlay.style.opacity = '1';
              
              // Animate the image to zoomed state
              zoomContainer.style.transition = `
                  transform 1200ms cubic-bezier(0.34, 1.56, 0.64, 1), 
                  width 1200ms cubic-bezier(0.34, 1.56, 0.64, 1), 
                  height 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
              
              // Calculate target size (75% of viewport)
              const targetWidth = Math.min(img.naturalWidth, viewportWidth * 0.75);
              const targetHeight = Math.min(img.naturalHeight, viewportHeight * 0.75);
              
              // Maintain aspect ratio
              const aspectRatio = img.naturalWidth / img.naturalHeight;
              let finalWidth = targetWidth;
              let finalHeight = targetWidth / aspectRatio;
              
              if (finalHeight > targetHeight) {
                  finalHeight = targetHeight;
                  finalWidth = targetHeight * aspectRatio;
              }
              
              // Apply the zoom animation
              zoomContainer.style.width = `${finalWidth}px`;
              zoomContainer.style.height = `${finalHeight}px`;
              zoomContainer.style.transform = 'translate(0, 0) scale(1)';
              
              // Prevent scrolling on the body
              document.body.style.overflow = 'hidden';
          });
      });
      
      // Close when clicking outside the image
      zoomOverlay.addEventListener('click', (e) => {
          if (e.target !== zoomedImage) {
              closeZoom();
          }
      });
      
      // Close on ESC key
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && zoomOverlay.classList.contains('active')) {
              closeZoom();
          }
      });
  }
  
  function closeZoom() {
      // Animate the overlay to fade out
      zoomOverlay.style.opacity = '0';
      
      // Animate the image back to thumbnail size (if we had stored the original position)
      zoomContainer.style.transform = 'translate(0, 0) scale(0.8)';
      
      // Wait for animation to complete before hiding completely
      setTimeout(() => {
          zoomOverlay.style.visibility = 'hidden';
          zoomedImage.src = '';
          // Reset the container styles
          zoomContainer.style.width = '';
          zoomContainer.style.height = '';
          zoomContainer.style.transform = '';
          // Re-enable scrolling
          document.body.style.overflow = '';
      }, 800);
  }
});