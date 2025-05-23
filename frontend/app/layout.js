import { Inter, Outfit, Poppins, Prata, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import AppContextProvider, { AppContext } from "./context/AppContext";
import Footer from "./components/Footer";
import LoginPage from "./login/LoginPage";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["100", "400", "700"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["100", "400", "700"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["100", "400", "700"] });
const prata = Prata({ variable: "--font-prata", subsets: ["latin"], weight: ["400"] });

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${poppins.variable} ${prata.variable} ${geistSans.variable} ${geistMono.variable} px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50` 
        }
      >
        <AppContextProvider>
        <LoginPage/>
        <Navbar/>
        {children}
        <Footer/>
        </AppContextProvider>
        <ToastContainer position="bottom-right"/>
      </body>
    </html>
  );
}
