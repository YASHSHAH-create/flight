import "./globals.css";

import SmoothScroll from "../components/SmoothScroll";

export const metadata = {
  title: "Paymm | Find Your Next Adventure",
  description: "Find Flights, Hotels, Visa & Holidays",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
