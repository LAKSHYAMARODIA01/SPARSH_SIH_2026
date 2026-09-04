export interface StartupData {
  id: string;
  name: string;
  founder: string;
  email: string;
  dpiit: string;
  udyam: string;
  gstin: string;
  sectorTags: string[];
  verified: boolean;
  gfrExemption: boolean;
  matchScore?: number;
  pitchDeck: {
    title: string;
    slides: {
      slideNumber: number;
      title: string;
      subtitle: string;
      content: string[];
      metrics?: { label: string; value: string }[];
    }[];
  };
}

export const MOCK_STARTUPS: Record<string, StartupData> = {
  "cognitive-signals": {
    id: "61111111-1111-4111-a111-111111111101",
    name: "Cognitive Signals India Pvt Ltd",
    founder: "Aarav Mehta",
    email: "founder@cognitive.sparsh.in",
    dpiit: "DPIIT-2024-10492",
    udyam: "UDYAM-MH-12-00912",
    gstin: "27AAACC1234A1Z1",
    sectorTags: ["Traffic AI", "Computer Vision", "Urban Mobility"],
    verified: true,
    gfrExemption: true,
    matchScore: 94,
    pitchDeck: {
      title: "Adaptive Traffic Signal Control for Urban Junctions",
      slides: [
        {
          slideNumber: 1,
          title: "Cognitive Signals India",
          subtitle: "AI-Powered Real-Time Traffic Congestion Mitigation",
          content: [
            "Proprietary computer-vision sensors calibrated for Indian mixed-traffic patterns (auto-rickshaws, two-wheelers, heavy vehicles).",
            "GFR Rule 173/174 Exemption active — Zero prior turnover threshold required for Maharashtra state pilots.",
          ],
          metrics: [
            { label: "DPIIT Ref", value: "#10492" },
            { label: "AI Precision", value: "98.4%" },
          ],
        },
        {
          slideNumber: 2,
          title: "Problem: Pune Karve Road Bottlenecks",
          subtitle: "Fixed-timer signals waste 42 minutes per commuter daily",
          content: [
            "Fixed-interval green lights fail during dynamic rush-hour spikes.",
            "Emergency vehicles (ambulances, police) delayed by average 14 minutes at key junctions.",
            "High carbon emissions from idling vehicles at stalled intersections.",
          ],
        },
        {
          slideNumber: 3,
          title: "Our Solution: Edge-Vision Telemetry",
          subtitle: "Retrofit existing traffic light controllers with AI edge compute",
          content: [
            "Edge AI cameras calculate queue density every 500ms using YOLOv8 optimized models.",
            "Dynamic signal duration adjustment reduces queue wait times automatically.",
            "Green-Wave corridor routing for emergency services using encrypted vehicle beacons.",
          ],
          metrics: [
            { label: "Queue Reduction", value: "28%" },
            { label: "Hardware Cost", value: "-60%" },
          ],
        },
        {
          slideNumber: 4,
          title: "Field Validation & Pilot Metrics",
          subtitle: "Tested at 12 Karve Road Junctions in Pune",
          content: [
            "Milestone 1 Passed: 12 camera edge sensors installed and calibrated.",
            "Milestone 2 Verified: Demonstrated 22% increase in peak-hour vehicle throughput.",
            "Zero road excavation or physical geometry changes required.",
          ],
          metrics: [
            { label: "Commute Saved", value: "18 Mins/Day" },
            { label: "CO2 Reduced", value: "14 Tons/Mo" },
          ],
        },
        {
          slideNumber: 5,
          title: "Commercial & Pilot Budget Breakdown",
          subtitle: "Total Pilot Cost: ₹30,00,000 (Milestone Escrow Linked)",
          content: [
            "Milestone 1: ₹10,00,000 (Paid / Released upon Sensor Calibration)",
            "Milestone 2: ₹10,00,000 (Evidence Submitted / Verified 20% Flow)",
            "Milestone 3: ₹10,00,000 (Final 25% Reduction & Handover)",
          ],
        },
      ],
    },
  },
  "healthpulse": {
    id: "61111111-1111-4111-a111-111111111102",
    name: "HealthPulse Technologies",
    founder: "Neha Sharma",
    email: "founder@healthpulse.sparsh.in",
    dpiit: "DPIIT-2024-88391",
    udyam: "UDYAM-MH-01-00832",
    gstin: "27BBBCC2345B1Z2",
    sectorTags: ["HealthTech", "Telemedicine", "Rural Triage"],
    verified: true,
    gfrExemption: true,
    matchScore: 91,
    pitchDeck: {
      title: "Offline-Capable Rural AI Tele-Diagnostics Kit",
      slides: [
        {
          slideNumber: 1,
          title: "HealthPulse Tech",
          subtitle: "AI Diagnostic Triage for Remote Primary Health Centres",
          content: [
            "Solar-powered portable diagnostic kit for tribal regions (Gadchiroli, Nandurbar).",
            "Offline-first LLM & ECG analysis running directly on edge tablet devices.",
          ],
          metrics: [
            { label: "DPIIT Ref", value: "#88391" },
            { label: "Diagnostic Accuracy", value: "92.1%" },
          ],
        },
        {
          slideNumber: 2,
          title: "Problem: Maternal & Emergency Triage Delays",
          subtitle: "Gadchiroli PHCs lack specialist doctors",
          content: [
            "Patients travel 60+ km for basic diagnostic triage.",
            "High maternal mortality risks due to late detection of pre-eclampsia & cardiac distress.",
          ],
        },
        {
          slideNumber: 3,
          title: "Solution: MedPulse Portable Suite",
          subtitle: "14 Diagnostic Tests with Real-Time Specialist Sync",
          content: [
            "Includes portable ECG, pulse oximeter, AI blood analyzer, and ultrasound wand.",
            "Auto-generates diagnostic summary in Marathi & English for PHC nurse officers.",
          ],
        },
        {
          slideNumber: 4,
          title: "Pilot Roadmap",
          subtitle: "Budget Ceiling: ₹25,00,000",
          content: [
            "Phase 1: Deployment across 15 Gadchiroli PHCs.",
            "Phase 2: Independent validation by IIT Bombay & Public Health Dept.",
          ],
        },
      ],
    },
  },
  "agrisense": {
    id: "61111111-1111-4111-a111-111111111103",
    name: "AgriSense Remote Sensing Labs",
    founder: "Rohan Patil",
    email: "founder@agrisense.sparsh.in",
    dpiit: "DPIIT-2023-44120",
    udyam: "UDYAM-MH-20-00341",
    gstin: "27CCCCD3456C1Z3",
    sectorTags: ["AgriTech", "Satellite GIS", "Pest Risk AI"],
    verified: true,
    gfrExemption: true,
    matchScore: 88,
    pitchDeck: {
      title: "Hyperspectral Satellite Pest Alert Engine for Vidarbha",
      slides: [
        {
          slideNumber: 1,
          title: "AgriSense Labs",
          subtitle: "14-Day Advance Crop Pest Early Warning via Satellite GIS",
          content: [
            "Multispectral satellite telemetry combined with weather station AI model.",
            "Prevents Pink Bollworm destruction across Vidarbha cotton belts.",
          ],
          metrics: [
            { label: "DPIIT Ref", value: "#44120" },
            { label: "Advance Warning", value: "14 Days" },
          ],
        },
      ],
    },
  },
};

