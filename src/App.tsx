import Topbar from "./components/Topbar";
import "./App.css";

function App() {
	return (
		<>
			<div className="h-screen flex flex-col bg-base text-gray-900 overflow-hidden">
				<Topbar />

				<div className="flex flex-1 gap-4 p-4 overflow-hidden">
					{/* Colonne gauche — fixe 280px */}
					<aside className="w-70 shrink-0 flex flex-col gap-3 overflow-y-auto">
						<div className="h-48 bg-surface">Params</div>
						<div className="h-48 bg-surface">Assets</div>
						<div className="h-12 bg-surface">CTA</div>
					</aside>

					{/* Colonne droite — remplit le reste */}
					<main className="flex-1 flex flex-col gap-3 overflow-hidden">
						<div className="h-16 bg-surface">Metrics</div>
						<div className="h-16 bg-surface">Progress</div>
						<div className="flex flex-1 gap-3 overflow-hidden">
							<div className="flex-1 bg-surface">Convergence</div>
							<div className="flex-1 bg-surface">Pareto</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
}

export default App;
