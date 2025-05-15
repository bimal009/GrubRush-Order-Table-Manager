# 🍴 GrubRush – Order & Table Manager

**GrubRush** is a real-time, full-stack web application that simplifies food ordering and restaurant table management. Designed for speed, scalability, and user experience, it empowers restaurants to manage dine-in and online orders efficiently — with live updates, modern UI, and robust backend support.

---

## 🚀 Tech Stack

### 💻 Frontend
- **Next.js** – React framework with SSR & routing
- **Tailwind CSS** – Utility-first CSS
- **React Query** – Server state & API data management
- **Zustand** – Lightweight global/local state management
- **WebSocket (Socket.io Client)** – Real-time client updates

### 🧠 Backend
- **Node.js + Express** – REST API for order and table management
- **MongoDB** – NoSQL database
- **WebSocket (Socket.io Server)** – Push-based real-time updates

---

## 🔧 Features

- 🛒 Real-time food ordering and order tracking
- 📋 Table reservation & availability management
- 💬 Live updates to kitchen/staff via WebSockets
- 🔄 Optimistic updates using Zustand + React Query
- 👥 Role-ready: Admin, Waiter, Customer
- 🔐 Optional Clerk/Auth plug-in compatibility
- 🚀 Fully responsive UI built with Tailwind

---

## 📁 Project Structure


---

## 🛠 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/grubrush.git
cd grubrush

```
## Configure Environment Variables
```
cp .env.example .env
# Edit with your DB URI, API keys, etc.
```

## Install Dependencies
```
npm install
```

## Run the Application
```
npm run dev
```
 WebSocket Events
Event Name	Description
order:new	Sent when a new order is placed
order:update	Used to update order status
table:status	Updates table reservation availability

##🧠 State Management
Zustand handles:

UI state (modals, filters, session)

Selected table/session tracking

React Query handles:

API fetching (orders, menu, users)

Background sync and cache management

##  Future Enhancements
 Admin analytics dashboard

 Stripe or Razorpay integration

 Notifications (email/SMS/Web)

 Role-based access protection

 Mobile-first PWA design

## 📄 License
MIT License © 2025 bimal pandey

## Feedback & Contributions

```

---

Let me know if you want:
- `.env.example` template  
- GitHub Action CI/CD setup  
- Docker support or monorepo tooling like Turborepo  

Happy building! 🍔
```