export function getStartupByEmailOrName(identifier: string): StartupData {
  const normalized = identifier.toLowerCase();
  for (const s of Object.values(MOCK_STARTUPS)) {
    if (
      s.email.toLowerCase() === normalized ||
      s.name.toLowerCase().includes(normalized) ||
      s.founder.toLowerCase().includes(normalized)
    ) {
      return s;
    }
  }

  // Fallback generic startup object
  return {
    id: "gen-" + Math.random().toString(36).slice(2, 8),
    name: identifier.includes("@") ? identifier.split("@")[0].toUpperCase() + " Tech" : identifier,
    founder: "Founder " + identifier.slice(0, 5),
    email: identifier.includes("@") ? identifier : "founder@" + identifier.replace(/\s+/g, "").toLowerCase() + ".sparsh.in",
    dpiit: "DPIIT-2024-" + Math.floor(10000 + Math.random() * 90000),
    udyam: "UDYAM-MH-" + Math.floor(10 + Math.random() * 89) + "-00" + Math.floor(100 + Math.random() * 899),
    gstin: "27" + Math.random().toString(36).slice(2, 12).toUpperCase() + "1Z5",
    sectorTags: ["GovTech", "Innovation", "AI Solutions"],
    verified: true,
    gfrExemption: true,
    matchScore: 86,
    pitchDeck: {
      title: "GovTech Pilot Innovation Proposal",
      slides: [
        {
          slideNumber: 1,
          title: identifier + " Solution Deck",
          subtitle: "Custom AI & IoT Engineering for Maharashtra State Innovation Society",
          content: [
            "Verified DPIIT registered startup with active GFR Rule 173/174 exemption.",
            "Designed to directly address state challenge metrics with zero upfront capital expenditure.",
          ],
          metrics: [
            { label: "Compliance", value: "100% GFR" },
            { label: "Deploy Time", value: "30 Days" },
          ],
        },
        {
          slideNumber: 2,
          title: "Problem Statement & Field Dynamics",
          subtitle: "Eliminating Administrative & Operational Bottlenecks",
          content: [
            "Current manual processes result in high oversight overhead and delayed outcome verification.",
            "Our automated sensor telemetry provides 24/7 transparent state ledger audit trails.",
          ],
        },
        {
          slideNumber: 3,
          title: "Technical Solution & Architecture",
          subtitle: "Scalable Microservices with Encrypted Data Security",
          content: [
            "Integration with state GIS and Supabase RLS encrypted backend.",
            "Real-time alerts via automated SMS and officer dashboard portals.",
          ],
        },
        {
          slideNumber: 4,
          title: "Milestone Execution Plan",
          subtitle: "Performance-Based Escrow Fund Releases",
          content: [
            "Milestone 1: Prototype deployment & edge sensor calibration (30% Escrow).",
            "Milestone 2: Field validation report & 20% efficiency increase (40% Escrow).",
            "Milestone 3: Final handover & statewide scale readiness (30% Escrow).",
          ],
        },
      ],
    },
  };
}

