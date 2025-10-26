# ULaundry - Hostel Laundry Management System

A comprehensive laundry management system built with Next.js for managing hostel laundry operations with real-time tracking and QR code integration.

## Features

### 👨‍🎓 Student Features
- Create laundry requests with detailed clothing item counts
- Track laundry status in real-time (Generated → In Process → Out for Delivery → Delivered)
- Verify received laundry items
- Report problems/issues during the process
- View complete laundry history
- QR code-based bag identification

### 👔 Laundry Staff Features
- Scan student QR codes to identify laundry bags
- View and verify submitted laundry items
- Acknowledge bag contents
- Mark washing completion
- Manage active laundry processes

### 🚚 Delivery Person Features
- View assigned deliveries by hostel
- Track delivery status
- Update delivery completion

### 👨‍💼 Admin Features
- Manage staff and students
- View all laundry processes
- Monitor and resolve reported problems
- Access comprehensive analytics

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Language**: JavaScript

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Supabase account)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd ulaundary
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create `.env` and `.env.local` files:

```bash
# .env (for Prisma CLI)
DATABASE_URL="your-direct-database-url"
DIRECT_URL="your-pooled-database-url"
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

### Models
- **User**: Students, Staff, Delivery Personnel, and Admins
- **LaundryProcess**: Tracks complete laundry lifecycle with 24 clothing types
- **Problem**: Issue reporting and resolution tracking

### Supported Clothing Types
Bed Sheet, Pillow Cover, Towel, Salwar, Kurta, Lower/Pyjama, Jacket, Nikkar, Jeans, T-Shirt, University Shirt, University Pant, Civil Pant, Civil Shirt, School Sweater, School Coat, Skirt, Dupatta, Turban, Apron, White Coat, Upper Hoodie, Small Blanket, Big Blanket

## Workflow

1. **Student creates laundry** → Status: GENERATED
2. **Staff scans QR & verifies** → Status: IN_PROCESS
3. **Staff completes washing** → Washing marked complete
4. **Assigned to delivery** → Status: OUT_FOR_DELIVERY
5. **Student receives & confirms** → Status: DELIVERED

## Development

```bash
# Run development server
npm run dev

# Generate Prisma Client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push