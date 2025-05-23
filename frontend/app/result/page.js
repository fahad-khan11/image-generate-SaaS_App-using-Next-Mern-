'use client';
import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext';

const Page = () => { 
  const [image, setImage] = useState(assets.sample_img_1)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const { generateImage } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (input) {
      const generatedImage = await generateImage(input);
      console.log('Generated Image:', generatedImage);
      if (generatedImage) {
        setIsImageLoaded(true);
        setImage(generatedImage);
      }
    }
    setLoading(false);
  }

  // Function to check if the image is a base64 string
  const isBase64Image = (img) => typeof img === 'string' && img.startsWith('data:image');

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 140 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] justify-center items-center"
    >
      <div>
        <div className="relative">
          {/* Check if the image is a valid base64 string or URL */}
          {isBase64Image(image) ? (
            <img src={image} alt="image-ai" className="max-w-sm rounded" />
          ) : (
            <Image
              src={image}
              alt="image-ai"
              className="max-w-sm rounded"
              width={500}
              height={500}
            />
          )}
          <span
            className={`absolute bottom-0 left-0 h-1 ${
              loading
                ? "bg-blue-500 w-full transition-all duration-[10s]"
                : "w-"
            }`}
          />
        </div>
        <p className={!loading ? "hidden" : ""}>Loading....</p>
      </div>

      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color"
          />
          <button className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full">
            Generate
          </button>
        </div>
      )}
      {isImageLoaded && (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            onClick={() => setIsImageLoaded(false)}
            className="bg-transparent border border-zinc-900 px-10 py-3 text-black rounded-full cursor-pointer"
          >
            Generate Another
          </p>
          <a
            href={image}
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  )
}

export default Page;
