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

	const start = useCallback(async () => {
		if (state.running) return;

		abortRef.current = false;
		setState({ ...INITIAL_STATE, running: true });

		for await (const result of runGeneticAlgorithm(params)) {
			if (abortRef.current) break;

			setState((prev) => ({
				...prev,
				generation: result.generation,
				progress: result.progress,
				best: result.best,
				population: result.population,
				paretoFront: result.paretoFront,
				fitnessHistory: [
					...prev.fitnessHistory,
					{ gen: result.generation, sharpe: result.best.sharpe },
				],
			}));
		}

		setState((prev) => ({ ...prev, running: false }));
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
