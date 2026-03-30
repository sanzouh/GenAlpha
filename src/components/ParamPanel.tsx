import { Slider } from "@/components/ui/slider";

interface Param {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	unit?: string;
	track?: "green" | "amber" | "red";
}

const params: Param[] = [
	{
		label: "Population",
		value: 80,
		min: 20,
		max: 200,
		step: 10,
		track: "green",
	},
	{
		label: "Générations",
		value: 60,
		min: 20,
		max: 150,
		step: 10,
		track: "green",
	},
	{
		label: "Crossover",
		value: 75,
		min: 50,
		max: 95,
		step: 5,
		unit: "%",
		track: "green",
	},
	{
		label: "Mutation",
		value: 8,
		min: 1,
		max: 25,
		step: 1,
		unit: "%",
		track: "amber",
	},
	{
		label: "Max Risk",
		value: 20,
		min: 5,
		max: 40,
		step: 1,
		unit: "%",
		track: "red",
	},
];

const trackColor: Record<string, string> = {
	green: "bg-green-500",
	amber: "bg-amber-500",
	red: "bg-red-500",
};

interface ParamPanelProps {
	values: Record<string, number>;
	onChange: (label: string, value: number) => void;
}

export default function ParamPanel({ values, onChange }: ParamPanelProps) {
	return (
		<div className="card flex flex-col gap-1">
			{/* Header */}
			<p className="section-label mb-3">Algorithme génétique</p>

			{params.map((p, i) => (
				<div
					key={p.label}
					className={`flex flex-col gap-2 py-2.5 ${
						i < params.length - 1 ? "border-b border-gray-100" : ""
					}`}
				>
					{/* Label + valeur */}
					<div className="flex items-center justify-between">
						<span className="text-[13px] text-gray-600">{p.label}</span>
						<span className="font-mono text-[13px] font-medium text-gray-900">
							{values[p.label] ?? p.value}
							{p.unit ?? ""}
						</span>
					</div>

					{/* Slider shadcn customisé */}
					<div className={`slider-${p.track ?? "green"}`}>
						<Slider
							min={p.min}
							max={p.max}
							step={p.step}
							defaultValue={[p.value]}
							onValueChange={([v]) => onChange(p.label, v)}
							className="w-full"
						/>
					</div>
				</div>
			))}

			{/* Explainer */}
			<div
				className="mt-3 rounded-sm border border-purple-300/30
                      bg-purple-100 px-3 py-2.5"
			>
				<p className="text-[11px] text-gray-600 italic leading-relaxed">
					Crossover élevé → mélange rapide des bonnes solutions. Mutation élevée
					→ exploration mais risque de divergence.
				</p>
			</div>
		</div>
	);
}
