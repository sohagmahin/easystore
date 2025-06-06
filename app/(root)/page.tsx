import DealCountdown from "@/components/deal-countdown";
import ProductCarousel from "@/components/product/product-carousel";
import ProductList from "@/components/product/product-list";
import IconBoxes from "@/components/ui/icon-boxes";
import ViewAllProductsButton from "@/components/view-all-products-button";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
const HomePage = async () => {
  const products = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={products} title="New Arrivals" />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </>
  );
};

export default HomePage;
