import {
    Annotation,
    StateGraph,
    START,
    END,
} from "@langchain/langgraph";

import { StateAnnotation } from "./state";

import { financeNode } from "./nodes/financeNode";
import { newsNode } from "./nodes/newsNode";
import { analysisNode } from "./nodes/analysisNode";

export const investmentGraph = new StateGraph(
    StateAnnotation
)
.addNode("financeNode", financeNode)
.addNode("newsNode", newsNode)
.addNode("analysisNode", analysisNode)

.addEdge(START, "financeNode")
.addEdge("financeNode", "newsNode")
.addEdge("newsNode", "analysisNode")
.addEdge("analysisNode", END)

    .compile();