export interface CharterData {
  id: string;
  title: string;
  stageId: number;
  stageLabel: string;
  department: string;
  budget: string;
  duration: string;
  dataSensitivity: string;
  problem: string;
  successMetric: string;
  matchedStartupKey: string;
  matchScore: number;
  aiJustification: string;
  gfrStatus: string;
}

export const MOCK_CHARTERS: Record<string, CharterData> = {
  "c1111111-1111-4111-a111-111111111102": {
    id: "c1111111-1111-4111-a111-111111111102",
    title: "Pune Urban Junction Adaptive Traffic Signal Control",
    stageId: 4,
    stageLabel: "4. Active Pilot",
    department: "Department of Transport & Road Safety",
    budget: "₹30,00,000",
    duration: "180 Days",
    dataSensitivity: "MEDIUM",
    problem: "Severe rush-hour bottlenecks on Karve Road and Hinjewadi IT corridor due to fixed-timer traffic signals.",
    successMetric: "Reduce peak-hour commuter delay times by minimum 25% without altering physical road geometry.",
    matchedStartupKey: "cognitive-signals",
    matchScore: 94,
    aiJustification: "Startup's adaptive edge-vision telemetry directly matches Pune Traffic's outcome metric of 25% throughput increase without hardware replacements.",
    gfrStatus: "GFR Rule 173/174 Turnover Exemption Active",
  },
  "c1111111-1111-4111-a111-111111111101": {
    id: "c1111111-1111-4111-a111-111111111101",
    title: "Rural Tele-Diagnostics & AI Triage for Gadchiroli PHCs",
    stageId: 3,
    stageLabel: "3. Demo Day",
    department: "Department of Public Health & Family Welfare",
    budget: "₹25,00,000",
    duration: "120 Days",
    dataSensitivity: "HIGH",
    problem: "Primary Health Centres in remote Gadchiroli lack specialist doctors, leading to delayed maternal and emergency diagnostics.",
    successMetric: "Achieve 90% diagnostic accuracy vs certified doctors and reduce triage transfer delays by 40%.",
    matchedStartupKey: "healthpulse",
    matchScore: 91,
    aiJustification: "Portable diagnostic kit running offline LLM & ECG analysis matches Gadchiroli PHC constraint of zero cellular connectivity.",
    gfrStatus: "GFR Rule 173/174 Turnover Exemption Active",
  },
  "c1111111-1111-4111-a111-111111111103": {
    id: "c1111111-1111-4111-a111-111111111103",
    title: "Hyperspectral Yield Prediction for Vidarbha Cotton",
    stageId: 1,
    stageLabel: "1. Challenge Charter",
    department: "Department of Agriculture & Farmer Welfare",
    budget: "₹20,00,000",
    duration: "150 Days",
    dataSensitivity: "LOW",
    problem: "Pest outbreaks and unpredictable rain ruin cotton crop yields in Yavatmal and Wardha without early warning.",
    successMetric: "Provide 14-day advance pest risk warning with >85% field validation accuracy across 5000 hectares.",
    matchedStartupKey: "agrisense",
    matchScore: 88,
    aiJustification: "Multispectral satellite telemetry combined with micro-weather station AI model provides early warning for Pink Bollworm.",
    gfrStatus: "GFR Rule 173/174 Turnover Exemption Active",
  },
};

export function getCharterById(id: string): CharterData {
  return MOCK_CHARTERS[id] || MOCK_CHARTERS["c1111111-1111-4111-a111-111111111102"];
}
