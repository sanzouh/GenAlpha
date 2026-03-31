import { useEffect, useState } from "react";
import Topbar from "./components/Topbar";
import ParamPanel from "./components/ParamPanel";
import AssetList from "./components/AssetList";
import LaunchButton from "./components/LaunchButton";

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
					<div className="card h-16 flex items-center">
						<span className="text-gray-600 text-sm">Metrics — commit 6</span>
					</div>
					<div className="card h-16 flex items-center">
						<span className="text-gray-600 text-sm">Progress — commit 7</span>
					</div>
					<div className="flex flex-1 gap-3 overflow-hidden">
						<div className="card flex-1 flex items-center justify-center">
							<span className="text-gray-600 text-sm">
								Convergence — commit 8
							</span>
						</div>
						<div className="card flex-1 flex items-center justify-center">
							<span className="text-gray-600 text-sm">Pareto — commit 8</span>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
