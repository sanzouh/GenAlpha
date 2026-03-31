import TickerPill from "./TickerPill";

const tickers = [
	{ symbol: "AAPL", value: "+1.24%", positive: true },
	{ symbol: "MSFT", value: "+0.83%", positive: true },
	{ symbol: "TSLA", value: "−2.10%", positive: false },
	{ symbol: "NVDA", value: "+3.42%", positive: true },
	{ symbol: "GOOGL", value: "+0.51%", positive: true },
];

export default function Topbar() {
	return (
		<header
			className="h-13 bg-surface border-b
                       border-gray-200 flex items-center
                       justify-between px-6 shrink-0"
		>
			{/* Logo */}
			<div className="flex items-center gap-2.5">
				<span
					className="w-2 h-2 rounded-full bg-green-500
                         animate-pulse"
				/>
				<span className="text-[15px] font-semibold">GenAlpha</span>
				<span className="w-px h-4 bg-gray-200" />
				<span className="text-[12px] text-gray-600">
					Genetic Algorithm Optimizer
				</span>
			</div>

			{/* Tickers */}
			<div className="flex items-center gap-2">
				{tickers.map((t) => (
					<TickerPill key={t.symbol} {...t} />
				))}
			</div>

			{/* Right */}
			<div className="flex items-center gap-3">
				<span className="text-[12px] text-gray-600">Dark</span>
				<div
					className="w-8 h-8 rounded-full bg-elevated
                        border border-gray-200
                        flex items-center justify-center
                        text-[11px] text-gray-600"
				>
					JR
				</div>
			</div>
		</header>
	);
}
