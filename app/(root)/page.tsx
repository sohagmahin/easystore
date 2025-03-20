import ProductList from "@/components/product/product-list";
import getLatestProducts from "@/lib/actions/product.actions";
const HomePage = async () => {
  const products = await getLatestProducts();

  return (
    <>
      <ProductList data={products} title="New Arrivals" />
    </>
  );
};

export default HomePage;
