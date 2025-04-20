
import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const featuredImages = [
    '/lovable-uploads/ff1a703d-d5e9-4cc9-921c-9b0ed12c2c72.png', // Sablon Plastisol
    '/lovable-uploads/25d898c2-48fa-451e-8be5-9e6311caa377.png', // Sablon Rubber
    '/lovable-uploads/4284d1a1-ab1b-4ae3-bd42-199702351738.png'  // Sablon DTF
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          RAMMO T-Shirt Collection
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Berbagai macam teknik sablon dengan kualitas terbaik untuk kebutuhan Anda
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredImages.map((image, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
          >
            <img 
              src={image} 
              alt={`Sablon Technique ${index + 1}`} 
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link 
          to="/products" 
          className="bg-primary-500 text-white px-6 py-3 rounded-md hover:bg-primary-600 transition-colors"
        >
          Lihat Semua Produk
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;

