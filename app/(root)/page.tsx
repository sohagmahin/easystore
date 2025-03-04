import ProductList from "@/components/product/product-list";
import sampledata from "@/db/sample-data";
const HomePage = async () => {
  console.log(sampledata);
  return (
    <>
      <ProductList data={sampledata.products} title="New Arrivals" limit={4} />
    </>
  );
};

export default HomePage;
