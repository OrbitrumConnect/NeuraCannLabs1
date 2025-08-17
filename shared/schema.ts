import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabela de usuários (comum e profissional da saúde)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  username: text("username"), // Nome de usuário para login
  role: text("role").default("paciente"), // admin, medico, paciente
  plan: text("plan").default("free"), // free, premium, admin
  
  // Campos específicos para profissionais da saúde
  crm: text("crm"), // Registro profissional (CRM, CRF, etc.)
  crmState: text("crm_state"), // Estado do CRM
  specialty: text("specialty"), // Especialidade médica
  phone: text("phone"), // Telefone profissional
  
  // Campos comuns
  cpf: text("cpf"), // CPF para brasileiros
  birthDate: timestamp("birth_date"), // Data de nascimento
  gender: text("gender"), // Gênero
  addressData: text("address_data"), // Endereço completo em JSON
  
  // Dados médicos (para pacientes) - usando TEXT[] array
  medicalConditions: text("medical_conditions").array(), // Condições médicas atuais
  medications: text("medications").array(), // Medicações em uso
  allergies: text("allergies").array(), // Alergias conhecidas
  
  // Configurações de conta
  isActive: integer("is_active").default(1), // 1 = ativo, 0 = inativo
  emailVerified: integer("email_verified").default(0), // 1 = verificado, 0 = não verificado
  termsAccepted: integer("terms_accepted").default(0), // 1 = aceito, 0 = não aceito
  privacyAccepted: integer("privacy_accepted").default(0), // 1 = aceito, 0 = não aceito
  
  // Dados extras em JSON flexível
  profileData: text("profile_data"), // JSON string
  
  // Sistema de saudações de voz
  voiceGreetingsEnabled: integer("voice_greetings_enabled").default(1), // 1 = enabled, 0 = disabled
  lastLoginGreeting: timestamp("last_login_greeting"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Sistema de Aprendizado Contínuo - Conversas Armazenadas
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(), // ID da sessão de conversa
  userId: text("user_id"), // ID do usuário (opcional, pode ser anônimo)
  messages: text("messages").notNull(), // JSON das mensagens da conversa
  context: text("context"), // Contexto detectado (greeting, medical_deep, etc.)
  satisfactionRating: integer("satisfaction_rating"), // 1-5 estrelas
  feedback: text("feedback"), // Feedback do usuário sobre a conversa
  medicalTopics: text("medical_topics"), // Array JSON dos tópicos médicos discutidos
  isSuccessful: integer("is_successful").default(0), // 1 se conversa foi bem sucedida
  duration: integer("duration"), // Duração em segundos
  createdAt: timestamp("created_at").defaultNow(),
});

