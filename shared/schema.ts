import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  specialty: text("specialty").notNull(),
  crm: text("crm"),
  voiceGreetingsEnabled: integer("voice_greetings_enabled").default(1), // 1 = enabled, 0 = disabled
  lastLoginGreeting: timestamp("last_login_greeting"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scientificStudies = pgTable("scientific_studies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  authors: text("authors"), // Autores do estudo
  compound: text("compound"), // CBD, THC, CBG, etc.
  indication: text("indication"), // Epilepsia, Dor crônica, etc.
  phase: text("phase"), // Fase I, II, III
  status: text("status"), // Ativo, Concluído, Em andamento
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clinicalCases = pgTable("clinical_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseNumber: text("case_number").notNull(),
  description: text("description").notNull(),
  doctorId: varchar("doctor_id").references(() => users.id),
  doctorName: text("doctor_name").notNull(),
  compound: text("compound"),
  dosage: text("dosage"),
  indication: text("indication"),
  outcome: text("outcome"), // Melhora significativa, Efeitos adversos, etc.
  severity: text("severity"), // Leve, Moderado, Grave
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  description: text("description"),
  type: text("type").notNull(), // Regulatório, Científico, Segurança, Inovação
  priority: text("priority").notNull(), // URGENTE, NOVO, NORMAL
  date: text("date").notNull(),
  isRead: integer("is_read").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertScientificStudySchema = createInsertSchema(scientificStudies).omit({
  id: true,
  createdAt: true,
});

export const insertClinicalCaseSchema = createInsertSchema(clinicalCases).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

// Tabela para coleta de dados médicos - POTÊNCIA DE DADOS
export const patientData = pgTable("patient_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  doctorId: varchar("doctor_id").references(() => users.id).notNull(),
  patientCode: text("patient_code").notNull(), // Código anônimo do paciente
  condition: text("condition").notNull(), // Condição médica (epilepsia, dor crônica, etc.)
  cannabinoid: text("cannabinoid").notNull(), // CBD, THC, CBG, etc.
  dosage: text("dosage"), // Dosagem utilizada
  administration: text("administration"), // Via de administração
  symptomBefore: integer("symptom_before").notNull(), // Sintoma antes (escala 1-10)
  symptomAfter: integer("symptom_after"), // Sintoma depois (escala 1-10)
  sideEffects: text("side_effects"), // Efeitos colaterais observados
  duration: text("duration"), // Duração do tratamento
  outcome: text("outcome"), // Resultado geral (melhora, piora, sem alteração)
  notes: text("notes"), // Observações adicionais
  isAnonymized: integer("is_anonymized").default(1), // 1 = dados anonimizados para pesquisa
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela para evolução temporal dos pacientes
export const patientEvolution = pgTable("patient_evolution", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientDataId: varchar("patient_data_id").references(() => patientData.id).notNull(),
  week: integer("week").notNull(), // Semana de tratamento
  symptomScore: integer("symptom_score").notNull(), // Pontuação sintoma (1-10)
  qualityOfLife: integer("quality_of_life"), // Qualidade de vida (1-10)
  functionalCapacity: integer("functional_capacity"), // Capacidade funcional (1-10)
  sideEffectsSeverity: integer("side_effects_severity"), // Gravidade efeitos colaterais (0-10)
  observations: text("observations"), // Observações da semana
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPatientDataSchema = createInsertSchema(patientData).omit({
  id: true,
  createdAt: true,
});

export const insertPatientEvolutionSchema = createInsertSchema(patientEvolution).omit({
  id: true,
  createdAt: true,
});

// Study submission and review system
export const studySubmissions = pgTable("study_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  originalContent: text("original_content").notNull(),
  editedContent: text("edited_content"), // User corrections
  aiAnalysis: text("ai_analysis"), // Original AI analysis
  correctedAnalysis: text("corrected_analysis"), // User corrections to AI
  submissionType: text("submission_type").notNull(), // text, voice, file
  status: text("status").default("draft"), // draft, submitted, under_review, approved, rejected, needs_revision
  reviewerNotes: text("reviewer_notes"),
  reviewerId: varchar("reviewer_id"),
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStudySubmissionSchema = createInsertSchema(studySubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ScientificStudy = typeof scientificStudies.$inferSelect;
export type InsertScientificStudy = z.infer<typeof insertScientificStudySchema>;
export type ClinicalCase = typeof clinicalCases.$inferSelect;
export type InsertClinicalCase = z.infer<typeof insertClinicalCaseSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type PatientData = typeof patientData.$inferSelect;
export type InsertPatientData = z.infer<typeof insertPatientDataSchema>;
export type PatientEvolution = typeof patientEvolution.$inferSelect;
export type InsertPatientEvolution = z.infer<typeof insertPatientEvolutionSchema>;
export type StudySubmission = typeof studySubmissions.$inferSelect;
export type InsertStudySubmission = z.infer<typeof insertStudySubmissionSchema>;
