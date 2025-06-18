import React from 'react';
import { Home } from 'lucide-react';

const PropertyItem = ({ propertyType, onClick }) => {
  return (
    <div
      className='relative overflow-hidden h-96 w-full bg-gradient-to-br from-emerald-900 to-green-900 rounded-lg shadow-lg group hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105'
      onClick={onClick}
    >
      <div className='w-full h-full flex flex-col justify-center items-center text-center relative z-10'>
        <div className='p-4 text-white'>
          <div className='w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 transition-colors'>
            <Home size={32} className='text-white' />
          </div>
          <h3 className='text-2xl font-bold mb-2 group-hover:text-emerald-300 transition-colors'>
            {propertyType.name}
          </h3>
          <p className='text-gray-300 group-hover:text-gray-200 transition-colors'>
            Explore {propertyType.name.toLowerCase()}s
          </p>
        </div>
      </div>
      <div className='absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300' />
    </div>
  );
};

export default PropertyItem;