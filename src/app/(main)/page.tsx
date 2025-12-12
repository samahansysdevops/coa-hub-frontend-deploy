"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import HeroContainer from "@/components/layout/HeroContainer";
import PageContainer from "@/components/layout/PageContainer";
import ContentContainer from "@/components/layout/ContentContainer";
import HeaderContainer from "@/components/layout/HeaderContainer";

import { AnnouncementsCarousel, SubmissionBinsGrid } from "@/components/features/home";
import DeadlinesPage from "@/components/features/deadlines_page/deadlines";
import CuartaPresentationsSection from "@/components/features/cuarta_presentations/cuarta-presentations";
import TemplatesPage from "@/components/features/templates_page/templates";
import ReportsFlowDiagram from "@/components/features/reports-flow/reports-flow-diagram";

export default function Home() {
    return (
        <ProtectedRoute>
            <HeroContainer title="COA: SUBMISSION HUB" />
            <PageContainer>
                <ContentContainer>
                    {/* Announcements Section */}
                    <section className="mx-5 lg:mx-0">
                        <HeaderContainer title="ANNOUNCEMENTS" />
                        <div className="mt-6 px-8">
                            <AnnouncementsCarousel />
                        </div>
                    </section>

                    {/* Description Section */}
                    <section className="mx-5 lg:mx-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 shadow-md">
                        <div className="max-w-4xl mx-auto text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bebas-neue text-gray-900">
                                Welcome to the Commission on Audit&apos;s Submission Hub!
                            </h2>
                            <p className="text-gray-700 font-montserrat leading-relaxed text-base md:text-lg">
                                This platform is an initiative of the Commission aimed at streamlining
                                the submission process of required reports that undergo thorough auditing
                                by CoA&apos;s esteemed auditors.
                            </p>
                            <p className="text-gray-600 font-montserrat text-sm md:text-base">
                                You may access your designated Google Drive folders by clicking the
                                submission bin above or on the side of your screen, or by using the
                                buttons below.
                            </p>
                        </div>
                    </section>

                    {/* Submission Bins Section */}
                    <section className="mx-5 lg:mx-0">
                        <HeaderContainer title="SUBMISSION BINS" />
                        <div className="mt-6 px-8">
                            <SubmissionBinsGrid />
                        </div>
                    </section>

                    {/* Deadlines Section */}
                    <DeadlinesPage />

                    {/* Cuarta Presentations Section */}
                    <CuartaPresentationsSection />
                </ContentContainer>
            </PageContainer>

            {/* Templates Section */}
            <TemplatesPage />

            {/* Reports Flow Diagram */}
            <ReportsFlowDiagram />
        </ProtectedRoute>
    );
}
