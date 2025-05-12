import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='bg-blue-500 flex justify-center items-center max-md:flex-col py-6.5 md:py-9.5 gap-4'>
      <div>
        <Image
          src='/logoipsum.svg'
          alt='logo'
          width={134}
          height={134}
          className='saturate-0 invert'
        />
      </div>

      <p className='text-white max-md:text-sm'>© 2025 Blog genzet. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
