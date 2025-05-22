import LandingPage from "@/components/elements/desktop/landing/LandingPage";
import { getHitCounter } from "@/lib/actions/hitcount/get/getHitCounter";

const Home = async () => {
  const { success, hitcount } = await getHitCounter()

  return (
    <LandingPage count={hitcount.count} success={success} />
  );
}

export default Home
