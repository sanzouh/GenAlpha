import { useEffect } from "react";
import Topbar from "./components/Topbar";
import ParamPanel from "./components/ParamPanel";
import AssetList from "./components/AssetList";
import LaunchButton from "./components/LaunchButton";
import MetricsBar from "./components/MetricsBar";
import ProgressBar from "./components/ProgressBar";
import ConvergenceChart from "./components/ConvergenceChart";
import ParetoChart from "./components/ParetoChart";
import { useGeneticAlgorithm } from "./hook/useGeneticAlgorithm";

export default function App() {
	const {
		params,
		updateParam,
		start,
		stop,
		running,
		generation,
		best,
		population,
		paretoFront,
		fitnessHistory,
	} = useGeneticAlgorithm();

	useEffect(() => {
		document.documentElement.classList.add("dark");
	}, []);

	return (
		<div className="h-screen flex flex-col bg-base text-gray-900 overflow-hidden">
			<Topbar />

			<div className="flex flex-1 gap-4 p-4 overflow-hidden">
				{/* Colonne gauche */}
				<aside className="w-70 shrink-0 flex flex-col gap-3 overflow-y-auto">
					<ParamPanel values={params} onChange={updateParam} />
					<AssetList />
					<LaunchButton running={running} onLaunch={running ? stop : start} />
				</aside>

				{/* Colonne droite — placeholder */}
				<main className="flex-1 flex flex-col gap-3 overflow-hidden">
					<MetricsBar
						expectedReturn={best?.expectedReturn ?? null}
						volatility={best?.volatility ?? null}
						sharpe={best?.sharpe ?? null}
						generation={generation}
						maxGenerations={params.generations}
					/>
					<ProgressBar
						generation={generation}
						maxGenerations={params.generations}
						populationSize={params.populationSize}
						crossover={params.crossoverRate}
						mutation={params.mutationRate}
					/>
					<div className="flex flex-1 gap-3 overflow-hidden">
						<ConvergenceChart data={fitnessHistory} />
						<ParetoChart population={population} paretoFront={paretoFront} />
					</div>
				</main>
			</div>
		</div>
	);
}
