// Real rows from this week's sample feed (sample.csv), trimmed for the trailer.
export type Raise = {
  company: string;
  state: string;
  industry: string;
  amount: number;
  exec: string;
};

export const RAISES: Raise[] = [
  { company: "Star Catcher Industries", state: "FL", industry: "Other Technology", amount: 65_000_000, exec: "Andrew Rush" },
  { company: "Farmers State Bancshares", state: "NE", industry: "Commercial Banking", amount: 15_000_000, exec: "Richard Stull" },
  { company: "Piston Technologies", state: "CA", industry: "Other", amount: 15_000_000, exec: "Vikram Sekhon" },
  { company: "CB-Emmanuel Realty", state: "NY", industry: "Real Estate", amount: 6_000_000, exec: "Benathan Upshaw" },
  { company: "Dynamic Creatures", state: "CA", industry: "Other Technology", amount: 6_000_000, exec: "Marc Theermann" },
  { company: "Rely Intelligence", state: "ME", industry: "Other Technology", amount: 4_481_499, exec: "George Matelich" },
];
