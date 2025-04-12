"use client";
import React, { useContext, useEffect } from "react";
import { assets, plans } from "../assets/assets";
import Image from "next/image";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { toast } from "react-toastify";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISH_KEY);

const Page = () => {
  const { user, backendUrl, token, setShowLogin, setCredit } = useContext(AppContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const verifyPayment = async (sessionId) => {
    try {
      const savedToken = token || localStorage.getItem("token");
  
      if (!savedToken) {
        toast.error("User not logged in. Please login again.");
        router.push("/");
        return;
      }
  
      const { data } = await axios.post(
        `${backendUrl}/user/verify-stripe`,
        { sessionId },
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );
  
      if (data.success) {
        setCredit(data.creditBalance);
        toast.success("Credits updated successfully!");
        router.push("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error(error.message);
    }
  };

  const paymentWithStripe = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true);
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/user/payment-stripe`,
        { userId: user.id, planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          toast.error(error.message);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId).then(() => {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      });
    }
  }, [sessionId]);

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 140 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10"
    >
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">Our Plans</button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">Choose the plan</h1>
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            key={index}
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
          >
            <Image width={40} src={assets.logo_icon} alt="logo-icon" />
            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price} </span>/ {item.credits} credits
            </p>
            <button
              onClick={() => paymentWithStripe(item.id)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              {user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Page;
