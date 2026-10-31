import { WRITING_SKILL_TAGS, WRITING_TASK_CONFIG } from "../config/goetheB1Writing";

const PLACEHOLDER = /\b(todo|placeholder|lorem ipsum|tbd)\b/i;

export const validateWritingForms = (forms, taskBank) => {
  const errors = [];
  const formIds = new Set();
  const completeTaskIds = new Set();
  const prompts = new Set();
  forms.forEach((form) => {
    if (formIds.has(form.id)) errors.push(`Duplicate form id: ${form.id}`);
    formIds.add(form.id);
    if (form.module !== "writing" || form.tasks?.length !== 3) errors.push(`${form.id}: expected 3 Writing tasks`);
    WRITING_TASK_CONFIG.forEach((expected, index) => {
      const current = form.tasks?.[index];
      if (!current || current.part !== expected.number || current.taskType !== expected.taskType) errors.push(`${form.id}: invalid task ${expected.number}`);
      if (current?.approximateWordTarget !== expected.approximateWordTarget) errors.push(`${current?.id}: invalid word target`);
      if (!current?.bulletPoints?.length || !current?.checklist?.length) errors.push(`${current?.id}: missing task support`);
      if (current?.sourceType !== "original-exam-task") errors.push(`${current?.id}: non-original source type`);
      if (completeTaskIds.has(current?.id)) errors.push(`Duplicate complete-form task: ${current?.id}`);
      completeTaskIds.add(current?.id);
      if (prompts.has(`${current?.scenario}|${current?.prompt}`)) errors.push(`Duplicate prompt: ${current?.id}`);
      prompts.add(`${current?.scenario}|${current?.prompt}`);
    });
  });
  const bankTasks = Object.values(taskBank).flat();
  const bankIds = new Set();
  bankTasks.forEach((current) => {
    if (bankIds.has(current.id)) errors.push(`Duplicate bank task id: ${current.id}`);
    bankIds.add(current.id);
    if (PLACEHOLDER.test(`${current.scenario} ${current.prompt}`)) errors.push(`${current.id}: placeholder content`);
    if (!current.skillTags?.every((tag) => WRITING_SKILL_TAGS.includes(tag))) errors.push(`${current.id}: invalid skill tag`);
  });
  return { valid: errors.length === 0, errors, formCount: forms.length, completeTaskCount: completeTaskIds.size, promptBankSize: bankTasks.length };
};
