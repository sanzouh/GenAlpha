import { Slider } from "@/components/ui/slider";
import type { GAParams } from "@/lib/geneticAlgorithm";

type NumericGAParamKey = {
	[K in keyof GAParams]: GAParams[K] extends number ? K : never;
}[keyof GAParams];

interface ParamConfig {
	key: NumericGAParamKey;
	label: string;
	min: number;
	max: number;
	step: number;
	unit?: string;
	trackClassName?: string;
}

const PARAM_CONFIG: ParamConfig[] = [
	{
		key: "populationSize",
		label: "Population",
		min: 20,
		max: 200,
		step: 10,
		trackClassName: "bg-green-500",
	},
	{
		key: "generations",
		label: "Generations",
		min: 20,
		max: 100,
		step: 10,
		trackClassName: "bg-green-500",
	},
	{
		key: "crossoverRate",
		label: "Crossover",
		min: 50,
		max: 95,
		step: 5,
		unit: "%",
		trackClassName: "bg-green-500",
	},
	{
		key: "mutationRate",
		label: "Mutation",
		min: 1,
		max: 20,
		step: 1,
		unit: "%",
		trackClassName: "bg-amber-500",
	},
	{
		key: "maxRisk",
		label: "Max Risk",
		min: 5,
		max: 40,
		step: 1,
		unit: "%",
		trackClassName: "bg-red-500",
	},
];

interface ParamPanelProps {
	values: GAParams;
	onChange: <K extends keyof GAParams>(key: K, value: GAParams[K]) => void;
}

const VOLATILITY_MODES = ["markowitz", "linear"] as const;

export default function ParamPanel({ values, onChange }: ParamPanelProps) {
	return (
		<div className="card flex flex-col gap-1">
			{/* Header */}
			<p className="text-[13px] font-semibold uppercase text-gray-900">
				Algorithm parameters
			</p>

			{PARAM_CONFIG.map((p, i) => (
				<div
					key={p.key}
					className={`flex flex-col gap-2 py-2.5 ${
						i < PARAM_CONFIG.length - 1 ? "border-b border-gray-100" : ""
					}`}
				>
					{/* Label + valeur */}
					<div className="flex items-center justify-between">
						<span className="text-[13px] text-gray-600">{p.label}</span>
						<span className="font-mono text-[13px] font-medium text-gray-900">
							{values[p.key]}
							{p.unit ?? ""}
						</span>
					</div>

					{/* Slider shadcn customisé */}
					<Slider
						min={p.min}
						max={p.max}
						step={p.step}
						value={[values[p.key]]}
						onValueChange={([v]) => onChange(p.key, v)}
						trackClassName={p.trackClassName}
						className="w-full"
					/>
				</div>
			))}

			<div className="flex flex-col gap-2 py-2.5 border-b border-gray-100">
				<div className="flex items-center justify-between">
					<span className="text-[13px] text-gray-600">Volatility model</span>
					<select
						value={values.volatilityMode}
						onChange={(e) =>
							onChange("volatilityMode", e.target.value as GAParams["volatilityMode"])
						}
						className="rounded border border-gray-300 px-2 py-1 text-sm"
					>
						{VOLATILITY_MODES.map((mode) => (
							<option key={mode} value={mode}>
								{mode}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Explainer */}
			<div
				className="mt-3 rounded-sm border border-purple-300/30
                      bg-purple-100 px-3 py-2.5"
			>
				<p className="text-[11px] text-gray-600 italic leading-relaxed">
					High crossover → rapid combination of effective solutions. High
					mutation → exploration but risk of divergence.
				</p>
			</div>
		</div>
	);
}
