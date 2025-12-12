"use client";

import React from "react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import HeaderContainer from "@/components/layout/HeaderContainer";
import { ArrowDown } from "lucide-react";

interface FlowStepProps {
  title: string;
  isLast?: boolean;
}

function FlowStep({ title, isLast = false }: FlowStepProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Step Box */}
      <div
        className="rounded-xl px-6 py-4 w-full max-w-md text-center shadow-lg"
        style={{ background: "linear-gradient(90deg, #373C44 0%, #6C7178 100%)" }}
      >
        <span className="text-white font-montserrat text-sm md:text-base">
          {title}
        </span>
      </div>

      {/* Arrow (not shown for last item) */}
      {!isLast && (
        <div className="my-3">
          <ArrowDown className="w-6 h-6 text-[#373C44]" />
        </div>
      )}
    </div>
  );
}

export default function ReportsFlowDiagram() {
  const steps = [
    "Clusters / Offices / Departments / Commissions / Independent Bodies",
    "Commission on Audit",
    "Office of the Samahan Treasurer",
    "Finance Office",
  ];

  return (
    <div className="w-full bg-white py-6">
      <ContentContainer>
        <section className="mx-5 lg:mx-0">
          <HeaderContainer title="FLOW OF REPORTS SUBMISSION" />

          {/* Flow Diagram */}
          <div className="mt-6 px-8">
            <div className="flex flex-col items-center py-6">
              {steps.map((step, index) => (
                <FlowStep
                  key={index}
                  title={step}
                  isLast={index === steps.length - 1}
                />
              ))}
            </div>
          </div>
        </section>
      </ContentContainer>
    </div>
  );
}
