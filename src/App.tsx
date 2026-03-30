import "./App.css";

function App() {
	return (
		<>
			<div className="grid grid-cols-4 min-h-screen">
				{/* Sidebar */}
				<aside className="card col-span-1 p-4 border-r">
					<h1 className="text-lg font-semibold">GenAlpha</h1>
				</aside>

				{/* Main */}
				<main className="col-span-3 p-6 space-y-4">
					{/* Metrics */}
					<div className="grid grid-cols-4 gap-4">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="card p-4 rounded-xl border">
								Metric
							</div>
						))}
					</div>

					{/* Charts */}
					<div className="grid grid-cols-2 gap-4">
						<div className="chart">Chart</div>
						<div className="chart">Chart</div>
					</div>
				</main>
			</div>
		</>
	);
}

export default App;
