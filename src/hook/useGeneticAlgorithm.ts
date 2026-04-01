import { useState, useRef, useCallback } from "react";
import { runGeneticAlgorithm } from "../lib/geneticAlgorithm";
import type {
	GAParams,
	Portfolio /*, GAResult */,
} from "../lib/geneticAlgorithm";

// ── Types ──
interface GAState {
	running: boolean;
	progress: number;
	generation: number;
	best: Portfolio | null;
	population: Portfolio[];
	paretoFront: Portfolio[];
	fitnessHistory: { gen: number; sharpe: number }[];
}

const INITIAL_STATE: GAState = {
	running: false,
	progress: 0,
	generation: 0,
	best: null,
	population: [],
	paretoFront: [],
	fitnessHistory: [],
};

const DEFAULT_PARAMS: GAParams = {
	populationSize: 80,
	generations: 60,
	crossoverRate: 75,
	mutationRate: 8,
	maxRisk: 20,
};

// ── Hook ──
export function useGeneticAlgorithm() {
	const [params, setParams] = useState<GAParams>(DEFAULT_PARAMS);
	const [state, setState] = useState<GAState>(INITIAL_STATE);
	const abortRef = useRef(false);

	const updateParam = useCallback(
		/*<K extends...>: Typage TS, garantit que la clé et la valeur sont toujours cohérentes :
        typescriptupdateParam("populationSize", 80)  // number
        updateParam("populationSize", "80") // TS signale l'erreur
        updateParam("inexistant", 80)       // TS signale l'erreur */
		<K extends keyof GAParams>(key: K, value: GAParams[K]) => {
			setParams((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const reset = useCallback(() => {
		setState(INITIAL_STATE);
	}, []);

	const start = useCallback(() => {
		if (state.running) return;

		abortRef.current = false;
		setState({ ...INITIAL_STATE, running: true });

		const generator = runGeneticAlgorithm(params);

		const tick = async () => {
			if (abortRef.current) {
				setState((prev) => ({ ...prev, running: false }));
				return;
			}

			const { value, done } = await generator.next();

			if (done || !value) {
				setState((prev) => ({ ...prev, running: false }));
				return;
			}

			setState((prev) => ({
				...prev,
				generation: value.generation,
				progress: value.progress,
				best: value.best,
				population: value.population,
				paretoFront: value.paretoFront,
				fitnessHistory: [
					...prev.fitnessHistory,
					{ gen: value.generation, sharpe: value.best.sharpe },
				],
			}));

			setTimeout(tick, 0);
		};

		tick();
	}, [params, state.running]);

	const stop = useCallback(() => {
		abortRef.current = true;
	}, []);

	return {
		params,
		updateParam,
		reset,
		start,
		stop,
		...state,
	};
}
