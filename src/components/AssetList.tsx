const assets = [
	{ ticker: "AAPL", name: "Apple Inc.", ret: 12.4, color: "bg-aapl" },
	{ ticker: "MSFT", name: "Microsoft Corp.", ret: 14.1, color: "bg-msft" },
	{ ticker: "TSLA", name: "Tesla Inc.", ret: 22.3, color: "bg-tsla" },
	{ ticker: "GOOGL", name: "Alphabet Inc.", ret: 11.8, color: "bg-googl" },
	{ ticker: "AMZN", name: "Amazon.com Inc.", ret: 13.6, color: "bg-amzn" },
	{ ticker: "NVDA", name: "Nvidia Corp.", ret: 28.4, color: "bg-nvda" },
];

const MAX_RET = 28.4;

export default function AssetList() {
	return (
		<div className="card flex flex-col">
			<p className="text-[13px] font-semibold uppercase text-gray-900 mb-3">
				Available assets
			</p>

			{assets.map((a, i) => (
				<div
					key={a.ticker}
					className={`flex items-center gap-3 py-2.5 ${
						i < assets.length - 1 ? "border-b border-gray-100" : ""
					}`}
				>
					{/* Pastille couleur */}
					<span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${a.color}`} />

					{/* Ticker + nom */}
					<div className="flex flex-col flex-1 min-w-0">
						<span className="font-mono text-[12px] font-semibold text-gray-900 leading-none">
							{a.ticker}
						</span>
						<span className="text-[11px] text-gray-600 leading-none mt-0.5">
							{a.name}
						</span>
					</div>

					{/* Barre de rendement */}
					<div className="flex-1 h-0.75 bg-gray-100 rounded-full overflow-hidden">
						<div
							className={`h-full rounded-full ${a.color}`}
							style={{ width: `${(a.ret / MAX_RET) * 100}%` }}
						/>
					</div>

					{/* Valeur */}
					<span
						className="font-mono text-[12px] font-medium shrink-0"
						style={{ color: `var(--color-${a.ticker.toLowerCase()})` }}
					>
						+{a.ret}%
					</span>
				</div>
			))}
		</div>
	);
}
