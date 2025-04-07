"use client";
import Image from "next/image";
import { assets } from "../assets/assets";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "../context/AppContext"; 
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();
    const { user, setShowLogin } = useContext(AppContext);

  return (
    <div className="flex items-center justify-between py-4">
      <Link href="/">
        <Image src={assets.logo} alt="" className="w-28 sm:w-32 lg:w-40" />
      </Link>

      <div>
        {user ? (
        <div className="flex items-center sm:gap-3">
            <button  
                onClick={() => router.push("/buy")} 
                alt='credit-stars' 
                className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700"
            >
                <Image src={assets.credit_star} className="w-5"/>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Credit left: 50</p>
            </button>
            <p className="text-gray-600 max-sm:hidden pl-4">Hi, {user.name}</p> {/* Display user name dynamically */}
            <div className="relative hover group">
                <Image src={assets.profile_icon} alt="profile-icons" className="w-10 drop-shadow"/>
                <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                    <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm">
                        <li className="py-1 px-2 cursor-pointer pr-10">Logout</li>
                    </ul>
                </div>
            </div>
        </div>
        ) : (
        <div className="flex items-center gap-4">
            <Link href='/buy'>
                <p className="cursor-pointer">Pricing</p>
            </Link>
            <button 
                onClick={() => setShowLogin(true)} 
                className="bg-zinc-800 text-white font-medium px-7 py-2 text-sm sm:px-10 rounded-full"
            >
                Login
            </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