// Base de Conhecimento Dinâmica - Padrões de Aprendizado
export const learningPatterns = pgTable("learning_patterns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pattern: text("pattern").notNull(), // Padrão detectado (ex: "ansiedade + insônia")
  frequency: integer("frequency").default(1), // Quantas vezes apareceu
  successRate: integer("success_rate").default(0), // Taxa de sucesso (0-100%)
  bestResponse: text("best_response"), // Melhor resposta identificada
  contextType: text("context_type"), // Tipo de contexto onde funciona melhor
  medicalCategory: text("medical_category"), // Categoria médica
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insights de Melhoria Contínua
export const aiInsights = pgTable("ai_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  insight: text("insight").notNull(), // Insight descoberto
  category: text("category").notNull(), // conversational, medical, technical
  confidence: integer("confidence").notNull(), // 0-100% confiança
  source: text("source").notNull(), // De onde veio (conversations, feedback, etc.)
  implemented: integer("implemented").default(0), // Se foi implementado
  impact: text("impact"), // Impacto esperado/observado
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

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertLearningPatternSchema = createInsertSchema(learningPatterns).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
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
  // Campos adicionais para compatibilidade com o código
  content: text("content"), // Conteúdo do estudo
  wordCount: integer("word_count"), // Número de palavras
  confidence: integer("confidence"), // Confiança da IA (0-100)
  topic: text("topic"), // Tópico do estudo
  keywords: text("keywords").array(), // Palavras-chave
  studyType: text("study_type"), // Tipo de estudo
  maxWords: integer("max_words"), // Máximo de palavras
  relatedDataSources: text("related_data_sources"), // JSON com fontes de dados
  medicalInsights: text("medical_insights"), // Insights médicos
  recommendations: text("recommendations"), // Recomendações
  needsReview: integer("needs_review").default(0), // Precisa de revisão
  generatedBy: text("generated_by"), // Quem gerou
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStudySubmissionSchema = createInsertSchema(studySubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Sistema Educacional - Cursos
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Básico, Avançado, Especialização
  level: text("level").notNull(), // iniciante, intermediario, avancado
  duration: integer("duration").notNull(), // duração em minutos
  coverImage: text("cover_image"),
  isActive: integer("is_active").default(1),
  order: integer("order").default(0), // ordem de exibição
  prerequisites: text("prerequisites").array(), // IDs de cursos pré-requisito
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Módulos dos cursos
export const courseModules = pgTable("course_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content").notNull(), // Conteúdo em markdown/HTML
  videoUrl: text("video_url"),
  duration: integer("duration").notNull(), // duração em minutos
  order: integer("order").notNull(),
  isRequired: integer("is_required").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quizzes dos módulos
export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").references(() => courseModules.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  passingScore: integer("passing_score").default(70), // % para passar
  maxAttempts: integer("max_attempts").default(3),
  timeLimit: integer("time_limit"), // tempo limite em minutos
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Questões dos quizzes
export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").references(() => quizzes.id).notNull(),
  question: text("question").notNull(),
  type: text("type").notNull(), // multiple_choice, true_false, open_text
  options: text("options").array(), // opções para multiple choice
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"), // explicação da resposta
  difficulty: text("difficulty").default("medium"), // easy, medium, hard
  order: integer("order").notNull(),
  points: integer("points").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Progresso dos usuários nos cursos
export const userCourseProgress = pgTable("user_course_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  status: text("status").default("enrolled"), // enrolled, in_progress, completed, dropped
  progressPercentage: integer("progress_percentage").default(0),
  totalTimeSpent: integer("total_time_spent").default(0), // tempo em minutos
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Progresso dos usuários nos módulos
export const userModuleProgress = pgTable("user_module_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  moduleId: varchar("module_id").references(() => courseModules.id).notNull(),
  courseProgressId: varchar("course_progress_id").references(() => userCourseProgress.id).notNull(),
  status: text("status").default("not_started"), // not_started, in_progress, completed
  timeSpent: integer("time_spent").default(0), // tempo em minutos
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tentativas de quiz dos usuários
export const userQuizAttempts = pgTable("user_quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  quizId: varchar("quiz_id").references(() => quizzes.id).notNull(),
  moduleProgressId: varchar("module_progress_id").references(() => userModuleProgress.id).notNull(),
  attemptNumber: integer("attempt_number").notNull(),
  score: integer("score").notNull(), // pontuação obtida
  maxScore: integer("max_score").notNull(), // pontuação máxima possível
  percentage: integer("percentage").notNull(), // percentual de acertos
  timeSpent: integer("time_spent").notNull(), // tempo gasto em segundos
  passed: integer("passed").notNull(), // 1 = passou, 0 = não passou
  answers: text("answers").notNull(), // JSON com respostas do usuário
  aiAnalysis: text("ai_analysis"), // análise da IA sobre o desempenho
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Certificados emitidos
export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  certificateNumber: text("certificate_number").notNull().unique(),
  finalScore: integer("final_score").notNull(), // pontuação final do curso
  completionTime: integer("completion_time").notNull(), // tempo total em minutos
  pdfUrl: text("pdf_url"), // URL do certificado em PDF
  isValid: integer("is_valid").default(1), // certificado válido
  validUntil: timestamp("valid_until"), // validade do certificado
  issuedAt: timestamp("issued_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics do sistema educacional
export const educationAnalytics = pgTable("education_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  courseId: varchar("course_id").references(() => courses.id),
  moduleId: varchar("module_id").references(() => courseModules.id),
  quizId: varchar("quiz_id").references(() => quizzes.id),
  eventType: text("event_type").notNull(), // course_start, module_complete, quiz_attempt, etc.
  eventData: text("event_data"), // JSON com dados específicos do evento
  sessionId: text("session_id"),
  deviceInfo: text("device_info"), // info do dispositivo
  timeSpent: integer("time_spent"), // tempo gasto na ação
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas para o sistema educacional
export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertUserCourseProgressSchema = createInsertSchema(userCourseProgress).omit({
  id: true,
  createdAt: true,
});

export const insertUserModuleProgressSchema = createInsertSchema(userModuleProgress).omit({
  id: true,
  createdAt: true,
});

export const insertUserQuizAttemptSchema = createInsertSchema(userQuizAttempts).omit({
  id: true,
  createdAt: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  createdAt: true,
});

export const insertEducationAnalyticsSchema = createInsertSchema(educationAnalytics).omit({
  id: true,
  createdAt: true,
});

// Types para o sistema educacional
export type Course = typeof courses.$inferSelect;
export type CourseModule = typeof courseModules.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type UserCourseProgress = typeof userCourseProgress.$inferSelect;
export type UserModuleProgress = typeof userModuleProgress.$inferSelect;
export type UserQuizAttempt = typeof userQuizAttempts.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type EducationAnalytics = typeof educationAnalytics.$inferSelect;

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

// Tipos para Sistema de Aprendizado Contínuo
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type LearningPattern = typeof learningPatterns.$inferSelect;
export type InsertLearningPattern = z.infer<typeof insertLearningPatternSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;

// Encaminhamento de Pacientes entre Especialistas
export const patientReferrals = pgTable("patient_referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(),
  fromDoctorId: varchar("from_doctor_id").notNull(),
  toDoctorId: varchar("to_doctor_id").notNull(),
  specialty: varchar("specialty").notNull(),
  priority: varchar("priority").notNull().default("normal"),
  reason: text("reason").notNull(),
  clinicalHistory: text("clinical_history"),
  anamnesis: text("anamnesis"),
  examResults: text("exam_results"),
  status: varchar("status").notNull().default("pending"),
  scheduledDate: timestamp("scheduled_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Anamnese Digital em Tempo Real
export const digitalAnamnesis = pgTable("digital_anamnesis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(),
  doctorId: varchar("doctor_id").notNull(),
  sessionId: varchar("session_id").notNull(),
  templateId: varchar("template_id"),
  anamnesisData: text("anamnesis_data").notNull(),
  symptoms: text("symptoms"),
  medications: text("medications"),
  allergies: text("allergies"),
  familyHistory: text("family_history"),
  socialHistory: text("social_history"),
  vitalSigns: text("vital_signs"),
  isComplete: integer("is_complete").default(0),
  aiSuggestions: text("ai_suggestions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Integração com Laboratórios
export const labIntegrations = pgTable("lab_integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  labName: varchar("lab_name").notNull(),
  labCode: varchar("lab_code").notNull(),
  apiEndpoint: varchar("api_endpoint"),
  apiKey: varchar("api_key"),
  isActive: integer("is_active").default(1),
  supportedExams: text("supported_exams"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const labResults = pgTable("lab_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(),
  labId: varchar("lab_id").notNull(),
  doctorId: varchar("doctor_id"),
  examType: varchar("exam_type").notNull(),
  examCode: varchar("exam_code").notNull(),
  resultData: text("result_data").notNull(),
  referenceValues: text("reference_values"),
  interpretation: text("interpretation"),
  aiAnalysis: text("ai_analysis"),
  status: varchar("status").notNull().default("received"),
  examDate: timestamp("exam_date").notNull(),
  receivedAt: timestamp("received_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Equipe Multidisciplinar
export const medicalTeam = pgTable("medical_team", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: varchar("role").notNull(),
  specialty: varchar("specialty"),
  crm: varchar("crm"),
  license: varchar("license"),
  yearsExperience: integer("years_experience"),
  expertise: text("expertise"),
  isActive: integer("is_active").default(1),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const advisoryCommittee = pgTable("advisory_committee", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull(),
  position: varchar("position").notNull(),
  department: varchar("department"),
  responsibilities: text("responsibilities"),
  appointedAt: timestamp("appointed_at").defaultNow(),
  termEndsAt: timestamp("term_ends_at"),
});

// Compliance e Auditoria
export const complianceAudits = pgTable("compliance_audits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auditType: varchar("audit_type").notNull(),
  auditorName: varchar("auditor_name").notNull(),
  auditorCredentials: varchar("auditor_credentials"),
  scope: text("scope"),
  findings: text("findings"),
  recommendations: text("recommendations"),
  status: varchar("status").notNull().default("in_progress"),
  auditDate: timestamp("audit_date").notNull(),
  reportPath: varchar("report_path"),
  certificatePath: varchar("certificate_path"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PatientReferral = typeof patientReferrals.$inferSelect;
export type UpsertPatientReferral = typeof patientReferrals.$inferInsert;
export type DigitalAnamnesis = typeof digitalAnamnesis.$inferSelect;
export type UpsertDigitalAnamnesis = typeof digitalAnamnesis.$inferInsert;
export type LabIntegration = typeof labIntegrations.$inferSelect;
export type LabResult = typeof labResults.$inferSelect;
export type MedicalTeamMember = typeof medicalTeam.$inferSelect;
export type ComplianceAudit = typeof complianceAudits.$inferSelect;
