import http from "./http";
import { DEMO_MODE, mockQuestions } from "./mockData";

const normalizeQuestion = (q) => ({
    ...q,
    description: q.description != null ? q.description : q.prompt,
});

export const getQuestions = () => {
    if (DEMO_MODE) return Promise.resolve({ data: mockQuestions });
    return http
        .get("/questions")
        .then((res) => ({...res, data: (res.data || []).map(normalizeQuestion) }));
};

export const getQuestion = (id) => {
    if (DEMO_MODE) {
        const q = mockQuestions.find((item) => item.id === Number(id));
        return Promise.resolve({ data: q });
    }
    return http
        .get(`/questions/${id}`)
        .then((res) => ({...res, data: normalizeQuestion(res.data) }));
};

export const createQuestion = (data) => {
    if (DEMO_MODE) return Promise.resolve({ data: {...data, id: Date.now() } });
    return http.post("/questions", {
        title: data.title,
        prompt: data.description,
        reference_answer: data.reference_answer,
        max_score: data.max_score,
    });
};

export const suggestQuestionDraft = (data) => {
    if (DEMO_MODE) {
        const topic = (data.topic || "General Topic").trim();
        const titleHint =
            typeof data.title_hint === "string" ? data.title_hint.trim() : "";

        return Promise.resolve({
            data: {
                title: titleHint || `${topic}: Applied Understanding`,
                prompt: `Describe '${topic}' clearly. Include definition, key concepts, and one practical example.`,
                reference_answer: `A high-quality answer defines ${topic}, explains key concepts accurately, and includes one realistic example with clear reasoning.`,
                max_score: data.max_score != null ? data.max_score : 5,
            },
        });
    }

    return http.post("/questions/ai-suggest", {
        topic: data.topic,
        difficulty: data.difficulty,
        max_score: data.max_score,
        title_hint: data.title_hint,
    });
};