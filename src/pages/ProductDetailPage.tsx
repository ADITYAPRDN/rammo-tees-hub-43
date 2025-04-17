
import Layout from '@/components/layout/Layout';
import ProductDetail from '@/components/products/ProductDetail';

const ProductDetailPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail />
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
