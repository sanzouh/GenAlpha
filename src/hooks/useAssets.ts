import { useState, useEffect } from "react";
import { ASSETS as DEFAULT_ASSETS } from "@/data/assets";
import type { Asset } from "@/lib/geneticAlgorithm";

const STORAGE_KEY = "genportfolio:assets";
const ASSET_COLOR_POOL = [
	"bg-aapl",
	"bg-msft",
	"bg-tsla",
	"bg-googl",
	"bg-amzn",
	"bg-nvda",
];

function pickAssetColor(used: Set<string>): string {
	const available = ASSET_COLOR_POOL.filter((c) => !used.has(c));
	const pool = available.length > 0 ? available : ASSET_COLOR_POOL;
	return pool[Math.floor(Math.random() * pool.length)];
}

function loadAssets(): Asset[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as Asset[]) : DEFAULT_ASSETS;
	} catch {
		return DEFAULT_ASSETS;
	}
}

export function useAssets() {
	const [assets, setAssets] = useState<Asset[]>(loadAssets);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
	}, [assets]);

	const add = (data: Omit<Asset, "color">) => {
		const used = new Set(assets.map((a) => a.color));
		setAssets((prev) => [
			...prev,
			{ ...data, color: pickAssetColor(used) },
		]);
	};

	const edit = (ticker: string, data: Omit<Asset, "color" | "ticker">) => {
		setAssets((prev) =>
			prev.map((a) => (a.ticker === ticker ? { ...a, ...data } : a)),
		);
	};

	const remove = (ticker: string) => {
		setAssets((prev) => prev.filter((a) => a.ticker !== ticker));
	};

	return { assets, add, edit, remove };
}
