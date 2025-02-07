'use client';

import RentModal from '@/app/components/modal/RentModal';
import LoginModal from '@/app/components/modal/LoginModal';
import RegisterModal from '@/app/components/modal/RegisterModal';

const modalProvider = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <RentModal />
    </>
  );
};

export default modalProvider;
