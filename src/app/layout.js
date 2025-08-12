import './globals.css';

export const metadata = {
  title: 'ULaundry',
  description: 'Hostel Laundry Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">
        {children}
      </body>
    </html>
  );
}
