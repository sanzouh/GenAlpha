import type { Asset } from "../lib/geneticAlgorithm";

export const ASSETS: Asset[] = [
	{
		ticker: "AAPL",
		name: "Apple Inc.",
		expectedReturn: 12.4,
		volatility: 18.2,
		color: "bg-aapl",
	},
	{
		ticker: "MSFT",
		name: "Microsoft Corp.",
		expectedReturn: 14.1,
		volatility: 19.8,
		color: "bg-msft",
	},
	{
		ticker: "TSLA",
		name: "Tesla Inc.",
		expectedReturn: 22.3,
		volatility: 42.1,
		color: "bg-tsla",
	},
	{
		ticker: "GOOGL",
		name: "Alphabet Inc.",
		expectedReturn: 11.8,
		volatility: 17.4,
		color: "bg-googl",
	},
	{
		ticker: "AMZN",
		name: "Amazon.com Inc.",
		expectedReturn: 13.6,
		volatility: 22.3,
		color: "bg-amzn",
	},
	{
		ticker: "NVDA",
		name: "NVIDIA Corp.",
		expectedReturn: 28.4,
		volatility: 38.6,
		color: "bg-nvda",
	},
];
