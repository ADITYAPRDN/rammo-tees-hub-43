
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';

const ProductsPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Katalog Produk</h1>
          <p className="mt-4 text-lg text-gray-600">
            Pilihan kaos berkualitas untuk kebutuhan sablon Anda
          </p>
        </div>
        <ProductGrid />
      </div>
    </Layout>
  );
};

export default ProductsPage;
