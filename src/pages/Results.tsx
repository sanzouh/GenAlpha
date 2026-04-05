import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { Portfolio, GAParams } from "@/lib/geneticAlgorithm";

interface ResultsState {
	paretoFront: Portfolio[];
	best: Portfolio;
	params: GAParams;
}

export default function Results() {
	const { state } = useLocation();
	const navigate = useNavigate();
	const { paretoFront, best, params } = state as ResultsState;

	return (
		<div className="min-h-screen bg-base text-gray-900 p-6">
			{/* Back */}
			<button
				onClick={() => navigate("/")}
				className="flex items-center gap-2 text-[13px] text-gray-600
                   hover:text-gray-900 transition-colors mb-6"
			>
				<ArrowLeft size={15} />
				Back to Dashboard
			</button>

			{/* Placeholder — on remplit génération par génération */}
			<p className="text-gray-400 font-mono text-sm">
				{paretoFront.length} solutions — Results page coming next
			</p>
		</div>
	);
}
