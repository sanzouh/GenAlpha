import { useState, useEffect } from "react";
import { ASSETS as DEFAULT_ASSETS } from "@/data/assets";
import type { Asset } from "@/lib/geneticAlgorithm";

const STORAGE_KEY = "genportfolio:assets";

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
		setAssets((prev) => [
			...prev,
			{ ...data, color: `bg-${data.ticker.toLowerCase()}` },
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
