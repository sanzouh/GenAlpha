import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/lib/geneticAlgorithm";

interface AssetTableProps {
	assets: Asset[];
	onEdit: (asset: Asset) => void;
	onDelete: (asset: Asset) => void;
}

export default function AssetTable({
	assets,
	onEdit,
	onDelete,
}: AssetTableProps) {
	return (
		<div className="border border-gray-200 rounded-md overflow-hidden">
			{/* Header */}
			<div className="bg-overlay border-b border-gray-200 px-3 py-2">
				<div className="grid grid-cols-4 gap-2 text-[10px] font-medium text-gray-600 uppercase tracking-wider">
					<span>Ticker</span>
					<span>Return</span>
					<span>Vol</span>
					<span></span>
				</div>
			</div>

			{/* Rows */}
			<div className="max-h-40 overflow-y-auto">
				{assets.map((asset) => (
					<div
						key={asset.ticker}
						className="border-b border-gray-100 last:border-b-0 px-3 py-2 hover:bg-overlay transition-colors"
					>
						<div className="grid grid-cols-4 gap-2 items-center">
							<div className="flex items-center gap-2">
								<span
									className={`w-2 h-2 rounded-full shrink-0 ${asset.color}`}
								/>
								<span className="font-mono text-[12px] font-semibold text-gray-900">
									{asset.ticker}
								</span>
							</div>

							<span className="font-mono text-[11px] text-green-400">
								+{asset.expectedReturn.toFixed(1)}%
							</span>

							<span className="font-mono text-[11px] text-red-400">
								{asset.volatility.toFixed(1)}%
							</span>

							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="sm"
									className="h-6 w-6 p-0 hover:bg-blue-100/10"
									onClick={() => onEdit(asset)}
								>
									<Edit size={11} className="text-blue-400" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="h-6 w-6 p-0 hover:bg-red-100/10"
									onClick={() => onDelete(asset)}
								>
									<Trash2 size={11} className="text-red-400" />
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
