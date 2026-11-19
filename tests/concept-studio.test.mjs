import test from "node:test";
import assert from "node:assert/strict";
import { curateConcepts } from "../scripts/concept-studio.mjs";

const sample = {
  collection_title: "Test collection",
  creative_guardrails: ["No copying"],
  concepts: [
    { id:"a", working_title:"A", core_question:"Q1", emotional_tension:"T1", visual_metaphor:"A silver radio in a desert", composition:"Wide shot", material_language:"Metal and sand", palette:["silver"], narrative:"A radio waits.", distinctiveness_rule:"No eyes." },
    { id:"b", working_title:"B", core_question:"Q2", emotional_tension:"T2", visual_metaphor:"A folded paper map floating at sea", composition:"Top down", material_language:"Paper and water", palette:["blue"], narrative:"A map remembers.", distinctiveness_rule:"No radio." }
  ]
};

test("concept studio prepares distinct original briefs", () => {
  const result = curateConcepts(sample);
  assert.equal(result.issues.length, 0);
  assert.equal(result.briefs.length, 2);
  assert.match(result.briefs[0].generation_prompt, /No text, lettering, logo/);
  assert.match(result.briefs[1].audience_hypothesis, /Hypothesis only/);
});

test("concept studio flags duplicate visual metaphors and incomplete briefs", () => {
  const config = structuredClone(sample);
  config.concepts[1].visual_metaphor = config.concepts[0].visual_metaphor;
  config.concepts[1].composition = "";
  const result = curateConcepts(config);
  assert.ok(result.issues.some(x => x.includes("repeats the visual metaphor")));
  assert.ok(result.issues.some(x => x.includes("composition is required")));
});
