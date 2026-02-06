# Nimap Assignment - Category & Product Master

A full-stack Angular application with CRUD operations for Categories and Products, featuring server-side pagination and responsive design.

## 🚀 Features

### **Category Master**
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Sequential ID management starting from 1
- ✅ Duplicate prevention with validation
- ✅ Real-time notifications
- ✅ Responsive design for all devices

### **Product Master**
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Category relationship management
- ✅ Server-side pagination
- ✅ Product ID, Product Name, Category ID, Category Name display
- ✅ Duplicate prevention
- ✅ Real-time notifications
- ✅ Responsive design

### **Technical Features**
- ✅ Angular 17 with standalone components
- ✅ Node.js/Express backend with MySQL
- ✅ Server-side pagination (Page 9 = Records 90-100)
- ✅ Auto-incrementing IDs with reset functionality
- ✅ Tailwind CSS for responsive design
- ✅ RESTful API design

## 🛠 Tech Stack

### **Frontend**
- Angular 17
- TypeScript
- Tailwind CSS
- RxJS
- HTML5

### **Backend**
- Node.js
- Express.js
- MySQL
- RESTful APIs

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons
- Optimized layouts for all screen sizes

## 🔧 Local Development

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup**:
   - MySQL database: `nimap_machine_test`
   - Auto-incrementing primary keys
   - Foreign key relationships

## 🌐 Netlify Deployment

### **Prerequisites**
- Netlify CLI installed
- Angular CLI installed

### **Deployment Steps**

1. **Build the Application**:
   ```bash
   npm run build:prod
   ```

2. **Deploy to Netlify**:
   ```bash
   npm run deploy
   ```

3. **Or Manual Deployment**:
   ```bash
   # Build
   npm run build:prod
   
   # Deploy
   netlify deploy --prod --dir=dist/frontend
   ```

### **Environment Variables**
Set these in Netlify dashboard:
- `NODE_ENV=production`
- Custom API endpoints if needed

## 📊 API Endpoints

### **Categories**
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `POST /api/reset-ids` - Reset all IDs

### **Products**
- `GET /api/products?page=1&pageSize=10` - Get paginated products
- `POST /api/products` - Add product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🎯 Key Features

### **Server-Side Pagination**
- Efficient data fetching from database
- Configurable page sizes (5, 10, 20, 50)
- Page navigation controls
- Item count display

### **ID Management**
- Sequential IDs starting from 1
- Automatic reset on deletion
- No gaps in numbering

### **Validation & UX**
- Duplicate prevention
- Case-insensitive checking
- Real-time notifications
- Form validation
- Error handling

## 📱 Live Demo

[![Deployed on Netlify](https://your-app-name.netlify.app)](https://your-app-name.netlify.app)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
