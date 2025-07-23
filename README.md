# Nepali Mart - Your Trusted Neighborhood Store

A modern e-commerce website for Nepali Mart, featuring a beautiful UI with full functionality including shopping cart, product filtering, and responsive design.

## 🌟 Features Implemented

### ✅ Category Dropdown Navigation
- Hover over "Categories" in the header to see dropdown menu
- Choose from: Groceries, Furniture, Electronics, Sports
- Works on both desktop (hover) and mobile (click)

### ✅ Add to Cart Functionality
- Click "Add to Cart" on any product
- Quantity selector modal appears
- Cart count updates in real-time
- Cart data persists in localStorage
- Full cart management (add, remove, update quantities)

### ✅ Awards Slideshow
- Auto-playing slideshow with 3 awards
- Navigation arrows and dot indicators
- Pause on hover functionality
- Smooth transitions between slides

### ✅ Product Filtering System
- Filter by category (Groceries, Furniture, Electronics, Sports)
- Sort by price (low to high, high to low)
- Sort by name (A to Z, Z to A)
- Real-time product count updates
- Smooth animations when filtering

### ✅ Responsive Design
- Mobile-friendly navigation
- Responsive product grid
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Deployment to GitHub Pages

### Method 1: Automatic Deployment
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

### Method 2: Using GitHub CLI
```bash
# Install GitHub CLI if not already installed
# Then run:
gh repo create nepali-mart --public
git add .
git commit -m "Initial commit"
git push -u origin main
gh repo edit --enable-pages
```

### Method 3: Manual Upload
1. Create a new repository on GitHub
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Set source to "Deploy from a branch" and select main branch

## 📁 File Structure
```
nepali-mart/
├── index.html              # Home page
├── products.html           # Products page with filtering
├── cart.html              # Shopping cart page
├── about.html             # About page
├── contact.html           # Contact page
├── offers.html            # Offers page
├── help-center.html       # Help center
├── privacy-policy.html    # Privacy policy
├── terms-of-service.html  # Terms of service
├── shipping-info.html     # Shipping information
├── groceries.html         # Groceries category page
├── furniture.html         # Furniture category page
├── electronics.html       # Electronics category page
├── sports.html            # Sports category page
├── src/
│   ├── script.js          # Main JavaScript functionality
│   └── styles.css         # Custom CSS styles
└── README.md              # This file
```

## 🛠️ Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Styling with Tailwind CSS
- **JavaScript (ES6+)** - Interactive functionality
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 🎨 Design Features
- Modern, clean design with green color scheme
- Smooth animations and transitions
- Hover effects on interactive elements
- Mobile-first responsive design
- Accessibility-friendly navigation

## 📱 Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Local Development
1. Clone the repository
2. Open `index.html` in your browser
3. All functionality works locally without a server

## 📞 Support
For any issues or questions, please check the help center page or contact us through the contact form.

## 📄 License
This project is created for Nepali Mart. All rights reserved.

---

**Note**: This website is designed to work perfectly on GitHub Pages. All paths are relative and all functionality is client-side, making it ideal for static hosting.
