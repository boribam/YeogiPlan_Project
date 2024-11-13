// src/pages/Talk.jsx
import React, { useState } from 'react';
import ImageContainer from '../components/Talk/ImageContainer';
import ChipButtons from '../components/Talk/ChipButtons';
import TalkModal from '../components/Talk/TalkModal';
import TalkLocationModal from '../components/Talk/TalkLocationModal';
import TalkComponent from '../components/Talk/TalkComponent';
import tiwanImage from '../assets/talk_img/tiwan2.jpg';

const Talk = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addPostFunc, setAddPostFunc] = useState(null); // `addPost`를 저장할 상태
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);
  

  // `TalkComponent`에서 `addPost` 함수를 받아오는 함수
  const handleAddPostFunc = (addPost) => {
    setAddPostFunc(() => addPost);
  };


  const handleConfirm = (title, content, tag) => {
    if (addPostFunc) {
      addPostFunc(title, content,tag);
      closeModal();
    }
  };



  return (
    <>
      <ImageContainer imageUrl={tiwanImage} onClick={openLocationModal} />
      <ChipButtons onOpenModal={openModal} />

      {/* `handleAddPostFunc`를 통해 `addPost`를 전달받기 */}
      <TalkComponent onAddPost={handleAddPostFunc} />

      <TalkModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleConfirm} />
      <TalkLocationModal isOpen={isLocationModalOpen} onClose={closeLocationModal} />
    </>
  );
};

export default Talk;