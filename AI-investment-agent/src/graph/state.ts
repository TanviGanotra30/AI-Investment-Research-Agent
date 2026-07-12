import { Annotation } from "@langchain/langgraph";

export const StateAnnotation = Annotation.Root({

    company: Annotation<string>,

    financialData: Annotation<string>,

    news: Annotation<string>,

    recommendation: Annotation<any>,

});