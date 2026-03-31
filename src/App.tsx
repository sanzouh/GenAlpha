import { useEffect, useState } from "react";
import Topbar from "./components/Topbar";
import ParamPanel from "./components/ParamPanel";
import AssetList from "./components/AssetList";
import LaunchButton from "./components/LaunchButton";
import MetricsBar from "./components/MetricsBar";
import ProgressBar from "./components/ProgressBar";
import ConvergenceChart from "./components/ConvergenceChart";
import ParetoChart from "./components/ParetoChart";

const defaultParams: Record<string, number> = {
	Population: 80,
	Générations: 60,
	Crossover: 75,
	Mutation: 8,
	"Max Risk": 20,
};

export default function App() {
	const [params, setParams] = useState(defaultParams);
	const [running, setRunning] = useState(false);

	useEffect(() => {
		document.documentElement.classList.add("dark");
	}, []);

	const handleChange = (label: string, value: number) => {
		setParams((prev) => ({ ...prev, [label]: value }));
	};

	const handleLaunch = () => {
		setRunning(true);
		// logique GA ici plus tard
	};

	return (
		<div className="h-screen flex flex-col bg-base text-gray-900 overflow-hidden">
			<Topbar />

			<div className="flex flex-1 gap-4 p-4 overflow-hidden">
				{/* Colonne gauche */}
				<aside className="w-70 shrink-0 flex flex-col gap-3 overflow-y-auto">
					<ParamPanel values={params} onChange={handleChange} />
					<AssetList />
					<LaunchButton running={running} onLaunch={handleLaunch} />
				</aside>

				{/* Colonne droite — placeholder */}
				<main className="flex-1 flex flex-col gap-3 overflow-hidden">
					<MetricsBar
						expectedReturn={14.2}
						volatility={12.7}
						sharpe={1.02}
						generation={0}
						maxGenerations={params["Générations"]}
					/>
					<ProgressBar
						generation={0}
						maxGenerations={params["Générations"]}
						populationSize={params["Population"]}
						crossover={params["Crossover"]}
						mutation={params["Mutation"]}
					/>
					<div className="flex flex-1 gap-3 overflow-hidden">
						<ConvergenceChart data={[]} />
						<ParetoChart population={[]} paretoFront={[]} />
					</div>
				</main>
			</div>
		</div>
	);
}
