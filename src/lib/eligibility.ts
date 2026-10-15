export type EligibilityInput = {
  age: number;
  weight: number;
  heightIn: number;
  trunk: number;
  pregnant: boolean;
  canBoard: boolean;
  backNeck: boolean;
};

export type EligibilityResult = {
  status: "eligible" | "review" | "ineligible";
  reasons: string[];
  notes: string[];
};

export function checkEligibility(input: EligibilityInput): EligibilityResult {
  const reasons: string[] = [];
  const notes: string[] = [];
  let blocked = false;
  let review = false;

  if (input.pregnant) {
    blocked = true;
    reasons.push("Flights are not available if you are pregnant.");
  }
  if (!input.canBoard) {
    blocked = true;
    reasons.push("You must be able to get into and out of the aircraft and fit properly with the harness secured.");
  }
  if (input.weight > 250) {
    blocked = true;
    reasons.push("Maximum weight is 250 lbs.");
  }
  if (input.heightIn > 73) {
    blocked = true;
    reasons.push('Maximum height is 6\'1".');
  }
  if (input.trunk > 44) {
    blocked = true;
    reasons.push('Maximum trunk circumference is 44". Trunk circumference is the largest circumference from below the chest to the waist.');
  }
  if (input.age > 0 && input.age < 7) {
    review = true;
    reasons.push("Ages 7 and up are recommended. Younger passengers are considered case by case.");
  }
  if (input.backNeck) {
    review = true;
    reasons.push("Please consult your physician. We cannot give medical advice about back or neck injuries.");
  }
  if (input.heightIn > 0 && input.heightIn < 60) {
    notes.push("Under 5 feet tall, the Special Parachute Add-On (+$100) is required.");
  }
  if (input.age >= 7 && input.age < 18) {
    notes.push("A parent or guardian must be present at the briefing. Minors fly on a parent or guardian account.");
  }

  const status = blocked ? "ineligible" : review ? "review" : "eligible";
  if (status === "eligible" && reasons.length === 0) {
    reasons.push("You meet the published height, weight, and fitness requirements.");
  }
  return { status, reasons, notes };
}
