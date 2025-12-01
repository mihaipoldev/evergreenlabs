import { getAllOfferFeatures } from "@/features/features/data";
import { FeaturesList } from "@/features/features/components/FeaturesList";

export const dynamic = "force-dynamic";

export default async function FeaturesPage() {
  const features = await getAllOfferFeatures();

  return <FeaturesList initialFeatures={features} />;
}
