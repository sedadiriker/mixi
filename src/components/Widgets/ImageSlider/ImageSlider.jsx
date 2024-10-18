import React, { useState, useEffect, useRef } from 'react';
import './ImageSlider.css';

const ImageSlider = () => {
  const initialImages = [
    '/images/slider/image1.jpg',
    '/images/slider/image2.jpg',
    '/images/slider/image3.jpg',
    '/images/slider/image4.jpg',
  ];

  const [images, setImages] = useState(initialImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageInput, setImageInput] = useState(null);
  const sliderRef = useRef(null); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); 

    return () => clearInterval(interval); 
  }, [images.length]);

  const handleAddImage = (e) => {
    e.preventDefault();
    if (imageInput) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, reader.result]);
        setImageInput(null);
        setIsModalOpen(false);
      };
      reader.readAsDataURL(imageInput);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleScroll = (event) => {
    event.preventDefault();
    if (sliderRef.current && sliderRef.current.contains(event.target)) {
      if (event.deltaY > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      } else {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <div className="image-container" ref={sliderRef}>
      <div className="settings-icon-image" onClick={handleOpenModal}>
        <i className="fas fa-cog"></i>
      </div>
      <div className="image-widget">
        {isModalOpen && (
          <div className="modal-overlay-images">
            <div className="modal-content-image">
            <div className="w-[120px] 2xl:w-[180px] absolute top-0 2xl:top-[-20px] left-0">
          <img className="w-full logo-modal" src="images/logo.png" alt="" />
        </div>
        <h2
              className="text-center uppercase 2xl:text-[18px] text-[#404751] py-5 2xl:py-6"
              style={{ letterSpacing: "2px" }}
            >
              ımage settings
            </h2>
            <hr className=" opacity-25 my-1" />

              <form className="mt-10 flex flex-col" onSubmit={handleAddImage}>
                <label className="btn bg-gray-100 w-[80%] m-auto mt-1 py-2 pl-2 hover:opacity-45 text-black uppercase cursor-pointer rounded text-[12px]">
                  {imageInput ? imageInput.name : 'Choose File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageInput(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
                <button className="btn bg-gray-600 m-auto mt-3 rounded py-1 hover:opacity-45 text-black p-4 uppercase" type="submit">Add</button>
              </form>

              <div className="image-preview-container bg-black p-2 flex gap-3 justify-center mt-3">
                {images.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img className="w-[200px]" src={image} alt={`Uploaded ${index}`} />
                    <span className="remove-icon" onClick={() => handleRemoveImage(index)}>&times;</span>
                  </div>
                ))}
              </div>

              <span className="close " onClick={handleCloseModal}>&times;</span>
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="slider" style={{ transform: `translateY(-${currentIndex * 100}%)` }}>
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Slide ${index}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;