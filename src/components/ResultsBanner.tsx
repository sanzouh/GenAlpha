import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsBannerProps {
	paretoSize: number;
}

export default function ResultsBanner({ paretoSize }: ResultsBannerProps) {
	return (
		<div className="card flex items-center justify-between bg-linear-to-r from-green-950/20 to-emerald-950/20 border border-green-500/30">
			<p className="font-mono text-[12px] text-green-400">
				<span className="text-green-500">✓</span> {paretoSize} solutions found
			</p>
			<Button
				asChild
				className="h-7 px-3 text-[12px] font-semibold gap-1 bg-green-500 hover:bg-green-600 text-white"
			>
				<a href="#">
					View Results
					<ChevronRight size={14} />
				</a>
			</Button>
		</div>
	);
}
