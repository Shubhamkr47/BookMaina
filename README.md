# 📚 BookMaina – Library Management System

A complete MERN-based library management system designed to simplify book issuing, returning, tracking, and student–admin communication using QR codes and email alerts.

---

## 🚀 Features

### **Admin Features**

* 🔐 Admin authentication (JWT-based)
* ➕ Add, update, delete books
* 📊 Dashboard overview (total books, issued books, students, defaulters)
* 🧑‍🎓 Manage users/students
* 🏷️ Generate QR code for each book
* 🔄 Issue/Return toggle for books
* 📅 Due date tracking & overdue detection
* 📧 Automatic email alerts for:

  * Upcoming due dates
  * Overdue reminders

### **Student Features**

* 🔑 Student authentication
* 📚 View issued books
* 🔍 Search books
* 📱 Scan QR to request book issue or return
* 📧 Receive email alerts about due dates

---

## 🛠 Tech Stack

### **Frontend**

* React.js
* Axios
* React Router
* QR Scanner Library
* Tailwind/Material UI (if used)

### **Backend**

* Node.js + Express
* MongoDB + Mongoose
* JWT for auth
* Nodemailer for email notifications
* QR Code generator

---

## 🗂 Project Folder Structure

```
BookMaina/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── context/
    │   └── App.js
    └── package.json
```

---

## 🔐 Authentication Flow

1. User logs in → receives JWT token
2. Token stored in localStorage
3. Protected routes verify token using middleware
4. Admin vs Student role-based access

---

## 🧾 API Endpoints (Sample)

### **Auth**

* POST `/api/auth/login`
* POST `/api/auth/register`

### **Books**

* GET `/api/books/`
* POST `/api/books/add`
* PUT `/api/books/update/:id`
* DELETE `/api/books/delete/:id`

### **Issue/Return**

* POST `/api/issue/`
* POST `/api/return/`
* GET `/api/history/:userId`

---

## 📱 QR Code Flow

* Admin generates QR code for each book
* Student scans QR with mobile/React scanner
* Scanner sends bookId + userId to backend
* Backend validates status and processes issue/return

---

## 📧 Email Notification System

Triggered in background when:

* Book is issued (confirmation mail)
* 2 days before due date
* If student is overdue

---

## 🛠 Installation & Setup

### **Backend**

```
cd backend
npm install
npm start
```

### **Frontend**

```
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
