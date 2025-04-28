import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import StepperDot from "./StepperDot";

const steps = [
  { title: "Step 1", description: "This is step 1 description." },
  { title: "Step 2", description: "This is step 2 description." },
  { title: "Step 3", description: "This is step 3 description." },
];

const StepperContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fade, setFade] = useState(false);

  const handleStepChange = (direction: "next" | "prev") => {
    if (loading) return; // Prevent clicking while loading

    setFade(true); // Start fade out
    setTimeout(() => {
      setLoading(true);
      setCurrentStep((prev) => {
        if (direction === "next") {
          return Math.min(prev + 1, steps.length - 1);
        } else {
          return Math.max(prev - 1, 0);
        }
      });
    }, 300); // duration matches fade out
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        setFade(false); // Fade in new content
      }, 1000); // simulate loading delay
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-md mx-auto mt-8">
      <StepperDot
        title={steps[currentStep].title}
        description={steps[currentStep].description}
        progressPercent={progressPercent}
        fade={fade}
      />

      <div className="flex justify-between mt-4">
        <button
          onClick={() => handleStepChange("prev")}
          disabled={currentStep === 0 || loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          {loading && <Spinner />}
          Previous
        </button>
        <button
          onClick={() => handleStepChange("next")}
          disabled={currentStep === steps.length - 1 || loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading && <Spinner />}
          Next
        </button>
      </div>
    </div>
  );
};

export default StepperContainer;
