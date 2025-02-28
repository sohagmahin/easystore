import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: `A modern ecommerce website `,
};

const HomePage = async () => {
  return <div>ProStore</div>;
};

export default HomePage;
