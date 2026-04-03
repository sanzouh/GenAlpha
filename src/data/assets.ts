import type { Asset } from "../lib/geneticAlgorithm";

export const ASSETS: Asset[] = [
	{
		ticker: "SAFE",
		name: "SafeBond Co.",
		expectedReturn: 4.0,
		volatility: 3.0,
		color: "bg-aapl",
	},
	{
		ticker: "STBL",
		name: "StableBlue Ltd.",
		expectedReturn: 7.0,
		volatility: 6.0,
		color: "bg-msft",
	},
	{
		ticker: "BALN",
		name: "Balanced Growth",
		expectedReturn: 10.0,
		volatility: 10.0,
		color: "bg-googl",
	},
	{
		ticker: "GROW",
		name: "Growth Prime",
		expectedReturn: 14.0,
		volatility: 16.0,
		color: "bg-amzn",
	},
	{
		ticker: "AGGR",
		name: "Aggressive Tech",
		expectedReturn: 20.0,
		volatility: 28.0,
		color: "bg-tsla",
	},
	{
		ticker: "HYPE",
		name: "Hyper Risk",
		expectedReturn: 28.0,
		volatility: 40.0,
		color: "bg-nvda",
	},
];
