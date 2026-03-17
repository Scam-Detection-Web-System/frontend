import { HeroSection } from "@/components/sections/hero-section"
import { BrowserProtectionSection } from "@/components/sections/browser-protection-section"
import { FeaturesShowcaseSection } from "@/components/sections/features-showcase-section"
import { TrustBannerSection } from "@/components/sections/trust-banner-section"
import { GuidesSection } from "@/components/sections/guides-section"

export default function Home() {
    return (
        <>
            <HeroSection />
            <BrowserProtectionSection />
            <FeaturesShowcaseSection />
            <TrustBannerSection />
            <GuidesSection />
        </>
    )
}
