My work spans **computational linguistics, multimodal studies, and cognitive science**. The through-line: using multimodal large language models to address **educational gaps, healthcare necessities, and social inequalities**, a future where linguistic technologies enhance everyday convenience and promote equity across sectors.

The tangram referential game is where this program starts, not where it ends: human tasks teach us what MLLMs are really doing; MLLM simulation teaches us what humans are really doing. Three threads carry that agenda:

### 🧩 Multimodal LLM agent communication

I build interaction-oriented agentic frameworks that let multimodal LLM agents talk to each other in visually grounded tasks, then compare their coordination behavior with human dialogue corpora. This connects agent design to classic theories of dialogue, the Interactive Alignment Model and Communication Accommodation Theory, and asks what today's agents are still missing: conversational conventions, partner-specific adaptation, and the drive to become *more efficient together*. Understanding that gap is the first step toward agents that can simulate learners, patients, and conversation partners faithfully.

### 🏮 Cultural pragmatics & evaluation

Language models can be fluent yet culturally tone-deaf — and the people that failure hurts most are the ones the technology already underserves. With collaborators I develop benchmarks for **pragmatic cultural competence** — starting from Taiwanese cultural references, social pragmatics, and cross-cultural communication — so that "culturally aligned AI" can be measured, not just claimed.

### 📚 AI-enhanced pedagogy, humans in the loop

From LLM-assisted textbook generation with expert oversight to design-thinking-driven course design, I study how AI can support customization, leveling, and feedback in language education **while keeping teachers' professional judgment in charge** — closing educational gaps instead of widening them.

---

### Dissertation spotlight

**Alignment and Accommodation: Linguistic Coordination in Multimodal LLM Agent Dyads in a Referential Communication Game**
對齊與對應：多模態 LLM 代理雙人組在指涉溝通遊戲中的語言協調

National Taiwan University, 2026 · Advisor: Shu-Kai Hsieh · DOI: [10.6342/NTU202600991](https://doi.org/10.6342/NTU202600991)

I paired GPT-5 agents in tangram referential communication games and systematically compared them with human dyads from the KTH Tangrams corpus, using an enhanced *pseudo-dyad* baseline to separate genuine interactive coordination from mere distributional similarity.

:: 0.20 vs 0.04 :: humans' shared-turn ratio for real vs pseudo dyads (p < 10⁻¹⁹) — a clean signature of interactive grounding
:: ~2.03 :: agents' flat turns-to-success — efficient from round one, but no human-like collaborative compression
:: 17× :: agents' per-round description diversity relative to humans — "high-entropy pact formation"

Humans align *because they interact*: they compress descriptions over time, build long-lived lexical cores, and invent metaphor-driven naming systems with their partners. Agents achieve near-ceiling task success through a different route — exhaustive, parallel geometric description. I frame this as the difference between **prior distributional alignment** (shared statistics over linguistic forms) and **grounded alignment** (partner-specific conceptual pacts negotiated in interaction): current MLLM agents have plenty of the former and little of the latter. The work also identifies an agent-specific failure mode, **label leakage** — interactional non-compliance under repair pressure.

**Why it matters:** the pseudo-dyad diagnostic is a practical tool for any LLM interaction evaluation; the results motivate convention memory, partner-modeling modules, and efficiency-sensitive objectives in multi-agent design; and the human–machine contrast opens a path to simulating learner interaction for language teaching, healthcare communication, and beyond.
