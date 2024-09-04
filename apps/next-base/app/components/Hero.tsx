import Image from 'next/image';
import BlurArrow from '../../public/assets/blue-button.svg';
import Gradient from '../../public/assets/Gradient.png';
import HeroImage from '../../public/assets/hero.m.gif';
import HeroImage1 from '../../public/assets/Hero3.svg';
import Google from '../../public/assets/Google.svg';
import Slack from '../../public/assets/Slack.svg';
import Truspilot from '../../public/assets/Trustpilot.svg';
import Cnn from '../../public/assets/CNN.svg';
import Cluth from '../../public/assets/Clutch.svg';
import Link from 'next/link';

const Hero = () => {
  return (
    <>
      <div className="px-5 pt-4 pb-8 lg:container lg:max-w-[846px] lg:m-auto text-white">
        <h1 className="text-info font-medium text-[32px] text-center lg:text-6xl lg:pt-11 lg:pb-6">
          Type-Safe API Development for Next.js
        </h1>
        <p className="text-primary text-center text-[16px] lg:text-[18px] mt-6">
          Boost your developer experience with seamless type consistency,
          automatic Swagger documentation, and protocol buffer support.
        </p>
      </div>

      <div
        className="relative flex flex-col w-full  bg-gradient-to-b from-cyan-950 to-gray-900 mt-12"
        style={{ background: `url(${Gradient})` }}
      >
        <div className="relative bottom-8 flex flex-col items-center">
          <video width="1080" muted autoPlay loop className="flex">
            <source src="http://svazq.com/hero.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </>
  );
};

export default Hero;
